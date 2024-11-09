import { jwtDecode } from "jwt-decode";
import io from 'socket.io-client';
class SocketManager {
  socket;
  userId;
  userRole;
  notificationListeners = new Set();

  async connect() {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const decodedToken = jwtDecode(token);
      this.userId = decodedToken?.userId;
      this.userRole = decodedToken?.role;
      
      this.socket = io('http://localhost:5000', {
        auth: {
          token,
          userId: this.userId,
          role: this.userRole
        }
      });
      
      this.socket.on('connect', () => {
        console.log('Socket connected');
        // Join role-specific and user-specific rooms
        this.socket.emit('join-rooms', {
          userId: this.userId,
          role: this.userRole
        });
      });

      this.socket.on('connected', () => {
        console.log(`Setup confirmed for ${this.userRole} ${this.userId}`);
      });

      // Set up notification listener with role-based filtering
      this.setupNotificationListener();
    } catch (error) {
      console.error('Socket connection error:', error);
    }
  }

  setupNotificationListener() {
    if (!this.socket) return;
    
    this.socket.on('notification', (notification) => {
      console.log('Received notification:', notification);
      
      // Check if the notification is meant for the current user based on role and type
      if (this.shouldReceiveNotification(notification)) {
        this.notifyListeners([notification]);
      }
    });
  }

  shouldReceiveNotification(notification) {
    // Define notification routing rules
    const routingRules = {
      'hired': { role: 'freelancer', idField: 'freelancer_id' },
      'new_proposal': { role: 'client', idField: 'client_id' },
      'new_offer': { role: 'freelancer', idField: 'freelancer_id' },
      'milestone_completed': { role: 'client', idField: 'client_id' },
      'payment_received': { role: 'freelancer', idField: 'freelancer_id' }
    };

    const rule = routingRules[notification.type];
    if (!rule) return false;

    // Check if user role matches and the ID matches
    return this.userRole === rule.role && 
           notification[rule.idField]?.toString() === this.userId?.toString();
  }

  addNotificationListener(callback) {
    this.notificationListeners.add(callback);
  }

  removeNotificationListener(callback) {
    this.notificationListeners.delete(callback);
  }

  notifyListeners(notifications) {
    this.notificationListeners.forEach(listener => listener(notifications));
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.notificationListeners.clear();
    }
  }
}

export default new SocketManager();
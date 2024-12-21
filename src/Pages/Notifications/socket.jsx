import { jwtDecode } from "jwt-decode";
import io from "socket.io-client";

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
      this.userEmail = decodedToken?.email;
      this.socket = io('http://localhost:5000', {
        auth: {
          token,
          userId: this.userId,
          role: this.userRole,
          email: this.userEmail,
          isAdmin: this.userRole === 'admin'
     
        }
      });

      this.socket.on('connect', () => {
        console.log('Socket connected');
        
        // Join role-specific and user-specific rooms
        this.socket.emit('join-rooms', {
          userId: this.userId,
          role: this.userRole,
           email: this.userEmail,
          isAdmin: this.userRole === 'admin'
        });
      });

      this.socket.on('connected', () => {
        console.log(`Setup confirmed for ${this.userRole} ${this.userId}`);
      });

      // Set up notification listener with role-based filtering
      this.setupNotificationListener();

      return this.socket;
    } catch (error) {
      console.error('Socket connection error:', error);
      throw error;
    }
  }

  
  setupNotificationListener() {
    if (!this.socket) return;

    this.socket.on('notification', (notification) => {
      console.log('Received notification:', notification);

      if (this.shouldReceiveNotification(notification)) {
        this.notifyListeners([notification]);
      }
    });
  }

  shouldReceiveNotification(notification) {
    // First check if user is admin and notification is a query
    if (this.userRole === 'admin' && notification.type === 'new_query') {
      const isForThisAdmin = notification.admin_email === this.socket.auth.email;
      console.log('Admin notification check:', {
        isForThisAdmin,
        notificationEmail: notification.admin_email,
        userEmail: this.socket.auth.email
      });
      return isForThisAdmin;
    }

    // Prevent self-notifications
    if (notification.sender_id?.toString() === this.userId?.toString()) {
      console.warn('Blocked self-notification:', notification);
      return false;
    }
  

    // Define notification routing rules
    const routingRules = {
      'hired': {
        role: 'freelancer',
        idField: 'freelancer_id'
      },
      'new_proposal': {
        role: 'client',
        idField: 'client_id'
      },
      'new_offer': {
        roles: ['freelancer', 'consultant'],
        idFields: ['freelancer_id', 'consultant_id']
      },
      'milestone_completed': {
        role: 'client',
        idField: 'client_id'
      },
      'payment_received': {
        role: 'freelancer',
        idField: 'freelancer_id'
      }
    };

    const rule = routingRules[notification.type];
    if (!rule) {
      console.warn('No routing rule for notification type:', notification.type);
      return false;
    }

    // Handle special case for 'new_offer' with multiple possible roles
    if (rule.roles) {
      const isValidRecipient = rule.roles.includes(this.userRole) &&
        rule.idFields.some(field =>
          notification[field]?.toString() === this.userId?.toString()
        );
      
      console.log('Notification validation for multi-role type:', {
        type: notification.type,
        isValidRecipient,
        currentRole: this.userRole,
        currentUserId: this.userId
      });

      return isValidRecipient;
    }

    // Standard case for other notification types
    const isValidRecipient = this.userRole === rule.role &&
      notification[rule.idField]?.toString() === this.userId?.toString();

    console.log('Notification validation:', {
      type: notification.type,
      isValidRecipient,
      currentRole: this.userRole,
      currentUserId: this.userId
    });

    return isValidRecipient;
  }
  addNotificationListener(callback) {
    this.notificationListeners.add(callback);
    return () => this.removeNotificationListener(callback);
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

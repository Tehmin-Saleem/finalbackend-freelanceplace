import io from 'socket.io-client';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const SOCKET_URL = 'http://localhost:5000';
const API_URL = 'http://localhost:5000/api';

class SocketManager {
  socket;
  userId;

  async connect() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found in localStorage');
      }

      const decodedToken = jwtDecode(token);
      this.userId = decodedToken?.userId;
      if (!this.userId) {
        throw new Error('Invalid token: userId not found');
      }

      console.log(`Decoded userId from token: ${this.userId}`);

      this.socket = io(SOCKET_URL, {
        auth: { token }
      });

      this.socket.on('connect', () => {
        console.log("SocketManager: Connected to server");
        this.socket.emit('authenticate', { token, userId: this.userId });
      });

      this.socket.on('disconnect', () => {
        console.log('SocketManager: Disconnected from server');
      });

      this.socket.on('auth_error', (error) => {
        console.error('SocketManager: Authentication error', error);
      });

      this.socket.onAny((eventName, ...args) => {
        console.log(`SocketManager: Received event "${eventName}"`, args);
      });

    } catch (error) {
      console.error('SocketManager: Error during connection setup', error);
      throw error;
    }
  }

  disconnect() {
    if (this.socket) {
      console.log('SocketManager: Disconnecting from server');
      this.socket.disconnect();
    }
  }
  onNotification(callback) {
    this.socket.on('notification', (notification) => {
      console.log(`SocketManager: Received notification`, notification);
      console.log(`SocketManager: Current user ID: ${this.userId}`);
      console.log(`SocketManager: Notification type: ${notification.type}`);
      console.log(`SocketManager: Freelancer ID in notification: ${notification.freelancer_id}`);
      console.log(`SocketManager: Client ID in notification: ${notification.client_id}`);
  
      const isRelevantNotification = 
        (notification.type === 'new_offer' && notification.freelancer_id === this.userId) ||
        (notification.type === 'new_proposal' && notification.client_id === this.userId) ||
        (notification.type === 'hired' && notification.freelancer_id === this.userId);
  
      if (isRelevantNotification) {
        console.log(`SocketManager: Processing notification for user ${this.userId}`);
        callback(notification);
      } else {
        console.log(`SocketManager: Ignoring notification (userId: ${this.userId}, type: ${notification.type})`);
      }
    });
  }

}
export default new SocketManager();
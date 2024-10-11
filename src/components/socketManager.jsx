import io from 'socket.io-client';

class SocketManager {
  constructor() {
    this.socket = null;
  }

  connect(token) {
    this.socket = io('http://localhost:5000', {
      auth: { token }
    });

    this.socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });
  }

  onNotification(callback) {
    if (!this.socket) return;
    this.socket.on('notification', callback);
  }

  onNewOffer(callback) {
    if (!this.socket) return;
    this.socket.on('new_offer', callback);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

export default new SocketManager();
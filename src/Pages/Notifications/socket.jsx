import io from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000'; 

class SocketManager {
  socket;
  connect(token) {
    this.socket = io(SOCKET_URL);
    
    this.socket.on('connect', () => {
      console.log('Connected to server');
      this.socket.emit('authenticate', token);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  onNotification(callback) {
    this.socket.on('notification', callback);
  }
  onNewOffer(callback) {
    this.socket.on('notification', (data) => {
      if (data.type === 'new_offer') {
        callback(data);
      }
    });
}
}

export default new SocketManager();
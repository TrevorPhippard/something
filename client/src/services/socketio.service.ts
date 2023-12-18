import { io } from 'socket.io-client';

class SocketioService {
  socket: any;
  constructor() {}

  setupSocketConnection(token: any) {
    // console.log(import.meta.env.VITE_SOCKET_ENDPOINT)
    this.socket = io(import.meta.env.VITE_SOCKET_ENDPOINT, {
      auth: { token },
      withCredentials: true,
      extraHeaders: {
        "my-custom-header": "abcd"
      }
    });
    console.log(`Connecting socket...`, this.socket);
    
    this.socket.on('my broadcast', (data: any) => {
      console.log(data);
    });
  }

  subscribeToMessages(cb: (err: null, data: any) => any) {
    if (!this.socket) return(true);
    this.socket.on('message', (msg: any) => {
      console.log('Room event received!');
      return cb(null, msg);
    });
  }
  
  sendMessage({message, roomName}: any, cb: any) {
    if (this.socket) this.socket.emit('message', { message, roomName }, cb);
  }
  
  disconnect() {
    if(this.socket) {
      this.socket.disconnect();
    }
  }
}

export default new SocketioService();
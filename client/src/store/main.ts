import { defineStore } from 'pinia';
import AuthService from '../services/auth.service'
import SocketioService from '../services/socketio.service.js';

declare global {
  // interface Window { }

  interface importMetaEnv {
    readonly TOKEN: string
  }

  interface importMeta {
    readonly env: importMetaEnv
  }
}


interface User {
  Email: string,
  Password: string
  Username?: string
}

export const useStore = defineStore('main', {
  state: () => ({
    token: import.meta.env.VITE_TOKEN,
    socketEndpoint: import.meta.env.VITE_SOCKET_ENDPOINT,
    username: '',
    Email: '',
    Id: 0,
    memberSince: '',
    loggedIn: false,
    user: {
      "Id": false,
      "Username": null,
      "Email": null,
      "Token": null,
      "DateLoggedIn": null,
      "DateCreated": null
    },
  }),

  actions: {
    setUser(cookieData: any) {
      this.user = JSON.parse(cookieData).data;
      this.token = this.user.Token;
    },

    login(user: User | null) {
      return AuthService.login(user).then(
        (user: any) => {
          this.user = user[0];
          this.loggedIn = true;
         
          localStorage.setItem("user",  JSON.stringify({data:this.user}));
          SocketioService.setupSocketConnection(this.token);

          return Promise.resolve(user);
        },
        (error: any) => {
          this.loggedIn = false;
          // @ts-ignore
          this.user = null;
          return Promise.reject(error);
        }
      )
    },
    register(user: User | null) {
      return AuthService.register(user).then(
        (user: any) => {
          this.user = user;
          this.loggedIn = true;
          localStorage.setItem("user", JSON.stringify({data:this.user}));
          SocketioService.setupSocketConnection(this.user.Token);

          return Promise.resolve(user);

        },
        (error: any) => {
          this.loggedIn = false;
          // @ts-ignore
          this.user = null;
          return Promise.reject(error);
        })
    }

  },
  getters: {
    getUsername: state => state.user.Username,
    getToken: state => state.user.Token,
    getEndPoint: state => state.socketEndpoint
  }
})
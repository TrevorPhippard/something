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
  Email:string,
  Password:string
}

export const useStore = defineStore('main', {
    state: ()=> ({
        token: import.meta.env.VITE_TOKEN,
        socketEndpoint: import.meta.env.VITE_SOCKET_ENDPOINT,
        username: '',
        Email: '',
        Id: 0,
        memberSince:'',
        loggedIn: false,
        user:null
    }),

    actions: {
        login( user: User | null) {
            console.log('login action fired')

            return AuthService.login(user).then(
              (user: User) => {
                console.log('user::',user)
                // @ts-ignore
                this.token = user[0].Token
                this.username = user[0].Username
                this.Email = user[0].Email
                this.Id = user[0].Id
                this.memberSince =  user[0].DateCreated

                this.loggedIn = true;

                localStorage.setItem("user", this.token);
                SocketioService.setupSocketConnection(this.token);

                return Promise.resolve(user);
              },
              (error: any) => {
                this.loggedIn = false;
                this.user = null;
                return Promise.reject(error);
              }
            )
          },
       
    },
    getters: {
        getUsername: state => state.username,
        getToken: state => state.token,
        getEndPoint: state => state.socketEndpoint
    }

})
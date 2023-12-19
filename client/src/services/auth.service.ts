import axios from 'axios';

const API_URL = 'http://localhost:3000/auth/';

interface User {
  Email: string,
  Password: string
  Username?: string
}

class AuthService {

  login(user: User | null) {
    return axios.post(API_URL + 'signin', user)
      .then(response => {
        return response.data;
      });
  }

  register(user: User | null) {
    return axios.post(API_URL + 'signup', user).then(response => {
        return response.data;
    });
  }
}

export default new AuthService();
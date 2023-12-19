import axios from 'axios';

const API_URL = 'http://localhost:3000/auth/';

class AuthService {

  login(user: User | null) {
    return axios.post(API_URL + 'signin', user)
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
      });
  }

  register(user: User | null) {
    return axios.post(API_URL + 'signup', user).then(response => {
      if (response.data.accessToken) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
        return response.data;
    });
  }
}

export default new AuthService();
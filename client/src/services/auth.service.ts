import axios from 'axios';

const API_URL = 'http://localhost:3000/auth/';

class AuthService {
  login(user: User | null) {
    var { Email, Password} = user;

    return axios.post(API_URL + 'signin', {Email, Password})
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem('user', JSON.stringify(response.data));
        }

        return response.data;
      });
  }
  register(username: string, email: string, password: string) {
    return axios.post(API_URL + 'signup', {
      username,
      email,
      password
    });
  }
}

export default new AuthService();
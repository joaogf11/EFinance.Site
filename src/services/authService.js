import api from './api';

const authService = {
  async login(credentials) {
    try {
      const response = await api.post('/api/auth/login', credentials, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      if (error.message.includes('Não foi possível conectar ao servidor')) {
        throw new Error('Servidor indisponível. Verifique se o servidor está rodando na porta 5102.');
      }
      throw error;
    }
  },

  async register(userData) {
    try {
      const response = await api.post('/api/auth/register', userData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout() {
    localStorage.removeItem('token');
  },

  getToken() {
    return localStorage.getItem('token');
  },

  isAuthenticated() {
    return !!this.getToken();
  }
};

export default authService; 
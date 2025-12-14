import api from './api';

export const authService = {
  // Login
  login: async (correo, contrasena) => {
    const response = await api.post('/auth/login', { correo, contrasena });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.usuario));
    }
    return response.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Refresh user data from backend
  refreshUserData: async () => {
    const response = await api.get('/auth/me');
    if (response.data.usuario) {
      localStorage.setItem('user', JSON.stringify(response.data.usuario));
      return response.data.usuario;
    }
    return null;
  },
};

export default authService;

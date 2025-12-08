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

  // Solicitar recuperación de contraseña
  requestPasswordReset: async (correo) => {
    const response = await api.post('/auth/forgot-password', { correo });
    return response.data;
  },

  // Restablecer contraseña con token
  resetPassword: async ({ token, correo, contrasenaNueva }) => {
    const response = await api.post('/auth/reset-password', {
      token,
      correo,
      contrasenaNueva,
    });
    return response.data;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

export default authService;

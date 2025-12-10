import api from './api';

const usuarioService = {
  // Obtener todos los usuarios
  getAll: async () => {
    try {
      const response = await api.get('/usuarios');
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      console.error('Detalles del error:', {
        status: error.response?.status,
        message: error.response?.data?.error || error.message,
        hasToken: !!localStorage.getItem('token')
      });
      throw error;
    }
  },

  // Obtener usuario por ID
  getById: async (id) => {
    try {
      const response = await api.get(`/usuarios/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      throw error;
    }
  },

  // Crear nuevo usuario
  create: async (usuarioData) => {
    try {
      const response = await api.post('/usuarios', usuarioData);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw error;
    }
  },

  // Actualizar usuario
  update: async (id, usuarioData) => {
    try {
      const response = await api.put(`/usuarios/${id}`, usuarioData);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      throw error;
    }
  },

  // Eliminar usuario
  delete: async (id) => {
    try {
      const response = await api.delete(`/usuarios/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      throw error;
    }
  }
};

export default usuarioService;

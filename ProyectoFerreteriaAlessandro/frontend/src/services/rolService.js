import api from './api';

const rolService = {
  // Obtener todos los roles
  getAll: async () => {
    try {
      const response = await api.get('/roles');
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error al obtener roles:', error);
      console.error('Detalles del error:', {
        status: error.response?.status,
        message: error.response?.data?.error || error.message,
        hasToken: !!localStorage.getItem('token')
      });
      throw error;
    }
  },

  // Obtener rol por ID
  getById: async (id) => {
    try {
      const response = await api.get(`/roles/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error al obtener rol:', error);
      throw error;
    }
  },

  // Crear nuevo rol
  create: async (rolData) => {
    try {
      const response = await api.post('/roles', rolData);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error al crear rol:', error);
      throw error;
    }
  },

  // Actualizar rol
  update: async (id, rolData) => {
    try {
      const response = await api.put(`/roles/${id}`, rolData);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error al actualizar rol:', error);
      throw error;
    }
  },

  // Eliminar rol
  delete: async (id) => {
    try {
      const response = await api.delete(`/roles/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar rol:', error);
      throw error;
    }
  }
};

export default rolService;

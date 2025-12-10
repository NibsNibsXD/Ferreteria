import api from './api';

const cajaService = {
  // Obtener todas las cajas
  getAll: async () => {
    try {
      const response = await api.get('/cajas');
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error al obtener cajas:', error);
      console.error('Detalles del error:', {
        status: error.response?.status,
        message: error.response?.data?.error || error.message,
        hasToken: !!localStorage.getItem('token')
      });
      throw error;
    }
  },

  // Obtener caja por ID
  getById: async (id) => {
    try {
      const response = await api.get(`/cajas/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error al obtener caja:', error);
      throw error;
    }
  },

  // Crear nueva caja
  create: async (cajaData) => {
    try {
      const response = await api.post('/cajas', cajaData);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error al crear caja:', error);
      throw error;
    }
  },

  // Actualizar caja
  update: async (id, cajaData) => {
    try {
      const response = await api.put(`/cajas/${id}`, cajaData);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error al actualizar caja:', error);
      throw error;
    }
  },

  // Obtener cierres por caja
  getCierresByCaja: async (id) => {
    try {
      const response = await api.get(`/cajas/${id}/cierres`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error al obtener cierres:', error);
      throw error;
    }
  }
};

export default cajaService;

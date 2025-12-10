import api from './api';

const sucursalService = {
  // Obtener todas las sucursales
  getAll: async () => {
    try {
      const response = await api.get('/sucursales');
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error al obtener sucursales:', error);
      console.error('Detalles del error:', {
        status: error.response?.status,
        message: error.response?.data?.error || error.message,
        hasToken: !!localStorage.getItem('token')
      });
      throw error;
    }
  },

  // Obtener sucursal por ID
  getById: async (id) => {
    try {
      const response = await api.get(`/sucursales/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error al obtener sucursal:', error);
      throw error;
    }
  },

  // Crear nueva sucursal
  create: async (sucursalData) => {
    try {
      const response = await api.post('/sucursales', sucursalData);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error al crear sucursal:', error);
      throw error;
    }
  },

  // Actualizar sucursal
  update: async (id, sucursalData) => {
    try {
      const response = await api.put(`/sucursales/${id}`, sucursalData);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error al actualizar sucursal:', error);
      throw error;
    }
  }
};

export default sucursalService;

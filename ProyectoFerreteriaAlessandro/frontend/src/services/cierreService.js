import api from './api';

const cierreService = {
  // Obtener todos los cierres
  getAll: async () => {
    try {
      const response = await api.get('/cierres');
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error al obtener cierres:', error);
      throw error;
    }
  },

  // Obtener cierre por ID
  getById: async (id) => {
    try {
      const response = await api.get(`/cierres/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error al obtener cierre:', error);
      throw error;
    }
  },

  // Crear nuevo cierre
  create: async (cierreData) => {
    try {
      const response = await api.post('/cierres', cierreData);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error al crear cierre:', error);
      throw error;
    }
  },

  // Actualizar cierre
  update: async (id, cierreData) => {
    try {
      const response = await api.put(`/cierres/${id}`, cierreData);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error al actualizar cierre:', error);
      throw error;
    }
  }
};

export default cierreService;

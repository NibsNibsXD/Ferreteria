import api from './api';

const ventaService = {
  // Obtener todas las ventas
  getAll: async () => {
    try {
      const response = await api.get('/ventas');
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error al obtener ventas:', error);
      throw error;
    }
  },

  // Obtener venta por ID
  getById: async (id) => {
    try {
      const response = await api.get(`/ventas/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error al obtener venta:', error);
      throw error;
    }
  },

  // Crear nueva venta
  create: async (ventaData) => {
    try {
      const response = await api.post('/ventas', ventaData);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error al crear venta:', error);
      throw error;
    }
  },

  // Actualizar venta
  update: async (id, ventaData) => {
    try {
      const response = await api.put(`/ventas/${id}`, ventaData);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error al actualizar venta:', error);
      throw error;
    }
  },

  // Obtener ventas del día
  getVentasDelDia: async () => {
    try {
      const ventas = await ventaService.getAll();
      const today = new Date().toISOString().split('T')[0];
      return ventas.filter(v => {
        const fechaVenta = new Date(v.fecha).toISOString().split('T')[0];
        return fechaVenta === today;
      });
    } catch (error) {
      console.error('Error al obtener ventas del día:', error);
      throw error;
    }
  }
};

export default ventaService;

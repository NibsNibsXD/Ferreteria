import api from './api';

export const dashboardService = {
  // Obtener cantidad de productos activos
  async getProductosActivosCount() {
    const response = await api.get('/productos/activos/count');
    return response.data;
  },

  // Obtener valor total del inventario
  async getValorInventario() {
    const response = await api.get('/productos/inventario/valor');
    return response.data;
  },

  // Obtener todas las ventas desde reportes
  async getAllVentas() {
    const response = await api.get('/reportes/ventas');
    return response.data;
  },

  // Obtener últimas ventas desde reportes
  async getLast10Ventas() {
    const response = await api.get('/reportes/ventas');
    return response.data;
  },

  // Obtener cantidad de ventas
  async getVentasCount() {
    const response = await api.get('/ventas/count');
    return response.data;
  },

  // Obtener productos con bajo stock
  async getProductosBajoStock() {
    const response = await api.get('/reportes/inventario/bajo-stock');
    return response.data;
  },

  // Obtener reporte de ventas por periodo
  async getVentasPorPeriodo(desde, hasta) {
    const response = await api.get('/reportes/ventas', {
      params: { desde, hasta }
    });
    return response.data;
  },

  // Obtener ventas de hoy
  async getVentasHoy() {
    const hoy = new Date().toISOString().split('T')[0];
    const response = await api.get('/reportes/ventas', {
      params: { desde: hoy, hasta: hoy }
    });
    return response.data;
  }
};

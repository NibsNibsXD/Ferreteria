import api from './api';

export const usuarioService = {
  getAll: () => api.get('/usuarios'),
  getById: (id) => api.get(`/usuarios/${id}`),
  create: (data) => api.post('/usuarios', data),
  update: (id, data) => api.put(`/usuarios/${id}`, data),
  delete: (id) => api.delete(`/usuarios/${id}`),
};

export const sucursalService = {
  getAll: () => api.get('/sucursales'),
  getById: (id) => api.get(`/sucursales/${id}`),
  create: (data) => api.post('/sucursales', data),
  update: (id, data) => api.put(`/sucursales/${id}`, data),
};

export const productoService = {
  getAll: (params) => api.get('/productos', { params }),
  getById: (id) => api.get(`/productos/${id}`),
  create: (data) => api.post('/productos', data),
  update: (id, data) => api.put(`/productos/${id}`, data),
  getActivosCount: () => api.get('/productos/activos/count'),
  getValorInventario: () => api.get('/productos/inventario/valor'),
};

export const ventaService = {
  getAll: (params) => api.get('/ventas', { params }),
  getById: (id) => api.get(`/ventas/${id}`),
  create: (data) => api.post('/ventas', data),
  getLast10: () => api.get('/ventas/last-10'),
  getCount: () => api.get('/ventas/count'),
};

export const alertasService = {
  getProductosAgotados: () => api.get('/alertas/productos-agotados'),
  getProductosBajoStock: () => api.get('/alertas/productos-bajo-stock'),
};

export const compraService = {
  getAll: (params) => api.get('/compras', { params }),
  getById: (id) => api.get(`/compras/${id}`),
  create: (data) => api.post('/compras', data),
  update: (id, data) => api.put(`/compras/${id}`, data),
  delete: (id) => api.delete(`/compras/${id}`),
};

export const rolService = {
  getAll: () => api.get('/roles'),
  getById: (id) => api.get(`/roles/${id}`),
  create: (data) => api.post('/roles', data),
  update: (id, data) => api.put(`/roles/${id}`, data),
  delete: (id) => api.delete(`/roles/${id}`),
};

export default {
  usuario: usuarioService,
  sucursal: sucursalService,
  producto: productoService,
  venta: ventaService,
  alertas: alertasService,
  compra: compraService,
  rol: rolService,
};

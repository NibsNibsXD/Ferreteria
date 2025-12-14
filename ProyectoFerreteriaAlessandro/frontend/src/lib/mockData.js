export const productos = [
  { id_producto: 1, nombre: 'Cinta Métrica 5m', categoria: 'Herramientas Manuales', stock: 3, stock_minimo: 15, precio_venta: 120, activo: true },
  { id_producto: 2, nombre: 'Cemento Gris 50kg', categoria: 'Construcción', stock: 2, stock_minimo: 20, precio_venta: 250, activo: true },
  { id_producto: 3, nombre: 'Martillo de Carpintero', categoria: 'Herramientas Manuales', stock: 25, stock_minimo: 10, precio_venta: 180, activo: true },
  { id_producto: 4, nombre: 'Taladro Percutor 1/2"', categoria: 'Herramientas Eléctricas', stock: 15, stock_minimo: 5, precio_venta: 1200, activo: true },
  { id_producto: 5, nombre: 'Pintura Blanca 1 Galón', categoria: 'Pinturas', stock: 30, stock_minimo: 10, precio_venta: 450, activo: true },
  { id_producto: 6, nombre: 'Tubo PVC 1/2" x 6m', categoria: 'Fontanería', stock: 50, stock_minimo: 20, precio_venta: 95, activo: true },
  { id_producto: 7, nombre: 'Lija de Agua #100', categoria: 'Abrasivos', stock: 100, stock_minimo: 50, precio_venta: 10, activo: true },
  { id_producto: 8, nombre: 'Bombillo LED 9W', categoria: 'Electricidad', stock: 80, stock_minimo: 30, precio_venta: 45, activo: true },
  { id_producto: 9, nombre: 'Carretilla 5.5 ft³', categoria: 'Construcción', stock: 10, stock_minimo: 5, precio_venta: 1500, activo: true },
  { id_producto: 10, nombre: 'Serrucho de Costilla 12"', categoria: 'Herramientas Manuales', stock: 18, stock_minimo: 10, precio_venta: 220, activo: true },
  { id_producto: 11, nombre: 'Tomacorriente Doble', categoria: 'Electricidad', stock: 120, stock_minimo: 40, precio_venta: 35, activo: true },
  { id_producto: 12, nombre: 'Brocha de 2"', categoria: 'Pinturas', stock: 40, stock_minimo: 20, precio_venta: 25, activo: true },
];

export const ventas = [
  { id_venta: 1, codigo_factura: 'FAC-2025-001', cliente: 'Juan Pérez', total: 360.00, metodo_pago: 'Efectivo', fecha: '2025-12-13T10:30:00Z' },
  { id_venta: 2, codigo_factura: 'FAC-2025-002', cliente: 'Constructora López S.A.', total: 2450.00, metodo_pago: 'Tarjeta', fecha: '2025-12-13T11:15:00Z' },
  { id_venta: 3, codigo_factura: 'FAC-2025-003', cliente: 'María González', total: 560.00, metodo_pago: 'Transferencia', fecha: '2025-12-13T12:00:00Z' },
  { id_venta: 4, codigo_factura: 'FAC-2025-004', cliente: 'Carlos Rodríguez', total: 120.00, metodo_pago: 'Efectivo', fecha: '2025-12-12T15:45:00Z' },
  { id_venta: 5, codigo_factura: 'FAC-2025-005', cliente: 'Ana Martínez', total: 890.00, metodo_pago: 'Tarjeta', fecha: '2025-12-12T09:20:00Z' },
];

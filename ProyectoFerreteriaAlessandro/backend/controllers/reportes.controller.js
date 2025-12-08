const reportesService = require('../services/reportes.service');
const { generateExcel } = require('../utils/excelExporter');
const { generatePDF } = require('../utils/pdfExporter');

/**
 * Obtener reporte de ventas por periodo (JSON)
 * GET /api/reportes/ventas
 */
const getVentas = async (req, res) => {
  try {
    const { desde, hasta } = req.query;
    const fechaInicio = desde ? new Date(desde) : null;
    const fechaFin = hasta ? new Date(hasta) : null;

    const ventas = await reportesService.getVentasPorPeriodo(fechaInicio, fechaFin);

    res.json({
      success: true,
      data: ventas,
      total: ventas.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Exportar reporte de ventas
 * GET /api/reportes/ventas/export
 */
const exportVentas = async (req, res) => {
  try {
    const { formato, desde, hasta } = req.query;

    console.log('Exportando ventas - Params:', { formato, desde, hasta });

    // Validar formato
    if (!formato || !['excel', 'pdf'].includes(formato.toLowerCase())) {
      return res.status(400).json({
        success: false,
        error: 'Formato inválido. Use "excel" o "pdf"'
      });
    }

    const fechaInicio = desde ? new Date(desde) : null;
    const fechaFin = hasta ? new Date(hasta) : null;

    console.log('Fechas procesadas:', { fechaInicio, fechaFin });

    const ventas = await reportesService.getVentasPorPeriodo(fechaInicio, fechaFin);

    console.log(`Ventas encontradas: ${ventas.length}`);

    // Preparar datos para exportación
    const data = ventas.map(venta => ({
      id_venta: venta.id_venta,
      codigo_factura: venta.codigo_factura,
      fecha: new Date(venta.fecha).toLocaleDateString('es-ES'),
      cliente: venta.cliente ? venta.cliente.nombre : 'N/A',
      telefono: venta.cliente?.telefono || 'N/A',
      usuario: venta.usuario ? venta.usuario.nombre : 'N/A',
      metodo_pago: venta.metodo_pago?.nombre || 'N/A',
      total: parseFloat(venta.total),
      estado: venta.estado
    }));

    const columns = [
      { header: 'ID Venta', key: 'id_venta', width: 12 },
      { header: 'Código Factura', key: 'codigo_factura', width: 20 },
      { header: 'Fecha', key: 'fecha', width: 15 },
      { header: 'Cliente', key: 'cliente', width: 30 },
      { header: 'Teléfono', key: 'telefono', width: 15 },
      { header: 'Usuario', key: 'usuario', width: 25 },
      { header: 'Método Pago', key: 'metodo_pago', width: 20 },
      { header: 'Total (L)', key: 'total', width: 15 },
      { header: 'Estado', key: 'estado', width: 15 }
    ];

    const periodoStr = desde && hasta ? `${desde} a ${hasta}` : 'Todas';
    const title = `Reporte de Ventas - ${periodoStr}`;

    if (formato.toLowerCase() === 'excel') {
      const buffer = await generateExcel({ title, columns, data });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=reporte-ventas-${Date.now()}.xlsx`);
      res.send(buffer);
    } else {
      const buffer = await generatePDF({ title, columns, data, orientation: 'landscape' });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=reporte-ventas-${Date.now()}.pdf`);
      res.send(buffer);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Obtener reporte de compras por periodo (JSON)
 * GET /api/reportes/compras
 */
const getCompras = async (req, res) => {
  try {
    const { desde, hasta } = req.query;
    const fechaInicio = desde ? new Date(desde) : null;
    const fechaFin = hasta ? new Date(hasta) : null;

    const compras = await reportesService.getComprasPorPeriodo(fechaInicio, fechaFin);

    res.json({
      success: true,
      data: compras,
      total: compras.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Exportar reporte de compras
 * GET /api/reportes/compras/export
 */
const exportCompras = async (req, res) => {
  try {
    const { formato, desde, hasta } = req.query;

    if (!formato || !['excel', 'pdf'].includes(formato.toLowerCase())) {
      return res.status(400).json({
        success: false,
        error: 'Formato inválido. Use "excel" o "pdf"'
      });
    }

    const fechaInicio = desde ? new Date(desde) : null;
    const fechaFin = hasta ? new Date(hasta) : null;

    const compras = await reportesService.getComprasPorPeriodo(fechaInicio, fechaFin);

    const data = compras.map(compra => ({
      id_compra: compra.id_compra,
      fecha: new Date(compra.fecha).toLocaleDateString('es-ES'),
      usuario: compra.usuario ? compra.usuario.nombre : 'N/A',
      total: parseFloat(compra.total),
      num_items: compra.detalles?.length || 0
    }));

    const columns = [
      { header: 'ID Compra', key: 'id_compra', width: 12 },
      { header: 'Fecha', key: 'fecha', width: 15 },
      { header: 'Usuario', key: 'usuario', width: 30 },
      { header: 'Total (L)', key: 'total', width: 15 },
      { header: 'Núm. Items', key: 'num_items', width: 15 }
    ];

    const periodoStr = desde && hasta ? `${desde} a ${hasta}` : 'Todas';
    const title = `Reporte de Compras - ${periodoStr}`;

    if (formato.toLowerCase() === 'excel') {
      const buffer = await generateExcel({ title, columns, data });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=reporte-compras-${Date.now()}.xlsx`);
      res.send(buffer);
    } else {
      const buffer = await generatePDF({ title, columns, data });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=reporte-compras-${Date.now()}.pdf`);
      res.send(buffer);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Obtener reporte de inventario actual (JSON)
 * GET /api/reportes/inventario
 */
const getInventario = async (req, res) => {
  try {
    const productos = await reportesService.getInventarioActual();

    res.json({
      success: true,
      data: productos,
      total: productos.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Exportar reporte de inventario
 * GET /api/reportes/inventario/export
 */
const exportInventario = async (req, res) => {
  try {
    const { formato } = req.query;

    console.log('Exportando inventario - Params:', { formato });

    if (!formato || !['excel', 'pdf'].includes(formato.toLowerCase())) {
      return res.status(400).json({
        success: false,
        error: 'Formato inválido. Use "excel" o "pdf"'
      });
    }

    const productos = await reportesService.getInventarioActual();

    console.log(`Productos encontrados: ${productos.length}`);

    const data = productos.map(producto => ({
      id_producto: producto.id_producto,
      codigo_barra: producto.codigo_barra || 'N/A',
      nombre: producto.nombre,
      categoria: producto.categoria?.nombre || 'Sin categoría',
      precio_compra: parseFloat(producto.precio_compra),
      precio_venta: parseFloat(producto.precio_venta),
      stock: producto.stock,
      stock_minimo: producto.stock_minimo,
      estado_stock: producto.stock <= producto.stock_minimo ? 'BAJO' : 'NORMAL'
    }));

    const columns = [
      { header: 'ID', key: 'id_producto', width: 10 },
      { header: 'Código Barra', key: 'codigo_barra', width: 18 },
      { header: 'Nombre', key: 'nombre', width: 30 },
      { header: 'Categoría', key: 'categoria', width: 20 },
      { header: 'P. Compra (L)', key: 'precio_compra', width: 15 },
      { header: 'P. Venta (L)', key: 'precio_venta', width: 15 },
      { header: 'Stock', key: 'stock', width: 12 },
      { header: 'Stock Mín.', key: 'stock_minimo', width: 12 },
      { header: 'Estado', key: 'estado_stock', width: 12 }
    ];

    const title = 'Reporte de Inventario Actual';

    if (formato.toLowerCase() === 'excel') {
      const buffer = await generateExcel({ title, columns, data });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=inventario-${Date.now()}.xlsx`);
      res.send(buffer);
    } else {
      const buffer = await generatePDF({ title, columns, data, orientation: 'landscape' });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=inventario-${Date.now()}.pdf`);
      res.send(buffer);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Obtener productos con bajo stock (JSON)
 * GET /api/reportes/inventario/bajo-stock
 */
const getProductosBajoStock = async (req, res) => {
  try {
    const productos = await reportesService.getProductosBajoStock();

    res.json({
      success: true,
      data: productos,
      total: productos.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Exportar productos con bajo stock
 * GET /api/reportes/inventario/bajo-stock/export
 */
const exportProductosBajoStock = async (req, res) => {
  try {
    const { formato } = req.query;

    if (!formato || !['excel', 'pdf'].includes(formato.toLowerCase())) {
      return res.status(400).json({
        success: false,
        error: 'Formato inválido. Use "excel" o "pdf"'
      });
    }

    const productos = await reportesService.getProductosBajoStock();

    const data = productos.map(producto => ({
      id_producto: producto.id_producto,
      codigo_barra: producto.codigo_barra || 'N/A',
      nombre: producto.nombre,
      categoria: producto.categoria?.nombre || 'Sin categoría',
      stock: producto.stock,
      stock_minimo: producto.stock_minimo,
      diferencia: producto.stock - producto.stock_minimo
    }));

    const columns = [
      { header: 'ID', key: 'id_producto', width: 10 },
      { header: 'Código Barra', key: 'codigo_barra', width: 18 },
      { header: 'Nombre', key: 'nombre', width: 35 },
      { header: 'Categoría', key: 'categoria', width: 20 },
      { header: 'Stock', key: 'stock', width: 12 },
      { header: 'Stock Mín.', key: 'stock_minimo', width: 12 },
      { header: 'Diferencia', key: 'diferencia', width: 12 }
    ];

    const title = 'Productos con Bajo Stock';

    if (formato.toLowerCase() === 'excel') {
      const buffer = await generateExcel({ title, columns, data });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=bajo-stock-${Date.now()}.xlsx`);
      res.send(buffer);
    } else {
      const buffer = await generatePDF({ title, columns, data });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=bajo-stock-${Date.now()}.pdf`);
      res.send(buffer);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Obtener productos más vendidos (JSON)
 * GET /api/reportes/productos/mas-vendidos
 */
const getProductosMasVendidos = async (req, res) => {
  try {
    const { limit, desde, hasta } = req.query;
    const fechaInicio = desde ? new Date(desde) : null;
    const fechaFin = hasta ? new Date(hasta) : null;

    const productos = await reportesService.getProductosMasVendidos(
      limit || 20,
      fechaInicio,
      fechaFin
    );

    res.json({
      success: true,
      data: productos,
      total: productos.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Exportar productos más vendidos
 * GET /api/reportes/productos/mas-vendidos/export
 */
const exportProductosMasVendidos = async (req, res) => {
  try {
    const { formato, limit, desde, hasta } = req.query;

    console.log('Exportando productos más vendidos - Params:', { formato, limit, desde, hasta });

    if (!formato || !['excel', 'pdf'].includes(formato.toLowerCase())) {
      return res.status(400).json({
        success: false,
        error: 'Formato inválido. Use "excel" o "pdf"'
      });
    }

    const fechaInicio = desde ? new Date(desde) : null;
    const fechaFin = hasta ? new Date(hasta) : null;

    const productos = await reportesService.getProductosMasVendidos(
      limit || 20,
      fechaInicio,
      fechaFin
    );

    console.log(`Productos más vendidos encontrados: ${productos.length}`);

    const data = productos.map(item => ({
      id_producto: item.id_producto,
      nombre: item.producto?.nombre || 'N/A',
      codigo_barra: item.producto?.codigo_barra || 'N/A',
      categoria: item.producto?.categoria?.nombre || 'N/A',
      cantidad_vendida: parseInt(item.dataValues.total_vendido),
      total_ingresos: parseFloat(item.dataValues.total_ingresos),
      stock_actual: item.producto?.stock || 0
    }));

    const columns = [
      { header: 'ID', key: 'id_producto', width: 10 },
      { header: 'Nombre', key: 'nombre', width: 30 },
      { header: 'Código Barra', key: 'codigo_barra', width: 18 },
      { header: 'Categoría', key: 'categoria', width: 20 },
      { header: 'Cantidad Vendida', key: 'cantidad_vendida', width: 18 },
      { header: 'Ingresos (L)', key: 'total_ingresos', width: 18 },
      { header: 'Stock Actual', key: 'stock_actual', width: 15 }
    ];

    const periodoStr = desde && hasta ? ` - ${desde} a ${hasta}` : '';
    const title = `Productos Más Vendidos${periodoStr}`;

    if (formato.toLowerCase() === 'excel') {
      const buffer = await generateExcel({ title, columns, data });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=productos-mas-vendidos-${Date.now()}.xlsx`);
      res.send(buffer);
    } else {
      const buffer = await generatePDF({ title, columns, data, orientation: 'landscape' });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=productos-mas-vendidos-${Date.now()}.pdf`);
      res.send(buffer);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Obtener clientes más frecuentes (JSON)
 * GET /api/reportes/clientes/frecuentes
 */
const getClientesFrecuentes = async (req, res) => {
  try {
    const { limit, desde, hasta } = req.query;
    const fechaInicio = desde ? new Date(desde) : null;
    const fechaFin = hasta ? new Date(hasta) : null;

    const clientes = await reportesService.getClientesFrecuentes(
      limit || 20,
      fechaInicio,
      fechaFin
    );

    res.json({
      success: true,
      data: clientes,
      total: clientes.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Exportar clientes más frecuentes
 * GET /api/reportes/clientes/frecuentes/export
 */
const exportClientesFrecuentes = async (req, res) => {
  try {
    const { formato, limit, desde, hasta } = req.query;

    console.log('Exportando clientes frecuentes - Params:', { formato, limit, desde, hasta });

    if (!formato || !['excel', 'pdf'].includes(formato.toLowerCase())) {
      return res.status(400).json({
        success: false,
        error: 'Formato inválido. Use "excel" o "pdf"'
      });
    }

    const fechaInicio = desde ? new Date(desde) : null;
    const fechaFin = hasta ? new Date(hasta) : null;

    const clientes = await reportesService.getClientesFrecuentes(
      limit || 20,
      fechaInicio,
      fechaFin
    );

    console.log(`Clientes frecuentes encontrados: ${clientes.length}`);

    const data = clientes.map(item => ({
      id_cliente: item.id_cliente,
      nombre: item.cliente ? item.cliente.nombre : 'N/A',
      telefono: item.cliente?.telefono || 'N/A',
      correo: item.cliente?.correo || 'N/A',
      total_compras: parseInt(item.dataValues.total_compras),
      total_gastado: parseFloat(item.dataValues.total_gastado),
      ticket_promedio: parseFloat((item.dataValues.total_gastado / item.dataValues.total_compras).toFixed(2))
    }));

    const columns = [
      { header: 'ID', key: 'id_cliente', width: 10 },
      { header: 'Nombre', key: 'nombre', width: 30 },
      { header: 'Teléfono', key: 'telefono', width: 15 },
      { header: 'Correo', key: 'correo', width: 25 },
      { header: 'Total Compras', key: 'total_compras', width: 15 },
      { header: 'Total Gastado (L)', key: 'total_gastado', width: 18 },
      { header: 'Ticket Promedio (L)', key: 'ticket_promedio', width: 20 }
    ];

    const periodoStr = desde && hasta ? ` - ${desde} a ${hasta}` : '';
    const title = `Clientes Más Frecuentes${periodoStr}`;

    if (formato.toLowerCase() === 'excel') {
      const buffer = await generateExcel({ title, columns, data });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=clientes-frecuentes-${Date.now()}.xlsx`);
      res.send(buffer);
    } else {
      const buffer = await generatePDF({ title, columns, data, orientation: 'landscape' });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=clientes-frecuentes-${Date.now()}.pdf`);
      res.send(buffer);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  getVentas,
  exportVentas,
  getCompras,
  exportCompras,
  getInventario,
  exportInventario,
  getProductosBajoStock,
  exportProductosBajoStock,
  getProductosMasVendidos,
  exportProductosMasVendidos,
  getClientesFrecuentes,
  exportClientesFrecuentes
};

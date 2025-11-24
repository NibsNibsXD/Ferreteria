const ventaService = require('../services/venta.service');

/**
 * Crear una nueva venta
 * POST /api/ventas
 * Incluye la lógica de actualización de stock y alertas de bajo stock
 */
const createVenta = async (req, res) => {
  try {
    const ventaData = req.body;

    // Agregar el ID del usuario autenticado si existe
    if (req.user && req.user.id_usuario) {
      ventaData.id_usuario = req.user.id_usuario;
    }

    // Crear la venta (incluye actualización de stock y alertas)
    const nuevaVenta = await ventaService.createVenta(ventaData, req);

    res.status(201).json({
      success: true,
      message: 'Venta creada exitosamente',
      data: nuevaVenta
    });
  } catch (error) {
    console.error('Error al crear venta:', error.message);

    // Determinar código de estado según el tipo de error
    let statusCode = 500;
    if (error.message.includes('no encontrado') || error.message.includes('no existe')) {
      statusCode = 404;
    } else if (
      error.message.includes('requerido') ||
      error.message.includes('debe incluir') ||
      error.message.includes('insuficiente')
    ) {
      statusCode = 400;
    }

    res.status(statusCode).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Obtener todas las ventas
 * GET /api/ventas
 * Soporta paginación opcional: ?page=1&limit=10
 */
const getAllVentas = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const ventas = await ventaService.getAllVentas({ page, limit });

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
 * Obtener una venta por ID
 * GET /api/ventas/:id
 */
const getVentaById = async (req, res) => {
  try {
    const venta = await ventaService.getVentaById(req.params.id);

    res.json({
      success: true,
      data: venta
    });
  } catch (error) {
    const statusCode = error.message === 'Venta no encontrada' ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  createVenta,
  getAllVentas,
  getVentaById
};

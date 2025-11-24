const ventaService = require('../services/venta.service');

/**
 * Obtener todas las ventas
 * GET /api/ventas
 * Soporta paginación opcional mediante query params: ?page=1&limit=10
 */
const getAllVentas = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const ventas = await ventaService.getAllVentas({ page, limit });
    res.json({
      success: true,
      data: ventas
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

/**
 * Crear una nueva venta
 * POST /api/ventas
 */
const createVenta = async (req, res) => {
  try {
    const nuevaVenta = await ventaService.createVenta(req.body);
    res.status(201).json({
      success: true,
      message: 'Venta registrada exitosamente',
      data: nuevaVenta
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Actualizar una venta
 * PUT /api/ventas/:id
 */
const updateVenta = async (req, res) => {
  try {
    const ventaActualizada = await ventaService.updateVenta(req.params.id, req.body);
    res.json({
      success: true,
      message: 'Venta actualizada exitosamente',
      data: ventaActualizada
    });
  } catch (error) {
    const statusCode = error.message === 'Venta no encontrada' ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Eliminar una venta
 * DELETE /api/ventas/:id
 */
const deleteVenta = async (req, res) => {
  try {
    await ventaService.deleteVenta(req.params.id);
    res.json({
      success: true,
      message: 'Venta eliminada exitosamente'
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
  getAllVentas,
  getVentaById,
  createVenta,
  updateVenta,
  deleteVenta
};

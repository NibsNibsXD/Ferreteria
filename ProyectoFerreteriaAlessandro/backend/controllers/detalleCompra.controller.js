const detalleCompraService = require('../services/detalleCompra.service');

/**
 * Obtener todos los detalles de compra
 * GET /api/detalles-compra
 * Soporta paginación opcional mediante query params: ?page=1&limit=10
 */
const getAllDetallesCompra = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const detalles = await detalleCompraService.getAllDetallesCompra({ page, limit });
    res.json({
      success: true,
      data: detalles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Obtener un detalle de compra por ID
 * GET /api/detalles-compra/:id
 */
const getDetalleCompraById = async (req, res) => {
  try {
    const detalle = await detalleCompraService.getDetalleCompraById(req.params.id);
    res.json({
      success: true,
      data: detalle
    });
  } catch (error) {
    const statusCode = error.message === 'Detalle de compra no encontrado' ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Crear un nuevo detalle de compra
 * POST /api/detalles-compra
 */
const createDetalleCompra = async (req, res) => {
  try {
    const nuevoDetalle = await detalleCompraService.createDetalleCompra(req.body);
    res.status(201).json({
      success: true,
      message: 'Detalle de compra creado exitosamente',
      data: nuevoDetalle
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Actualizar un detalle de compra
 * PUT /api/detalles-compra/:id
 */
const updateDetalleCompra = async (req, res) => {
  try {
    const detalleActualizado = await detalleCompraService.updateDetalleCompra(req.params.id, req.body);
    res.json({
      success: true,
      message: 'Detalle de compra actualizado exitosamente',
      data: detalleActualizado
    });
  } catch (error) {
    const statusCode = error.message === 'Detalle de compra no encontrado' ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Eliminar un detalle de compra
 * DELETE /api/detalles-compra/:id
 */
const deleteDetalleCompra = async (req, res) => {
  try {
    await detalleCompraService.deleteDetalleCompra(req.params.id);
    res.json({
      success: true,
      message: 'Detalle de compra eliminado exitosamente'
    });
  } catch (error) {
    const statusCode = error.message === 'Detalle de compra no encontrado' ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  getAllDetallesCompra,
  getDetalleCompraById,
  createDetalleCompra,
  updateDetalleCompra,
  deleteDetalleCompra
};

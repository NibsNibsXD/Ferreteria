const compraService = require('../services/compra.service');

/**
 * Obtener todas las compras
 * GET /api/compras
 * Soporta paginación opcional mediante query params: ?page=1&limit=10
 */
const getAllCompras = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const compras = await compraService.getAllCompras({ page, limit });
    res.json({
      success: true,
      data: compras
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Obtener una compra por ID
 * GET /api/compras/:id
 */
const getCompraById = async (req, res) => {
  try {
    const compra = await compraService.getCompraById(req.params.id);
    res.json({
      success: true,
      data: compra
    });
  } catch (error) {
    const statusCode = error.message === 'Compra no encontrada' ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Registrar una nueva compra
 * POST /api/compras
 */
const createCompra = async (req, res) => {
  try {
    const nuevaCompra = await compraService.createCompra(req.body);
    res.status(201).json({
      success: true,
      message: 'Compra registrada exitosamente',
      data: nuevaCompra
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Actualizar una compra
 * PUT /api/compras/:id
 */
const updateCompra = async (req, res) => {
  try {
    const compraActualizada = await compraService.updateCompra(req.params.id, req.body);
    res.json({
      success: true,
      message: 'Compra actualizada exitosamente',
      data: compraActualizada
    });
  } catch (error) {
    const statusCode = error.message === 'Compra no encontrada' ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Eliminar una compra
 * DELETE /api/compras/:id
 */
const deleteCompra = async (req, res) => {
  try {
    await compraService.deleteCompra(req.params.id);
    res.json({
      success: true,
      message: 'Compra eliminada exitosamente'
    });
  } catch (error) {
    const statusCode = error.message === 'Compra no encontrada' ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  getAllCompras,
  getCompraById,
  createCompra,
  updateCompra,
  deleteCompra
};

const facturaService = require('../services/factura.service');

/**
 * Obtener todas las facturas
 * GET /api/facturas
 * Soporta paginación opcional mediante query params: ?page=1&limit=10
 */
const getAllFacturas = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const facturas = await facturaService.getAllFacturas({ page, limit });
    res.json({
      success: true,
      data: facturas
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Obtener una factura por ID
 * GET /api/facturas/:id
 */
const getFacturaById = async (req, res) => {
  try {
    const factura = await facturaService.getFacturaById(req.params.id);
    res.json({
      success: true,
      data: factura
    });
  } catch (error) {
    const statusCode = error.message === 'Factura no encontrada' ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Crear una nueva factura
 * POST /api/facturas
 */
const createFactura = async (req, res) => {
  try {
    const nuevaFactura = await facturaService.createFactura(req.body);
    res.status(201).json({
      success: true,
      message: 'Factura creada exitosamente',
      data: nuevaFactura
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Actualizar una factura
 * PUT /api/facturas/:id
 */
const updateFactura = async (req, res) => {
  try {
    const facturaActualizada = await facturaService.updateFactura(req.params.id, req.body);
    res.json({
      success: true,
      message: 'Factura actualizada exitosamente',
      data: facturaActualizada
    });
  } catch (error) {
    const statusCode = error.message === 'Factura no encontrada' ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Eliminar una factura
 * DELETE /api/facturas/:id
 */
const deleteFactura = async (req, res) => {
  try {
    await facturaService.deleteFactura(req.params.id);
    res.json({
      success: true,
      message: 'Factura eliminada exitosamente'
    });
  } catch (error) {
    const statusCode = error.message === 'Factura no encontrada' ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  getAllFacturas,
  getFacturaById,
  createFactura,
  updateFactura,
  deleteFactura
};

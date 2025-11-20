const sucursalService = require('../services/sucursal.service');

/**
 * Obtener todas las sucursales
 * GET /api/sucursales
 */
const getAllSucursales = async (req, res) => {
  try {
    const sucursales = await sucursalService.getAllSucursales();
    res.json({
      success: true,
      data: sucursales
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Obtener una sucursal por ID
 * GET /api/sucursales/:id
 */
const getSucursalById = async (req, res) => {
  try {
    const sucursal = await sucursalService.getSucursalById(req.params.id);
    res.json({
      success: true,
      data: sucursal
    });
  } catch (error) {
    const statusCode = error.message === 'Sucursal no encontrada' ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Crear una nueva sucursal
 * POST /api/sucursales
 */
const createSucursal = async (req, res) => {
  try {
    const nuevaSucursal = await sucursalService.createSucursal(req.body);
    res.status(201).json({
      success: true,
      message: 'Sucursal creada exitosamente',
      data: nuevaSucursal
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Actualizar una sucursal
 * PUT /api/sucursales/:id
 */
const updateSucursal = async (req, res) => {
  try {
    const sucursalActualizada = await sucursalService.updateSucursal(req.params.id, req.body);
    res.json({
      success: true,
      message: 'Sucursal actualizada exitosamente',
      data: sucursalActualizada
    });
  } catch (error) {
    const statusCode = error.message === 'Sucursal no encontrada' ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  getAllSucursales,
  getSucursalById,
  createSucursal,
  updateSucursal
}; 
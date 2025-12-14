const cajaService = require('../services/caja.service');

/**
 * Obtener todas las cajas
 * GET /api/cajas
 */
const getAllCajas = async (req, res) => {
  try {
    const cajas = await cajaService.getAllCajas();
    res.json({ success: true, data: cajas });
  } catch (error) {
    console.error('Error en getAllCajas:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Obtener una caja por ID
 * GET /api/cajas/:id
 */
const getCajaById = async (req, res) => {
  try {
    const caja = await cajaService.getCajaById(req.params.id);
    res.json({ success: true, data: caja });
  } catch (error) {
    console.error('Error en getCajaById:', error);
    const statusCode = error.message === 'Caja no encontrada' ? 404 : 500;
    res.status(statusCode).json({ success: false, error: error.message });
  }
};

/**
 * Crear una nueva caja
 * POST /api/cajas
 */
const createCaja = async (req, res) => {
  try {
    const nuevaCaja = await cajaService.createCaja(req.body);
    res.status(201).json({ success: true, message: 'Caja creada exitosamente', data: nuevaCaja });
  } catch (error) {
    console.error('Error en createCaja:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Actualizar una caja
 * PUT /api/cajas/:id
 */
const updateCaja = async (req, res) => {
  try {
    const cajaActualizada = await cajaService.updateCaja(req.params.id, req.body);
    res.json({ success: true, message: 'Caja actualizada exitosamente', data: cajaActualizada });
  } catch (error) {
    console.error('Error en updateCaja:', error);
    const statusCode = error.message === 'Caja no encontrada' ? 404 : 500;
    res.status(statusCode).json({ success: false, error: error.message });
  }
};

/**
 * Eliminar una caja
 * DELETE /api/cajas/:id
 */


/**
 * Obtener cierres por caja
 * GET /api/cajas/:id/cierres
 */
const getCierresByCaja = async (req, res) => {
  try {
    const cierres = await cajaService.getCierresByCaja(req.params.id);
    res.json({ success: true, data: cierres });
  } catch (error) {
    const statusCode = error.message === 'Caja no encontrada' ? 404 : 500;
    res.status(statusCode).json({ success: false, error: error.message });
  }
};

module.exports = {
  getAllCajas,
  getCajaById,
  createCaja,
  updateCaja,
  getCierresByCaja
};

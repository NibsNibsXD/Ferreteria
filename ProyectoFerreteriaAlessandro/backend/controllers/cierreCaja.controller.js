const cierreService = require('../services/cierreCaja.service');

/**
 * Obtener todos los cierres
 * GET /api/cierres
 */
const getAllCierres = async (req, res) => {
  try {
    const cierres = await cierreService.getAllCierres();
    res.json({ success: true, data: cierres });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Obtener un cierre por ID
 * GET /api/cierres/:id
 */
const getCierreById = async (req, res) => {
  try {
    const cierre = await cierreService.getCierreById(req.params.id);
    res.json({ success: true, data: cierre });
  } catch (error) {
    const statusCode = error.message === 'Cierre no encontrado' ? 404 : 500;
    res.status(statusCode).json({ success: false, error: error.message });
  }
};

/**
 * Crear cierre
 * POST /api/cierres
 */
const createCierre = async (req, res) => {
  try {
    const nuevoCierre = await cierreService.createCierre(req.body);
    res.status(201).json({ success: true, message: 'Cierre creado exitosamente', data: nuevoCierre });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Actualizar cierre
 * PUT /api/cierres/:id
 */
const updateCierre = async (req, res) => {
  try {
    const cierreActualizado = await cierreService.updateCierre(req.params.id, req.body);
    res.json({ success: true, message: 'Cierre actualizado exitosamente', data: cierreActualizado });
  } catch (error) {
    const statusCode = error.message === 'Cierre no encontrado' ? 404 : 500;
    res.status(statusCode).json({ success: false, error: error.message });
  }
};

module.exports = {
  getAllCierres,
  getCierreById,
  createCierre,
  updateCierre
};

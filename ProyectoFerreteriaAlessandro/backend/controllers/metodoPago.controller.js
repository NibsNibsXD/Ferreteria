const metodoPagoService = require('../services/metodoPago.service');

/**
 * Obtener todos los métodos de pago
 * GET /api/metodos-pago
 */
const getAllMetodosPago = async (req, res) => {
  try {
    const metodos = await metodoPagoService.getAllMetodosPago();
    res.json({
      success: true,
      data: metodos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Obtener un método de pago por ID
 * GET /api/metodos-pago/:id
 */
const getMetodoPagoById = async (req, res) => {
  try {
    const metodo = await metodoPagoService.getMetodoPagoById(req.params.id);
    res.json({
      success: true,
      data: metodo
    });
  } catch (error) {
    const statusCode = error.message === 'Método de pago no encontrado' ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Crear un nuevo método de pago
 * POST /api/metodos-pago
 */
const createMetodoPago = async (req, res) => {
  try {
    const nuevoMetodo = await metodoPagoService.createMetodoPago(req.body);
    res.status(201).json({
      success: true,
      message: 'Método de pago creado exitosamente',
      data: nuevoMetodo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Actualizar un método de pago
 * PUT /api/metodos-pago/:id
 */
const updateMetodoPago = async (req, res) => {
  try {
    const metodoActualizado = await metodoPagoService.updateMetodoPago(req.params.id, req.body);
    res.json({
      success: true,
      message: 'Método de pago actualizado exitosamente',
      data: metodoActualizado
    });
  } catch (error) {
    const statusCode = error.message === 'Método de pago no encontrado' ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Eliminar un método de pago
 * DELETE /api/metodos-pago/:id
 */
const deleteMetodoPago = async (req, res) => {
  try {
    await metodoPagoService.deleteMetodoPago(req.params.id);
    res.json({
      success: true,
      message: 'Método de pago eliminado exitosamente'
    });
  } catch (error) {
    const statusCode = error.message === 'Método de pago no encontrado' ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  getAllMetodosPago,
  getMetodoPagoById,
  createMetodoPago,
  updateMetodoPago,
  deleteMetodoPago
};

const express = require('express');
const router = express.Router();
const metodoPagoController = require('../controllers/metodoPago.controller');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

/**
 * Obtener todos los métodos de pago
 * GET /api/metodos-pago
 * Requiere autenticación
 */
router.get('/', authenticateToken, metodoPagoController.getAllMetodosPago);

/**
 * Obtener un método de pago por ID
 * GET /api/metodos-pago/:id
 * Requiere autenticación
 */
router.get('/:id', authenticateToken, metodoPagoController.getMetodoPagoById);

/**
 * Crear un nuevo método de pago
 * POST /api/metodos-pago
 * Requiere autenticación y rol de administrador
 */
router.post('/', authenticateToken, authorizeRoles(1), metodoPagoController.createMetodoPago);

/**
 * Actualizar un método de pago
 * PUT /api/metodos-pago/:id
 * Requiere autenticación y rol de administrador
 */
router.put('/:id', authenticateToken, authorizeRoles(1), metodoPagoController.updateMetodoPago);

/**
 * Eliminar un método de pago
 * DELETE /api/metodos-pago/:id
 * Requiere autenticación y rol de administrador
 */
router.delete('/:id', authenticateToken, authorizeRoles(1), metodoPagoController.deleteMetodoPago);

module.exports = router;

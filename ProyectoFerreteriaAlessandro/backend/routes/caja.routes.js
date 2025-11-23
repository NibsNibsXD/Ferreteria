const express = require('express');
const router = express.Router();
const cajaController = require('../controllers/caja.controller');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

/**
 * Obtener todas las cajas
 * GET /api/cajas
 * Requiere autenticación
 */
router.get('/', authenticateToken, cajaController.getAllCajas);


/**
 * Obtener una caja por ID
 * GET /api/cajas/:id
 * Requiere autenticación
 */
router.get('/:id', authenticateToken, cajaController.getCajaById);

/**
 * Crear una nueva caja
 * POST /api/cajas
 * Requiere autenticación y rol de administrador
 */
router.post('/', authenticateToken, authorizeRoles(1), cajaController.createCaja);

/**
 * Actualizar una caja
 * PUT /api/cajas/:id
 * Requiere autenticación y rol de administrador
 */
router.put('/:id', authenticateToken, authorizeRoles(1), cajaController.updateCaja);

/**
 * Obtener cierres por caja
 * GET /api/cajas/:id/cierres
 * Requiere autenticación
 */
router.get('/:id/cierres', authenticateToken, cajaController.getCierresByCaja);

module.exports = router;

const express = require('express');
const router = express.Router();
const cierreController = require('../controllers/cierreCaja.controller');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

/**
 * Obtener todos los cierres de caja
 * GET /api/cierres
 * Requiere autenticación
 */
router.get('/', authenticateToken, cierreController.getAllCierres);

/**
 * Obtener un cierre por ID
 * GET /api/cierres/:id
 * Requiere autenticación
 */
router.get('/:id', authenticateToken, cierreController.getCierreById);

/**
 * Crear un cierre de caja
 * POST /api/cierres
 * Requiere autenticación y rol de administrador
 */
router.post('/', authenticateToken, authorizeRoles(1), cierreController.createCierre);

/**
 * Actualizar un cierre
 * PUT /api/cierres/:id
 * Requiere autenticación y rol de administrador
 */
router.put('/:id', authenticateToken, authorizeRoles(1), cierreController.updateCierre);

module.exports = router;

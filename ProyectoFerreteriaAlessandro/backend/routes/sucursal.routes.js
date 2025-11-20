const express = require('express');
const router = express.Router();
const sucursalController = require('../controllers/sucursal.controller');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

/**
 * Obtener todas las sucursales
 * GET /api/sucursales
 * Requiere autenticación
 */
router.get('/', authenticateToken, sucursalController.getAllSucursales);

/**
 * Obtener una sucursal por ID
 * GET /api/sucursales/:id
 * Requiere autenticación
 */
router.get('/:id', authenticateToken, sucursalController.getSucursalById);

/**
 * Crear una nueva sucursal
 * POST /api/sucursales
 * Requiere autenticación y rol de administrador
 */
router.post('/', authenticateToken, authorizeRoles(1), sucursalController.createSucursal);

/**
 * Actualizar una sucursal
 * PUT /api/sucursales/:id
 * Requiere autenticación y rol de administrador
 */
router.put('/:id', authenticateToken, authorizeRoles(1), sucursalController.updateSucursal);

module.exports = router;


const express = require('express');
const router = express.Router();
const ventaController = require('../controllers/venta.controller');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

/**
 * Obtener todas las ventas
 * GET /api/ventas
 * Requiere autenticación
 * Soporta paginación opcional: ?page=1&limit=10
 */
router.get('/', authenticateToken, ventaController.getAllVentas);

/**
 * Obtener una venta por ID
 * GET /api/ventas/:id
 * Requiere autenticación
 */
router.get('/:id', authenticateToken, ventaController.getVentaById);

/**
 * Registrar una nueva venta
 * POST /api/ventas
 * Requiere autenticación y rol de administrador
 */
router.post('/', authenticateToken, authorizeRoles(1), ventaController.createVenta);

/**
 * Actualizar una venta
 * PUT /api/ventas/:id
 * Requiere autenticación y rol de administrador
 */
router.put('/:id', authenticateToken, authorizeRoles(1), ventaController.updateVenta);

/**
 * Eliminar una venta
 * DELETE /api/ventas/:id
 * Requiere autenticación y rol de administrador
 */
router.delete('/:id', authenticateToken, authorizeRoles(1), ventaController.deleteVenta);

module.exports = router;

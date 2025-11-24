const express = require('express');
const router = express.Router();
const facturaController = require('../controllers/factura.controller');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

/**
 * Obtener todas las facturas
 * GET /api/facturas
 * Requiere autenticación
 * Soporta paginación opcional: ?page=1&limit=10
 */
router.get('/', authenticateToken, facturaController.getAllFacturas);

/**
 * Obtener una factura por ID
 * GET /api/facturas/:id
 * Requiere autenticación
 */
router.get('/:id', authenticateToken, facturaController.getFacturaById);

/**
 * Crear una nueva factura
 * POST /api/facturas
 * Requiere autenticación y rol de administrador
 */
router.post('/', authenticateToken, authorizeRoles(1), facturaController.createFactura);

/**
 * Actualizar una factura
 * PUT /api/facturas/:id
 * Requiere autenticación y rol de administrador
 */
router.put('/:id', authenticateToken, authorizeRoles(1), facturaController.updateFactura);

/**
 * Eliminar una factura
 * DELETE /api/facturas/:id
 * Requiere autenticación y rol de administrador
 */
router.delete('/:id', authenticateToken, authorizeRoles(1), facturaController.deleteFactura);

module.exports = router;

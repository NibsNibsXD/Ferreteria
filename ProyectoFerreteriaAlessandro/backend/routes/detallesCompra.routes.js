const express = require('express');
const router = express.Router();
const detalleCompraController = require('../controllers/detalleCompra.controller');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

/**
 * Obtener todos los detalles de compra
 * GET /api/detalles-compra
 * Requiere autenticación
 * Soporta paginación opcional: ?page=1&limit=10
 */
router.get('/', authenticateToken, detalleCompraController.getAllDetallesCompra);

/**
 * Obtener un detalle de compra por ID
 * GET /api/detalles-compra/:id
 * Requiere autenticación
 */
router.get('/:id', authenticateToken, detalleCompraController.getDetalleCompraById);

/**
 * Crear un nuevo detalle de compra
 * POST /api/detalles-compra
 * Requiere autenticación y rol de administrador
 */
router.post('/', authenticateToken, authorizeRoles(1), detalleCompraController.createDetalleCompra);

/**
 * Actualizar un detalle de compra
 * PUT /api/detalles-compra/:id
 * Requiere autenticación y rol de administrador
 */
router.put('/:id', authenticateToken, authorizeRoles(1), detalleCompraController.updateDetalleCompra);

/**
 * Eliminar un detalle de compra
 * DELETE /api/detalles-compra/:id
 * Requiere autenticación y rol de administrador
 */
router.delete('/:id', authenticateToken, authorizeRoles(1), detalleCompraController.deleteDetalleCompra);

module.exports = router;

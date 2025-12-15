const express = require('express');
const router = express.Router();
const compraController = require('../controllers/compra.controller');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

/**
 * Obtener todas las compras
 * GET /api/compras
 * Requiere autenticación
 * Soporta paginación opcional: ?page=1&limit=10
 */
router.get('/', authenticateToken, compraController.getAllCompras);

/**
 * Obtener una compra por ID
 * GET /api/compras/:id
 * Requiere autenticación
 */
router.get('/:id', authenticateToken, compraController.getCompraById);

/**
 * Registrar una nueva compra
 * POST /api/compras
 * Requiere autenticación (empleados pueden registrar compras)
 */
router.post('/', authenticateToken, compraController.createCompra);

/**
 * Actualizar una compra
 * PUT /api/compras/:id
 * Requiere autenticación y rol de administrador
 */
router.put('/:id', authenticateToken, authorizeRoles(1), compraController.updateCompra);

/**
 * Eliminar una compra
 * DELETE /api/compras/:id
 * Requiere autenticación y rol de administrador
 */
router.delete('/:id', authenticateToken, authorizeRoles(1), compraController.deleteCompra);

module.exports = router;

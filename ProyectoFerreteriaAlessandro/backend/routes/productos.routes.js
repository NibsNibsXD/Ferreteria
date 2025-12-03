const express = require('express');
const router = express.Router();
const productoController = require('../controllers/producto.controller');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

/**
 * Obtener todos los productos
 * GET /api/productos
 * Requiere autenticación
 * Soporta paginación opcional: ?page=1&limit=10
 */
router.get('/', authenticateToken, productoController.getAllProductos);

/**
 * Obtener cantidad de productos activos
 * GET /api/productos/activos/count
 * Requiere autenticación
 */
router.get('/activos/count', authenticateToken, productoController.getProductosActivosCount);

/**
 * Obtener un producto por ID
 * GET /api/productos/:id
 * Requiere autenticación
 */
router.get('/:id', authenticateToken, productoController.getProductoById);

/**
 * Crear un nuevo producto
 * POST /api/productos
 * Requiere autenticación y rol de administrador
 */
router.post('/', authenticateToken, authorizeRoles(1), productoController.createProducto);

/**
 * Actualizar un producto
 * PUT /api/productos/:id
 * Requiere autenticación y rol de administrador
 */
router.put('/:id', authenticateToken, authorizeRoles(1), productoController.updateProducto);

/**
 * Eliminar un producto
 * DELETE /api/productos/:id
 * Requiere autenticación y rol de administrador
 */
router.delete('/:id', authenticateToken, authorizeRoles(1), productoController.deleteProducto);

module.exports = router;

const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoria.controller');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

/**
 * Obtener todas las categorias
 * GET /api/categorias
 * Requiere autenticación
 */
router.get('/', authenticateToken, categoriaController.getAllCategorias);

/**
 * Obtener una categoria por ID
 * GET /api/categorias/:id
 * Requiere autenticación
 */
router.get('/:id', authenticateToken, categoriaController.getCategoriaById);

/**
 * Crear una nueva categoria
 * POST /api/categorias
 * Requiere autenticación y rol de administrador
 */
router.post('/', authenticateToken, authorizeRoles(1), categoriaController.createCategoria);

/**
 * Actualizar una categoria
 * PUT /api/categorias/:id
 * Requiere autenticación y rol de administrador
 */
router.put('/:id', authenticateToken, authorizeRoles(1), categoriaController.updateCategoria);

module.exports = router;

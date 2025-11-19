const express = require('express');
const router = express.Router();
const rolController = require('../controllers/rol.controller');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

/**
 * Obtener todos los roles
 * GET /api/roles
 * Requiere autenticación
 */
router.get('/', authenticateToken, rolController.getAllRoles.bind(rolController));

/**
 * Obtener un rol por ID
 * GET /api/roles/:id
 * Requiere autenticación
 */
router.get('/:id', authenticateToken, rolController.getRolById.bind(rolController));

/**
 * Crear un nuevo rol
 * POST /api/roles
 * Requiere autenticación y rol de administrador
 */
router.post('/', authenticateToken, authorizeRoles(1), rolController.createRol.bind(rolController));

/**
 * Actualizar un rol
 * PUT /api/roles/:id
 * Requiere autenticación y rol de administrador
 */
router.put('/:id', authenticateToken, authorizeRoles(1), rolController.updateRol.bind(rolController));

/**
 * Eliminar un rol
 * DELETE /api/roles/:id
 * Requiere autenticación y rol de administrador
 */
router.delete('/:id', authenticateToken, authorizeRoles(1), rolController.deleteRol.bind(rolController));

/**
 * Obtener usuarios por rol
 * GET /api/roles/:id/usuarios
 * Requiere autenticación
 */
router.get('/:id/usuarios', authenticateToken, rolController.getUsuariosByRol.bind(rolController));

module.exports = router;

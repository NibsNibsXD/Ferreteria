const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// TODO: Descomentar cuando estén implementadas las funciones

/**
 * Obtener todos los usuarios
 * GET /api/usuarios
 * Requiere autenticación
 */
// router.get('/', authenticateToken, usuarioController.getAllUsuarios);

/**
 * Obtener un usuario por ID
 * GET /api/usuarios/:id
 * Requiere autenticación
 */
// router.get('/:id', authenticateToken, usuarioController.getUsuarioById);

/**
 * Crear un nuevo usuario
 * POST /api/usuarios
 * Requiere autenticación y rol de administrador
 */
// router.post('/', authenticateToken, authorizeRoles(1), usuarioController.createUsuario);

/**
 * Actualizar un usuario
 * PUT /api/usuarios/:id
 * Requiere autenticación y rol de administrador
 */
// router.put('/:id', authenticateToken, authorizeRoles(1), usuarioController.updateUsuario);

/**
 * Eliminar/desactivar un usuario
 * DELETE /api/usuarios/:id
 * Requiere autenticación y rol de administrador
 */
// router.delete('/:id', authenticateToken, authorizeRoles(1), usuarioController.deleteUsuario);

module.exports = router;
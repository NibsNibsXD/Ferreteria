const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/', authenticateToken, usuarioController.getAllUsuarios);

router.get('/:id', authenticateToken, usuarioController.getUsuarioById);

router.post('/', authenticateToken, authorizeRoles(1), usuarioController.createUsuario);

router.put('/:id', authenticateToken, authorizeRoles(1), usuarioController.updateUsuario);

router.delete('/:id', authenticateToken, authorizeRoles(1), usuarioController.deleteUsuario);

module.exports = router;
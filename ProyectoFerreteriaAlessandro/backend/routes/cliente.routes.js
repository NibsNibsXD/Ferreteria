const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/cliente.controller');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

/**
 * Obtener todos los clientes
 * GET /api/clientes
 * Requiere autenticación
 */
router.get('/', authenticateToken, clienteController.getAllClientes);

/**
 * Obtener un cliente por ID
 * GET /api/clientes/:id
 * Requiere autenticación
 */
router.get('/:id', authenticateToken, clienteController.getClienteById);

/**
 * Crear un nuevo cliente
 * POST /api/clientes
 * Requiere autenticación
 */
router.post('/', authenticateToken, clienteController.createCliente);

/**
 * Actualizar un cliente
 * PUT /api/clientes/:id
 * Requiere autenticación
 */
router.put('/:id', authenticateToken, clienteController.updateCliente);

module.exports = router;

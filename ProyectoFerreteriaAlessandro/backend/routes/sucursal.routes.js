const express = require('express');
const router = express.Router();
const sucursalController = require('../controllers/sucursal.controller');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');


/**
 * @swagger
 * /api/sucursales:
 *   get:
 *     summary: Obtener todas las sucursales
 *     tags:
 *       - Sucursales
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de sucursales
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_sucursal:
 *                         type: integer
 *                       nombre:
 *                         type: string
 *                       direccion:
 *                         type: string
 *                       telefono:
 *                         type: string
 */
router.get('/', authenticateToken, sucursalController.getAllSucursales);


/**
 * @swagger
 * /api/sucursales/{id}:
 *   get:
 *     summary: Obtener una sucursal por ID
 *     tags:
 *       - Sucursales
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la sucursal
 *     responses:
 *       200:
 *         description: Sucursal encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_sucursal:
 *                       type: integer
 *                     nombre:
 *                       type: string
 *                     direccion:
 *                       type: string
 *                     telefono:
 *                       type: string
 *       404:
 *         description: Sucursal no encontrada
 */
router.get('/:id', authenticateToken, sucursalController.getSucursalById);

/**
 * @swagger
 * /api/sucursales:
 *   post:
 *     summary: Crear una nueva sucursal
 *     tags:
 *       - Sucursales
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               direccion:
 *                 type: string
 *               telefono:
 *                 type: string
 *     responses:
 *       201:
 *         description: Sucursal creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_sucursal:
 *                       type: integer
 *                     nombre:
 *                       type: string
 *                     direccion:
 *                       type: string
 *                     telefono:
 *                       type: string
 */
router.post('/', authenticateToken, authorizeRoles(1), sucursalController.createSucursal);


/**
 * @swagger
 * /api/sucursales/{id}:
 *   put:
 *     summary: Actualizar una sucursal
 *     tags:
 *       - Sucursales
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la sucursal
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               direccion:
 *                 type: string
 *               telefono:
 *                 type: string
 *     responses:
 *       200:
 *         description: Sucursal actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_sucursal:
 *                       type: integer
 *                     nombre:
 *                       type: string
 *                     direccion:
 *                       type: string
 *                     telefono:
 *                       type: string
 *       404:
 *         description: Sucursal no encontrada
 */
router.put('/:id', authenticateToken, authorizeRoles(1), sucursalController.updateSucursal);

module.exports = router;


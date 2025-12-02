const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
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
 *                       id_usuario:
 *                         type: integer
 *                       id_sucursal:
 *                         type: integer
 *                       nombre:
 *                         type: string
 *                       correo:
 *                         type: string
 *                       id_rol:
 *                         type: integer
 *                       estado:
 *                         type: boolean
 *                       fecha_creacion:
 *                         type: string
 *                         format: date-time
 */
router.get('/', authenticateToken, usuarioController.getAllUsuarios);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
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
 *                     id_usuario:
 *                       type: integer
 *                     id_sucursal:
 *                       type: integer
 *                     nombre:
 *                       type: string
 *                     correo:
 *                       type: string
 *                     id_rol:
 *                       type: integer
 *                     estado:
 *                       type: boolean
 *                     fecha_creacion:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/:id', authenticateToken, usuarioController.getUsuarioById);

/**
 * @swagger
 * /api/usuarios:
 *   post:
 *     summary: Crear un nuevo usuario
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_sucursal:
 *                 type: integer
 *               nombre:
 *                 type: string
 *               correo:
 *                 type: string
 *               contrasena:
 *                 type: string
 *               id_rol:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
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
 *                     id_usuario:
 *                       type: integer
 *                     id_sucursal:
 *                       type: integer
 *                     nombre:
 *                       type: string
 *                     correo:
 *                       type: string
 *                     id_rol:
 *                       type: integer
 *                     estado:
 *                       type: boolean
 *                     fecha_creacion:
 *                       type: string
 *                       format: date-time
 */
router.post('/', authenticateToken, authorizeRoles(1), usuarioController.createUsuario);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   put:
 *     summary: Actualizar un usuario
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_sucursal:
 *                 type: integer
 *               nombre:
 *                 type: string
 *               correo:
 *                 type: string
 *               contrasena:
 *                 type: string
 *               id_rol:
 *                 type: integer
 *               estado:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
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
 *                     id_usuario:
 *                       type: integer
 *                     id_sucursal:
 *                       type: integer
 *                     nombre:
 *                       type: string
 *                     correo:
 *                       type: string
 *                     id_rol:
 *                       type: integer
 *                     estado:
 *                       type: boolean
 *                     fecha_creacion:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: Usuario no encontrado
 */
router.put('/:id', authenticateToken, authorizeRoles(1), usuarioController.updateUsuario);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   delete:
 *     summary: Eliminar un usuario
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *       404:
 *         description: Usuario no encontrado
 */
router.delete('/:id', authenticateToken, authorizeRoles(1), usuarioController.deleteUsuario);

module.exports = router;
const express = require('express');
const router = express.Router();
const ventaController = require('../controllers/venta.controller');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/ventas:
 *   post:
 *     summary: Crear una nueva venta
 *     description: |
 *       Este endpoint incluye lógica automática de:
 *       - Actualización de stock de productos
 *       - Detección de productos en bajo stock
 *       - Envío de alertas por correo (si stock <= stock_minimo)
 *     tags:
 *       - Ventas
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_metodo_pago
 *               - productos
 *             properties:
 *               id_cliente:
 *                 type: integer
 *                 example: 5
 *               id_metodo_pago:
 *                 type: integer
 *                 example: 1
 *               productos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - id_producto
 *                     - cantidad
 *                     - precio_unitario
 *                   properties:
 *                     id_producto:
 *                       type: integer
 *                       example: 10
 *                     cantidad:
 *                       type: integer
 *                       example: 5
 *                     precio_unitario:
 *                       type: number
 *                       format: float
 *                       example: 25.50
 *     responses:
 *       201:
 *         description: Venta creada exitosamente
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error del servidor
 */
router.post('/', authenticateToken, ventaController.createVenta);

/**
 * @swagger
 * /api/ventas:
 *   get:
 *     summary: Obtener todas las ventas
 *     tags:
 *       - Ventas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número de página para paginación
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Cantidad de ventas por página
 *     responses:
 *       200:
 *         description: Lista de ventas
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
 */
router.get('/', authenticateToken, ventaController.getAllVentas);

/**
 * @swagger
 * /api/ventas/last-10:
 *   get:
 *     summary: Obtener las últimas 10 ventas
 *     tags:
 *       - Ventas
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de las últimas 10 ventas
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
 *                       id_venta:
 *                         type: integer
 *                       id_factura:
 *                         type: integer
 *                       numero_factura:
 *                         type: string
 *                       total:
 *                         type: number
 *                         format: float
 *                       fecha:
 *                         type: string
 *                         format: date-time
 *                       cliente:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           nombre_completo:
 *                             type: string
 *                       metodo_pago:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           nombre:
 *                             type: string
 */
router.get('/last-10', authenticateToken, ventaController.getTheLast10Ventas);

/**
 * @swagger
 * /api/ventas/count:
 *   get:
 *     summary: Obtener cantidad total de ventas
 *     tags:
 *       - Ventas
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cantidad de ventas
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
 *                     count:
 *                       type: integer
 */
router.get('/count', authenticateToken, ventaController.getVentasCount);

/**
 * @swagger
 * /api/ventas/{id}:
 *   get:
 *     summary: Obtener una venta por ID
 *     tags:
 *       - Ventas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la venta
 *     responses:
 *       200:
 *         description: Venta encontrada
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
 *         description: Venta no encontrada
 *       500:
 *         description: Error del servidor
 */
router.get('/:id', authenticateToken, ventaController.getVentaById);

/**
 * @swagger
 * /api/ventas/{id}:
 *   put:
 *     summary: Actualizar una venta
 *     tags:
 *       - Ventas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la venta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_cliente:
 *                 type: integer
 *               id_metodo_pago:
 *                 type: integer
 *               total:
 *                 type: number
 *                 format: float
 *               estado:
 *                 type: string
 *     responses:
 *       200:
 *         description: Venta actualizada exitosamente
 *       404:
 *         description: Venta no encontrada
 *       500:
 *         description: Error del servidor
 */
router.put('/:id', authenticateToken, authorizeRoles(1), ventaController.updateVenta);

module.exports = router;

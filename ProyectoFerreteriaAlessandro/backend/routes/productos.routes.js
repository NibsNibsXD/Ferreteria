const express = require('express');
const router = express.Router();
const productoController = require('../controllers/producto.controller');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/productos:
 *   get:
 *     summary: Obtener todos los productos
 *     tags:
 *       - Productos
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
 *         description: Cantidad de productos por página
 *     responses:
 *       200:
 *         description: Lista de productos
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
router.get('/', authenticateToken, productoController.getAllProductos);

/**
 * @swagger
 * /api/productos/activos/count:
 *   get:
 *     summary: Obtener cantidad de productos activos
 *     tags:
 *       - Productos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cantidad de productos activos
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
router.get('/activos/count', authenticateToken, productoController.getProductosActivosCount);

/**
 * @swagger
 * /api/productos/inventario/valor:
 *   get:
 *     summary: Obtener valor total del inventario
 *     tags:
 *       - Productos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Valor total del inventario
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
 *                     valorTotal:
 *                       type: number
 *                       format: float
 */
router.get('/inventario/valor', authenticateToken, productoController.getValorInventario);

/**
 * @swagger
 * /api/productos/inventario/all:
 *   get:
 *     summary: Obtener todos los productos para inventario
 *     tags:
 *       - Productos
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
 *         description: Cantidad de productos por página
 *     responses:
 *       200:
 *         description: Lista de productos para inventario
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
 *                       id_producto:
 *                         type: integer
 *                       nombre:
 *                         type: string
 *                       codigo:
 *                         type: string
 *                       categoria:
 *                         type: string
 *                       compra:
 *                         type: number
 *                         format: float
 *                       venta:
 *                         type: number
 *                         format: float
 *                       stock:
 *                         type: integer
 *                       estado:
 *                         type: string
 */
router.get('/inventario/all', authenticateToken, productoController.getAllProductosInventario);

/**
 * @swagger
 * /api/productos/bajo-stock/count:
 *   get:
 *     summary: Obtener cantidad de productos con bajo stock
 *     tags:
 *       - Productos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cantidad de productos con bajo stock
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
router.get('/bajo-stock/count', authenticateToken, productoController.getProductosBajoStockCount);

/**
 * @swagger
 * /api/productos/bajo-stock/list:
 *   get:
 *     summary: Obtener los 10 productos con bajo stock
 *     tags:
 *       - Productos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de 10 productos con bajo stock
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
 *                       id_producto:
 *                         type: integer
 *                       nombre_producto:
 *                         type: string
 *                       categoria:
 *                         type: string
 *                       cantidad:
 *                         type: integer
 *                       minimo:
 *                         type: integer
 */
router.get('/bajo-stock/list', authenticateToken, productoController.getThe10ProductConBajoStock);

/**
 * @swagger
 * /api/productos/{id}:
 *   get:
 *     summary: Obtener un producto por ID
 *     tags:
 *       - Productos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto encontrado
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
 *         description: Producto no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/:id', authenticateToken, productoController.getProductoById);

/**
 * @swagger
 * /api/productos:
 *   post:
 *     summary: Crear un nuevo producto
 *     tags:
 *       - Productos
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - precio_compra
 *               - precio_venta
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               codigo_barra:
 *                 type: string
 *               id_categoria:
 *                 type: integer
 *               precio_compra:
 *                 type: number
 *                 format: float
 *               precio_venta:
 *                 type: number
 *                 format: float
 *               stock:
 *                 type: integer
 *               stock_minimo:
 *                 type: integer
 *               activo:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error del servidor
 */
router.post('/', authenticateToken, authorizeRoles(1), productoController.createProducto);

/**
 * @swagger
 * /api/productos/{id}:
 *   put:
 *     summary: Actualizar un producto
 *     tags:
 *       - Productos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               codigo_barra:
 *                 type: string
 *               id_categoria:
 *                 type: integer
 *               precio_compra:
 *                 type: number
 *                 format: float
 *               precio_venta:
 *                 type: number
 *                 format: float
 *               stock:
 *                 type: integer
 *               stock_minimo:
 *                 type: integer
 *               activo:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Producto actualizado exitosamente
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error del servidor
 */
router.put('/:id', authenticateToken, authorizeRoles(1), productoController.updateProducto);

/**
 * @swagger
 * /api/productos/{id}:
 *   delete:
 *     summary: Eliminar un producto
 *     tags:
 *       - Productos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto eliminado exitosamente
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete('/:id', authenticateToken, authorizeRoles(1), productoController.deleteProducto);

module.exports = router;

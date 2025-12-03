const express = require('express');
const router = express.Router();
const alertasController = require('../controllers/alertasBajoStock.controller');
const { authenticateToken } = require('../middleware/authMiddleware');



/**
 * @swagger
 * /api/alertas/productos-agotados:
 *   get:
 *     summary: Obtener cantidad de productos agotados
 *     tags:
 *       - Alertas Bajo Stock
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cantidad de productos agotados
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
 *                     cantidad:
 *                       type: integer
 */
router.get('/productos-agotados', authenticateToken, alertasController.getCantProductosAgotados);


/**
 * @swagger
 * /api/alertas/productos-stock-minimo:
 *   get:
 *     summary: Obtener cantidad de productos con stock en mínimo
 *     tags:
 *       - Alertas Bajo Stock
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cantidad de productos con stock en mínimo
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
 *                     cantidad:
 *                       type: integer
 */
router.get('/productos-stock-minimo', authenticateToken, alertasController.getCantConStockEnMinimo);


/**
 * @swagger
 * /api/alertas/productos-bajo-stock:
 *   get:
 *     summary: Obtener todos los productos con stock en mínimo
 *     tags:
 *       - Alertas Bajo Stock
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de productos con stock en mínimo
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
 *                       id:
 *                         type: integer
 *                       nombre:
 *                         type: string
 *                       stock:
 *                         type: integer
 *                       stockMinimo:
 *                         type: integer
 *                       categoria:
 *                         type: string
 */
router.get('/productos-bajo-stock', authenticateToken, alertasController.getAllProductsConStockMinimo);

module.exports = router;

const express = require('express');
const router = express.Router();
const alertasController = require('../controllers/alertasBajoStock.controller');
const { authenticateToken } = require('../middleware/authMiddleware');


/**
 * @swagger
 * /alertas/productos-agotados:
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

router.get('/productos-stock-minimo', authenticateToken, alertasController.getCantConStockEnMinimo);

router.get('/productos-bajo-stock', authenticateToken, alertasController.getAllProductsConStockMinimo);

module.exports = router;

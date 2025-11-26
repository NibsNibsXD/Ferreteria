const express = require('express');
const router = express.Router();
const alertasController = require('../controllers/alertasBajoStock.controller');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/productos-agotados', authenticateToken, alertasController.getCantProductosAgotados);

router.get('/productos-stock-minimo', authenticateToken, alertasController.getCantConStockEnMinimo);


router.get('/productos-bajo-stock', authenticateToken, alertasController.getAllProductsConStockMinimo);
router.get('/productos-bajo-stock/excel', authenticateToken, alertasController.downloadExcelBajoStock);

module.exports = router;

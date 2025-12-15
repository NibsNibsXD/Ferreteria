const express = require('express');
const router = express.Router();
const devolucionController = require('../controllers/devolucion.controller');

// GET /devoluciones
router.get('/', devolucionController.getAllDevoluciones);

// POST /devoluciones
router.post('/', devolucionController.crearDevolucion);

// GET /devoluciones/venta/:id_venta
router.get('/venta/:id_venta', devolucionController.getDevolucionPorVenta);

module.exports = router;

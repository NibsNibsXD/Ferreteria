const express = require('express');
const router = express.Router();

// ============================================
// RUTAS SECUNDARIAS
// ============================================

/**
 * Ruta de prueba básica
 * GET /api/test
 */
router.get('/test', (req, res) => {
    res.json({ 
        message: 'API Ferretería Alessandro funcionando correctamente!',
        timestamp: new Date().toISOString()
    });
});

// ============================================
// ADMINISTRADOR DE ROUTES
// ============================================

// Importar rutas de módulos específicos
const rolesRoutes = require('./rol.routes');
const sucursalesRoutes = require('./sucursal.routes');
const usuariosRoutes = require('./usuario.routes');
const cajasRoutes = require('./caja.routes');
const cierresRoutes = require('./cierreCaja.routes');
const clientesRoutes = require('./cliente.routes');
const categoriasRoutes = require('./categoria.routes');
const comprasRoutes = require('./compras.routes');
const metodosPagoRoutes = require('./metodosPago.routes');
// const productosRoutes = require('./productos.routes');
const productosRoutes = require('./productos.routes');
// const ventasRoutes = require('./ventas.routes');
const reportesRoutes = require('./reportes.routes');
const facturasRoutes = require('./facturas.routes');

const ventasRoutes = require('./ventas.routes');

const detallesCompraRoutes = require('./detallesCompra.routes');
const alertasBajoStockRoutes = require('./alertasBajoStock.routes');
const devolucionesRoutes = require('./devoluciones.routes');

// Montar rutas
router.use('/roles', rolesRoutes);
router.use('/sucursales', sucursalesRoutes);
router.use('/usuarios', usuariosRoutes);
router.use('/cajas', cajasRoutes);
router.use('/cierres', cierresRoutes);
router.use('/clientes', clientesRoutes);
router.use('/categorias', categoriasRoutes);
router.use('/compras', comprasRoutes);
router.use('/metodos-pago', metodosPagoRoutes);
// router.use('/productos', productosRoutes);
router.use('/productos', productosRoutes);
// router.use('/ventas', ventasRoutes);
router.use('/reportes', reportesRoutes);
router.use('/facturas', facturasRoutes);
router.use('/ventas', ventasRoutes);
router.use('/detalles-compra', detallesCompraRoutes);
router.use('/alertas', alertasBajoStockRoutes);
router.use('/devoluciones', devolucionesRoutes);

module.exports = router;

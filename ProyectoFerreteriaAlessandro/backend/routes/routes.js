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
// const productosRoutes = require('./productos.routes');
// const ventasRoutes = require('./ventas.routes');
// const comprasRoutes = require('./compras.routes');

// Montar rutas
router.use('/roles', rolesRoutes);
router.use('/sucursales', sucursalesRoutes);
router.use('/usuarios', usuariosRoutes);
// router.use('/productos', productosRoutes);
// router.use('/productos', productosRoutes);
// router.use('/ventas', ventasRoutes);
// router.use('/compras', comprasRoutes);

module.exports = router;

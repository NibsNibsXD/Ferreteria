const express = require('express');
const router = express.Router();
const reportesController = require('../controllers/reportes.controller');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// ============================================
// RUTAS DE REPORTES - JSON
// ============================================

/**
 * Obtener reporte de ventas por periodo
 * GET /api/reportes/ventas
 * Query params: ?desde=YYYY-MM-DD&hasta=YYYY-MM-DD
 * Requiere autenticación
 */
router.get('/ventas', authenticateToken, reportesController.getVentas);

/**
 * Obtener reporte de compras por periodo
 * GET /api/reportes/compras
 * Query params: ?desde=YYYY-MM-DD&hasta=YYYY-MM-DD
 * Requiere autenticación
 */
router.get('/compras', authenticateToken, reportesController.getCompras);

/**
 * Obtener reporte de inventario actual
 * GET /api/reportes/inventario
 * Requiere autenticación
 */
router.get('/inventario', authenticateToken, reportesController.getInventario);

/**
 * Obtener productos con bajo stock
 * GET /api/reportes/inventario/bajo-stock
 * Requiere autenticación
 */
router.get('/inventario/bajo-stock', authenticateToken, reportesController.getProductosBajoStock);

/**
 * Obtener productos más vendidos
 * GET /api/reportes/productos/mas-vendidos
 * Query params: ?limit=20&desde=YYYY-MM-DD&hasta=YYYY-MM-DD
 * Requiere autenticación
 */
router.get('/productos/mas-vendidos', authenticateToken, reportesController.getProductosMasVendidos);

/**
 * Obtener clientes más frecuentes
 * GET /api/reportes/clientes/frecuentes
 * Query params: ?limit=20&desde=YYYY-MM-DD&hasta=YYYY-MM-DD
 * Requiere autenticación
 */
router.get('/clientes/frecuentes', authenticateToken, reportesController.getClientesFrecuentes);

// ============================================
// RUTAS DE EXPORTACIÓN - EXCEL/PDF
// ============================================

/**
 * Exportar reporte de ventas
 * GET /api/reportes/ventas/export
 * Query params: ?formato=excel|pdf&desde=YYYY-MM-DD&hasta=YYYY-MM-DD
 * Requiere autenticación y rol de administrador
 */
router.get('/ventas/export', authenticateToken, authorizeRoles(1), reportesController.exportVentas);

/**
 * Exportar reporte de compras
 * GET /api/reportes/compras/export
 * Query params: ?formato=excel|pdf&desde=YYYY-MM-DD&hasta=YYYY-MM-DD
 * Requiere autenticación y rol de administrador
 */
router.get('/compras/export', authenticateToken, authorizeRoles(1), reportesController.exportCompras);

/**
 * Exportar reporte de inventario
 * GET /api/reportes/inventario/export
 * Query params: ?formato=excel|pdf
 * Requiere autenticación y rol de administrador
 */
router.get('/inventario/export', authenticateToken, authorizeRoles(1), reportesController.exportInventario);

/**
 * Exportar productos con bajo stock
 * GET /api/reportes/inventario/bajo-stock/export
 * Query params: ?formato=excel|pdf
 * Requiere autenticación y rol de administrador
 */
router.get('/inventario/bajo-stock/export', authenticateToken, authorizeRoles(1), reportesController.exportProductosBajoStock);

/**
 * Exportar productos más vendidos
 * GET /api/reportes/productos/mas-vendidos/export
 * Query params: ?formato=excel|pdf&limit=20&desde=YYYY-MM-DD&hasta=YYYY-MM-DD
 * Requiere autenticación y rol de administrador
 */
router.get('/productos/mas-vendidos/export', authenticateToken, authorizeRoles(1), reportesController.exportProductosMasVendidos);

/**
 * Exportar clientes más frecuentes
 * GET /api/reportes/clientes/frecuentes/export
 * Query params: ?formato=excel|pdf&limit=20&desde=YYYY-MM-DD&hasta=YYYY-MM-DD
 * Requiere autenticación y rol de administrador
 */
router.get('/clientes/frecuentes/export', authenticateToken, authorizeRoles(1), reportesController.exportClientesFrecuentes);

module.exports = router;

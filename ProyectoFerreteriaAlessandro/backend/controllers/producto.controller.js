const productoService = require('../services/producto.service');

/**
 * Obtener todos los productos
 * GET /api/productos
 * Soporta paginación opcional mediante query params: ?page=1&limit=10
 */
const getAllProductos = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const productos = await productoService.getAllProductos({ page, limit });
    res.json({
      success: true,
      data: productos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Obtener un producto por ID
 * GET /api/productos/:id
 */
const getProductoById = async (req, res) => {
  try {
    const producto = await productoService.getProductoById(req.params.id);
    res.json({
      success: true,
      data: producto
    });
  } catch (error) {
    const statusCode = error.message === 'Producto no encontrado' ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Crear un nuevo producto
 * POST /api/productos
 */
const createProducto = async (req, res) => {
  try {
    const nuevoProducto = await productoService.createProducto(req.body);
    res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente',
      data: nuevoProducto
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Actualizar un producto
 * PUT /api/productos/:id
 */
const updateProducto = async (req, res) => {
  try {
    const productoActualizado = await productoService.updateProducto(req.params.id, req.body);
    res.json({
      success: true,
      message: 'Producto actualizado exitosamente',
      data: productoActualizado
    });
  } catch (error) {
    const statusCode = error.message === 'Producto no encontrado' ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Eliminar un producto
 * DELETE /api/productos/:id
 */
const deleteProducto = async (req, res) => {
  try {
    await productoService.deleteProducto(req.params.id);
    res.json({
      success: true,
      message: 'Producto eliminado exitosamente'
    });
  } catch (error) {
    const statusCode = error.message === 'Producto no encontrado' ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Obtener los 10 productos con bajo stock
 * GET /api/productos/bajo-stock/list
 */
const getThe10ProductConBajoStock = async (req, res) => {
  try {
    const productos = await productoService.getThe10ProductConBajoStock();
    res.status(200).json({
      success: true,
      data: productos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Obtener todos los productos para inventario
 * GET /api/productos/inventario/all
 * Soporta paginación opcional mediante query params: ?page=1&limit=10
 */
const getAllProductosInventario = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const productos = await productoService.getAllProductosInventario({ page, limit });
    res.status(200).json({
      success: true,
      data: productos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  getAllProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto,
  getThe10ProductConBajoStock,
  getAllProductosInventario
};

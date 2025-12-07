const categoriaService = require('../services/categoria.service');

/**
 * Obtener todas las categorias
 * GET /api/categorias
 */
const getAllCategorias = async (req, res) => {
  try {
    const categorias = await categoriaService.getAllCategorias();
    res.json(categorias); // Devuelve solo el array
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Obtener una categoria por ID
 * GET /api/categorias/:id
 */
const getCategoriaById = async (req, res) => {
  try {
    const categoria = await categoriaService.getCategoriaById(req.params.id);
    res.json({ success: true, data: categoria });
  } catch (error) {
    const statusCode = error.message === 'Categoria no encontrada' ? 404 : 500;
    res.status(statusCode).json({ success: false, error: error.message });
  }
};

/**
 * Crear una nueva categoria
 * POST /api/categorias
 */
const createCategoria = async (req, res) => {
  try {
    console.log('POST /api/categorias body:', req.body); // Log para depuración
    const nueva = await categoriaService.createCategoria(req.body);
    res.status(201).json({ success: true, message: 'Categoria creada exitosamente', data: nueva });
  } catch (error) {
    console.error('Error al crear categoria:', error); // Log para depuración
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Actualizar una categoria
 * PUT /api/categorias/:id
 */
const updateCategoria = async (req, res) => {
  try {
    const actualizada = await categoriaService.updateCategoria(req.params.id, req.body);
    res.json({ success: true, message: 'Categoria actualizada exitosamente', data: actualizada });
  } catch (error) {
    const statusCode = error.message === 'Categoria no encontrada' ? 404 : 500;
    res.status(statusCode).json({ success: false, error: error.message });
  }
};

module.exports = {
  getAllCategorias,
  getCategoriaById,
  createCategoria,
  updateCategoria
};

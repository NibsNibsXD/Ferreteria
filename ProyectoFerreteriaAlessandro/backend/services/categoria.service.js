const db = require('../models');

/**
 * Obtener todas las categorias
 */
const getAllCategorias = async () => {
  try {
    const categorias = await db.Categoria.findAll({
      order: [['id_categoria', 'ASC']]
    });
    return categorias;
  } catch (error) {
    throw new Error(`Error al obtener categorias: ${error.message}`);
  }
};

/**
 * Obtener una categoria por ID
 */
const getCategoriaById = async (id) => {
  try {
    const categoria = await db.Categoria.findByPk(id);
    if (!categoria) {
      throw new Error('Categoria no encontrada');
    }
    return categoria;
  } catch (error) {
    throw error;
  }
};

/**
 * Crear una nueva categoria
 */
const createCategoria = async (data) => {
  try {
    const { nombre, descripcion } = data;
    if (!nombre || nombre.trim() === '') {
      throw new Error('El nombre de la categoria es requerido');
    }

    const existente = await db.Categoria.findOne({ where: { nombre: nombre.trim() } });
    if (existente) {
      throw new Error('Ya existe una categoria con ese nombre');
    }

    const nueva = await db.Categoria.create({
      nombre: nombre.trim(),
      descripcion: descripcion ? descripcion.trim() : null,
      activo: true
    });

    return nueva;
  } catch (error) {
    throw error;
  }
};

/**
 * Actualizar una categoria
 */
const updateCategoria = async (id, data) => {
  try {
    const categoria = await db.Categoria.findByPk(id);
    if (!categoria) {
      throw new Error('Categoria no encontrada');
    }

    const { nombre, descripcion, activo } = data;

    if (nombre && nombre.trim() !== categoria.nombre) {
      const existente = await db.Categoria.findOne({ where: { nombre: nombre.trim() } });
      if (existente && existente.id_categoria !== categoria.id_categoria) {
        throw new Error('Ya existe otra categoria con ese nombre');
      }
    }

    await categoria.update({
      nombre: nombre ? nombre.trim() : categoria.nombre,
      descripcion: descripcion !== undefined ? (descripcion ? descripcion.trim() : null) : categoria.descripcion,
      activo: activo !== undefined ? !!activo : categoria.activo
    });

    return categoria;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllCategorias,
  getCategoriaById,
  createCategoria,
  updateCategoria
};

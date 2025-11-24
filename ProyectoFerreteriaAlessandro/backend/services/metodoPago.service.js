const db = require('../models');

/**
 * Obtener todos los métodos de pago
 */
const getAllMetodosPago = async () => {
  try {
    const metodos = await db.MetodoPago.findAll({
      order: [['id_metodo_pago', 'ASC']]
    });
    return metodos;
  } catch (error) {
    throw new Error(`Error al obtener métodos de pago: ${error.message}`);
  }
};

/**
 * Obtener un método de pago por ID
 */
const getMetodoPagoById = async (id) => {
  try {
    const metodo = await db.MetodoPago.findByPk(id);

    if (!metodo) {
      throw new Error('Método de pago no encontrado');
    }

    return metodo;
  } catch (error) {
    throw error;
  }
};

/**
 * Crear un nuevo método de pago
 */
const createMetodoPago = async (data) => {
  try {
    const { nombre, descripcion, activo } = data;

    // Validar que el nombre no esté vacío
    if (!nombre || nombre.trim() === '') {
      throw new Error('El nombre del método de pago es requerido');
    }

    // Verificar si ya existe un método de pago con ese nombre
    const metodoExistente = await db.MetodoPago.findOne({
      where: { nombre: nombre.trim() }
    });

    if (metodoExistente) {
      throw new Error('Ya existe un método de pago con ese nombre');
    }

    const nuevoMetodo = await db.MetodoPago.create({
      nombre: nombre.trim(),
      descripcion: descripcion ? descripcion.trim() : null,
      activo: activo !== undefined ? activo : true
    });

    return nuevoMetodo;
  } catch (error) {
    throw error;
  }
};

/**
 * Actualizar un método de pago
 */
const updateMetodoPago = async (id, data) => {
  try {
    const metodo = await db.MetodoPago.findByPk(id);

    if (!metodo) {
      throw new Error('Método de pago no encontrado');
    }

    const { nombre, descripcion, activo } = data;

    // Si se está actualizando el nombre, verificar que no exista otro método con ese nombre
    if (nombre && nombre.trim() !== metodo.nombre) {
      const metodoExistente = await db.MetodoPago.findOne({
        where: { nombre: nombre.trim() }
      });

      if (metodoExistente) {
        throw new Error('Ya existe un método de pago con ese nombre');
      }
    }

    await metodo.update({
      nombre: nombre ? nombre.trim() : metodo.nombre,
      descripcion: descripcion !== undefined ? (descripcion ? descripcion.trim() : null) : metodo.descripcion,
      activo: activo !== undefined ? activo : metodo.activo
    });

    return metodo;
  } catch (error) {
    throw error;
  }
};

/**
 * Eliminar un método de pago
 */
const deleteMetodoPago = async (id) => {
  try {
    const metodo = await db.MetodoPago.findByPk(id);

    if (!metodo) {
      throw new Error('Método de pago no encontrado');
    }

    await metodo.destroy();
    return { message: 'Método de pago eliminado exitosamente' };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllMetodosPago,
  getMetodoPagoById,
  createMetodoPago,
  updateMetodoPago,
  deleteMetodoPago
};

const db = require('../models');

/**
 * Obtener todas las sucursales
 */
const getAllSucursales = async () => {
  try {
    const sucursales = await db.Sucursal.findAll({
      order: [['id_sucursal', 'ASC']]
    });
    return sucursales;
  } catch (error) {
    throw new Error(`Error al obtener sucursales: ${error.message}`);
  }
};

/**
 * Obtener una sucursal por ID
 */
const getSucursalById = async (id) => {
  try {
    const sucursal = await db.Sucursal.findByPk(id);
    
    if (!sucursal) {
      throw new Error('Sucursal no encontrada');
    }
    
    return sucursal;
  } catch (error) {
    throw error;
  }
};

/**
 * Crear una nueva sucursal
 */
const createSucursal = async (data) => {
  try {
    const { nombre, direccion, telefono } = data;

    // Validar que el nombre no esté vacío
    if (!nombre || nombre.trim() === '') {
      throw new Error('El nombre de la sucursal es requerido');
    }

    // Verificar si ya existe una sucursal con ese nombre
    const sucursalExistente = await db.Sucursal.findOne({
      where: { nombre: nombre.trim() }
    });

    if (sucursalExistente) {
      throw new Error('Ya existe una sucursal con ese nombre');
    }

    const nuevaSucursal = await db.Sucursal.create({
      nombre: nombre.trim(),
      direccion: direccion ? direccion.trim() : null,
      telefono: telefono ? telefono.trim() : null
    });

    return nuevaSucursal;
  } catch (error) {
    throw error;
  }
};

/**
 * Actualizar una sucursal
 */
const updateSucursal = async (id, data) => {
  try {
    const sucursal = await db.Sucursal.findByPk(id);

    if (!sucursal) {
      throw new Error('Sucursal no encontrada');
    }

    const { nombre, direccion, telefono } = data;

    // Si se está actualizando el nombre, verificar que no exista otra sucursal con ese nombre
    if (nombre && nombre.trim() !== sucursal.nombre) {
      const sucursalExistente = await db.Sucursal.findOne({
        where: { nombre: nombre.trim() }
      });

      if (sucursalExistente) {
        throw new Error('Ya existe una sucursal con ese nombre');
      }
    }

    await sucursal.update({
      nombre: nombre ? nombre.trim() : sucursal.nombre,
      direccion: direccion !== undefined ? (direccion ? direccion.trim() : null) : sucursal.direccion,
      telefono: telefono !== undefined ? (telefono ? telefono.trim() : null) : sucursal.telefono
    });

    return sucursal;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllSucursales,
  getSucursalById,
  createSucursal,
  updateSucursal
};



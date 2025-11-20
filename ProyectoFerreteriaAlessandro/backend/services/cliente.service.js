const db = require('../models');

/**
 * Obtener todos los clientes
 */
const getAllClientes = async () => {
  try {
    const clientes = await db.Cliente.findAll({
      order: [['id_cliente', 'ASC']]
    });
    return clientes;
  } catch (error) {
    throw new Error(`Error al obtener clientes: ${error.message}`);
  }
};

/**
 * Obtener un cliente por ID
 */
const getClienteById = async (id) => {
  try {
    const cliente = await db.Cliente.findByPk(id, {
      include: [{ model: db.Venta, as: 'ventas' }]
    });
    if (!cliente) {
      throw new Error('Cliente no encontrado');
    }
    return cliente;
  } catch (error) {
    throw error;
  }
};

/**
 * Crear un nuevo cliente
 */
const createCliente = async (data) => {
  try {
    const { nombre, direccion, telefono, correo } = data;
    if (!nombre || nombre.trim() === '') {
      throw new Error('El nombre del cliente es requerido');
    }

    const nuevo = await db.Cliente.create({
      nombre: nombre.trim(),
      direccion: direccion ? direccion.trim() : null,
      telefono: telefono ? telefono.trim() : null,
      correo: correo ? correo.trim() : null,
      fecha_registro: new Date()
    });

    return nuevo;
  } catch (error) {
    throw error;
  }
};

/**
 * Actualizar un cliente
 */
const updateCliente = async (id, data) => {
  try {
    const cliente = await db.Cliente.findByPk(id);
    if (!cliente) {
      throw new Error('Cliente no encontrado');
    }

    const { nombre, direccion, telefono, correo } = data;

    await cliente.update({
      nombre: nombre ? nombre.trim() : cliente.nombre,
      direccion: direccion !== undefined ? (direccion ? direccion.trim() : null) : cliente.direccion,
      telefono: telefono !== undefined ? (telefono ? telefono.trim() : null) : cliente.telefono,
      correo: correo !== undefined ? (correo ? correo.trim() : null) : cliente.correo
    });

    return cliente;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllClientes,
  getClienteById,
  createCliente,
  updateCliente
};

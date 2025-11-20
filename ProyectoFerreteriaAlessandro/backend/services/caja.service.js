const db = require('../models');

/**
 * Obtener todas las cajas
 */
const getAllCajas = async () => {
  try {
    const cajas = await db.Caja.findAll({
      order: [['id_caja', 'ASC']],
      include: [
        { model: db.Usuario, as: 'usuario', attributes: ['id_usuario', 'nombre', 'correo'] },
        { model: db.Sucursal, as: 'sucursal', attributes: ['id_sucursal', 'nombre'] }
      ]
    });
    return cajas;
  } catch (error) {
    throw new Error(`Error al obtener cajas: ${error.message}`);
  }
};

/**
 * Obtener una caja por ID
 */
const getCajaById = async (id) => {
  try {
    const caja = await db.Caja.findByPk(id, {
      include: [
        { model: db.Usuario, as: 'usuario', attributes: ['id_usuario', 'nombre', 'correo'] },
        { model: db.Sucursal, as: 'sucursal', attributes: ['id_sucursal', 'nombre'] },
        { model: db.CierreCaja, as: 'cierres' }
      ]
    });

    if (!caja) {
      throw new Error('Caja no encontrada');
    }

    return caja;
  } catch (error) {
    throw error;
  }
};

/**
 * Crear una nueva caja
 */
const createCaja = async (data) => {
  try {
    const { nombre, saldo_inicial, id_usuario, id_sucursal } = data;

    if (!nombre || nombre.trim() === '') {
      throw new Error('El nombre de la caja es requerido');
    }

    // Verificar si existe otra caja con el mismo nombre en la misma sucursal
    const cajaExistente = await db.Caja.findOne({
      where: {
        nombre: nombre.trim(),
        id_sucursal: id_sucursal || null
      }
    });

    if (cajaExistente) {
      throw new Error('Ya existe una caja con ese nombre en la sucursal');
    }

    const nuevaCaja = await db.Caja.create({
      nombre: nombre.trim(),
      saldo_inicial: saldo_inicial !== undefined ? saldo_inicial : 0,
      id_usuario: id_usuario || null,
      id_sucursal: id_sucursal || null
    });

    return nuevaCaja;
  } catch (error) {
    throw error;
  }
};

/**
 * Actualizar una caja
 */
const updateCaja = async (id, data) => {
  try {
    const caja = await db.Caja.findByPk(id);

    if (!caja) {
      throw new Error('Caja no encontrada');
    }

    const { nombre, saldo_inicial, id_usuario, id_sucursal } = data;

    if (nombre && nombre.trim() !== caja.nombre) {
      const cajaExistente = await db.Caja.findOne({
        where: {
          nombre: nombre.trim(),
          id_sucursal: id_sucursal !== undefined ? id_sucursal : caja.id_sucursal
        }
      });

      if (cajaExistente && cajaExistente.id_caja !== caja.id_caja) {
        throw new Error('Ya existe otra caja con ese nombre en la sucursal');
      }
    }

    await caja.update({
      nombre: nombre ? nombre.trim() : caja.nombre,
      saldo_inicial: saldo_inicial !== undefined ? saldo_inicial : caja.saldo_inicial,
      id_usuario: id_usuario !== undefined ? id_usuario : caja.id_usuario,
      id_sucursal: id_sucursal !== undefined ? id_sucursal : caja.id_sucursal
    });

    return caja;
  } catch (error) {
    throw error;
  }
};

/**
 * Eliminar una caja
 */

/**
 * Obtener cierres por caja
 */
const getCierresByCaja = async (id) => {
  try {
    const caja = await db.Caja.findByPk(id, {
      include: [{ model: db.CierreCaja, as: 'cierres' }]
    });

    if (!caja) {
      throw new Error('Caja no encontrada');
    }

    return caja.cierres;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllCajas,
  getCajaById,
  createCaja,
  updateCaja,
  getCierresByCaja
};

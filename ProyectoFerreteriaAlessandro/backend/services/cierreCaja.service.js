const db = require('../models');

/**
 * Obtener todos los cierres de caja
 */
const getAllCierres = async () => {
  try {
    const cierres = await db.CierreCaja.findAll({
      order: [['id_cierre', 'DESC']],
      include: [
        { model: db.Usuario, as: 'usuario', attributes: ['id_usuario', 'nombre', 'correo'] },
        { model: db.Caja, as: 'caja', attributes: ['id_caja', 'nombre', 'id_sucursal'] }
      ]
    });
    return cierres;
  } catch (error) {
    throw new Error(`Error al obtener cierres: ${error.message}`);
  }
};

/**
 * Obtener un cierre por ID
 */
const getCierreById = async (id) => {
  try {
    const cierre = await db.CierreCaja.findByPk(id, {
      include: [
        { model: db.Usuario, as: 'usuario', attributes: ['id_usuario', 'nombre', 'correo'] },
        { model: db.Caja, as: 'caja', attributes: ['id_caja', 'nombre', 'id_sucursal'] }
      ]
    });

    if (!cierre) {
      throw new Error('Cierre no encontrado');
    }

    return cierre;
  } catch (error) {
    throw error;
  }
};

/**
 * Crear un cierre de caja
 */
const createCierre = async (data) => {
  try {
    const { id_usuario, id_caja, saldo_inicial, total_ventas, total_devoluciones, total_neto, efectivo_esperado, efectivo_contado, diferencia } = data;

    if (!id_caja) {
      throw new Error('El id_caja es requerido');
    }
    if (!id_usuario) {
      throw new Error('El id_usuario es requerido');
    }

    // Verificar que la caja exista
    const caja = await db.Caja.findByPk(id_caja);
    if (!caja) {
      throw new Error('Caja no existente');
    }

    // Verificar que el usuario exista
    const usuario = await db.Usuario.findByPk(id_usuario);
    if (!usuario) {
      throw new Error('Usuario no existente');
    }

    const nuevoCierre = await db.CierreCaja.create({
      id_usuario,
      id_caja,
      saldo_inicial: saldo_inicial !== undefined ? saldo_inicial : caja.saldo_inicial || 0,
      total_ventas: total_ventas !== undefined ? total_ventas : 0,
      total_devoluciones: total_devoluciones !== undefined ? total_devoluciones : 0,
      total_neto: total_neto !== undefined ? total_neto : null,
      efectivo_esperado: efectivo_esperado !== undefined ? efectivo_esperado : null,
      efectivo_contado: efectivo_contado !== undefined ? efectivo_contado : null,
      diferencia: diferencia !== undefined ? diferencia : null
    });

    return nuevoCierre;
  } catch (error) {
    throw error;
  }
};

/**
 * Actualizar un cierre
 */
const updateCierre = async (id, data) => {
  try {
    const cierre = await db.CierreCaja.findByPk(id);
    if (!cierre) {
      throw new Error('Cierre no encontrado');
    }

    const { id_usuario, id_caja, saldo_inicial, total_ventas, total_devoluciones, total_neto } = data;

    if (id_caja !== undefined) {
      const caja = await db.Caja.findByPk(id_caja);
      if (!caja) throw new Error('Caja no existente');
    }
    if (id_usuario !== undefined) {
      const usuario = await db.Usuario.findByPk(id_usuario);
      if (!usuario) throw new Error('Usuario no existente');
    }

    await cierre.update({
      id_usuario: id_usuario !== undefined ? id_usuario : cierre.id_usuario,
      id_caja: id_caja !== undefined ? id_caja : cierre.id_caja,
      saldo_inicial: saldo_inicial !== undefined ? saldo_inicial : cierre.saldo_inicial,
      total_ventas: total_ventas !== undefined ? total_ventas : cierre.total_ventas,
      total_devoluciones: total_devoluciones !== undefined ? total_devoluciones : cierre.total_devoluciones,
      total_neto: total_neto !== undefined ? total_neto : cierre.total_neto
    });

    return cierre;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllCierres,
  getCierreById,
  createCierre,
  updateCierre
};

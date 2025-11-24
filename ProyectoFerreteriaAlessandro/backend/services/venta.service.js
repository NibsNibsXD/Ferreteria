const db = require('../models');

/**
 * Obtener todas las ventas
 * Soporta paginación opcional mediante page y limit
 */
const getAllVentas = async ({ page, limit } = {}) => {
  try {
    const options = {
      include: [
        { model: db.Usuario, as: 'usuario', attributes: ['id_usuario', 'nombre', 'correo'] },
        { model: db.Cliente, as: 'cliente', attributes: ['id_cliente', 'nombre', 'telefono'] },
        { model: db.MetodoPago, as: 'metodo_pago', attributes: ['id_metodo_pago', 'nombre'] },
        { model: db.Factura, as: 'factura' }
      ],
      order: [['fecha', 'DESC']]
    };

    // Si se proporcionan page y limit, aplicar paginación
    if (page && limit) {
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);

      if (pageNum > 0 && limitNum > 0) {
        options.offset = (pageNum - 1) * limitNum;
        options.limit = limitNum;
      }
    }

    const ventas = await db.Venta.findAll(options);
    return ventas;
  } catch (error) {
    throw new Error(`Error al obtener ventas: ${error.message}`);
  }
};

/**
 * Obtener una venta por ID
 */
const getVentaById = async (id) => {
  try {
    const venta = await db.Venta.findByPk(id, {
      include: [
        { model: db.Usuario, as: 'usuario', attributes: ['id_usuario', 'nombre', 'correo'] },
        { model: db.Cliente, as: 'cliente', attributes: ['id_cliente', 'nombre', 'telefono', 'direccion'] },
        { model: db.MetodoPago, as: 'metodo_pago', attributes: ['id_metodo_pago', 'nombre'] },
        { model: db.Factura, as: 'factura' }
      ]
    });

    if (!venta) {
      throw new Error('Venta no encontrada');
    }

    return venta;
  } catch (error) {
    throw error;
  }
};

/**
 * Crear una nueva venta
 */
const createVenta = async (data) => {
  try {
    const { codigo_factura, id_usuario, id_cliente, id_metodo_pago, total, fecha, estado } = data;

    // Validaciones básicas
    if (!codigo_factura || codigo_factura.trim() === '') {
      throw new Error('El código de factura es requerido');
    }

    if (!id_metodo_pago) {
      throw new Error('El método de pago es requerido');
    }

    if (total === undefined || total === null || total < 0) {
      throw new Error('El total de la venta es requerido y debe ser mayor o igual a 0');
    }

    // Verificar si ya existe una venta con ese código de factura
    const ventaExistente = await db.Venta.findOne({
      where: { codigo_factura: codigo_factura.trim() }
    });

    if (ventaExistente) {
      throw new Error('Ya existe una venta con ese código de factura');
    }

    const nuevaVenta = await db.Venta.create({
      codigo_factura: codigo_factura.trim(),
      id_usuario: id_usuario || null,
      id_cliente: id_cliente || null,
      id_metodo_pago,
      total,
      fecha: fecha || new Date(),
      estado: estado || 'completada'
    });

    // Retornar la venta con sus relaciones
    const ventaCompleta = await getVentaById(nuevaVenta.id_venta);
    return ventaCompleta;
  } catch (error) {
    throw error;
  }
};

/**
 * Actualizar una venta
 */
const updateVenta = async (id, data) => {
  try {
    const venta = await db.Venta.findByPk(id);

    if (!venta) {
      throw new Error('Venta no encontrada');
    }

    const { codigo_factura, id_usuario, id_cliente, id_metodo_pago, total, fecha, estado } = data;

    // Si se está actualizando el código de factura, verificar que no exista otra venta con ese código
    if (codigo_factura && codigo_factura.trim() !== venta.codigo_factura) {
      const ventaExistente = await db.Venta.findOne({
        where: { codigo_factura: codigo_factura.trim() }
      });

      if (ventaExistente) {
        throw new Error('Ya existe una venta con ese código de factura');
      }
    }

    await venta.update({
      codigo_factura: codigo_factura ? codigo_factura.trim() : venta.codigo_factura,
      id_usuario: id_usuario !== undefined ? id_usuario : venta.id_usuario,
      id_cliente: id_cliente !== undefined ? id_cliente : venta.id_cliente,
      id_metodo_pago: id_metodo_pago !== undefined ? id_metodo_pago : venta.id_metodo_pago,
      total: total !== undefined ? total : venta.total,
      fecha: fecha !== undefined ? fecha : venta.fecha,
      estado: estado !== undefined ? estado : venta.estado
    });

    // Retornar la venta actualizada con sus relaciones
    const ventaActualizada = await getVentaById(venta.id_venta);
    return ventaActualizada;
  } catch (error) {
    throw error;
  }
};

/**
 * Eliminar una venta
 */
const deleteVenta = async (id) => {
  try {
    const venta = await db.Venta.findByPk(id);

    if (!venta) {
      throw new Error('Venta no encontrada');
    }

    await venta.destroy();
    return { message: 'Venta eliminada exitosamente' };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllVentas,
  getVentaById,
  createVenta,
  updateVenta,
  deleteVenta
};

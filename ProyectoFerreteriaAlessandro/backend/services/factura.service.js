const db = require('../models');

/**
 * Obtener todas las facturas
 * Soporta paginación opcional mediante page y limit
 */
const getAllFacturas = async ({ page, limit } = {}) => {
  try {
    const options = {
      include: [
        {
          model: db.Venta,
          as: 'venta',
          include: [
            { model: db.Cliente, as: 'cliente', attributes: ['id_cliente', 'nombre', 'telefono'] },
            { model: db.Usuario, as: 'usuario', attributes: ['id_usuario', 'nombre', 'correo'] }
          ]
        },
        { model: db.MetodoPago, as: 'metodo_pago', attributes: ['id_metodo_pago', 'nombre'] },
        { model: db.DetalleFactura, as: 'detalles' }
      ],
      order: [['id_factura', 'DESC']]
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

    const facturas = await db.Factura.findAll(options);
    return facturas;
  } catch (error) {
    throw new Error(`Error al obtener facturas: ${error.message}`);
  }
};

/**
 * Obtener una factura por ID
 */
const getFacturaById = async (id) => {
  try {
    const factura = await db.Factura.findByPk(id, {
      include: [
        {
          model: db.Venta,
          as: 'venta',
          include: [
            { model: db.Cliente, as: 'cliente', attributes: ['id_cliente', 'nombre', 'telefono', 'direccion', 'correo'] },
            { model: db.Usuario, as: 'usuario', attributes: ['id_usuario', 'nombre', 'correo'] }
          ]
        },
        { model: db.MetodoPago, as: 'metodo_pago', attributes: ['id_metodo_pago', 'nombre'] },
        { model: db.DetalleFactura, as: 'detalles' }
      ]
    });

    if (!factura) {
      throw new Error('Factura no encontrada');
    }

    return factura;
  } catch (error) {
    throw error;
  }
};

/**
 * Crear una nueva factura
 */
const createFactura = async (data) => {
  try {
    const {
      id_venta,
      No_Reg_Exonerados,
      Orden_Compra_Exenta,
      Condiciones_Pago,
      OrdenEstado,
      RTN,
      REG_SGA,
      subtotal,
      id_metodo_pago
    } = data;

    // Validaciones básicas
    if (!id_venta) {
      throw new Error('El ID de la venta es requerido');
    }

    if (subtotal !== undefined && subtotal !== null && subtotal < 0) {
      throw new Error('El subtotal debe ser mayor o igual a 0');
    }

    // Verificar que la venta existe
    const venta = await db.Venta.findByPk(id_venta);
    if (!venta) {
      throw new Error('La venta especificada no existe');
    }

    const nuevaFactura = await db.Factura.create({
      id_venta,
      No_Reg_Exonerados: No_Reg_Exonerados ? No_Reg_Exonerados.trim() : null,
      Orden_Compra_Exenta: Orden_Compra_Exenta ? Orden_Compra_Exenta.trim() : null,
      Condiciones_Pago: Condiciones_Pago ? Condiciones_Pago.trim() : null,
      OrdenEstado: OrdenEstado ? OrdenEstado.trim() : null,
      RTN: RTN ? RTN.trim() : null,
      REG_SGA: REG_SGA ? REG_SGA.trim() : null,
      subtotal: subtotal || null,
      id_metodo_pago: id_metodo_pago || null
    });

    // Retornar la factura con sus relaciones
    const facturaCompleta = await getFacturaById(nuevaFactura.id_factura);
    return facturaCompleta;
  } catch (error) {
    throw error;
  }
};

/**
 * Actualizar una factura
 */
const updateFactura = async (id, data) => {
  try {
    const factura = await db.Factura.findByPk(id);

    if (!factura) {
      throw new Error('Factura no encontrada');
    }

    const {
      id_venta,
      No_Reg_Exonerados,
      Orden_Compra_Exenta,
      Condiciones_Pago,
      OrdenEstado,
      RTN,
      REG_SGA,
      subtotal,
      id_metodo_pago
    } = data;

    // Si se está actualizando id_venta, verificar que existe
    if (id_venta !== undefined && id_venta !== factura.id_venta) {
      const venta = await db.Venta.findByPk(id_venta);
      if (!venta) {
        throw new Error('La venta especificada no existe');
      }
    }

    await factura.update({
      id_venta: id_venta !== undefined ? id_venta : factura.id_venta,
      No_Reg_Exonerados: No_Reg_Exonerados !== undefined ? (No_Reg_Exonerados ? No_Reg_Exonerados.trim() : null) : factura.No_Reg_Exonerados,
      Orden_Compra_Exenta: Orden_Compra_Exenta !== undefined ? (Orden_Compra_Exenta ? Orden_Compra_Exenta.trim() : null) : factura.Orden_Compra_Exenta,
      Condiciones_Pago: Condiciones_Pago !== undefined ? (Condiciones_Pago ? Condiciones_Pago.trim() : null) : factura.Condiciones_Pago,
      OrdenEstado: OrdenEstado !== undefined ? (OrdenEstado ? OrdenEstado.trim() : null) : factura.OrdenEstado,
      RTN: RTN !== undefined ? (RTN ? RTN.trim() : null) : factura.RTN,
      REG_SGA: REG_SGA !== undefined ? (REG_SGA ? REG_SGA.trim() : null) : factura.REG_SGA,
      subtotal: subtotal !== undefined ? subtotal : factura.subtotal,
      id_metodo_pago: id_metodo_pago !== undefined ? id_metodo_pago : factura.id_metodo_pago
    });

    // Retornar la factura actualizada con sus relaciones
    const facturaActualizada = await getFacturaById(factura.id_factura);
    return facturaActualizada;
  } catch (error) {
    throw error;
  }
};

/**
 * Eliminar una factura
 */
const deleteFactura = async (id) => {
  try {
    const factura = await db.Factura.findByPk(id);

    if (!factura) {
      throw new Error('Factura no encontrada');
    }

    await factura.destroy();
    return { message: 'Factura eliminada exitosamente' };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllFacturas,
  getFacturaById,
  createFactura,
  updateFactura,
  deleteFactura
};

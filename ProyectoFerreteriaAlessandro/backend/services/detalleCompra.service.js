const db = require('../models');

/**
 * Obtener todos los detalles de compra
 * Soporta paginación opcional mediante page y limit
 */
const getAllDetallesCompra = async ({ page, limit } = {}) => {
  try {
    const options = {
      include: [
        {
          model: db.Compra,
          as: 'compra',
          attributes: ['id_compra', 'fecha', 'total', 'id_usuario']
        },
        {
          model: db.Producto,
          as: 'producto',
          attributes: ['id_producto', 'nombre', 'codigo_barra', 'precio_compra', 'precio_venta']
        }
      ],
      order: [['id_detalle', 'ASC']]
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

    const detalles = await db.DetalleCompra.findAll(options);
    return detalles;
  } catch (error) {
    throw new Error(`Error al obtener detalles de compra: ${error.message}`);
  }
};

/**
 * Obtener un detalle de compra por ID
 */
const getDetalleCompraById = async (id) => {
  try {
    const detalle = await db.DetalleCompra.findByPk(id, {
      include: [
        {
          model: db.Compra,
          as: 'compra',
          attributes: ['id_compra', 'fecha', 'total', 'id_usuario']
        },
        {
          model: db.Producto,
          as: 'producto',
          attributes: ['id_producto', 'nombre', 'codigo_barra', 'descripcion', 'precio_compra', 'precio_venta', 'stock']
        }
      ]
    });

    if (!detalle) {
      throw new Error('Detalle de compra no encontrado');
    }

    return detalle;
  } catch (error) {
    throw error;
  }
};

/**
 * Crear un nuevo detalle de compra
 */
const createDetalleCompra = async (data) => {
  try {
    const {
      id_compra,
      id_producto,
      cantidad,
      precio_unitario,
      subtotal
    } = data;

    // Validaciones básicas
    if (!id_compra) {
      throw new Error('El ID de la compra es requerido');
    }

    if (!id_producto) {
      throw new Error('El ID del producto es requerido');
    }

    if (!cantidad || cantidad <= 0) {
      throw new Error('La cantidad debe ser mayor a 0');
    }

    if (precio_unitario === undefined || precio_unitario === null || precio_unitario < 0) {
      throw new Error('El precio unitario es requerido y debe ser mayor o igual a 0');
    }

    // Calcular subtotal automáticamente si no se proporciona
    const subtotalCalculado = subtotal !== undefined ? subtotal : cantidad * precio_unitario;

    const nuevoDetalle = await db.DetalleCompra.create({
      id_compra,
      id_producto,
      cantidad,
      precio_unitario,
      subtotal: subtotalCalculado
    });

    // Retornar el detalle con sus relaciones
    const detalleCompleto = await getDetalleCompraById(nuevoDetalle.id_detalle);
    return detalleCompleto;
  } catch (error) {
    throw error;
  }
};

/**
 * Actualizar un detalle de compra
 */
const updateDetalleCompra = async (id, data) => {
  try {
    const detalle = await db.DetalleCompra.findByPk(id);

    if (!detalle) {
      throw new Error('Detalle de compra no encontrado');
    }

    const {
      id_compra,
      id_producto,
      cantidad,
      precio_unitario,
      subtotal
    } = data;

    // Validar cantidad si se está actualizando
    if (cantidad !== undefined && cantidad <= 0) {
      throw new Error('La cantidad debe ser mayor a 0');
    }

    // Validar precio si se está actualizando
    if (precio_unitario !== undefined && precio_unitario < 0) {
      throw new Error('El precio unitario debe ser mayor o igual a 0');
    }

    // Calcular nuevo subtotal si cambian cantidad o precio
    let nuevoSubtotal = subtotal;
    if (nuevoSubtotal === undefined) {
      const nuevaCantidad = cantidad !== undefined ? cantidad : detalle.cantidad;
      const nuevoPrecio = precio_unitario !== undefined ? precio_unitario : detalle.precio_unitario;
      nuevoSubtotal = nuevaCantidad * nuevoPrecio;
    }

    await detalle.update({
      id_compra: id_compra !== undefined ? id_compra : detalle.id_compra,
      id_producto: id_producto !== undefined ? id_producto : detalle.id_producto,
      cantidad: cantidad !== undefined ? cantidad : detalle.cantidad,
      precio_unitario: precio_unitario !== undefined ? precio_unitario : detalle.precio_unitario,
      subtotal: nuevoSubtotal
    });

    // Retornar el detalle actualizado con sus relaciones
    const detalleActualizado = await getDetalleCompraById(detalle.id_detalle);
    return detalleActualizado;
  } catch (error) {
    throw error;
  }
};

/**
 * Eliminar un detalle de compra
 */
const deleteDetalleCompra = async (id) => {
  try {
    const detalle = await db.DetalleCompra.findByPk(id);

    if (!detalle) {
      throw new Error('Detalle de compra no encontrado');
    }

    await detalle.destroy();
    return { message: 'Detalle de compra eliminado exitosamente' };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllDetallesCompra,
  getDetalleCompraById,
  createDetalleCompra,
  updateDetalleCompra,
  deleteDetalleCompra
};

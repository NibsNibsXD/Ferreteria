const db = require('../models');

/**
 * Obtener todas las compras
 * Soporta paginación opcional mediante page y limit
 */
const getAllCompras = async ({ page, limit } = {}) => {
  try {
    const options = {
      include: [
        {
          model: db.Usuario,
          as: 'usuario',
          attributes: ['id_usuario', 'nombre', 'correo']
        },
        {
          model: db.DetalleCompra,
          as: 'detalles',
          include: [
            {
              model: db.Producto,
              as: 'producto',
              attributes: ['id_producto', 'nombre', 'codigo_barra']
            }
          ]
        }
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

    const compras = await db.Compra.findAll(options);
    return compras;
  } catch (error) {
    throw new Error(`Error al obtener compras: ${error.message}`);
  }
};

/**
 * Obtener una compra por ID
 */
const getCompraById = async (id) => {
  try {
    const compra = await db.Compra.findByPk(id, {
      include: [
        {
          model: db.Usuario,
          as: 'usuario',
          attributes: ['id_usuario', 'nombre', 'correo']
        },
        {
          model: db.DetalleCompra,
          as: 'detalles',
          include: [
            {
              model: db.Producto,
              as: 'producto',
              attributes: ['id_producto', 'nombre', 'codigo_barra', 'descripcion']
            }
          ]
        }
      ]
    });

    if (!compra) {
      throw new Error('Compra no encontrada');
    }

    return compra;
  } catch (error) {
    throw error;
  }
};

/**
 * Crear una nueva compra
 */
const createCompra = async (data) => {
  try {
    const { id_usuario, total, fecha, detalles } = data;

    // Validaciones básicas
    if (total === undefined || total === null || total < 0) {
      throw new Error('El total de la compra es requerido y debe ser mayor o igual a 0');
    }

    // Validar que si se proporcionan detalles, sean un arreglo válido
    if (detalles !== undefined && !Array.isArray(detalles)) {
      throw new Error('Los detalles deben ser un arreglo');
    }

    // Crear la compra
    const nuevaCompra = await db.Compra.create({
      id_usuario: id_usuario || null,
      total,
      fecha: fecha || new Date()
    });

    // Si se proporcionan detalles, crearlos y actualizar inventario
    if (detalles && detalles.length > 0) {
      const detallesConId = detalles.map(detalle => ({
        id_compra: nuevaCompra.id_compra,
        id_producto: detalle.id_producto,
        cantidad: detalle.cantidad,
        precio_unitario: detalle.precio_unitario,
        subtotal: detalle.cantidad * detalle.precio_unitario
      }));

      await db.DetalleCompra.bulkCreate(detallesConId);

      // Actualizar el stock de cada producto (SUMAR al inventario)
      for (const detalle of detalles) {
        const producto = await db.Producto.findByPk(detalle.id_producto);
        if (producto) {
          await producto.update({
            stock: producto.stock + detalle.cantidad,
            precio_compra: detalle.precio_unitario // Actualizar también el precio de compra
          });
        }
      }
    }

    // Retornar la compra con sus relaciones
    const compraCompleta = await getCompraById(nuevaCompra.id_compra);
    return compraCompleta;
  } catch (error) {
    throw error;
  }
};

/**
 * Actualizar una compra
 */
const updateCompra = async (id, data) => {
  try {
    const compra = await db.Compra.findByPk(id);

    if (!compra) {
      throw new Error('Compra no encontrada');
    }

    const { id_usuario, total, fecha } = data;

    await compra.update({
      id_usuario: id_usuario !== undefined ? id_usuario : compra.id_usuario,
      total: total !== undefined ? total : compra.total,
      fecha: fecha !== undefined ? fecha : compra.fecha
    });

    // Retornar la compra actualizada con sus relaciones
    const compraActualizada = await getCompraById(compra.id_compra);
    return compraActualizada;
  } catch (error) {
    throw error;
  }
};

/**
 * Eliminar una compra
 */
const deleteCompra = async (id) => {
  try {
    const compra = await db.Compra.findByPk(id);

    if (!compra) {
      throw new Error('Compra no encontrada');
    }

    // Eliminar primero los detalles asociados (integridad referencial)
    await db.DetalleCompra.destroy({
      where: { id_compra: id }
    });

    // Eliminar la compra
    await compra.destroy();
    return { message: 'Compra eliminada exitosamente' };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllCompras,
  getCompraById,
  createCompra,
  updateCompra,
  deleteCompra
};

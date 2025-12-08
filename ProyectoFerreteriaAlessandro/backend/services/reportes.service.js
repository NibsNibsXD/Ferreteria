const db = require('../models');
const { Op } = require('sequelize');

/**
 * Obtener reporte de ventas por periodo
 * @param {Date} fechaInicio - Fecha de inicio
 * @param {Date} fechaFin - Fecha de fin
 * @returns {Promise<Array>} - Lista de ventas
 */
const getVentasPorPeriodo = async (fechaInicio, fechaFin) => {
  try {
    const whereClause = {};

    if (fechaInicio && fechaFin) {
      whereClause.fecha = {
        [Op.between]: [fechaInicio, fechaFin]
      };
    } else if (fechaInicio) {
      whereClause.fecha = {
        [Op.gte]: fechaInicio
      };
    } else if (fechaFin) {
      whereClause.fecha = {
        [Op.lte]: fechaFin
      };
    }

    const ventas = await db.Venta.findAll({
      where: whereClause,
      include: [
        {
          model: db.Usuario,
          as: 'usuario',
          attributes: ['id_usuario', 'nombre', 'correo']
        },
        {
          model: db.Cliente,
          as: 'cliente',
          attributes: ['id_cliente', 'nombre', 'telefono']
        },
        {
          model: db.MetodoPago,
          as: 'metodo_pago',
          attributes: ['id_metodo_pago', 'nombre']
        }
      ],
      order: [['fecha', 'DESC']]
    });

    return ventas;
  } catch (error) {
    throw new Error(`Error al obtener ventas por periodo: ${error.message}`);
  }
};

/**
 * Obtener reporte de compras por periodo
 * @param {Date} fechaInicio - Fecha de inicio
 * @param {Date} fechaFin - Fecha de fin
 * @returns {Promise<Array>} - Lista de compras
 */
const getComprasPorPeriodo = async (fechaInicio, fechaFin) => {
  try {
    const whereClause = {};

    if (fechaInicio && fechaFin) {
      whereClause.fecha = {
        [Op.between]: [fechaInicio, fechaFin]
      };
    } else if (fechaInicio) {
      whereClause.fecha = {
        [Op.gte]: fechaInicio
      };
    } else if (fechaFin) {
      whereClause.fecha = {
        [Op.lte]: fechaFin
      };
    }

    const compras = await db.Compra.findAll({
      where: whereClause,
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
    });

    return compras;
  } catch (error) {
    throw new Error(`Error al obtener compras por periodo: ${error.message}`);
  }
};

/**
 * Obtener reporte de inventario actual
 * @returns {Promise<Array>} - Lista de productos con su stock
 */
const getInventarioActual = async () => {
  try {
    const productos = await db.Producto.findAll({
      where: {
        activo: true
      },
      include: [
        {
          model: db.Categoria,
          as: 'categoria',
          attributes: ['id_categoria', 'nombre']
        }
      ],
      attributes: [
        'id_producto',
        'nombre',
        'descripcion',
        'codigo_barra',
        'precio_compra',
        'precio_venta',
        'stock',
        'stock_minimo',
        'activo'
      ],
      order: [['nombre', 'ASC']]
    });

    return productos;
  } catch (error) {
    throw new Error(`Error al obtener inventario actual: ${error.message}`);
  }
};

/**
 * Obtener productos con bajo stock
 * @returns {Promise<Array>} - Productos con stock menor al mínimo
 */
const getProductosBajoStock = async () => {
  try {
    const productos = await db.Producto.findAll({
      where: {
        activo: true,
        stock: {
          [Op.lte]: db.Sequelize.col('stock_minimo')
        }
      },
      include: [
        {
          model: db.Categoria,
          as: 'categoria',
          attributes: ['id_categoria', 'nombre']
        }
      ],
      order: [['stock', 'ASC']]
    });

    return productos;
  } catch (error) {
    throw new Error(`Error al obtener productos con bajo stock: ${error.message}`);
  }
};

/**
 * Obtener productos más vendidos
 * @param {number} limit - Cantidad de productos a retornar (default: 20)
 * @param {Date} fechaInicio - Fecha de inicio (opcional)
 * @param {Date} fechaFin - Fecha de fin (opcional)
 * @returns {Promise<Array>} - Lista de productos más vendidos
 */
const getProductosMasVendidos = async (limit = 20, fechaInicio = null, fechaFin = null) => {
  try {
    // Construir WHERE clause para filtrar por fecha si se proporcionan
    const facturaWhere = {};
    if (fechaInicio || fechaFin) {
      const ventaInclude = {
        model: db.Venta,
        as: 'venta',
        attributes: [],
        where: {}
      };

      if (fechaInicio && fechaFin) {
        ventaInclude.where.fecha = {
          [Op.between]: [fechaInicio, fechaFin]
        };
      } else if (fechaInicio) {
        ventaInclude.where.fecha = {
          [Op.gte]: fechaInicio
        };
      } else if (fechaFin) {
        ventaInclude.where.fecha = {
          [Op.lte]: fechaFin
        };
      }

      // Obtener facturas del periodo
      const facturas = await db.Factura.findAll({
        include: [ventaInclude],
        attributes: ['id_factura']
      });

      const facturaIds = facturas.map(f => f.id_factura);
      if (facturaIds.length > 0) {
        facturaWhere.id_factura = {
          [Op.in]: facturaIds
        };
      } else {
        // Si no hay facturas en el periodo, retornar vacío
        return [];
      }
    }

    const productosVendidos = await db.DetalleFactura.findAll({
      where: facturaWhere,
      attributes: [
        'id_producto',
        [db.Sequelize.fn('SUM', db.Sequelize.col('cantidad')), 'total_vendido'],
        [db.Sequelize.fn('SUM', db.Sequelize.literal('cantidad * precio_unitario')), 'total_ingresos']
      ],
      include: [
        {
          model: db.Producto,
          as: 'producto',
          attributes: ['nombre', 'codigo_barra', 'precio_venta', 'stock'],
          include: [
            {
              model: db.Categoria,
              as: 'categoria',
              attributes: ['nombre']
            }
          ]
        }
      ],
      group: ['DetalleFactura.id_producto', 'producto.id_producto', 'producto->categoria.id_categoria'],
      order: [[db.Sequelize.literal('total_vendido'), 'DESC']],
      limit: parseInt(limit)
    });

    return productosVendidos;
  } catch (error) {
    throw new Error(`Error al obtener productos más vendidos: ${error.message}`);
  }
};

/**
 * Obtener clientes más frecuentes
 * @param {number} limit - Cantidad de clientes a retornar (default: 20)
 * @param {Date} fechaInicio - Fecha de inicio (opcional)
 * @param {Date} fechaFin - Fecha de fin (opcional)
 * @returns {Promise<Array>} - Lista de clientes más frecuentes
 */
const getClientesFrecuentes = async (limit = 20, fechaInicio = null, fechaFin = null) => {
  try {
    const whereClause = {};

    if (fechaInicio && fechaFin) {
      whereClause.fecha = {
        [Op.between]: [fechaInicio, fechaFin]
      };
    } else if (fechaInicio) {
      whereClause.fecha = {
        [Op.gte]: fechaInicio
      };
    } else if (fechaFin) {
      whereClause.fecha = {
        [Op.lte]: fechaFin
      };
    }

    const clientesFrecuentes = await db.Venta.findAll({
      where: whereClause,
      attributes: [
        'id_cliente',
        [db.Sequelize.fn('COUNT', db.Sequelize.col('Venta.id_venta')), 'total_compras'],
        [db.Sequelize.fn('SUM', db.Sequelize.col('Venta.total')), 'total_gastado']
      ],
      include: [
        {
          model: db.Cliente,
          as: 'cliente',
          attributes: ['nombre', 'telefono', 'correo', 'direccion']
        }
      ],
      group: ['Venta.id_cliente', 'cliente.id_cliente'],
      order: [[db.Sequelize.literal('total_compras'), 'DESC']],
      limit: parseInt(limit)
    });

    return clientesFrecuentes;
  } catch (error) {
    throw new Error(`Error al obtener clientes frecuentes: ${error.message}`);
  }
};

/**
 * Obtener resumen de ventas (totales y estadísticas)
 * @param {Date} fechaInicio - Fecha de inicio
 * @param {Date} fechaFin - Fecha de fin
 * @returns {Promise<Object>} - Resumen de ventas
 */
const getResumenVentas = async (fechaInicio, fechaFin) => {
  try {
    const whereClause = {};

    if (fechaInicio && fechaFin) {
      whereClause.fecha = {
        [Op.between]: [fechaInicio, fechaFin]
      };
    } else if (fechaInicio) {
      whereClause.fecha = {
        [Op.gte]: fechaInicio
      };
    } else if (fechaFin) {
      whereClause.fecha = {
        [Op.lte]: fechaFin
      };
    }

    const resumen = await db.Venta.findOne({
      where: whereClause,
      attributes: [
        [db.Sequelize.fn('COUNT', db.Sequelize.col('id_venta')), 'total_ventas'],
        [db.Sequelize.fn('SUM', db.Sequelize.col('total')), 'total_ingresos'],
        [db.Sequelize.fn('AVG', db.Sequelize.col('total')), 'ticket_promedio']
      ]
    });

    return resumen;
  } catch (error) {
    throw new Error(`Error al obtener resumen de ventas: ${error.message}`);
  }
};

module.exports = {
  getVentasPorPeriodo,
  getComprasPorPeriodo,
  getInventarioActual,
  getProductosBajoStock,
  getProductosMasVendidos,
  getClientesFrecuentes,
  getResumenVentas
};

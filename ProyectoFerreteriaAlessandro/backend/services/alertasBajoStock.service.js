const db = require('../models');
const { Op } = require('sequelize');

const getCantProductosAgotados = async () => {
  try {
    const cantidad = await db.Producto.count({
      where: {
        stock: 0,
        activo: true
      }
    });
    return { cantidad };
  } catch (error) {
    throw new Error(`Error al contar productos agotados: ${error.message}`);
  }
};

const getCantConStockEnMinimo = async () => {
  try {
    const cantidad = await db.Producto.count({
      where: {
        stock: {
          [Op.gt]: 0,
          [Op.lte]: db.Sequelize.col('stock_minimo')
        },
        activo: true
      }
    });
    return { cantidad };
  } catch (error) {
    throw new Error(`Error al contar productos con stock mínimo: ${error.message}`);
  }
};

const getAllProductsConStockMinimo = async () => {
  try {
    const productos = await db.Producto.findAll({
      where: {
        stock: {
          [Op.lte]: db.Sequelize.col('stock_minimo')
        },
        activo: true
      },
      include: [
        { model: db.Categoria, as: 'categoria', attributes: ['id_categoria', 'nombre'] }
      ],
      order: [['stock', 'ASC']]
    });

    const productosConEstado = productos.map(p => ({
      id_producto: p.id_producto,
      nombre: p.nombre,
      stock: p.stock,
      stock_minimo: p.stock_minimo,
      diferencia: p.stock_minimo - p.stock,
      estado: p.stock === 0 ? 'agotado' : 'bajo stock',
      categoria: p.categoria
    }));

    return productosConEstado;
  } catch (error) {
    throw new Error(`Error al obtener productos con stock mínimo: ${error.message}`);
  }
};

module.exports = {
  getCantProductosAgotados,
  getCantConStockEnMinimo,
  getAllProductsConStockMinimo
};

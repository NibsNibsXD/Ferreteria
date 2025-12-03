const db = require('../models');

/**
 * Obtener todos los productos
 * Soporta paginación opcional mediante page y limit
 */
const getAllProductos = async ({ page, limit } = {}) => {
  try {
    const options = {
      include: [
        {
          model: db.Categoria,
          as: 'categoria',
          attributes: ['id_categoria', 'nombre']
        }
      ],
      order: [['id_producto', 'ASC']]
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

    const productos = await db.Producto.findAll(options);
    return productos;
  } catch (error) {
    throw new Error(`Error al obtener productos: ${error.message}`);
  }
};

/**
 * Obtener un producto por ID
 */
const getProductoById = async (id) => {
  try {
    const producto = await db.Producto.findByPk(id, {
      include: [
        {
          model: db.Categoria,
          as: 'categoria',
          attributes: ['id_categoria', 'nombre', 'descripcion']
        }
      ]
    });

    if (!producto) {
      throw new Error('Producto no encontrado');
    }

    return producto;
  } catch (error) {
    throw error;
  }
};

/**
 * Crear un nuevo producto
 */
const createProducto = async (data) => {
  try {
    const {
      nombre,
      descripcion,
      codigo_barra,
      id_categoria,
      precio_compra,
      precio_venta,
      stock,
      stock_minimo,
      activo
    } = data;

    // Validaciones básicas
    if (!nombre || nombre.trim() === '') {
      throw new Error('El nombre del producto es requerido');
    }

    if (precio_compra === undefined || precio_compra === null || precio_compra < 0) {
      throw new Error('El precio de compra es requerido y debe ser mayor o igual a 0');
    }

    if (precio_venta === undefined || precio_venta === null || precio_venta < 0) {
      throw new Error('El precio de venta es requerido y debe ser mayor o igual a 0');
    }

    // Validar que el precio de venta sea mayor o igual al precio de compra
    if (precio_venta < precio_compra) {
      throw new Error('El precio de venta debe ser mayor o igual al precio de compra');
    }

    const nuevoProducto = await db.Producto.create({
      nombre: nombre.trim(),
      descripcion: descripcion ? descripcion.trim() : null,
      codigo_barra: codigo_barra ? codigo_barra.trim() : null,
      id_categoria: id_categoria || null,
      precio_compra,
      precio_venta,
      stock: stock !== undefined ? stock : 0,
      stock_minimo: stock_minimo !== undefined ? stock_minimo : 5,
      activo: activo !== undefined ? activo : true,
      fecha_registro: new Date()
    });

    // Retornar el producto con sus relaciones
    const productoCompleto = await getProductoById(nuevoProducto.id_producto);
    return productoCompleto;
  } catch (error) {
    throw error;
  }
};

/**
 * Actualizar un producto
 */
const updateProducto = async (id, data) => {
  try {
    const producto = await db.Producto.findByPk(id);

    if (!producto) {
      throw new Error('Producto no encontrado');
    }

    const {
      nombre,
      descripcion,
      codigo_barra,
      id_categoria,
      precio_compra,
      precio_venta,
      stock,
      stock_minimo,
      activo
    } = data;

    // Validar precios si se están actualizando
    if (precio_compra !== undefined && precio_compra < 0) {
      throw new Error('El precio de compra debe ser mayor o igual a 0');
    }

    if (precio_venta !== undefined && precio_venta < 0) {
      throw new Error('El precio de venta debe ser mayor o igual a 0');
    }

    // Validar que el precio de venta sea mayor o igual al precio de compra
    const nuevoPrecioCompra = precio_compra !== undefined ? precio_compra : producto.precio_compra;
    const nuevoPrecioVenta = precio_venta !== undefined ? precio_venta : producto.precio_venta;

    if (nuevoPrecioVenta < nuevoPrecioCompra) {
      throw new Error('El precio de venta debe ser mayor o igual al precio de compra');
    }

    await producto.update({
      nombre: nombre ? nombre.trim() : producto.nombre,
      descripcion: descripcion !== undefined ? (descripcion ? descripcion.trim() : null) : producto.descripcion,
      codigo_barra: codigo_barra !== undefined ? (codigo_barra ? codigo_barra.trim() : null) : producto.codigo_barra,
      id_categoria: id_categoria !== undefined ? id_categoria : producto.id_categoria,
      precio_compra: precio_compra !== undefined ? precio_compra : producto.precio_compra,
      precio_venta: precio_venta !== undefined ? precio_venta : producto.precio_venta,
      stock: stock !== undefined ? stock : producto.stock,
      stock_minimo: stock_minimo !== undefined ? stock_minimo : producto.stock_minimo,
      activo: activo !== undefined ? activo : producto.activo
    });

    // Retornar el producto actualizado con sus relaciones
    const productoActualizado = await getProductoById(producto.id_producto);
    return productoActualizado;
  } catch (error) {
    throw error;
  }
};

/**
 * Eliminar un producto
 */
const deleteProducto = async (id) => {
  try {
    const producto = await db.Producto.findByPk(id);

    if (!producto) {
      throw new Error('Producto no encontrado');
    }

    await producto.destroy();
    return { message: 'Producto eliminado exitosamente' };
  } catch (error) {
    throw error;
  }
};

/**
 * Obtener cantidad de productos activos
 * Retorna la cantidad de productos donde activo = true
 */
const getProductosActivosCount = async () => {
  try {
    const count = await db.Producto.count({
      where: { activo: true }
    });
    return count;
  } catch (error) {
    throw new Error(`Error al obtener productos activos: ${error.message}`);
  }
};

/**
 * Obtener valor total del inventario
 * Suma el precio_compra * stock de todos los productos
 */
const getValorInventario = async () => {
  try {
    const productos = await db.Producto.findAll({
      attributes: ['precio_compra', 'stock']
    });
    
    const valorTotal = productos.reduce((total, producto) => {
      return total + (parseFloat(producto.precio_compra) * parseInt(producto.stock));
    }, 0);
    
    return valorTotal;
  } catch (error) {
    throw new Error(`Error al calcular valor de inventario: ${error.message}`);
  }
};

/**
 * Obtener cantidad de productos con bajo stock
 * Retorna la cantidad de productos donde stock <= stock_minimo
 */
const getProductosBajoStockCount = async () => {
  try {
    const count = await db.Producto.count({
      where: {
        [db.Sequelize.Op.or]: [
          db.Sequelize.where(
            db.Sequelize.col('stock'),
            '<=',
            db.Sequelize.col('stock_minimo')
          )
        ]
      }
    });
    return count;
  } catch (error) {
    throw new Error(`Error al obtener productos con bajo stock: ${error.message}`);
  }
};

/**
 * Obtener los 10 productos con bajo stock
 * Retorna nombre, categoría, cantidad actual y stock mínimo
 */
const getThe10ProductConBajoStock = async () => {
  try {
    const productos = await db.Producto.findAll({
      where: {
        [db.Sequelize.Op.or]: [
          db.Sequelize.where(
            db.Sequelize.col('stock'),
            '<=',
            db.Sequelize.col('stock_minimo')
          )
        ]
      },
      limit: 10,
      order: [
        [db.Sequelize.literal('stock - stock_minimo'), 'ASC']
      ],
      attributes: ['id_producto', 'nombre', 'stock', 'stock_minimo'],
      include: [
        {
          model: db.Categoria,
          as: 'categoria',
          attributes: ['id_categoria', 'nombre']
        }
      ]
    });

    // Formatear la respuesta
    const productosFormateados = productos.map(producto => ({
      id_producto: producto.id_producto,
      nombre_producto: producto.nombre,
      categoria: producto.categoria ? producto.categoria.nombre : 'Sin categoría',
      cantidad: parseInt(producto.stock),
      minimo: parseInt(producto.stock_minimo)
    }));

    return productosFormateados;
  } catch (error) {
    throw new Error(`Error al obtener productos con bajo stock: ${error.message}`);
  }
};

/**
 * Obtener todos los productos para inventario
 * Retorna: nombre, código, categoría, precio_compra, precio_venta, stock, estado
 */
const getAllProductosInventario = async ({ page, limit } = {}) => {
  try {
    const options = {
      attributes: [
        'id_producto',
        'nombre',
        'codigo_barra',
        'precio_compra',
        'precio_venta',
        'stock',
        'activo'
      ],
      include: [
        {
          model: db.Categoria,
          as: 'categoria',
          attributes: ['id_categoria', 'nombre']
        }
      ],
      order: [['id_producto', 'ASC']]
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

    const productos = await db.Producto.findAll(options);

    // Formatear la respuesta
    const productosFormateados = productos.map(producto => ({
      id_producto: producto.id_producto,
      nombre: producto.nombre,
      codigo: producto.codigo_barra || 'N/A',
      categoria: producto.categoria ? producto.categoria.nombre : 'Sin categoría',
      compra: parseFloat(producto.precio_compra),
      venta: parseFloat(producto.precio_venta),
      stock: parseInt(producto.stock),
      estado: producto.activo ? 'Activo' : 'Inactivo'
    }));

    return productosFormateados;
  } catch (error) {
    throw new Error(`Error al obtener inventario de productos: ${error.message}`);
  }
};

module.exports = {
  getAllProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto,
  getProductosActivosCount,
  getValorInventario,
  getProductosBajoStockCount,
  getThe10ProductConBajoStock,
  getAllProductosInventario
};

// Obtener la cantidad total de ventas
const getVentasCount = async () => {
  try {
    const count = await db.Venta.count();
    return count;
  } catch (error) {
    throw new Error('Error al obtener la cantidad de ventas: ' + error.message);
  }
};
const db = require('../models');
const emailService = require('./email.service');

/**
 * Crear una nueva venta con su factura y detalles
 * @param {Object} data - Datos de la venta
 * @param {number} data.id_usuario - ID del usuario que realiza la venta
 * @param {number} data.id_cliente - ID del cliente
 * @param {number} data.id_metodo_pago - ID del método de pago
 * @param {Array<Object>} data.productos - Productos vendidos
 * @param {number} data.productos[].id_producto - ID del producto
 * @param {number} data.productos[].cantidad - Cantidad vendida
 * @param {number} data.productos[].precio_unitario - Precio unitario
 * @param {Object} req - Objeto request (para obtener correo del usuario)
 * @returns {Promise<Object>} - Venta creada con todos los detalles
 */
const createVenta = async (data, req = null) => {
  const transaction = await db.sequelize.transaction();

  try {
    const { id_usuario, id_cliente, id_metodo_pago, productos } = data;

    // Validaciones básicas
    if (!productos || productos.length === 0) {
      throw new Error('Debe incluir al menos un producto en la venta');
    }

    if (!id_metodo_pago) {
      throw new Error('El método de pago es requerido');
    }

    // Generar código de factura único
    const codigoFactura = `FAC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Calcular total
    let total = 0;
    for (const prod of productos) {
      total += prod.cantidad * prod.precio_unitario;
    }

    // Crear la venta
    const nuevaVenta = await db.Venta.create({
      codigo_factura: codigoFactura,
      id_usuario: id_usuario || null,
      id_cliente: id_cliente || null,
      fecha: new Date(),
      id_metodo_pago,
      total,
      estado: 'completada'
    }, { transaction });

    // Crear la factura asociada
    const nuevaFactura = await db.Factura.create({
      id_venta: nuevaVenta.id_venta,
      subtotal: total,
      id_metodo_pago
    }, { transaction });

    // Crear detalles de factura y actualizar stock
    const detallesCreados = [];
    const productosAfectados = [];

    for (const prod of productos) {
      // Validar que el producto existe
      const producto = await db.Producto.findByPk(prod.id_producto, { transaction });

      if (!producto) {
        throw new Error(`Producto con ID ${prod.id_producto} no encontrado`);
      }

      // Validar stock disponible
      if (producto.stock < prod.cantidad) {
        throw new Error(
          `Stock insuficiente para el producto "${producto.nombre}". ` +
          `Disponible: ${producto.stock}, Solicitado: ${prod.cantidad}`
        );
      }

      // Crear detalle de factura
      const detalle = await db.DetalleFactura.create({
        id_factura: nuevaFactura.id_factura,
        id_producto: prod.id_producto,
        cantidad: prod.cantidad,
        precio_unitario: prod.precio_unitario,
        Rebajas_Otorgadas: prod.descuento || 0
      }, { transaction });

      detallesCreados.push(detalle);

      // Actualizar stock del producto
      const nuevoStock = producto.stock - prod.cantidad;
      await producto.update({ stock: nuevoStock }, { transaction });

      // Guardar info del producto para verificar bajo stock después
      productosAfectados.push({
        id_producto: producto.id_producto,
        nombre: producto.nombre,
        codigo_barra: producto.codigo_barra,
        stockAnterior: producto.stock,
        stockActual: nuevoStock,
        stockMinimo: producto.stock_minimo
      });
    }

    // Commit de la transacción
    await transaction.commit();

    // Obtener la venta completa con sus relaciones
    const ventaCompleta = await db.Venta.findByPk(nuevaVenta.id_venta, {
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
        },
        {
          model: db.Factura,
          as: 'factura',
          include: [
            {
              model: db.DetalleFactura,
              as: 'detalles',
              include: [
                {
                  model: db.Producto,
                  as: 'producto',
                  attributes: ['id_producto', 'nombre', 'codigo_barra', 'precio_venta']
                }
              ]
            }
          ]
        }
      ]
    });

    // Después de crear la venta exitosamente, verificar bajo stock
    // Esto se hace DESPUÉS del commit para que no afecte la transacción
    await checkAndSendLowStockAlerts({
      productos: productosAfectados,
      venta: ventaCompleta,
      req
    });

    return ventaCompleta;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

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
 * Verifica si hay productos en bajo stock y envía alertas por correo
 * @param {Object} options - Opciones
 * @param {Array<Object>} options.productos - Productos afectados por la venta
 * @param {Object} options.venta - Venta creada
 * @param {Object} options.req - Request object (opcional)
 * @returns {Promise<void>}
 */
const checkAndSendLowStockAlerts = async ({ productos, venta, req }) => {
  try {
    // Filtrar productos que están en o por debajo del stock mínimo
    const productosBajoStock = productos.filter(p => {
      return p.stockActual <= p.stockMinimo;
    });

    // Si no hay productos en bajo stock, no hacer nada
    if (productosBajoStock.length === 0) {
      console.log('No hay productos en bajo stock después de esta venta');
      return;
    }

    // Verificar si el servicio de email está configurado
    if (!emailService.isEmailConfigured()) {
      console.warn(
        'Servicio de email no configurado. ' +
        `Se detectaron ${productosBajoStock.length} productos en bajo stock pero no se enviará alerta.`
      );
      return;
    }

    // Obtener correo destinatario
    const destinatario = emailService.getAlertRecipientEmail(req);

    if (!destinatario) {
      console.warn(
        'No se encontró un correo destinatario para alertas. ' +
        'Configure ALERT_EMAIL en el .env o asegúrese de que el usuario tenga correo.'
      );
      return;
    }

    // Preparar datos para el correo
    const productosParaEmail = productosBajoStock.map(p => ({
      nombre: p.nombre,
      codigoBarra: p.codigo_barra,
      stockActual: p.stockActual,
      stockMinimo: p.stockMinimo
    }));

    // Intentar enviar el correo
    console.log(`Enviando alerta de bajo stock a: ${destinatario}`);
    console.log(`Productos en alerta: ${productosBajoStock.map(p => p.nombre).join(', ')}`);

    await emailService.sendLowStockAlertEmail({
      to: destinatario,
      productos: productosParaEmail
    });

    console.log('Alerta de bajo stock enviada exitosamente');
  } catch (error) {
    // IMPORTANTE: No hacer throw del error para que no afecte la venta
    // La alerta es "best effort" - si falla, solo logueamos el error
    console.error('Error al enviar alerta de bajo stock:', error.message);
    console.error('La venta se procesó correctamente, pero la alerta falló.');
  }
};

/**
 * Obtener las últimas 10 ventas
 * Retorna id_factura, total, cliente y método de pago
 */
const getTheLast10Ventas = async () => {
  try {
    const ventas = await db.Venta.findAll({
      limit: 10,
      order: [['fecha', 'DESC']],
      attributes: ['id_venta', 'codigo_factura', 'total', 'fecha'],
      include: [
        {
          model: db.Cliente,
          as: 'cliente',
          attributes: ['id_cliente', 'nombre']
        },
        {
          model: db.MetodoPago,
          as: 'metodo_pago',
          attributes: ['id_metodo_pago', 'nombre']
        },
        {
          model: db.Factura,
          as: 'factura',
          attributes: ['id_factura', 'numero_factura']
        }
      ]
    });

    // Formatear la respuesta
    const ventasFormateadas = ventas.map(venta => ({
      id_venta: venta.id_venta,
      id_factura: venta.factura ? venta.factura.id_factura : null,
      numero_factura: venta.factura ? venta.factura.numero_factura : venta.codigo_factura,
      total: parseFloat(venta.total),
      fecha: venta.fecha,
      cliente: venta.cliente ? {
        id: venta.cliente.id_cliente,
        nombre_completo: venta.cliente.nombre
      } : null,
      metodo_pago: venta.metodo_pago ? {
        id: venta.metodo_pago.id_metodo_pago,
        nombre: venta.metodo_pago.nombre
      } : null
    }));

    return ventasFormateadas;
  } catch (error) {
    throw new Error(`Error al obtener las últimas 10 ventas: ${error.message}`);
  }
};

module.exports = {
  createVenta,
  checkAndSendLowStockAlerts,
  getAllVentas,
  getVentaById,
  getTheLast10Ventas,
  getVentasCount
};

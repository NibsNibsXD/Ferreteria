const { Devolucion, Venta, Producto, sequelize } = require('../models');

/**
 * Procesa una devolución/cambio de productos de una venta.
 * Reglas:
 *  - Solo una devolución por venta.
 *  - El total de productos devueltos debe ser igual al total de productos entregados a cambio.
 *  - Si el total de cambio es mayor, se debe crear una nueva venta/factura por la diferencia (no implementado aquí, solo se valida y se rechaza si hay diferencia).
 *  - No se permite devolución de dinero.
 */
exports.crearDevolucion = async (req, res) => {
  const { id_venta, productos_devueltos, productos_cambio, usuario } = req.body;

  if (!id_venta || !productos_devueltos || !productos_cambio || !usuario) {
    return res.status(400).json({ error: 'Faltan datos requeridos.' });
  }

  // Verificar si ya existe una devolución para esta venta
  const devolucionExistente = await Devolucion.findOne({ where: { id_venta } });
  if (devolucionExistente) {
    return res.status(400).json({ error: 'Ya existe una devolución para esta factura.' });
  }

  // Calcular totales
  const total_devuelto = productos_devueltos.reduce((sum, p) => sum + (p.cantidad * p.precio_unitario), 0);
  const total_cambio = productos_cambio.reduce((sum, p) => sum + (p.cantidad * p.precio_unitario), 0);
  const diferencia = total_cambio - total_devuelto;

  if (diferencia < 0) {
    return res.status(400).json({ error: 'No se permite devolución de dinero. El valor de los productos a cambio debe ser igual o mayor.' });
  }

  if (diferencia > 0.01) {
    // Aquí podrías crear una nueva venta/factura por la diferencia, pero por ahora solo se rechaza
    return res.status(400).json({ error: 'El valor de los productos a cambio es mayor. Debe crear una nueva venta por la diferencia.' });
  }

  // Registrar la devolución
  const devolucion = await Devolucion.create({
    id_venta,
    productos_devueltos,
    productos_cambio,
    total_devuelto,
    total_cambio,
    diferencia,
    usuario,
    fecha: new Date(),
  });

  // Aquí podrías actualizar inventario, etc.

  return res.status(201).json({ message: 'Devolución registrada correctamente.', devolucion });
};

/**
 * Consulta devoluciones por venta
 */
exports.getDevolucionPorVenta = async (req, res) => {
  const { id_venta } = req.params;
  const devolucion = await Devolucion.findOne({ where: { id_venta } });
  if (!devolucion) return res.status(404).json({ error: 'No existe devolución para esta venta.' });
  return res.json(devolucion);
};

/**
 * Obtener todas las devoluciones
 */
exports.getAllDevoluciones = async (req, res) => {
  try {
    const devoluciones = await Devolucion.findAll({
      order: [['fecha', 'DESC']],
      limit: 50
    });
    return res.json({ data: devoluciones });
  } catch (error) {
    console.error('Error al obtener devoluciones:', error);
    return res.status(500).json({ error: 'Error al obtener devoluciones.' });
  }
};

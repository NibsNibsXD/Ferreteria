import React, { useState, useEffect } from 'react';
import { Search, RotateCcw, AlertCircle, Plus, Minus, Printer } from 'lucide-react';
import { ventaService, devolucionService, productoService } from '../services';
import api from '../services/api';

export function Devoluciones({ user }) {
  const [codigoFactura, setCodigoFactura] = useState('');
  const [ventaEncontrada, setVentaEncontrada] = useState(null);
  const [buscando, setBuscando] = useState(false);
  const [procesando, setProcesando] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
  
  // Nuevos estados para el manejo de devoluciones
  const [productosInventario, setProductosInventario] = useState([]);
  const [productosDevueltos, setProductosDevueltos] = useState([]);
  const [productosCambio, setProductosCambio] = useState([]);
  const [detallesVenta, setDetallesVenta] = useState([]);
  const [devolucionProcesada, setDevolucionProcesada] = useState(null);
  const [devolucionesRecientes, setDevolucionesRecientes] = useState([]);

  // Cargar inventario al montar el componente
  useEffect(() => {
    cargarInventario();
    cargarDevolucionesRecientes();
  }, []);

  const cargarInventario = async () => {
    try {
      const resp = await productoService.getAll();
      setProductosInventario(resp?.data?.data || resp?.data || []);
    } catch (error) {
      console.error('Error al cargar inventario:', error);
    }
  };

  const cargarDevolucionesRecientes = async () => {
    try {
      const resp = await devolucionService.getAll();
      setDevolucionesRecientes(resp?.data?.data || resp?.data || []);
    } catch (error) {
      console.error('Error al cargar devoluciones recientes:', error);
    }
  };

  const normalizarCodigo = (code) => code.trim().toUpperCase();

  const buscarVenta = async () => {
    const codigo = normalizarCodigo(codigoFactura);
    if (!codigo) {
      setMensaje({ tipo: 'error', texto: 'Ingresa un código de factura' });
      setVentaEncontrada(null);
      return;
    }

    setBuscando(true);
    setMensaje({ tipo: '', texto: '' });

    try {
      const resp = await ventaService.getAll();
      const ventas = resp?.data?.data || resp?.data || [];
      const venta = ventas.find(
        (v) => normalizarCodigo(v.codigo_factura || v.factura?.numero_factura || '') === codigo
      );

      if (venta) {
        setVentaEncontrada(venta);
        
        // Verificar si ya existe una devolución para esta venta
        try {
          await devolucionService.getByVenta(venta.id_venta);
          setMensaje({ tipo: 'error', texto: 'Esta factura ya tiene una devolución registrada.' });
          setVentaEncontrada(null);
          return;
        } catch (err) {
          // Si no existe devolución (error 404), continuar
          if (err.response?.status !== 404) {
            throw err;
          }
        }
        
        // Cargar los detalles de la venta (productos vendidos)
        await cargarDetallesVenta(venta.id_venta);
      } else {
        setVentaEncontrada(null);
        setMensaje({ tipo: 'error', texto: 'Factura no encontrada' });
      }
    } catch (error) {
      console.error('Error al buscar venta:', error);
      setMensaje({
        tipo: 'error',
        texto: 'No se pudo buscar la factura. Verifica tu conexión o el backend.',
      });
    } finally {
      setBuscando(false);
    }
  };

  const cargarDetallesVenta = async (id_venta) => {
    try {
      // Obtener todas las facturas y buscar la que corresponde a esta venta
      const resp = await api.get('/facturas');
      const facturas = resp?.data?.data || resp?.data || [];
      const factura = facturas.find(f => f.id_venta === id_venta);
      
      if (factura && factura.detalles && factura.detalles.length > 0) {
        setDetallesVenta(factura.detalles);
      } else {
        // Si no hay detalles en la factura, intentar obtenerlos del endpoint de factura por ID
        if (factura) {
          const facturaDetalle = await api.get(`/facturas/${factura.id_factura}`);
          const detalles = facturaDetalle?.data?.data?.detalles || facturaDetalle?.data?.detalles || [];
          setDetallesVenta(detalles);
        } else {
          setDetallesVenta([]);
        }
      }
    } catch (error) {
      console.error('Error al cargar detalles de venta:', error);
      setDetallesVenta([]);
    }
  };

  const agregarProductoDevuelto = (detalle) => {
    const yaAgregado = productosDevueltos.find(p => p.id_producto === detalle.id_producto);
    if (yaAgregado) {
      setMensaje({ tipo: 'error', texto: 'Este producto ya fue agregado a la lista de devoluciones.' });
      return;
    }
    
    setProductosDevueltos([...productosDevueltos, {
      id_producto: detalle.id_producto,
      nombre: detalle.producto?.nombre || 'Producto',
      cantidad: 1,
      precio_unitario: Number(detalle.precio_unitario || 0),
      cantidad_maxima: Number(detalle.cantidad || 1)
    }]);
  };

  const quitarProductoDevuelto = (id_producto) => {
    setProductosDevueltos(productosDevueltos.filter(p => p.id_producto !== id_producto));
  };

  const actualizarCantidadDevuelto = (id_producto, nuevaCantidad) => {
    setProductosDevueltos(productosDevueltos.map(p => {
      if (p.id_producto === id_producto) {
        const cantidad = Math.max(1, Math.min(nuevaCantidad, p.cantidad_maxima));
        return { ...p, cantidad };
      }
      return p;
    }));
  };

  const agregarProductoCambio = (producto) => {
    const yaAgregado = productosCambio.find(p => p.id_producto === producto.id_producto);
    if (yaAgregado) {
      setMensaje({ tipo: 'error', texto: 'Este producto ya fue agregado a la lista de cambio.' });
      return;
    }
    
    setProductosCambio([...productosCambio, {
      id_producto: producto.id_producto,
      nombre: producto.nombre,
      cantidad: 1,
      precio_unitario: Number(producto.precio_venta || 0)
    }]);
  };

  const quitarProductoCambio = (id_producto) => {
    setProductosCambio(productosCambio.filter(p => p.id_producto !== id_producto));
  };

  const actualizarCantidadCambio = (id_producto, nuevaCantidad) => {
    setProductosCambio(productosCambio.map(p => {
      if (p.id_producto === id_producto) {
        return { ...p, cantidad: Math.max(1, nuevaCantidad) };
      }
      return p;
    }));
  };

  const calcularTotal = (productos) => {
    return productos.reduce((sum, p) => sum + (p.cantidad * p.precio_unitario), 0);
  };

  const totalDevuelto = calcularTotal(productosDevueltos);
  const totalCambio = calcularTotal(productosCambio);
  const diferencia = totalCambio - totalDevuelto;
  
  // Debug logs
  console.log('Estado del botón:', {
    procesando,
    productosDevueltosCount: productosDevueltos.length,
    productosCambioCount: productosCambio.length,
    totalDevuelto,
    totalCambio,
    diferencia,
    diferenciaAbs: Math.abs(diferencia),
    botonDeshabilitado: procesando || productosDevueltos.length === 0 || productosCambio.length === 0 || Math.abs(diferencia) > 0.01
  });

  const procesarDevolucion = async () => {
    if (!ventaEncontrada) return;
    
    if (productosDevueltos.length === 0) {
      setMensaje({ tipo: 'error', texto: 'Debes seleccionar al menos un producto a devolver.' });
      return;
    }
    
    if (productosCambio.length === 0) {
      setMensaje({ tipo: 'error', texto: 'Debes seleccionar al menos un producto a cambio.' });
      return;
    }
    
    if (Math.abs(diferencia) > 0.01) {
      setMensaje({ tipo: 'error', texto: 'Los totales deben ser iguales. No se permite diferencia.' });
      return;
    }
    
    setProcesando(true);
    setMensaje({ tipo: '', texto: '' });
    
    try {
      const respuesta = await devolucionService.crear({
        id_venta: ventaEncontrada.id_venta,
        productos_devueltos: productosDevueltos,
        productos_cambio: productosCambio,
        usuario: user?.nombre || 'Usuario'
      });
      
      setMensaje({
        tipo: 'success',
        texto: `Devolución procesada exitosamente para ${ventaEncontrada.codigo_factura}`,
      });
      
      // Guardar datos de la devolución procesada para imprimir
      setDevolucionProcesada({
        venta: ventaEncontrada,
        devolucion: respuesta.data?.devolucion,
        productos_devueltos: productosDevueltos,
        productos_cambio: productosCambio,
        fecha: new Date()
      });

      // Recargar devoluciones recientes
      cargarDevolucionesRecientes();
      
    } catch (error) {
      console.error('Error al procesar devolución:', error);
      setMensaje({
        tipo: 'error',
        texto: error.response?.data?.error || 'Error al procesar la devolución.'
      });
    } finally {
      setProcesando(false);
    }
  };

  const imprimirComprobante = () => {
    if (!devolucionProcesada) return;
    
    const ventanaImpresion = window.open('', '', 'width=800,height=600');
    ventanaImpresion.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Comprobante de Devolución/Cambio</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              max-width: 800px;
              margin: 0 auto;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #0f4c81;
              padding-bottom: 10px;
              margin-bottom: 20px;
            }
            .header h1 {
              color: #0f4c81;
              margin: 0;
            }
            .info-section {
              margin-bottom: 20px;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              padding: 5px 0;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #0f4c81;
              color: white;
            }
            .total-row {
              font-weight: bold;
              background-color: #f7fafc;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              font-size: 12px;
              color: #666;
            }
            @media print {
              body { padding: 0; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Ferretería Alessandro</h1>
            <h2>Comprobante de Devolución/Cambio</h2>
          </div>
          
          <div class="info-section">
            <div class="info-row">
              <span><strong>Factura Original:</strong> ${devolucionProcesada.venta.codigo_factura}</span>
              <span><strong>Fecha:</strong> ${new Date(devolucionProcesada.fecha).toLocaleString()}</span>
            </div>
            <div class="info-row">
              <span><strong>Cliente:</strong> ${devolucionProcesada.venta.cliente?.nombre || 'Consumidor final'}</span>
              <span><strong>Atendido por:</strong> ${user?.nombre || 'Usuario'}</span>
            </div>
          </div>

          <h3>Productos Devueltos:</h3>
          <table>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio Unit.</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${devolucionProcesada.productos_devueltos.map(prod => `
                <tr>
                  <td>${prod.nombre}</td>
                  <td>${prod.cantidad}</td>
                  <td>L ${prod.precio_unitario.toFixed(2)}</td>
                  <td>L ${(prod.cantidad * prod.precio_unitario).toFixed(2)}</td>
                </tr>
              `).join('')}
              <tr class="total-row">
                <td colspan="3">Total Devuelto:</td>
                <td>L ${calcularTotal(devolucionProcesada.productos_devueltos).toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          <h3>Productos Entregados a Cambio:</h3>
          <table>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio Unit.</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${devolucionProcesada.productos_cambio.map(prod => `
                <tr>
                  <td>${prod.nombre}</td>
                  <td>${prod.cantidad}</td>
                  <td>L ${prod.precio_unitario.toFixed(2)}</td>
                  <td>L ${(prod.cantidad * prod.precio_unitario).toFixed(2)}</td>
                </tr>
              `).join('')}
              <tr class="total-row">
                <td colspan="3">Total a Cambio:</td>
                <td>L ${calcularTotal(devolucionProcesada.productos_cambio).toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          <div class="footer">
            <p>Gracias por su preferencia</p>
            <p>Este documento es un comprobante de cambio de productos</p>
          </div>

          <div style="text-align: center; margin-top: 20px;">
            <button onclick="window.print()" style="padding: 10px 20px; background: #0f4c81; color: white; border: none; border-radius: 5px; cursor: pointer;">
              Imprimir
            </button>
            <button onclick="window.close()" style="padding: 10px 20px; background: #666; color: white; border: none; border-radius: 5px; cursor: pointer; margin-left: 10px;">
              Cerrar
            </button>
          </div>
        </body>
      </html>
    `);
    ventanaImpresion.document.close();
  };

  const nuevaDevolucion = () => {
    setCodigoFactura('');
    setVentaEncontrada(null);
    setProductosDevueltos([]);
    setProductosCambio([]);
    setDetallesVenta([]);
    setDevolucionProcesada(null);
    setMensaje({ tipo: '', texto: '' });
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#0f4c81]">Devoluciones</h1>
        <p className="text-gray-600">Procesar devoluciones de productos</p>
        <p className="text-sm text-gray-500 mt-1">
          Usuario: {user?.nombre} ({user?.rol?.nombre || user?.rol})
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 bg-[#f7fafc] border-b">
          <h2 className="text-lg font-semibold text-[#0f4c81]">Buscar Venta</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Código de Factura
              </label>
              <input
                value={codigoFactura}
                onChange={(e) => setCodigoFactura(e.target.value)}
                placeholder="Ej: FAC-2025-001"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0f4c81]"
              />
            </div>
            <button
              onClick={buscarVenta}
              disabled={buscando}
              className="inline-flex items-center justify-center gap-2 bg-[#0f4c81] hover:bg-[#0a3a61] text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-60"
            >
              <Search className="w-4 h-4" />
              {buscando ? 'Buscando...' : 'Buscar'}
            </button>
          </div>

          {mensaje.texto && (
            <div
              className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm ${
                mensaje.tipo === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              <AlertCircle className="w-4 h-4" />
              {mensaje.texto}
            </div>
          )}
        </div>
      </div>

      {ventaEncontrada && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 bg-[#f7fafc] border-b flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#0f4c81]">Detalles de la Venta</h2>
              <p className="text-xs text-gray-500">Confirma los datos antes de continuar</p>
            </div>
            <RotateCcw className="w-5 h-5 text-[#0f4c81]" />
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Factura</p>
                <p className="font-semibold">
                  {ventaEncontrada.codigo_factura ||
                    ventaEncontrada.factura?.numero_factura ||
                    'N/D'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Cliente</p>
                <p className="font-semibold">
                  {ventaEncontrada.cliente?.nombre ||
                    ventaEncontrada.cliente?.nombre_completo ||
                    'Consumidor final'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Fecha</p>
                <p className="font-semibold">
                  {ventaEncontrada.fecha
                    ? new Date(ventaEncontrada.fecha).toLocaleString()
                    : 'N/D'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="font-semibold text-[#0f4c81]">
                  L {Number(ventaEncontrada.total || 0).toFixed(2)}
                </p>
              </div>
              {ventaEncontrada.metodo_pago?.nombre && (
                <div>
                  <p className="text-sm text-gray-500">Método de Pago</p>
                  <p className="font-semibold">{ventaEncontrada.metodo_pago.nombre}</p>
                </div>
              )}
              {ventaEncontrada.usuario?.nombre && (
                <div>
                  <p className="text-sm text-gray-500">Vendedor</p>
                  <p className="font-semibold">{ventaEncontrada.usuario.nombre}</p>
                </div>
              )}
            </div>

            <div className="border-t pt-4 mt-4">
              <h3 className="text-md font-semibold text-[#0f4c81] mb-3">Productos a Devolver</h3>
              {detallesVenta.length > 0 ? (
                <div className="space-y-2">
                  {detallesVenta.map((detalle) => (
                    <div key={detalle.id_producto} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{detalle.producto?.nombre || 'Producto'}</p>
                        <p className="text-xs text-gray-500">
                          Cant: {detalle.cantidad} | Precio: L {Number(detalle.precio_unitario || 0).toFixed(2)}
                        </p>
                      </div>
                      <button
                        onClick={() => agregarProductoDevuelto(detalle)}
                        className="px-3 py-1 bg-[#0f4c81] text-white rounded text-sm hover:bg-[#0a3a61]"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No hay productos en esta venta.</p>
              )}

              {productosDevueltos.length > 0 && (
                <div className="mt-4 border-t pt-3">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Seleccionados para devolución:</h4>
                  {productosDevueltos.map((prod) => (
                    <div key={prod.id_producto} className="flex items-center justify-between p-2 bg-blue-50 rounded mb-2">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{prod.nombre}</p>
                        <p className="text-xs text-gray-600">Precio: L {prod.precio_unitario.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => actualizarCantidadDevuelto(prod.id_producto, prod.cantidad - 1)}
                          className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                          disabled={prod.cantidad <= 1}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center font-semibold">{prod.cantidad}</span>
                        <button
                          onClick={() => actualizarCantidadDevuelto(prod.id_producto, prod.cantidad + 1)}
                          className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                          disabled={prod.cantidad >= prod.cantidad_maxima}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => quitarProductoDevuelto(prod.id_producto)}
                          className="ml-2 px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                        >
                          Quitar
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="text-right font-bold text-[#0f4c81] mt-2">
                    Total a devolver: L {totalDevuelto.toFixed(2)}
                  </div>
                </div>
              )}
            </div>

            <div className="border-t pt-4 mt-4">
              <h3 className="text-md font-semibold text-[#0f4c81] mb-3">Productos a Entregar a Cambio</h3>
              <div className="mb-3">
                <select
                  onChange={(e) => {
                    const prod = productosInventario.find(p => p.id_producto === parseInt(e.target.value));
                    if (prod) {
                      agregarProductoCambio(prod);
                      e.target.value = '';
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0f4c81]"
                >
                  <option value="">Seleccionar producto del inventario...</option>
                  {productosInventario.map((prod) => (
                    <option key={prod.id_producto} value={prod.id_producto}>
                      {prod.nombre} - L {Number(prod.precio_venta || 0).toFixed(2)} (Stock: {prod.stock || 0})
                    </option>
                  ))}
                </select>
              </div>

              {productosCambio.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Seleccionados para cambio:</h4>
                  {productosCambio.map((prod) => (
                    <div key={prod.id_producto} className="flex items-center justify-between p-2 bg-green-50 rounded mb-2">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{prod.nombre}</p>
                        <p className="text-xs text-gray-600">Precio: L {prod.precio_unitario.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => actualizarCantidadCambio(prod.id_producto, prod.cantidad - 1)}
                          className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                          disabled={prod.cantidad <= 1}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center font-semibold">{prod.cantidad}</span>
                        <button
                          onClick={() => actualizarCantidadCambio(prod.id_producto, prod.cantidad + 1)}
                          className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => quitarProductoCambio(prod.id_producto)}
                          className="ml-2 px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                        >
                          Quitar
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="text-right font-bold text-[#0f4c81] mt-2">
                    Total a cambio: L {totalCambio.toFixed(2)}
                  </div>
                </div>
              )}
            </div>

            {productosDevueltos.length > 0 && productosCambio.length > 0 && (
              <div className={`p-4 rounded-lg border ${
                Math.abs(diferencia) < 0.01 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-yellow-50 border-yellow-200'
              }`}>
                <p className="font-semibold text-sm">
                  Diferencia: L {diferencia.toFixed(2)}
                </p>
                {Math.abs(diferencia) < 0.01 ? (
                  <p className="text-sm text-green-700">✓ Los totales coinciden. Puedes procesar la devolución.</p>
                ) : (
                  <p className="text-sm text-yellow-700">⚠ Los totales deben ser iguales para procesar.</p>
                )}
              </div>
            )}

            <div className="flex items-center gap-2 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <p className="text-sm text-gray-800">
                Solo se permite cambio de productos por el mismo valor total. No se devuelve dinero.
              </p>
            </div>

            <button
              onClick={procesarDevolucion}
              disabled={procesando || productosDevueltos.length === 0 || productosCambio.length === 0 || Math.abs(diferencia) > 0.01}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#0f4c81] hover:bg-[#0a3a61] text-white px-4 py-3 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <RotateCcw className="w-4 h-4" />
              {procesando ? 'Procesando...' : 'Procesar Devolución/Cambio'}
            </button>
          </div>
        </div>
      )}

      {devolucionProcesada && (
        <div className="bg-white rounded-lg shadow-sm border border-green-200">
          <div className="px-6 py-4 bg-green-50 border-b border-green-200">
            <h2 className="text-lg font-semibold text-green-700">✓ Devolución Procesada Exitosamente</h2>
          </div>
          <div className="p-6 space-y-4">
            <p className="text-gray-700">
              La devolución/cambio para la factura <strong>{devolucionProcesada.venta.codigo_factura}</strong> ha sido registrada correctamente.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={imprimirComprobante}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-[#0f4c81] hover:bg-[#0a3a61] text-white px-4 py-3 rounded-lg transition-colors"
              >
                <Printer className="w-4 h-4" />
                Imprimir Comprobante
              </button>
              <button
                onClick={nuevaDevolucion}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg transition-colors"
              >
                Nueva Devolución
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 bg-[#f7fafc] border-b flex items-center gap-2">
          <RotateCcw className="w-5 h-5 text-[#0f4c81]" />
          <h2 className="text-lg font-semibold text-[#0f4c81]">Devoluciones Recientes</h2>
        </div>
        <div className="p-6">
          {devolucionesRecientes.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Fecha</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">ID Venta</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Usuario</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Total Devuelto</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Total Cambio</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Productos</th>
                  </tr>
                </thead>
                <tbody>
                  {devolucionesRecientes.map((dev) => (
                    <tr key={dev.id_devolucion} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(dev.fecha).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900 font-medium">
                        #{dev.id_venta}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {dev.usuario}
                      </td>
                      <td className="py-3 px-4 text-sm text-right text-gray-900 font-medium">
                        L {Number(dev.total_devuelto || 0).toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-sm text-right text-gray-900 font-medium">
                        L {Number(dev.total_cambio || 0).toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-sm text-center">
                        <div className="flex flex-col gap-1 text-xs">
                          <span className="text-red-600">
                            {dev.productos_devueltos?.length || 0} devueltos
                          </span>
                          <span className="text-green-600">
                            {dev.productos_cambio?.length || 0} a cambio
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <RotateCcw className="w-12 h-12 mx-auto mb-2 opacity-20" />
              <p>No hay devoluciones registradas</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Devoluciones;


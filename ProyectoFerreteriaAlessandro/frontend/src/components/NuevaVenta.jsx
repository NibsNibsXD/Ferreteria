import { useState, useRef, useEffect } from 'react';
import { Plus, Trash2, Search, ShoppingCart, Printer, X, Barcode, AlertCircle, CheckCircle, User } from 'lucide-react';
import { productoService, ventaService, clienteService, metodoPagoService, cajaService } from '../services';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from './Toast';

export function NuevaVenta({ user, onNavigate }) {
  const [codigoBarras, setCodigoBarras] = useState('');
  const [busquedaProducto, setBusquedaProducto] = useState('');
  const [items, setItems] = useState([]);
  const [productos, setProductos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [metodosPago, setMetodosPago] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState('');
  const [metodoPago, setMetodoPago] = useState('');
  const [mostrarBusqueda, setMostrarBusqueda] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tieneCajaAbierta, setTieneCajaAbierta] = useState(false);
  const [verificandoCaja, setVerificandoCaja] = useState(true);
  const [ventaFinalizada, setVentaFinalizada] = useState(null);
  const [mostrarModalCliente, setMostrarModalCliente] = useState(false);
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: '',
    telefono: '',
    direccion: '',
    rtn: ''
  });
  const inputBarrasRef = useRef(null);
  const toast = useToast();

  // Verificar caja abierta al cargar
  useEffect(() => {
    verificarCajaAbierta();
  }, []);

  // Cargar datos iniciales
  useEffect(() => {
    if (tieneCajaAbierta) {
      cargarDatos();
    }
  }, [tieneCajaAbierta]);

  // Auto-focus en el input de código de barras
  useEffect(() => {
    if (tieneCajaAbierta && !loading) {
      inputBarrasRef.current?.focus();
    }
  }, [tieneCajaAbierta, loading]);

  const verificarCajaAbierta = async () => {
    try {
      setVerificandoCaja(true);
      const response = await cajaService.getAll();
      const cajas = response.data?.data || response.data || [];
      
      console.log('Verificando caja - Cajas:', cajas);
      console.log('Usuario ID:', user?.id_usuario);
      
      // Buscar si el usuario tiene una caja asignada
      const cajaUsuario = cajas.find(
        caja => caja.id_usuario === user?.id_usuario
      );

      console.log('Caja encontrada:', cajaUsuario);

      if (cajaUsuario) {
        setTieneCajaAbierta(true);
      } else {
        setTieneCajaAbierta(false);
      }
    } catch (error) {
      console.error('Error al verificar caja:', error);
      setTieneCajaAbierta(false);
    } finally {
      setVerificandoCaja(false);
    }
  };

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [productosRes, clientesRes, metodosRes] = await Promise.all([
        productoService.getAll(),
        clienteService.getAll(),
        metodoPagoService.getAll(),
      ]);

      setProductos(productosRes.data?.data || []);
      setClientes(clientesRes.data?.data || []);
      setMetodosPago(metodosRes.data?.data || []);
      
      // Seleccionar método de pago por defecto (Efectivo si existe)
      const efectivo = metodosRes.data?.data?.find(m => m.nombre.toLowerCase() === 'efectivo');
      if (efectivo) {
        setMetodoPago(efectivo.id_metodo_pago.toString());
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
      toast.error('Error al cargar datos iniciales');
    } finally {
      setLoading(false);
    }
  };

  const handleCodigoBarras = (e) => {
    e.preventDefault();
    if (!codigoBarras.trim()) return;

    const producto = productos.find(p => p.codigo_barra === codigoBarras && p.activo);
    
    if (producto) {
      agregarProducto(producto);
      setCodigoBarras('');
      toast.success(`${producto.nombre} agregado`);
    } else {
      toast.error('Producto no encontrado');
    }
  };

  const agregarProducto = (producto) => {
    const itemExistente = items.find(i => i.producto.id_producto === producto.id_producto);
    
    if (itemExistente) {
      if (itemExistente.cantidad < producto.stock) {
        setItems(items.map(i =>
          i.producto.id_producto === producto.id_producto
            ? { ...i, cantidad: i.cantidad + 1, subtotal: (i.cantidad + 1) * parseFloat(producto.precio_venta) }
            : i
        ));
      } else {
        toast.error('Stock insuficiente');
      }
    } else {
      setItems([...items, {
        producto,
        cantidad: 1,
        subtotal: parseFloat(producto.precio_venta) || 0,
      }]);
    }
  };

  const actualizarCantidad = (idProducto, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      eliminarItem(idProducto);
      return;
    }

    const item = items.find(i => i.producto.id_producto === idProducto);
    if (item && nuevaCantidad <= item.producto.stock) {
      setItems(items.map(i =>
        i.producto.id_producto === idProducto
          ? { ...i, cantidad: nuevaCantidad, subtotal: nuevaCantidad * parseFloat(i.producto.precio_venta) }
          : i
      ));
    } else {
      toast.error('Stock insuficiente');
    }
  };

  const eliminarItem = (idProducto) => {
    setItems(items.filter(i => i.producto.id_producto !== idProducto));
  };

  const calcularTotal = () => {
    return items.reduce((sum, item) => sum + item.subtotal, 0);
  };

  const crearCliente = async () => {
    if (!nuevoCliente.nombre.trim()) {
      toast.error('El nombre del cliente es requerido');
      return;
    }

    try {
      const response = await clienteService.create(nuevoCliente);
      const clienteCreado = response.data.data; // response.data contiene { success, message, data }
      toast.success('Cliente creado exitosamente');
      
      // Agregar el nuevo cliente a la lista
      setClientes([...clientes, clienteCreado]);
      
      // Seleccionar el nuevo cliente
      setClienteSeleccionado(clienteCreado.id_cliente.toString());
      
      // Limpiar formulario y cerrar modal
      setNuevoCliente({
        nombre: '',
        telefono: '',
        direccion: '',
        rtn: ''
      });
      setMostrarModalCliente(false);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al crear cliente');
    }
  };

  const finalizarVenta = async () => {
    if (items.length === 0) {
      toast.error('Agregue productos a la venta');
      return;
    }

    if (!metodoPago) {
      toast.error('Seleccione un método de pago');
      return;
    }

    // Preparar array de productos para el backend
    const productos = items.map(item => ({
      id_producto: item.producto.id_producto,
      cantidad: item.cantidad,
      precio_unitario: parseFloat(item.producto.precio_venta),
      descuento: 0
    }));
    
    const ventaData = {
      id_usuario: user.id_usuario,
      id_cliente: clienteSeleccionado ? parseInt(clienteSeleccionado) : null,
      id_metodo_pago: parseInt(metodoPago),
      productos: productos
    };

    console.log('🚀 Enviando venta al backend:', ventaData);
    console.log('📦 Productos detallados:', items);

    try {
      const response = await ventaService.create(ventaData);
      console.log('✅ Respuesta del backend:', response);
      const ventaCreada = response.data?.data;
      const codigoFactura = ventaCreada?.codigo_factura || 'N/A';
      
      toast.success(`Venta ${codigoFactura} completada - Total: L ${(calcularTotal() * 1.15).toFixed(2)}`);
      
      // Guardar datos de la venta para impresión
      const clienteNombre = clientes.find(c => c.id_cliente === parseInt(clienteSeleccionado))?.nombre || 'Consumidor Final';
      const metodoPagoNombre = metodosPago.find(m => m.id_metodo_pago === parseInt(metodoPago))?.nombre || 'N/A';
      
      setVentaFinalizada({
        codigoFactura,
        items: [...items],
        total: calcularTotal(),
        totalConImpuesto: calcularTotal() * 1.15,
        cliente: clienteNombre,
        metodoPago: metodoPagoNombre,
        fecha: new Date(),
        vendedor: user?.nombre || 'Usuario'
      });
      
      // Limpiar venta
      setItems([]);
      setClienteSeleccionado('');
      const efectivo = metodosPago.find(m => m.nombre.toLowerCase() === 'efectivo');
      if (efectivo) {
        setMetodoPago(efectivo.id_metodo_pago.toString());
      }
      inputBarrasRef.current?.focus();
    } catch (error) {
      console.error('Error al finalizar venta:', error);
      console.error('Detalles del error:', error.response?.data);
      console.error('Datos enviados:', ventaData);
      const mensajeError = error.response?.data?.error || error.response?.data?.message || 'Error al registrar la venta';
      toast.error(mensajeError);
    }
  };

  const imprimirFactura = () => {
    if (!ventaFinalizada) return;
    
    const ventanaImpresion = window.open('', '', 'width=800,height=600');
    ventanaImpresion.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Factura - ${ventaFinalizada.codigoFactura}</title>
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
            <h2>Factura de Venta</h2>
            <p><strong>${ventaFinalizada.codigoFactura}</strong></p>
          </div>
          
          <div class="info-section">
            <div class="info-row">
              <span><strong>Fecha:</strong> ${ventaFinalizada.fecha.toLocaleString()}</span>
              <span><strong>Vendedor:</strong> ${ventaFinalizada.vendedor}</span>
            </div>
            <div class="info-row">
              <span><strong>Cliente:</strong> ${ventaFinalizada.cliente}</span>
              <span><strong>Método de Pago:</strong> ${ventaFinalizada.metodoPago}</span>
            </div>
          </div>

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
              ${ventaFinalizada.items.map(item => `
                <tr>
                  <td>${item.producto.nombre}</td>
                  <td>${item.cantidad}</td>
                  <td>L ${item.producto.precio_venta.toFixed(2)}</td>
                  <td>L ${item.subtotal.toFixed(2)}</td>
                </tr>
              `).join('')}
              <tr class="total-row">
                <td colspan="3">Subtotal:</td>
                <td>L ${ventaFinalizada.total.toFixed(2)}</td>
              </tr>
              <tr class="total-row">
                <td colspan="3">Impuesto (15%):</td>
                <td>L ${(ventaFinalizada.total * 0.15).toFixed(2)}</td>
              </tr>
              <tr class="total-row">
                <td colspan="3">TOTAL:</td>
                <td>L ${ventaFinalizada.totalConImpuesto.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          <div class="footer">
            <p>Gracias por su compra</p>
            <p>Ferretería Alessandro - Tu mejor opción en herramientas y materiales</p>
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

  const nuevaVenta = () => {
    setVentaFinalizada(null);
  };

  const productosFiltrados = productos.filter(p =>
    p.activo &&
    (p.nombre.toLowerCase().includes(busquedaProducto.toLowerCase()) ||
     p.codigo_barra?.includes(busquedaProducto) ||
     p.categoria?.nombre?.toLowerCase().includes(busquedaProducto.toLowerCase()))
  );

  const irACierreCaja = () => {
    if (onNavigate) {
      onNavigate('cierre-caja');
    }
  };

  if (verificandoCaja) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0f4c81] mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando caja...</p>
        </div>
      </div>
    );
  }

  if (!tieneCajaAbierta) {
    return (
      <div className="p-6">
        <div className="max-w-2xl mx-auto mt-20">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
            <AlertCircle className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No tienes una caja abierta</h2>
            <p className="text-gray-700 mb-6">
              Para realizar ventas, primero debes abrir una caja en el módulo de Cierre de Caja.
            </p>
            <button
              onClick={irACierreCaja}
              className="px-6 py-3 bg-[#0f4c81] text-white rounded-md hover:bg-[#0a3a61] transition-colors font-medium"
            >
              Ir a Cierre de Caja
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Pantalla de venta finalizada con opción de impresión
  if (ventaFinalizada) {
    return (
      <div className="space-y-6 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Venta Realizada Exitosamente!</h2>
              <p className="text-gray-600">Factura generada correctamente</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Código de Factura:</span>
                <span className="font-medium text-gray-900">{ventaFinalizada.codigo_factura}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total de Productos:</span>
                <span className="font-medium text-gray-900">{ventaFinalizada.items.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium text-gray-900">L {ventaFinalizada.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">ISV (15%):</span>
                <span className="font-medium text-gray-900">L {ventaFinalizada.impuesto.toFixed(2)}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between text-lg">
                <span className="font-bold text-gray-900">Total:</span>
                <span className="font-bold text-gray-900">L {ventaFinalizada.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={imprimirFactura}
                className="flex-1 px-4 py-3 bg-[#0f4c81] text-white rounded-md hover:bg-[#0a3a61] transition-colors flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Imprimir Factura
              </button>
              <button
                onClick={nuevaVenta}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                Nueva Venta
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0f4c81] mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Nueva Venta</h1>
        <p className="text-gray-600 mt-2">Registrar venta con código de barras o búsqueda manual</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Principal */}
        <div className="lg:col-span-2 space-y-4">
          {/* Card Escanear Código de Barras */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-[#f7fafc] border-b px-6 py-4">
              <h2 className="text-lg font-semibold text-[#0f4c81] flex items-center gap-2">
                <Barcode className="w-5 h-5" />
                Escanear Código de Barras
              </h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleCodigoBarras} className="flex gap-2">
                <input
                  ref={inputBarrasRef}
                  type="text"
                  value={codigoBarras}
                  onChange={(e) => setCodigoBarras(e.target.value)}
                  placeholder="Escanee o ingrese código de barras..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0f4c81] focus:border-transparent"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0f4c81] text-white rounded-md hover:bg-[#0a3a61] transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Agregar
                </button>
              </form>
              <div className="mt-4">
                <button
                  onClick={() => setMostrarBusqueda(!mostrarBusqueda)}
                  className="w-full px-4 py-2 border border-[#0f4c81] text-[#0f4c81] rounded-md hover:bg-[#f7fafc] transition-colors flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  Buscar producto manualmente
                </button>
              </div>
            </div>
          </div>

          {/* Card Buscar Productos */}
          {mostrarBusqueda && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-[#f7fafc] border-b px-6 py-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[#0f4c81]">Buscar Productos</h2>
                <button
                  onClick={() => setMostrarBusqueda(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6">
                <input
                  type="text"
                  value={busquedaProducto}
                  onChange={(e) => setBusquedaProducto(e.target.value)}
                  placeholder="Buscar por nombre, código o categoría..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0f4c81] focus:border-transparent mb-4"
                />
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {productosFiltrados.map((producto) => (
                    <div
                      key={producto.id_producto}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => {
                        agregarProducto(producto);
                        setBusquedaProducto('');
                      }}
                    >
                      <div>
                        <p className="font-medium text-gray-900">{producto.nombre}</p>
                        <p className="text-sm text-gray-600">{producto.categoria?.nombre || 'Sin categoría'}</p>
                        <p className="text-xs text-gray-500">Stock: {producto.stock}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">L {parseFloat(producto.precio_venta).toFixed(2)}</p>
                        <span className="text-xs px-2 py-1 bg-gray-100 border border-gray-300 rounded">
                          {producto.codigo_barra}
                        </span>
                      </div>
                    </div>
                  ))}
                  {productosFiltrados.length === 0 && (
                    <p className="text-center text-gray-500 py-4">No se encontraron productos</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Card Productos en Venta */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-[#f7fafc] border-b px-6 py-4">
              <h2 className="text-lg font-semibold text-[#0f4c81] flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Productos en Venta
              </h2>
            </div>
            <div className="p-6">
              {items.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-20" />
                  <p className="font-medium">No hay productos agregados</p>
                  <p className="text-sm">Escanee un código de barras para comenzar</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.producto.id_producto} className="flex items-center gap-4 p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.producto.nombre}</p>
                        <p className="text-sm text-gray-600">L {parseFloat(item.producto.precio_venta).toFixed(2)} c/u</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => actualizarCantidad(item.producto.id_producto, item.cantidad - 1)}
                          className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-100 flex items-center justify-center"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={item.cantidad}
                          onChange={(e) => actualizarCantidad(item.producto.id_producto, parseInt(e.target.value) || 0)}
                          className="w-16 text-center px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0f4c81]"
                          min="1"
                          max={item.producto.stock}
                        />
                        <button
                          onClick={() => actualizarCantidad(item.producto.id_producto, item.cantidad + 1)}
                          className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-100 flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                      <div className="w-24 text-right">
                        <p className="font-semibold text-gray-900">L {item.subtotal.toFixed(2)}</p>
                      </div>
                      <button
                        onClick={() => eliminarItem(item.producto.id_producto)}
                        className="text-red-600 hover:text-red-800 p-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Columna Lateral - Información de Venta */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-[#f7fafc] border-b px-6 py-4">
              <h2 className="text-lg font-semibold text-[#0f4c81]">Información de Venta</h2>
            </div>
            <div className="p-6 space-y-4">
              {/* Cliente */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cliente (Opcional)
                </label>
                <div className="flex gap-2">
                  <select
                    value={clienteSeleccionado}
                    onChange={(e) => setClienteSeleccionado(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0f4c81] focus:border-transparent"
                  >
                    <option value="">Cliente General</option>
                    {clientes.map((cliente) => (
                      <option key={cliente.id_cliente} value={cliente.id_cliente}>
                        {cliente.nombre}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => setMostrarModalCliente(true)}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
                    title="Nuevo Cliente"
                  >
                    <Plus className="w-4 h-4" />
                    <User className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Método de Pago */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Método de Pago
                </label>
                <select
                  value={metodoPago}
                  onChange={(e) => setMetodoPago(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0f4c81] focus:border-transparent"
                >
                  <option value="">Seleccionar método</option>
                  {metodosPago.filter(m => m.activo).map((metodo) => (
                    <option key={metodo.id_metodo_pago} value={metodo.id_metodo_pago}>
                      {metodo.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Vendedor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vendedor
                </label>
                <input
                  type="text"
                  value={user?.nombre || ''}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                />
              </div>

              {/* Separador */}
              <hr className="my-4" />

              {/* Totales */}
              <div className="space-y-2">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal:</span>
                  <span className="font-medium">L {calcularTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>ISV (15%):</span>
                  <span className="font-medium">L {(calcularTotal() * 0.15).toFixed(2)}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total:</span>
                  <span>L {(calcularTotal() * 1.15).toFixed(2)}</span>
                </div>
              </div>

              {/* Botones */}
              <div className="space-y-2 pt-4">
                <button
                  onClick={finalizarVenta}
                  disabled={items.length === 0}
                  className="w-full px-4 py-3 bg-[#0f4c81] text-white rounded-md hover:bg-[#0a3a61] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Printer className="w-4 h-4" />
                  Finalizar y Imprimir
                </button>
                <button
                  onClick={() => {
                    setItems([]);
                    setClienteSeleccionado('');
                    const efectivo = metodosPago.find(m => m.nombre.toLowerCase() === 'efectivo');
                    if (efectivo) {
                      setMetodoPago(efectivo.id_metodo_pago.toString());
                    }
                    inputBarrasRef.current?.focus();
                  }}
                  className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancelar Venta
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Nuevo Cliente */}
      {mostrarModalCliente && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="bg-[#f7fafc] border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#0f4c81] flex items-center gap-2">
                <User className="w-5 h-5" />
                Nuevo Cliente
              </h2>
              <button
                onClick={() => {
                  setMostrarModalCliente(false);
                  setNuevoCliente({ nombre: '', telefono: '', direccion: '', rtn: '' });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={nuevoCliente.nombre}
                  onChange={(e) => setNuevoCliente({ ...nuevoCliente, nombre: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0f4c81] focus:border-transparent"
                  placeholder="Nombre del cliente"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono
                </label>
                <input
                  type="text"
                  value={nuevoCliente.telefono}
                  onChange={(e) => setNuevoCliente({ ...nuevoCliente, telefono: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0f4c81] focus:border-transparent"
                  placeholder="Teléfono del cliente"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección
                </label>
                <input
                  type="text"
                  value={nuevoCliente.direccion}
                  onChange={(e) => setNuevoCliente({ ...nuevoCliente, direccion: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0f4c81] focus:border-transparent"
                  placeholder="Dirección del cliente"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  RTN
                </label>
                <input
                  type="text"
                  value={nuevoCliente.rtn}
                  onChange={(e) => setNuevoCliente({ ...nuevoCliente, rtn: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0f4c81] focus:border-transparent"
                  placeholder="RTN del cliente"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={crearCliente}
                  className="flex-1 px-4 py-2 bg-[#0f4c81] text-white rounded-md hover:bg-[#0a3a61] transition-colors"
                >
                  Crear Cliente
                </button>
                <button
                  onClick={() => {
                    setMostrarModalCliente(false);
                    setNuevoCliente({ nombre: '', telefono: '', direccion: '', rtn: '' });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />
    </div>
  );
}

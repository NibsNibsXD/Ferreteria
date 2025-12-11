import React, { useState, useEffect } from 'react';
import { ShoppingBag, Plus, Trash2, Save } from 'lucide-react';
import { productoService, compraService } from '../services';

export function RegistroCompras({ user }) {
  const [items, setItems] = useState([]);
  const [productos, setProductos] = useState([]);
  const [compras, setCompras] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarProductos();
    cargarCompras();
  }, []);

  const cargarProductos = async () => {
    try {
      const response = await productoService.getAll();
      const data = response.data?.data || [];
      setProductos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      setProductos([]);
    } finally {
      setLoading(false);
    }
  };

  const cargarCompras = async () => {
    try {
      const response = await compraService.getAll({ limit: 10 });
      const data = response.data?.data || [];
      setCompras(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al cargar compras:', error);
      setCompras([]);
    }
  };

  const productosFiltrados = productos.filter(p =>
    p.activo && (
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.codigo_barra?.includes(busqueda)
    )
  );

  const agregarItem = () => {
    if (!productoSeleccionado) return;

    const producto = productos.find(p => p.id_producto === parseInt(productoSeleccionado));
    if (!producto) return;

    const itemExistente = items.find(i => i.id_producto === producto.id_producto);
    if (itemExistente) {
      alert('El producto ya está en la lista');
      return;
    }

    setItems([...items, {
      id_producto: producto.id_producto,
      nombre: producto.nombre,
      cantidad: 1,
      precio_unitario: parseFloat(producto.precio_compra) || 0,
      subtotal: parseFloat(producto.precio_compra) || 0,
    }]);

    setProductoSeleccionado('');
    setBusqueda('');
  };

  const actualizarItem = (id, campo, valor) => {
    setItems(items.map(item => {
      if (item.id_producto === id) {
        const nuevoItem = { ...item, [campo]: parseFloat(valor) || 0 };
        nuevoItem.subtotal = parseFloat(nuevoItem.cantidad) * parseFloat(nuevoItem.precio_unitario);
        return nuevoItem;
      }
      return item;
    }));
  };

  const eliminarItem = (id) => {
    setItems(items.filter(item => item.id_producto !== id));
  };

  const calcularTotal = () => {
    return items.reduce((sum, item) => sum + item.subtotal, 0);
  };

  const guardarCompra = async () => {
    if (items.length === 0) {
      alert('Agregue productos a la compra');
      return;
    }

    try {
      const total = calcularTotal();
      const compraData = {
        id_usuario: user.id_usuario,
        total: total,
        detalles: items.map(item => ({
          id_producto: item.id_producto,
          cantidad: item.cantidad,
          precio_unitario: item.precio_unitario
        }))
      };

      await compraService.create(compraData);
      alert(`Compra registrada exitosamente - Total: L ${calcularTotal().toFixed(2)}`);
      setItems([]);
      cargarProductos(); // Recargar productos para actualizar stock
      cargarCompras(); // Recargar historial de compras
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar la compra: ' + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-[#0f4c81]">Registro de Compras</h1>
        <p className="text-gray-600 mt-2">Registrar entrada de mercadería al inventario</p>
      </div>

      {/* Card Agregar Productos */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6 bg-[#f7fafc] border-b border-gray-200">
          <h3 className="text-lg font-semibold text-[#0f4c81] flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Agregar Productos
          </h3>
        </div>
        <div className="p-6">
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seleccionar Producto
              </label>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Buscar producto por nombre o código..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0f4c81]"
                />
                <select
                  value={productoSeleccionado}
                  onChange={(e) => setProductoSeleccionado(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0f4c81]"
                >
                  <option value="">Seleccione un producto...</option>
                  {productosFiltrados.map((producto) => (
                    <option key={producto.id_producto} value={producto.id_producto}>
                      {producto.nombre} - {producto.codigo_barra} (Stock: {producto.stock})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              onClick={agregarItem}
              disabled={!productoSeleccionado}
              className="mt-auto px-4 py-2 bg-[#0f4c81] text-white rounded-md hover:bg-[#0a3a61] disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2 h-10"
            >
              <Plus className="w-4 h-4" />
              Agregar
            </button>
          </div>
        </div>
      </div>

      {/* Card Productos en Compra */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6 bg-[#f7fafc] border-b border-gray-200">
          <h3 className="text-lg font-semibold text-[#0f4c81]">Productos en Compra</h3>
        </div>
        <div className="p-6">
          {items.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <ShoppingBag className="w-12 h-12 mx-auto mb-2 opacity-20" />
              <p>No hay productos agregados</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#f7fafc]">
                    <tr className="border-b-2 border-[#0f4c81]">
                      <th className="text-left p-3 text-[#0f4c81] font-semibold">Producto</th>
                      <th className="text-center p-3 text-[#0f4c81] font-semibold">Cantidad</th>
                      <th className="text-right p-3 text-[#0f4c81] font-semibold">Precio Unit.</th>
                      <th className="text-right p-3 text-[#0f4c81] font-semibold">Subtotal</th>
                      <th className="text-center p-3 text-[#0f4c81] font-semibold">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id_producto} className="border-b border-gray-200 hover:bg-[#f7fafc] transition-colors">
                        <td className="p-3 font-medium text-gray-900">{item.nombre}</td>
                        <td className="p-3">
                          <input
                            type="number"
                            value={item.cantidad}
                            onChange={(e) => actualizarItem(item.id_producto, 'cantidad', parseInt(e.target.value) || 0)}
                            className="w-24 mx-auto px-2 py-1 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-[#0f4c81]"
                            min="1"
                          />
                        </td>
                        <td className="p-3">
                          <input
                            type="number"
                            step="0.01"
                            value={item.precio_unitario}
                            onChange={(e) => actualizarItem(item.id_producto, 'precio_unitario', parseFloat(e.target.value) || 0)}
                            className="w-32 ml-auto px-2 py-1 border border-gray-300 rounded-md text-right focus:outline-none focus:ring-2 focus:ring-[#0f4c81]"
                          />
                        </td>
                        <td className="text-right p-3 font-semibold text-gray-900">
                          L {item.subtotal.toFixed(2)}
                        </td>
                        <td className="text-center p-3">
                          <button
                            onClick={() => eliminarItem(item.id_producto)}
                            className="p-2 hover:bg-red-50 rounded-md transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-[#f7fafc]">
                    <tr className="border-t-2 border-[#0f4c81]">
                      <td colSpan={3} className="text-right p-3">
                        <span className="text-lg font-bold text-[#0f4c81]">Total:</span>
                      </td>
                      <td className="text-right p-3">
                        <span className="text-xl font-bold text-[#0f4c81]">L {calcularTotal().toFixed(2)}</span>
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={guardarCompra}
                  className="flex-1 px-4 py-2 bg-[#0f4c81] text-white rounded-md hover:bg-[#0a3a61] flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Guardar Compra
                </button>
                <button
                  onClick={() => setItems([])}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Historial de Compras Recientes */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6 bg-[#f7fafc] border-b border-gray-200">
          <h3 className="text-lg font-semibold text-[#0f4c81]">Últimas Compras Registradas</h3>
        </div>
        <div className="p-6">
          {compras.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <ShoppingBag className="w-12 h-12 mx-auto mb-2 opacity-20" />
              <p>No hay compras registradas</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#f7fafc]">
                  <tr className="border-b-2 border-[#0f4c81]">
                    <th className="text-left p-3 text-[#0f4c81] font-semibold">Fecha</th>
                    <th className="text-left p-3 text-[#0f4c81] font-semibold">Usuario</th>
                    <th className="text-center p-3 text-[#0f4c81] font-semibold">Productos</th>
                    <th className="text-right p-3 text-[#0f4c81] font-semibold">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {compras.map((compra) => (
                    <tr key={compra.id_compra} className="border-b border-gray-200 hover:bg-[#f7fafc] transition-colors">
                      <td className="p-3">
                        <span className="text-sm text-gray-700">
                          {new Date(compra.fecha).toLocaleDateString('es-HN', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="text-sm font-medium text-gray-900">
                          {compra.usuario?.nombre || 'Sin usuario'}
                        </span>
                      </td>
                      <td className="text-center p-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {compra.detalles?.length || 0} producto(s)
                        </span>
                      </td>
                      <td className="text-right p-3">
                        <span className="text-lg font-bold text-[#0f4c81]">
                          L {parseFloat(compra.total).toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

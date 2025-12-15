import React, { useState, useEffect } from 'react';
import { Package, Plus, Edit, Search, Barcode } from 'lucide-react';
import { productoService } from '../services';
import Notificacion from './Notificacion';
import { useNotificacion } from '../hooks/useNotificacion';

export function Productos({ user }) {
  const { notificaciones, cerrarNotificacion, mostrarExito, mostrarError } = useNotificacion();
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('todas');
  const [dialogAbierto, setDialogAbierto] = useState(false);
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    codigo_barra: '',
    id_categoria: '',
    precio_compra: '',
    precio_venta: '',
    stock: '',
    stock_minimo: '',
  });
  const [nuevaCategoria, setNuevaCategoria] = useState('');
  const [agregandoCategoria, setAgregandoCategoria] = useState(false);
  const [mostrarInputCategoria, setMostrarInputCategoria] = useState(false);

  // Verificar si el usuario puede crear/editar productos
  const puedeEditarProductos = user?.rol?.nombre === 'Administrador' || user?.rol === 'Administrador';

  useEffect(() => {
    cargarProductos();
    cargarCategorias();
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

  const cargarCategorias = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/categorias`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setCategorias(Array.isArray(data) ? data : []); // Ahora espera un array plano
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      setCategorias([]);
    }
  };

  const productosFiltrados = Array.isArray(productos) ? productos.filter(p => {
    const matchBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                          p.codigo_barra.includes(busqueda) ||
                          (p.descripcion && p.descripcion.toLowerCase().includes(busqueda.toLowerCase()));
    const matchCategoria = categoriaFiltro === 'todas' || p.id_categoria?.toString() === categoriaFiltro;
    return matchBusqueda && matchCategoria;
  }) : [];

  const guardarProducto = async () => {
    try {
      await productoService.create(formData);
      mostrarExito('Producto guardado exitosamente');
      setDialogAbierto(false);
      cargarProductos();
      setFormData({
        nombre: '',
        descripcion: '',
        codigo_barra: '',
        id_categoria: '',
        precio_compra: '',
        precio_venta: '',
        stock: '',
        stock_minimo: '',
      });
    } catch (error) {
      console.error('Error al guardar producto:', error);
      mostrarError('Error al guardar producto');
    }
  };

  const agregarCategoria = async () => {
    if (!nuevaCategoria.trim()) return;
    setAgregandoCategoria(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/categorias`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ nombre: nuevaCategoria })
      });
      const data = await response.json();
      if (data && data.data && data.data.id_categoria) {
        await cargarCategorias(); // Refresca la lista desde el backend
        setFormData(prev => ({ ...prev, id_categoria: data.data.id_categoria }));
        setNuevaCategoria('');
        mostrarExito('Categoría agregada exitosamente');
      } else {
        mostrarError('Error al agregar categoría');
      }
    } catch (error) {
      mostrarError('Error al agregar categoría');
    } finally {
      setAgregandoCategoria(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return <div className="p-6">Cargando productos...</div>;
  }

  const categoriasArray = Array.isArray(categorias) ? categorias : [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0f4c81]">Gestión de Productos</h1>
          <p className="text-gray-600">Inventario completo de la ferretería</p>
        </div>
        {puedeEditarProductos && (
          <button
            onClick={() => setDialogAbierto(true)}
            className="flex items-center gap-2 bg-[#0f4c81] hover:bg-[#0a3a61] text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nuevo Producto
          </button>
        )}
      </div>

      {/* Dialog para agregar producto */}
      {dialogAbierto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-[#0f4c81]">Agregar Nuevo Producto</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del Producto
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    placeholder="Ej: Martillo de Uña 16oz"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0f4c81]"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <input
                    type="text"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    placeholder="Descripción detallada del producto"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0f4c81]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Código de Barras
                  </label>
                  <input
                    type="text"
                    name="codigo_barra"
                    value={formData.codigo_barra}
                    onChange={handleInputChange}
                    placeholder="7501234567890"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0f4c81]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoría
                  </label>
                  <select
                    name="id_categoria"
                    value={formData.id_categoria}
                    onChange={e => {
                      if (e.target.value === '__nueva__') {
                        setMostrarInputCategoria(true);
                        setFormData(prev => ({ ...prev, id_categoria: '' }));
                      } else {
                        setMostrarInputCategoria(false);
                        handleInputChange(e);
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0f4c81]"
                  >
                    <option value="">Seleccionar</option>
                    <option value="__nueva__">Agregar nueva categoría</option>
                    {categoriasArray.map(cat => (
                      <option key={cat.id_categoria} value={cat.id_categoria}>
                        {cat.nombre}
                      </option>
                    ))}
                  </select>
                  {mostrarInputCategoria && (
                    <div className="flex mt-2 gap-2">
                      <input
                        type="text"
                        value={nuevaCategoria}
                        onChange={e => setNuevaCategoria(e.target.value)}
                        placeholder="Nueva categoría"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0f4c81]"
                      />
                      <button
                        type="button"
                        onClick={async () => {
                          await agregarCategoria();
                          setMostrarInputCategoria(false);
                        }}
                        disabled={agregandoCategoria}
                        className="bg-[#0f4c81] text-white px-4 py-2 rounded-lg hover:bg-[#0a3a61] transition-colors"
                      >
                        {agregandoCategoria ? 'Agregando...' : 'Agregar'}
                      </button>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Precio de Compra (L)
                  </label>
                  <input
                    type="number"
                    name="precio_compra"
                    value={formData.precio_compra}
                    onChange={handleInputChange}
                    step="0.01"
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0f4c81]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Precio de Venta (L)
                  </label>
                  <input
                    type="number"
                    name="precio_venta"
                    value={formData.precio_venta}
                    onChange={handleInputChange}
                    step="0.01"
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0f4c81]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock Inicial
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0f4c81]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock Mínimo
                  </label>
                  <input
                    type="number"
                    name="stock_minimo"
                    value={formData.stock_minimo}
                    onChange={handleInputChange}
                    placeholder="5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0f4c81]"
                  />
                </div>
                <div className="col-span-2 flex gap-2 mt-4">
                  <button
                    onClick={guardarProducto}
                    className="flex-1 bg-[#0f4c81] hover:bg-[#0a3a61] text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Guardar Producto
                  </button>
                  <button
                    onClick={() => setDialogAbierto(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow">
        <div className="bg-[#f7fafc] border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-[#0f4c81]">Filtros</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buscar
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Nombre, código o descripción..."
                  className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0f4c81]"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría
              </label>
              <select
                value={categoriaFiltro}
                onChange={(e) => setCategoriaFiltro(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0f4c81]"
              >
                <option value="todas">Todas las categorías</option>
                {categoriasArray.map(cat => (
                  <option key={cat.id_categoria} value={cat.id_categoria}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de productos */}
      <div className="bg-white rounded-lg shadow">
        <div className="bg-[#f7fafc] border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-[#0f4c81]">
            Productos ({productosFiltrados.length})
          </h2>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#f7fafc]">
                <tr className="border-b border-[#0f4c81]">
                  <th className="text-left p-3 text-[#0f4c81] font-semibold">Producto</th>
                  <th className="text-left p-3 text-[#0f4c81] font-semibold">Código</th>
                  <th className="text-left p-3 text-[#0f4c81] font-semibold">Categoría</th>
                  <th className="text-right p-3 text-[#0f4c81] font-semibold">P. Compra</th>
                  <th className="text-right p-3 text-[#0f4c81] font-semibold">P. Venta</th>
                  <th className="text-center p-3 text-[#0f4c81] font-semibold">Stock</th>
                  <th className="text-center p-3 text-[#0f4c81] font-semibold">Estado</th>
                  <th className="text-center p-3 text-[#0f4c81] font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productosFiltrados.map((producto) => (
                  <tr key={producto.id_producto} className="border-b hover:bg-[#f7fafc] transition-colors">
                    <td className="p-3">
                      <div>
                        <p className="font-medium">{producto.nombre}</p>
                        <p className="text-sm text-gray-600">{producto.descripcion}</p>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Barcode className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{producto.codigo_barra}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                        {producto.categoria?.nombre || 'Sin categoría'}
                      </span>
                    </td>
                    <td className="text-right p-3">
                      L {parseFloat(producto.precio_compra).toFixed(2)}
                    </td>
                    <td className="text-right p-3">
                      L {parseFloat(producto.precio_venta).toFixed(2)}
                    </td>
                    <td className="text-center p-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                        producto.stock <= producto.stock_minimo
                          ? 'bg-red-100 text-red-800 border border-red-200'
                          : 'bg-green-100 text-green-800 border border-green-200'
                      }`}>
                        {producto.stock}
                      </span>
                    </td>
                    <td className="text-center p-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                        producto.activo
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : 'bg-gray-100 text-gray-800 border border-gray-200'
                      }`}>
                        {producto.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="text-center p-3">
                      {puedeEditarProductos ? (
                        <button className="p-2 text-[#0f4c81] hover:bg-[#f7fafc] rounded-md transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                      ) : (
                        <span className="text-gray-400 text-xs">Solo lectura</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Notificaciones */}
      {notificaciones.map(notif => (
        <Notificacion
          key={notif.id}
          tipo={notif.tipo}
          mensaje={notif.mensaje}
          duracion={notif.duracion}
          onClose={() => cerrarNotificacion(notif.id)}
        />
      ))}
    </div>
  );
}

export default Productos;

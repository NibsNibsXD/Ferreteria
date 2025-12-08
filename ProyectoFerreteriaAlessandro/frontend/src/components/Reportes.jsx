import React, { useState, useEffect } from 'react';
import { BarChart3, Download, TrendingUp, Package, Users } from 'lucide-react';

export function Reportes({ user }) {
  const [periodo, setPeriodo] = useState('diario');
  const [activeTab, setActiveTab] = useState('ventas');
  const [loading, setLoading] = useState(true);
  const [ventas, setVentas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [reporteVentas, setReporteVentas] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, [periodo]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      // Cargar ventas
      const ventasResponse = await fetch(`${process.env.REACT_APP_API_URL}/ventas`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const ventasData = await ventasResponse.json();
      setVentas(Array.isArray(ventasData.data) ? ventasData.data : []);

      // Cargar productos
      const productosResponse = await fetch(`${process.env.REACT_APP_API_URL}/productos`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const productosData = await productosResponse.json();
      setProductos(Array.isArray(productosData.data) ? productosData.data : []);

      // Cargar clientes frecuentes
      const clientesResponse = await fetch(`${process.env.REACT_APP_API_URL}/reportes/clientes/frecuentes?limit=20`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (clientesResponse.ok) {
        const clientesData = await clientesResponse.json();
        setClientes(Array.isArray(clientesData.data) ? clientesData.data : []);
      }

      // Cargar reporte de ventas
      const reporteResponse = await fetch(`${process.env.REACT_APP_API_URL}/reportes/ventas?periodo=${periodo}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (reporteResponse.ok) {
        const reporteData = await reporteResponse.json();
        setReporteVentas(reporteData);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportarExcel = async () => {
    try {
      const endpoint = activeTab === 'ventas' ? 'ventas' : 
                       activeTab === 'inventario' ? 'inventario' : 
                       activeTab === 'productos' ? 'productos/mas-vendidos' : 
                       'clientes/frecuentes';
      
      const params = new URLSearchParams({ formato: 'excel' });
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/reportes/${endpoint}/export?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Error desconocido' }));
        throw new Error(errorData.error || `Error ${response.status}`);
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte_${activeTab}_${periodo}.xlsx`;
      a.click();
      alert('Reporte exportado a Excel exitosamente');
    } catch (error) {
      console.error('Error al exportar Excel:', error);
      alert(`Error al exportar reporte: ${error.message}`);
    }
  };

  const exportarPDF = async () => {
    try {
      const endpoint = activeTab === 'ventas' ? 'ventas' : 
                       activeTab === 'inventario' ? 'inventario' : 
                       activeTab === 'productos' ? 'productos/mas-vendidos' : 
                       'clientes/frecuentes';
      
      const params = new URLSearchParams({ formato: 'pdf' });
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/reportes/${endpoint}/export?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Error desconocido' }));
        throw new Error(errorData.error || `Error ${response.status}`);
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte_${activeTab}_${periodo}.pdf`;
      a.click();
      alert('Reporte exportado a PDF exitosamente');
    } catch (error) {
      console.error('Error al exportar PDF:', error);
      alert(`Error al exportar reporte: ${error.message}`);
    }
  };

  const calcularTotalVentas = () => {
    return ventas.reduce((sum, v) => sum + parseFloat(v.total || 0), 0);
  };

  const calcularTicketPromedio = () => {
    const total = calcularTotalVentas();
    return ventas.length > 0 ? total / ventas.length : 0;
  };

  const calcularValorInventario = () => {
    return productos.reduce((sum, p) => sum + (parseFloat(p.precio_venta || 0) * parseInt(p.stock || 0)), 0);
  };

  const contarProductosActivos = () => {
    return productos.filter(p => p.activo).length;
  };

  const contarAlertasStock = () => {
    return productos.filter(p => parseInt(p.stock || 0) <= parseInt(p.stock_minimo || 0)).length;
  };

  const agruparPorCategoria = () => {
    const categorias = {};
    productos.forEach(p => {
      const catNombre = p.categoria?.nombre || 'Sin categoría';
      if (!categorias[catNombre]) {
        categorias[catNombre] = { cantidad: 0, valor: 0 };
      }
      categorias[catNombre].cantidad++;
      categorias[catNombre].valor += parseFloat(p.precio_venta || 0) * parseInt(p.stock || 0);
    });
    return Object.entries(categorias).map(([categoria, data]) => ({
      categoria,
      ...data
    }));
  };

  if (loading) {
    return <div className="p-6">Cargando reportes...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0f4c81]">Reportes y Análisis</h1>
          <p className="text-gray-600">Información detallada del negocio</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportarExcel}
            className="flex items-center gap-2 px-4 py-2 border border-[#0f4c81] text-[#0f4c81] rounded-lg hover:bg-[#f7fafc] transition-colors"
          >
            <Download className="w-4 h-4" />
            Excel
          </button>
          <button
            onClick={exportarPDF}
            className="flex items-center gap-2 px-4 py-2 border border-[#0f4c81] text-[#0f4c81] rounded-lg hover:bg-[#f7fafc] transition-colors"
          >
            <Download className="w-4 h-4" />
            PDF
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow">
        <div className="bg-[#f7fafc] border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#0f4c81]">Filtros de Reporte</h2>
          <select
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0f4c81]"
          >
            <option value="diario">Hoy</option>
            <option value="semanal">Esta Semana</option>
            <option value="mensual">Este Mes</option>
            <option value="anual">Este Año</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="space-y-4">
        <div className="flex gap-2 bg-[#f7fafc] p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('ventas')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              activeTab === 'ventas' ? 'bg-[#0f4c81] text-white' : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Ventas
          </button>
          <button
            onClick={() => setActiveTab('inventario')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              activeTab === 'inventario' ? 'bg-[#0f4c81] text-white' : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Package className="w-4 h-4" />
            Inventario
          </button>
          <button
            onClick={() => setActiveTab('productos')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              activeTab === 'productos' ? 'bg-[#0f4c81] text-white' : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Productos
          </button>
          <button
            onClick={() => setActiveTab('clientes')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              activeTab === 'clientes' ? 'bg-[#0f4c81] text-white' : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Users className="w-4 h-4" />
            Clientes
          </button>
        </div>

        {/* Contenido de Ventas */}
        {activeTab === 'ventas' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-[#0f4c81] mb-2">Total Ventas</h3>
                <div className="text-2xl font-bold text-[#0f4c81]">L {calcularTotalVentas().toFixed(2)}</div>
                <p className="text-xs text-gray-600 mt-1">{ventas.length} transacciones</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-[#0f4c81] mb-2">Ticket Promedio</h3>
                <div className="text-2xl font-bold text-[#0f4c81]">L {calcularTicketPromedio().toFixed(2)}</div>
                <p className="text-xs text-gray-600 mt-1">Por transacción</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-[#0f4c81] mb-2">Método Más Usado</h3>
                <div className="text-2xl font-bold text-[#0f4c81]">Efectivo</div>
                <p className="text-xs text-gray-600 mt-1">45% de las ventas</p>
              </div>
            </div>

            {/* Tabla de últimas ventas */}
            <div className="bg-white rounded-lg shadow">
              <div className="bg-[#f7fafc] border-b px-6 py-4">
                <h2 className="text-lg font-semibold text-[#0f4c81]">Últimas Ventas</h2>
              </div>
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#f7fafc]">
                      <tr className="border-b border-[#0f4c81]">
                        <th className="text-left p-3 text-[#0f4c81] font-semibold">ID Venta</th>
                        <th className="text-left p-3 text-[#0f4c81] font-semibold">Cliente</th>
                        <th className="text-left p-3 text-[#0f4c81] font-semibold">Fecha</th>
                        <th className="text-right p-3 text-[#0f4c81] font-semibold">Total</th>
                        <th className="text-center p-3 text-[#0f4c81] font-semibold">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ventas.slice(0, 10).map((venta) => (
                        <tr key={venta.id_venta} className="border-b hover:bg-[#f7fafc] transition-colors">
                          <td className="p-3">{venta.id_venta}</td>
                          <td className="p-3">{venta.cliente?.nombre || 'N/A'}</td>
                          <td className="p-3">{new Date(venta.fecha_venta).toLocaleDateString()}</td>
                          <td className="text-right p-3">L {parseFloat(venta.total || 0).toFixed(2)}</td>
                          <td className="text-center p-3">
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                              Completada
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contenido de Inventario */}
        {activeTab === 'inventario' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-[#0f4c81] mb-2">Valor Total Inventario</h3>
                <div className="text-2xl font-bold text-[#0f4c81]">L {calcularValorInventario().toFixed(0)}</div>
                <p className="text-xs text-gray-600 mt-1">Precio de venta</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-[#0f4c81] mb-2">Productos Activos</h3>
                <div className="text-2xl font-bold text-[#0f4c81]">{contarProductosActivos()}</div>
                <p className="text-xs text-gray-600 mt-1">En catálogo</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-[#0f4c81] mb-2">Alertas de Stock</h3>
                <div className="text-2xl font-bold text-orange-600">{contarAlertasStock()}</div>
                <p className="text-xs text-gray-600 mt-1">Requieren reabastecimiento</p>
              </div>
            </div>

            {/* Tabla de inventario por categoría */}
            <div className="bg-white rounded-lg shadow">
              <div className="bg-[#f7fafc] border-b px-6 py-4">
                <h2 className="text-lg font-semibold text-[#0f4c81]">Inventario por Categoría</h2>
              </div>
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#f7fafc]">
                      <tr className="border-b border-[#0f4c81]">
                        <th className="text-left p-3 text-[#0f4c81] font-semibold">Categoría</th>
                        <th className="text-center p-3 text-[#0f4c81] font-semibold">Productos</th>
                        <th className="text-right p-3 text-[#0f4c81] font-semibold">Valor Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {agruparPorCategoria().map((cat, index) => (
                        <tr key={index} className="border-b hover:bg-[#f7fafc] transition-colors">
                          <td className="p-3">
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                              {cat.categoria}
                            </span>
                          </td>
                          <td className="text-center p-3">{cat.cantidad}</td>
                          <td className="text-right p-3">L {cat.valor.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contenido de Productos */}
        {activeTab === 'productos' && (
          <div className="bg-white rounded-lg shadow">
            <div className="bg-[#f7fafc] border-b px-6 py-4">
              <h2 className="text-lg font-semibold text-[#0f4c81]">Productos Más Vendidos</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {productos.slice(0, 10).map((producto, index) => (
                  <div key={producto.id_producto} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{producto.nombre}</p>
                      <p className="text-sm text-gray-600">{producto.categoria?.nombre || 'Sin categoría'}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{producto.stock} en stock</p>
                      <p className="text-sm text-gray-600">L {parseFloat(producto.precio_venta || 0).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Contenido de Clientes */}
        {activeTab === 'clientes' && (
          <div className="bg-white rounded-lg shadow">
            <div className="bg-[#f7fafc] border-b px-6 py-4">
              <h2 className="text-lg font-semibold text-[#0f4c81]">Clientes Frecuentes</h2>
            </div>
            <div className="p-6">
              {clientes.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-2 opacity-20" />
                  <p>No hay datos de clientes disponibles</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Compras</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Gastado</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket Promedio</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {clientes.map((cliente, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {cliente.cliente?.nombre || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {cliente.cliente?.telefono || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {cliente.total_compras || 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            L {parseFloat(cliente.total_gastado || 0).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            L {cliente.total_compras > 0 ? (parseFloat(cliente.total_gastado || 0) / cliente.total_compras).toFixed(2) : '0.00'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Reportes;

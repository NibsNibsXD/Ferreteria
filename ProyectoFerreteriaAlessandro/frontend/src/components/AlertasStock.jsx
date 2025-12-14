import React, { useState, useEffect } from 'react';
import { AlertTriangle, Package } from 'lucide-react';
import { alertasService } from '../services';

export function AlertasStock() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarAlertas();
  }, []);

  const cargarAlertas = async () => {
    try {
      const response = await alertasService.getProductosBajoStock();
      const data = response.data?.data?.productos || [];
      setProductos(data);
    } catch (error) {
      console.error('Error al cargar alertas:', error);
      setProductos([]);
    } finally {
      setLoading(false);
    }
  };

  const productosBajoStock = productos.filter(p => p.estado === 'bajo stock');
  const productosAgotados = productos.filter(p => p.estado === 'agotado');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-[#0f4c81]">Alertas de Stock</h1>
        <p className="text-gray-600 mt-2">Productos que requieren reabastecimiento</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card Productos Agotados */}
        <div className="bg-red-50 border border-red-200 rounded-lg shadow-sm">
          <div className="p-6 border-b border-red-200">
            <h3 className="text-lg font-semibold text-red-600 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Productos Agotados
            </h3>
          </div>
          <div className="p-6">
            <div className="text-4xl font-bold text-red-600">{productosAgotados.length}</div>
            <p className="text-sm text-gray-600 mt-2">Requieren atención inmediata</p>
          </div>
        </div>

        {/* Card Bajo Stock Mínimo */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg shadow-sm">
          <div className="p-6 border-b border-orange-200">
            <h3 className="text-lg font-semibold text-orange-600 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Bajo Stock Mínimo
            </h3>
          </div>
          <div className="p-6">
            <div className="text-4xl font-bold text-orange-600">{productosBajoStock.length}</div>
            <p className="text-sm text-gray-600 mt-2">Próximos a agotarse</p>
          </div>
        </div>
      </div>

      {/* Lista de Productos Agotados */}
      {productosAgotados.length > 0 && (
        <div className="bg-white border border-red-200 rounded-lg shadow-sm">
          <div className="p-6 bg-[#f7fafc] border-b border-gray-200">
            <h3 className="text-lg font-semibold text-red-600">Productos Agotados</h3>
          </div>
          <div className="p-6">
            <div className="space-y-2">
              {productosAgotados.map((producto) => (
                <div
                  key={producto.id_producto}
                  className="flex items-center justify-between p-4 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{producto.nombre}</p>
                    <p className="text-sm text-gray-600">{producto.categoria?.nombre || 'Sin categoría'}</p>
                    <p className="text-xs text-gray-500">Código: {producto.codigo_barra}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-600 text-white">
                      AGOTADO
                    </span>
                    <p className="text-sm text-gray-600 mt-1">Stock mínimo: {producto.stock_minimo}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tabla de Productos Bajo Stock Mínimo */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6 bg-[#f7fafc] border-b border-gray-200">
          <h3 className="text-lg font-semibold text-[#0f4c81]">Todos los Productos con Alertas de Stock</h3>
        </div>
        <div className="p-6">
          {productos.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-2 opacity-20" />
              <p>No hay productos bajo stock mínimo</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#f7fafc]">
                  <tr className="border-b-2 border-[#0f4c81]">
                    <th className="text-left p-3 text-[#0f4c81] font-semibold">Producto</th>
                    <th className="text-left p-3 text-[#0f4c81] font-semibold">Categoría</th>
                    <th className="text-center p-3 text-[#0f4c81] font-semibold">Stock Actual</th>
                    <th className="text-center p-3 text-[#0f4c81] font-semibold">Stock Mínimo</th>
                    <th className="text-center p-3 text-[#0f4c81] font-semibold">Diferencia</th>
                    <th className="text-center p-3 text-[#0f4c81] font-semibold">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map((producto) => (
                    <tr key={producto.id_producto} className="border-b border-gray-200 hover:bg-[#f7fafc] transition-colors">
                      <td className="p-3">
                        <div>
                          <p className="font-medium text-gray-900">{producto.nombre}</p>
                          <p className="text-sm text-gray-600">{producto.codigo_barra}</p>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-300">
                          {producto.categoria?.nombre || 'Sin categoría'}
                        </span>
                      </td>
                      <td className="text-center p-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          producto.stock === 0 ? 'bg-red-600 text-white' : 'bg-orange-500 text-white'
                        }`}>
                          {producto.stock}
                        </span>
                      </td>
                      <td className="text-center p-3 text-gray-700 font-medium">{producto.stock_minimo}</td>
                      <td className="text-center p-3 text-orange-600 font-semibold">
                        {producto.diferencia > 0 ? `-${producto.diferencia}` : producto.diferencia}
                      </td>
                      <td className="text-center p-3">
                        <span 
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            producto.estado === 'agotado'
                              ? 'bg-red-600 text-white' 
                              : 'bg-orange-500 text-white'
                          }`}
                        >
                          {producto.estado === 'agotado' ? 'Agotado' : 'Bajo Stock'}
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

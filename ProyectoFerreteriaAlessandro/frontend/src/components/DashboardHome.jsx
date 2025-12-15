import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useState, useEffect } from 'react';
import { ShoppingCart, Package, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';
import { dashboardService } from '../services/dashboardService';

export function DashboardHome({ user }) {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalVentasHoy: 0,
    ventasHoyCount: 0,
    productosActivos: 0,
    productosBajoStock: 0,
    valorInventario: 0,
    ventasRecientes: [],
    productosStockBajo: []
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];

      // Cargar datos en paralelo
      const results = await Promise.allSettled([
        dashboardService.getProductosActivosCount(),
        dashboardService.getValorInventario(),
        dashboardService.getLast10Ventas(), // Usamos todas las ventas para filtrar localmente
        dashboardService.getLast10Ventas(),
        dashboardService.getProductosBajoStock()
      ]);

      const [
        productosActivosRes,
        valorInventarioRes,
        ventasRes,
        ventasRecientesRes,
        productosBajoStockRes
      ] = results;

      // Filtrar ventas de hoy localmente
      const todasVentasData = ventasRes.status === 'fulfilled' ? ventasRes.value : {};
      const todasVentas = todasVentasData.data || [];
      
      const hoy = new Date();
      const inicioHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
      const finHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 23, 59, 59, 999);
      
      const ventasHoy = todasVentas.filter(v => {
        const fechaVenta = new Date(v.fecha);
        return fechaVenta >= inicioHoy && fechaVenta <= finHoy;
      });
      
      const totalVentasHoy = ventasHoy.reduce((sum, v) => sum + parseFloat(v.total || 0), 0);

      // Extraer ventas recientes
      const ventasRecientesData = ventasRecientesRes.status === 'fulfilled' ? ventasRecientesRes.value : {};
      const ventasRecientesList = ventasRecientesData.data || [];
      const ventasRecientes = ventasRecientesList.slice(0, 10);

      // Extraer productos bajo stock
      const productosBajoStockData = productosBajoStockRes.status === 'fulfilled' ? productosBajoStockRes.value : {};
      const productosBajoStock = productosBajoStockData.data || [];

      const newData = {
        totalVentasHoy,
        ventasHoyCount: ventasHoy.length,
        productosActivos: productosActivosRes.status === 'fulfilled' ? (productosActivosRes.value.data?.count || 0) : 0,
        valorInventario: valorInventarioRes.status === 'fulfilled' ? (valorInventarioRes.value.data?.valorTotal || 0) : 0,
        productosBajoStock: productosBajoStock.length,
        ventasRecientes: ventasRecientes.slice(0, 5),
        productosStockBajo: productosBajoStock.slice(0, 5)
      };

      setDashboardData(newData);
    } catch (error) {
      // Puedes dejar este error si quieres ver errores reales
      // console.error('Error al cargar datos del dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50/50 min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl font-semibold text-gray-600">Cargando datos del dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50/50 min-h-screen p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Bienvenido, {user.nombre}</h1>
        <p className="text-gray-600">Sistema de Punto de Venta - Ferretería Alessandro</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ventas Hoy</CardTitle>
            <DollarSign className="size-4 text-[#0f4c81]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#0f4c81]">L {dashboardData.totalVentasHoy.toFixed(2)}</div>
            <p className="text-xs text-gray-600 mt-1">{dashboardData.ventasHoyCount} transacciones</p>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Productos Activos</CardTitle>
            <Package className="size-4 text-[#0f4c81]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#0f4c81]">{dashboardData.productosActivos}</div>
            <p className="text-xs text-gray-600 mt-1">En inventario</p>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Valor Inventario</CardTitle>
            <TrendingUp className="size-4 text-[#0f4c81]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#0f4c81]">L {dashboardData.valorInventario.toFixed(0)}</div>
            <p className="text-xs text-gray-600 mt-1">Total en stock</p>
          </CardContent>
        </Card>

        <Card className={`bg-white ${dashboardData.productosBajoStock > 0 ? 'border-orange-400 bg-orange-50' : ''}`}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Alertas de Stock</CardTitle>
            <AlertTriangle className={`size-4 ${dashboardData.productosBajoStock > 0 ? 'text-orange-500' : 'text-[#0f4c81]'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${dashboardData.productosBajoStock > 0 ? 'text-orange-500' : 'text-[#0f4c81]'}`}>
              {dashboardData.productosBajoStock}
            </div>
            <p className="text-xs text-gray-600 mt-1">Productos bajo mínimo</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white">
          <CardHeader className="bg-gray-50/50 border-b">
            <CardTitle className="font-semibold text-[#0f4c81]">Ventas Recientes</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              {dashboardData.ventasRecientes.length > 0 ? (
                dashboardData.ventasRecientes.map((venta) => (
                  <div key={venta.id_venta} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-[#0f4c81]">{venta.codigo_factura || `VENTA-${venta.id_venta}`}</p>
                      <p className="text-sm text-gray-600">{venta.nombre_cliente || 'Cliente'}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-[#0f4c81]">L {parseFloat(venta.total || 0).toFixed(2)}</p>
                      <p className="text-sm text-gray-600">{venta.metodo_pago || 'N/A'}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No hay ventas recientes</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="bg-gray-50/50 border-b">
            <CardTitle className="font-semibold text-[#0f4c81]">Productos Bajo Stock</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              {dashboardData.productosStockBajo.length > 0 ? (
                dashboardData.productosStockBajo.map((producto) => (
                  <div key={producto.id_producto} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{producto.nombre}</p>
                      <p className="text-sm text-gray-600">{producto.nombre_categoria || 'Categoría'}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-orange-600">{producto.stock} unidades</p>
                      <p className="text-sm text-gray-600">Mín: {producto.stock_minimo}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No hay productos con bajo stock</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

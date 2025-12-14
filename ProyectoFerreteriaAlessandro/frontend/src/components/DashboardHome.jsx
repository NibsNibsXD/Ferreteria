import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ShoppingCart, Package, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';
import type { User } from '../App';
import { productos, ventas } from '../lib/mockData';

interface DashboardHomeProps {
  user: User;
}

export function DashboardHome({ user }: DashboardHomeProps) {
  const ventasHoy = ventas.filter(v => {
    const today = new Date().toISOString().split('T')[0];
    return v.fecha.startsWith(today);
  });
  
  const totalVentasHoy = ventasHoy.reduce((sum, v) => sum + v.total, 0);
  const productosActivos = productos.filter(p => p.activo).length;
  const productosBajoStock = productos.filter(p => p.stock <= p.stock_minimo).length;
  const valorInventario = productos.reduce((sum, p) => sum + (p.precio_venta * p.stock), 0);

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
            <div className="text-2xl font-bold text-[#0f4c81]">L {totalVentasHoy.toFixed(2)}</div>
            <p className="text-xs text-gray-600 mt-1">{ventasHoy.length} transacciones</p>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Productos Activos</CardTitle>
            <Package className="size-4 text-[#0f4c81]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#0f4c81]">{productosActivos}</div>
            <p className="text-xs text-gray-600 mt-1">En inventario</p>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Valor Inventario</CardTitle>
            <TrendingUp className="size-4 text-[#0f4c81]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#0f4c81]">L {valorInventario.toFixed(0)}</div>
            <p className="text-xs text-gray-600 mt-1">Total en stock</p>
          </CardContent>
        </Card>

        <Card className={`bg-white ${productosBajoStock > 0 ? 'border-orange-400 bg-orange-50' : ''}`}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Alertas de Stock</CardTitle>
            <AlertTriangle className={`size-4 ${productosBajoStock > 0 ? 'text-orange-500' : 'text-[#0f4c81]'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${productosBajoStock > 0 ? 'text-orange-500' : 'text-[#0f4c81]'}`}>
              {productosBajoStock}
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
              {ventas.slice(0, 5).map((venta) => (
                <div key={venta.id_venta} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#0f4c81]">{venta.codigo_factura}</p>
                    <p className="text-sm text-gray-600">{venta.cliente}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-[#0f4c81]">L {venta.total.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">{venta.metodo_pago}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="bg-gray-50/50 border-b">
            <CardTitle className="font-semibold text-[#0f4c81]">Productos Bajo Stock</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              {productos
                .filter(p => p.stock <= p.stock_minimo)
                .slice(0, 5)
                .map((producto) => (
                  <div key={producto.id_producto} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{producto.nombre}</p>
                      <p className="text-sm text-gray-600">{producto.categoria}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-orange-600">{producto.stock} unidades</p>
                      <p className="text-sm text-gray-600">Mín: {producto.stock_minimo}</p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

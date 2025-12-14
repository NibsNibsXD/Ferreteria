import React, { useEffect, useMemo, useState } from 'react';
import {
  ShoppingCart,
  Package,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { productoService, ventaService as ventaApi, alertasService } from '../services';

export function Dashboard({ user }) {
  const [stats, setStats] = useState({
    ventasHoy: 0,
    totalVentasHoy: 0,
    totalVentas: 0,
    productosActivos: 0,
    productosBajoStock: 0,
    valorInventario: 0,
  });
  const [ventasRecientes, setVentasRecientes] = useState([]);
  const [alertasStock, setAlertasStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat('es-HN', {
        style: 'currency',
        currency: 'HNL',
        minimumFractionDigits: 2,
      }),
    []
  );

  useEffect(() => {
    cargarDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cargarDashboard = async () => {
    setLoading(true);
    try {
      const [ventasResp, ventasRecientesResp, activosResp, inventarioResp, alertasResp] =
        await Promise.all([
          ventaApi.getAll(),
          ventaApi.getLast10(),
          productoService.getActivosCount(),
          productoService.getValorInventario(),
          alertasService.getProductosBajoStock(),
        ]);

      const ventas = ventasResp?.data?.data || ventasResp?.data || [];
      const ventasRecientesData = ventasRecientesResp?.data?.data || ventasRecientesResp?.data || [];

      const today = new Date().toISOString().split('T')[0];
      const ventasHoy = ventas.filter((venta) => {
        if (!venta?.fecha) return false;
        const fechaVenta = new Date(venta.fecha).toISOString().split('T')[0];
        return fechaVenta === today;
      });

      const totalVentasHoy = ventasHoy.reduce(
        (sum, venta) => sum + parseFloat(venta.total || 0),
        0
      );

      const productosActivos =
        activosResp?.data?.data?.count ?? activosResp?.data?.count ?? 0;

      const valorInventario =
        inventarioResp?.data?.data?.valorTotal ?? inventarioResp?.data?.valorTotal ?? 0;

      const alertasData = alertasResp?.data?.data || {};
      const productosAlerta = alertasData?.productos || alertasData || [];
      const productosBajoStock =
        alertasData?.cantidad ?? productosAlerta.length ?? 0;

      setStats({
        ventasHoy: ventasHoy.length,
        totalVentasHoy,
        totalVentas: Array.isArray(ventas) ? ventas.length : 0,
        productosActivos,
        productosBajoStock,
        valorInventario,
      });

      setVentasRecientes((Array.isArray(ventasRecientesData) ? ventasRecientesData : []).slice(0, 5));
      setAlertasStock((Array.isArray(productosAlerta) ? productosAlerta : []).slice(0, 5));
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error al cargar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-gray-600">Cargando dashboard...</div>;
  }

  const resumenCards = [
    {
      title: 'Ventas Hoy',
      value: currencyFormatter.format(stats.totalVentasHoy),
      subtitle: `${stats.ventasHoy} transacciones`,
      icon: DollarSign,
      accent: 'bg-[#0f4c81]/10 text-[#0f4c81]',
    },
    {
      title: 'Productos Activos',
      value: stats.productosActivos,
      subtitle: 'Disponibles en inventario',
      icon: Package,
      accent: 'bg-[#0f4c81]/10 text-[#0f4c81]',
    },
    {
      title: 'Valor Inventario',
      value: currencyFormatter.format(stats.valorInventario),
      subtitle: 'Costo acumulado',
      icon: TrendingUp,
      accent: 'bg-[#0f4c81]/10 text-[#0f4c81]',
    },
    {
      title: 'Alertas de Stock',
      value: stats.productosBajoStock,
      subtitle: 'Productos bajo mínimo',
      icon: AlertTriangle,
      accent:
        stats.productosBajoStock > 0
          ? 'bg-orange-100 text-orange-600'
          : 'bg-[#0f4c81]/10 text-[#0f4c81]',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-gray-500">Hola, {user?.nombre}</p>
          <h1 className="text-3xl font-bold text-[#0f4c81]">Panel de control</h1>
          <p className="text-gray-600">
            Sistema de Punto de Venta - Ferretería Alessandro
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-white border border-gray-200 px-3 py-2 rounded-lg shadow-sm">
          <Clock className="w-4 h-4 text-[#0f4c81]" />
          <span>
            Actualizado {lastUpdated.toLocaleDateString()} {lastUpdated.toLocaleTimeString()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {resumenCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="bg-white border border-gray-200 rounded-lg shadow-sm p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{card.title}</p>
                  <p className="text-3xl font-bold text-[#0f4c81] mt-1">{card.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${card.accent}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3">{card.subtitle}</p>
              {card.title === 'Ventas Hoy' && (
                <p className="text-xs text-gray-500 mt-1">
                  Total ventas registradas: {stats.totalVentas}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between px-6 py-4 border-b bg-[#f7fafc]">
            <div>
              <h2 className="text-lg font-semibold text-[#0f4c81]">Ventas Recientes</h2>
              <p className="text-xs text-gray-500">Últimas facturas emitidas</p>
            </div>
            <ShoppingCart className="w-5 h-5 text-[#0f4c81]" />
          </div>
          <div className="p-6 space-y-4">
            {ventasRecientes.length === 0 ? (
              <div className="text-center text-gray-500 text-sm">Sin ventas registradas.</div>
            ) : (
              ventasRecientes.map((venta) => (
                <div
                  key={venta.id_venta || venta.numero_factura}
                  className="flex items-center justify-between border border-gray-100 rounded-lg px-4 py-3 hover:border-[#0f4c81]/30 hover:bg-[#f7fafc] transition-colors"
                >
                  <div>
                    <p className="font-semibold text-[#0f4c81]">
                      {venta.codigo_factura || venta.numero_factura || 'Factura'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {venta.cliente?.nombre_completo ||
                        venta.cliente?.nombre ||
                        'Consumidor final'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {venta.metodo_pago?.nombre || 'Método no especificado'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-[#0f4c81]">
                      {currencyFormatter.format(parseFloat(venta.total || 0))}
                    </p>
                    <p className="text-xs text-gray-500">
                      {venta.fecha ? new Date(venta.fecha).toLocaleDateString() : ''}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between px-6 py-4 border-b bg-[#f7fafc]">
            <div>
              <h2 className="text-lg font-semibold text-[#0f4c81]">Productos Bajo Stock</h2>
              <p className="text-xs text-gray-500">Prioriza reposiciones</p>
            </div>
            <AlertTriangle className="w-5 h-5 text-orange-600" />
          </div>
          <div className="p-6 space-y-4">
            {alertasStock.length === 0 ? (
              <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                <CheckCircle2 className="w-4 h-4" />
                No hay productos en alerta de stock.
              </div>
            ) : (
              alertasStock.map((producto) => (
                <div
                  key={producto.id_producto}
                  className="flex items-center justify-between border border-orange-100 rounded-lg px-4 py-3 bg-orange-50/50"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{producto.nombre}</p>
                    <p className="text-sm text-gray-600">
                      {producto.categoria?.nombre || producto.categoria || 'Sin categoría'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-orange-600 font-semibold">
                      {producto.stock} unidades
                    </p>
                    <p className="text-xs text-gray-600">Mín: {producto.stock_minimo || producto.minimo}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

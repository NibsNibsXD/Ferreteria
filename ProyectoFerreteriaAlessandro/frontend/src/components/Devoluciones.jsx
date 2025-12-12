import React, { useState } from 'react';
import { Search, RotateCcw, AlertCircle } from 'lucide-react';
import { ventaService } from '../services';

export function Devoluciones({ user }) {
  const [codigoFactura, setCodigoFactura] = useState('');
  const [ventaEncontrada, setVentaEncontrada] = useState(null);
  const [buscando, setBuscando] = useState(false);
  const [procesando, setProcesando] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

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

  const procesarDevolucion = () => {
    if (!ventaEncontrada) return;
    setProcesando(true);
    // Aquí normalmente llamarías a un endpoint de devoluciones; por ahora solo confirmamos.
    setTimeout(() => {
      setMensaje({
        tipo: 'success',
        texto: `Devolución procesada para ${ventaEncontrada.codigo_factura || 'la factura'}`,
      });
      setCodigoFactura('');
      setVentaEncontrada(null);
      setProcesando(false);
    }, 400);
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

            <div className="flex items-center gap-2 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <p className="text-sm text-gray-800">
                Verifica el estado de los productos antes de procesar la devolución.
              </p>
            </div>

            <button
              onClick={procesarDevolucion}
              disabled={procesando}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#0f4c81] hover:bg-[#0a3a61] text-white px-4 py-3 rounded-lg transition-colors disabled:opacity-60"
            >
              <RotateCcw className="w-4 h-4" />
              {procesando ? 'Procesando...' : 'Procesar Devolución'}
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 bg-[#f7fafc] border-b flex items-center gap-2">
          <RotateCcw className="w-5 h-5 text-[#0f4c81]" />
          <h2 className="text-lg font-semibold text-[#0f4c81]">Devoluciones Recientes</h2>
        </div>
        <div className="p-6">
          <div className="text-center py-8 text-gray-500">
            <RotateCcw className="w-12 h-12 mx-auto mb-2 opacity-20" />
            <p>No hay devoluciones registradas</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Devoluciones;


import React, { useState, useEffect } from 'react';
import { DollarSign, Save, Printer, Plus, Building2, Package } from 'lucide-react';
import cajaService from '../services/cajaService';
import cierreService from '../services/cierreService';
import ventaService from '../services/ventaService';
import sucursalService from '../services/sucursalService';

export function CierreCaja({ user }) {
  const [cajas, setCajas] = useState([]);
  const [cajaSeleccionada, setCajaSeleccionada] = useState(null);
  const [cajaAsignadaUsuario, setCajaAsignadaUsuario] = useState(null); // Caja actualmente asignada
  const [sucursales, setSucursales] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [saldoInicial, setSaldoInicial] = useState(1000.00);
  const [efectivoContado, setEfectivoContado] = useState('');
  const [ventasHoy, setVentasHoy] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mostrarModalAsignarCaja, setMostrarModalAsignarCaja] = useState(false);

  // Función auxiliar para convertir a número
  const toNumber = (value) => {
    if (value === null || value === undefined || value === '') return 0;
    const num = parseFloat(value);
    return isNaN(num) ? 0 : num;
  };
  
  // Modales
  const [mostrarModalCaja, setMostrarModalCaja] = useState(false);
  const [mostrarModalSucursal, setMostrarModalSucursal] = useState(false);

  // Form data para nueva caja
  const [nuevaCaja, setNuevaCaja] = useState({
    nombre: '',
    saldo_inicial: 1000.00,
    id_usuario: user?.id_usuario || '',
    id_sucursal: ''
  });

  // Form data para nueva sucursal
  const [nuevaSucursal, setNuevaSucursal] = useState({
    nombre: '',
    direccion: '',
    telefono: ''
  });

  const isAdmin = user?.id_rol === 1;

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [cajasData, sucursalesData] = await Promise.all([
        cajaService.getAll(),
        sucursalService.getAll()
      ]);
      
      console.log('Cajas cargadas:', cajasData); // Debug
      
      setCajas(cajasData);
      setSucursales(sucursalesData);
      
      // Verificar si el usuario tiene una caja asignada
      const cajaUsuario = cajasData.find(c => c.id_usuario === user?.id_usuario);
      if (cajaUsuario) {
        setCajaAsignadaUsuario(cajaUsuario);
        setCajaSeleccionada(cajaUsuario);
        setSaldoInicial(toNumber(cajaUsuario.saldo_inicial) || 1000.00);
        // Cargar ventas solo si tiene caja asignada
        await cargarVentasDelDia();
      } else {
        // Si no tiene caja asignada, mostrar modal para seleccionar
        setMostrarModalAsignarCaja(true);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
      alert('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const cargarVentasDelDia = async () => {
    try {
      const ventas = await ventaService.getAll();
      const today = new Date().toISOString().split('T')[0];
      const ventasDelDia = ventas.filter(v => {
        const fechaVenta = new Date(v.fecha).toISOString().split('T')[0];
        return fechaVenta === today;
      });
      setVentasHoy(ventasDelDia);
    } catch (error) {
      console.error('Error al cargar ventas:', error);
    }
  };

  const handleCrearCaja = async (e) => {
    e.preventDefault();
    try {
      const nuevaCajaData = await cajaService.create(nuevaCaja);
      setCajas([...cajas, nuevaCajaData]);
      setMostrarModalCaja(false);
      setNuevaCaja({
        nombre: '',
        saldo_inicial: 1000.00,
        id_usuario: '',
        id_sucursal: ''
      });
      alert('Caja creada exitosamente');
    } catch (error) {
      console.error('Error al crear caja:', error);
      alert('Error al crear la caja');
    }
  };

  const handleAsignarCaja = async (idCaja) => {
    try {
      const caja = cajas.find(c => c.id_caja === parseInt(idCaja));
      if (!caja) return;

      // Verificar que la caja no tenga usuario asignado
      if (caja.id_usuario && caja.id_usuario !== user.id_usuario) {
        alert('Esta caja ya está asignada a otro usuario');
        return;
      }

      // Asignar usuario a la caja en la BD
      const cajaActualizada = await cajaService.update(caja.id_caja, {
        nombre: caja.nombre,
        saldo_inicial: caja.saldo_inicial,
        id_usuario: user.id_usuario,
        id_sucursal: caja.id_sucursal
      });

      // Actualizar lista de cajas en el estado
      const cajasActualizadas = cajas.map(c => 
        c.id_caja === caja.id_caja ? { ...c, id_usuario: user.id_usuario } : c
      );
      setCajas(cajasActualizadas);

      setCajaAsignadaUsuario({ ...caja, id_usuario: user.id_usuario });
      setCajaSeleccionada({ ...caja, id_usuario: user.id_usuario });
      setSaldoInicial(toNumber(caja.saldo_inicial) || 1000.00);
      setMostrarModalAsignarCaja(false);
      await cargarVentasDelDia();
      alert('Caja asignada exitosamente. La información se ha guardado.');
    } catch (error) {
      console.error('Error al asignar caja:', error);
      alert('Error al asignar la caja. Por favor intente nuevamente.');
    }
  };

  const handleCrearSucursal = async (e) => {
    e.preventDefault();
    try {
      const nuevaSucursalData = await sucursalService.create(nuevaSucursal);
      setSucursales([...sucursales, nuevaSucursalData]);
      setMostrarModalSucursal(false);
      setNuevaSucursal({
        nombre: '',
        direccion: '',
        telefono: ''
      });
      alert('Sucursal creada exitosamente');
    } catch (error) {
      console.error('Error al crear sucursal:', error);
      alert('Error al crear la sucursal');
    }
  };

  const realizarCierre = async () => {
    if (!efectivoContado) {
      alert('Ingrese el efectivo contado');
      return;
    }

    if (!cajaSeleccionada || !cajaAsignadaUsuario) {
      alert('Debe tener una caja asignada para realizar el cierre');
      return;
    }

    if (cajaSeleccionada.id_caja !== cajaAsignadaUsuario.id_caja) {
      alert('Solo puede hacer cierre de su caja asignada');
      return;
    }

    try {
      const cierreData = {
        id_usuario: user.id_usuario,
        id_caja: cajaSeleccionada.id_caja,
        saldo_inicial: saldoInicialNum,
        fecha: new Date().toISOString(),
        total_ventas: totalVentas,
        total_devoluciones: 0,
        total_neto: toNumber(efectivoContado),
        efectivo_esperado: efectivoEsperado,
        efectivo_contado: toNumber(efectivoContado),
        diferencia: diferencia
      };

      await cierreService.create(cierreData);
      
      // Liberar la caja (quitar asignación del usuario en la BD)
      await cajaService.update(cajaSeleccionada.id_caja, {
        nombre: cajaSeleccionada.nombre,
        saldo_inicial: cajaSeleccionada.saldo_inicial,
        id_usuario: null,
        id_sucursal: cajaSeleccionada.id_sucursal
      });

      alert('Cierre de caja realizado exitosamente. Caja liberada y guardada en la base de datos.');
      
      // Resetear estados
      setCajaAsignadaUsuario(null);
      setCajaSeleccionada(null);
      setEfectivoContado('');
      setVentasHoy([]);
      
      // Recargar cajas y mostrar modal para seleccionar nueva caja
      await cargarDatos();
    } catch (error) {
      console.error('Error al realizar cierre:', error);
      alert('Error al realizar el cierre de caja');
    }
  };

  // Cálculos
  const ventasEfectivo = ventasHoy.filter(v => v.metodo_pago === 'Efectivo' || v.id_metodo_pago === 1);
  const ventasTarjeta = ventasHoy.filter(v => v.metodo_pago === 'Tarjeta' || v.id_metodo_pago === 2);
  const ventasTransferencia = ventasHoy.filter(v => v.metodo_pago === 'Transferencia' || v.id_metodo_pago === 3);

  const totalEfectivo = ventasEfectivo.reduce((sum, v) => sum + toNumber(v.total), 0);
  const totalTarjeta = ventasTarjeta.reduce((sum, v) => sum + toNumber(v.total), 0);
  const totalTransferencia = ventasTransferencia.reduce((sum, v) => sum + toNumber(v.total), 0);
  const totalVentas = totalEfectivo + totalTarjeta + totalTransferencia;

  const saldoInicialNum = toNumber(saldoInicial);
  const efectivoEsperado = saldoInicialNum + totalEfectivo;
  const diferencia = toNumber(efectivoContado) - efectivoEsperado;

  return (
    <div className="p-6 space-y-6">
      {/* Si no tiene caja asignada, mostrar mensaje */}
      {!cajaAsignadaUsuario && !mostrarModalAsignarCaja && (
        <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-yellow-800 mb-2">No tiene una caja asignada</h2>
          <p className="text-yellow-700 mb-4">Debe seleccionar una caja disponible para poder trabajar</p>
          <button
            onClick={() => setMostrarModalAsignarCaja(true)}
            className="px-6 py-2 bg-[#0f4c81] text-white rounded-lg hover:bg-[#0a3a61] transition-colors"
          >
            Seleccionar Caja
          </button>
        </div>
      )}

      {/* Header - Siempre visible */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-[#0f4c81]">Cierre de Caja Diario</h1>
          <p className="text-gray-600 mt-2">Arqueo de caja para {user?.nombre}</p>
        </div>
        {isAdmin && (
          <div className="flex gap-2">
            <button
              onClick={() => setMostrarModalCaja(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#0f4c81] text-white rounded-lg hover:bg-[#0a3a61] transition-colors"
            >
              <Package className="w-4 h-4" />
              Nueva Caja
            </button>
            <button
              onClick={() => setMostrarModalSucursal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Building2 className="w-4 h-4" />
              Nueva Sucursal
            </button>
          </div>
        )}
      </div>

      {/* Contenido principal solo si tiene caja asignada */}
      {cajaAsignadaUsuario ? (
        <>
          {/* Selector de Caja - Solo lectura, muestra la caja asignada */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Caja Asignada (No se puede cambiar hasta hacer cierre)
            </label>
            <input
              type="text"
              value={cajaAsignadaUsuario ? `${cajaAsignadaUsuario.nombre} - ${cajaAsignadaUsuario.sucursal?.nombre || 'Sin sucursal'}` : 'Sin caja asignada'}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 font-semibold text-gray-700"
            />
          </div>

          {/* Contenido Principal */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Resumen de Ventas */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="bg-[#f7fafc] border-b px-6 py-4">
                <h2 className="text-xl font-bold text-[#0f4c81]">Resumen de Ventas del Día</h2>
              </div>
          <div className="p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Efectivo ({ventasEfectivo.length} ventas):</span>
                <span className="font-semibold">L {totalEfectivo.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tarjeta ({ventasTarjeta.length} ventas):</span>
                <span className="font-semibold">L {totalTarjeta.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Transferencia ({ventasTransferencia.length} ventas):</span>
                <span className="font-semibold">L {totalTransferencia.toFixed(2)}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total Ventas:</span>
                  <span className="text-[#0f4c81]">L {totalVentas.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Detalle por Transacción</h3>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {ventasHoy.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No hay ventas registradas hoy</p>
                ) : (
                  ventasHoy.map((venta) => (
                    <div key={venta.id_venta} className="flex justify-between items-center text-sm p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Venta #{venta.id_venta}</span>
                      <span className="text-gray-600">{venta.metodo_pago || 'N/A'}</span>
                      <span className="font-semibold text-[#0f4c81]">L {toNumber(venta.total).toFixed(2)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Arqueo de Caja y Acciones */}
        <div className="space-y-4">
          {/* Arqueo de Caja */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="bg-[#f7fafc] border-b px-6 py-4">
              <h2 className="text-xl font-bold text-[#0f4c81] flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Arqueo de Caja
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Saldo Inicial
                </label>
                <input
                  type="text"
                  value={`L ${saldoInicialNum.toFixed(2)}`}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ventas en Efectivo
                </label>
                <input
                  type="text"
                  value={`L ${totalEfectivo.toFixed(2)}`}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Efectivo Esperado
                </label>
                <input
                  type="text"
                  value={`L ${efectivoEsperado.toFixed(2)}`}
                  disabled
                  className="w-full px-4 py-2 border border-blue-200 rounded-lg bg-blue-50 font-semibold text-[#0f4c81]"
                />
              </div>

              <div className="border-t pt-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Efectivo Contado en Caja
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={efectivoContado}
                  onChange={(e) => setEfectivoContado(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f4c81] focus:border-transparent"
                />
              </div>

              {efectivoContado && (
                <div className={`p-4 rounded-lg border-2 ${
                  Math.abs(diferencia) < 0.01 ? 'bg-green-50 border-green-300' :
                  diferencia > 0 ? 'bg-blue-50 border-blue-300' :
                  'bg-red-50 border-red-300'
                }`}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Diferencia
                  </label>
                  <p className={`text-2xl font-bold ${
                    Math.abs(diferencia) < 0.01 ? 'text-green-600' :
                    diferencia > 0 ? 'text-blue-600' :
                    'text-red-600'
                  }`}>
                    {diferencia >= 0 ? '+' : ''}L {diferencia.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {Math.abs(diferencia) < 0.01 ? '✓ Caja cuadrada' :
                     diferencia > 0 ? '↑ Sobrante' : '↓ Faltante'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Acciones */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="bg-[#f7fafc] border-b px-6 py-4">
              <h2 className="text-xl font-bold text-[#0f4c81]">Acciones</h2>
            </div>
            <div className="p-6 space-y-3">
              <button
                onClick={realizarCierre}
                disabled={!efectivoContado || !cajaSeleccionada}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#0f4c81] text-white rounded-lg hover:bg-[#0a3a61] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
              >
                <Save className="w-5 h-5" />
                Guardar Cierre de Caja
              </button>
              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-[#0f4c81] text-[#0f4c81] rounded-lg hover:bg-[#f7fafc] transition-colors font-semibold">
                <Printer className="w-5 h-5" />
                Imprimir Reporte
              </button>
            </div>
          </div>
        </div>
      </div>
        </>
      ) : (
        // Mensaje cuando no tiene caja asignada - no mostrar resumen
        <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-8 text-center">
          <div className="text-gray-400 mb-4">
            <Package className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Sin Caja Asignada</h3>
          <p className="text-gray-600 mb-6">
            Seleccione una caja disponible para ver el resumen de ventas y realizar operaciones
          </p>
        </div>
      )}

      {/* Modal para crear Caja */}
      {mostrarModalCaja && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h2 className="text-2xl font-bold text-[#0f4c81] mb-4">Crear Nueva Caja</h2>
            <form onSubmit={handleCrearCaja} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre de la Caja
                </label>
                <input
                  type="text"
                  value={nuevaCaja.nombre}
                  onChange={(e) => setNuevaCaja({...nuevaCaja, nombre: e.target.value})}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f4c81] focus:border-transparent"
                  placeholder="Ej: Caja Principal"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Saldo Inicial
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={nuevaCaja.saldo_inicial}
                  onChange={(e) => setNuevaCaja({...nuevaCaja, saldo_inicial: parseFloat(e.target.value)})}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f4c81] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Sucursal
                </label>
                <select
                  value={nuevaCaja.id_sucursal}
                  onChange={(e) => setNuevaCaja({...nuevaCaja, id_sucursal: e.target.value})}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f4c81] focus:border-transparent"
                >
                  <option value="">Seleccione una sucursal</option>
                  {sucursales.map(sucursal => (
                    <option key={sucursal.id_sucursal} value={sucursal.id_sucursal}>
                      {sucursal.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Usuario Asignado (opcional)
                </label>
                <input
                  type="number"
                  value={nuevaCaja.id_usuario}
                  onChange={(e) => setNuevaCaja({...nuevaCaja, id_usuario: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f4c81] focus:border-transparent"
                  placeholder="ID del usuario"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setMostrarModalCaja(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#0f4c81] text-white rounded-lg hover:bg-[#0a3a61] transition-colors"
                >
                  Crear Caja
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para crear Sucursal */}
      {mostrarModalSucursal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h2 className="text-2xl font-bold text-green-600 mb-4">Crear Nueva Sucursal</h2>
            <form onSubmit={handleCrearSucursal} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre de la Sucursal
                </label>
                <input
                  type="text"
                  value={nuevaSucursal.nombre}
                  onChange={(e) => setNuevaSucursal({...nuevaSucursal, nombre: e.target.value})}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ej: Sucursal Centro"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Dirección
                </label>
                <input
                  type="text"
                  value={nuevaSucursal.direccion}
                  onChange={(e) => setNuevaSucursal({...nuevaSucursal, direccion: e.target.value})}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Dirección completa"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={nuevaSucursal.telefono}
                  onChange={(e) => setNuevaSucursal({...nuevaSucursal, telefono: e.target.value})}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="0000-0000"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setMostrarModalSucursal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Crear Sucursal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para asignar/seleccionar caja disponible */}
      {mostrarModalAsignarCaja && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h2 className="text-2xl font-bold text-[#0f4c81] mb-4">Seleccionar Caja Disponible</h2>
            <p className="text-gray-600 mb-4">Seleccione una caja disponible para comenzar a trabajar</p>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {(() => {
                const cajasDisponibles = cajas.filter(c => !c.id_usuario);
                console.log('Todas las cajas:', cajas); // Debug
                console.log('Cajas disponibles:', cajasDisponibles); // Debug
                
                if (cajasDisponibles.length === 0) {
                  return (
                    <div className="text-center py-6">
                      <p className="text-gray-500">No hay cajas disponibles</p>
                      <p className="text-sm text-gray-400 mt-2">Todas las cajas están asignadas a otros usuarios</p>
                      <p className="text-xs text-gray-400 mt-2">Total de cajas: {cajas.length}</p>
                    </div>
                  );
                }
                
                return cajasDisponibles.map(caja => (
                    <div
                      key={caja.id_caja}
                      onClick={() => handleAsignarCaja(caja.id_caja)}
                      className="p-4 border-2 border-gray-200 rounded-lg hover:border-[#0f4c81] hover:bg-blue-50 cursor-pointer transition-all"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold text-gray-800">{caja.nombre}</h3>
                          <p className="text-sm text-gray-600">
                            {caja.sucursal?.nombre || 'Sin sucursal'}
                          </p>
                          <p className="text-sm text-green-600 font-medium mt-1">
                            Saldo inicial: L {toNumber(caja.saldo_inicial).toFixed(2)}
                          </p>
                        </div>
                        <div className="text-green-600">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ));
              })()}
            </div>

            <div className="mt-6">
              <button
                onClick={() => setMostrarModalAsignarCaja(false)}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

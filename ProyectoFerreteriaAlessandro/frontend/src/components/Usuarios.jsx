import { useState, useEffect } from 'react';
import { Users as UsersIcon, Plus, Edit, Trash2, Shield, X } from 'lucide-react';
import usuarioService from '../services/usuarioService';
import rolService from '../services/rolService';
import sucursalService from '../services/sucursalService';
import Notificacion from './Notificacion';
import ModalConfirmacion from './ModalConfirmacion';
import { useNotificacion } from '../hooks/useNotificacion';

export function Usuarios() {
  const { notificaciones, cerrarNotificacion, mostrarExito, mostrarError, mostrarAdvertencia } = useNotificacion();
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogAbierto, setDialogAbierto] = useState(false);
  const [usuarioEliminar, setUsuarioEliminar] = useState(null);
  const [usuarioEditar, setUsuarioEditar] = useState(null);
  const [modalConfirmacion, setModalConfirmacion] = useState({ isOpen: false, tipo: 'danger', titulo: '', mensaje: '', onConfirm: null });
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    contrasena: '',
    id_rol: '',
    id_sucursal: '',
    estado: true
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      console.log('Iniciando carga de datos de usuarios...');
      const [usuariosData, rolesData, sucursalesData] = await Promise.all([
        usuarioService.getAll(),
        rolService.getAll(),
        sucursalService.getAll()
      ]);
      console.log('Datos cargados:', { usuariosData, rolesData, sucursalesData });
      setUsuarios(usuariosData);
      setRoles(rolesData);
      setSucursales(sucursalesData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      console.error('Error completo:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      if (error.response?.status === 403 || error.response?.status === 401) {
        mostrarError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
      } else {
        mostrarError('Error al cargar los datos: ' + (error.response?.data?.error || error.message));
      }
    } finally {
      setLoading(false);
    }
  };

  const abrirDialogoNuevo = () => {
    setUsuarioEditar(null);
    setFormData({
      nombre: '',
      correo: '',
      contrasena: '',
      id_rol: roles.length > 0 ? roles[0].id_rol : '',
      id_sucursal: sucursales.length > 0 ? sucursales[0].id_sucursal : '',
      estado: true
    });
    setDialogAbierto(true);
  };

  const abrirDialogoEditar = (usuario) => {
    setUsuarioEditar(usuario);
    setFormData({
      nombre: usuario.nombre,
      correo: usuario.correo,
      contrasena: '',
      id_rol: usuario.id_rol,
      id_sucursal: usuario.id_sucursal || '',
      estado: usuario.estado
    });
    setDialogAbierto(true);
  };

  const guardarUsuario = async () => {
    try {
      if (!formData.nombre || !formData.correo || !formData.id_rol) {
        mostrarAdvertencia('Por favor completa todos los campos obligatorios');
        return;
      }

      if (!usuarioEditar && !formData.contrasena) {
        mostrarAdvertencia('La contraseña es requerida para nuevos usuarios');
        return;
      }

      const dataToSend = {
        nombre: formData.nombre,
        correo: formData.correo,
        id_rol: parseInt(formData.id_rol),
        id_sucursal: formData.id_sucursal ? parseInt(formData.id_sucursal) : null,
        estado: formData.estado
      };

      // Solo incluir contraseña si se proporcionó
      if (formData.contrasena) {
        dataToSend.contrasena = formData.contrasena;
      }

      if (usuarioEditar) {
        await usuarioService.update(usuarioEditar.id_usuario, dataToSend);
        mostrarExito('Usuario actualizado exitosamente');
      } else {
        await usuarioService.create(dataToSend);
        mostrarExito('Usuario creado exitosamente');
      }

      setDialogAbierto(false);
      setFormData({
        nombre: '',
        correo: '',
        contrasena: '',
        id_rol: '',
        id_sucursal: '',
        estado: true
      });
      cargarDatos();
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      mostrarError('Error al guardar usuario: ' + (error.response?.data?.error || error.message));
    }
  };

  const eliminarUsuario = async () => {
    try {
      await usuarioService.delete(usuarioEliminar);
      mostrarExito('Usuario eliminado exitosamente');
      setUsuarioEliminar(null);
      cargarDatos();
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      mostrarError('Error al eliminar usuario: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const getRolNombre = (idRol) => {
    const rol = roles.find(r => r.id_rol === idRol);
    return rol ? rol.nombre : 'N/A';
  };

  const getSucursalNombre = (idSucursal) => {
    if (!idSucursal) return 'Sin asignar';
    const sucursal = sucursales.find(s => s.id_sucursal === idSucursal);
    return sucursal ? sucursal.nombre : 'N/A';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-[#0f4c81] text-lg mb-2">Cargando usuarios...</div>
          <div className="text-gray-500 text-sm">Por favor espera un momento</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#0f4c81]">Gestión de Usuarios</h1>
          <p className="text-gray-600 mt-1">Administrar cuentas y permisos del personal</p>
        </div>
        <button
          onClick={abrirDialogoNuevo}
          className="flex items-center gap-2 px-4 py-2 bg-[#0f4c81] hover:bg-[#0a3a61] text-white rounded-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nuevo Usuario
        </button>
      </div>

      {/* Tabla de Usuarios */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-[#f7fafc] border-b px-6 py-4">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-[#0f4c81]">
            <UsersIcon className="w-5 h-5" />
            Lista de Usuarios
          </h2>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#f7fafc]">
                <tr className="border-b-2 border-[#0f4c81]">
                  <th className="text-left p-3 text-[#0f4c81] font-semibold">Usuario</th>
                  <th className="text-left p-3 text-[#0f4c81] font-semibold">Correo</th>
                  <th className="text-center p-3 text-[#0f4c81] font-semibold">Rol</th>
                  <th className="text-center p-3 text-[#0f4c81] font-semibold">Estado</th>
                  <th className="text-left p-3 text-[#0f4c81] font-semibold">Fecha Creación</th>
                  <th className="text-center p-3 text-[#0f4c81] font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-gray-500">
                      No hay usuarios registrados
                    </td>
                  </tr>
                ) : (
                  usuarios.map((usuario) => {
                    const rolNombre = getRolNombre(usuario.id_rol);
                    return (
                      <tr key={usuario.id_usuario} className="border-b hover:bg-[#f7fafc] transition-colors">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <div className="bg-[#0f4c81] bg-opacity-10 text-[#0f4c81] rounded-full p-2">
                              <UsersIcon className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="font-medium">{usuario.nombre}</p>
                              {usuario.id_rol === 1 && (
                                <div className="flex items-center gap-1 text-xs text-gray-600">
                                  <Shield className="w-3 h-3" />
                                  <span>Acceso total</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-gray-700">{usuario.correo}</td>
                        <td className="text-center p-3">
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                              usuario.id_rol === 1
                                ? 'bg-[#0f4c81] text-white'
                                : 'bg-gray-200 text-gray-800'
                            }`}
                          >
                            {rolNombre}
                          </span>
                        </td>
                        <td className="text-center p-3">
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                              usuario.estado
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {usuario.estado ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td className="p-3 text-gray-700">
                          {new Date(usuario.fecha_creacion).toLocaleDateString('es-ES')}
                        </td>
                        <td className="text-center p-3">
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => abrirDialogoEditar(usuario)}
                              className="p-2 text-[#0f4c81] hover:bg-[#f7fafc] rounded-md transition-colors"
                              title="Editar"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setUsuarioEliminar(usuario.id_usuario)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Roles y Permisos */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-[#f7fafc] border-b px-6 py-4">
          <h2 className="text-xl font-semibold text-[#0f4c81]">Roles del Sistema</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roles.map((rol, index) => (
              <div 
                key={rol.id_rol} 
                className={`p-4 rounded-lg ${
                  index === 0 
                    ? 'border-2 border-[#0f4c81]' 
                    : 'border border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  {index === 0 ? (
                    <Shield className="w-5 h-5 text-[#0f4c81]" />
                  ) : (
                    <UsersIcon className="w-5 h-5 text-gray-600" />
                  )}
                  <h3 className={`text-lg font-semibold ${
                    index === 0 ? 'text-[#0f4c81]' : 'text-gray-800'
                  }`}>
                    {rol.nombre}
                  </h3>
                </div>
                {rol.descripcion && (
                  <p className="text-sm text-gray-600 mb-2">{rol.descripcion}</p>
                )}
                <div className="text-sm text-gray-600">
                  <p className="font-medium mb-1">Usuarios con este rol:</p>
                  <p className="text-2xl font-bold text-[#0f4c81]">
                    {usuarios.filter(u => u.id_rol === rol.id_rol).length}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dialog Crear Usuario */}
      {dialogAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setDialogAbierto(false)}
          />
          
          {/* Modal */}
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-900">
                {usuarioEditar ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
              </h3>
              <button
                onClick={() => setDialogAbierto(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  placeholder="Ej: Juan Pérez"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0f4c81] focus:border-transparent"
                  required
                />
              </div>

              {/* Correo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  name="correo"
                  value={formData.correo}
                  onChange={handleInputChange}
                  placeholder="usuario@alessandro.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0f4c81] focus:border-transparent"
                  required
                />
              </div>

              {/* Contraseña */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña {!usuarioEditar && '*'}
                </label>
                <input
                  type="password"
                  name="contrasena"
                  value={formData.contrasena}
                  onChange={handleInputChange}
                  placeholder={usuarioEditar ? 'Dejar vacío para no cambiar' : 'Mínimo 8 caracteres'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0f4c81] focus:border-transparent"
                />
              </div>

              {/* Rol */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rol *
                </label>
                <select
                  name="id_rol"
                  value={formData.id_rol}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0f4c81] focus:border-transparent"
                  required
                >
                  <option value="">Seleccione un rol</option>
                  {roles.map(rol => (
                    <option key={rol.id_rol} value={rol.id_rol}>
                      {rol.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sucursal */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sucursal
                </label>
                <select
                  name="id_sucursal"
                  value={formData.id_sucursal}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0f4c81] focus:border-transparent"
                >
                  <option value="">Sin asignar</option>
                  {sucursales.map(sucursal => (
                    <option key={sucursal.id_sucursal} value={sucursal.id_sucursal}>
                      {sucursal.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Estado */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="estado"
                  checked={formData.estado}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-[#0f4c81] border-gray-300 rounded focus:ring-[#0f4c81]"
                  id="estado-checkbox"
                />
                <label htmlFor="estado-checkbox" className="text-sm font-medium text-gray-700">
                  Usuario activo
                </label>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={guardarUsuario}
                  className="flex-1 px-4 py-2 bg-[#0f4c81] hover:bg-[#0a3a61] text-white rounded-md transition-colors font-medium"
                >
                  {usuarioEditar ? 'Actualizar Usuario' : 'Crear Usuario'}
                </button>
                <button
                  onClick={() => setDialogAbierto(false)}
                  className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-md transition-colors font-medium"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alert Dialog Eliminar */}
      {usuarioEliminar !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setUsuarioEliminar(null)}
          />
          
          {/* Modal */}
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              ¿Eliminar usuario?
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Esta acción no se puede deshacer. El usuario será eliminado permanentemente del sistema.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setUsuarioEliminar(null)}
                className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-md transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={eliminarUsuario}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors font-medium"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

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

      {/* Modal de Confirmación */}
      <ModalConfirmacion
        isOpen={modalConfirmacion.isOpen}
        onClose={() => setModalConfirmacion({ ...modalConfirmacion, isOpen: false })}
        onConfirm={modalConfirmacion.onConfirm}
        titulo={modalConfirmacion.titulo}
        mensaje={modalConfirmacion.mensaje}
        tipo={modalConfirmacion.tipo}
      />
    </div>
  );
}

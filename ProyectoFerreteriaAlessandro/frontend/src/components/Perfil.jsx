import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, Save, Eye, EyeOff } from 'lucide-react';
import usuarioService from '../services/usuarioService';
import { authService } from '../services/authService';
import api from '../services/api';

// Función para calcular el tiempo relativo
const getTimeAgo = (date) => {
  if (!date) return 'N/D';
  
  const now = new Date();
  const past = new Date(date);
  const diffMs = now - past;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSeconds < 60) return 'hace unos segundos';
  if (diffMinutes < 60) return `hace ${diffMinutes} minuto${diffMinutes > 1 ? 's' : ''}`;
  if (diffHours < 24) return `hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
  if (diffDays < 30) return `hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
  if (diffMonths < 12) return `hace ${diffMonths} mes${diffMonths > 1 ? 'es' : ''}`;
  return `hace ${diffYears} año${diffYears > 1 ? 's' : ''}`;
};

export function Perfil({ user, onUpdateUser }) {
  console.log('========== COMPONENTE PERFIL RENDERIZADO ==========');
  console.log('Perfil renderizado con user:', user);
  console.log('fecha_registro del user:', user?.fecha_registro);
  console.log('===================================================');
  
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [nombre, setNombre] = useState(user?.nombre || '');
  const [correo, setCorreo] = useState(user?.correo || '');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  // Refrescar datos del usuario al cargar el componente
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log('Perfil: Refrescando datos del usuario...');
        const refreshedUser = await authService.refreshUserData();
        console.log('Perfil: Datos refrescados:', refreshedUser);
        if (refreshedUser) {
          onUpdateUser(refreshedUser);
        }
      } catch (error) {
        console.error('Error al refrescar datos del usuario:', error);
      }
    };
    fetchUserData();
  }, [onUpdateUser]);

  const clearMessage = () => setMensaje({ tipo: '', texto: '' });

  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    clearMessage();

    if (!nombre.trim() || !correo.trim()) {
      setMensaje({ tipo: 'error', texto: 'Por favor completa todos los campos' });
      return;
    }

    try {
      const payload = {
        nombre: nombre.trim(),
        correo: correo.trim(),
        id_rol: user?.id_rol || user?.rol?.id_rol,
        id_sucursal: user?.id_sucursal || user?.sucursal?.id_sucursal || null,
        activo: user?.activo ?? true,
      };

      const updated = await usuarioService.update(user?.id_usuario || user?.id, payload);
      const updatedUser = {
        ...user,
        ...payload,
        ...(updated?.data?.data || updated?.data || updated),
      };

      onUpdateUser(updatedUser);
      setIsEditingInfo(false);
      setMensaje({ tipo: 'success', texto: 'Información actualizada exitosamente' });
    } catch (error) {
      const errorMsg =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        'No se pudo actualizar la información';
      setMensaje({ tipo: 'error', texto: errorMsg });
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    clearMessage();

    if (!currentPassword || !newPassword || !confirmPassword) {
      setMensaje({ tipo: 'error', texto: 'Completa todos los campos de contraseña' });
      return;
    }

    if (newPassword.length < 6) {
      setMensaje({ tipo: 'error', texto: 'La nueva contraseña debe tener al menos 6 caracteres' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMensaje({ tipo: 'error', texto: 'Las contraseñas no coinciden' });
      return;
    }

    if (newPassword === currentPassword) {
      setMensaje({ tipo: 'error', texto: 'La nueva contraseña debe ser diferente a la actual' });
      return;
    }

    try {
      await api.put('/auth/change-password', {
        contrasenaActual: currentPassword,
        contrasenaNueva: newPassword,
      });

      setMensaje({ tipo: 'success', texto: 'Contraseña actualizada exitosamente' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setIsChangingPassword(false);
    } catch (error) {
      const errorMsg =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        'No se pudo actualizar la contraseña';
      setMensaje({ tipo: 'error', texto: errorMsg });
    }
  };

  const handleCancelEditInfo = () => {
    setNombre(user?.nombre || '');
    setCorreo(user?.correo || '');
    setIsEditingInfo(false);
    clearMessage();
  };

  const handleCancelChangePassword = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setIsChangingPassword(false);
    clearMessage();
  };

  const renderMessage = () =>
    mensaje.texto ? (
      <div
        className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm ${
          mensaje.tipo === 'success'
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}
      >
        <span className="font-medium">{mensaje.tipo === 'success' ? 'Éxito:' : 'Error:'}</span>
        {mensaje.texto}
      </div>
    ) : null;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#0f4c81]">Mi Perfil</h1>
        <p className="text-gray-600">Gestiona tu información personal y seguridad</p>
      </div>

      {renderMessage()}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#0f4c81] p-2 rounded-lg">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Información Personal</h2>
              <p className="text-sm text-gray-600">Actualiza tus datos personales</p>
            </div>
          </div>
          {!isEditingInfo && (
            <button
              onClick={() => setIsEditingInfo(true)}
              className="px-4 py-2 border border-[#0f4c81] text-[#0f4c81] rounded-md hover:bg-[#0f4c81] hover:text-white transition-colors"
            >
              Editar
            </button>
          )}
        </div>

        <div className="p-6">
          {isEditingInfo ? (
            <form onSubmit={handleUpdateInfo} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700" htmlFor="nombre">
                  Nombre completo
                </label>
                <input
                  id="nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ingresa tu nombre"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0f4c81]"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700" htmlFor="correo">
                  Correo electrónico
                </label>
                <input
                  id="correo"
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  placeholder="usuario@alessandro.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0f4c81]"
                  required
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-[#0f4c81] hover:bg-[#0a3a61] text-white px-4 py-2 rounded-md transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Guardar cambios
                </button>
                <button
                  type="button"
                  onClick={handleCancelEditInfo}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Nombre</p>
                  <p className="text-gray-900 font-medium">{user?.nombre || 'N/D'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Correo electrónico</p>
                  <p className="text-gray-900 font-medium">{user?.correo || 'N/D'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Rol</p>
                  <p className="text-gray-900 font-medium">
                    {user?.rol?.nombre || user?.rol || 'N/D'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">ID de usuario</p>
                  <p className="text-gray-900 font-medium">#{user?.id_usuario || user?.id || 'N/D'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#0f4c81] p-2 rounded-lg">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Seguridad</h2>
              <p className="text-sm text-gray-600">Cambia tu contraseña de acceso</p>
            </div>
          </div>
          {!isChangingPassword && (
            <button
              onClick={() => setIsChangingPassword(true)}
              className="px-4 py-2 border border-[#0f4c81] text-[#0f4c81] rounded-md hover:bg-[#0f4c81] hover:text-white transition-colors"
            >
              Cambiar contraseña
            </button>
          )}
        </div>

        <div className="p-6">
          {isChangingPassword ? (
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700" htmlFor="current-password">
                  Contraseña actual
                </label>
                <div className="relative">
                  <input
                    id="current-password"
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Ingresa tu contraseña actual"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0f4c81]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700" htmlFor="new-password">
                  Nueva contraseña
                </label>
                <div className="relative">
                  <input
                    id="new-password"
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0f4c81]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700" htmlFor="confirm-password">
                  Confirmar nueva contraseña
                </label>
                <div className="relative">
                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repite tu nueva contraseña"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0f4c81]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-[#0f4c81] hover:bg-[#0a3a61] text-white px-4 py-2 rounded-md transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Actualizar contraseña
                </button>
                <button
                  type="button"
                  onClick={handleCancelChangePassword}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <div className="text-gray-600">
              <p>Tu contraseña está protegida y encriptada.</p>
              <p className="text-sm mt-2">
                Última actualización:{' '}
                {user?.fecha_registro ? getTimeAgo(user.fecha_registro) : 'N/D'}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b flex items-center gap-3">
          <div className="bg-[#0f4c81] p-2 rounded-lg">
            <Mail className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Información de Cuenta</h2>
            <p className="text-sm text-gray-600">Detalles adicionales de tu cuenta</p>
          </div>
        </div>
        <div className="p-6 space-y-3">
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-600">Estado de la cuenta</span>
            <span className={user?.activo === false ? 'text-red-600' : 'text-green-600'}>
              {user?.activo === false ? 'Inactiva' : 'Activa'}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-600">Fecha de creación</span>
            <span className="text-gray-900">
              {user?.fecha_registro ? (
                <>
                  {new Date(user.fecha_registro).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                  ({getTimeAgo(user.fecha_registro)})
                </>
              ) : (
                'N/D'
              )}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-600">Último acceso</span>
            <span className="text-gray-900">Hoy</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Sucursal asignada</span>
            <span className="text-gray-900">
              {user?.sucursal?.nombre
                ? `${user.sucursal.nombre} #${user.sucursal.id_sucursal}`
                : user?.id_sucursal
                  ? `Sucursal #${user.id_sucursal}`
                  : 'No asignada'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Perfil;


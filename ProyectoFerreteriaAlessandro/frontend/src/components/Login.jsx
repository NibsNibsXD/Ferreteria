import React, { useState } from 'react';
import { authService } from '../services/authService';
import { Mail, ArrowLeft, Lock, CheckCircle, Wrench, Eye, EyeOff } from 'lucide-react';

export function Login({ onLogin }) {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login(correo, contrasena);
      onLogin(response.usuario);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    // TODO: Implementar lógica de recuperación de contraseña con el backend
    alert('Funcionalidad de recuperación de contraseña pendiente de implementar');
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    setPasswordError('');

    if (newPassword.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden');
      return;
    }

    // TODO: Implementar cambio de contraseña con el backend
    alert('Contraseña actualizada exitosamente');
    setNewPassword('');
    setConfirmPassword('');
    setResetEmail('');
    setShowChangePassword(false);
  };

  // Pantalla de cambio de contraseña
  if (showChangePassword) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#f7fafc] to-gray-100">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg">
          <div className="p-6 space-y-1 text-center border-b">
            <div className="flex justify-center mb-4">
              <div className="bg-[#0f4c81] p-3 rounded-lg">
                <Lock className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold">Nueva Contraseña</h2>
            <p className="text-sm text-gray-500">
              Ingresa tu nueva contraseña para la cuenta: {resetEmail}
            </p>
          </div>
          <div className="p-6">
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nueva Contraseña</label>
                <input
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0f4c81]"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Confirmar Contraseña</label>
                <input
                  type="password"
                  placeholder="Repite tu contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0f4c81]"
                  required
                />
              </div>
              {passwordError && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                  {passwordError}
                </div>
              )}
              <button
                type="submit"
                className="w-full bg-[#0f4c81] hover:bg-[#0a3a61] text-white py-2 rounded-md transition-colors"
              >
                Cambiar Contraseña
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowChangePassword(false);
                  setNewPassword('');
                  setConfirmPassword('');
                  setPasswordError('');
                  setResetEmail('');
                }}
                className="w-full border border-gray-300 hover:bg-gray-50 py-2 rounded-md transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Cancelar
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Pantalla de recuperación de contraseña
  if (showResetPassword) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#f7fafc] to-gray-100">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg">
          <div className="p-6 space-y-1 text-center border-b">
            <div className="flex justify-center mb-4">
              <div className="bg-[#0f4c81] p-3 rounded-lg">
                <Mail className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold">Recuperar Contraseña</h2>
            <p className="text-sm text-gray-500">
              Ingresa tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña
            </p>
          </div>
          <div className="p-6">
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Correo electrónico</label>
                <input
                  type="email"
                  placeholder="usuario@alessandro.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0f4c81]"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#0f4c81] hover:bg-[#0a3a61] text-white py-2 rounded-md transition-colors"
              >
                Enviar enlace de recuperación
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowResetPassword(false);
                  setResetEmail('');
                }}
                className="w-full border border-gray-300 hover:bg-gray-50 py-2 rounded-md transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver al inicio de sesión
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Pantalla de login principal
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#f7fafc] to-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg">
        <div className="p-6 space-y-1 text-center border-b">
          <div className="flex justify-center mb-4">
            <div className="bg-[#0f4c81] p-3 rounded-lg">
              <Wrench className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold">Ferretería Alessandro</h2>
          <p className="text-sm text-gray-500">Sistema de Punto de Venta</p>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Correo electrónico</label>
              <input
                type="email"
                placeholder="usuario@alessandro.com"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0f4c81]"
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Contraseña</label>
                <button
                  type="button"
                  className="text-sm text-[#0f4c81] hover:underline"
                  onClick={() => setShowResetPassword(true)}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0f4c81]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0f4c81] hover:bg-[#0a3a61] text-white py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;

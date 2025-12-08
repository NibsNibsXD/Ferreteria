import React, { useEffect, useState } from 'react';
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
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [resetStatus, setResetStatus] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [changeLoading, setChangeLoading] = useState(false);

  // Detectar token desde la URL (?resetToken=...&email=...)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get('resetToken');
    const emailFromUrl = params.get('email');

    if (tokenFromUrl && emailFromUrl) {
      setResetToken(tokenFromUrl);
      setResetEmail(emailFromUrl);
      setShowResetPassword(false);
      setShowChangePassword(true);

      // Limpiar los query params de la barra de dirección
      if (window.history?.replaceState) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

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

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setResetError('');
    setResetStatus('');
    setResetLoading(true);

    try {
      const response = await authService.requestPasswordReset(resetEmail);
      setResetStatus(response.message || 'Revisa tu correo para continuar con el restablecimiento.');

      // Si el backend devuelve token (modo desarrollo sin SMTP), lo precargamos
      if (response.token || response.tokenDev) {
        setResetToken(response.token || response.tokenDev);
      }

      // Mostrar pantalla de cambio para ingresar el token y la nueva contraseña
      setShowChangePassword(true);
    } catch (err) {
      setResetError(err.response?.data?.error || 'No se pudo enviar el enlace de recuperación');
    } finally {
      setResetLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setResetStatus('');
    setChangeLoading(true);

    if (!resetToken) {
      setPasswordError('Ingresa el código/token enviado a tu correo');
      setChangeLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('La contraseña debe tener al menos 8 caracteres');
      setChangeLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden');
      setChangeLoading(false);
      return;
    }

    try {
      const response = await authService.resetPassword({
        token: resetToken,
        correo: resetEmail,
        contrasenaNueva: newPassword,
      });

      setResetStatus(response.message || 'Contraseña actualizada correctamente');
      setNewPassword('');
      setConfirmPassword('');
      setResetToken('');
      setShowChangePassword(false);
      setShowResetPassword(false);
    } catch (err) {
      setPasswordError(err.response?.data?.error || 'No se pudo restablecer la contraseña');
    } finally {
      setChangeLoading(false);
    }
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
              {resetStatus && (
                <div className="flex items-start gap-2 p-3 rounded-lg border border-green-200 bg-green-50 text-sm text-green-800">
                  <CheckCircle className="w-4 h-4 mt-0.5" />
                  <div>{resetStatus}</div>
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium">Código o token de recuperación</label>
                <input
                  type="text"
                  placeholder="Pega el código que recibiste por correo"
                  value={resetToken}
                  onChange={(e) => setResetToken(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0f4c81]"
                  required
                />
                <p className="text-xs text-gray-500">
                  Correo asociado: <span className="font-medium">{resetEmail}</span>
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Nueva Contraseña</label>
                <input
                  type="password"
                  placeholder="Mínimo 8 caracteres"
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
                {changeLoading ? 'Actualizando...' : 'Cambiar Contraseña'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowChangePassword(false);
                  setNewPassword('');
                  setConfirmPassword('');
                  setPasswordError('');
                  setResetEmail('');
                  setResetToken('');
                  setResetStatus('');
                  setResetError('');
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
              {resetStatus && (
                <div className="flex items-start gap-2 p-3 rounded-lg border border-green-200 bg-green-50 text-sm text-green-800">
                  <CheckCircle className="w-4 h-4 mt-0.5" />
                  <div>{resetStatus}</div>
                </div>
              )}
              {resetError && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                  {resetError}
                </div>
              )}
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
                disabled={resetLoading}
                className="w-full bg-[#0f4c81] hover:bg-[#0a3a61] text-white py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resetLoading ? 'Enviando...' : 'Enviar enlace de recuperación'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowResetPassword(false);
                  setResetEmail('');
                  setResetStatus('');
                  setResetError('');
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
                  onClick={() => {
                    setShowResetPassword(true);
                    setShowChangePassword(false);
                    setResetStatus('');
                    setResetError('');
                    setPasswordError('');
                  }}
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
            {resetStatus && !showResetPassword && !showChangePassword && (
              <div className="flex items-start gap-2 p-3 rounded-lg border border-green-200 bg-green-50 text-sm text-green-800">
                <CheckCircle className="w-4 h-4 mt-0.5" />
                <div>{resetStatus}</div>
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

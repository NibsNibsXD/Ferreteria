import { useState, useCallback } from 'react';

export const useNotificacion = () => {
  const [notificaciones, setNotificaciones] = useState([]);

  const mostrarNotificacion = useCallback((tipo, mensaje, duracion = 4000) => {
    const id = Date.now();
    setNotificaciones(prev => [...prev, { id, tipo, mensaje, duracion }]);
  }, []);

  const cerrarNotificacion = useCallback((id) => {
    setNotificaciones(prev => prev.filter(notif => notif.id !== id));
  }, []);

  const mostrarExito = useCallback((mensaje, duracion) => {
    mostrarNotificacion('success', mensaje, duracion);
  }, [mostrarNotificacion]);

  const mostrarError = useCallback((mensaje, duracion) => {
    mostrarNotificacion('error', mensaje, duracion);
  }, [mostrarNotificacion]);

  const mostrarAdvertencia = useCallback((mensaje, duracion) => {
    mostrarNotificacion('warning', mensaje, duracion);
  }, [mostrarNotificacion]);

  const mostrarInfo = useCallback((mensaje, duracion) => {
    mostrarNotificacion('info', mensaje, duracion);
  }, [mostrarNotificacion]);

  return {
    notificaciones,
    cerrarNotificacion,
    mostrarExito,
    mostrarError,
    mostrarAdvertencia,
    mostrarInfo
  };
};

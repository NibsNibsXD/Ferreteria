import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const Notificacion = ({ tipo = 'info', mensaje, onClose, duracion = 4000 }) => {
  const [visible, setVisible] = useState(true);
  const [saliendo, setSaliendo] = useState(false);

  useEffect(() => {
    if (duracion > 0) {
      const timer = setTimeout(() => {
        cerrar();
      }, duracion);
      return () => clearTimeout(timer);
    }
  }, [duracion]);

  const cerrar = () => {
    setSaliendo(true);
    setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, 300);
  };

  if (!visible) return null;

  const configuraciones = {
    success: {
      icono: CheckCircle,
      color: 'bg-green-50 border-green-500',
      iconoColor: 'text-green-500',
      textoColor: 'text-green-800'
    },
    error: {
      icono: XCircle,
      color: 'bg-red-50 border-red-500',
      iconoColor: 'text-red-500',
      textoColor: 'text-red-800'
    },
    warning: {
      icono: AlertCircle,
      color: 'bg-yellow-50 border-yellow-500',
      iconoColor: 'text-yellow-500',
      textoColor: 'text-yellow-800'
    },
    info: {
      icono: Info,
      color: 'bg-blue-50 border-blue-500',
      iconoColor: 'text-blue-500',
      textoColor: 'text-blue-800'
    }
  };

  const config = configuraciones[tipo] || configuraciones.info;
  const Icono = config.icono;

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-start gap-3 p-4 border-l-4 rounded-lg shadow-lg min-w-[320px] max-w-md transition-all duration-300 ${
        config.color
      } ${saliendo ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'}`}
    >
      <Icono className={`w-6 h-6 flex-shrink-0 ${config.iconoColor}`} />
      <p className={`flex-1 text-sm font-medium ${config.textoColor}`}>{mensaje}</p>
      <button
        onClick={cerrar}
        className={`flex-shrink-0 ${config.iconoColor} hover:opacity-70 transition-opacity`}
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Notificacion;

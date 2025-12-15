import React from 'react';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

const ModalConfirmacion = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  titulo = '¿Estás seguro?', 
  mensaje, 
  tipo = 'warning',
  textoConfirmar = 'Confirmar',
  textoCancelar = 'Cancelar'
}) => {
  if (!isOpen) return null;

  const configuraciones = {
    warning: {
      icono: AlertCircle,
      colorIcono: 'text-yellow-500',
      colorBoton: 'bg-yellow-500 hover:bg-yellow-600'
    },
    danger: {
      icono: XCircle,
      colorIcono: 'text-red-500',
      colorBoton: 'bg-red-500 hover:bg-red-600'
    },
    success: {
      icono: CheckCircle,
      colorIcono: 'text-green-500',
      colorBoton: 'bg-green-500 hover:bg-green-600'
    },
    info: {
      icono: Info,
      colorIcono: 'text-blue-500',
      colorBoton: 'bg-blue-500 hover:bg-blue-600'
    }
  };

  const config = configuraciones[tipo] || configuraciones.warning;
  const Icono = config.icono;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 transform transition-all animate-fadeIn">
        <div className="flex items-start gap-4">
          <div className={`flex-shrink-0 ${config.colorIcono}`}>
            <Icono className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{titulo}</h3>
            <p className="text-gray-600 text-sm">{mensaje}</p>
          </div>
        </div>
        
        <div className="flex gap-3 mt-6 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            {textoCancelar}
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 text-white rounded-lg transition-colors font-medium ${config.colorBoton}`}
          >
            {textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmacion;

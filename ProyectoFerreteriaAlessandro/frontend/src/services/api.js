import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('No se encontró token de autenticación');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas de error
api.interceptors.response.use(
  (response) => {
    // Normalizar cualquier objeto metodo_pago en las respuestas
    if (response.data && typeof response.data === 'object') {
      response.data = normalizeMetodoPago(response.data);
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Token inválido, expirado o sin permisos
      console.error('Error de autenticación:', error.response?.data?.error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Función para normalizar objetos metodo_pago recursivamente
const normalizeMetodoPago = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(normalizeMetodoPago);
  }
  
  if (obj && typeof obj === 'object') {
    const normalized = {};
    for (const [key, value] of Object.entries(obj)) {
      if (key === 'metodo_pago' && value && typeof value === 'object' && value.nombre) {
        // Convertir objeto metodo_pago a string
        normalized[key] = value.nombre;
        normalized['metodo_pago_original'] = value;
      } else if (typeof value === 'object') {
        normalized[key] = normalizeMetodoPago(value);
      } else {
        normalized[key] = value;
      }
    }
    return normalized;
  }
  
  return obj;
};

export default api;

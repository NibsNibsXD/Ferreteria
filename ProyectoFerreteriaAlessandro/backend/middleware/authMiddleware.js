const jwt = require('jsonwebtoken');

// Clave secreta para JWT (en producción debe estar en variables de entorno)
const JWT_SECRET = process.env.JWT_SECRET || 'ferreteria_alessandro_secret_key_2025';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

/**
 * Middleware para verificar el token JWT
 */
const authenticateToken = (req, res, next) => {
  try {
    // Obtener token del header Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        error: 'Acceso denegado. Token no proporcionado.' 
      });
    }

    // Verificar token
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ 
          error: 'Token inválido o expirado.' 
        });
      }

      // Guardar información del usuario en la request
      req.user = user;
      next();
    });
  } catch (error) {
    return res.status(500).json({ 
      error: 'Error en la autenticación: ' + error.message 
    });
  }
};

/**
 * Middleware para verificar roles específicos
 * @param {Array} rolesPermitidos - Array de IDs de roles permitidos
 */
const authorizeRoles = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Usuario no autenticado.' 
      });
    }

    if (!rolesPermitidos.includes(req.user.id_rol)) {
      return res.status(403).json({ 
        error: 'No tienes permisos para acceder a este recurso.' 
      });
    }

    next();
  };
};

/**
 * Genera un token JWT
 * @param {Object} payload - Datos a incluir en el token
 * @returns {string} - Token JWT
 */
const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { 
    expiresIn: JWT_EXPIRES_IN 
  });
};

/**
 * Verifica un token JWT
 * @param {string} token - Token a verificar
 * @returns {Object} - Payload del token decodificado
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Token inválido: ' + error.message);
  }
};

module.exports = {
  authenticateToken,
  authorizeRoles,
  generateToken,
  verifyToken,
  JWT_SECRET
};

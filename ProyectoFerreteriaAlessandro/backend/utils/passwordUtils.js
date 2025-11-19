const bcrypt = require('bcrypt');

/**
 * Número de rondas de salt para bcrypt
 * Más rondas = más seguridad pero más lento
 */
const SALT_ROUNDS = 10;

/**
 * Encripta una contraseña usando bcrypt
 * @param {string} password - Contraseña en texto plano
 * @returns {Promise<string>} - Contraseña encriptada
 */
const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    throw new Error('Error al encriptar la contraseña: ' + error.message);
  }
};

/**
 * Compara una contraseña en texto plano con una encriptada
 * @param {string} password - Contraseña en texto plano
 * @param {string} hashedPassword - Contraseña encriptada
 * @returns {Promise<boolean>} - true si coinciden, false si no
 */
const comparePassword = async (password, hashedPassword) => {
  try {
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
  } catch (error) {
    throw new Error('Error al comparar contraseñas: ' + error.message);
  }
};

/**
 * Valida que la contraseña cumpla con los requisitos mínimos de seguridad
 * @param {string} password - Contraseña a validar
 * @returns {Object} - { isValid: boolean, message: string }
 */
const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, message: 'La contraseña es requerida' };
  }

  if (password.length < 8) {
    return { isValid: false, message: 'La contraseña debe tener al menos 8 caracteres' };
  }

  if (password.length > 100) {
    return { isValid: false, message: 'La contraseña es demasiado larga' };
  }

  // Opcional: Verificar que contenga al menos una letra mayúscula
  // const hasUpperCase = /[A-Z]/.test(password);
  
  // Opcional: Verificar que contenga al menos un número
  // const hasNumber = /[0-9]/.test(password);
  
  // Opcional: Verificar que contenga al menos un carácter especial
  // const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return { isValid: true, message: 'Contraseña válida' };
};

module.exports = {
  hashPassword,
  comparePassword,
  validatePassword,
  SALT_ROUNDS
};

const nodemailer = require('nodemailer');

/**
 * Crea un transporte de correo usando la configuración del .env
 * @returns {nodemailer.Transporter}
 */
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true', // true para port 465, false para otros
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

/**
 * Envía un correo de alerta de bajo stock
 * @param {Object} options - Opciones del correo
 * @param {string} options.to - Correo destinatario
 * @param {Array<Object>} options.productos - Lista de productos en bajo stock
 * @param {string} options.productos[].nombre - Nombre del producto
 * @param {number} options.productos[].stockActual - Stock actual
 * @param {number} options.productos[].stockMinimo - Stock mínimo
 * @param {string} options.productos[].codigoBarra - Código de barra (opcional)
 * @returns {Promise<Object>} - Resultado del envío
 */
const sendLowStockAlertEmail = async ({ to, productos }) => {
  try {
    // Validar que hay productos
    if (!productos || productos.length === 0) {
      console.log('No hay productos para alertar');
      return { success: false, message: 'No hay productos en bajo stock' };
    }

    // Validar correo destinatario
    if (!to) {
      throw new Error('No se especificó un correo destinatario');
    }

    // Crear transporte
    const transporter = createTransporter();

    // Construir el cuerpo del correo
    const productosLista = productos.map(p => {
      const codigoBarra = p.codigoBarra ? ` (${p.codigoBarra})` : '';
      return `- ${p.nombre}${codigoBarra}
  Stock actual: ${p.stockActual} unidades
  Stock mínimo: ${p.stockMinimo} unidades
  Déficit: ${p.stockMinimo - p.stockActual} unidades`;
    }).join('\n\n');

    const asunto = `⚠️ Alerta de Bajo Stock - Ferretería Alessandro`;

    const cuerpo = `
Estimado usuario,

Se ha detectado que los siguientes productos han alcanzado o están por debajo del stock mínimo:

${productosLista}

Por favor, considere reabastecer estos productos lo antes posible para evitar desabastecimiento.

---
Este es un mensaje automático del sistema de Ferretería Alessandro.
Fecha: ${new Date().toLocaleString('es-ES')}
    `.trim();

    // Configurar opciones del correo
    const mailOptions = {
      from: process.env.FROM_EMAIL || process.env.SMTP_USER,
      to: to,
      subject: asunto,
      text: cuerpo
    };

    // Enviar correo
    const info = await transporter.sendMail(mailOptions);

    console.log('Correo de alerta de bajo stock enviado:', info.messageId);

    return {
      success: true,
      messageId: info.messageId,
      message: 'Correo enviado exitosamente'
    };
  } catch (error) {
    console.error('Error al enviar correo de alerta de bajo stock:', error.message);
    throw error;
  }
};

/**
 * Verifica la configuración del servicio de correo
 * @returns {boolean} - true si está configurado, false si no
 */
const isEmailConfigured = () => {
  return !!(process.env.SMTP_USER && process.env.SMTP_PASS);
};

/**
 * Obtiene el correo destinatario para alertas
 * Prioridad: usuario autenticado > correo de alertas configurado > null
 * @param {Object} req - Objeto request de Express
 * @returns {string|null} - Correo destinatario o null
 */
const getAlertRecipientEmail = (req) => {
  // Intentar obtener del usuario autenticado
  if (req.user && req.user.correo) {
    return req.user.correo;
  }

  // Si no, usar el correo de alertas del .env
  if (process.env.ALERT_EMAIL) {
    return process.env.ALERT_EMAIL;
  }

  // Si no hay ninguno configurado
  console.warn('No se encontró correo destinatario para alertas');
  return null;
};

module.exports = {
  sendLowStockAlertEmail,
  isEmailConfigured,
  getAlertRecipientEmail
};

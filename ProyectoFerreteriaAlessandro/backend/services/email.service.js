const nodemailer = require('nodemailer');

/**
 * Crea un transporte de correo usando la configuración del .env
 * @returns {nodemailer.Transporter}
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    secure: process.env.SMTP_SECURE === 'true', // true para 465, false para otros
    auth: process.env.SMTP_USER && process.env.SMTP_PASS ? {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    } : undefined
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
 * Envía un correo con el enlace/código para restablecer contraseña
 * @param {Object} options
 * @param {string} options.to - Correo destinatario
 * @param {string} options.nombre - Nombre del usuario (opcional)
 * @param {string} [options.resetUrl] - Enlace directo con el token
 * @param {string} [options.token] - Token en texto plano (se envía solo como referencia)
 * @param {number} [options.expiresInMinutes=60] - Minutos de validez del enlace
 */
const sendPasswordResetEmail = async ({ to, nombre = 'usuario', resetUrl, token, expiresInMinutes = 60 }) => {
  if (!to) {
    throw new Error('No se especificó un correo destinatario');
  }

  if (!resetUrl && !token) {
    throw new Error('Se requiere un enlace o token de recuperación');
  }

  if (!isEmailConfigured()) {
    throw new Error('Servicio de correo no configurado (SMTP_USER/SMTP_PASS faltantes)');
  }

  const transporter = createTransporter();

  const footer = `
---
Este mensaje fue generado automáticamente por el sistema de Ferretería Alessandro.
Si no solicitaste este cambio, ignora este correo.
`;

  const texto = `
Hola ${nombre},

Recibimos una solicitud para restablecer tu contraseña.

${resetUrl ? `Puedes restablecerla usando este enlace (válido por ${expiresInMinutes} minutos):
${resetUrl}
` : ''}
${token ? `Si el sistema te pide un código, utiliza:
${token}
` : ''}
Si no solicitaste este cambio, no necesitas hacer nada.

${footer}
`.trim();

  const html = `
    <div style="font-family: Arial, sans-serif; color: #1f2937;">
      <p>Hola <strong>${nombre}</strong>,</p>
      <p>Recibimos una solicitud para restablecer tu contraseña.</p>
      ${resetUrl ? `<p>Puedes restablecerla usando este enlace (válido por ${expiresInMinutes} minutos):<br/><a href="${resetUrl}" style="color:#0f4c81;">${resetUrl}</a></p>` : ''}
      ${token ? `<p>Si el sistema te pide un código, utiliza:<br/><strong style="font-size:16px;">${token}</strong></p>` : ''}
      <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
      <hr />
      <p style="font-size:12px; color:#6b7280;">Este mensaje fue generado automáticamente por el sistema de Ferretería Alessandro.</p>
    </div>
  `;

  const mailOptions = {
    from: process.env.FROM_EMAIL || process.env.SMTP_USER,
    to,
    subject: 'Recuperación de contraseña - Ferretería Alessandro',
    text: texto,
    html
  };

  const info = await transporter.sendMail(mailOptions);

  return {
    success: true,
    messageId: info.messageId,
    message: 'Correo de recuperación enviado'
  };
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
  getAlertRecipientEmail,
  sendPasswordResetEmail
};

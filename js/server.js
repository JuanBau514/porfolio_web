require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');

const app = express();

// Configuración de CORS más permisiva para desarrollo
app.use(cors({
  origin: ['http://localhost:5500', 'http://127.0.0.1:5500', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Configuración de seguridad
app.use(helmet({
  contentSecurityPolicy: false // Desactivar CSP para desarrollo
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración de Nodemailer con contraseña de aplicación
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});

// Verificar configuración de transporter al inicio
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Error en configuración de email:', error);
  } else {
    console.log('✅ Servidor de email configurado correctamente');
  }
});

// Limitar tasa de envíos
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Máximo 5 intentos por IP
  message: { error: 'Demasiados intentos. Inténtalo de nuevo más tarde.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Función para verificar reCAPTCHA (opcional en desarrollo)
async function verifyRecaptcha(token) {
  if (process.env.NODE_ENV === 'development' && (!token || token === 'TEST_TOKEN')) {
    console.log('Modo desarrollo: omitiendo verificación reCAPTCHA');
    return true;
  }

  if (!process.env.RECAPTCHA_SECRET_KEY) {
    console.log('RECAPTCHA_SECRET_KEY no configurado, omitiendo verificación');
    return true;
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`
    });

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error verificando reCAPTCHA:', error);
    return false;
  }
}

// Middleware para logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Ruta de prueba
app.get('/api/test', (req, res) => {
  res.json({ 
    status: 'El servidor está funcionando',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
    emailConfigured: !!process.env.EMAIL_USER && !!process.env.EMAIL_APP_PASSWORD
  });
});

// Ruta para enviar correo
app.post('/api/contact', limiter, async (req, res) => {
  console.log('=== PROCESANDO CONTACTO ===');
  
  try {
    // Extraer datos del body
    const { name, email, message, 'g-recaptcha-response': recaptchaToken } = req.body;

    console.log('Datos recibidos:', { 
      name: name ? '✓' : '✗', 
      email: email ? '✓' : '✗', 
      message: message ? '✓' : '✗',
      recaptcha: recaptchaToken ? '✓' : '✗'
    });

    // Validación de campos requeridos
    if (!name || !email || !message) {
      return res.status(400).json({ 
        error: 'Todos los campos son requeridos',
        missing: { name: !name, email: !email, message: !message }
      });
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Email inválido' });
    }

    // Verificación reCAPTCHA (opcional)
    const recaptchaValid = await verifyRecaptcha(recaptchaToken);
    if (!recaptchaValid && process.env.NODE_ENV !== 'development') {
      return res.status(400).json({ error: 'Verificación reCAPTCHA fallida' });
    }

    // Configuración del correo
    const mailOptions = {
      from: `"Portfolio Web" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `Nuevo mensaje de ${name}`,
      text: `
Nombre: ${name}
Email: ${email}
Mensaje: ${message}
Fecha: ${new Date().toLocaleString('es-ES')}
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            Nuevo mensaje de contacto
          </h2>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 10px 0;"><strong>Nombre:</strong> ${name}</p>
            <p style="margin: 10px 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 10px 0;"><strong>Fecha:</strong> ${new Date().toLocaleString('es-ES')}</p>
          </div>
          <div style="background: white; padding: 20px; border-left: 4px solid #007bff; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Mensaje:</h3>
            <p style="line-height: 1.6; color: #555;">
              ${message.replace(/\n/g, '<br>')}
            </p>
          </div>
          <div style="text-align: center; margin-top: 30px; color: #666; font-size: 12px;">
            <p>Este mensaje fue enviado desde tu portfolio web</p>
          </div>
        </div>
      `
    };

    console.log('Enviando correo...');

    // Enviar correo
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Correo enviado:', info.messageId);

    // Respuesta exitosa
    res.status(200).json({ 
      success: true, 
      message: 'Mensaje enviado correctamente',
      messageId: info.messageId
    });

  } catch (error) {
    console.error('❌ Error en /api/contact:', error.message);
    
    // Respuesta de error más específica
    let errorMessage = 'Error al enviar el mensaje';
    if (error.code === 'EAUTH') {
      errorMessage = 'Error de autenticación con Gmail';
    } else if (error.code === 'ECONNECTION') {
      errorMessage = 'Error de conexión con el servidor de correo';
    }
    
    res.status(500).json({ 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejo de errores global
app.use((error, req, res, next) => {
  console.error('Error global:', error);
  res.status(500).json({ 
    error: 'Error interno del servidor',
    details: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
  console.log(`📧 Email: ${process.env.EMAIL_USER}`);
  console.log(`🔒 Modo: ${process.env.NODE_ENV || 'production'}`);
  console.log(`🌐 Probar en: http://localhost:${PORT}/api/test`);
});

// Verificar configuración
console.log('\n=== VERIFICACIÓN DE CONFIGURACIÓN ===');
console.log('EMAIL_USER:', process.env.EMAIL_USER || '❌ No configurado');
console.log('EMAIL_APP_PASSWORD:', process.env.EMAIL_APP_PASSWORD ? '✅ Configurado' : '❌ No configurado');
console.log('RECAPTCHA_SECRET_KEY:', process.env.RECAPTCHA_SECRET_KEY ? '✅ Configurado' : '⚠️  No configurado (opcional)');
console.log('NODE_ENV:', process.env.NODE_ENV || 'production');
console.log('=====================================\n');
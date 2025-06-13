require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path'); // ← IMPORTANTE para rutas

const app = express();

// CORS
app.use(cors({
  origin: ['http://127.0.0.1:5500', 'http://localhost:3000', 'http://127.0.0.1:3001', 'http://localhost:3001'],
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔧 Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, 'PORTFOLIO_WEB'))); // Asegúrate que esta sea la carpeta correcta

// Configuración de Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});

// reCAPTCHA
async function verifyRecaptcha(token) {
  if (!token || !process.env.RECAPTCHA_SECRET_KEY) return false;

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`
    });
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error verificando reCAPTCHA:', error);
    return false;
  }
}

// POST contacto
app.post('/api/contact', async (req, res) => {
  console.log('Body recibido:', req.body);

  try {
    const { name, email, phone = '', message, 'g-recaptcha-response': token } = req.body;

    if (!name || !email || !message || !token) {
      return res.status(400).json({ 
        success: false,
        error: 'Todos los campos son requeridos' 
      });
    }

    const recaptchaValid = await verifyRecaptcha(token);
    if (!recaptchaValid) {
      return res.status(400).json({ 
        success: false,
        error: 'Verificación reCAPTCHA fallida' 
      });
    }

    const mailOptions = {
      from: `"Portfolio Contacto" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `Nuevo mensaje de ${name}`,
      text: `
        Nombre: ${name}
        Email: ${email}
        Teléfono: ${phone || 'No proporcionado'}
        Mensaje: ${message}
      `,
      html: `
        <h2>Nuevo mensaje de contacto</h2>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Teléfono:</strong> ${phone || 'No proporcionado'}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `
    };

    await transporter.sendMail(mailOptions);
    
    res.json({ 
      success: true, 
      message: 'Mensaje enviado correctamente' 
    });

  } catch (error) {
    console.error('Error en /api/contact:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error interno del servidor',
      details: error.message 
    });
  }
});

// Ruta test
app.get('/api/test', (req, res) => {
  res.json({
    status: 'Servidor funcionando',
    emailConfigured: !!process.env.EMAIL_USER
  });
});

// 🏠 Catch-all para servir index.html en producción
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'PORTFOLIO_WEB', 'index.html'));
});

// Iniciar servidor
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});

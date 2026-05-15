require('dotenv').config();
const express = require('express');
const { Resend } = require('resend');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const fetch = require('node-fetch');
const path = require('path');

const app = express();

// ── Security headers (CSP off para no romper scripts inline) ──────────────────
app.use(helmet({ contentSecurityPolicy: false }));

// ── Rate limiting en rutas API ────────────────────────────────────────────────
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Demasiados intentos. Intenta de nuevo en 15 minutos.' }
});
app.use('/api/', apiLimiter);

// ── CORS ──────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  'http://127.0.0.1:5500',
  'http://localhost:3000',
  'http://127.0.0.1:3001',
  'http://localhost:8080',   
  'https://porfolioweb-production.up.railway.app',
  'https://juanpablobautista.dev',
  'https://www.juanpablobautista.dev',
  'https://porfolioweb-production.up.railway.app/',
];

app.use(cors({
  origin: function (origin, callback) {
    // Permitir peticiones sin origin (same-origin, Postman, curl)
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Static files ──────────────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'PORTFOLIO_WEB')));

// ── Resend — email API sobre HTTPS (Railway bloquea SMTP, no HTTPS) ───────────
const resend = new Resend(process.env.RESEND_API_KEY);

if (!process.env.RESEND_API_KEY) {
  console.warn('⚠️  RESEND_API_KEY no configurado — emails deshabilitados');
} else {
  console.log('✅ Resend listo — correos habilitados');
}

// ── reCAPTCHA ─────────────────────────────────────────────────────────────────
async function verifyRecaptcha(token) {
  if (!process.env.RECAPTCHA_SECRET_KEY) {
    console.warn('⚠️  RECAPTCHA_SECRET_KEY no configurado — verificación omitida');
    return true;
  }
  if (!token) return false;

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`
    });
    const data = await response.json();
    if (!data.success) console.warn('reCAPTCHA rechazado:', data['error-codes']);
    return data.success;
  } catch (err) {
    console.error('Error verificando reCAPTCHA:', err.message);
    return false;
  }
}

// ── POST /api/contact ─────────────────────────────────────────────────────────
app.post('/api/contact', async (req, res) => {
  console.log('📩 Contacto de:', req.body?.email);

  try {
    const { name, email, phone = '', message, 'g-recaptcha-response': token } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'Nombre, email y mensaje son requeridos' });
    }

    if (!token) {
      return res.status(400).json({ success: false, error: 'Token reCAPTCHA faltante' });
    }

    const recaptchaValid = await verifyRecaptcha(token);
    if (!recaptchaValid) {
      return res.status(400).json({ success: false, error: 'Verificación reCAPTCHA fallida' });
    }

    const { error: sendError } = await resend.emails.send({
      from: 'Portfolio Juan Pablo <noreply@juanpablobautista.dev>',
      to: [process.env.EMAIL_USER],
      reply_to: email,
      subject: `[Portfolio] Mensaje de ${name}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#333;border-bottom:2px solid #f0c040;padding-bottom:8px">
            Nuevo mensaje de contacto
          </h2>
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr style="background:#f9f9f9">
              <td style="padding:8px 12px;font-weight:bold;width:120px">Nombre</td>
              <td style="padding:8px 12px">${name}</td>
            </tr>
            <tr>
              <td style="padding:8px 12px;font-weight:bold">Email</td>
              <td style="padding:8px 12px"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr style="background:#f9f9f9">
              <td style="padding:8px 12px;font-weight:bold">Teléfono</td>
              <td style="padding:8px 12px">${phone || 'No proporcionado'}</td>
            </tr>
          </table>
          <div style="margin-top:20px;padding:16px;background:#f9f9f9;border-left:4px solid #f0c040;font-size:14px">
            ${message.replace(/\n/g, '<br>')}
          </div>
          <p style="font-size:11px;color:#999;margin-top:24px">
            Enviado desde el portfolio — juanpablobautista.dev
          </p>
        </div>
      `
    });

    if (sendError) throw new Error(sendError.message);

    res.json({ success: true, message: 'Mensaje enviado correctamente' });

  } catch (error) {
    console.error('Error en /api/contact:', error.message);
    res.status(500).json({
      success: false,
      error: 'Error al enviar el mensaje. Por favor intenta de nuevo.',
      details: process.env.NODE_ENV !== 'production' ? error.message : undefined
    });
  }
});

// ── GET /api/test — diagnóstico rápido ────────────────────────────────────────
app.get('/api/test', (req, res) => {
  res.json({
    status: 'Servidor funcionando',
    emailConfigured: !!process.env.EMAIL_USER,
    emailUser: process.env.EMAIL_USER || null,
    resendConfigured: !!process.env.RESEND_API_KEY,
    recaptchaConfigured: !!process.env.RECAPTCHA_SECRET_KEY
  });
});

// ── GET /api/test-email — envía un correo de prueba directo ──────────────────
app.get('/api/test-email', async (req, res) => {
  try {
    const { error } = await resend.emails.send({
      from: 'Portfolio Test <noreply@juanpablobautista.dev>',
      to: [process.env.EMAIL_USER],
      subject: '[Portfolio] Test de envío de correo',
      html: '<p>✅ El sistema de correo del portfolio funciona correctamente.</p>'
    });
    if (error) throw new Error(error.message);
    res.json({ success: true, message: 'Email enviado a ' + process.env.EMAIL_USER });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// ── Catch-all → index.html ────────────────────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'PORTFOLIO_WEB', 'index.html'));
});

// ── Iniciar ───────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor en http://localhost:${PORT}`);
  console.log(`   EMAIL_USER       : ${process.env.EMAIL_USER        || '⚠️  no configurado'}`);
  console.log(`   RESEND_API_KEY   : ${process.env.RESEND_API_KEY    ? '✅ configurado' : '⚠️  no configurado'}`);
  console.log(`   RECAPTCHA_SECRET : ${process.env.RECAPTCHA_SECRET_KEY ? '✅ configurado' : '⚠️  no configurado'}`);
});

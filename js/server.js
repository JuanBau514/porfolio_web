require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const recaptcha = require('express-recaptcha');

const app = express();

// Configuración de seguridad
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());

// Configuración de reCAPTCHA
recaptcha.init('TU_SITE_KEY', 'TU_SECRET_KEY');

// Limitar tasa de envíos (5 por hora por IP)
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 5,
  message: 'Demasiados intentos de contacto desde esta IP, por favor inténtalo de nuevo más tarde.'
});

// Configuración de Nodemailer
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Ruta para enviar correo
app.post('/api/contact', limiter, recaptcha.middleware.verify, async (req, res) => {
  // Verificar reCAPTCHA
  if (!req.recaptcha.error) {
    return res.status(400).json({ error: 'Invalid reCAPTCHA' });
  }

  // Verificar honeypot
  if (req.body.honeypot) {
    return res.status(400).json({ error: 'Spam detected' });
  }

  // Validar campos
  const { name, email, phone, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Configurar correo
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'jbautistaclavijo@gmail.com',
      subject: `Nuevo mensaje de contacto de ${name}`,
      text: `
        Nombre: ${name}
        Email: ${email}
        Teléfono: ${phone || 'No proporcionado'}
        
        Mensaje:
        ${message}
      `,
      html: `
        <h2>Nuevo mensaje de contacto</h2>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Teléfono:</strong> ${phone || 'No proporcionado'}</p>
        <h3>Mensaje:</h3>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `
    };

    // Enviar correo
    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Error sending message' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
const express = require('express');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

app.post('/register', (req, res) => {
  const { nombre, apellidos, documento, direccion, esquina, celular, email, user, password } = req.body;

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: process.env.GMAIL_USER,
    subject: 'Nuevo Registro en el Club',
    text: `
Nombre: ${nombre}
Apellidos: ${apellidos}
Documento: ${documento}
Dirección: ${direccion}
Esquina: ${esquina}
Celular: ${celular}
Email: ${email}
Usuario: ${user}
Contraseña: ${password}
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send('Error al enviar el correo.');
    }
    res.status(200).send('Formulario enviado correctamente!');
  });
});

app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));

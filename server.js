const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

// Crear una aplicación Express
const app = express();
const PORT = 3000;

// Usar body-parser para leer los datos del formulario
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Configuración del transportador de Nodemailer para Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'tutiaclub@gmail.com', // Tu correo de Gmail
    pass: 'tuContraseñaNormal'   // Tu contraseña normal de Gmail
  }
});

// Ruta para manejar el formulario
app.post('/register', (req, res) => {
  const { nombre, apellidos, documento, direccion, esquina, celular, email, user, password } = req.body;

  // Configurar el contenido del correo
  const mailOptions = {
    from: 'tutiaclub@gmail.com', // El correo desde el que se enviará
    to: 'tutiaclub@gmail.com',   // El correo al que se enviará
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

  // Enviar el correo
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send('Error al enviar el correo: ' + error);
    }
    res.status(200).send('Formulario enviado correctamente!');
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

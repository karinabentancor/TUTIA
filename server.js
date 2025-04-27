const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/register', async (req, res) => {
  const { nombre, apellidos, documento, direccion, esquina, celular, email, user, password } = req.body;


  let transporter = nodemailer.createTransport({
    service: 'Gmail', 
    auth: {
      user: 'karinabentancorlenzi@gmail.com', 
      pass: 'nohaytutia'
    }
  });

  let mailOptions = {
    from: 'TU_EMAIL@gmail.com',
    to: 'EMAIL_DESTINO@ejemplo.com',
    subject: 'Nuevo Registro al Club',
    html: `
      <h2>Nuevo miembro del Club:</h2>
      <p><b>Nombre:</b> ${nombre} ${apellidos}</p>
      <p><b>Documento:</b> ${documento}</p>
      <p><b>Dirección:</b> ${direccion} (Esquina: ${esquina})</p>
      <p><b>Celular:</b> ${celular}</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Usuario:</b> ${user}</p>
      <p><b>Contraseña:</b> ${password}</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('Formulario enviado con éxito.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al enviar el formulario.');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
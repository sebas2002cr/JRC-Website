// pages/api/send-email.js

import sgMail from '@sendgrid/mail';

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { nombre, apellido, email, telefono, empresa, tipoPersona, puesto, tema, detalles } = req.body;

    const msg = {
      to: 'tu-email@example.com', // Cambia esto por el email al que quieres enviar el formulario
      from: 'tu-email-verificado@example.com', // Usa el mismo correo verificado en SendGrid
      subject: 'Nuevo mensaje de contacto',
      text: `
        Nombre: ${nombre}
        Apellido: ${apellido}
        Correo electrónico: ${email}
        Teléfono: ${telefono}
        Empresa: ${empresa}
        Tipo de Persona: ${tipoPersona}
        Puesto: ${puesto}
        Tema: ${tema}
        Detalles: ${detalles}
      `,
      html: `
        <strong>Nombre:</strong> ${nombre}<br />
        <strong>Apellido:</strong> ${apellido}<br />
        <strong>Correo electrónico:</strong> ${email}<br />
        <strong>Teléfono:</strong> ${telefono}<br />
        <strong>Empresa:</strong> ${empresa}<br />
        <strong>Tipo de Persona:</strong> ${tipoPersona}<br />
        <strong>Puesto:</strong> ${puesto}<br />
        <strong>Tema:</strong> ${tema}<br />
        <strong>Detalles:</strong> ${detalles}<br />
      `,
    };

    try {
      await sgMail.send(msg);
      res.status(200).json({ success: true, message: 'Email enviado correctamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Error al enviar el email' });
    }
  } else {
    res.status(405).json({ message: 'Método no permitido' });
  }
}

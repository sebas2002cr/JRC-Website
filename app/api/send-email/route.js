
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { nombre, email, mensaje, ...rest } = req.body;

    // Configura el transporte de nodemailer para usar Outlook
    const transporter = nodemailer.createTransport({
      host: "smtp.office365.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.OUTLOOK_USER,
        pass: process.env.OUTLOOK_PASS,
      },
    });

    const mailOptions = {
      from: process.env.OUTLOOK_USER, // Tu dirección de Outlook
      to: process.env.RECEIVER_EMAIL, // Dirección de destino
      subject: `Nuevo mensaje de ${nombre}`,
      text: `
        Nombre: ${nombre}
        Correo: ${email}
        Mensaje: ${mensaje}
        ${Object.keys(rest).map(key => `${key}: ${rest[key]}`).join('\n')}
      `,
      html: `
        <h3>Nuevo mensaje de ${nombre}</h3>
        <p><strong>Correo:</strong> ${email}</p>
        <p><strong>Mensaje:</strong> ${mensaje}</p>
        ${Object.keys(rest).map(key => `<p><strong>${key}:</strong> ${rest[key]}</p>`).join('')}
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      res.status(200).json({ success: true, message: 'Correo enviado con éxito.' });
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      res.status(500).json({ success: false, message: 'Error al enviar el correo.' });
    }
  } else {
    res.status(405).json({ message: 'Método no permitido' });
  }
}

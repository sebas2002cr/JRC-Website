import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req) {
  const formData = await req.formData();
  
  const fields = {};
  const attachments = [];

  for (const [key, value] of formData.entries()) {
    if (key === 'archivos') {
      const buffer = Buffer.from(await value.arrayBuffer());  // Convertimos ReadableStream a Buffer
      attachments.push({
        filename: value.name,
        content: buffer,
      });
    } else {
      fields[key] = value;
    }
  }

  const { nombre, apellido, email, telefono, empresa, tipoPersona, puesto, tema, detalles, contactoTelefono, contactoEmail, contactoWhatsApp } = fields;
// datos que se enviarian en el correo
  const metodosContacto = [];
  if (contactoTelefono === 'true') metodosContacto.push("Llamada Telefónica");
  if (contactoEmail === 'true') metodosContacto.push("Correo Electrónico");
  if (contactoWhatsApp === 'true') metodosContacto.push("WhatsApp");

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = { // Estilos y formatos del correo electronico 
    from: email,
    to: process.env.EMAIL_USER,
    subject: `Nuevo mensaje de contacto de ${nombre} ${apellido}`,
    text: `
      Nombre: ${nombre} ${apellido}\n 
      Correo: ${email}\n
      Teléfono: ${telefono}\n
      Empresa: ${empresa}\n
      Tipo de Persona: ${tipoPersona}\n
      Puesto: ${puesto}\n
      Tema: ${tema}\n
      Métodos preferidos de contacto: ${metodosContacto.join(", ")}\n
      Detalles: ${detalles}
    `,
    attachments: attachments,
  };

  try { // funcion para que cuando exista una error se pueda manejar y no se caiga la aplicacion
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error en el envío de correo:", error);
    return NextResponse.json({ success: false, message: 'Error al enviar el correo' }, { status: 500 });
  }
}

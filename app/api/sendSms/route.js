import twilio from 'twilio';

export const POST = async (req) => {
  try {
    const { name, phone } = await req.json();

    const accountSid = process.env.TWILIO_ACCOUNT_SID; 
    const authToken = process.env.TWILIO_AUTH_TOKEN; 
    const client = twilio(accountSid, authToken);

    const message = await client.messages.create({
      body: `Nuevo cliente suscrito en los Planes de JRC Website`,
      from: process.env.TWILIO_PHONE_NUMBER, // El número de Twilio
      to: phone, // El número donde quieres recibir el SMS
    });

    return new Response(JSON.stringify({ success: true, message }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};

/**
 * Botón de contacto al pie de cada artículo.
 *
 * No es un adorno: la guía editorial del generador OBLIGA a que toda nota
 * cierre invitando a "tocá el botón de contacto acá abajo y escribinos por
 * WhatsApp", y le PROHIBE al redactor escribir teléfonos o enlaces dentro
 * del texto —justamente para que sea este botón el que los ponga, y así
 * evitar que la IA invente un número—.
 *
 * O sea que sin este componente cada artículo publicado terminaba
 * prometiendo un botón que no existía.
 *
 * El número viene de NEXT_PUBLIC_WHATSAPP. Si no está definido no se
 * renderiza nada: es preferible un cierre sin botón que un botón roto.
 *
 * OJO: las variables NEXT_PUBLIC_* se incrustan al COMPILAR, no se leen al
 * arrancar el servidor. O sea que definirla o cambiarla en Vercel exige
 * volver a desplegar; con solo reiniciar no toma efecto.
 */

const NUMERO = process.env.NEXT_PUBLIC_WHATSAPP;

export default function ContactoWhatsApp({ titulo }) {
  if (!NUMERO) return null;

  // Se precarga el mensaje con el título de la nota para que el equipo sepa
  // desde qué artículo llegó la consulta.
  const mensaje = titulo
    ? `Hola, leí el artículo "${titulo}" y quisiera una consulta.`
    : "Hola, quisiera hacer una consulta.";

  return (
    <div className="my-10 rounded-2xl bg-gray-50 px-6 py-8 text-center dark:bg-gray-900">
      <p className="mb-1 text-lg font-semibold text-gray-800 dark:text-gray-100">
        ¿Cómo afecta esto a tu empresa?
      </p>
      <p className="mb-5 text-gray-600 dark:text-gray-400">
        Escribinos y lo revisamos con vos.
      </p>

      <a
        href={`https://wa.me/${NUMERO}?text=${encodeURIComponent(mensaje)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-semibold text-white transition-transform hover:scale-105">
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 0 1 6.988 2.896 9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.82 11.82 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.548 4.142 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 0 0-3.48-8.413Z" />
        </svg>
        Escribinos por WhatsApp
      </a>
    </div>
  );
}

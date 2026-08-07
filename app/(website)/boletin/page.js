import { notFound } from "next/navigation";
import Container from "@/components/container";
import { pageMetadata } from "@/lib/seo";
import { VERDE } from "@/lib/boletin";
import FormularioBoletin from "@/components/blog/formularioBoletin";
import { IconoSobre } from "@/components/blog/iconoSobre";

/**
 * jrc.cr/boletin: la página de suscripción que se le manda a un cliente.
 *
 * Existe por un motivo muy concreto y vale dejarlo escrito, porque desde el
 * código parece redundante con el botón flotante del blog: esta es la
 * dirección que el equipo comparte por WhatsApp o por correo.
 *
 * La alternativa era un parámetro sobre el blog, tipo /blog?boletin=1, que
 * abriera el panel solo. Se descartó por tres cosas:
 *
 *  1. La vista previa. Al pegar un enlace en WhatsApp se arma una tarjeta
 *     con el título y la descripción de la página. Con el parámetro, esa
 *     tarjeta diría "Blog | JRC Consulting Group", o sea que el enlace se
 *     anunciaría como otra cosa de la que es. Esa tarjeta suele ser lo único
 *     que la persona lee antes de decidir si toca.
 *
 *  2. Los parámetros se pierden. Hay clientes de correo y acortadores que
 *     los borran por parecer rastreo, y al copiar y pegar se cae la cola muy
 *     seguido. Cuando eso pasa la persona llega al blog, no ve ningún
 *     formulario y no hay error a la vista: falla en silencio.
 *
 *  3. Una ruta se puede dictar por teléfono y escribir en una tarjeta.
 *
 * A diferencia de /boletin/confirmar y /boletin/baja, esta SÍ se indexa: son
 * el final de un enlace personal y esta es una página del sitio.
 */

const HABILITADO = process.env.NEXT_PUBLIC_NEWSLETTER === "true";

export const metadata = pageMetadata({
  title: "Boletín JRC",
  description:
    "Todos los lunes, un resumen de las novedades en materia tributaria, fiscal, legal y financiera en Costa Rica, y qué significan para su empresa.",
  path: "/boletin"
});

export default function BoletinPage() {
  // Detrás del mismo interruptor que el botón flotante. Si algún día se
  // apaga el boletín, esta página tiene que irse con él: un enlace ya
  // repartido que muestra un formulario que no guarda nada es peor que uno
  // que no carga.
  if (!HABILITADO) notFound();

  return (
    <Container>
      <div className="mx-auto max-w-lg py-10">
        {/* La tarjeta es la misma del panel del blog, sin la equis de
            cerrar: acá no hay nada detrás a lo que volver. Se mantiene
            igual a propósito, para que quien ya la vio en el blog reconozca
            que es lo mismo. */}
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center gap-2 border-b border-gray-100 px-6 py-4 dark:border-gray-800">
            <IconoSobre className="h-5 w-5" style={{ color: VERDE }} />
            {/* h1 y no h2: acá esto es el título de la página, no el de una
                ventana dentro de otra cosa. Es además lo que Google va a
                leer como encabezado principal. */}
            <h1 className="text-lg font-bold text-[#305832] dark:text-[#8cbe8f]">
              Boletín JRC
            </h1>
          </div>

          <div className="px-6 py-6">
            <FormularioBoletin />
          </div>
        </div>

        {/* Quien llega acá desde un enlace que le pasaron no conoce el blog.
            Vale ofrecerle ver de qué se trata antes de dejar su correo, en
            vez de que la única salida sea cerrar la pestaña. */}
        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-500">
          ¿Querés ver antes de qué se trata?{" "}
          <a
            href="/blog"
            className="font-medium text-[#305832] underline dark:text-[#8cbe8f]">
            Mirá las notas publicadas
          </a>
          .
        </p>
      </div>
    </Container>
  );
}

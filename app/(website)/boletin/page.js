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

// El titulo de la vista previa dice lo mismo que el encabezado de la tarjeta.
// Si la tarjeta dice "Newsletter de JRC" y el enlace compartido se anuncia
// como "Boletin JRC", quien lo abre cree por un segundo que llego a otra
// pagina.
export const metadata = pageMetadata({
  title: "Newsletter de JRC",
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
    /* El fondo va acá afuera, envolviendo al Container y no dentro de él,
       porque el Container tiene ancho máximo: puesto adentro, el color
       cortaría en una franja angosta con blanco a los lados.

       Y va con color porque sin él la tarjeta es blanca sobre blanco y lo
       único que la separa del resto es un borde de gris clarísimo: se leía
       como texto suelto en la página en vez de como una tarjeta. En el panel
       del blog el problema no existe porque atrás hay una capa oscura sobre
       el listado; acá había que reemplazar esa capa por algo.

       El tinte es verde de marca al 4% y no un gris neutro: a esta página se
       llega desde un enlace que mandó JRC, y conviene que se vea de JRC. Al
       4% aporta separación sin competir con el verde del título ni con el
       del botón. */
    <div className="bg-[#305832]/[0.04] dark:bg-white/[0.02]">
      <Container>
        <div className="mx-auto max-w-lg py-10">
          {/* La tarjeta es la misma del panel del blog. Se mantiene igual a
              propósito, para que quien ya la vio ahí reconozca que es lo
              mismo. El borde y la sombra suben un escalón respecto del panel
              porque acá cargan solos con separarla del fondo. */}
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <IconoSobre className="h-5 w-5" style={{ color: VERDE }} />
            {/* Dice lo mismo que el panel del blog, palabra por palabra. Es
                la misma tarjeta y quien ya la vio ahi tiene que reconocerla;
                dos nombres para la misma cosa hacen dudar de si son la
                misma cosa.

                h1 y no h2: aca esto es el titulo de la pagina, no el de una
                ventana dentro de otra cosa. Es ademas lo que Google lee como
                encabezado principal. */}
              <h1 className="text-lg font-bold text-[#305832] dark:text-[#8cbe8f]">
                Newsletter de JRC
              </h1>
            </div>

            {/* La equis del panel, pero acá no cierra nada: lleva al blog.
                Quien llega desde un enlace que le pasaron no tiene ninguna
                otra salida, y el gesto de cerrar es el que espera hacer
                cuando termina o cuando no le interesa. En vez de dejarlo en
                una pantalla sin escape, lo deja en el listado de notas, que
                es adonde de verdad queremos que vaya.

                Va como <a> y no como botón porque es navegación: se puede
                abrir en otra pestaña y se anuncia como enlace. */}
            <a
              href="/blog"
              aria-label="Ir al blog"
              className="-m-2 rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                viewBox="0 0 24 24"
                aria-hidden="true">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </a>
          </div>

          <div className="px-6 py-6">
            <FormularioBoletin />
          </div>
        </div>

          {/* Quien llega acá desde un enlace que le pasaron no conoce el
              blog. Vale ofrecerle ver de qué se trata antes de dejar su
              correo, en vez de que la única salida sea cerrar la pestaña. */}
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
    </div>
  );
}

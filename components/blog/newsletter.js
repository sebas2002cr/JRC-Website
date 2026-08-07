"use client";

import { useEffect, useState } from "react";
import { VERDE } from "@/lib/boletin";
import FormularioBoletin from "./formularioBoletin";
import { IconoSobre } from "./iconoSobre";

/**
 * Botón flotante del blog que abre el alta al boletín.
 *
 * Acá vive SOLO el envoltorio: el botón, la ventana que se abre encima y su
 * encabezado. El formulario en sí está en formularioBoletin.js, porque el
 * mismo lo usa la página jrc.cr/boletin, que es la que se le manda a un
 * cliente. Si estuviera escrito acá adentro habría que copiarlo allá, y dos
 * copias del mismo formulario terminan separándose sin que nadie lo note.
 *
 * El alta es de doble opt-in: acá solo se deja el correo, y la suscripción
 * queda pendiente hasta que la persona abre el enlace que le llega. Además
 * de ser la buena práctica de correo, es la prueba del consentimiento que
 * exige la Ley 8968.
 */

/**
 * Interruptor del boletín. APAGADO salvo que se pida explícitamente.
 *
 * Va apagado por defecto —y no encendido con una variable para apagarlo—
 * porque el olvido tiene que fallar del lado seguro: si nadie define nada,
 * no se muestra. Para trabajarlo en local basta poner
 * NEXT_PUBLIC_NEWSLETTER=true en .env.local.
 *
 * OJO: las NEXT_PUBLIC_* se incrustan al COMPILAR. Cambiar el valor exige
 * volver a desplegar; reiniciar el servidor no alcanza.
 */
const HABILITADO = process.env.NEXT_PUBLIC_NEWSLETTER === "true";

export default function Newsletter() {
  // El corte va acá, antes de cualquier hook: apagado no se monta nada, ni
  // se registra el listener de Escape ni se toca el scroll de la página.
  if (!HABILITADO) return null;
  return <PanelBoletin />;
}

function PanelBoletin() {
  const [abierto, setAbierto] = useState(false);

  // Escape cierra, y con el panel abierto se bloquea el scroll de atrás.
  useEffect(() => {
    if (!abierto) return;

    const alTeclado = evento => {
      if (evento.key === "Escape") setAbierto(false);
    };
    const overflowPrevio = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", alTeclado);

    return () => {
      document.body.style.overflow = overflowPrevio;
      document.removeEventListener("keydown", alTeclado);
    };
  }, [abierto]);

  const cerrar = () => setAbierto(false);

  return (
    <>
      {/* Botón flotante, abajo a la IZQUIERDA.
          La esquina derecha ya la ocupa el selector de idioma de globalseo
          (fixed bottom-2 right-4 en app/layout.tsx), y los dos juntos se
          encimaban. La izquierda queda libre: el botón de "volver al blog"
          que vive ahí solo aparece dentro de una nota, y este solo en el
          listado, así que nunca coinciden. */}
      <button
        onClick={() => setAbierto(true)}
        className="fixed bottom-6 left-6 z-40 flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105"
        style={{ backgroundColor: VERDE }}
        aria-label="Suscribirme al newsletter">
        <IconoSobre className="h-5 w-5" />
        <span className="hidden sm:inline">Newsletter</span>
      </button>

      {!abierto ? null : (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 backdrop-blur-sm sm:items-center"
          onClick={evento => {
            if (evento.target === evento.currentTarget) cerrar();
          }}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-newsletter"
            /* La altura va en dvh y no en vh, y en el celular es la
               diferencia entre que el formulario se pueda enviar o no.
               `vh` mide la pantalla COMPLETA, incluida la franja que tapan
               la barra de direcciones y la de botones del navegador: un
               panel de 90vh se mete debajo de ellas y la casilla de la
               política y el botón quedan fuera de alcance, sin forma de
               llegar. `dvh` mide lo que de verdad se ve.

               Se pone en el style y no como clase para que sirva de
               respaldo: un navegador viejo que no entienda dvh descarta
               esta línea y se queda con el max-h-[90vh] de la clase. */
            style={{ maxHeight: "85dvh" }}
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-gray-900">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <IconoSobre className="h-5 w-5" style={{ color: VERDE }} />
                {/* Este es el titulo del panel, por eso NO va en mayusculas.
                    Un rotulo en versalitas y con el tracking abierto (el de
                    components/ui/label.js) es, por convencion, una etiqueta
                    de categoria que anuncia al titulo que viene abajo; no es
                    un titulo. Como abajo no hay ninguno, este toma el estilo
                    de titulo del sitio.

                    El color va en clases y no en style={{ color: VERDE }}
                    como el resto del panel, y es por el modo oscuro: un
                    estilo en linea le gana siempre a cualquier clase, asi
                    que con VERDE en linea no habria forma de aclararlo. El
                    verde de marca es #305832, que sobre el fondo oscuro del
                    panel (gray-900) queda en 2.2:1 de contraste y
                    practicamente no se lee. El tono claro es el mismo verde
                    subido de luminosidad y llega a 8.4:1. */}
                <h2
                  id="titulo-newsletter"
                  className="text-lg font-bold text-[#305832] dark:text-[#8cbe8f]">
                  Newsletter de JRC
                </h2>
              </div>
              {/* -m-2 p-2: agranda la zona que responde al toque sin
                  agrandar la equis ni mover el encabezado. Con p-1 el
                  objetivo medía unos 28px y cerrar el panel desde el celular
                  costaba dos o tres intentos. */}
              <button
                onClick={cerrar}
                aria-label="Cerrar"
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
              </button>
            </div>

            <div className="px-6 py-6">
              <FormularioBoletin />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

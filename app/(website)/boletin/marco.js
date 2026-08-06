import Container from "@/components/container";
import { VERDE } from "@/lib/boletin";

/**
 * Armazón de las dos páginas del boletín, la de confirmar y la de baja.
 *
 * Las dos son lo mismo: alguien llega desde un correo, pasa algo y se le
 * dice qué pasó. Una tarjeta corta y centrada, sin nada más alrededor: quien
 * entra acá viene a resolver una sola cosa y a irse.
 */
export default function MarcoBoletin({ icono, titulo, children }) {
  return (
    <Container>
      <div className="mx-auto max-w-md py-10 text-center">
        {/* El círculo entra con un rebote corto y el trazo de adentro se
            dibuja detrás. Es la única animación de la página, y va acá
            porque es el punto donde la persona mira para saber si lo que
            pidió salió bien: el movimiento confirma antes que el texto. */}
        <div
          className="boletin-icono mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full"
          style={{ backgroundColor: `${VERDE}18`, color: VERDE }}>
          {icono}
        </div>

        <h1 className="mb-4 text-3xl font-bold text-gray-800 dark:text-white">
          {titulo}
        </h1>

        <div className="text-gray-600 dark:text-gray-400">{children}</div>
      </div>
    </Container>
  );
}

/** El sobre del boletín, el mismo del botón flotante. */
export function IconoSobre() {
  return (
    <svg
      className="h-8 w-8"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 6L2 7" />
    </svg>
  );
}

/**
 * El visto, dibujándose.
 *
 * `pathLength="1"` es lo que hace que esto no dependa de medir el trazo a
 * mano: le dice al navegador que trate el largo del recorrido como 1, sea
 * cual sea su longitud real. Así el guion y el corrimiento son 1 y 1, y si
 * mañana alguien retoca la forma del visto, la animación sigue saliendo
 * completa sin tener que recalcular ningún número.
 */
export function IconoCheck() {
  return (
    <svg
      className="h-8 w-8"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      aria-hidden="true">
      <path d="m5 13 4 4L19 7" pathLength="1" className="boletin-traza" />
    </svg>
  );
}

export function IconoAviso() {
  return (
    <svg
      className="h-8 w-8"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      aria-hidden="true">
      <path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
    </svg>
  );
}

/** Botón principal, con el verde de marca. */
export function BotonVerde({ children, ...resto }) {
  return (
    <button
      className="rounded-full px-6 py-3 font-semibold text-white transition-transform hover:scale-105 disabled:opacity-60 disabled:hover:scale-100"
      style={{ backgroundColor: VERDE }}
      {...resto}>
      {children}
    </button>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Estrellas } from "./estrellas";

/**
 * La insignia flotante con la calificacion de Google, y el panel con las
 * resenas que se abre al tocarla.
 *
 * Sigue el mismo molde que components/blog/newsletter.js —boton flotante,
 * panel encima, cierre con Escape y con clic afuera, scroll de la pagina
 * bloqueado mientras esta abierto— porque es el patron que ya esta probado
 * en este sitio, incluido el detalle del dvh que se explica mas abajo.
 *
 * Si no llega el resumen no se dibuja nada. Es deliberado: la insignia sin
 * datos anunciaria "0 opiniones", que es peor que no tenerla. Mientras el
 * documento no exista en Sanity, el home se ve exactamente como antes.
 */
export default function InsigniaGoogle({ resumen, resenas = [] }) {
  const [abierto, setAbierto] = useState(false);

  // Escape cierra, y con el panel abierto se bloquea el scroll de atras.
  // Mismo tratamiento que el panel del newsletter.
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

  if (!resumen) return null;

  const { calificacion, totalOpiniones, enlacePerfil } = resumen;
  const cerrar = () => setAbierto(false);

  return (
    <>
      {/* Abajo a la DERECHA, y a 5rem del borde y no a 1,5rem como el
          newsletter. Es para no encimarse con el selector de idioma de
          globalseo, que vive en `fixed bottom-2 right-4` (app/layout.tsx) y
          mide unos 50px de alto: la insignia arranca justo encima de el.
          La esquina izquierda ya la ocupa el boton del newsletter. */}
      <div className="fixed bottom-20 right-4 z-40">
        <button
          onClick={() => setAbierto(true)}
          className="resena-entra flex items-center gap-2.5 rounded-full bg-white py-2 pl-3 pr-4 shadow-lg ring-1 ring-black/5 transition-transform hover:scale-105 dark:bg-gray-900 dark:ring-white/10"
          aria-label={`Ver nuestras ${totalOpiniones} opiniones en Google`}>
          <LogoGoogle className="h-6 w-6 flex-none" />
          <span className="flex flex-col items-start leading-tight">
            <span className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {conComa(calificacion)}
              </span>
              <Estrellas
                valor={calificacion}
                className="h-3.5 w-3.5"
              />
            </span>
            <span className="text-[11px] text-gray-500 dark:text-gray-400">
              {totalOpiniones} opiniones
            </span>
          </span>
        </button>
      </div>

      {!abierto ? null : (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 backdrop-blur-sm sm:items-center"
          onClick={evento => {
            if (evento.target === evento.currentTarget) cerrar();
          }}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-resenas"
            /* La altura va en dvh por lo mismo que el panel del
               newsletter: `vh` mide la pantalla completa, incluida la
               franja que tapan las barras del navegador en el celular, y
               el final del panel queda fuera de alcance. El max-h-[90vh]
               de la clase queda de respaldo para navegadores viejos que
               descarten esta linea. */
            style={{ maxHeight: "85dvh" }}
            className="resena-panel flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900">
            <div className="flex items-start justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <LogoGoogle className="h-8 w-8 flex-none" />
                <div>
                  <h2
                    id="titulo-resenas"
                    className="text-lg font-bold text-[#305832] dark:text-[#8cbe8f]">
                    Opiniones en Google
                  </h2>
                  <div className="mt-0.5 flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {conComa(calificacion)}
                    </span>
                    <Estrellas
                      valor={calificacion}
                      className="h-4 w-4"
                    />
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {totalOpiniones} opiniones
                    </span>
                  </div>
                </div>
              </div>
              {/* -m-2 p-2: agranda la zona que responde al toque sin mover
                  el encabezado. Mismo criterio que la equis del
                  newsletter. */}
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

            {/* min-h-0 no es decorativo: sin el, un hijo con overflow
                dentro de un flex column no se encoge y la lista empuja el
                panel hasta desbordar la pantalla en vez de scrollear. */}
            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
              {resenas.length === 0 ? (
                <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                  Todavía no hay reseñas cargadas.
                </p>
              ) : (
                <ul className="flex flex-col gap-5">
                  {resenas.map(resena => (
                    <Resena key={resena._id} {...resena} />
                  ))}
                </ul>
              )}
            </div>

            {enlacePerfil && (
              <div className="border-t border-gray-100 px-6 py-4 dark:border-gray-800">
                {/* rel="noopener" es obligatorio con target="_blank":
                    sin el, la pestana que se abre puede reescribir la
                    nuestra desde window.opener. */}
                <a
                  href={enlacePerfil}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-lg bg-[#305832] px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-[#24421f]">
                  Ver todas en Google
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function Resena({ autor, texto, estrellas, fecha }) {
  return (
    <li className="border-b border-gray-100 pb-5 last:border-0 last:pb-0 dark:border-gray-800">
      <div className="flex items-center justify-between gap-3">
        <span className="font-semibold text-gray-900 dark:text-white">
          {autor}
        </span>
        {fecha && (
          <span className="flex-none text-xs text-gray-400">
            {mesYAno(fecha)}
          </span>
        )}
      </div>
      <Estrellas valor={estrellas} className="mt-1 h-3.5 w-3.5" />
      <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-gray-600 dark:text-gray-300">
        {texto}
      </p>
    </li>
  );
}

/** 5 se ve como "5,0"; en Costa Rica el decimal va con coma. */
function conComa(numero) {
  return Number(numero).toFixed(1).replace(".", ",");
}

const MESES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre"
];

/**
 * "agosto de 2026". Se arma a mano en vez de con toLocaleDateString porque
 * ese metodo depende de los idiomas que traiga instalados cada entorno: el
 * Node del servidor y el navegador pueden devolver textos distintos para la
 * misma fecha, y React marca eso como error de hidratacion.
 */
function mesYAno(fecha) {
  const d = new Date(fecha);
  if (Number.isNaN(d.getTime())) return "";
  return `${MESES[d.getMonth()]} de ${d.getFullYear()}`;
}

/** La G de Google, con sus colores. */
function LogoGoogle({ className }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
  );
}

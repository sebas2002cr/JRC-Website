"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Vuelta al listado desde un articulo.
 *
 * Antes no habia ninguna: quien entraba a una nota quedaba sin salida y
 * tenia que usar el boton del navegador o el menu superior, que ademas se
 * esconde al bajar. Por eso son dos piezas:
 *
 *  - Un enlace al inicio del articulo, visible apenas se entra.
 *  - Un boton flotante que aparece al bajar, para no obligar a subir hasta
 *    el principio despues de leer media nota.
 *
 * No se usa una barra pegada arriba porque el navbar del sitio es `fixed` y
 * se muestra u oculta segun la direccion del scroll: cualquier cosa pegada
 * al borde superior termina superponiendose con el.
 *
 * Se intenta `router.back()` antes que `/blog` a proposito: si el lector
 * venia de la pagina 3 del listado, o de una categoria filtrada, volver ahi
 * es lo que espera. Solo cuando no hay historia propia (entro directo desde
 * Google o desde un enlace compartido) se navega al listado.
 */

const DESDE = 500; // px de scroll antes de mostrar el boton flotante

function useVolver() {
  const router = useRouter();

  return evento => {
    const mismaVisita =
      typeof document !== "undefined" &&
      document.referrer &&
      document.referrer.startsWith(window.location.origin);

    if (mismaVisita && window.history.length > 1) {
      evento.preventDefault();
      router.back();
    }
    // Si no, el href="/blog" del enlace hace su trabajo solo.
  };
}

const Flecha = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
    aria-hidden="true">
    <path d="M19 12H5" />
    <path d="m12 19-7-7 7-7" />
  </svg>
);

/** Enlace discreto al inicio del articulo. */
export function EnlaceVolver() {
  const volver = useVolver();

  return (
    <a
      href="/blog"
      onClick={volver}
      className="group mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-[#305832] dark:text-gray-400 dark:hover:text-gray-200">
      <Flecha className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
      Volver al blog
    </a>
  );
}

/** Boton flotante, solo despues de bajar un poco. */
export function BotonVolverFlotante() {
  const volver = useVolver();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const alScroll = () => setVisible(window.scrollY > DESDE);
    alScroll();
    window.addEventListener("scroll", alScroll, { passive: true });
    return () => window.removeEventListener("scroll", alScroll);
  }, []);

  return (
    <a
      href="/blog"
      onClick={volver}
      aria-label="Volver al blog"
      className={`fixed bottom-6 left-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-lg transition-all duration-300 hover:scale-105 hover:text-[#305832] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}>
      <Flecha className="h-5 w-5" />
    </a>
  );
}

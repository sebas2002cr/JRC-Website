"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { GlobalSeoSelector } from "globalseo-next";

/**
 * El traductor de globalseo y su selector, para todo el sitio menos el panel
 * de los afiliados (jrc.cr/afiliados).
 *
 * El panel tiene su propio español/inglés (el afiliado elige y se le guarda en
 * su ficha) y navega sin recargar; el script de globalseo reescribe el DOM con
 * textContent y rompe la navegación interna de Next (plan del programa de
 * afiliados, «Lo que hay que hacer en el sitio», punto 3). Por eso ahí no se
 * carga. Los enlaces que llevan al panel son <a> y recargan la página, así que
 * el script tampoco llega cargado desde otra página del sitio.
 *
 * Lo demás es exactamente lo que estaba en app/layout.tsx:
 *
 * Se carga a mano en vez de con <GlobalSeoScript>. Ese componente monta el
 * script con la estrategia por defecto de next/script, que lo ejecuta mientras
 * React todavía está hidratando. El script reescribe el DOM con textContent, y
 * esa carrera provocaba de forma intermitente "Cannot read properties of null
 * (reading 'removeChild')", que deja la página en blanco con "Application
 * error". El componente del paquete descarta los props extra, así que no acepta
 * un `strategy`; de ahí que se use next/script directamente.
 *
 * strategy="lazyOnload" lo retrasa hasta después del load de la página, cuando
 * React ya terminó: se acaba la carrera y el selector sigue funcionando igual.
 *
 * data-dynamic-translation="false" además apaga el MutationObserver, que era la
 * otra pieza que competía con React.
 *
 * TODO: la apiKey debería vivir solo en una env var. Se deja el valor actual
 * como fallback porque aún no está configurada en Vercel. Ya era pública: este
 * script corre en el navegador.
 */
export default function TraductorSitio() {
  const ruta = usePathname() || "";
  if (ruta === "/afiliados" || ruta.startsWith("/afiliados/")) return null;
  // En la página del enlace personal, en el celular el selector va arriba: abajo
  // taparía el botón «Seguir», que queda pegado al pie.
  const enEnlace = ruta.startsWith("/r/");

  return (
    <>
      <Script
        src="https://unpkg.com/globalseo/dist/translate.js"
        strategy="lazyOnload"
        data-globalseo-key={process.env.NEXT_PUBLIC_GLOBALSEO_API_KEY || "aa26dc8d-924e-4a67-8736-88c509353158"}
        data-original-language="es"
        data-allowed-languages="en"
        data-use-browser-language="false"
        data-dynamic-translation="false"
      />

      {/* Wrapper para el GlobalSeoSelector con z-index alto */}
      <div className={`fixed ${enEnlace ? "top-2 right-3 md:bottom-2 md:right-4 md:top-auto" : "bottom-2 right-4"} bg-white border border-[#305832] shadow-lg p-2 rounded-lg z-[100]`}>
        <GlobalSeoSelector color="#305832" />
      </div>
    </>
  );
}

"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";
import { track } from "@vercel/analytics";

/**
 * URL del tipo de evento de Calendly.
 *
 * Sale de una variable de entorno para poder cambiar el evento (por ejemplo
 * a uno de tipo Round Robin, que reparte las reuniones entre varias
 * personas) sin tener que redesplegar. El valor actual queda como fallback.
 */
const CALENDLY_URL =
  process.env.NEXT_PUBLIC_CALENDLY_URL ||
  "https://calendly.com/jrcadmin-jrccr/30min";

function buildUrl() {
  const url = new URL(CALENDLY_URL);
  url.searchParams.set("primary_color", "305832");
  // Evita el banner de cookies de Calendly encima del calendario.
  url.searchParams.set("hide_gdpr_banner", "1");
  return url.toString();
}

export default function CalendlyWidget() {
  const widgetRef = useRef(null);

  useEffect(() => {
    // De donde venia la persona: /schedule?from=navbar, ?from=home, etc.
    // Se anade al data-url antes de que cargue el script de Calendly
    // (lazyOnload corre despues del load de la pagina), de modo que el
    // origen tambien queda registrado del lado de Calendly.
    const from = new URLSearchParams(window.location.search).get("from");

    if (from && widgetRef.current) {
      const url = new URL(widgetRef.current.dataset.url);
      url.searchParams.set("utm_source", "jrc.cr");
      url.searchParams.set("utm_content", from);
      widgetRef.current.dataset.url = url.toString();
    }

    // Calendly avisa por postMessage cuando alguien completa una reserva.
    // Sin esto una reunion agendada es invisible para el sitio.
    function handleMessage(event) {
      if (event.origin !== "https://calendly.com") return;
      if (event.data?.event !== "calendly.event_scheduled") return;

      track("calendly_event_scheduled", from ? { from } : undefined);
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <>
      {/* La altura no puede ser 100vh fija: en movil el calendario se apila
          y necesita mas alto, y en pantallas grandes 100vh dejaba hueco. */}
      <div
        ref={widgetRef}
        className="calendly-inline-widget w-full h-[1150px] sm:h-[950px] md:h-[750px]"
        data-url={buildUrl()}
      />
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="lazyOnload"
      />
    </>
  );
}

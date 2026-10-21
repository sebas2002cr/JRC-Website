import "./panel.css";
import Panel from "./_panel/Panel";
import { CONDICIONES_AFILIADOS_BORRADOR, CONDICIONES_AFILIADOS_PUBLICADAS, LEGALES_PUBLICADAS } from "@/app/(website)/_legal/datos";

/**
 * jrc.cr/afiliados: el panel de los afiliados (programa de afiliados, H7, 21
 * oct 2026). Vive en su propio grupo de rutas, sin la barra ni el pie del
 * sitio, fuera del sitemap y sin indexar (también está en el disallow de
 * app/robots.js). El traductor de globalseo no se carga acá
 * (components/traductorSitio.js): el panel tiene su propio español e inglés.
 *
 * Toda la pantalla es del cliente: habla con el ERP (/panel/*) con un token
 * que vive en sessionStorage. El servidor solo decide qué legales enlaza.
 */
export const metadata = {
  title: "Panel de afiliados",
  description: "Panel del programa de afiliados de JRC Consulting Group.",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  alternates: { canonical: null },
  openGraph: null,
  twitter: null,
};

export const viewport = { themeColor: "#0e1110" };

export default function Page() {
  const legales = [
    ...(LEGALES_PUBLICADAS
      ? [
          { href: "/privacidad", clave: "privacidad" },
          { href: "/terminos", clave: "terminos" },
        ]
      : []),
    ...(CONDICIONES_AFILIADOS_PUBLICADAS || CONDICIONES_AFILIADOS_BORRADOR ? [{ href: "/condiciones-afiliados", clave: "condiciones" }] : []),
  ];
  return <Panel legales={legales} />;
}

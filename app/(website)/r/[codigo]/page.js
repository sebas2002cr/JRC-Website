import "./enlace.css";
import Enlace from "./enlace";
import { afiliadoDelEnlace } from "./afiliado";
import { getResumenGoogle } from "@/lib/sanity/client";
import { siteName, siteUrl } from "@/lib/seo";

/**
 * jrc.cr/r/<codigo>: la página que abre quien recibe el enlace personal de un
 * afiliado (programa de afiliados, H7, 21 oct 2026). Versión «Conversación».
 *
 *   · Página propia, con su marco (components/siteChrome.js la deja sin barra
 *     ni pie). En español; el traductor del sitio sigue disponible.
 *   · Solo el nombre del afiliado, y nada si el código no existe o el afiliado
 *     está pausado: la misma página, sin nombre, nunca un error.
 *   · Sin indexar: es de una persona (también en el disallow de robots.js).
 *   · La vista previa en WhatsApp sale de generateMetadata y de
 *     opengraph-image.js, con el mismo nombre.
 */
export async function generateMetadata({ params }) {
  const a = await afiliadoDelEnlace(params.codigo);
  const titulo = a.nombre ? `${a.nombre} te recomendó a JRC Consulting Group` : "Te recomendaron a JRC Consulting Group";
  const descripcion = "Contabilidad, impuestos y constitución de empresas en Costa Rica. Primera consulta gratuita.";
  const url = `${siteUrl}/r/${a.codigo || params.codigo}`;
  return {
    title: { absolute: titulo },
    description: descripcion,
    robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
    alternates: { canonical: null },
    openGraph: { type: "website", locale: "es_CR", siteName, url, title: titulo, description: descripcion },
    twitter: { card: "summary_large_image", title: titulo, description: descripcion },
  };
}

export default async function Page({ params }) {
  const [a, resumenGoogle] = await Promise.all([afiliadoDelEnlace(params.codigo), getResumenGoogle().catch(() => null)]);
  return <Enlace codigo={a.codigo} nombre={a.nombre} nombreYApellido={a.nombreYApellido} resumenGoogle={resumenGoogle} />;
}

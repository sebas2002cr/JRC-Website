import Blog from "./blog";
import {
  getBlogPage,
  getCategoriasConConteo,
  getAniosConConteo
} from "@/lib/sanity/client";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Blog",
  description:
    "Noticias y análisis sobre impuestos, contabilidad y cumplimiento tributario en Costa Rica, del equipo de JRC Consulting Group.",
  path: "/blog"
});

/**
 * Rango de fechas de un año concreto, para la consulta a Sanity.
 *
 * Antes el filtro eran periodos relativos (última semana / último mes /
 * último año). Se cambiaron por años por dos razones:
 *
 *  1. El listado ya abre con lo más reciente arriba, así que "última semana"
 *     no ayudaba a encontrar lo nuevo: ya lo estabas viendo. Un filtro de
 *     fecha sirve para volver a un momento, y eso es un año, no una ventana
 *     móvil.
 *  2. Los periodos relativos quedaban vacíos casi siempre. Con el contenido
 *     de hoy, "última semana" y "último mes" devolvían 0 notas: tres de las
 *     cuatro opciones eran callejones sin salida.
 *
 * Los años salen del contenido real (getAniosConConteo), así que la lista
 * nunca ofrece un año vacío ni se queda corta con el paso del tiempo.
 */
function rangoDelAnio(anio) {
  if (!/^\d{4}$/.test(String(anio || ""))) return { desde: "", hasta: "" };
  return {
    desde: `${anio}-01-01T00:00:00.000Z`,
    hasta: `${anio}-12-31T23:59:59.999Z`
  };
}

export default async function IndexPage({ searchParams }) {
  const pagina = Number(searchParams?.page) || 1;
  const categoria = searchParams?.categoria || "";
  const anio = /^\d{4}$/.test(searchParams?.anio || "") ? searchParams.anio : "";

  const { desde, hasta } = rangoDelAnio(anio);

  const [datos, categorias, anios] = await Promise.all([
    getBlogPage({ pagina, categoria, desde, hasta }),
    // Los conteos de categoría se cruzan con el año elegido, y los de año
    // con la categoría elegida. Así ningún filtro visible lleva a una
    // página vacía.
    getCategoriasConConteo({ desde, hasta }),
    getAniosConConteo(categoria)
  ]);

  return (
    <Blog
      {...datos}
      categorias={categorias}
      categoriaActiva={categoria}
      anios={anios}
      anioActivo={anio}
    />
  );
}

// La pagina depende de los parametros de la URL, asi que se resuelve por
// pedido. El cache de Sanity (useCdn) es lo que evita que eso se traduzca en
// una consulta completa por visita.
export const dynamic = "force-dynamic";

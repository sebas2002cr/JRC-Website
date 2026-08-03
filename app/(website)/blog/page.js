import Blog from "./blog";
import { getBlogPage, getCategoriasConConteo } from "@/lib/sanity/client";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Blog",
  description:
    "Noticias y análisis sobre impuestos, contabilidad y cumplimiento tributario en Costa Rica, del equipo de JRC Consulting Group.",
  path: "/blog"
});

/**
 * Traduce el filtro de periodo a una fecha ISO desde la cual buscar.
 * Se calcula en el servidor para que el filtro forme parte de la consulta a
 * Sanity y no de un descarte posterior en el navegador: filtrar despues de
 * traer los datos volveria a romper la paginacion.
 */
function fechaDesde(periodo) {
  const ahora = new Date();

  if (periodo === "semana") {
    const desde = new Date(ahora);
    desde.setDate(ahora.getDate() - 7);
    return desde.toISOString();
  }
  if (periodo === "mes") {
    const desde = new Date(ahora);
    desde.setMonth(ahora.getMonth() - 1);
    return desde.toISOString();
  }
  if (periodo === "anio") {
    const desde = new Date(ahora);
    desde.setFullYear(ahora.getFullYear() - 1);
    return desde.toISOString();
  }
  return "";
}

export default async function IndexPage({ searchParams }) {
  const pagina = Number(searchParams?.page) || 1;
  const categoria = searchParams?.categoria || "";
  const periodo = searchParams?.periodo || "";

  const [datos, categorias] = await Promise.all([
    getBlogPage({ pagina, categoria, desde: fechaDesde(periodo) }),
    getCategoriasConConteo()
  ]);

  return (
    <Blog
      {...datos}
      categorias={categorias}
      categoriaActiva={categoria}
      periodoActivo={periodo}
    />
  );
}

// La pagina depende de los parametros de la URL, asi que se resuelve por
// pedido. El cache de Sanity (useCdn) es lo que evita que eso se traduzca en
// una consulta completa por visita.
export const dynamic = "force-dynamic";

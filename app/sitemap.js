import { getPostsParaSitemap, getAllCategories } from "@/lib/sanity/client";
import { siteUrl } from "@/lib/seo";
import {
  LEGALES_PUBLICADAS,
  PAGINAS_LEGALES as PAGINAS_LEGALES_BASE
} from "@/app/(website)/_legal/datos";

/**
 * Sitemap generado en cada pedido a partir de Sanity.
 *
 * El proyecto ya generaba un sitemap con next-sitemap en el paso `postbuild`,
 * pero eso solo corre AL DESPLEGAR el sitio. Como las notas ahora se publican
 * desde el CRM sin volver a desplegar, una nota publicada hoy no entraba al
 * sitemap hasta el proximo deploy: Google tardaba mucho mas en encontrarla.
 *
 * Este sitemap consulta Sanity, asi que una nota recien publicada aparece
 * dentro de la ventana de revalidacion.
 */

// Las mismas paginas publicas que descubria next-sitemap, sin las que su
// configuracion excluia (el Studio de Sanity y los pasos intermedios del
// flujo de compra, que no aportan nada en buscadores).
const PAGINAS_FIJAS = [
  { ruta: "", prioridad: 1.0, frecuencia: "weekly" },
  { ruta: "/blog", prioridad: 0.9, frecuencia: "daily" },
  { ruta: "/pricing", prioridad: 0.8, frecuencia: "monthly" },
  { ruta: "/contact", prioridad: 0.7, frecuencia: "monthly" },
  { ruta: "/courses", prioridad: 0.6, frecuencia: "monthly" },
  { ruta: "/partners", prioridad: 0.6, frecuencia: "monthly" },
  { ruta: "/constitucionSociedad", prioridad: 0.6, frecuencia: "monthly" },
  { ruta: "/inscripcionPYME", prioridad: 0.6, frecuencia: "monthly" },
  { ruta: "/schedule", prioridad: 0.5, frecuencia: "monthly" }
];

/**
 * Las legales van aparte porque hoy pueden no existir.
 *
 * /privacidad y /terminos devuelven 404 mientras NEXT_PUBLIC_LEGALES no este
 * encendida (ver _legal/documentoLegal.js). Anunciarlas igual seria mandar a
 * Google a dos direcciones rotas, que es peor que no anunciarlas: los 404 en
 * un sitemap cuentan como errores del sitio.
 *
 * /boletin es el mismo caso: existe solo con NEXT_PUBLIC_NEWSLETTER encendida.
 *
 * Lo que NO va nunca es /boletin/confirmar y /boletin/baja: son el final de un
 * enlace personal, no paginas del sitio, y ademas llevan un token en la
 * direccion.
 */
const BOLETIN_PUBLICADO = process.env.NEXT_PUBLIC_NEWSLETTER === "true";

const PAGINA_BOLETIN = [
  { ruta: "/boletin", prioridad: 0.7, frecuencia: "monthly" }
];

// El interruptor y la lista salen de _legal/datos.js, que es el mismo lugar
// de donde los lee el pie de pagina. Estaban escritos aca aparte, y con dos
// copias de la misma condicion basta que una se quede atras para que el
// sitio quede diciendo dos cosas distintas sobre si esas paginas existen.
const PAGINAS_LEGALES = PAGINAS_LEGALES_BASE.map(pagina => ({
  ruta: pagina.href,
  prioridad: 0.3,
  frecuencia: "yearly"
}));

export default async function sitemap() {
  const ahora = new Date();

  const fijas = [
    ...PAGINAS_FIJAS,
    ...(BOLETIN_PUBLICADO ? PAGINA_BOLETIN : []),
    ...(LEGALES_PUBLICADAS ? PAGINAS_LEGALES : [])
  ].map(pagina => ({
    url: `${siteUrl}${pagina.ruta}`,
    lastModified: ahora,
    changeFrequency: pagina.frecuencia,
    priority: pagina.prioridad
  }));

  // Si Sanity no responde, es preferible un sitemap con las paginas fijas
  // que ningun sitemap: una caida momentanea no deberia dejar al sitio sin
  // mapa para los buscadores.
  let posts = [];
  let categorias = [];
  try {
    [posts, categorias] = await Promise.all([getPostsParaSitemap(), getAllCategories()]);
  } catch (error) {
    console.error("No se pudo leer Sanity para el sitemap:", error);
  }

  return [
    ...fijas,
    ...posts.map(post => ({
      url: `${siteUrl}/post/${post.slug}`,
      lastModified: post.fecha ? new Date(post.fecha) : ahora,
      changeFrequency: "monthly",
      priority: 0.7
    })),
    ...categorias.map(({ category }) => ({
      url: `${siteUrl}/category/${category}`,
      lastModified: ahora,
      changeFrequency: "weekly",
      priority: 0.5
    }))
  ];
}

export const revalidate = 3600;

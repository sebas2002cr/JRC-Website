import { apiVersion, dataset, projectId, useCdn } from "./config";
import {
  postquery,
  limitquery,
  paginatedquery,
  blogPageQuery,
  categoriasConConteoQuery,
  fechasPostsQuery,
  sitemapPostsQuery,
  configQuery,
  singlequery,
  pathquery,
  allauthorsquery,
  authorsquery,
  postsbyauthorquery,
  postsbycatquery,
  catpathquery,
  catquery,
  getAll,
  reviewsQuery,
  faqsQuery,
  searchquery,
  coursesQuery,
  singleCourseQuery
} from "./groq";
import { createClient } from "next-sanity";

if (!projectId) {
  console.error(
    "The Sanity Project ID is not set. Check your environment variables."
  );
}

/**
 * Checks if it's safe to create a client instance, as `@sanity/client` will throw an error if `projectId` is false
 */
// useCdn viene de config.ts (activo en produccion). Antes estaba forzado a
// false aca, lo que hacia que CADA lectura publica del blog golpeara la API
// de Sanity sin cache. Con el listado paginado —que es dinamico porque
// depende de los parametros de la URL— eso pasaba de ineficiente a notorio.
const client = projectId
  ? createClient({ projectId, dataset, apiVersion, useCdn })
  : null;

/**
 * Cuánto vale una respuesta de Sanity antes de volver a pedirla.
 *
 * HAY QUE PASARLO EN CADA CONSULTA. En el App Router, Next intercepta
 * `fetch` y —si no se le dice otra cosa— guarda la respuesta con un
 * revalidate de un año. O sea que el `export const revalidate = 60` de las
 * páginas no alcanzaba: la página se volvía a renderizar cada minuto, pero
 * los datos de Sanity salían de esa caché de un año.
 *
 * En la práctica eso significaba que una nota borrada del sitio seguía
 * apareciendo, y que corregir una nota publicada no se veía nunca. Se
 * detectó con una nota despublicada que seguía saliendo en el blog: en
 * Sanity ya no existía, pero .next/cache/fetch-cache la tenía guardada con
 * `revalidate: 31536000`.
 */
const CACHE = { next: { revalidate: 60 } };

export const fetcher = async ([query, params]) => {
  return client ? client.fetch(query, params, CACHE) : [];
};

(async () => {
  if (client) {
    const data = await client.fetch(getAll, {}, { cache: "no-store" });
    if (!data || !data.length) {
      console.error(
        "Sanity returns empty array. Are you sure the dataset is public?"
      );
    }
  }
})();

export async function getAllPosts() {
  if (client) {
    return (await client.fetch(postquery, {}, CACHE)) || [];
  }
  return [];
}


export async function getAllCourses() {
  if (client) {
    return (await client.fetch(coursesQuery, {}, CACHE)) || [];
  }
  return [];
}

export async function getSingleCourse() {
  if (client) {
    return (await client.fetch(singleCourseQuery, {}, CACHE)) || [];
  }
  return [];
}


/** Cuántas notas se muestran por página en el listado del blog. */
export const POSTS_POR_PAGINA = 10;

/**
 * Una página del listado del blog, ya filtrada.
 *
 * Antes la página pedía TODOS los posts y mostraba los primeros 14,
 * descartando el resto en silencio. Con 97 notas publicadas eso dejaba 83
 * invisibles. Acá se pide solo la página que se va a mostrar, y el total
 * viene en la misma consulta para poder dibujar la paginación.
 */
export async function getBlogPage({ pagina = 1, categoria = "", desde = "", hasta = "" } = {}) {
  if (!client) return { posts: [], total: 0, paginas: 0, pagina: 1 };

  const inicio = (Math.max(pagina, 1) - 1) * POSTS_POR_PAGINA;

  const { posts, total, totalDelAnio } = await client.fetch(blogPageQuery, {
    categoria,
    desde,
    hasta,
    inicio,
    fin: inicio + POSTS_POR_PAGINA,
  }, CACHE);

  return {
    posts: posts || [],
    total: total || 0,
    // Sin la categoría aplicada: es lo que muestra el chip "Todas". No se
    // puede sumar el conteo de las categorías porque una nota puede estar
    // en más de una y quedaría contada dos veces.
    totalDelAnio: totalDelAnio || 0,
    paginas: Math.ceil((total || 0) / POSTS_POR_PAGINA),
    pagina: Math.max(pagina, 1),
  };
}

/** Todas las categorías con su cantidad de notas dentro del rango pedido. */
export async function getCategoriasConConteo({ desde = "", hasta = "" } = {}) {
  if (client) return (await client.fetch(categoriasConConteoQuery, { desde, hasta }, CACHE)) || [];
  return [];
}

/**
 * Los años que realmente tienen notas, del más nuevo al más viejo.
 *
 * Se derivan del contenido en vez de fijarse a mano: así el desplegable
 * nunca ofrece un año vacío ni se queda corto cuando pase 2027.
 */
export async function getAniosConConteo(categoria = "") {
  if (!client) return [];

  const fechas = await client.fetch(fechasPostsQuery, { categoria }, CACHE);

  const conteo = new Map<string, number>();
  for (const { fecha } of fechas || []) {
    const anio = String(fecha || "").slice(0, 4);
    if (/^\d{4}$/.test(anio)) conteo.set(anio, (conteo.get(anio) || 0) + 1);
  }

  return [...conteo.entries()]
    .map(([anio, count]) => ({ anio, count }))
    .sort((a, b) => b.anio.localeCompare(a.anio));
}

/** Slugs y fechas de todos los posts, para el sitemap. */
export async function getPostsParaSitemap() {
  if (client) return (await client.fetch(sitemapPostsQuery, {}, CACHE)) || [];
  return [];
}

export async function getSettings() {
  if (client) {
    return (await client.fetch(configQuery, {}, CACHE)) || [];
  }
  return [];
}

export async function getPostBySlug(slug) {
  if (client) {
    return (await client.fetch(singlequery, { slug }, CACHE)) || {};
  }
  return {};
}

export async function getAllPostsSlugs() {
  if (client) {
    const slugs = (await client.fetch(pathquery, {}, CACHE)) || [];
    return slugs.map(slug => ({ slug }));
  }
  return [];
}
// Author
export async function getAllAuthorsSlugs() {
  if (client) {
    const slugs = (await client.fetch(authorsquery, {}, CACHE)) || [];
    return slugs.map(slug => ({ author: slug }));
  }
  return [];
}

export async function getAuthorPostsBySlug(slug) {
  if (client) {
    return (await client.fetch(postsbyauthorquery, { slug }, CACHE)) || {};
  }
  return {};
}

export async function getAllAuthors() {
  if (client) {
    return (await client.fetch(allauthorsquery, {}, CACHE)) || [];
  }
  return [];
}

// Category

export async function getAllCategories() {
  if (client) {
    const slugs = (await client.fetch(catpathquery, {}, CACHE)) || [];
    return slugs.map(slug => ({ category: slug }));
  }
  return [];
}

export async function getPostsByCategory(slug) {
  if (client) {
    return (await client.fetch(postsbycatquery, { slug }, CACHE)) || {};
  }
  return {};
}

export async function getTopCategories() {
  if (client) {
    return (await client.fetch(catquery, {}, CACHE)) || [];
  }
  return [];
}

export async function getReviews() {
  if (client) {
    return (await client.fetch(reviewsQuery, {}, CACHE)) || [];
  }
  return [];
}

export async function getFAQs() {
  if (client) {
    return (await client.fetch(faqsQuery, {}, CACHE)) || [];
  }
  return [];
}




export async function getPaginatedPosts({ limit, pageIndex = 0 }) {
  if (client) {
    return (
      (await client.fetch(paginatedquery, {
        pageIndex: pageIndex,
        limit: limit
      }, CACHE)) || []
    );
  }
  return [];
}

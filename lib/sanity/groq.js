import { groq } from "next-sanity";

// Get all posts
export const postquery = groq`
*[_type == "post"] | order(publishedAt desc, _createdAt desc) {
  _id,
  _createdAt,
  publishedAt,
  mainImage {
    ...,
    "blurDataURL":asset->metadata.lqip,
    "ImageColor": asset->metadata.palette.dominant.background,
  },
  featured,
  excerpt,
  slug,
  title,
  author-> {
    _id,
    image,
    slug,
    name
  },
  categories[]->,
}
`;
// Get all posts with 0..limit
export const limitquery = groq`
*[_type == "post"] | order(publishedAt desc, _createdAt desc) [0..$limit] {
  ...,
  author->,
  categories[]->
}
`;
// [(($pageIndex - 1) * 10)...$pageIndex * 10]{
// Get subsequent paginated posts
export const paginatedquery = groq`
*[_type == "post"] | order(publishedAt desc, _createdAt desc) [$pageIndex...$limit] {
  ...,
  author->,
  categories[]->
}
`;

// Filtro compartido por la consulta de la pagina del blog y por su conteo.
// Los dos TIENEN que usar exactamente el mismo criterio: si divergen, la
// paginacion muestra "pagina 5 de 8" cuando en realidad hay 3, y el lector
// llega a paginas vacias.
//
// Cuando $categoria, $desde o $hasta vienen vacios, la condicion se cumple
// sola y no filtra nada. Asi una unica consulta sirve para todas las
// combinaciones, en vez de armar el GROQ concatenando texto.
//
// Las fechas se comparan como texto y funciona porque son ISO 8601: en ese
// formato el orden alfabetico y el cronologico coinciden.
const FILTRO_BLOG = `_type == "post"
  && ($categoria == "" || $categoria in categories[]->slug.current)
  && ($desde == "" || coalesce(publishedAt, _createdAt) >= $desde)
  && ($hasta == "" || coalesce(publishedAt, _createdAt) <= $hasta)`;

// Una pagina del blog, con el total para saber cuantas paginas hay.
// Va todo en una sola consulta para que el listado y el conteo se resuelvan
// en el mismo viaje y no puedan quedar desincronizados.
export const blogPageQuery = groq`{
  "posts": *[${FILTRO_BLOG}] | order(coalesce(publishedAt, _createdAt) desc) [$inicio...$fin] {
    _id,
    _createdAt,
    publishedAt,
    mainImage {
      ...,
      "blurDataURL": asset->metadata.lqip,
      "ImageColor": asset->metadata.palette.dominant.background,
    },
    featured,
    excerpt,
    slug,
    title,
    author-> { _id, image, slug, name },
    categories[]->,
  },
  "total": count(*[${FILTRO_BLOG}]),
  "totalDelAnio": count(*[_type == "post"
    && ($desde == "" || coalesce(publishedAt, _createdAt) >= $desde)
    && ($hasta == "" || coalesce(publishedAt, _createdAt) <= $hasta)])
}`;

// Todas las categorias con cuantas notas tiene cada una. A diferencia de
// catquery, no se limita a las 8 primeras: el listado necesita poder filtrar
// por cualquiera.
//
// El conteo respeta el año elegido ($desde/$hasta). Es lo que evita los
// callejones sin salida: si estas viendo 2024, una categoria cuya unica nota
// es de 2025 aparece en 0 y el listado la esconde, en vez de ofrecerte un
// filtro que lleva a una pagina vacia.
export const categoriasConConteoQuery = groq`
*[_type == "category"] {
  _id,
  title,
  "slug": slug.current,
  color,
  "count": count(*[
    _type == "post" && references(^._id)
    && ($desde == "" || coalesce(publishedAt, _createdAt) >= $desde)
    && ($hasta == "" || coalesce(publishedAt, _createdAt) <= $hasta)
  ])
} | order(count desc)
`;

// Fechas de los posts, para armar el desplegable de años.
//
// Se traen las fechas y se agrupan en JS porque GROQ no tiene un "group by":
// para contar por año habria que saber de antemano cuales existen, que es
// justo lo que se quiere averiguar. Es una consulta liviana —una fecha por
// nota, sin cuerpo ni imagenes— y respeta la categoria activa por el mismo
// motivo que el conteo de arriba.
export const fechasPostsQuery = groq`
*[_type == "post" && ($categoria == "" || $categoria in categories[]->slug.current)] {
  "fecha": coalesce(publishedAt, _createdAt)
}
`;

// Slugs y fechas de todos los posts, para el sitemap.
export const sitemapPostsQuery = groq`
*[_type == "post" && defined(slug.current)] {
  "slug": slug.current,
  "fecha": coalesce(publishedAt, _createdAt)
}
`;

// Get Site Config
export const configQuery = groq`
*[_type == "settings"][0] {
  ...,
}
`;

// Single Post
export const singlequery = groq`
*[_type == "post" && slug.current == $slug][0] {
  ...,
  body[]{
    ...,
    markDefs[]{
      ...,
      _type == "internalLink" => {
        "slug": @.reference->slug
      }
    }
  },
  author->,
  categories[]->,
  "estReadingTime": round(length(pt::text(body)) / 5 / 180 ),
  "related": *[_type == "post" && count(categories[@._ref in ^.^.categories[]._ref]) > 0 ] | order(publishedAt desc, _createdAt desc) [0...5] {
    title,
    slug,
    "date": coalesce(publishedAt,_createdAt),
    "image": mainImage
  },
}
`;

// Paths for generateStaticParams
export const pathquery = groq`
*[_type == "post" && defined(slug.current)][].slug.current
`;
export const catpathquery = groq`
*[_type == "category" && defined(slug.current)][].slug.current
`;
export const authorsquery = groq`
*[_type == "author" && defined(slug.current)][].slug.current
`;

// Get Posts by Authors
export const postsbyauthorquery = groq`
*[_type == "post" && $slug match author->slug.current ] {
  ...,
  author->,
  categories[]->,
}
`;

// Get Posts by Category
export const postsbycatquery = groq`
*[_type == "post" && $slug in categories[]->slug.current ] {
  ...,
  author->,
  categories[]->,
}
`;

// Get top 5 categories
export const catquery = groq`*[_type == "category"] {
  ...,
  "count": count(*[_type == "post" && references(^._id)])
} | order(count desc) [0...8]`;

export const searchquery = groq`*[_type == "post" && _score > 0]
| score(title match $query || excerpt match $query || pt::text(body) match $query)
| order(_score desc)
{
  _score,
  _id,
  _createdAt,
  mainImage,
  author->,
  categories[]->,
   title,
   slug
}`;

// Get all Authors
export const allauthorsquery = groq`
*[_type == "author"] {
 ...,
 'slug': slug.current,
}
`;

// Get all Reviews
export const reviewsQuery = groq`
*[_type == "review"] | order(_createdAt desc) {
  _id,
  review,
  name,
  position,
  company
}
`;

// Las resenas de Google que se ven en la insignia del home.
//
// El coalesce esta para que "sin orden" signifique "al final" y no "al
// principio": en GROQ el null se ordena antes que cualquier numero, asi que
// sin el, una resena a la que nadie le puso orden le ganaria a la que se
// marco explicitamente como primera.
export const resenasGoogleQuery = groq`
*[_type == "resenaGoogle" && oculta != true]
  | order(coalesce(orden, 1000) asc, fecha desc) {
  _id,
  autor,
  texto,
  estrellas,
  fecha
}
`;

// El [0] convierte la lista en un solo documento, o en null si todavia no
// existe. La insignia se apoya en eso: sin resumen no se dibuja nada.
export const resumenGoogleQuery = groq`
*[_type == "resumenGoogle"][0] {
  calificacion,
  totalOpiniones,
  enlacePerfil
}
`;

export const faqsQuery = groq`
  *[_type == "faq"]{
    _id,
    question,
    answer
  } | order(_createdAt asc)
`;

export const benfitsQuery = groq`
  *[_type == "benefits"]{
    _id,
    company,
    image,
    reward,
    tag
  } | order(_createdAt asc)
`;

// Query para obtener todos los cursos
export const coursesQuery = groq`
*[_type == "course"] | order(publishedAt desc, _createdAt desc) {
  _id,
  title,
  description,
  price,
  lessons,
  duration,
  url,
  mainImage {
    asset->{
      _id,
      url,
      metadata {
        lqip, // low quality image placeholder
        palette {
          dominant {
            background
          }
        }
      }
    },
    alt
  }
}
`;

// Query para obtener un curso específico por slug
export const singleCourseQuery = groq`
*[_type == "course" && slug.current == $slug][0] {
  _id,
  title,
  description,
  price,
  lessons,
  duration,
  url,
  mainImage {
    asset->{
      _id,
      url,
      metadata {
        lqip,
        palette {
          dominant {
            background
          }
        }
      }
    },
    alt
  }
}
`;

// get everything from sanity
// to test connection
export const getAll = groq`*[]`;

import { plans } from "@/lib/plans";
import { siteName, siteUrl } from "@/lib/seo";

const ORGANIZATION_ID = `${siteUrl}/#organization`;

/**
 * Ficha del negocio. Es lo que le permite a Google entender que JRC es una
 * firma de contabilidad con oficina en Escazu, y lo que alimenta los
 * resultados de busqueda locales.
 *
 * Los datos son los mismos que ya aparecen publicos en el footer y en la
 * pagina de contacto.
 */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": ORGANIZATION_ID,
    name: siteName,
    url: siteUrl,
    email: "info@jrc.cr",
    telephone: "+506-6055-6705",
    image: `${siteUrl}/img/JRCLogofull.png`,
    logo: `${siteUrl}/img/JRCLogofull.png`,
    description:
      "Consultoría tributaria, fiscal, legal y financiera para empresas en Costa Rica.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Trejos Montealegre",
      addressLocality: "Escazú",
      addressRegion: "San José",
      addressCountry: "CR"
    },
    areaServed: {
      "@type": "Country",
      name: "Costa Rica"
    },
    sameAs: [
      "https://www.instagram.com/jrc_consulting/",
      "https://www.facebook.com/jrcconsultingcr/",
      "https://www.linkedin.com/company/jrcconsultinggroup/"
    ]
  };
}

/**
 * Catalogo de planes de contabilidad mensual, con su precio en colones.
 * Los datos salen de lib/plans.js, la misma fuente que pinta /pricing.
 */
/**
 * Ficha de una nota del blog.
 *
 * Faltaba, y era el hueco mas caro que tenia el SEO del blog: las paginas de
 * nota solo llevaban la ficha de la empresa, asi que Google no tenia ningun
 * dato estructurado que dijera "esto es un articulo, se publico tal dia y lo
 * escribio tal persona". Tenia que deducirlo leyendo el HTML.
 *
 * Para un blog que publica noticias fechadas eso importa mas que en otros
 * sitios: la fecha es justo lo que decide si una nota se muestra como
 * reciente o no. Y sin BlogPosting no hay forma de aparecer en resultados
 * enriquecidos.
 *
 * dateModified sale de _updatedAt y cae a la fecha de publicacion si no
 * existe. No se pone la fecha de hoy: declararle a Google que una nota de
 * junio se modifico hoy, cada vez que alguien la abre, es pedirle que
 * desconfie de todas las fechas del sitio.
 */
export function articleSchema(post, path, imagenUrl) {
  if (!post?.title) return null;

  const publicado = post.publishedAt || post._createdAt;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${siteUrl}${path}#article`,
    // mainEntityOfPage le dice a Google cual es LA pagina de este articulo,
    // que es lo que evita que trate una copia o un listado como el original.
    mainEntityOfPage: { "@type": "WebPage", "@id": `${siteUrl}${path}` },
    headline: post.title,
    description: post.excerpt || undefined,
    // Google pide la imagen para poder mostrar la nota con foto en los
    // resultados. Va como arreglo porque es lo que espera su documentacion.
    image: imagenUrl ? [imagenUrl] : undefined,
    datePublished: publicado || undefined,
    dateModified: post._updatedAt || publicado || undefined,

    // El autor es SIEMPRE JRC, y no post.author.name. Ese campo no guarda un
    // autor: en las notas importadas guarda el MEDIO DE ORIGEN, asi que
    // usarlo aca declaraba a Google que una persona llamada "La Nación" o
    // "Ministerio de Hacienda" escribio una nota de jrc.cr. De 89 notas, 82
    // quedaban firmadas por un medio de terceros.
    //
    // Eso no es un detalle de formato: es atribuirle contenido propio a otro
    // medio en el dato que Google toma como declaracion de autoria. Una ficha
    // que miente sobre quien escribio es peor que no tener ficha.
    //
    // La fuente de la noticia se sigue diciendo donde corresponde, como texto
    // al pie de la nota ("Fuente: X"), que es una atribucion de origen y no
    // de autoria.
    author: { "@type": "Organization", name: siteName, "@id": ORGANIZATION_ID },

    // El editor es quien responde por lo publicado, que es la misma empresa.
    publisher: { "@id": ORGANIZATION_ID },
    inLanguage: "es-CR",
    isAccessibleForFree: true,
    keywords: (post.categories || []).map((c) => c?.title).filter(Boolean).join(", ") || undefined,
  };
}

export function pricingSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: "Planes de contabilidad mensual",
    url: `${siteUrl}/pricing`,
    provider: {
      "@id": ORGANIZATION_ID
    },
    itemListElement: plans.map((plan, index) => ({
      "@type": "Offer",
      position: index + 1,
      name: plan.name,
      description: plan.description,
      url: `${siteUrl}${plan.url}`,
      price: plan.priceAmount,
      priceCurrency: "CRC",
      availability: "https://schema.org/InStock",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: plan.priceAmount,
        priceCurrency: "CRC",
        // Los planes se cobran por mes.
        unitCode: "MON"
      },
      itemOffered: {
        "@type": "Service",
        name: `Plan ${plan.name}`,
        serviceType: "Contabilidad y cumplimiento tributario",
        provider: {
          "@id": ORGANIZATION_ID
        }
      }
    }))
  };
}

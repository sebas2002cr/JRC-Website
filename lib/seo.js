export const siteUrl = process.env.SITE_URL || "https://jrc.cr";

export const siteName = "JRC Consulting Group";

/** Imagen que se ve al compartir el sitio en WhatsApp, LinkedIn o Facebook. */
export const ogImage = {
  url: "/og-image.jpg",
  width: 1200,
  height: 630,
  alt: siteName
};

/**
 * Construye la metadata de una pagina.
 *
 * Existe porque en App Router los campos de `metadata` se sobrescriben, no
 * se fusionan: una pagina que declara `title` pero no `openGraph` hereda el
 * openGraph del layout raiz, y acaba compartiendo el og:title del home. Aqui
 * se arma el bloque completo para que cada ruta tenga el suyo.
 *
 * @param {object}  page
 * @param {string}  page.title        Titulo sin el sufijo de marca.
 * @param {string}  page.description  Meta description.
 * @param {string}  page.path         Ruta absoluta del sitio, ej. "/pricing".
 */
export function pageMetadata({ title, description, path }) {
  const fullTitle = `${title} | ${siteName}`;

  return {
    title,
    description,
    alternates: {
      canonical: path
    },
    openGraph: {
      type: "website",
      locale: "es_CR",
      siteName,
      url: `${siteUrl}${path}`,
      title: fullTitle,
      description,
      images: [ogImage]
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage.url]
    }
  };
}

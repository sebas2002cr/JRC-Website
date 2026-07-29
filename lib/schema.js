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
      "Consultoría contable, tributaria y de cumplimiento para empresas en Costa Rica.",
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

import { pageMetadata } from "@/lib/seo";
import ConfirmarClient from "./confirmar-client";

/**
 * Confirmación de la suscripción al boletín. Se llega solo desde el correo.
 *
 * `noindex` porque no tiene nada que hacer en Google: es el final de un
 * enlace personal, no una página del sitio. Además, indexarla dejaría
 * direcciones con token dando vueltas en los resultados de búsqueda.
 */
export const metadata = {
  ...pageMetadata({
    title: "Confirmar suscripción",
    description: "Confirmá tu suscripción al Boletín JRC.",
    path: "/boletin/confirmar"
  }),
  robots: { index: false, follow: false }
};

/**
 * A propósito NO depende de NEXT_PUBLIC_NEWSLETTER.
 *
 * Si el formulario se apagara mientras alguien tiene un correo sin
 * confirmar, esa persona se encontraría con un 404 después de haber dejado
 * su dirección. El interruptor esconde el formulario, no rompe lo que ya se
 * puso en marcha.
 */
export default function ConfirmarPage({ searchParams }) {
  return <ConfirmarClient token={searchParams?.t || ""} />;
}

import { pageMetadata } from "@/lib/seo";
import BajaClient from "./baja-client";

/**
 * Baja del boletín. Se llega desde el pie de cualquier correo.
 *
 * `noindex` por lo mismo que la de confirmar: es el final de un enlace
 * personal y no una página del sitio.
 */
export const metadata = {
  ...pageMetadata({
    title: "Darse de baja del boletín",
    description: "Cancelá tu suscripción al Boletín JRC.",
    path: "/boletin/baja"
  }),
  robots: { index: false, follow: false }
};

export default function BajaPage({ searchParams }) {
  return (
    <BajaClient correo={searchParams?.c || ""} token={searchParams?.t || ""} />
  );
}

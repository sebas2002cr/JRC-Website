import { pageMetadata } from "@/lib/seo";
import ContactPage from "./contact-client";

export const metadata = pageMetadata({
  title: "Contacto",
  description:
    "Contactá a JRC Consulting Group en Escazú, Costa Rica. Consultas sobre contabilidad, impuestos, cumplimiento tributario y constitución de sociedades.",
  path: "/contact"
});

export default function Page() {
  return <ContactPage />;
}

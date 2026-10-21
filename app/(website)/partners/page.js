import { pageMetadata } from "@/lib/seo";
import PartnersPage from "./partners-client";
import { CONDICIONES_AFILIADOS_BORRADOR, CONDICIONES_AFILIADOS_PUBLICADAS } from "../_legal/datos";

export const metadata = pageMetadata({
  title: "Programa de afiliados",
  description:
    "Convertite en afiliado de JRC Consulting Group y referí clientes de servicios contables y tributarios en Costa Rica.",
  path: "/partners"
});

export default function Page() {
  return <PartnersPage condiciones={CONDICIONES_AFILIADOS_PUBLICADAS || CONDICIONES_AFILIADOS_BORRADOR} />;
}

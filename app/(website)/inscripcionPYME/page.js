import { pageMetadata } from "@/lib/seo";
import InscripcionPymePage from "./inscripcionPYME-client";

export const metadata = pageMetadata({
  title: "Inscripción PYME",
  description:
    "Inscribí tu PYME ante el MEIC con JRC Consulting Group y accedé a los beneficios fiscales y programas de apoyo para pequeñas y medianas empresas en Costa Rica.",
  path: "/inscripcionPYME"
});

export default function Page() {
  return <InscripcionPymePage />;
}

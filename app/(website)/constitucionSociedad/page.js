import { pageMetadata } from "@/lib/seo";
import ConstitucionSociedadPage from "./constitucionSociedad-client";

export const metadata = pageMetadata({
  title: "Constitución de sociedades",
  description:
    "Constituí tu sociedad en Costa Rica con JRC Consulting Group. Trámite completo de constitución, inscripción y puesta en marcha de tu empresa.",
  path: "/constitucionSociedad"
});

export default function Page() {
  return <ConstitucionSociedadPage />;
}

import { pageMetadata } from "@/lib/seo";
import CoursesPage from "./courses-client";

export const metadata = pageMetadata({
  title: "Cursos y capacitaciones",
  description:
    "Cursos y capacitaciones de JRC Consulting Group en contabilidad, tributación y cumplimiento normativo para empresas en Costa Rica.",
  path: "/courses"
});

export default function Page() {
  return <CoursesPage />;
}

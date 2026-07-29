import HomePage from "./home";
import { getAllPosts } from "@/lib/sanity/client";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contabilidad y asesoría tributaria en Costa Rica",
  description:
    "Consultoría contable, tributaria y de cumplimiento para empresas en Costa Rica. Contabilidad mensual, constitución de sociedades, inscripción de PYMEs y asesoría fiscal.",
  path: "/"
});

export default async function IndexPage() {
  const posts = await getAllPosts();
  return <HomePage posts={posts} />;
}

// Revalidate cada 60 segundos
export const revalidate = 60;

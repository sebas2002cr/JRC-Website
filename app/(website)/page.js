import HomePage from "./home";
import Newsletter from "@/components/blog/newsletter";
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
  return (
    <>
      <HomePage posts={posts} />
      {/* Va acá afuera y no dentro de home.js porque home.js entero se
          renderiza solo si hay posts. El botón del newsletter no depende
          de que Sanity conteste: si un día no devuelve nada, la home se
          queda vacía pero el newsletter sigue en pie. */}
      <Newsletter />
    </>
  );
}

// Revalidate cada 60 segundos
export const revalidate = 60;

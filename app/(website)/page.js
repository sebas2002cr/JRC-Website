import HomePage from "./home";
import Newsletter from "@/components/blog/newsletter";
import { getAllPosts } from "@/lib/sanity/client";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contabilidad y asesoría tributaria en Costa Rica",
  // Misma frase que el siteDescription de app/layout.tsx, y tiene que
  // seguir siendolo: esta es la que gana en el home —la metadata de la
  // pagina pisa la del layout— y aquella es la que se hereda al resto. Si
  // se cambia una sola, el home y el sitio dicen cosas distintas. Alla esta
  // el comentario que explica por que es corta.
  description:
    "Consultoría tributaria, fiscal, legal y financiera para empresas y PYMEs en Costa Rica.",
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

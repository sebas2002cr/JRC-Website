import HomePage from "./home";
import Newsletter from "@/components/blog/newsletter";
import {
  getAllPosts,
  getResenasGoogle,
  getResumenGoogle
} from "@/lib/sanity/client";
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
  // Las tres en paralelo y no una atrás de otra: son consultas
  // independientes a Sanity, y encadenadas con await sueltos la página
  // esperaría la suma de las tres en vez de la más lenta.
  const [posts, resumenGoogle, resenasGoogle] = await Promise.all([
    getAllPosts(),
    getResumenGoogle(),
    getResenasGoogle()
  ]);

  return (
    <>
      <HomePage
        posts={posts}
        resumenGoogle={resumenGoogle}
        resenasGoogle={resenasGoogle}
      />
      {/* El newsletter queda fuera del contenido para conservar su posición
          flotante. La insignia de reseñas recibe sus datos en home.js para
          poder estar en el flujo móvil y flotando en escritorio. */}
      <Newsletter />
    </>
  );
}

// Revalidate cada 60 segundos
export const revalidate = 60;

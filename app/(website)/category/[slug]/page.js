import Container from "@/components/container";
import PostList from "@/components/postlist";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostsByCategory, getAllCategories } from "@/lib/sanity/client";
import { pageMetadata } from "@/lib/seo";

/**
 * Listado de notas de una categoria.
 *
 * Esta ruta no existia, pero components/blog/category.js ya enlazaba a
 * /category/{slug} desde cada tarjeta del listado y desde cada articulo: o
 * sea que TODOS esos enlaces daban 404, en cada nota publicada.
 *
 * Reutiliza getPostsByCategory y getAllCategories, que ya estaban escritas
 * en lib/sanity/client.ts y nunca se habian usado.
 */

export async function generateStaticParams() {
  return await getAllCategories();
}

export async function generateMetadata({ params }) {
  const nombre = decodeURIComponent(params.slug).replace(/-/g, " ");
  return pageMetadata({
    title: `Categoría: ${nombre}`,
    description: `Noticias y análisis de JRC Consulting Group sobre ${nombre} en Costa Rica.`,
    path: `/category/${params.slug}`
  });
}

export default async function CategoriaPage({ params }) {
  const posts = await getPostsByCategory(params.slug);

  if (!Array.isArray(posts) || posts.length === 0) {
    notFound();
  }

  // El titulo se toma del documento de categoria y no del slug de la URL,
  // para que salga con sus tildes y mayusculas correctas.
  const titulo =
    posts[0]?.categories?.find(c => c?.slug?.current === params.slug)?.title ||
    decodeURIComponent(params.slug).replace(/-/g, " ");

  return (
    <Container>
      <section className="mb-10 text-center">
        <p className="text-sm font-semibold text-[#305832]">Categoría</p>
        <h1 className="text-4xl font-bold capitalize text-gray-800 dark:text-white">
          {titulo}
        </h1>
        <p className="mb-8 mt-4 text-gray-600 dark:text-gray-400">
          {posts.length} {posts.length === 1 ? "nota" : "notas"} en esta categoría.
        </p>

        <Link
          href="/blog"
          className="rounded-full border border-[#305832] px-5 py-2 text-sm text-[#305832] transition-colors hover:bg-[#305832] hover:text-white">
          Ver todas las noticias
        </Link>
      </section>

      <div className="grid gap-10 md:grid-cols-2 lg:gap-10 xl:grid-cols-3">
        {posts.map(post => (
          <PostList key={post._id} post={post} aspect="square" />
        ))}
      </div>
    </Container>
  );
}

export const revalidate = 60;

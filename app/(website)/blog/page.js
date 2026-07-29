import Blog from "./blog";
import { getAllPosts, getTopCategories } from "@/lib/sanity/client";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Blog",
  description:
    "Noticias y análisis sobre impuestos, contabilidad y cumplimiento tributario en Costa Rica, del equipo de JRC Consulting Group.",
  path: "/blog"
});

export default async function IndexPage() {
  const posts = await getAllPosts();
  const categories = await getTopCategories(); // Obtener las categorías

  return <Blog posts={posts} categories={categories} />;
}

// Revalidate cada 60 segundos
export const revalidate = 60;

import Blog from "./blog";
import { getAllPosts, getTopCategories } from "@/lib/sanity/client";

export default async function IndexPage() {
  const posts = await getAllPosts();
  const categories = await getTopCategories();  // Obtener las categorías

  return <Blog posts={posts} categories={categories} />;
}

// Revalidate cada 60 segundos
export const revalidate = 60;

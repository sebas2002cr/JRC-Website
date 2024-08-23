import HomePage from "./home";
import { getAllPosts } from "@/lib/sanity/client";

export default async function IndexPage() {
  const posts = await getAllPosts();
  return <HomePage posts={posts} />;
}

// Revalidate cada 60 segundos
export const revalidate = 60;

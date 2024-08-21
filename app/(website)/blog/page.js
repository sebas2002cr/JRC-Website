import Blog from "./blog";
import { getAllPosts } from "@/lib/sanity/client";

export default async function IndexPage() {
  const posts = await getAllPosts();
  return <Blog posts={posts} />;
}

// export const revalidate = 60;

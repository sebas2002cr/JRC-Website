import PostPage from "./default";

import { getAllPostsSlugs, getPostBySlug } from "@/lib/sanity/client";
import { urlForImage } from "@/lib/sanity/image";
import { siteName, siteUrl } from "@/lib/seo";

export async function generateStaticParams() {
  return await getAllPostsSlugs();
}

export async function generateMetadata({ params }) {
  const post = await getPostBySlug(params.slug);

  // Sin credenciales de Sanity getPostBySlug devuelve {}: se deja que la
  // pagina herede la metadata del layout en vez de generar una vacia.
  if (!post?.title) return {};

  const path = `/post/${params.slug}`;
  const description = post.excerpt || undefined;
  const image = urlForImage(post.mainImage);
  const images = image
    ? [
        {
          url: image.src,
          width: image.width,
          height: image.height,
          alt: post.title
        }
      ]
    : undefined;

  return {
    title: post.title,
    description,
    alternates: {
      canonical: path
    },
    openGraph: {
      type: "article",
      locale: "es_CR",
      siteName,
      url: `${siteUrl}${path}`,
      title: `${post.title} | ${siteName}`,
      description,
      publishedTime: post.publishedAt || post._createdAt,
      authors: post.author?.name ? [post.author.name] : undefined,
      images
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} | ${siteName}`,
      description,
      images
    }
  };
}

export default async function PostDefault({ params }) {
  const post = await getPostBySlug(params.slug);
  return <PostPage post={post} />;
}

export const revalidate = 60;

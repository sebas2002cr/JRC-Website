import PostPage from "./default";
import JsonLd from "@/components/jsonLd";

import { getAllPostsSlugs, getPostBySlug } from "@/lib/sanity/client";
import { urlForImage } from "@/lib/sanity/image";
import { articleSchema } from "@/lib/schema";
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

  // La ficha del articulo. Iba faltando: las paginas de nota solo llevaban la
  // ficha de la empresa, asi que Google tenia que deducir de que fecha era
  // cada nota leyendo el HTML. Ver articleSchema en lib/schema.js.
  const ficha = articleSchema(
    post,
    `/post/${params.slug}`,
    post?.mainImage ? urlForImage(post.mainImage)?.src : undefined
  );

  return (
    <>
      {ficha && <JsonLd data={ficha} />}
      <PostPage post={post} />
    </>
  );
}

export const revalidate = 60;

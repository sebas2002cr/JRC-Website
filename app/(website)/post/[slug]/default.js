import Image from "next/image";
import Container from "@/components/container";
import { notFound } from "next/navigation";
import { PortableText } from "@/lib/sanity/plugins/portabletext";
import { urlForImage } from "@/lib/sanity/image";
import { parseISO, format } from "date-fns";

import CategoryLabel from "@/components/blog/category";
import AuthorCard from "@/components/blog/authorCard";
import ContactoWhatsApp from "@/components/blog/contactoWhatsApp";
import AvatarAutor from "@/components/blog/avatarAutor";
import { EnlaceVolver, BotonVolverFlotante } from "@/components/blog/volverAlBlog";

export default function Post(props) {
  const { loading, post } = props;

  const slug = post?.slug;

  if (!loading && !slug) {
    notFound();
  }

  const imageProps = post?.mainImage
    ? urlForImage(post?.mainImage)
    : null;

  return (
    <>
      <Container className="!pt-0">
        <div className="mx-auto max-w-screen-md ">
          <EnlaceVolver />

          <div className="flex justify-center">
            <CategoryLabel categories={post.categories} />
          </div>

          <h1 className="text-brand-primary mb-3 mt-2 text-center text-3xl font-semibold tracking-tight dark:text-white lg:text-4xl lg:leading-snug">
            {post.title}
          </h1>

          <div className="mt-3 flex justify-center space-x-3 text-gray-500 ">
            <div className="flex items-center gap-3">
              <AvatarAutor author={post?.author} size={40} />
              <div className="text-left">
                <p className="font-medium text-gray-800 dark:text-gray-300">
                  {post.author.name}
                </p>
                <div className="flex items-center space-x-2 text-sm">
                  <time
                    className="text-gray-500 dark:text-gray-400"
                    dateTime={post?.publishedAt || post._createdAt}>
                    {format(
                      parseISO(post?.publishedAt || post._createdAt),
                      "MMMM dd, yyyy"
                    )}
                  </time>
                  <span>· {post.estReadingTime || "5"} min read</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* La foto acompana, no encabeza.
          Antes ocupaba todo el ancho (max-w-screen-lg) con proporcion 16:9,
          o sea unos 1024x576: al abrir la nota lo primero y casi lo unico
          que se veia era una foto de stock, y habia que bajar para empezar a
          leer. Ahora se limita al mismo ancho que el texto y a una franja
          mas baja, asi que entra en la misma lectura en vez de competir con
          el titulo. Son imagenes ilustrativas de banco: no aportan
          informacion que justifique ese protagonismo. */}
      {imageProps && (
        <figure className="mx-auto mt-6 max-w-screen-md px-8 xl:px-5">
          <div className="relative aspect-[16/9] overflow-hidden rounded-xl md:aspect-[2/1]">
            <Image
              src={imageProps.src}
              alt={post.mainImage?.alt || "Thumbnail"}
              loading="eager"
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>

          {/* Credito al fotografo. Las guidelines de la API de Pexels lo
              exigen donde se use la foto, junto con el enlace a Pexels. */}
          {post.mainImage?.credito && (
            <figcaption className="pt-2 text-right">
              <a
                href={post.mainImage.creditoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                {post.mainImage.credito}
              </a>
            </figcaption>
          )}
        </figure>
      )}

      <Container>
        <article className="mx-auto max-w-screen-md ">
          <div className="prose mx-auto my-3 dark:prose-invert prose-a:text-blue-600">
            {post.body && <PortableText value={post.body} />}
          </div>

          <ContactoWhatsApp titulo={post.title} />

          {/* La fuente va como TEXTO, sin enlace. El enlace a la nota
              original vive solo en el CRM, para contrastar datos
              internamente. */}
          {post.fuenteMedio && (
            <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
              Fuente: {post.fuenteMedio}
            </p>
          )}

          <div className="mb-7 mt-7 flex justify-center">
            <a
              href="/blog"
              className="rounded-full border border-gray-200 px-5 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-[#305832] hover:text-[#305832] dark:border-gray-700 dark:text-gray-300 dark:hover:text-white">
              ← Volver al blog
            </a>
          </div>
        </article>
      </Container>

      <BotonVolverFlotante />
    </>
  );
}

const MainImage = ({ image }) => {
  return (
    <div className="mb-12 mt-12 ">
      <Image {...urlForImage(image)} alt={image.alt || "Thumbnail"} />
      <figcaption className="text-center ">
        {image.caption && (
          <span className="text-sm italic text-gray-600 dark:text-gray-400">
            {image.caption}
          </span>
        )}
      </figcaption>
    </div>
  );
};

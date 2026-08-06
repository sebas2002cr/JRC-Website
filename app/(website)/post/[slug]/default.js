import Image from "next/image";
import Container from "@/components/container";
import { notFound } from "next/navigation";
import { PortableText } from "@/lib/sanity/plugins/portabletext";
import { urlForImage } from "@/lib/sanity/image";
import { parseISO, format } from "date-fns";
import { es } from "date-fns/locale";

import CategoryLabel from "@/components/blog/category";
import ContactoWhatsApp from "@/components/blog/contactoWhatsApp";
import AvatarAutor from "@/components/blog/avatarAutor";
import { EnlaceVolver, BotonVolverFlotante } from "@/components/blog/volverAlBlog";

/**
 * ORDEN DE LA NOTA
 *
 * Antes había cinco bloques apilados antes del primer párrafo (categoría,
 * título, autor, fecha/lectura y una foto a todo lo ancho), así que al abrir
 * una nota lo primero que se veía era una foto de banco y había que bajar
 * para empezar a leer. El orden de ahora:
 *
 *   1. categoría · fecha · tiempo de lectura  (una sola línea)
 *   2. título
 *   3. bajada: dos líneas que dicen por qué importa
 *   4. los primeros párrafos
 *   5. la foto, ya dentro de la lectura
 *   6. el resto del texto
 *   7. CTA de WhatsApp
 *   8. firma y fuente
 *
 * Los dos cambios de fondo son que la firma bajó al final —firmar antes de
 * que el lector sepa de qué va la nota no aporta nada, y el logo competía
 * con el título— y que la foto entró dentro del texto en vez de encabezarlo.
 * Ninguna pieza se eliminó.
 */

// Después de cuántos párrafos entra la foto. Dos alcanzan para que quien
// llega ya esté leyendo; con uno solo la foto sigue quedando casi arriba.
const PARRAFOS_ANTES_DE_LA_FOTO = 2;

/**
 * Parte el cuerpo en lo que va antes de la foto y lo que va después.
 *
 * Solo cuentan los párrafos normales: si la nota arranca con un subtítulo,
 * cortar ahí dejaría la foto entre el H2 y su propio texto.
 *
 * Si el corte cae al final (nota corta, o toda de subtítulos y listas) la
 * foto se va arriba del cuerpo, porque abajo del último párrafo quedaría
 * suelta, ya fuera de la lectura.
 */
function partirCuerpo(cuerpo) {
  if (!Array.isArray(cuerpo) || cuerpo.length === 0) return [[], []];

  let parrafos = 0;
  let corte = 0;

  for (let i = 0; i < cuerpo.length; i++) {
    const bloque = cuerpo[i];
    const esParrafo =
      bloque?._type === "block" && (!bloque.style || bloque.style === "normal");

    if (esParrafo) {
      parrafos++;
      corte = i + 1;
      if (parrafos === PARRAFOS_ANTES_DE_LA_FOTO) break;
    }
  }

  if (corte === 0 || corte >= cuerpo.length) return [[], cuerpo];

  return [cuerpo.slice(0, corte), cuerpo.slice(corte)];
}

export default function Post(props) {
  const { loading, post } = props;

  const slug = post?.slug;

  if (!loading && !slug) {
    notFound();
  }

  const imageProps = post?.mainImage ? urlForImage(post?.mainImage) : null;

  const fechaISO = post?.publishedAt || post._createdAt;
  const fecha = format(parseISO(fechaISO), "d 'de' MMMM, yyyy", { locale: es });

  const [cuerpoAntes, cuerpoDespues] = partirCuerpo(post.body);

  const foto = imageProps && (
    <figure className="my-8">
      <div className="relative aspect-[16/9] overflow-hidden rounded-xl md:aspect-[5/2]">
        <Image
          src={imageProps.src}
          alt={post.mainImage?.alt || post.title}
          fill
          sizes="(max-width: 768px) 100vw, 768px"
          className="object-cover"
        />
      </div>

      {/* Crédito al fotógrafo. Las guidelines de la API de Pexels lo exigen
          donde se use la foto, junto con el enlace a Pexels. */}
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
  );

  return (
    <>
      <Container className="!pt-0">
        <article className="mx-auto max-w-screen-md">
          <EnlaceVolver />

          {/* Categoría, fecha y lectura en un solo renglón. Antes eran dos
              bloques separados que empujaban el título hacia abajo, y dan
              exactamente el mismo contexto: de qué es, cuándo, cuánto dura. */}
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
            <CategoryLabel categories={post.categories} nomargin />

            <span aria-hidden="true" className="text-gray-300 dark:text-gray-600">
              ·
            </span>
            <time dateTime={fechaISO}>{fecha}</time>

            <span aria-hidden="true" className="text-gray-300 dark:text-gray-600">
              ·
            </span>
            <span>{post.estReadingTime || "5"} min de lectura</span>
          </div>

          <h1 className="text-brand-primary mt-3 text-center text-3xl font-semibold tracking-tight dark:text-white lg:text-4xl lg:leading-snug">
            {post.title}
          </h1>

          {/* Acá se probó una bajada con la meta description y se quitó: no
              aportaba nada que el primer párrafo no dijera ya, y sumaba un
              bloque más entre el título y el comienzo de la lectura, que es
              justo lo que este rediseño buscaba reducir. La meta description
              sigue existiendo y sigue yendo a buscadores; simplemente no se
              dibuja en la página. */}

          <div className="prose mx-auto mt-8 dark:prose-invert prose-a:text-blue-600">
            {cuerpoAntes.length > 0 && <PortableText value={cuerpoAntes} />}
          </div>

          {foto}

          <div className="prose mx-auto dark:prose-invert prose-a:text-blue-600">
            {cuerpoDespues.length > 0 && <PortableText value={cuerpoDespues} />}
          </div>

          <ContactoWhatsApp titulo={post.title} />

          {/* Firma y fuente, al cierre. La fuente va como TEXTO, sin enlace:
              el enlace a la nota original vive solo en el CRM, para
              contrastar datos internamente. */}
          <div className="mt-10 flex items-center gap-3 border-t border-gray-100 pt-6 dark:border-gray-800">
            <AvatarAutor author={post?.author} size={44} />
            <div className="text-sm">
              <p className="font-medium text-gray-800 dark:text-gray-300">
                {post.author.name}
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                Publicado el {fecha}
                {post.fuenteMedio && <> · Fuente: {post.fuenteMedio}</>}
              </p>
            </div>
          </div>

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

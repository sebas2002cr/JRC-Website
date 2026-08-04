import Image from "next/image";
import { urlForImage } from "@/lib/sanity/image";
import { cx } from "@/utils/all";

/**
 * Avatar del autor, con respaldo cuando no hay foto.
 *
 * El documento de autor "Equipo JRC" lo crea el CRM automaticamente al
 * publicar la primera nota, y se crea SIN imagen: nadie va a acordarse de
 * subirla al Studio. Sin respaldo, cada articulo mostraba un circulo vacio
 * al lado del nombre.
 *
 * El respaldo es un simbolo de autor sobre el verde de marca. Se probo
 * antes con las iniciales ("EJ"), pero un par de letras sueltas se lee como
 * un usuario cualquiera de un sistema, no como la firma de quien escribe.
 * El icono comunica "esto lo firma alguien" sin depender de que el nombre
 * abrevie bien.
 *
 * Si algun dia se le sube una foto al autor en Sanity, esta pasa a usarse
 * sola y el simbolo desaparece.
 */

const VERDE = "#305832";

export default function AvatarAutor({ author, size = 40, className }) {
  const imagen = author?.image ? urlForImage(author.image) : null;
  const dimension = `${size}px`;

  if (imagen) {
    return (
      <div className={cx("relative flex-shrink-0", className)} style={{ width: dimension, height: dimension }}>
        <Image
          src={imagen.src}
          alt={author?.name || "Autor"}
          className="rounded-full object-cover"
          fill
          sizes={dimension}
        />
      </div>
    );
  }

  return (
    <div
      className={cx("flex flex-shrink-0 items-center justify-center rounded-full text-white", className)}
      style={{ width: dimension, height: dimension, backgroundColor: VERDE }}
      title={author?.name || "Autor"}
      aria-hidden="true">
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        style={{ width: `${Math.round(size * 0.58)}px`, height: `${Math.round(size * 0.58)}px` }}
        aria-hidden="true">
        <path d="M12 12.5a4.25 4.25 0 1 0 0-8.5 4.25 4.25 0 0 0 0 8.5Z" />
        <path d="M12 14.25c-3.86 0-7 2.35-7 5.25 0 .28.22.5.5.5h13a.5.5 0 0 0 .5-.5c0-2.9-3.14-5.25-7-5.25Z" />
      </svg>
    </div>
  );
}

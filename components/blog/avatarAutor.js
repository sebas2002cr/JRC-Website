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
 * El respaldo son las iniciales sobre el verde de marca. Si algun dia se le
 * sube una foto al autor en Sanity, esta pasa a usarse sola.
 */

const VERDE = "#305832";

function iniciales(nombre) {
  return String(nombre || "JRC")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(palabra => palabra[0])
    .join("")
    .toUpperCase();
}

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
      className={cx("flex flex-shrink-0 items-center justify-center rounded-full font-semibold text-white", className)}
      style={{
        width: dimension,
        height: dimension,
        backgroundColor: VERDE,
        fontSize: `${Math.round(size * 0.36)}px`
      }}
      aria-hidden="true">
      {iniciales(author?.name)}
    </div>
  );
}

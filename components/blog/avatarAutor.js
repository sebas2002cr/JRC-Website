import Image from "next/image";
import { urlForImage } from "@/lib/sanity/image";
import { cx } from "@/utils/all";

/**
 * Avatar del autor, con respaldo cuando no hay foto.
 *
 * El documento de autor "Equipo JRC" lo crea el CRM automáticamente al
 * publicar la primera nota, y se crea SIN imagen: nadie va a acordarse de
 * subirla al Studio. Sin respaldo, cada artículo mostraba un círculo vacío
 * al lado del nombre.
 *
 * El respaldo es el LOGO de la empresa. Se probó antes con las iniciales
 * ("EJ") y después con un símbolo genérico de persona, y los dos fallaban
 * por lo mismo: quien firma no es una persona, es la firma. Un monigote
 * genérico se lee como un usuario cualquiera de un sistema; el logo dice
 * exactamente quién respalda la nota, que es lo que le da peso.
 *
 * Si algún día se le sube una foto al autor en Sanity, esa pasa a usarse
 * sola y el logo desaparece.
 */

// Monograma JRC en negro sobre blanco. Es cuadrado, así que entra bien en
// un círculo, a diferencia del logo horizontal completo.
const LOGO = "/NEGRO-FONDO-BLANCO.jpg";

// El archivo ya trae su propio margen alrededor de las letras, así que se
// muestra completo. Se probó ampliándolo para que el monograma se viera más
// grande y salió peor: al agrandarlo, el círculo le recortaba los costados a
// la J y a la C.

export default function AvatarAutor({ author, size = 40, className }) {
  const imagen = author?.image ? urlForImage(author.image) : null;
  const dimension = `${size}px`;

  if (imagen) {
    return (
      <div
        className={cx("relative flex-shrink-0", className)}
        style={{ width: dimension, height: dimension }}>
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
      className={cx(
        "relative flex-shrink-0 overflow-hidden rounded-full border border-gray-200 bg-white dark:border-gray-700",
        className
      )}
      style={{ width: dimension, height: dimension }}
      title={author?.name || "JRC Consulting Group"}>
      <Image
        src={LOGO}
        alt={author?.name || "JRC Consulting Group"}
        fill
        sizes={dimension}
        className="object-contain"
      />
    </div>
  );
}

"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { cx } from "@/utils/all";

/**
 * Paginacion del listado del blog.
 *
 * Se usan enlaces reales y no botones con router.push a proposito: cada
 * pagina queda con su propia direccion, se puede abrir en otra pestana, y
 * Google puede recorrerlas para llegar a las notas viejas. Con el listado
 * anterior, que cortaba en 14 sin enlaces a mas, esas notas eran invisibles
 * tambien para los buscadores.
 *
 * (El componente components/blog/pagination.tsx del tema original apuntaba a
 * /archive, una ruta que no existe en este proyecto.)
 */

const VERDE = "#305832";
const VENTANA = 2; // cuantas paginas se muestran a cada lado de la actual

function rangoDePaginas(pagina, paginas) {
  const numeros = new Set([1, paginas]);
  for (let i = pagina - VENTANA; i <= pagina + VENTANA; i++) {
    if (i >= 1 && i <= paginas) numeros.add(i);
  }

  const ordenadas = [...numeros].sort((a, b) => a - b);

  // Marca los huecos con null para dibujar los puntos suspensivos.
  const conHuecos = [];
  ordenadas.forEach((n, i) => {
    if (i > 0 && n - ordenadas[i - 1] > 1) conHuecos.push(null);
    conHuecos.push(n);
  });
  return conHuecos;
}

export default function Paginacion({ pagina, paginas, total }) {
  const searchParams = useSearchParams();

  if (paginas <= 1) return null;

  const enlace = destino => {
    const params = new URLSearchParams(searchParams);
    if (destino <= 1) params.delete("page");
    else params.set("page", String(destino));
    const query = params.toString();
    return `/blog${query ? `?${query}` : ""}`;
  };

  const numeros = rangoDePaginas(pagina, paginas);

  return (
    <nav className="mt-12 flex flex-col items-center gap-3" aria-label="Paginación">
      <div className="flex items-center gap-1">
        <Flecha
          href={enlace(pagina - 1)}
          deshabilitado={pagina <= 1}
          etiqueta="Anterior"
          icono={<ChevronLeftIcon className="h-4 w-4" />}
        />

        {numeros.map((n, i) =>
          n === null ? (
            <span key={`hueco-${i}`} className="px-2 text-gray-400">
              …
            </span>
          ) : (
            <Link
              key={n}
              href={enlace(n)}
              aria-current={n === pagina ? "page" : undefined}
              className={cx(
                "flex h-9 min-w-9 items-center justify-center rounded-full px-3 text-sm font-medium transition-colors",
                n === pagina
                  ? "text-white"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              )}
              style={n === pagina ? { backgroundColor: VERDE } : undefined}>
              {n}
            </Link>
          )
        )}

        <Flecha
          href={enlace(pagina + 1)}
          deshabilitado={pagina >= paginas}
          etiqueta="Siguiente"
          icono={<ChevronRightIcon className="h-4 w-4" />}
        />
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400">
        Página {pagina} de {paginas} · {total} {total === 1 ? "nota" : "notas"}
      </p>
    </nav>
  );
}

function Flecha({ href, deshabilitado, etiqueta, icono }) {
  const clases =
    "flex h-9 w-9 items-center justify-center rounded-full transition-colors";

  if (deshabilitado) {
    return (
      <span className={cx(clases, "cursor-not-allowed text-gray-300 dark:text-gray-700")} aria-hidden="true">
        {icono}
      </span>
    );
  }

  return (
    <Link
      href={href}
      aria-label={etiqueta}
      className={cx(clases, "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800")}>
      {icono}
    </Link>
  );
}

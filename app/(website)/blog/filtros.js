"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cx } from "@/utils/all";

/**
 * Filtros del listado: categoria y periodo.
 *
 * Los filtros viven en la URL y no en el estado del componente. Eso permite
 * compartir "el blog filtrado por Tributario, página 2" con un enlace, que
 * el botón de atrás funcione, y —lo importante— que el filtro se resuelva en
 * la consulta a Sanity en vez de descartando resultados ya traidos, que es
 * lo que rompia la paginacion.
 */

const PERIODOS = [
  { valor: "", etiqueta: "Todo el tiempo" },
  { valor: "semana", etiqueta: "Última semana" },
  { valor: "mes", etiqueta: "Último mes" },
  { valor: "anio", etiqueta: "Último año" }
];

const VERDE = "#305832";

export default function Filtros({ categorias, categoriaActiva, periodoActivo, total }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const navegar = (clave, valor) => {
    const params = new URLSearchParams(searchParams);
    if (valor) params.set(clave, valor);
    else params.delete(clave);
    // Cambiar de filtro siempre vuelve a la primera pagina: quedarse en la
    // 4 despues de filtrar suele dejar la pantalla vacia.
    params.delete("page");
    const query = params.toString();
    router.push(`/blog${query ? `?${query}` : ""}`);
  };

  const conNotas = categorias.filter(c => c.count > 0);

  return (
    <div className="mb-10">
      {/* Categorias. En movil se desplazan en horizontal en vez de
          envolverse en tres filas de botones. */}
      <div className="-mx-4 mb-4 overflow-x-auto px-4 pb-2">
        <div className="flex w-max gap-2 md:w-full md:flex-wrap md:justify-center">
          <Chip
            activo={!categoriaActiva}
            onClick={() => navegar("categoria", "")}
            etiqueta="Todas"
            cantidad={total}
          />
          {conNotas.map(categoria => (
            <Chip
              key={categoria._id}
              activo={categoriaActiva === categoria.slug}
              onClick={() => navegar("categoria", categoria.slug)}
              etiqueta={categoria.title}
              cantidad={categoria.count}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {PERIODOS.map(periodo => (
          <button
            key={periodo.valor}
            onClick={() => navegar("periodo", periodo.valor)}
            className={cx(
              "rounded-full px-3 py-1 text-sm transition-colors",
              periodoActivo === periodo.valor
                ? "bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-900"
                : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            )}>
            {periodo.etiqueta}
          </button>
        ))}
      </div>
    </div>
  );
}

function Chip({ activo, onClick, etiqueta, cantidad }) {
  return (
    <button
      onClick={onClick}
      className={cx(
        "flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all",
        activo
          ? "border-transparent text-white shadow-sm"
          : "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
      )}
      style={activo ? { backgroundColor: VERDE } : undefined}>
      <span>{etiqueta}</span>
      {/* El conteo ya venia en la consulta de categorias y no se usaba.
          Da contexto gratis: "Tributario 14" dice cuanto hay ahi antes de
          hacer clic. */}
      <span
        className={cx(
          "rounded-full px-2 text-xs",
          activo ? "bg-white/25" : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
        )}>
        {cantidad}
      </span>
    </button>
  );
}

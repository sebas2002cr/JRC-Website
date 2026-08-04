"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cx } from "@/utils/all";

/**
 * Barra de filtros del listado: categoría y año.
 *
 * Antes eran dos filas centradas: ocho chips de categoría, todos del mismo
 * tamaño, más cuatro botones de periodo. Trece controles de aspecto parecido
 * compitiendo entre sí y con el título de la página.
 *
 * Dos problemas de fondo, no de estilo:
 *
 *  1. Las categorías están muy desbalanceadas —dos concentran el 78% de las
 *     notas y cuatro tienen una sola—, así que dibujarlas todas iguales daba
 *     el mismo peso visual a un cajón de 36 notas y a uno de 1. Ahora solo
 *     las de volumen quedan a la vista y la cola larga se pliega en "+N más".
 *  2. Los periodos relativos quedaban vacíos: "última semana" y "último mes"
 *     devolvían 0 notas. Se cambiaron por años reales, que salen del propio
 *     contenido y por definición nunca están vacíos.
 *
 * Los filtros viven en la URL y no en el estado del componente. Eso permite
 * compartir "el blog filtrado por Tributario, página 2" con un enlace, que
 * el botón de atrás funcione, y —lo importante— que el filtro se resuelva en
 * la consulta a Sanity en vez de descartando resultados ya traídos, que es
 * lo que rompía la paginación.
 */

const VERDE = "#305832";

// Cuántas categorías se muestran sueltas antes de plegar el resto. Con el
// contenido actual deja fuera justo las que tienen una sola nota.
const VISIBLES = 4;

export default function Filtros({
  categorias,
  categoriaActiva,
  anios,
  anioActivo,
  totalDelAnio
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const navegar = (clave, valor) => {
    const params = new URLSearchParams(searchParams);
    if (valor) params.set(clave, valor);
    else params.delete(clave);
    // Cambiar de filtro siempre vuelve a la primera página: quedarse en la
    // 4 después de filtrar suele dejar la pantalla vacía.
    params.delete("page");
    const query = params.toString();
    router.push(`/blog${query ? `?${query}` : ""}`);
  };

  // Las de conteo 0 no se dibujan: dentro del año elegido no llevan a nada.
  // La activa se conserva siempre, para que no desaparezca el chip que
  // explica por qué se está viendo lo que se ve.
  const conNotas = (categorias || []).filter(
    c => c.count > 0 || c.slug === categoriaActiva
  );

  const sueltas = conNotas.slice(0, VISIBLES);
  let plegadas = conNotas.slice(VISIBLES);

  // Si la activa quedó en el grupo plegado, se sube: el estado del filtro
  // tiene que verse sin abrir nada.
  const activaPlegada = plegadas.find(c => c.slug === categoriaActiva);
  if (activaPlegada) {
    plegadas = plegadas.filter(c => c.slug !== categoriaActiva);
    sueltas.push(activaPlegada);
  }

  const anioSeleccionado = (anios || []).find(a => a.anio === anioActivo);

  return (
    <div className="mb-10 border-y border-gray-100 py-4 dark:border-gray-800">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-3">
        <Chip
          activo={!categoriaActiva}
          onClick={() => navegar("categoria", "")}
          etiqueta="Todas"
          cantidad={totalDelAnio}
        />

        {sueltas.map(categoria => (
          <Chip
            key={categoria._id}
            activo={categoriaActiva === categoria.slug}
            onClick={() => navegar("categoria", categoria.slug)}
            etiqueta={categoria.title}
            cantidad={categoria.count}
          />
        ))}

        {plegadas.length > 0 && (
          <Desplegable etiqueta={`+${plegadas.length} más`} alineacion="left">
            {cerrar =>
              plegadas.map(categoria => (
                <Opcion
                  key={categoria._id}
                  activa={categoriaActiva === categoria.slug}
                  onClick={() => {
                    cerrar();
                    navegar("categoria", categoria.slug);
                  }}
                  etiqueta={categoria.title}
                  cantidad={categoria.count}
                />
              ))
            }
          </Desplegable>
        )}

        {/* El año se separa a la derecha porque no es del mismo orden que las
            categorías: filtra por otra dimensión, y mezclarlo en la misma
            fila de chips era buena parte del desorden anterior. */}
        {(anios || []).length > 1 && (
          <div className="ms-auto">
            <Desplegable
              etiqueta={anioSeleccionado ? anioSeleccionado.anio : "Fecha"}
              activo={Boolean(anioActivo)}
              alineacion="right">
              {cerrar => (
                <>
                  <Opcion
                    activa={!anioActivo}
                    onClick={() => {
                      cerrar();
                      navegar("anio", "");
                    }}
                    etiqueta="Cualquier fecha"
                  />
                  {anios.map(a => (
                    <Opcion
                      key={a.anio}
                      activa={anioActivo === a.anio}
                      onClick={() => {
                        cerrar();
                        navegar("anio", a.anio);
                      }}
                      etiqueta={a.anio}
                      cantidad={a.count}
                    />
                  ))}
                </>
              )}
            </Desplegable>
          </div>
        )}
      </div>
    </div>
  );
}

function Chip({ activo, onClick, etiqueta, cantidad }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={activo}
      className={cx(
        "flex shrink-0 items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
        activo
          ? "text-white"
          : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
      )}
      style={activo ? { backgroundColor: VERDE } : undefined}>
      <span>{etiqueta}</span>
      {/* El conteo ya venía en la consulta de categorías y no se usaba.
          Da contexto gratis: "Tributario 32" dice cuánto hay ahí antes de
          hacer clic. */}
      <span
        className={cx(
          "text-xs tabular-nums",
          activo ? "text-white/70" : "text-gray-400 dark:text-gray-500"
        )}>
        {cantidad}
      </span>
    </button>
  );
}

/**
 * Desplegable propio en vez de un <select> nativo: hace falta mostrar el
 * conteo al lado de cada opción y marcar la activa, cosas que un <select> no
 * permite estilar de forma pareja entre navegadores.
 *
 * Se cierra al hacer clic fuera y con Escape, que es lo mínimo para que no
 * se sienta un menú a medias.
 */
function Desplegable({ etiqueta, activo, alineacion = "left", children }) {
  const [abierto, setAbierto] = useState(false);
  const contenedor = useRef(null);

  useEffect(() => {
    if (!abierto) return;

    const alClic = evento => {
      if (!contenedor.current?.contains(evento.target)) setAbierto(false);
    };
    const alTeclado = evento => {
      if (evento.key === "Escape") setAbierto(false);
    };

    document.addEventListener("mousedown", alClic);
    document.addEventListener("keydown", alTeclado);
    return () => {
      document.removeEventListener("mousedown", alClic);
      document.removeEventListener("keydown", alTeclado);
    };
  }, [abierto]);

  return (
    <div className="relative" ref={contenedor}>
      <button
        onClick={() => setAbierto(v => !v)}
        aria-expanded={abierto}
        aria-haspopup="menu"
        className={cx(
          "flex shrink-0 items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
          activo
            ? "text-white"
            : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
        )}
        style={activo ? { backgroundColor: VERDE } : undefined}>
        {etiqueta}
        <svg
          className={cx("h-3.5 w-3.5 transition-transform", abierto && "rotate-180")}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
          aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {abierto && (
        <div
          role="menu"
          className={cx(
            "absolute z-30 mt-2 min-w-[13rem] overflow-hidden rounded-xl border border-gray-100 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800",
            alineacion === "right" ? "end-0" : "start-0"
          )}>
          {children(() => setAbierto(false))}
        </div>
      )}
    </div>
  );
}

function Opcion({ activa, onClick, etiqueta, cantidad }) {
  return (
    <button
      role="menuitem"
      onClick={onClick}
      className={cx(
        "flex w-full items-center justify-between gap-6 px-4 py-2 text-start text-sm transition-colors",
        activa
          ? "font-semibold text-[#305832] dark:text-white"
          : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
      )}>
      <span>{etiqueta}</span>
      {cantidad !== undefined && (
        <span className="text-xs tabular-nums text-gray-400 dark:text-gray-500">
          {cantidad}
        </span>
      )}
    </button>
  );
}

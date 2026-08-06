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
 *  1. Las categorías eran ocho y estaban muy desbalanceadas (dos concentraban
 *     el 78% de las notas y cuatro tenían una sola). Ya no: todas las notas
 *     se reclasificaron en las cuatro áreas de la firma.
 *  2. Los periodos relativos quedaban vacíos: "última semana" y "último mes"
 *     devolvían 0 notas. Se cambiaron por años reales, que salen del propio
 *     contenido y por definición nunca están vacíos.
 *
 * QUE EL CONJUNTO SEA FIJO CAMBIA EL DISEÑO. Antes las categorías podían ser
 * ocho o dos, así que había que dibujarlas como fichas sueltas y plegar la
 * cola larga en un "+N más". Ahora siempre son cinco opciones —"Todas" más
 * las cuatro áreas— y eso permite tratarlas como lo que son: los cinco
 * estados de UN control, no cinco botones independientes. De ahí el grupo
 * segmentado, una sola pieza blanca con las cinco opciones adentro. Se ganan
 * dos cosas: se entiende de un vistazo que elegir una descarta las otras, y
 * desaparece el "+N más", o sea que ya no hay nada escondido.
 *
 * El año queda fuera del grupo, separado por su propio control, porque filtra
 * por otra dimensión: se combina con la categoría en vez de competir con ella.
 *
 * Los filtros viven en la URL y no en el estado del componente. Eso permite
 * compartir "el blog filtrado por Tributario, página 2" con un enlace, que
 * el botón de atrás funcione, y —lo importante— que el filtro se resuelva en
 * la consulta a Sanity en vez de descartando resultados ya traídos, que es
 * lo que rompía la paginación.
 */

const VERDE = "#305832";

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
  // De mayor a menor, que es el orden pedido: lo que más contenido tiene se
  // ofrece primero. El desempate por nombre evita que dos áreas con la misma
  // cantidad se intercambien de lugar entre una carga y otra.
  const conNotas = (categorias || [])
    .filter(c => c.count > 0 || c.slug === categoriaActiva)
    .sort((a, b) => b.count - a.count || a.title.localeCompare(b.title));

  const anioSeleccionado = (anios || []).find(a => a.anio === anioActivo);

  // La barra es una banda con fondo propio y los controles van en blanco
  // encima. Se probo antes sin fondo y sin bordes, buscando algo limpio, y
  // el resultado fue que nada se leia como boton: sobre una pagina blanca,
  // un control blanco sin borde es texto. El contraste banda/control es lo
  // que hace que se entienda que hay algo que tocar.
  return (
    // La barra se centra y ABRAZA su contenido en vez de estirarse de borde a
    // borde. Estirada, el control de año quedaba empujado al extremo derecho,
    // lejísimos de las categorías, y el vacío del medio hacía ver la barra
    // como dos cosas sueltas. Al ser fijo el juego de opciones, el ancho ya no
    // varía y se puede centrar sin miedo a que baile de una página a otra.
    // ── En el celular no se muestra ────────────────────────────────────
    //
    // Es una decisión tomada, no un olvido. Se probaron dos versiones en
    // pantalla chica: una fila que se deslizaba en horizontal, que escondía
    // la mitad de las categorías fuera de la pantalla, y una rejilla de dos
    // por dos, que se veía todo pero ocupaba un bloque grande entre el
    // título y la primera nota. Ninguna convenció.
    //
    // Así que por ahora, en el celular, la lista va sin filtro: se entra y
    // se ve lo último publicado, que es a lo que se entra. De sm en adelante
    // el filtro aparece igual que siempre.
    //
    // Lo que se pierde, dicho de frente: en el celular no hay forma de
    // filtrar por área ni por año. Los enlaces con filtro SÍ siguen
    // funcionando (por ejemplo /blog?categoria=tributario), porque el filtro
    // vive en la dirección y no en estos botones; lo que no hay es cómo
    // llegar a ellos desde la propia página.
    <div className="mb-10 hidden justify-center sm:flex">
      <div className="flex w-full max-w-full flex-col items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 p-2.5 dark:border-gray-800 dark:bg-gray-900/60 sm:w-auto sm:flex-row sm:gap-2.5">
        {/* Grupo segmentado: las cinco opciones dentro de una sola pieza.

            ── En el celular es una rejilla, no una fila que se desliza ────

            Antes era una sola fila con desplazamiento horizontal. En un
            teléfono entraban "Todas" y "Tributario", y Legal y Financiero
            quedaban fuera de la pantalla: había que adivinar que ahí había
            algo y arrastrar con el dedo para encontrarlo. Un filtro que hay
            que descubrir arrastrando no lo usa nadie, y para el que no lo
            descubre el blog tiene dos categorías en vez de cuatro.

            Como las opciones son exactamente cinco y no van a cambiar, se
            pueden acomodar: "Todas" ocupa el ancho completo, porque es la que
            quita el filtro y no es una categoría más, y las cuatro áreas van
            en dos por dos debajo. Todo a la vista, sin gestos y con los
            botones más grandes de lo que eran.

            De sm en adelante vuelve a ser la fila de siempre, que ahí entra
            entera. */}
        <div className="grid w-full grid-cols-2 gap-1 rounded-xl border border-gray-200 bg-white p-1 dark:border-gray-700 dark:bg-gray-800 sm:flex sm:w-auto sm:overflow-x-auto">
          <Segmento
            activo={!categoriaActiva}
            onClick={() => navegar("categoria", "")}
            etiqueta="Todas"
            cantidad={totalDelAnio}
            anchoCompleto
          />

          {conNotas.map(categoria => (
            <Segmento
              key={categoria._id}
              activo={categoriaActiva === categoria.slug}
              onClick={() => navegar("categoria", categoria.slug)}
              etiqueta={categoria.title}
              cantidad={categoria.count}
            />
          ))}
        </div>

        {(anios || []).length > 1 && (
          <>
            {/* Separador fino: dice "esto es otra cosa" sin necesidad de
                mandarlo al otro extremo de la pantalla. En móvil no va,
                porque ahí el control queda debajo y el salto de línea ya
                cumple esa función. */}
            <span
              aria-hidden="true"
              className="hidden h-6 w-px bg-gray-200 dark:bg-gray-700 sm:block"
            />

            <div className="w-full sm:w-auto">
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
          </>
        )}
      </div>
    </div>
  );
}

// Estilo del control de año, que sí es un botón suelto.
// justify-center importa solo en móvil, donde el control ocupa todo el ancho;
// en pantallas grandes el botón mide lo que su contenido y no cambia nada.
const BOTON_BASE =
  "flex w-full shrink-0 items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#305832]/40 sm:w-auto";

const BOTON_INACTIVO =
  "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:text-white";

const BOTON_ACTIVO = "border-transparent text-white";

/**
 * Una de las cinco opciones del grupo.
 *
 * Sin borde ni sombra propios: el borde lo pone el grupo. Cinco fichas con
 * borde cada una, pegadas, dan una reja de líneas dobles; el relleno verde de
 * la activa alcanza de sobra para marcar cuál está elegida.
 *
 * El conteo va como número tenue al lado del nombre, no dentro de una
 * pastilla. Con una sola ficha la pastilla se veía bien; repetida cinco veces
 * son cinco manchas grises compitiendo con los nombres, que es lo que hay que
 * leer. Sigue estando la información, pesa menos.
 *
 * `anchoCompleto` es para "Todas" en el celular: ocupa las dos columnas de la
 * rejilla. No es capricho de simetría, es que no es una categoría más: es la
 * que quita el filtro, y ponerla en la misma cuadrícula que las áreas la
 * haría parecer una quinta área.
 *
 * En el celular el texto va centrado y el botón es más alto, porque ahí se
 * toca con el dedo. De sm en adelante vuelve a ser una ficha que mide lo que
 * su contenido, dentro de la fila.
 */
function Segmento({ activo, onClick, etiqueta, cantidad, anchoCompleto }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={activo}
      className={cx(
        "flex items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#305832]/40 sm:shrink-0 sm:justify-start sm:px-3.5 sm:py-2",
        anchoCompleto && "col-span-2 sm:col-span-1",
        activo
          ? "text-white"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
      )}
      style={activo ? { backgroundColor: VERDE } : undefined}>
      <span>{etiqueta}</span>
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
          BOTON_BASE,
          "gap-1.5",
          activo ? BOTON_ACTIVO : BOTON_INACTIVO,
          abierto && !activo && "border-gray-300 bg-gray-100 dark:border-gray-600"
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

/**
 * El recuadro de la consulta tributaria gratis al final de las notas.
 *
 * Solo en las notas de Tributario (plan de SEO, 22 oct 2026): es la única
 * categoría donde «¿estás al día con Hacienda?» tiene que ver con lo que se
 * acaba de leer. Va en el diseño y no dentro del texto porque la guía
 * editorial del pipeline le prohíbe a la IA poner enlaces.
 *
 * La categoría se reconoce por el título o por el slug, sin tildes ni
 * mayúsculas: el pipeline la crea como «Tributario» (asegurarCategoria en
 * CRM/JRC-CRM-Backend/utils/publicarEnSanity.js) y el slug lo puede escribir
 * una persona en el Studio.
 */
const sinTildes = (x) =>
  String(x || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

export const esTributario = (categories) =>
  (categories || []).some(
    (c) =>
      sinTildes(c?.title) === "tributario" ||
      sinTildes(c?.slug?.current) === "tributario"
  );

export default function RecuadroConsulta({ categories }) {
  if (!esTributario(categories)) return null;

  return (
    <div className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border border-[#d9e6da] bg-[#f4f9f4] px-4 py-3 text-[15px] text-gray-800 dark:border-[#2a3a2c] dark:bg-[#18221a] dark:text-gray-200">
      <span
        aria-hidden="true"
        className="grid h-[30px] w-[30px] flex-none place-items-center rounded-full bg-[#305832] text-white">
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round">
          <path d="M7 12.5l3.2 3.2L17 9" />
        </svg>
      </span>
      <span className="min-w-0 flex-1">
        ¿Querés saber si estás al día con Hacienda?
      </span>
      {/* Sin noreferrer, para que la analítica de la consulta vea que la
          visita vino del blog. */}
      <a
        href="https://consultasituaciontributaria.cr"
        target="_blank"
        rel="noopener"
        className="whitespace-nowrap font-bold text-[#305832] underline-offset-4 hover:underline dark:text-[#8cbe8f]">
        Consultalo gratis
      </a>
    </div>
  );
}

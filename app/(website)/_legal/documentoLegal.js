import Container from "@/components/container";
import { notFound } from "next/navigation";
import { EMPRESA, LEGALES_PUBLICADAS } from "./datos";

/**
 * Armazón compartido por /privacidad y /terminos.
 *
 * Existen porque el formulario del boletín tiene que enlazar a algo real:
 * la ley pide consentimiento INFORMADO, y un checkbox que apunta a una
 * página inexistente no informa nada.
 *
 * Los datos de la empresa y los plazos ya están puestos (ver datos.js).
 * Falta una sola decisión, marcada con <Pendiente> en los términos, y falta
 * que el área legal dé el visto bueno final.
 *
 * Por eso siguen detrás del interruptor, y la razón es la misma que antes:
 * publicar una política de privacidad a medio validar es peor que no tener
 * ninguna. Deja por escrito, en el sitio de una firma consultora, que no se
 * sabe bien qué se hace con los datos de la gente.
 *
 * Apagado devuelve 404, no una página vacía: si la dirección no debe existir
 * todavía, que se comporte como que no existe. El pie de página y el sitemap
 * leen el mismo interruptor, así que tampoco las enlazan.
 */
const VERDE = "#305832";

/** Dato que solo puede aportar la empresa. Se ve, para que no se olvide. */
export function Pendiente({ children }) {
  return (
    <span className="rounded bg-amber-100 px-2 py-0.5 font-mono text-sm text-amber-900 dark:bg-amber-900/40 dark:text-amber-200">
      ⟨ {children} ⟩
    </span>
  );
}

export function Seccion({ titulo, children }) {
  return (
    <section className="mb-10">
      <h2 className="mb-3 border-b border-gray-100 pb-2 text-xl font-bold text-gray-800 dark:border-gray-800 dark:text-white">
        {titulo}
      </h2>
      <div className="space-y-3 text-gray-600 dark:text-gray-400">{children}</div>
    </section>
  );
}

export default function DocumentoLegal({ titulo, actualizado, children }) {
  // El corte va acá, en el armazón, y no en cada página: así ninguna futura
  // se puede olvidar de ponerlo.
  if (!LEGALES_PUBLICADAS) notFound();

  return (
    <Container>
      <div className="mx-auto max-w-screen-md">
        {/* Mismas clases que components/ui/label.js y que el encabezado del
            panel del boletin: un solo estilo de rotulo en todo el sitio. */}
        <p className="text-xs font-medium uppercase tracking-wider" style={{ color: VERDE }}>
          Legal
        </p>
        <h1 className="mb-2 text-4xl font-bold text-gray-800 dark:text-white">{titulo}</h1>
        <p className="mb-10 text-sm text-gray-500 dark:text-gray-500">
          Última actualización: {actualizado}
        </p>

        {children}

        <div className="mt-12 rounded-xl bg-gray-50 p-6 dark:bg-gray-800">
          <p className="mb-2 font-semibold text-gray-800 dark:text-white">
            ¿Consultas sobre sus datos personales?
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            Escríbanos a{" "}
            <a href={`mailto:${EMPRESA.correo}`} className="underline">
              {EMPRESA.correo}
            </a>{" "}
            y le respondemos.
          </p>
        </div>
      </div>
    </Container>
  );
}

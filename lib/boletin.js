/**
 * Todo lo que el sitio necesita para hablar con el boletín.
 *
 * Vive acá y no dentro de cada componente porque son tres pantallas que
 * hablan con el mismo backend (el formulario, la confirmación y la baja) y
 * la dirección tiene una trampa que conviene explicar una sola vez.
 */

/**
 * OJO: NO es NEXT_PUBLIC_API_URL.
 *
 * Esa variable apunta al backend viejo del sitio (jrc-backend-…), que es
 * otro servidor y no sabe nada del boletín. Los endpoints del boletín viven
 * en el backend del CRM porque el repo del otro no está disponible.
 *
 * Confundirlas no da un error claro: da un 404 del servidor equivocado.
 */
const API = process.env.NEXT_PUBLIC_CRM_API_URL;

/**
 * Llama al backend y devuelve siempre { ok, datos }.
 *
 * Nunca lanza. Estas tres pantallas no tienen a dónde escalar un error: si
 * algo falla hay que mostrarle algo entendible a quien está del otro lado,
 * no una pantalla en blanco.
 */
export async function pedirAlBoletin(ruta, cuerpo) {
  if (!API) {
    // Pasa en local cuando falta la variable en .env.local. Sin este aviso,
    // el fetch va a "undefined/boletin/suscribir" y el error no dice nada.
    console.error("Falta NEXT_PUBLIC_CRM_API_URL: no se puede llamar al boletín.");
    return { ok: false, datos: { error: "No pudimos conectarnos. Probá más tarde." } };
  }

  // Corte a los quince segundos. Sin esto, un servidor que acepta la
  // conexión y después no contesta deja la pantalla esperando indefinidamente
  // y sin nada que la persona pueda hacer, ni siquiera saber que algo falló.
  // Un mensaje de error se entiende; una pantalla congelada, no.
  const reloj = new AbortController();
  const corte = setTimeout(() => reloj.abort(), 15000);

  try {
    const respuesta = await fetch(`${API}${ruta}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cuerpo),
      signal: reloj.signal
    });

    const datos = await respuesta.json().catch(() => ({}));
    return { ok: respuesta.ok, datos };
  } catch (error) {
    console.error("El boletín no respondió:", error);
    return {
      ok: false,
      datos: {
        error:
          error.name === "AbortError"
            ? "El servidor está tardando demasiado. Probá de nuevo en un momento."
            : "No pudimos conectarnos. Revisá tu conexión y probá de nuevo."
      }
    };
  } finally {
    clearTimeout(corte);
  }
}

/** El verde de marca, el mismo del boletín y del resto del blog. */
export const VERDE = "#305832";

/**
 * Lo que el sitio le avisa al ERP para que entre como lead en Comercial:
 * una cotización de plan, un mensaje de Contacto, una compra en línea o el
 * pago de un plan cotizado.
 *
 * Va APARTE de la llamada de siempre al backend viejo (NEXT_PUBLIC_API_URL),
 * que sigue mandando el PDF y sus correos igual que antes. Esta es un extra:
 * si el ERP no contesta, tarda o rechaza el envío, el visitante no se entera y
 * el formulario sigue su camino. Por eso nunca lanza y nadie la espera.
 *
 * Usa NEXT_PUBLIC_CRM_API_URL, la misma del boletín (ver lib/boletin.js).
 *
 * Si la persona llegó por el enlace personal de un afiliado en los últimos 90
 * días, el envío lleva ese código (`afiliado`) y el ERP liga el lead
 * (programa de afiliados, 21 oct 2026; ver lib/enlaceAfiliado.js).
 */
import { codigoRecordado } from "@/lib/enlaceAfiliado";

const API = process.env.NEXT_PUBLIC_CRM_API_URL;

// Más corto que el del boletín: acá nadie está mirando una pantalla de espera.
const CORTE_MS = 8000;

/**
 * Manda el envío y devuelve una promesa que siempre se cumple con true o
 * false. `datos` lleva `tipo` (cotizacion, contacto, compra, pago, afiliado
 * o enlace), la persona (nombre, correo, telefono) y lo propio de cada
 * formulario.
 */
export function avisarAlErp(datos) {
  if (!API) return Promise.resolve(false);
  const afiliado = datos.afiliado || codigoRecordado();
  if (afiliado) datos = { ...datos, afiliado };
  const reloj = new AbortController();
  const corte = setTimeout(() => reloj.abort(), CORTE_MS);
  return fetch(`${API}/publico/sitio/lead`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
    signal: reloj.signal,
    // Sigue aunque la persona cambie de página (el cotizador sale al pago).
    keepalive: true
  })
    .then(r => r.ok)
    .catch(() => false)
    .finally(() => clearTimeout(corte));
}

/**
 * Lo mismo, para los formularios que van SOLO al ERP y tienen que mostrar si
 * salió bien: /partners y la página del enlace personal (programa de afiliados,
 * 21 oct 2026). Espera la respuesta (hasta 15 segundos) y devuelve
 * { ok, error }, con el mensaje del ERP si lo rechazó. Nunca lanza.
 */
export async function enviarAlErp(datos) {
  if (!API) return { ok: false, error: "No pudimos conectarnos. Probá más tarde." };
  const afiliado = datos.afiliado || codigoRecordado();
  if (afiliado) datos = { ...datos, afiliado };
  const reloj = new AbortController();
  const corte = setTimeout(() => reloj.abort(), 15000);
  try {
    const r = await fetch(`${API}/publico/sitio/lead`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
      signal: reloj.signal
    });
    if (r.ok) return { ok: true };
    const cuerpo = await r.json().catch(() => ({}));
    return { ok: false, error: r.status < 500 && cuerpo.error ? cuerpo.error : "No pudimos recibir tu solicitud. Probá de nuevo en un momento." };
  } catch (e) {
    return {
      ok: false,
      error: e?.name === "AbortError" ? "El servidor está tardando demasiado. Probá de nuevo en un momento." : "No pudimos conectarnos. Revisá tu conexión y probá de nuevo."
    };
  } finally {
    clearTimeout(corte);
  }
}

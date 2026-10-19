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
 */
const API = process.env.NEXT_PUBLIC_CRM_API_URL;

// Más corto que el del boletín: acá nadie está mirando una pantalla de espera.
const CORTE_MS = 8000;

/**
 * Manda el envío y devuelve una promesa que siempre se cumple con true o
 * false. `datos` lleva `tipo` (cotizacion, contacto, compra o pago), la
 * persona (nombre, correo, telefono) y lo propio de cada formulario.
 */
export function avisarAlErp(datos) {
  if (!API) return Promise.resolve(false);
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

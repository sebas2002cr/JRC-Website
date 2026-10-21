/**
 * El código del enlace personal de un afiliado (jrc.cr/r/<codigo>), que el
 * navegador recuerda para que cualquier formulario del sitio lo mande al ERP.
 *
 * Decisiones de Omar (20 y 21 oct 2026):
 *   · Se recuerda 90 días, en localStorage y no en una cookie (el mismo
 *     criterio de lib/memoria.js: no viaja solo al servidor ni identifica a
 *     nadie; viaja solo dentro de un formulario que la persona envía).
 *   · Gana el primer enlace: si alguien abre el de un segundo afiliado
 *     mientras el primero sigue vigente, se queda el primero (decisión 7 del
 *     plan, «gana el primero que quedó registrado»).
 *   · Se guarda aunque el código no exista o el afiliado esté pausado: el ERP
 *     no lo liga, pero anota de dónde llegó y Comercial decide.
 *
 * Las legales lo cuentan en /privacidad (§9).
 */
import { MEMORIA } from "@/lib/memoria";

const DIAS = 90;
const DIA_MS = 24 * 60 * 60 * 1000;

/** El código como lo arma el ERP (utils/afiliados.js): minúsculas, números y guiones. */
export function codigoValido(valor) {
  const t = String(valor ?? "").trim().toLowerCase().slice(0, 60);
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(t) ? t : "";
}

/** El código recordado y vigente, o "". Nunca lanza. */
export function codigoRecordado() {
  try {
    if (typeof window === "undefined") return "";
    const crudo = window.localStorage.getItem(MEMORIA.enlaceAfiliado);
    if (!crudo) return "";
    const { codigo, hasta } = JSON.parse(crudo);
    if (!(Number(hasta) > Date.now())) {
      window.localStorage.removeItem(MEMORIA.enlaceAfiliado);
      return "";
    }
    return codigoValido(codigo);
  } catch {
    return "";
  }
}

/**
 * Recuerda el código de este enlace por 90 días, salvo que ya haya otro
 * vigente (gana el primero). Devuelve el código que queda recordado.
 */
export function recordarCodigo(codigo) {
  const nuevo = codigoValido(codigo);
  const actual = codigoRecordado();
  if (actual || !nuevo) return actual;
  try {
    window.localStorage.setItem(MEMORIA.enlaceAfiliado, JSON.stringify({ codigo: nuevo, hasta: Date.now() + DIAS * DIA_MS }));
  } catch {
    /* Sin almacenamiento, el formulario de la misma página igual lo manda. */
  }
  return nuevo;
}

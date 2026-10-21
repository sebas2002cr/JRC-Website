/**
 * Cómo habla el panel con el ERP (CRM/JRC-CRM-Backend, rutas /panel/*).
 *
 * La sesión es un token Bearer de vida corta (8 horas) que firma el ERP con
 * una llave propia del panel; un token del ERP no entra acá ni uno del panel
 * entra al ERP. Vive en sessionStorage: se borra al cerrar la pestaña y no
 * viaja solo en ninguna cookie (plan, «Sesión»). El ERP lo puede revocar.
 *
 * Mismo patrón que lib/boletin.js: nunca lanza, corta a los 15 segundos y
 * devuelve { ok, status, datos }.
 */
const API = process.env.NEXT_PUBLIC_CRM_API_URL;
const CLAVE = "jrc-panel-afiliados";
const CLAVE_IDIOMA = "jrc-panel-idioma";

export function tokenGuardado() {
  try {
    return window.sessionStorage.getItem(CLAVE) || "";
  } catch {
    return "";
  }
}

export function guardarToken(token) {
  try {
    if (token) window.sessionStorage.setItem(CLAVE, token);
    else window.sessionStorage.removeItem(CLAVE);
  } catch {
    /* Sin almacenamiento, la sesión dura lo que dure la página. */
  }
}

/** El idioma elegido antes de entrar (en el login), recordado en este navegador. */
export function idiomaGuardado() {
  try {
    const l = window.localStorage.getItem(CLAVE_IDIOMA);
    if (l === "es" || l === "en") return l;
  } catch {
    /* sin almacenamiento */
  }
  try {
    return /^en/i.test(navigator.language || "") ? "en" : "es";
  } catch {
    return "es";
  }
}

export function guardarIdioma(l) {
  try {
    window.localStorage.setItem(CLAVE_IDIOMA, l);
  } catch {
    /* sin almacenamiento */
  }
}

/**
 * Pide algo al ERP. `token` va en Authorization; sin token, las públicas
 * (/panel/codigo y /panel/entrar). `error` en datos es un código del panel
 * («sinConexion», «tarda») cuando no hubo respuesta del servidor.
 */
export async function pedir(metodo, ruta, { token, cuerpo } = {}) {
  if (!API) {
    console.error("Falta NEXT_PUBLIC_CRM_API_URL: el panel no puede hablar con el ERP.");
    return { ok: false, status: 0, datos: { codigo: "sinConexion" } };
  }
  const reloj = new AbortController();
  const corte = setTimeout(() => reloj.abort(), 15000);
  try {
    const r = await fetch(`${API}${ruta}`, {
      method: metodo,
      headers: { ...(cuerpo ? { "Content-Type": "application/json" } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: cuerpo ? JSON.stringify(cuerpo) : undefined,
      signal: reloj.signal,
      cache: "no-store",
    });
    const datos = await r.json().catch(() => ({}));
    return { ok: r.ok, status: r.status, datos };
  } catch (e) {
    return { ok: false, status: 0, datos: { codigo: e?.name === "AbortError" ? "tarda" : "sinConexion" } };
  } finally {
    clearTimeout(corte);
  }
}

/** Todo lo que pinta el panel, en paralelo: quién es, sus recomendados, sus pagos y su perfil. */
export async function cargarTodo(token) {
  const [yo, rec, pag, per] = await Promise.all([
    pedir("GET", "/panel/yo", { token }),
    pedir("GET", "/panel/recomendados", { token }),
    pedir("GET", "/panel/pagos", { token }),
    pedir("GET", "/panel/perfil", { token }),
  ]);
  const todas = [yo, rec, pag, per];
  if (todas.some((x) => x.status === 401)) return { vencida: true };
  const mala = todas.find((x) => !x.ok);
  if (mala) return { error: mala.datos.codigo || "sinConexion" };
  return { yo: yo.datos, recomendados: rec.datos, pagos: pag.datos, perfil: per.datos };
}

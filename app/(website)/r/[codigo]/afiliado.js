/**
 * El nombre del afiliado de un enlace personal, para la página y para su
 * vista previa en WhatsApp. Lo da el ERP (GET /publico/sitio/enlace/:codigo):
 * solo de un afiliado activo; si el código no existe o está pausado, viene
 * vacío y la página sale sin nombre. Se guarda un minuto en la caché de Next.
 */
import { codigoValido } from "@/lib/enlaceAfiliado";

const API = process.env.NEXT_PUBLIC_CRM_API_URL;
const VACIO = { nombre: "", nombreYApellido: "" };

export async function afiliadoDelEnlace(codigo) {
  const c = codigoValido(codigo);
  if (!API || !c) return { codigo: c, ...VACIO };
  try {
    const r = await fetch(`${API}/publico/sitio/enlace/${encodeURIComponent(c)}`, { next: { revalidate: 60 }, signal: AbortSignal.timeout(4000) });
    if (!r.ok) return { codigo: c, ...VACIO };
    const d = await r.json();
    return { codigo: c, nombre: String(d.nombre || ""), nombreYApellido: String(d.nombreYApellido || "") };
  } catch {
    return { codigo: c, ...VACIO };
  }
}

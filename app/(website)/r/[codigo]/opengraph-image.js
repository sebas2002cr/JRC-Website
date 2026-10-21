import { ImageResponse } from "next/og";
import { afiliadoDelEnlace } from "./afiliado";

/**
 * La imagen que WhatsApp muestra al compartir jrc.cr/r/<codigo> (Omar, 21 oct
 * 2026: imagen propia con la marca y «Carolina te recomendó a JRC»). Sin
 * nombre si el código no existe o el afiliado está pausado.
 */
// Edge y no Node: la librería de la imagen falla en Windows con Node (rutas
// file://), y en Vercel corre igual en los dos.
export const runtime = "edge";
export const alt = "JRC Consulting Group";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 60;

export default async function Imagen({ params }) {
  const [a, negrita, normal, logo] = await Promise.all([
    afiliadoDelEnlace(params.codigo),
    fetch(new URL("../../../../public/fonts/Inter-Bold.otf", import.meta.url)).then((r) => r.arrayBuffer()),
    fetch(new URL("../../../../public/fonts/Inter-Regular.otf", import.meta.url)).then((r) => r.arrayBuffer()),
    fetch(new URL("../../../../public/Logo-blanco.svg", import.meta.url)).then((r) => r.text()),
  ]);
  // El logo del sitio es negro: se pinta de blanco para el fondo verde.
  const logoBlanco = `data:image/svg+xml;base64,${btoa(logo.replace(/#000000/gi, "#ffffff"))}`;
  const titulo = a.nombre ? `${a.nombre} te recomendó a JRC` : "Te recomendaron a JRC";

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 72px", background: "linear-gradient(135deg, #3d8a66 0%, #305832 45%, #1e3a1c 100%)", color: "#ffffff", fontFamily: "Inter" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoBlanco} width={84} height={84} alt="" />
          <div style={{ fontSize: 30, fontWeight: 700 }}>JRC Consulting Group</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ fontSize: a.nombre && titulo.length > 28 ? 72 : 84, fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.03em" }}>{titulo}</div>
          <div style={{ fontSize: 32, fontWeight: 400, color: "rgba(255,255,255,0.88)" }}>Contabilidad, impuestos y constitución de empresas en Costa Rica</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 28, fontWeight: 700 }}>
          <div style={{ display: "flex", padding: "12px 24px", borderRadius: 999, background: "#ffffff", color: "#1e3a1c" }}>Primera consulta gratuita</div>
          <div style={{ fontWeight: 400, color: "rgba(255,255,255,0.85)" }}>jrc.cr</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Inter", data: negrita, weight: 700, style: "normal" },
        { name: "Inter", data: normal, weight: 400, style: "normal" },
      ],
    }
  );
}

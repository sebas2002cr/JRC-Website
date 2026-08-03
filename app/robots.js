import { siteUrl } from "@/lib/seo";

/**
 * robots.txt generado por la aplicación.
 *
 * Reemplaza al que producía next-sitemap en el paso `postbuild`. Ese archivo
 * se escribía en public/, y los archivos de public/ tienen precedencia sobre
 * las rutas: mientras existiera, el sitemap dinámico de app/sitemap.js nunca
 * se habría servido.
 *
 * Las reglas son las mismas que declaraba next-sitemap.config.js.
 */
export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          // El Studio de Sanity es la herramienta de edición, no contenido.
          "/studio",
          // Pasos intermedios del flujo de compra: no aportan nada en
          // buscadores y no deberían indexarse sueltos.
          "/plans/*/checkout",
          "/plans/*/form",
          "/plans/*/summary"
        ]
      }
    ],
    sitemap: `${siteUrl}/sitemap.xml`
  };
}

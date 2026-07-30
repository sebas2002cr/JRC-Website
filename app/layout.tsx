import "@/styles/tailwind.css";
import type { Metadata } from "next";
import { Providers } from "./providers";
import { cx } from "@/utils/all";
import { Inter, Lora } from "next/font/google";
import { GlobalSeoScript } from "globalseo-next";
import { GlobalSeoSelector } from "globalseo-next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ogImage } from "@/lib/seo";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora"
});

const siteUrl = process.env.SITE_URL || "https://jrc.cr";

const siteDescription =
  "Consultoría contable, tributaria y de cumplimiento para empresas en Costa Rica. Contabilidad mensual, constitución de sociedades, inscripción de PYMEs y asesoría fiscal.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default:
      "JRC Consulting Group | Contabilidad y asesoría tributaria en Costa Rica",
    template: "%s | JRC Consulting Group"
  },
  description: siteDescription,
  // Ojo: no declarar `alternates.canonical` aqui. En el layout raiz se
  // heredaria a TODAS las rutas y cada pagina se anunciaria como duplicada
  // del home. El canonical va en la metadata de cada pagina.
  openGraph: {
    type: "website",
    locale: "es_CR",
    url: siteUrl,
    siteName: "JRC Consulting Group",
    title:
      "JRC Consulting Group | Contabilidad y asesoría tributaria en Costa Rica",
    description: siteDescription,
    images: [ogImage]
  },
  twitter: {
    card: "summary_large_image",
    title:
      "JRC Consulting Group | Contabilidad y asesoría tributaria en Costa Rica",
    description: siteDescription,
    images: [ogImage.url]
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={cx(inter.variable, lora.variable)}
    >
      <body className="antialiased text-gray-800 dark:bg-black dark:text-gray-400">
        {/* TODO: la apiKey deberia vivir solo en una env var. Se deja el
            valor actual como fallback porque aun no esta configurada en
            Vercel y sin ella el selector de idioma dejaria de funcionar.
            (Ya era publica: este script corre en el navegador.) */}
        {/* `delay` intenta mitigar un conflicto con React: el script de
            globalseo parchea history.pushState (que es como navega el App
            Router de Next) y al detectar el cambio de ruta reescribe el
            texto con textContent mientras React todavia esta desmontando el
            arbol anterior. Eso provoca
            "Cannot read properties of null (reading 'removeChild')".
            Darle margen reduce la carrera; no la elimina. */}
        <GlobalSeoScript
          translationMode="client_side_only"
          apiKey={
            process.env.NEXT_PUBLIC_GLOBALSEO_API_KEY ||
            "aa26dc8d-924e-4a67-8736-88c509353158"
          }
          originalLanguage="es"
          allowedLanguages={["en"]}
          useBrowserLanguage="false"
          delay="1200"
          dynamicTranslation="false"
        />

        {/* Wrapper para el GlobalSeoSelector con z-index alto */}
        <div className="fixed bottom-2 right-4 bg-white border border-[#305832] shadow-lg p-2 rounded-lg z-[100]">
          <GlobalSeoSelector color="#305832" />
        </div>

        <Providers>{children}</Providers>

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

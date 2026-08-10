import "@/styles/tailwind.css";
import type { Metadata } from "next";
import { Providers } from "./providers";
import { cx } from "@/utils/all";
import { Inter, Lora } from "next/font/google";
import Script from "next/script";
import { GlobalSeoSelector } from "globalseo-next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ogImage } from "@/lib/seo";
import CanonicalGuard from "@/components/canonicalGuard";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora"
});

const siteUrl = process.env.SITE_URL || "https://jrc.cr";

/**
 * La descripcion que se ve bajo el enlace en Google y dentro de la tarjeta
 * cuando alguien comparte jrc.cr por WhatsApp o LinkedIn.
 *
 * Es corta a proposito. Cada lugar la corta en un largo distinto: Google
 * cerca de los 155 caracteres, WhatsApp cerca de los 100 y menos todavia en
 * una pantalla angosta. La anterior tenia 169 y en los dos lados terminaba
 * en puntos suspensivos. Con 87 entra completa en todos.
 *
 * Por eso las cuatro areas van adelante y no al final: aunque algun dia se
 * le agregue texto atras, lo que define a la empresa ya quedo dicho antes
 * del corte mas corto.
 */
const siteDescription =
  "Consultoría tributaria, fiscal, legal y financiera para empresas y PYMEs en Costa Rica.";

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
        {/* Tiene que ir antes del script de globalseo: blinda el canonical
            que sirve el servidor para que el traductor no lo deje huerfano
            y React no reviente al navegar. Ver components/canonicalGuard.js. */}
        <CanonicalGuard />

        {/* El traductor de globalseo, cargado a mano en vez de con
            <GlobalSeoScript>.

            Motivo: ese componente monta el script con la estrategia por
            defecto de next/script, que lo ejecuta mientras React todavia
            esta hidratando. El script reescribe el DOM con textContent, y
            esa carrera provocaba de forma intermitente
            "Cannot read properties of null (reading 'removeChild')", que
            deja la pagina en blanco con "Application error". El componente
            del paquete descarta los props extra, asi que no acepta un
            `strategy`; de ahi que se use next/script directamente.

            strategy="lazyOnload" lo retrasa hasta despues del load de la
            pagina, cuando React ya termino: se acaba la carrera y el
            selector de abajo sigue funcionando igual.

            data-dynamic-translation="false" ademas apaga el MutationObserver,
            que era la otra pieza que competia con React.

            TODO: la apiKey deberia vivir solo en una env var. Se deja el
            valor actual como fallback porque aun no esta configurada en
            Vercel. Ya era publica: este script corre en el navegador. */}
        <Script
          src="https://unpkg.com/globalseo/dist/translate.js"
          strategy="lazyOnload"
          data-globalseo-key={
            process.env.NEXT_PUBLIC_GLOBALSEO_API_KEY ||
            "aa26dc8d-924e-4a67-8736-88c509353158"
          }
          data-original-language="es"
          data-allowed-languages="en"
          data-use-browser-language="false"
          data-dynamic-translation="false"
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

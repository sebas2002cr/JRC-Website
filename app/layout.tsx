import "@/styles/tailwind.css";
import type { Metadata } from "next";
import { Providers } from "./providers";
import { cx } from "@/utils/all";
import { Inter, Lora } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ogImage } from "@/lib/seo";
import CanonicalGuard from "@/components/canonicalGuard";
import TraductorSitio from "@/components/traductorSitio";

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

        {/* El traductor de globalseo y su selector, fuera del panel de
            afiliados: ver components/traductorSitio.js. */}
        <TraductorSitio />

        <Providers>{children}</Providers>

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

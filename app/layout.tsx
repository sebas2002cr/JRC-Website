import "@/styles/tailwind.css";
import { Providers } from "./providers";
import { cx } from "@/utils/all";
import { Inter, Lora } from "next/font/google";
import { GlobalSeoScript } from "globalseo-next";
import { GlobalSeoSelector } from "globalseo-next";
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora"
});

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      suppressHydrationWarning
      className={cx(inter.variable, lora.variable)}
    >
      <head>
        <title>JRC Consulting Group</title>
        <link rel="icon" href="/BLANCO-FONDO-NEGRO.ico" />
      </head>

      <body className="antialiased text-gray-800 dark:bg-black dark:text-gray-400">
      <GlobalSeoScript
    translationMode="client_side_only"
    apiKey="aa26dc8d-924e-4a67-8736-88c509353158"
    originalLanguage="es"
    allowedLanguages={["en"]}
    excludeClasses="class1, class2"
    excludeIds="id1, id2"
    useBrowserLanguage="false"
  />
        
        {/* Wrapper para el GlobalSeoSelector con z-index alto */}
        <div className="fixed bottom-2 right-4 bg-white border border-[#305832] shadow-lg p-2 rounded-lg z-[100]">
          <GlobalSeoSelector color="#305832" />
        </div>

        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

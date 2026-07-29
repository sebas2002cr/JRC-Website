"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

// Rutas de compra/checkout: se muestran sin navbar ni footer para no
// distraer al usuario durante el flujo de pago.
const noChromeRoutes = [
  "/plans/starter",
  "/plans/professional",
  "/plans/full-compliance",
  "/constitucionSociedad",
  "/inscripcionPYME"
];

function hideChrome(pathname) {
  if (!pathname) return false;
  return noChromeRoutes.some(
    route => pathname === route || pathname.startsWith(`${route}/`)
  );
}

/**
 * Envuelve el contenido del sitio con navbar y footer.
 *
 * Es un Client Component porque necesita `usePathname`, pero `children` llega
 * como slot ya renderizado en el servidor: el contenido de las páginas se
 * sigue generando en SSR y viaja en el HTML inicial.
 */
export default function SiteChrome({ children }) {
  const pathname = usePathname();
  const hidden = hideChrome(pathname);

  return (
    <>
      {!hidden && <Navbar />}

      <main>{children}</main>

      {!hidden && <Footer />}
    </>
  );
}

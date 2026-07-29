import type { Metadata } from "next";

// El studio es una herramienta interna: no debe aparecer en buscadores.
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false
  }
};

/**
 * Este layout cuelga del root layout (app/layout.tsx), que ya renderiza
 * <html> y <body>. Declararlos otra vez aqui producia markup anidado
 * invalido en /studio.
 */
export default function StudioLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

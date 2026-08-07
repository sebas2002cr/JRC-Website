/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    formats: ["image/avif", "image/webp"],
    dangerouslyAllowSVG: true,
    remotePatterns: [{ hostname: "cdn.sanity.io" }]
  },
  typescript: {
    // Estaba atado a `VERCEL_ENV === "production"`, que dejaba pasar los
    // errores de tipos justo en produccion y en cambio rompia los builds de
    // preview. Ahora los errores rompen el build en todos los entornos.
    ignoreBuildErrors: false
  },
  eslint: {
    ignoreDuringBuilds: false
  },

  async redirects() {
    return [
      {
        /**
         * La pagina de suscripcion vivio unas horas en /boletin antes de
         * mudarse a /newsletter, que es como se llama en el sitio y en el
         * CRM. Estuvo publicada y llego a entrar al sitemap, asi que dejarla
         * en 404 significaria que un enlace ya compartido deja de funcionar
         * y que Google encuentra roto algo que le anunciamos nosotros.
         *
         * CUIDADO AL TOCAR ESTO. El "source" es de coincidencia EXACTA a
         * proposito: /boletin/confirmar y /boletin/baja siguen existiendo y
         * viajan dentro de cada correo enviado. Convertir esto en un patron
         * con comodin (/boletin/:resto*) mandaria a /newsletter a quien
         * intenta confirmar su suscripcion o darse de baja desde un correo
         * viejo, y ninguna de las dos cosas volveria a funcionar.
         *
         * permanent: true responde 308. Es lo correcto para una mudanza de
         * verdad, pero el navegador la cachea con ganas: si algun dia se
         * revierte, hay que probar en una ventana nueva para no estar
         * viendo la redireccion guardada.
         */
        source: "/boletin",
        destination: "/newsletter",
        permanent: true
      }
    ];
  }
};

module.exports = nextConfig;

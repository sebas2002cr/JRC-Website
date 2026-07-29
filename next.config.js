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
  }
};

module.exports = nextConfig;

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://jrc.cr",
  generateRobotsTxt: true,
  // El studio de Sanity y los pasos intermedios del flujo de compra no
  // aportan nada en buscadores y no deberian indexarse.
  exclude: [
    "/studio",
    "/studio/*",
    "/plans/*/checkout",
    "/plans/*/form",
    "/plans/*/summary"
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/studio",
          "/plans/*/checkout",
          "/plans/*/form",
          "/plans/*/summary"
        ]
      }
    ]
  }
};

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://formwise.fr",
  generateRobotsTxt: true,
  exclude: ["/login", "/register", "/dashboard", "/dashboard/*", "/api/*"],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/login",
          "/register",
          "/dashboard",
          "/dashboard/*",
          "/api/*",
        ],
      },
    ],
  },
};

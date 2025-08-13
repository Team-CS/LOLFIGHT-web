module.exports = {
  siteUrl: "https://lolfight.kr",
  changefreq: "daily",
  generateRobotsTxt: true,
  exclude: ["/profile/**", "/login/**", "/policies/**"],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/profile/", "/login/", "/policies/"],
      },
    ],
  },
};

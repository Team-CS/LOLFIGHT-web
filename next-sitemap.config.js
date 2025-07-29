module.exports = {
  siteUrl: "https://lolfight.kr",
  changefreq: "daily",
  generateRobotsTxt: true,
  exclude: ["/profile/**", "/register/**", "/policies/**"],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/profile/", "/register/", "/policies/"],
      },
    ],
  },
};

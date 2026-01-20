module.exports = {
  siteUrl: "https://lolfight.kr",
  generateRobotsTxt: true,
  changefreq: "daily",
  priority: 0.7,
  sitemapSize: 5000,
  exclude: ["/profile/**", "/login/**", "/policies/**", "/alarm/**"],

  // 주요 페이지 우선순위 설정
  additionalPaths: async () => {
    const result = [];

    // 주요 페이지들
    const mainPages = [
      { loc: "/", priority: 1.0, changefreq: "daily" },
      { loc: "/battle", priority: 0.9, changefreq: "daily" },
      { loc: "/judgment", priority: 0.9, changefreq: "daily" },
      { loc: "/shop", priority: 0.8, changefreq: "weekly" },
      { loc: "/guide", priority: 0.7, changefreq: "monthly" },
    ];

    // 게시판 페이지들
    const boards = ["free", "notice", "tip", "humor"];
    boards.forEach(board => {
      result.push({
        loc: `/board/${board}`,
        priority: 0.8,
        changefreq: "hourly",
      });
    });

    return [...result, ...mainPages.map(page => ({
      loc: page.loc,
      priority: page.priority,
      changefreq: page.changefreq,
    }))];
  },

  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/profile/", "/login/", "/policies/", "/alarm/", "/members/"],
      },
    ],
    additionalSitemaps: [
      "https://lolfight.kr/sitemap.xml",
    ],
  },

  transform: async (config, path) => {
    // 특정 경로별 우선순위 자동 설정
    let priority = 0.7;
    let changefreq = "daily";

    if (path === "/") {
      priority = 1.0;
      changefreq = "daily";
    } else if (path.includes("/board/")) {
      priority = 0.8;
      changefreq = "hourly";
    } else if (path.includes("/battle") || path.includes("/judgment")) {
      priority = 0.9;
      changefreq = "daily";
    } else if (path.includes("/league/") || path.includes("/guild/")) {
      priority = 0.8;
      changefreq = "daily";
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
};

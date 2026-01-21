// src/app/sitemap.xml/route.ts
const boardMap: Record<string, string> = {
  자유: "free",
  싸움: "fight",
  공지사항: "notice",
  길드원모집: "rgm",
  이벤트: "event",
};

export async function GET() {
  const EXCLUDED_PATHS = ["/join", "/join/", "/profile", "/profile/"];

  const getAllPosts = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/post/all/list`,
        { next: { revalidate: 3600 } } // 1시간 캐시
      );
      if (!res.ok) return [];
      const json = await res.json();
      return json.data || [];
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      return [];
    }
  };

  const getAllGuilds = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/guild/all/list`,
        { next: { revalidate: 3600 } }
      );
      if (!res.ok) return [];
      const json = await res.json();
      return json.data || [];
    } catch (error) {
      console.error("Failed to fetch guilds:", error);
      return [];
    }
  };

  const getAllJudgments = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/judgment/all/list`,
        { next: { revalidate: 3600 } }
      );
      if (!res.ok) return [];
      const json = await res.json();
      return json.data || [];
    } catch (error) {
      console.error("Failed to fetch judgments:", error);
      return [];
    }
  };

  const posts = await getAllPosts();
  const guilds = await getAllGuilds();
  const judgments = await getAllJudgments();
  const baseUrl = "https://lolfight.kr";

  // 우선순위가 높은 주요 페이지들
  const staticUrls = [
    { path: "", priority: "1.0", changefreq: "daily" }, // 홈
    { path: "battle", priority: "0.9", changefreq: "daily" },
    { path: "judgment", priority: "0.9", changefreq: "daily" },
    { path: "league", priority: "0.9", changefreq: "daily" },
    { path: "shop", priority: "0.8", changefreq: "weekly" },
    { path: "guide", priority: "0.7", changefreq: "monthly" },
    { path: "board/notice", priority: "0.9", changefreq: "daily" },
    { path: "board/free", priority: "0.8", changefreq: "hourly" },
    { path: "board/fight", priority: "0.8", changefreq: "hourly" },
    { path: "board/rgm", priority: "0.8", changefreq: "daily" },
    { path: "board/event", priority: "0.8", changefreq: "weekly" },
  ].filter((item) => !EXCLUDED_PATHS.includes(`/${item.path}`));

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  ${staticUrls
    .map(
      (item) => `
    <url>
      <loc>${baseUrl}/${item.path}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>${item.changefreq}</changefreq>
      <priority>${item.priority}</priority>
    </url>
  `
    )
    .join("")}
    ${posts
      .filter((post: any) => post.postBoard && boardMap[post.postBoard])
      .map(
        (post: any) => `
        <url>
        <loc>${baseUrl}/board/${boardMap[post.postBoard]}/${post.id}</loc>
        <lastmod>${new Date(post.postDate || post.createdAt).toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.6</priority>
        </url>`
      )
      .join("")}
      ${guilds
        .map((guild: any) => {
          const encodedName = encodeURIComponent(guild.guildName);
          return `
    <url>
      <loc>${baseUrl}/league/${encodedName}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.7</priority>
    </url>`;
        })
        .join("")}
        ${judgments
          .map(
            (judgment: any) => `
    <url>
      <loc>${baseUrl}/judgment/${judgment.id}</loc>
      <lastmod>${new Date(judgment.createdAt || judgment.judgmentDate).toISOString()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.6</priority>
    </url>
  `
          )
          .join("")}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}

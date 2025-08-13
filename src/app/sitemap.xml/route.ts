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
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/post/all/list`
    );
    const json = await res.json();
    return json.data || [];
  };

  const getAllGuilds = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/guild/all/list`
    );
    const json = await res.json();
    return json.data || [];
  };

  const getAllJudgments = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/judgment/all/list`
    );
    const json = await res.json();
    return json.data || [];
  };

  const posts = await getAllPosts();
  const guilds = await getAllGuilds();
  const judgments = await getAllJudgments();
  const baseUrl = "https://lolfight.kr";

  const staticUrls = [
    "", // 홈
    "board/all",
    "board/notice",
    "board/free",
    "board/fight",
    "board/rgm",
    "board/event",
    "league",
    "judgment",
  ].filter((path) => !EXCLUDED_PATHS.includes(`/${path}`));

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticUrls
    .map(
      (path) => `
    <url>
      <loc>${baseUrl}/${path}</loc>
      <changefreq>daily</changefreq>
      <priority>0.7</priority>
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
        <lastmod>${new Date(post.postDate).toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
        </url>`
      )
      .join("")}
      ${guilds
        .map((guild: any) => {
          const encodedName = encodeURIComponent(guild.guildName);
          return `
    <url>
      <loc>${baseUrl}/league/${encodedName}</loc>
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
      <changefreq>weekly</changefreq>
      <priority>0.7</priority>
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

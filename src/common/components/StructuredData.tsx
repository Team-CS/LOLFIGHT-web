import { PostDto } from "../DTOs/board/post.dto";
import { GuildDto } from "../DTOs/guild/guild.dto";
import { JudgmentDto } from "../DTOs/judgment/judgment.dto";

interface StructuredDataProps {
  type: "article" | "organization" | "website" | "breadcrumb";
  data?: PostDto | GuildDto | JudgmentDto;
  breadcrumbs?: Array<{ name: string; url: string }>;
}

export default function StructuredData({
  type,
  data,
  breadcrumbs,
}: StructuredDataProps) {
  const getArticleSchema = (post: PostDto) => ({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.postTitle,
    author: {
      "@type": "Person",
      name: post.postWriter?.memberName || "익명",
    },
    datePublished: post.postDate,
    dateModified: post.postDate,
    description: post.postContent?.substring(0, 160) || "",
    url: `https://lolfight.kr/board/${post.postBoard}/${post.id}`,
    publisher: {
      "@type": "Organization",
      name: "롤파이트",
      url: "https://lolfight.kr",
      logo: {
        "@type": "ImageObject",
        url: "https://lolfight.kr/LOLFIGHT_NONE_TEXT.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://lolfight.kr/board/${post.postBoard}/${post.id}`,
    },
  });

  const getOrganizationSchema = (guild: GuildDto) => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: guild.guildName,
    description: guild.guildDescription || "롤파이트 길드",
    url: `https://lolfight.kr/league/${encodeURIComponent(guild.guildName)}`,
    member: {
      "@type": "OrganizationRole",
      roleName: "길드원",
      numberOfMembers: guild.guildMembers?.length || 0,
    },
  });

  const getWebsiteSchema = () => ({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "롤파이트",
    alternateName: "LOLFIGHT",
    url: "https://lolfight.kr",
    description:
      "리그 오브 레전드 스크림을 위한 최고의 플랫폼, 롤파이트(LOLFIGHT)! 길드전, 커스텀 매치 등 LoL 커뮤니티 기능 제공.",
    publisher: {
      "@type": "Organization",
      name: "롤파이트",
      url: "https://lolfight.kr",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: "https://lolfight.kr/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  });

  const getBreadcrumbSchema = (
    breadcrumbs: Array<{ name: string; url: string }>
  ) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `https://lolfight.kr${item.url}`,
    })),
  });

  const getSchema = () => {
    switch (type) {
      case "article":
        return data ? getArticleSchema(data as PostDto) : null;
      case "organization":
        return data ? getOrganizationSchema(data as GuildDto) : null;
      case "website":
        return getWebsiteSchema();
      case "breadcrumb":
        return breadcrumbs ? getBreadcrumbSchema(breadcrumbs) : null;
      default:
        return null;
    }
  };

  const schema = getSchema();

  if (!schema) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema, null, 2),
      }}
    />
  );
}

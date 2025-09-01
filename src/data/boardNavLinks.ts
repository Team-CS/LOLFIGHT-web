const baseRef = "/board";

const boardNavLinks = [
  { href: `${baseRef}/all`, title: "전체", slug: "all" },
  { href: `${baseRef}/notice`, title: "공지사항", slug: "notice" },
  { href: `${baseRef}/free`, title: "자유", slug: "free" },
  { href: `${baseRef}/fight`, title: "스크림", slug: "fight" },
  { href: `${baseRef}/rgm`, title: "길드원 모집", slug: "rgm" },
  { href: `${baseRef}/esports`, title: "e스포츠뉴스", slug: "esports" },
  { href: `${baseRef}/strategy`, title: "전략-공략", slug: "strategy" },
  { href: `${baseRef}/event`, title: "이벤트", slug: "event" },
];

export default boardNavLinks;

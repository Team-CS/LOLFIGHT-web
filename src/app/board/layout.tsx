import { Metadata } from "next";

export const metadata: Metadata = {
  title: "롤파이트-게시판 | LOLFIGHT - 롤 커뮤니티, 스크림 플랫폼",
  description:
    "롤파이트(LOLFIGHT) 게시판에서 롤 관련 정보를 공유하고 소통해보세요. 자유게시판, 싸움게시판, 길드원모집, 이벤트 등 다양한 롤 커뮤니티 기능을 제공합니다.",
  keywords: [
    "롤파이트",
    "LOLFIGHT",
    "롤 게시판",
    "롤 커뮤니티",
    "롤 자유게시판",
    "롤 싸움게시판",
    "롤 길드원모집",
    "롤 뉴스",
    "롤 전략",
    "롤 공략",
    "리그오브레전드 게시판",
    "롤 스크림",
  ],
  openGraph: {
    title: "롤파이트-게시판 | LOLFIGHT - 롤 커뮤니티, 스크림 플랫폼",
    description:
      "롤파이트(LOLFIGHT) 게시판에서 롤 관련 정보를 공유하고 소통해보세요.",
    url: "https://lolfight.kr/board",
    images: [
      {
        url: "https://lolfight.kr/LOLFIGHT_NONE_TEXT.png",
        width: 800,
        height: 600,
        alt: "롤파이트 게시판",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "롤파이트-게시판 | LOLFIGHT - 롤 커뮤니티, 스크림 플랫폼",
    description:
      "롤파이트(LOLFIGHT) 게시판에서 롤 관련 정보를 공유하고 소통해보세요.",
    images: ["https://lolfight.kr/LOLFIGHT_NONE_TEXT.png"],
  },
  alternates: {
    canonical: "https://lolfight.kr/board",
  },
};

export default function BoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

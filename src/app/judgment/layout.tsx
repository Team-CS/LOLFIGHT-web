import { Metadata } from "next";

export const metadata: Metadata = {
  title: "롤파이트-롤로세움 | LOLFIGHT - 롤 판정 게시판, 스크림 플랫폼",
  description:
    "롤로세움에서 롤 게임 관련 판정과 의견을 나누어보세요. 롤 커뮤니티의 다양한 의견을 확인할 수 있습니다. 리그오브레전드 판정, 롤 의견, LOLFIGHT 커뮤니티.",
  keywords: [
    "롤파이트",
    "LOLFIGHT",
    "롤로세움",
    "롤 판정",
    "롤 의견",
    "롤 커뮤니티",
    "롤문철",
    "리그오브레전드 판정",
    "롤 게임 판정",
    "롤 스크림",
  ],
  openGraph: {
    title: "롤파이트-롤로세움 | LOLFIGHT - 롤 판정 게시판, 스크림 플랫폼",
    description:
      "롤로세움에서 롤 게임 관련 판정과 의견을 나누어보세요. 롤 커뮤니티의 다양한 의견을 확인할 수 있습니다.",
    url: "https://lolfight.kr/judgment",
    images: [
      {
        url: "https://lolfight.kr/LOLFIGHT_NONE_TEXT.png",
        width: 800,
        height: 600,
        alt: "롤로세움",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "롤파이트-롤로세움 | LOLFIGHT - 롤 판정 게시판, 스크림 플랫폼",
    description: "롤로세움에서 롤 게임 관련 판정과 의견을 나누어보세요.",
    images: ["https://lolfight.kr/LOLFIGHT_NONE_TEXT.png"],
  },
  alternates: {
    canonical: "https://lolfight.kr/judgment",
  },
};

export default function JudgmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "롤파이트-리그 | LOLFIGHT - 롤 길드 대항전, 스크림 플랫폼",
  description:
    "롤파이트(LOLFIGHT) 리그에서 최고의 롤 길드들과 경쟁해보세요. 실시간 랭킹과 길드 정보를 확인할 수 있습니다. 리그오브레전드 길드전, 롤 대항전 플랫폼.",
  keywords: [
    "롤파이트",
    "LOLFIGHT",
    "롤 리그",
    "롤 길드",
    "롤 대항전",
    "리그오브레전드 리그",
    "롤 랭킹",
    "롤 길드전",
    "롤 스크림",
  ],
  openGraph: {
    title: "롤파이트-리그 | LOLFIGHT - 롤 길드 대항전, 스크림 플랫폼",
    description:
      "롤파이트(LOLFIGHT) 리그에서 최고의 롤 길드들과 경쟁해보세요. 실시간 랭킹과 길드 정보를 확인할 수 있습니다.",
    url: "https://lolfight.kr/league",
    images: [
      {
        url: "https://lolfight.kr/LOLFIGHT_NONE_TEXT.png",
        width: 800,
        height: 600,
        alt: "롤파이트 리그",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "롤파이트-리그 | LOLFIGHT - 롤 길드 대항전, 스크림 플랫폼",
    description: "롤파이트(LOLFIGHT) 리그에서 최고의 롤 길드들과 경쟁해보세요.",
    images: ["https://lolfight.kr/LOLFIGHT_NONE_TEXT.png"],
  },
  alternates: {
    canonical: "https://lolfight.kr/league",
  },
};

export default function LeagueLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

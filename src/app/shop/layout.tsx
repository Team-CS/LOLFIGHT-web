import { Metadata } from "next";

export const metadata: Metadata = {
  title: "롤파이트-상점 | LOLFIGHT - 롤파이트 아이템",
  description:
    "롤파이트(LOLFIGHT) 상점에서 특별한 배너, 테두리, 효과 등 다양한 롤파이트 아이템을 구매하고 내 캐릭터를 꾸며보세요.",
  keywords: [
    "롤파이트",
    "LOLFIGHT",
    "롤 상점",
    "롤 커스터마이징",
    "롤 배너",
    "롤 테두리",
    "롤 효과",
    "롤 아이템",
    "리그오브레전드 상점",
    "롤 장식",
    "롤 꾸미기",
  ],
  openGraph: {
    title: "롤파이트-상점 | LOLFIGHT - 롤파이트 아이템",
    description:
      "롤파이트(LOLFIGHT) 상점에서 특별한 배너, 테두리, 효과 등 다양한 롤파이트 아이템을 구매하고 내 캐릭터를 꾸며보세요.",
    url: "https://lolfight.kr/shop",
    images: [
      {
        url: "https://lolfight.kr/LOLFIGHT_NONE_TEXT.png",
        width: 800,
        height: 600,
        alt: "롤파이트 상점",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "롤파이트-상점 | LOLFIGHT - 롤 커스터마이징 아이템",
    description:
      "롤파이트(LOLFIGHT) 상점에서 특별한 배너, 테두리, 효과 등 다양한 롤파이트 아이템을 구매하고 내 캐릭터를 꾸며보세요.",
    images: ["https://lolfight.kr/LOLFIGHT_NONE_TEXT.png"],
  },
  alternates: {
    canonical: "https://lolfight.kr/shop",
  },
};

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

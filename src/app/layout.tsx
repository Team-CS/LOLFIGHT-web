import type { Metadata, Viewport } from "next";
import "../css/tailwind.css";
import BaseLayout from "./../layouts/BaseLayout";
import localFont from "next/font/local";
import { Providers } from "./providers";
import GoogleAnalytics from "../lib/GoogleAnalytics";
import GoogleAdSense from "../lib/GoogleAdSense";
import StructuredData from "../common/components/StructuredData";
import "@/src/css/index.ts";

export const metadata: Metadata = {
  metadataBase: new URL("https://lolfight.kr"),
  title: {
    default: "롤파이트 | LOLFIGHT - 롤 길드 대항전, 스크림 플랫폼",
    template: "%s | 롤파이트",
  },
  description:
    "롤파이트(LOLFIGHT)는 리그 오브 레전드(LoL) 유저들을 위한 스크림, 길드 대항전 커뮤니티 플랫폼입니다. 롤 커스텀 매치부터 길드전까지, 롤파이트에서 만나보세요!",
  keywords: [
    "롤파이트",
    "LOLFIGHT",
    "롤 스크림",
    "롤 커스텀",
    "롤 길드전",
    "리그오브레전드 내전",
    "롤 대회",
    "롤 유저 커뮤니티",
    "LOL 길드",
    "롤 판정",
    "롤 배팅",
    "롤 커뮤니티",
    "리그오브레전드 커뮤니티",
    "롤 팀 매칭",
  ],
  icons: {
    icon: "/LOLFIGHT_NONE_TEXT.ico",
  },
  other: {
    "google-adsense-account": "ca-pub-9861327972888599",
    "naver-site-verification": "4daab45dcb1a6c0d2ca0a0a6af3fa98575cce7a4",
  },
  verification: {
    google: "4TuSFIptJgyhAxtNwjEP3SKSVgMpvfm3_w43Zb3e91M",
  },
  openGraph: {
    title: "롤파이트 | LOLFIGHT - 롤 길드 대항전, 스크림 플랫폼",
    description:
      "리그 오브 레전드 스크림을 위한 최고의 플랫폼, 롤파이트(LOLFIGHT)! 길드전, 커스텀 매치 등 LoL 커뮤니티 기능 제공.",
    url: "https://lolfight.kr",
    type: "website",
    images: [
      {
        url: "https://lolfight.kr/LOLFIGHT_NONE_TEXT.png",
        width: 800,
        height: 600,
        alt: "롤파이트 LOLFIGHT",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "롤파이트 | LOLFIGHT - 롤 길드 대항전, 스크림 플랫폼",
    description:
      "리그 오브 레전드 스크림을 위한 최고의 플랫폼, 롤파이트(LOLFIGHT)!",
    images: ["https://lolfight.kr/LOLFIGHT_NONE_TEXT.png"],
  },
  alternates: {
    canonical: "https://lolfight.kr",
  },
  category: "Gaming Community",
  authors: [{ name: "롤파이트" }],
  creator: "롤파이트",
  publisher: "롤파이트",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const pretendard = localFont({
  src: "../fonts/PretendardVariable.ttf",
  display: "swap",
  variable: "--font-pretendard",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ko"
      className={`bg-brandbgcolor h-screen ${pretendard.className}`}
      suppressHydrationWarning
    >
      <head>
        <StructuredData type="website" />
      </head>
      <body className={`bg-[#FCFCFC] dark:bg-black`}>
        {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS ? (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS} />
        ) : null}
        <Providers>
          <BaseLayout>{children}</BaseLayout>
        </Providers>
      </body>
    </html>
  );
}

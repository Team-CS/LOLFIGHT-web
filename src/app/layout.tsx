import type { Metadata, Viewport } from "next";
import "../css/tailwind.css";
import BaseLayout from "./../layouts/BaseLayout";
import localFont from "next/font/local";

export const metadata: Metadata = {
  title: "LOL.FIGHT",
  description: "롤 내전/스크림은 LOLFIGHT - 롤 길드 대항전, 스크림, 내전",
  keywords: ["롤파이트", "LOLFIGHT", "내전", "스크림", "롤 커스텀", "길드전"],
  icons: {
    icon: "/icon-blue.ico",
  },
  other: {
    "google-adsense-account": "ca-pub-9861327972888599",
    "naver-site-verification": "4daab45dcb1a6c0d2ca0a0a6af3fa98575cce7a4",
  },
  verification: {
    google: "4TuSFIptJgyhAxtNwjEP3SKSVgMpvfm3_w43Zb3e91M",
  },
  openGraph: {
    title: "LOL.FIGHT - 롤 길드 대항전, 스크림, 내전",
    description: "롤 내전/스크림은 LOLFIGHT - 롤 길드 대항전, 스크림, 내전",
    url: "https://lolfight.kr", // 실제 사이트 URL로 변경
    type: "website",
    images: [
      {
        url: "https://lolfight.kr/api/public/image/icon-blue.png", // 실제 이미지 URL로 변경
        width: 800,
        height: 600,
        alt: "LOL.FIGHT",
      },
    ],
  },
};

const pretendard = localFont({
  src: "../fonts/PretendardVariable.ttf",
  display: "swap",
  variable: "--font-pretendard",
});

export const viewport: Viewport = {
  width: "1280",
  initialScale: 1.0,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`bg-brandbgcolor h-screen ${pretendard.className}`}
      suppressHydrationWarning
    >
      <body className={`bg-[#FCFCFC] dark:bg-black`}>
        <Providers>
          <BaseLayout>{children}</BaseLayout>
        </Providers>
      </body>
    </html>
  );
}

import { Providers } from "./providers";

import type { Metadata } from "next";
import localFont from "next/font/local";

export const metadata: Metadata = {
  title: "롤파이트 | LOLFIGHT - 로그인",
  description: "Create and join League of Legends tournaments.",
  icons: {
    icon: "/LOLFIGHT_NONE_TEXT.ico",
  },
};

const pretendard = localFont({
  src: "../../fonts/PretendardVariable.woff2",
  display: "swap",
  variable: "--font-pretendard",
});

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen px-[16px] ${pretendard.className} bg-brandbgcolor dark:bg-branddark`}
    >
      <div className="w-full max-w-[540px] bg-white dark:bg-branddark shadow-xl rounded-2xl border border-brandborder dark:border-branddarkborder p-[32px] flex flex-col gap-[24px]">
        {children}
      </div>
    </div>
  );
}

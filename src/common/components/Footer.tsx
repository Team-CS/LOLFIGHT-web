"use client";
import { useIsMobile } from "@/src/hooks/useMediaQuery";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const Footer = () => {
  const router = useRouter();
  const isMobile = useIsMobile();
  return (
    <footer className="w-full py-[32px] bg-gradient-to-t from-gray-50 to-white dark:from-dark dark:to-black border-t border-gray-100 dark:border-branddarkborder">
      <div
        className={`flex max-w-[1200px] mx-auto px-[16px] ${
          isMobile
            ? "flex-col items-center gap-[16px]"
            : "justify-between items-center"
        }`}
      >
        {/* 로고 및 정보 */}
        <div
          className={`flex items-center ${isMobile ? "flex-col gap-[12px]" : "gap-[20px]"}`}
        >
          <div
            className="flex items-center gap-[10px] cursor-pointer group"
            onClick={() => router.push("/")}
          >
            <Image
              src={"/LOLFIGHT_NONE_TEXT.png"}
              alt="logo"
              width={50}
              height={50}
              className={`${isMobile ? "w-[36px] h-[36px]" : "w-[44px] h-[44px]"} group-hover:scale-105 transition-transform`}
            />
            <span
              className={`font-bold text-gray-700 dark:text-gray-200 ${isMobile ? "text-[16px]" : "text-[18px]"}`}
            >
              LOLFIGHT
            </span>
          </div>

          <div className="w-[1px] h-[24px] bg-gray-200 dark:bg-branddarkborder hidden md:block" />

          <div
            className={`flex flex-col ${
              isMobile ? "text-[10px] items-center" : "text-[12px]"
            } text-gray-500 dark:text-gray-400`}
          >
            <div className="flex gap-[8px]">
              <a
                className="hover:text-brandcolor transition-colors"
                href={"/policies/agreement"}
              >
                이용약관
              </a>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <a
                className="hover:text-brandcolor transition-colors font-semibold"
                href={"/policies/privacy"}
              >
                개인정보처리방침
              </a>
            </div>
            <p className="mt-[4px]">
              Copyright{" "}
              <span className="font-semibold text-gray-600 dark:text-gray-300">
                ©LOLFIGHT
              </span>{" "}
              All rights reserved.
            </p>
          </div>
        </div>

        {/* 소셜 링크 */}
        <a
          href="https://discord.gg/cgfRmWWM7c"
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-[8px] px-[16px] py-[8px] rounded-[10px] bg-[#5865F2] hover:bg-[#4752C4] transition-colors cursor-pointer shadow-sm ${
            isMobile ? "mt-[8px]" : ""
          }`}
        >
          <Image
            src="/discord.svg"
            alt="discord icon"
            width={18}
            height={18}
            draggable={false}
            className="brightness-0 invert"
          />
          <span
            className={`font-semibold text-white ${isMobile ? "text-[11px]" : "text-[13px]"}`}
          >
            Discord
          </span>
        </a>
      </div>
    </footer>
  );
};

export default Footer;

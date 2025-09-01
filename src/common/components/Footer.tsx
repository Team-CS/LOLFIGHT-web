"use client";
import { useIsMobile } from "@/src/hooks/useMediaQuery";
import { useRouter } from "next/navigation";
import React from "react";

const Footer = () => {
  const router = useRouter();
  const isMobile = useIsMobile();
  return (
    <footer className="flex w-full py-[24px]">
      <div
        className={`flex max-w-[1200px] mx-auto justify-center items-center ${
          isMobile ? "gap-[12px]" : "gap-[18px]"
        }`}
      >
        <img
          onClick={() => router.push("/")}
          width={isMobile ? 30 : 50}
          height={isMobile ? 30 : 50}
          src={"/LOLFIGHT_NONE_TEXT.png"}
          alt="light logo"
        />
        <div
          className={`flex flex-col flex ${
            isMobile ? "text-[10px]" : "text-[12px]"
          } font-normal items-center`}
        >
          <div className="flex gap-[4px]">
            <a
              className="hover:text-[#757575] hoverable"
              href={"/policies/agreement"}
            >
              이용약관
            </a>
            <p> · </p>
            <a
              className="hover:text-[#757575] hoverable"
              href={"/policies/privacy"}
            >
              개인정보처리방침
            </a>
          </div>
          <div className="items-center justify-between sm:flex">
            <p>
              Copyright <span className="font-bold">©LOLFIGHT</span> All rights
              reserved.
            </p>
          </div>
        </div>
        <a
          href="https://discord.gg/cgfRmWWM7c"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center font-bold text-[12px] gap-[8px] text-brandcolor hover:text-primary transition-colors cursor-pointer"
        >
          <img
            src="/discord.svg"
            alt="discord icon"
            width={20}
            height={20}
            draggable={false}
          />
        </a>
      </div>
    </footer>
  );
};

export default Footer;

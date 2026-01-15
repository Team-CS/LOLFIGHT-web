"use client";

import { useState } from "react";
import { useIsMobile } from "@/src/hooks/useMediaQuery";
import GuildGuide, { guildToc } from "./components/guild";
import ProfileGuide, { profileToc } from "./components/profile";
import ScrimGuide, { scrimToc } from "./components/scrim";

/* 좌측 메뉴 */
const GUIDE_MENU = [
  { key: "profile", title: "프로필 설정 가이드" },
  { key: "guild", title: "길드 가이드" },
  { key: "scrim", title: "스크림 가이드" },
] as const;

/* 메인 페이지가 아는 유일한 매핑 */
const GUIDE_MAP = {
  profile: {
    title: "프로필 가이드",
    Component: ProfileGuide,
    toc: profileToc,
  },
  guild: {
    title: "길드 가이드",
    Component: GuildGuide,
    toc: guildToc,
  },
  scrim: {
    title: "스크림 가이드",
    Component: ScrimGuide,
    toc: scrimToc,
  },
};

type GuideKey = keyof typeof GUIDE_MAP;

export default function GuidePage() {
  const [currentGuide, setCurrentGuide] = useState<GuideKey>("profile");
  const isMobile = useIsMobile();

  const current = GUIDE_MAP[currentGuide];
  const GuideComponent = current.Component;

  return (
    <div className="flex flex-col max-w-[1200px] w-full h-full mx-auto py-[28px] px-[20px] gap-[24px]">
      <div className="flex flex-col lg:flex-row w-full gap-[24px]">
        {/* 좌측 네비 */}
        <aside className="w-full lg:w-[200px] h-fit bg-white dark:bg-dark rounded-[12px] shadow-md border border-brandborder dark:border-branddarkborder overflow-hidden">
          <div className="py-[16px] px-[24px] border-b border-brandborder dark:border-branddarkborder">
            <h2
              className={`font-bold ${
                isMobile ? "text-[16px]" : "text-[18px]"
              } text-gray-800 dark:text-gray-200`}
            >
              이용 가이드
            </h2>
          </div>

          <ul className="p-[12px] flex lg:flex-col gap-[8px] overflow-x-auto lg:overflow-visible">
            {GUIDE_MENU.map((menu) => (
              <li key={menu.key} className="flex-shrink-0 w-full max-w-[200px]">
                <button
                  onClick={() => setCurrentGuide(menu.key)}
                  className={`w-full text-left px-[16px] py-[10px] rounded-[8px]
                    ${isMobile ? "text-[13px]" : "text-[14px]"}
                    ${
                      currentGuide === menu.key
                        ? "bg-brandcolor text-white font-bold"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-black"
                    }`}
                >
                  {menu.title}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* 중앙 콘텐츠 */}
        <main className="flex-1 bg-white dark:bg-dark rounded-[12px] shadow-md border border-brandborder dark:border-branddarkborder flex flex-col">
          <div className="py-[16px] px-[24px] border-b border-brandborder dark:border-branddarkborder">
            <h1
              className={`font-bold text-brandcolor ${
                isMobile ? "text-[18px]" : "text-[22px]"
              }`}
            >
              {current.title}
            </h1>
          </div>

          <div className="p-[24px] flex flex-col gap-[32px]">
            <GuideComponent isMobile={isMobile} />
          </div>
        </main>

        {/* 우측 목차 */}
        {!isMobile && (
          <aside className="w-[180px] h-fit sticky top-[28px] hidden lg:block">
            <div className="pl-[16px] border-l-[2px] border-brandborder dark:border-branddarkborder">
              <p className="text-[12px] font-bold text-gray-400 mb-[12px] uppercase">
                On this page
              </p>
              <ul className="flex flex-col gap-[10px]">
                {current.toc.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="text-[13px] text-gray-500 hover:text-brandcolor transition-colors"
                    >
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

"use client";

import constant from "@/src/common/constant/constant";
import { useIsMobile } from "@/src/hooks/useMediaQuery";
import {
  convertLineToEnglish,
  getTierStyle,
} from "@/src/utils/string/string.util";
import Image from "next/image";

interface SummonerInfoCardProps {
  name: string;
  line: string;
  tier: string;
  championId: string;
  align: "left" | "right";
}

export const SummonerInfoCard = (props: SummonerInfoCardProps) => {
  const isMobile = useIsMobile();
  const { name, line, tier, championId, align } = props;
  return (
    <div
      className={`flex items-center ${
        align === "left" ? "flex-row-reverse" : "flex-row"
      }  ${isMobile ? "flex-col gap-[8px]" : "gap-[20px]"}`}
    >
      <div className="flex items-end gap-[4px] relative">
        {championId && (
          <div className="relative">
            <Image
              src={`${constant.SERVER_URL}/public/champions/${championId}.png`}
              alt="champion"
              width={70}
              height={70}
              className={`rounded-[14px] shadow-md border-2 border-white dark:border-branddarkborder ${
                isMobile ? "w-[50px] h-[50px]" : "w-[75px] h-[75px]"
              }`}
            />
            {isMobile && (
              <Image
                src={`${
                  constant.SERVER_URL
                }/public/ranked-positions/${convertLineToEnglish(line)}.png`}
                alt="line"
                width={24}
                height={24}
                className="absolute -bottom-[4px] -right-[4px] w-[24px] h-[24px] rounded-full bg-white dark:bg-dark shadow-sm"
              />
            )}
          </div>
        )}
      </div>
      <div
        className={`flex flex-col gap-[6px] ${
          isMobile ? "w-full items-center" : "w-[240px]"
        }`}
      >
        <div
          className={`flex ${isMobile ? "justify-center" : "justify-between"}`}
        >
          {!isMobile && (
            <span className="text-gray-500 dark:text-gray-400 text-[13px]">소환사명</span>
          )}
          <span
            className={`font-semibold ${
              isMobile ? "text-[11px]" : "text-[14px]"
            }`}
          >
            {name}
          </span>
        </div>

        {!isMobile && (
          <div className="flex justify-between items-center">
            <span className="text-gray-500 dark:text-gray-400 text-[13px]">라인</span>
            <div className="flex items-center gap-[6px]">
              <Image
                src={`${
                  constant.SERVER_URL
                }/public/ranked-positions/${convertLineToEnglish(line)}.png`}
                alt="line"
                width={20}
                height={20}
                className="w-[20px] h-[20px]"
              />
              <span className="font-semibold text-[14px]">
                {line}
              </span>
            </div>
          </div>
        )}

        <div
          className={`flex ${isMobile ? "justify-center" : "justify-between"} items-center`}
        >
          {!isMobile && (
            <span className="text-gray-500 dark:text-gray-400 text-[13px]">티어</span>
          )}
          <div
            className={`flex items-center gap-[6px] font-bold ${getTierStyle(
              tier
            )} ${isMobile ? "text-[11px]" : "text-[14px]"}`}
          >
            {tier && (
              <Image
                src={`${constant.SERVER_URL}/public/rank/${
                  tier.split(" ")[0]
                }.png`}
                alt="tier"
                width={24}
                height={24}
                className={`${
                  isMobile ? "w-[18px] h-[18px]" : "w-[24px] h-[24px]"
                }`}
              />
            )}
            {tier}
          </div>
        </div>
      </div>
    </div>
  );
};

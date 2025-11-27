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
      }  ${isMobile ? "flex-col gap-[12px]" : "gap-[24px]"}`}
    >
      <div className="flex items-end gap-[4px]">
        {championId && (
          <Image
            src={`${constant.SERVER_URL}/public/champions/${championId}.png`}
            alt="champion"
            width={70}
            height={70}
            className={`rounded-[12px] ${
              isMobile ? "w-[45px] h-[45px]" : "w-[70px] h-[70px]"
            }`}
          />
        )}

        {isMobile && (
          <Image
            src={`${
              constant.SERVER_URL
            }/public/ranked-positions/${convertLineToEnglish(line)}.png`}
            alt="champion"
            width={30}
            height={30}
            className={`rounded-[12px] w-[30px] h-[30px] items-end`}
          />
        )}
      </div>
      <div
        className={`flex flex-col text-[14px] gap-[4px] ${
          isMobile ? "w-full" : "w-[260px]"
        }`}
      >
        <div
          className={`flex  ${isMobile ? "justify-center" : "justify-between"}`}
        >
          {!isMobile && (
            <span className="text-gray-600 dark:text-gray-400">소환사명:</span>
          )}
          <span
            className={`font-medium ${
              isMobile ? "text-[12px]" : "text-[14px]"
            }`}
          >
            {name}
          </span>
        </div>

        {!isMobile && (
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">라인:</span>
            <span
              className={`font-bold ${
                isMobile ? "text-[12px]" : "text-[14px]"
              }`}
            >
              {line}
            </span>
          </div>
        )}

        <div
          className={`flex  ${isMobile ? "justify-center" : "justify-between"}`}
        >
          {!isMobile && (
            <span className="text-gray-600 dark:text-gray-400">티어:</span>
          )}
          <div
            className={`flex items-center gap-[4px] font-bold ${getTierStyle(
              tier
            )} ${isMobile ? "text-[12px]" : "text-[14px]"}`}
          >
            {tier}
            {tier && (
              <Image
                src={`${constant.SERVER_URL}/public/rank/${
                  tier.split(" ")[0]
                }.png`}
                alt="tier"
                width={24}
                height={24}
                className={`${
                  isMobile ? "w-[20px] h-[20px]" : "w-[24px] h-[24px]"
                }`}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

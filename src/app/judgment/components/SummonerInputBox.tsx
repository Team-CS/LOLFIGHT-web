"use client";

import constant from "@/src/common/constant/constant";
import { Summoner } from "@/src/common/types/judgment.type";
import { useIsMobile } from "@/src/hooks/useMediaQuery";
import Image from "next/image";
import React from "react";

interface SummonerInputBoxProps {
  side: "left" | "right";
  selectedChampionId: string;
  onChampionClick: () => void;
  onChange: (field: keyof Summoner, value: string) => void;
}

export default function SummonerInputBox({
  side,
  selectedChampionId,
  onChampionClick,
  onChange,
}: SummonerInputBoxProps) {
  const isMobile = useIsMobile();

  const championImageSection = (bgColor: string) => (
    <div
      className={`flex items-center justify-center ${bgColor} ${
        isMobile ? "py-[14px]" : "min-w-[110px]"
      }`}
    >
      <div className="relative">
        <Image
          src={`${constant.SERVER_URL}/public/champions/${selectedChampionId}.png`}
          alt="Champion Icon"
          width={72}
          height={72}
          className={`${
            isMobile ? "w-[56px] h-[56px]" : "w-[76px] h-[76px]"
          } rounded-[14px] cursor-pointer border-2 border-white/50 shadow-md hover:scale-105 transition-transform`}
          onClick={onChampionClick}
        />
        <div className="absolute -bottom-1 -right-1 w-[22px] h-[22px] bg-white dark:bg-dark rounded-full flex items-center justify-center shadow-sm">
          <span className="text-[10px]">+</span>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={`flex rounded-[14px] border border-gray-200 dark:border-branddarkborder bg-white dark:bg-dark shadow-md overflow-hidden ${
        isMobile ? "flex-col w-full" : "w-[440px]"
      }`}
    >
      {side === "left" && championImageSection("bg-gradient-to-br from-blue-400 to-blue-500")}

      {side === "right" && isMobile && championImageSection("bg-gradient-to-br from-red-400 to-red-500")}

      <div className="flex flex-col justify-center gap-[10px] px-[14px] py-[14px] w-full bg-gray-50 dark:bg-branddark">
        <div className="flex flex-col gap-[4px]">
          <label
            className={`text-gray-500 dark:text-gray-400 font-medium ${
              isMobile ? "text-[11px]" : "text-[12px]"
            }`}
          >
            소환사명
          </label>
          <input
            type="text"
            placeholder="LOLFIGHT#KR1"
            className={`w-full px-[10px] py-[8px] rounded-[8px] border border-gray-200 dark:border-branddarkborder bg-white dark:bg-dark focus:outline-none focus:border-red-400 transition-colors ${
              isMobile ? "text-[12px]" : "text-[13px]"
            }`}
            onChange={(e) => onChange("name", e.target.value)}
          />
        </div>

        <div className={`flex gap-[8px] ${isMobile && "flex-col"}`}>
          <div className={`flex flex-col gap-[4px] ${isMobile ? "w-full" : "w-[50%]"}`}>
            <label
              className={`text-gray-500 dark:text-gray-400 font-medium ${
                isMobile ? "text-[11px]" : "text-[12px]"
              }`}
            >
              라인
            </label>
            <select
              className={`px-[10px] py-[8px] rounded-[8px] border border-gray-200 dark:border-branddarkborder bg-white dark:bg-dark focus:outline-none focus:border-red-400 transition-colors ${
                isMobile ? "text-[12px]" : "text-[13px]"
              }`}
              defaultValue=""
              onChange={(e) => onChange("line", e.target.value)}
            >
              <option value="" disabled hidden>
                선택
              </option>
              <option value="탑">탑</option>
              <option value="정글">정글</option>
              <option value="미드">미드</option>
              <option value="원딜">원딜</option>
              <option value="서폿">서폿</option>
            </select>
          </div>

          <div className={`flex flex-col gap-[4px] ${isMobile ? "w-full" : "w-[50%]"}`}>
            <label
              className={`text-gray-500 dark:text-gray-400 font-medium ${
                isMobile ? "text-[11px]" : "text-[12px]"
              }`}
            >
              티어
            </label>
            <select
              className={`px-[10px] py-[8px] rounded-[8px] border border-gray-200 dark:border-branddarkborder bg-white dark:bg-dark focus:outline-none focus:border-red-400 transition-colors ${
                isMobile ? "text-[12px]" : "text-[13px]"
              }`}
              defaultValue=""
              onChange={(e) => onChange("tier", e.target.value)}
            >
              <option value="" disabled hidden>
                선택
              </option>
              {[
                "IRON",
                "BRONZE",
                "SILVER",
                "GOLD",
                "PLATINUM",
                "EMERALD",
                "DIAMOND",
              ].flatMap((tier) =>
                ["I", "II", "III", "IV"].map((div) => (
                  <option
                    key={`${tier} ${div}`}
                    value={`${tier} ${div}`}
                  >{`${tier} ${div}`}</option>
                ))
              )}
              <option value="MASTER">MASTER</option>
              <option value="GRANDMASTER">GRANDMASTER</option>
              <option value="CHALLENGER">CHALLENGER</option>
            </select>
          </div>
        </div>
      </div>

      {side === "right" && !isMobile && championImageSection("bg-gradient-to-br from-red-400 to-red-500")}
    </div>
  );
}

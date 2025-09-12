"use client";

import constant from "@/src/common/constant/constant";
import { Summoner } from "@/src/common/types/judgment.type";
import { useIsMobile } from "@/src/hooks/useMediaQuery";
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

  return (
    <div
      className={`flex rounded-[16px] border border-brandborder dark:border-branddarkborder bg-brandbgcolor dark:bg-branddark shadow-md overflow-hidden ${
        isMobile ? "flex-col" : "w-[460px]"
      }`}
    >
      {side === "left" && (
        <div
          className={`flex items-center justify-center bg-blue-300 ${
            isMobile ? "py-[12px]" : "min-w-[100px]"
          }`}
        >
          <img
            src={`${constant.SERVER_URL}/public/champions/${selectedChampionId}.png`}
            alt="Champion Icon"
            width={isMobile ? 52 : 72}
            height={isMobile ? 52 : 72}
            className="rounded-full cursor-pointer hover:ring-[2px] hover:ring-brandcolor"
            onClick={onChampionClick}
          />
        </div>
      )}

      {side === "right" && isMobile && (
        <div
          className={`flex items-center justify-center bg-red-300 ${
            isMobile ? "py-[12px]" : "min-w-[100px]"
          }`}
        >
          <img
            src={`${constant.SERVER_URL}/public/champions/${selectedChampionId}.png`}
            alt="Champion Icon"
            className="rounded-full cursor-pointer hover:ring-[2px] hover:ring-brandcolor"
            onClick={onChampionClick}
          />
        </div>
      )}

      <div className="flex flex-col justify-center gap-[10px] px-[16px] py-[12px] w-full">
        <div className="flex flex-col gap-[6px]">
          <label
            className={`text-brandgray dark:text-brandhover font-medium ${
              isMobile ? "text-[12px]" : "text-[14px]"
            }`}
          >
            소환사명
          </label>
          <input
            type="text"
            placeholder="LOLFIGHT#KR1"
            className={`w-full px-[8px] py-[6px] rounded-[8px] border border-brandborder dark:border-branddarkborder bg-white dark:bg-brandgray text-brandgray dark:text-white focus:outline-none focus:ring-[2px] focus:ring-brandcolor ${
              isMobile ? "text-[12px]" : "text-[14px]"
            }`}
            onChange={(e) => onChange("name", e.target.value)}
          />
        </div>

        <div className={`flex gap-[8px] ${isMobile && "flex-col"}`}>
          <div className={`flex flex-col ${isMobile ? "w-full" : "w-[50%]"}`}>
            <label
              className={`text-brandgray dark:text-brandhover font-medium ${
                isMobile ? "text-[12px]" : "text-[14px]"
              }`}
            >
              라인
            </label>
            <select
              className={`px-[8px] py-[6px] rounded-[8px] border border-brandborder dark:border-branddarkborder bg-white dark:bg-brandgray text-brandgray dark:text-white focus:outline-none focus:ring-[2px] focus:ring-brandcolor ${
                isMobile ? "text-[12px]" : "text-[14px]"
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

          <div className={`flex flex-col ${isMobile ? "w-full" : "w-[50%]"}`}>
            <label
              className={`text-brandgray dark:text-brandhover font-medium ${
                isMobile ? "text-[12px]" : "text-[14px]"
              }`}
            >
              티어
            </label>
            <select
              className={`px-[8px] py-[6px] rounded-[8px] border border-brandborder dark:border-branddarkborder bg-white dark:bg-brandgray text-brandgray dark:text-white focus:outline-none focus:ring-[2px] focus:ring-brandcolor ${
                isMobile ? "text-[12px]" : "text-[14px]"
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

      {side === "right" && !isMobile && (
        <div className="flex items-center justify-center w-[130px] bg-red-300">
          <img
            src={`${constant.SERVER_URL}/public/champions/${selectedChampionId}.png`}
            alt="Champion Icon"
            className="rounded-full cursor-pointer w-[72px] h-[72px] hover:ring-[2px] hover:ring-brandcolor"
            onClick={onChampionClick}
          />
        </div>
      )}
    </div>
  );
}

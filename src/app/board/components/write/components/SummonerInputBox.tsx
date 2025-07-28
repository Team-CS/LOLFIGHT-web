"use client";

import constant from "@/src/common/constant/constant";
import { Summoner } from "@/src/common/types/judgment.type";
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
  return (
    <div className="flex w-[460px] h-[160px] rounded-[16px] border border-brandborder dark:border-branddarkborder bg-brandbgcolor dark:bg-branddark shadow-md overflow-hidden">
      {side === "left" && (
        <div className="flex items-center justify-center w-[130px] bg-blue-300">
          <img
            src={`${constant.SERVER_URL}/public/champions/${selectedChampionId}.png`}
            alt="Champion Icon"
            className="rounded-full cursor-pointer w-[72px] h-[72px] hover:ring-[2px] hover:ring-brandcolor"
            onClick={onChampionClick}
          />
        </div>
      )}

      <div className="flex flex-col justify-center gap-[10px] px-[16px] py-[12px] w-full">
        <div className="flex flex-col gap-[6px]">
          <label className="text-[14px] text-brandgray dark:text-brandhover font-medium">
            소환사명
          </label>
          <input
            type="text"
            placeholder="LOLFIGHT#KR1"
            className="w-full text-[14px] px-[8px] py-[6px] rounded-[8px] border border-brandborder dark:border-branddarkborder bg-white dark:bg-brandgray text-brandgray dark:text-white focus:outline-none focus:ring-[2px] focus:ring-brandcolor"
            onChange={(e) => onChange("name", e.target.value)}
          />
        </div>

        <div className="flex gap-[8px]">
          <div className="flex flex-col w-1/2">
            <label className="text-[14px] text-brandgray dark:text-brandhover font-medium">
              라인
            </label>
            <select
              className="px-[8px] py-[6px] rounded-[8px] border border-brandborder dark:border-branddarkborder bg-white dark:bg-brandgray text-brandgray dark:text-white focus:outline-none focus:ring-[2px] focus:ring-brandcolor"
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

          <div className="flex flex-col w-1/2">
            <label className="text-[14px] text-brandgray dark:text-brandhover font-medium">
              티어
            </label>
            <select
              className="px-[8px] py-[6px] rounded-[8px] border border-brandborder dark:border-branddarkborder bg-white dark:bg-brandgray text-brandgray dark:text-white focus:outline-none focus:ring-[2px] focus:ring-brandcolor"
              defaultValue=""
              onChange={(e) => onChange("tier", e.target.value)}
            >
              <option value="" disabled hidden>
                선택
              </option>
              {[
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

      {side === "right" && (
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

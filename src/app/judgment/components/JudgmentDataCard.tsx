"use client";

import { JudgmentDto } from "@/src/common/DTOs/judgment/judgment.dto";
import Image from "next/image";
import constant from "@/src/common/constant/constant";
import { SummonerInfoCard } from "./SummonerInfoCard";

interface Props {
  judgment: JudgmentDto;
}

const JudgmentDataCard = ({ judgment }: Props) => {
  const leftVoteCount = (judgment?.votes ?? []).filter(
    (v) => v.voteSide === "left"
  ).length;

  const rightVoteCount = (judgment?.votes ?? []).filter(
    (v) => v.voteSide === "right"
  ).length;

  const totalVoteCount = leftVoteCount + rightVoteCount;

  const leftPercent =
    totalVoteCount === 0 ? 50 : (leftVoteCount / totalVoteCount) * 100;
  const rightPercent = 100 - leftPercent;

  return (
    <div
      className="w-full flex items-center justify-between p-[16px] rounded-[12px] shadow-sm border border-brandborder dark:border-branddarkborder"
      style={{
        background: `linear-gradient(to right, rgba(59, 130, 246, 1) 0%, rgba(59, 130, 246, 0) ${leftPercent}%, rgba(239, 68, 68, 0) ${leftPercent}%, rgba(239, 68, 68, 1) 100%)`,
      }}
    >
      {/* 퍼센트 좌 */}
      <div className="text-[28px] font-bold text-white drop-shadow-md">
        {leftPercent.toFixed(0)}%
      </div>

      {/* 좌측 정보 */}
      <SummonerInfoCard
        name={judgment?.judgmentLeftName}
        line={judgment?.judgmentLeftLine}
        tier={judgment?.judgmentLeftTier}
        championId={judgment?.judgmentLeftChampion}
        align="right"
      />

      <div className="text-[18px] font-bold text-brandgray dark:text-brandhover">
        VS
      </div>

      {/* 우측 정보 */}
      <SummonerInfoCard
        name={judgment?.judgmentRightName}
        line={judgment?.judgmentRightLine}
        tier={judgment?.judgmentRightTier}
        championId={judgment?.judgmentRightChampion}
        align="left"
      />

      {/* 퍼센트 우 */}
      <div className="text-[28px] font-bold text-white drop-shadow-md">
        {rightPercent.toFixed(0)}%
      </div>
    </div>
  );
};

export default JudgmentDataCard;

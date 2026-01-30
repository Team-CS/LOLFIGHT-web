"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { JudgmentDto } from "@/src/common/DTOs/judgment/judgment.dto";
import JudgmentDataCard from "./JudgmentDataCard";
import { useIsMobile } from "@/src/hooks/useMediaQuery";

interface Props {
  judgment: JudgmentDto;
}
const JudgmentBox = ({ judgment }: Props) => {
  const router = useRouter();
  const isMobile = useIsMobile();

  const leftVoteCount = judgment.votes.filter(
    (v) => v.voteSide === "left"
  ).length;
  const rightVoteCount = judgment.votes.filter(
    (v) => v.voteSide === "right"
  ).length;
  const totalVoteCount = leftVoteCount + rightVoteCount;
  const leftPercent =
    totalVoteCount === 0 ? 50 : (leftVoteCount / totalVoteCount) * 100;

  const judgmentDateTime = new Date(judgment.createdAt!);
  const year = judgmentDateTime.getFullYear();
  const month = (judgmentDateTime.getMonth() + 1).toString().padStart(2, "0");
  const day = judgmentDateTime.getDate().toString().padStart(2, "0");

  const handleClickJudgment = () => {
    router.push(`/judgment/${judgment.id}`);
  };

  return (
    <div
      className="flex flex-col rounded-[14px] shadow-md p-[16px] md:p-[20px] gap-[14px] border border-gray-100 dark:border-branddarkborder bg-white dark:bg-dark hover:border-red-300 dark:hover:border-red-400 hover:shadow-lg cursor-pointer transition-all duration-200"
      onClick={handleClickJudgment}
    >
      <div className="flex items-center justify-between gap-[12px]">
        <div className="flex items-center gap-[10px] flex-1 min-w-0">
          <div className="w-[3px] h-[18px] bg-gradient-to-b from-red-500 to-orange-400 rounded-full flex-shrink-0" />
          <p className={`font-bold truncate ${isMobile ? "text-[14px]" : "text-[18px]"}`}>
            {judgment.judgmentTitle}
          </p>
        </div>
        <div className="flex items-center gap-[6px] md:gap-[12px] flex-shrink-0">
          <span
            className={`text-gray-400 ${
              isMobile ? "text-[10px]" : "text-[12px]"
            }`}
          >{`${year}.${month}.${day}`}</span>
          <div className="flex items-center gap-[4px]">
            <span className={`text-gray-500 dark:text-gray-400 ${isMobile ? "text-[10px]" : "text-[12px]"}`}>
              {judgment.judgmentView}
            </span>
            <span className={`text-gray-400 ${isMobile ? "text-[9px]" : "text-[11px]"}`}>조회</span>
          </div>
          <div className={`flex items-center gap-[4px] px-[8px] py-[2px] rounded-full bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 ${isMobile ? "text-[10px]" : "text-[12px]"}`}>
            <span className="font-semibold text-red-500 dark:text-red-400">{totalVoteCount}</span>
            <span className="text-gray-500 dark:text-gray-400">투표</span>
          </div>
        </div>
      </div>

      <JudgmentDataCard judgment={judgment} />
    </div>
  );
};

export default JudgmentBox;

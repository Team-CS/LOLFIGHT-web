"use client";

import { useRouter } from "next/navigation";
import React from "react";
import Image from "next/image";
import constant from "@/src/common/constant/constant";
import { JudgmentDto } from "@/src/common/DTOs/judgment/judgment.dto";
import JudgmentDataCard from "./JudgmentDataCard";

interface Props {
  judgment: JudgmentDto;
}
const JudgmentBox = ({ judgment }: Props) => {
  const router = useRouter();

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
      className="flex flex-col rounded-[12px] shadow-md p-[20px] gap-[12px] border dark:border-gray-500 hover:border-brandcolor "
      onClick={handleClickJudgment}
    >
      <div className="flex items-center justify-between ">
        <p className="font-bold text-[20px]">{judgment.judgmentTitle}</p>
        <div className="flex items-center justify-center text-[14px] font-normal gap-[8px]">
          <p className="text-[12px] text-gray-400">{`${year}.${month}.${day}`}</p>
          <p className="text-[12px] text-gray-400">
            조회수: {judgment.judgmentView}
          </p>
          <p className="text-[12px] text-gray-400">투표수: {totalVoteCount}</p>
        </div>
      </div>

      <JudgmentDataCard judgment={judgment} />
    </div>
  );
};

export default JudgmentBox;

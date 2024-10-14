"use client";

import { useRouter } from "next/navigation";
import React from "react";
import Image from "next/image";
import constant from "@/src/common/constant/constant";
import { JudgmentDTO } from "@/src/common/DTOs/judgment/judgment.dto";
import JudgmentDataCard from "./JudgmentDataCard";

interface Props {
  judgment: JudgmentDTO;
}
const JudgmentBox = (props: Props) => {
  const router = useRouter();
  const totalLike =
    props.judgment.judgmentLeftLike + props.judgment.judgmentRightLike;
  const leftpercent =
    totalLike === 0 ? 50 : (props.judgment.judgmentLeftLike / totalLike) * 100;

  const handleClickJudgment = () => {
    router.push(`/judgment/${props.judgment.id}`);
  };

  const getDate = (date: string | number | Date) => {
    const today = new Date();
    const postDateTime = new Date(date);

    if (
      postDateTime.getDate() === today.getDate() &&
      postDateTime.getMonth() === today.getMonth() &&
      postDateTime.getFullYear() === today.getFullYear()
    ) {
      const hour = postDateTime.getHours().toString().padStart(2, "0");
      const minute = postDateTime.getMinutes().toString().padStart(2, "0");
      return `${hour}:${minute}`;
    } else {
      const year = postDateTime.getFullYear().toString().padStart(2, "0");
      const month = (postDateTime.getMonth() + 1).toString().padStart(2, "0");
      const day = postDateTime.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
  };

  return (
    <div
      className="judgment_box flex-col border dark:border-gray-500 hover:border-brandcolor rounded-lg shadow-lg p-[20px]"
      onClick={handleClickJudgment}
    >
      <div className="judgment_title flex items-center justify-between mb-10">
        <p className="font-bold text-[20px]">{props.judgment.judgmentTitle}</p>
        <div className="flex items-end text-sm font-normal gap-3">
          <p>작성일: {getDate(props.judgment.createdAt!)}</p>
          <span className="text-gray-300">|</span>
          <p>조회수: {props.judgment.judgmentView}</p>
          <span className="text-gray-300">|</span>
          <p>
            투표수:
            {props.judgment.judgmentLeftLike + props.judgment.judgmentRightLike}
          </p>
          <span className="text-gray-300">|</span>
          <div className="flex items-end gap-1">
            작성자:
            <Image
              className="rounded-full"
              width={25}
              height={25}
              src={`${constant.SERVER_URL}/public/member/${props.judgment.judgmentWriter}.png`}
              alt="light logo"
            />
            {props.judgment.judgmentWriter}
          </div>
        </div>
      </div>

      <JudgmentDataCard judgment={props.judgment} />
    </div>
  );
};

export default JudgmentBox;

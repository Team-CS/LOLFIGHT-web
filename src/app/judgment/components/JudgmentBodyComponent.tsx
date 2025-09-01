"use client";

import React from "react";
import { useRouter } from "next/navigation";
import CustomAlert from "@/src/common/components/alert/CustomAlert";
import { JudgmentDto } from "@/src/common/DTOs/judgment/judgment.dto";
import JudgmentDataCard from "./JudgmentDataCard";
import constant from "@/src/common/constant/constant";
import { voteFactionJudgment } from "@/src/api/judgment.api";
import { useMemberStore } from "@/src/common/zustand/member.zustand";
import { SectionCard } from "./SectionCard";
import { useIsMobile } from "@/src/hooks/useMediaQuery";

interface JudgmentBodyComponentProp {
  judgment: JudgmentDto | null | undefined;
}

const JudgmentBodyComponent = (props: JudgmentBodyComponentProp) => {
  const { judgment } = props;
  const isMobile = useIsMobile();
  const { member } = useMemberStore();

  const votes = judgment?.votes ?? [];

  const hasVoted =
    member && votes.length > 0
      ? votes.some((vote) => vote.member?.id === member.id)
      : false;

  const handleFactionVoteClick = (side: string) => {
    if (!member) {
      CustomAlert("info", "투표", "로그인이 필요합니다");
      return;
    }
    if (hasVoted) {
      CustomAlert("info", "투표", "이미 투표하셨습니다.");
      return;
    }

    if (!judgment?.id) {
      CustomAlert("error", "투표", "잘못된 요청입니다.");
      return;
    }

    voteFactionJudgment(side, judgment.id, member.id)
      .then(() => {
        CustomAlert("success", "투표", "투표가 완료되었습니다.");
      })
      .catch(() => {
        CustomAlert("error", "투표", "에러가 발생했습니다.");
      });
  };

  if (!judgment) {
    return <div>데이터를 불러오는 중입니다...</div>;
  }

  return (
    <div className="flex flex-col items-center gap-[24px] p-[12px] bg-brandbgcolor dark:bg-branddark">
      {/* 재판 상황 */}
      <SectionCard title="재판 상황">
        <JudgmentDataCard judgment={judgment} />
      </SectionCard>

      {/* 영상 자료 */}
      <SectionCard title="영상 자료">
        {judgment.judgmentVideo ? (
          <video
            className="max-w-[1200px] rounded-2xl shadow-md border border-brandborder dark:border-branddarkborder"
            controls
          >
            <source
              src={`${constant.SERVER_URL}/${judgment.judgmentVideo}`}
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        ) : (
          <p className="text-gray-500 dark:text-brandgray">
            영상 자료가 없습니다.
          </p>
        )}
      </SectionCard>

      {/* 상황 설명 */}
      <SectionCard title="상황 설명">
        <p
          className={`leading-relaxed text-brandgray dark:text-brandhover whitespace-pre-line ${
            isMobile ? "text-[14px]" : "text-[16px]"
          }`}
        >
          {judgment.judgmentDesc}
        </p>
      </SectionCard>

      {/* 투표 하기 */}
      <SectionCard title="투표 하기">
        {hasVoted ? (
          <div
            className={`w-full text-center font-bold rounded-lg bg-gray-400 text-white cursor-not-allowed ${
              isMobile ? "py-[4px] text-[14px]" : "p-[12px] text-[18px]"
            }`}
          >
            투표 완료
          </div>
        ) : (
          <div className="flex w-full gap-[12px]">
            <button
              className={`w-1/2 font-bold rounded-xl bg-brandcolor hover:bg-brandhover text-white transition-all ${
                isMobile
                  ? "h-full py-[8px] text-[14px]"
                  : "py-[12px] text-[18px]"
              }`}
              onClick={() => handleFactionVoteClick("left")}
            >
              좌측에 투표
            </button>
            <button
              className={`w-1/2 font-bold rounded-xl bg-red-600 hover:bg-red-700 text-white transition-all ${
                isMobile
                  ? "h-full py-[8px] text-[14px]"
                  : "py-[12px] text-[18px]"
              }`}
              onClick={() => handleFactionVoteClick("right")}
            >
              우측에 투표
            </button>
          </div>
        )}
      </SectionCard>
    </div>
  );
};

export default JudgmentBodyComponent;

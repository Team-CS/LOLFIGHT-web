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
    <div className="flex flex-col items-center gap-[20px] p-[12px] md:p-[16px] bg-gradient-to-b from-gray-50 to-gray-100 dark:from-branddark dark:to-dark">
      {/* 재판 상황 */}
      <SectionCard title="재판 상황">
        <JudgmentDataCard judgment={judgment} />
      </SectionCard>

      {/* 영상 자료 */}
      <SectionCard title="영상 자료">
        {judgment.judgmentVideo ? (
          <video
            className="w-full max-w-[1200px] rounded-[14px] shadow-lg border border-gray-200 dark:border-branddarkborder"
            controls
          >
            <source
              src={`${constant.SERVER_URL}/${judgment.judgmentVideo}`}
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="w-full py-[40px] text-center text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-branddark rounded-[12px]">
            영상 자료가 없습니다.
          </div>
        )}
      </SectionCard>

      {/* 상황 설명 */}
      <SectionCard title="상황 설명">
        <div className="p-[14px] bg-gray-50 dark:bg-branddark rounded-[12px]">
          <p
            className={`leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-line ${
              isMobile ? "text-[13px]" : "text-[15px]"
            }`}
          >
            {judgment.judgmentDesc}
          </p>
        </div>
      </SectionCard>

      {/* 투표 하기 */}
      <SectionCard title="투표 하기">
        {hasVoted ? (
          <div
            className={`w-full text-center font-bold rounded-[12px] bg-gray-300 dark:bg-gray-600 text-white cursor-not-allowed shadow-inner ${
              isMobile ? "py-[12px] text-[14px]" : "py-[16px] text-[18px]"
            }`}
          >
            투표 완료
          </div>
        ) : (
          <div className="flex w-full gap-[14px]">
            <button
              className={`w-1/2 font-bold rounded-[12px] bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white transition-all shadow-md hover:shadow-lg ${
                isMobile
                  ? "py-[12px] text-[14px]"
                  : "py-[16px] text-[18px]"
              }`}
              onClick={() => handleFactionVoteClick("left")}
            >
              좌측에 투표
            </button>
            <button
              className={`w-1/2 font-bold rounded-[12px] bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white transition-all shadow-md hover:shadow-lg ${
                isMobile
                  ? "py-[12px] text-[14px]"
                  : "py-[16px] text-[18px]"
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

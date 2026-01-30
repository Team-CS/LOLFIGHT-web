"use client";

import { JudgmentDto } from "@/src/common/DTOs/judgment/judgment.dto";
import { SummonerInfoCard } from "./SummonerInfoCard";
import { useIsMobile } from "@/src/hooks/useMediaQuery";

interface Props {
  judgment: JudgmentDto;
}

const JudgmentDataCard = ({ judgment }: Props) => {
  const isMobile = useIsMobile();
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

  const backgroundStyle = {
    background: `linear-gradient(to right, 
    rgba(59, 130, 246, 0.15) 0%, 
    rgba(59, 130, 246, 0) ${leftPercent}%, 
    rgba(239, 68, 68, 0) ${leftPercent}%, 
    rgba(239, 68, 68, 0.15) 100%)`,
  };

  return (
    <div
      className="w-full flex flex-col gap-[16px] p-[14px] md:p-[20px] rounded-[14px] border border-gray-100 dark:border-branddarkborder bg-gradient-to-br from-white to-gray-50 dark:from-dark dark:to-branddark"
      style={backgroundStyle}
    >
      {/* 게이지 바 */}
      <div className="relative h-[22px] w-full rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 shadow-inner">
        {/* 왼쪽 막대 */}
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-500"
          style={{
            width: `${leftPercent}%`,
            borderTopLeftRadius: "9999px",
            borderBottomLeftRadius: "9999px",
          }}
        />
        {/* 오른쪽 막대 */}
        <div
          className="absolute top-0 right-0 h-full bg-gradient-to-l from-red-600 to-red-400 transition-all duration-500"
          style={{
            width: `${rightPercent}%`,
            borderTopRightRadius: "9999px",
            borderBottomRightRadius: "9999px",
          }}
        />
        {/* 퍼센트 텍스트 */}
        <div className={`absolute inset-0 flex justify-between items-center px-[12px] text-white font-bold drop-shadow-md ${isMobile ? "text-[12px]" : "text-[14px]"}`}>
          <span>{leftPercent.toFixed(0)}%</span>
          <span>{rightPercent.toFixed(0)}%</span>
        </div>
      </div>

      {/* 플레이어 정보 */}
      <div className={`flex items-center justify-between`}>
        <SummonerInfoCard
          name={judgment?.judgmentLeftName}
          line={judgment?.judgmentLeftLine}
          tier={judgment?.judgmentLeftTier}
          championId={judgment?.judgmentLeftChampion}
          align="right"
        />
        <div
          className={`font-extrabold bg-gradient-to-r from-blue-500 to-red-500 bg-clip-text text-transparent ${
            isMobile ? "text-[16px]" : "text-[22px]"
          }`}
        >
          VS
        </div>
        <SummonerInfoCard
          name={judgment?.judgmentRightName}
          line={judgment?.judgmentRightLine}
          tier={judgment?.judgmentRightTier}
          championId={judgment?.judgmentRightChampion}
          align="left"
        />
      </div>
    </div>
  );
};

export default JudgmentDataCard;

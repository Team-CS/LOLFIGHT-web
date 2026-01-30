import React from "react";
import { useIsMobile } from "@/src/hooks/useMediaQuery";

interface Props {
  guildLadder: number | undefined;
  guildVictory: number | undefined;
  guildDefeat: number | undefined;
  guildRank: string | undefined;
}

const GuildDetail = (props: Props) => {
  const isMobile = useIsMobile();
  const totalGames = (props.guildVictory || 0) + (props.guildDefeat || 0);
  const winRate =
    totalGames > 0
      ? ((props.guildVictory! / totalGames) * 100).toFixed(2)
      : null;

  return (
    <div className="flex flex-col w-full h-full rounded-[16px] bg-brandcolor dark:bg-branddark border dark:border-branddarkborder shadow-lg overflow-hidden">
      <div className="flex items-center gap-[8px] px-[16px] py-[12px] bg-white/10 border-b border-white/20">
        <span className="w-[4px] h-[16px] bg-white rounded-full"></span>
        <span
          className={`font-bold text-white ${isMobile ? "text-[14px]" : "text-[15px]"}`}
        >
          상세정보
        </span>
      </div>

      <div className="flex flex-col p-[16px] gap-[8px] text-white">
        <div className="flex justify-between items-center py-[6px] border-b border-white/20">
          <span className={`font-medium ${isMobile ? "text-[13px]" : "text-[14px]"}`}>
            래더
          </span>
          <span className={`font-bold ${isMobile ? "text-[15px]" : "text-[16px]"}`}>
            {props.guildLadder ?? 0}점
          </span>
        </div>

        <div className="flex justify-between items-center py-[6px] border-b border-white/20">
          <span className={`font-medium ${isMobile ? "text-[13px]" : "text-[14px]"}`}>
            승률
          </span>
          <div className="flex items-center gap-[6px]">
            <span className={`text-white/80 ${isMobile ? "text-[11px]" : "text-[12px]"}`}>
              {props.guildVictory ?? 0}승 {props.guildDefeat ?? 0}패
            </span>
            <span className={`font-bold text-green-400 ${isMobile ? "text-[14px]" : "text-[15px]"}`}>
              {winRate ? `${winRate}%` : "기록없음"}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center py-[6px]">
          <span className={`font-medium ${isMobile ? "text-[13px]" : "text-[14px]"}`}>
            랭킹
          </span>
          <div className="flex items-center gap-[6px]">
            <span className={`text-white/80 ${isMobile ? "text-[11px]" : "text-[12px]"}`}>
              1부리그
            </span>
            <span className={`font-bold ${isMobile ? "text-[15px]" : "text-[16px]"}`}>
              {props.guildRank ?? "-"}위
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default GuildDetail;

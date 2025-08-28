import constant from "@/src/common/constant/constant";
import { GuildDto } from "@/src/common/DTOs/guild/guild.dto";
import { useIsMobile } from "@/src/hooks/useMediaQuery";
import React from "react";

interface LeaguePodiumProps {
  first?: GuildDto;
  second?: GuildDto;
  third?: GuildDto;
}

const LeaguePodium = ({ first, second, third }: LeaguePodiumProps) => {
  const isMobile = useIsMobile();

  const renderGuildBox = (
    guild: GuildDto,
    borderColor: string,
    emoji: string,
    size: number
  ) => (
    <div className="flex flex-col w-full items-center gap-[4px] relative">
      <img
        src={`${constant.SERVER_URL}/${guild.guildIcon}`}
        alt={guild.guildName}
        className={`rounded-[12px] border-[2px] ${borderColor} object-cover`}
        style={{ width: `${size}px`, height: `${size}px` }}
      />

      {/* 점수 배지 */}
      <div className="absolute -top-[8px] -right-[8px] px-[6px] py-[2px] rounded-full text-[14px] font-bold bg-gradient-to-r from-blue-400 to-blue-300 text-white shadow-sm">
        {guild.guildRecord?.recordLadder ?? 0}점
      </div>

      {/* 순위 텍스트 */}
      <div
        className={`text-[12px] font-bold ${borderColor.replace(
          "border-",
          "text-"
        )}`}
      >
        {emoji} {guild.guildRecord?.recordRanking}위
      </div>

      {/* 길드 이름 */}
      <div className="text-center font-semibold truncate w-[100px] text-[16px]">
        {guild.guildName}
      </div>
    </div>
  );

  const sizeMap = {
    first: isMobile ? 110 : 150,
    second: isMobile ? 85 : 115,
    third: isMobile ? 80 : 110,
  };

  const offsetMap = {
    second: isMobile ? 35 : 55,
    third: isMobile ? 45 : 65,
  };

  return (
    <div className="flex justify-center items-end gap-[40px] max-w-[1200px] mx-auto ">
      {second && (
        <div
          className="flex flex-col items-center justify-end"
          style={{ marginTop: `${offsetMap.second}px` }}
        >
          {renderGuildBox(second, "border-[#BBC6C9]", "🥈", sizeMap.second)}
        </div>
      )}

      {first && (
        <div className="flex flex-col items-center justify-end">
          {renderGuildBox(first, "border-[#FFD700]", "🥇", sizeMap.first)}
        </div>
      )}

      {third && (
        <div
          className="flex flex-col items-center justify-end"
          style={{ marginTop: `${offsetMap.third}px` }}
        >
          {renderGuildBox(third, "border-[#B08D57]", "🥉", sizeMap.third)}
        </div>
      )}
    </div>
  );
};

export default LeaguePodium;

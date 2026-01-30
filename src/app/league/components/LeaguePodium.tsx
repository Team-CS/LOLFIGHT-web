import constant from "@/src/common/constant/constant";
import { GuildDto } from "@/src/common/DTOs/guild/guild.dto";
import { useIsMobile } from "@/src/hooks/useMediaQuery";
import Image from "next/image";
import React from "react";

interface LeaguePodiumProps {
  first?: GuildDto;
  second?: GuildDto;
  third?: GuildDto;
}

const LeaguePodium = ({ first, second, third }: LeaguePodiumProps) => {
  const isMobile = useIsMobile();

  const getGlowColor = (borderColor: string) => {
    if (borderColor.includes("FFD700")) return "shadow-[0_0_20px_rgba(255,215,0,0.4)]";
    if (borderColor.includes("BBC6C9")) return "shadow-[0_0_16px_rgba(187,198,201,0.4)]";
    if (borderColor.includes("B08D57")) return "shadow-[0_0_16px_rgba(176,141,87,0.4)]";
    return "";
  };

  const renderGuildBox = (
    guild: GuildDto,
    borderColor: string,
    emoji: string,
    size: number,
    rank: number
  ) => (
    <div className="flex flex-col w-full items-center gap-[8px] relative group">
      <div className={`relative transition-transform duration-300 group-hover:scale-105`}>
        <Image
          src={`${constant.SERVER_URL}/${guild.guildIcon}`}
          alt={guild.guildName}
          width={size}
          height={size}
          className={`rounded-[16px] border-[3px] ${borderColor} object-cover ${getGlowColor(borderColor)} transition-shadow duration-300`}
          style={{ width: `${size}px`, height: `${size}px` }}
        />

        {/* 점수 배지 */}
        <div className={`absolute -top-[10px] -right-[10px] px-[8px] py-[3px] rounded-full font-bold bg-gradient-to-r from-brandcolor to-blue-400 text-white shadow-lg ${isMobile ? "text-[11px]" : "text-[13px]"}`}>
          {guild.guildRecord?.recordLadder ?? 0}점
        </div>

        {/* 순위 메달 */}
        <div className={`absolute -bottom-[6px] left-1/2 -translate-x-1/2 w-[28px] h-[28px] rounded-full flex items-center justify-center text-[16px] shadow-md ${
          rank === 1 ? "bg-gradient-to-br from-yellow-300 to-yellow-500" :
          rank === 2 ? "bg-gradient-to-br from-gray-200 to-gray-400" :
          "bg-gradient-to-br from-orange-300 to-orange-500"
        }`}>
          {emoji}
        </div>
      </div>

      {/* 순위 텍스트 */}
      <div
        className={`mt-[8px] font-bold ${isMobile ? "text-[11px]" : "text-[13px]"} ${borderColor.replace(
          "border-",
          "text-"
        )}`}
      >
        {guild.guildRecord?.recordRanking}위
      </div>

      {/* 길드 이름 */}
      <div className={`text-center font-bold truncate ${isMobile ? "w-[80px] text-[14px]" : "w-[120px] text-[17px]"}`}>
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
    <div
      className={`flex justify-center items-end max-w-[1200px] mx-auto py-[24px] ${
        isMobile ? "px-[12px] gap-[24px]" : "gap-[48px]"
      }`}
    >
      {second && (
        <div
          className="flex flex-col items-center justify-end"
          style={{ marginTop: `${offsetMap.second}px` }}
        >
          {renderGuildBox(second, "border-[#BBC6C9]", "🥈", sizeMap.second, 2)}
        </div>
      )}

      {first && (
        <div className="flex flex-col items-center justify-end">
          {renderGuildBox(first, "border-[#FFD700]", "🥇", sizeMap.first, 1)}
        </div>
      )}

      {third && (
        <div
          className="flex flex-col items-center justify-end"
          style={{ marginTop: `${offsetMap.third}px` }}
        >
          {renderGuildBox(third, "border-[#B08D57]", "🥉", sizeMap.third, 3)}
        </div>
      )}
    </div>
  );
};

export default LeaguePodium;

import constant from "@/src/common/constant/constant";
import { GuildDto } from "@/src/common/DTOs/guild/guild.dto";
import React from "react";

interface LeaguePodiumProps {
  first?: GuildDto;
  second?: GuildDto;
  third?: GuildDto;
}

const LeaguePodium = (props: LeaguePodiumProps) => {
  const { first, second, third } = props;

  const renderGuildBox = (guild: GuildDto, color: string, emoji: string) => {
    return (
      <div className="flex flex-col items-center h-full p-[12px] gap-[4px]">
        <img
          className={`object-cover w-[150px] h-[150px] rounded-[12px] border-[2px] ${color} shadow`}
          src={`${constant.SERVER_URL}/${guild.guildIcon}`}
          alt="길드 아이콘"
        />
        <div
          className={`text-xs font-bold mt-1 ${color.replace(
            "border-",
            "text-"
          )}`}
        >
          {emoji} {guild.guildRecord?.recordRanking}위
        </div>

        <div
          className={`text-[18px] font-semibold text-center truncate w-full ${color.replace(
            "border-",
            "text-"
          )}`}
        >
          {guild.guildName}
        </div>

        <div className="text-xs text-gray-600">
          점수: {guild.guildRecord?.recordLadder ?? "0"}
        </div>
      </div>
    );
  };

  return (
    <div className="flex justify-center items-end gap-[12px] h-[300px]">
      {second && (
        <div className="self-end">
          {renderGuildBox(second, "border-[#BBC6C9]", "🥈")}
        </div>
      )}

      {first && (
        <div className="self-start">
          {renderGuildBox(first, "border-[#FFD700]", "🥇")}
        </div>
      )}

      {third && (
        <div className="self-end">
          {renderGuildBox(third, "border-[#B08D57]", "🥉")}
        </div>
      )}
    </div>
  );
};

export default LeaguePodium;

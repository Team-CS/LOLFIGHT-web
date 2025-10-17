"use client";

import { GuildDto } from "@/src/common/DTOs/guild/guild.dto";
import { MemberDto } from "@/src/common/DTOs/member/member.dto";
import constant from "@/src/common/constant/constant";
import { useMemberStore } from "@/src/common/zustand/member.zustand";
import GuildMemberContextMenu from "./context-menu/GuildMemberContextMenu";
import { useState } from "react";
import { getTierStyle } from "@/src/utils/string/string.util";
import { useIsMobile } from "@/src/hooks/useMediaQuery";
import { useRouter } from "next/navigation";

interface Props {
  guildMember: MemberDto;
  guild: GuildDto;
  expulsionMember?: (member: MemberDto) => void;
  transferGuildMaster?: (memberName: string, guildName: string) => void;
}

const GuildMemberBox = (props: Props) => {
  const { guildMember, guild, expulsionMember, transferGuildMaster } = props;
  const { member } = useMemberStore();
  const isMobile = useIsMobile();
  const router = useRouter();

  const [contextVisible, setContextVisible] = useState(false);
  const [contextPosition, setContextPosition] = useState({ x: 0, y: 0 });

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextVisible(true);
    setContextPosition({ x: e.pageX, y: e.pageY });
  };

  const handleMemberClick = (name: string) => {
    router.push(`/members/${name}`);
  };

  return (
    <div
      className="flex flex-col p-[8px] gap-[12px] border border-[#CDCDCD] rounded-[8px] bg-[#f4f6fd] dark:bg-branddark dark:border-branddarkborder cursor-pointer "
      onContextMenu={
        guildMember.id !== guild.guildMasterId &&
        guild.guildMasterId === member?.id
          ? handleRightClick
          : undefined
      }
      onClick={() => handleMemberClick(guildMember.memberName)}
    >
      <div className="flex gap-x-[8px] items-center">
        <div
          className={`flex gap-[4px] flex-[1] items-center font-medium min-w-0 ${
            isMobile ? "text-[10px]" : "text-[14px]"
          }`}
        >
          {!isMobile && (
            <img
              className="object-cover rounded-[12px] w-[25px] h-[25px]"
              src={`${constant.SERVER_URL}/${guildMember.memberIcon}`}
              alt="member-icon"
            />
          )}

          <span className="truncate">{guildMember.memberName}</span>
        </div>

        <div
          className={`flex-[2] items-center font-medium ${
            isMobile ? "text-[10px]" : "text-[14px]"
          }`}
        >
          {guildMember.memberGame?.gameName}
        </div>

        <div
          className={`flex-[1] items-center font-medium ${
            isMobile ? "text-[10px]" : "text-[14px]"
          }`}
        >
          {guildMember.memberGame ? (
            <div className="flex gap-[4px] items-center">
              <img
                src={`${constant.SERVER_URL}/public/rank/${
                  guildMember.memberGame?.gameTier?.split(" ")[0]
                }.png`}
                alt="rank"
                className={`${
                  isMobile ? "w-[20px] h-[20px]" : "w-[30px] h-[30px]"
                } `}
              />
              {!isMobile && (
                <span
                  className={getTierStyle(guildMember.memberGame?.gameTier)}
                >
                  {guildMember.memberGame?.gameTier}
                </span>
              )}
            </div>
          ) : null}
        </div>

        <div
          className={`flex-[1] items-center font-medium ${
            isMobile ? "text-[10px]" : "text-[14px]"
          }`}
        >
          {guildMember.memberGame?.line ? (
            <div className="flex items-center gap-[4px]">
              <img
                src={`${constant.SERVER_URL}/public/ranked-positions/${guildMember.memberGame?.line}.png`}
                alt="line"
                className={`${
                  isMobile ? "w-[15px] h-[15px]" : "w-[25px] h-[25px]"
                }`}
              />
              <span>{guildMember.memberGame?.line}</span>
            </div>
          ) : null}
        </div>

        <div className={`flex gap-[16px]`}>
          {guildMember.id !== guild.guildMasterId &&
            guild.guildMasterId === member?.id && (
              <GuildMemberContextMenu
                visible={contextVisible}
                position={contextPosition}
                guildMember={guildMember}
                guild={guild}
                onClose={() => setContextVisible(false)}
                expulsionMember={expulsionMember}
                transferGuildMaster={transferGuildMaster}
              />
            )}
        </div>
      </div>
    </div>
  );
};

export default GuildMemberBox;

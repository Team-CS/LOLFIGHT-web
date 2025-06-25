"use client";

import { GuildDto } from "@/src/common/DTOs/guild/guild.dto";
import { MemberDto } from "@/src/common/DTOs/member/member.dto";
import constant from "@/src/common/constant/constant";
import { useMemberStore } from "@/src/common/zustand/member.zustand";
import GuildMemberContextMenu from "./context-menu/GuildMemberContextMenu";
import { useState } from "react";
import LineSelector from "./context-menu/LineSelector";
import { getTierStyle } from "@/src/utils/string/string.util";

interface Props {
  guildMember: MemberDto;
  guild: GuildDto;
  type: string;
  expulsionMember?: (member: MemberDto) => void;
  transferGuildMaste?: (memberName: string, guildName: string) => void;
  acceptMember?: (memberId: string, guildId: string) => void;
  rejectMember?: (memberId: string, guildId: string) => void;
  onChangeLine?: (memberId: string, newLine: string) => void;
}

const GuildMemberBox = (props: Props) => {
  const {
    guildMember,
    guild,
    type,
    expulsionMember,
    transferGuildMaste,
    acceptMember,
    rejectMember,
    onChangeLine,
  } = props;
  const { member } = useMemberStore();

  const [contextVisible, setContextVisible] = useState(false);
  const [contextPosition, setContextPosition] = useState({ x: 0, y: 0 });

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextVisible(true);
    setContextPosition({ x: e.pageX, y: e.pageY });
  };

  return (
    <div
      className="flex flex-col p-[8px] gap-[12px] border border-[#CDCDCD] rounded-[8px] bg-[#EEEEEE] dark:bg-branddark"
      onContextMenu={
        type === "guildMember" &&
        guildMember.memberName !== guild.guildMaster &&
        guild.guildMaster === member?.memberName
          ? handleRightClick
          : undefined
      }
    >
      <div className="flex gap-x-[8px] items-center">
        <div className="flex-[1] items-center text-[14px] font-medium">
          {guildMember.memberName}
        </div>

        <div className="flex-[2] items-center text-[14px] font-medium">
          {guildMember.memberGame?.gameName}
        </div>

        <div className="flex-[1] items-center text-[14px] font-medium">
          {guildMember.memberGame ? (
            <div className="flex gap-[4px] items-center">
              <img
                src={`${constant.SERVER_URL}/public/rank/${
                  guildMember.memberGame?.gameTier.split(" ")[0]
                }.png`}
                alt="rank"
                className="w-[25px] h-[25px]"
              />
              <span className={getTierStyle(guildMember.memberGame?.gameTier)}>
                {guildMember.memberGame?.gameTier}
              </span>
            </div>
          ) : null}
        </div>

        <div className="flex-[1] items-center text-[14px] font-medium">
          {guildMember.memberGame?.line ? (
            <LineSelector
              currentLine={guildMember.memberGame.line}
              isMaster={guild.guildMaster === member?.memberName}
              onChangeLine={(newLine) => {
                onChangeLine?.(guildMember.id, newLine);
              }}
            />
          ) : null}
        </div>

        <div className="flex gap-[16px]">
          {type === "guildMember" ? (
            guildMember.memberName !== guild.guildMaster &&
            guild.guildMaster === member?.memberName && (
              <GuildMemberContextMenu
                visible={contextVisible}
                position={contextPosition}
                guildMember={guildMember}
                guild={guild}
                onClose={() => setContextVisible(false)}
                expulsionMember={expulsionMember}
                transferGuildMaster={transferGuildMaste}
              />
            )
          ) : (
            <>
              <button
                aria-label="수락"
                onClick={() => acceptMember?.(guildMember.id, guild.id)}
                className="flex items-center text-16px font-semibold pl-2 hover:text-blue-700"
              >
                수락
              </button>
              <button
                aria-label="거절"
                onClick={() => rejectMember?.(guildMember.id, guild.id)}
                className="flex items-center text-16px font-semibold pl-2 hover:text-red-500"
              >
                거절
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuildMemberBox;

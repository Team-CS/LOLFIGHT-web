"use client";

import React from "react";
import TeamMemberCard from "../TeamMemberCard";
import {
  calGuildTier,
  formatKoreanDatetime,
  getTierStyle,
} from "@/src/utils/string/string.util";
import constant from "@/src/common/constant/constant";
import { ScrimSlotDto } from "@/src/common/DTOs/scrim/scrim_slot.dto";

interface BattleTeamModalProps {
  scrimSlot: ScrimSlotDto;
  onClose: () => void;
}

const POSITIONS = ["TOP", "JUNGLE", "MID", "ADC", "SUPPORT"] as const;

export const BattleTeamModal = (props: BattleTeamModalProps) => {
  const { scrimSlot, onClose } = props;
  const team = scrimSlot.hostTeam;
  const guild = scrimSlot.hostTeam.guild;
  const guildTier = calGuildTier(guild.guildRecord!.recordLadder);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-branddark rounded-[12px] p-[32px] max-w-[600px] w-full max-h-[80vh] overflow-y-auto shadow-lg"
      >
        <div className="flex items-center gap-[16px] mb-[24px]">
          <img
            src={`${constant.SERVER_URL}/${scrimSlot.hostTeam.guild.guildIcon}`}
            alt="Guild Logo"
            className="w-[60px] h-[60px] rounded-full object-cover"
          />
          <div className="flex flex-col">
            <p className="text-[22px] font-semibold">{guild.guildName}</p>
            <p className="text-[14px] dark:text-gray-300">
              리더: {team.leader.memberName}
            </p>
            <p className="text-[14px] dark:text-gray-300">
              🏆 래더 점수: {guild.guildRecord?.recordLadder}점
            </p>
            <p className="text-[14px] dark:text-gray-300">
              📈 전체 순위: {guild.guildRecord?.recordRanking}위
            </p>
            <p className="text-[14px] dark:text-gray-300">
              💠 길드티어:{" "}
              <span className={getTierStyle(guildTier)}>{guildTier}</span>
            </p>
            <p className="text-[14px] dark:text-gray-300">
              🕒 내전 일시:{" "}
              {formatKoreanDatetime(scrimSlot.scheduledAt.toString())}
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">팀 멤버 목록</h3>
          <div className="flex flex-col gap-[8px]">
            {POSITIONS.map((pos) => {
              const memberForPos = team.members.find((m) => m.position === pos);
              return (
                <TeamMemberCard
                  key={pos}
                  teamMember={memberForPos}
                  roleTag={pos}
                />
              );
            })}
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="mt-6 px-4 py-2 bg-primary text-white rounded-md hover:opacity-90"
          >
            신청
          </button>

          <button
            onClick={onClose}
            className="mt-6 px-4 py-2 bg-primary text-white rounded-md hover:opacity-90"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

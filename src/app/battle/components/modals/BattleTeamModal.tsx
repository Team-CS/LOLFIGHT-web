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
import { useGuildTeamStore } from "@/src/common/zustand/guild_team.zustand";

interface BattleTeamModalProps {
  scrimSlot: ScrimSlotDto;
  onClose: () => void;
  onApply: (scrimSlotId: string) => void;
}

const POSITIONS = ["TOP", "JUNGLE", "MID", "ADC", "SUPPORT"] as const;

export const BattleTeamModal = (props: BattleTeamModalProps) => {
  const { scrimSlot, onClose, onApply } = props;
  const { guildTeam } = useGuildTeamStore();
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
        className="flex flex-col max-w-[600px] w-full bg-white dark:bg-branddark rounded-[12px] p-[32px] gap-[24px] overflow-y-auto shadow-lg"
      >
        <div className="flex items-center gap-[16px] ">
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

        <div className="flex flex-col gap-[8px]">
          <h3 className="text-[16px] font-semibold flex items-center gap-[6px]">
            <span className="text-xl">💬</span> 한 마디
          </h3>
          <div className="p-[12px] rounded-md bg-gray-100 dark:bg-[#2f2f2f] text-[14px] text-gray-800 dark:text-gray-200 whitespace-pre-line border border-gray-300 dark:border-gray-600">
            {scrimSlot.note || "팀 소개가 등록되지 않았습니다."}
          </div>
        </div>

        <div className="flex flex-col gap-[12px]">
          <h3 className="text-[18px] font-semibold">팀 멤버 목록</h3>
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

        {guildTeam ? (
          team.guild.id !== guildTeam.guild.id ? (
            <div className="flex justify-between">
              <button
                onClick={() => onApply(scrimSlot.id)}
                className="px-[16px] py-[8px] bg-primary text-white rounded-md hover:opacity-90"
              >
                신청
              </button>

              <button
                onClick={onClose}
                className="px-[16px] py-[8px] bg-primary text-white rounded-md hover:opacity-90"
              >
                닫기
              </button>
            </div>
          ) : (
            <p className="flex justify-center text-[14px] text-gray-400">
              같은 길드의 팀에게는 제안할수 없습니다.🙄
            </p>
          )
        ) : (
          <p className="flex justify-center text-[14px] text-gray-400">
            팀 생성후 신청이 가능합니다.😀
          </p>
        )}
      </div>
    </div>
  );
};

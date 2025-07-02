"use client";

import React from "react";
import TeamMemberCard from "../TeamMemberCard";
import { getTierStyle } from "@/src/utils/string/string.util";
import constant from "@/src/common/constant/constant";
type BattleTeamCardProps = {
  guildLogo: string;
  guildName: string;
  leaderName: string;
  members: string[];
  matchTime: string;
  ladderPoint: number;
  rank: number;
  tier: string;
};
type BattleTeamModalProps = {
  team: BattleTeamCardProps;
  onClose: () => void;
};

const POSITIONS = ["TOP", "JUNGLE", "MID", "ADC", "SUPPORT"] as const;

const dummyMembers = {
  TOP: {
    summonerName: "태양같은사나이",
    summonerTag: "남탓을해도된다우린남이니깐#KR1",
    tier: "GOLD",
    rankImageUrl: `${constant.SERVER_URL}/public/rank/GOLD.png`,
  },
  JUNGLE: {
    summonerName: "숲속의정글러",
    summonerTag: "정글가는중#KR1",
    tier: "PLATINUM",
    rankImageUrl: `${constant.SERVER_URL}/public/rank/PLATINUM.png`,
  },
  MID: {
    summonerName: "미드마스터",
    summonerTag: "미드좀해요#KR1",
    tier: "DIAMOND",
    rankImageUrl: `${constant.SERVER_URL}/public/rank/DIAMOND.png`,
  },
  ADC: {
    summonerName: "원딜러",
    summonerTag: "원거리딜러#KR1",
    tier: "SILVER",
    rankImageUrl: `${constant.SERVER_URL}/public/rank/SILVER.png`,
  },
  SUPPORT: {
    summonerName: "서포터맨",
    summonerTag: "팀챙기는중#KR1",
    tier: "BRONZE",
    rankImageUrl: `${constant.SERVER_URL}/public/rank/BRONZE.png`,
  },
};

export default function BattleTeamModal({
  team,
  onClose,
}: BattleTeamModalProps) {
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
            src={team.guildLogo}
            alt="Guild Logo"
            className="w-[60px] h-[60px] rounded-full object-cover"
          />
          <div className="flex flex-col">
            <p className="text-[22px] font-semibold">{team.guildName}</p>
            <p className="text-[14px] dark:text-gray-300">
              리더: {team.leaderName}
            </p>
            <p className="text-[14px] dark:text-gray-300">
              🏆 래더 점수: {team.ladderPoint}점
            </p>
            <p className="text-[14px] dark:text-gray-300">
              📈 전체 순위: {team.rank}위
            </p>
            <p className="text-[14px] dark:text-gray-300">
              💠 길드티어:{" "}
              <span className={getTierStyle(team.tier)}>{team.tier}</span>
            </p>
            <p className="text-[14px] dark:text-gray-300">
              🕒 내전 일시: {team.matchTime}
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">팀 멤버 목록</h3>
          <div className="flex flex-col gap-[8px]">
            {POSITIONS.map((pos) => {
              const member = dummyMembers[pos];
              return (
                <TeamMemberCard
                  key={pos}
                  roleTag={pos}
                  isEmpty={!member}
                  {...(member || {})}
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
}

"use client";

import { getMemberChampionStats } from "@/src/api/guild_stats.api";
import {
  findMemberByName,
  refreshMemberSummonerInfo,
} from "@/src/api/member.api";
import constant from "@/src/common/constant/constant";
import { GuildMemberChampionStatsDto } from "@/src/common/DTOs/guild/guild_member_champion_stats.dto";
import { MemberPublicDto } from "@/src/common/DTOs/member/member.dto";
import { useIsMobile } from "@/src/hooks/useMediaQuery";
import {
  formatElapsedTime,
  getTierStyle,
} from "@/src/utils/string/string.util";
import Image from "next/image";
import { useEffect, useState } from "react";
import championsJson from "@/src/common/constant/champion_id_name_map.json";

type PageProps = {
  name: string;
};

export default function Page({ params }: { params: PageProps }) {
  const isMobile = useIsMobile();
  const name = decodeURIComponent(params.name);
  const [member, setMember] = useState<MemberPublicDto>();
  const [memberStats, setMemberStats] =
    useState<GuildMemberChampionStatsDto[]>();
  const [isDisabled, setIsDisabled] = useState(false);
  const FIVE_MINUTES = 5 * 60 * 1000;
  const updatedAt = member?.memberGame?.updatedAt;

  useEffect(() => {
    findMemberByName(name)
      .then((response) => {
        setMember(response.data.data);
      })
      .catch(console.error);
  }, [params]);

  useEffect(() => {
    if (!updatedAt) return;
    const diff = Date.now() - new Date(updatedAt).getTime();
    setIsDisabled(diff < FIVE_MINUTES);
  }, [updatedAt]);

  useEffect(() => {
    if (member?.memberGuild) {
      getMemberChampionStats(member.memberGuild.id, member.id, 5).then(
        (response) => {
          setMemberStats(response.data.data);
        },
      );
    }
  }, [member]);

  const handleRefreshSummonerInfo = () => {
    if (member?.memberGame?.gameName) {
      refreshMemberSummonerInfo(member.memberGame.gameName).then((response) => {
        setMember({ ...member, memberGame: response.data.data.memberGame });
      });
    }
  };

  if (!member) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500 font-medium">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="flex max-w-[1200px] h-full mx-auto w-full py-[28px] px-[16px]">
      <div className="w-full flex flex-col gap-[20px]">
        {/* 프로필 상단 카드 */}
        <div className="relative w-full rounded-[16px] overflow-hidden bg-white dark:bg-branddark border dark:border-branddarkborder shadow-lg">
          {/* 배너 */}
          <div className="w-full h-[200px] relative">
            <Image
              src={
                member.memberItem?.banner
                  ? `${constant.SERVER_URL}/${member.memberItem.banner}`
                  : `${constant.SERVER_URL}/public/default-banner.png`
              }
              alt="member-banner"
              width={1000}
              height={1000}
              className="w-full h-full object-cover"
              priority
            />
          </div>

          {/* 프로필 정보 */}
          <div className="relative p-[24px]">
            <div className="flex flex-col md:flex-row gap-[24px]">
              {/* 좌측: 프로필 이미지 + 유저 정보 */}
              <div className="flex flex-col gap-[20px] flex-1">
                <div className="flex items-start gap-[20px]">
                  <div className={`${member.memberItem?.border} relative`}>
                    <Image
                      src={`${constant.SERVER_URL}/${member.memberIcon}`}
                      alt={member.memberName}
                      width={120}
                      height={120}
                      className="w-[120px] h-[120px] object-cover rounded-[12px]"
                      priority
                    />
                  </div>
                  <div
                    className="flex flex-col gap-[8px]"
                    style={{ paddingTop: isMobile ? "0" : "10px" }}
                  >
                    <p
                      className={`w-fit font-bold text-gray-900 dark:text-white ${isMobile ? "text-[22px]" : "text-[28px]"} ${member.memberItem?.effect}`}
                    >
                      {member.memberName}
                    </p>
                    <p className="text-[13px] text-gray-400 dark:text-gray-500">
                      가입일: {member.createdAt?.toString().split("T")[0]}
                    </p>
                    {member.memberGame && (
                      <div className="flex items-center justify-center gap-[10px]">
                        <button
                          disabled={isDisabled}
                          onClick={() =>
                            !isDisabled && handleRefreshSummonerInfo()
                          }
                          className={`rounded-[8px] font-medium transition-colors ${
                            isDisabled
                              ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                              : "bg-brandcolor hover:bg-brandhover text-white"
                          } px-[8px] py-[4px] text-[12px]`}
                        >
                          티어 갱신
                        </button>
                        <span className="text-[11px] text-gray-400">
                          {updatedAt ? formatElapsedTime(updatedAt) : "-"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 인게임 정보 카드 */}
                {member.memberGame && (
                  <div className="flex items-center gap-[16px] p-[16px] rounded-[12px] bg-gray-50 dark:bg-gray-800/50 border dark:border-branddarkborder">
                    <Image
                      src={`${constant.SERVER_URL}/public/rank/${member.memberGame.gameTier!.split(" ")[0]}.png`}
                      alt="Tier"
                      width={80}
                      height={80}
                      className={`object-contain ${isMobile ? "w-[60px] h-[60px]" : "w-[80px] h-[80px]"}`}
                    />
                    <div className="flex flex-col gap-[8px]">
                      <span
                        className={`${getTierStyle(member.memberGame.gameTier!.split(" ")[0])} ${isMobile ? "text-[16px]" : "text-[18px]"} font-bold`}
                      >
                        {member.memberGame.gameTier}
                      </span>
                      <div className="flex gap-[8px]">
                        <span className="px-[10px] py-[4px] rounded-[6px] bg-gray-200 dark:bg-gray-700 text-[13px] text-gray-700 dark:text-gray-300 font-medium">
                          {member.memberGame.gameName}
                        </span>
                        <span className="px-[10px] py-[4px] rounded-[6px] bg-gray-200 dark:bg-gray-700 text-[13px] text-gray-700 dark:text-gray-300 font-medium">
                          {member.memberGame.line}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 우측: 챔피언 통계 */}
              <div
                className={`flex flex-col ${isMobile ? "w-full border-t border-gray-200 dark:border-gray-700 pt-[20px]" : "w-[380px] border-l border-gray-200 dark:border-gray-700 pl-[24px]"}`}
              >
                <div className="flex items-center gap-[8px] pb-[12px]">
                  <span className="w-[4px] h-[16px] bg-brandcolor rounded-full"></span>
                  <span className="text-[15px] font-bold text-gray-800 dark:text-white">
                    챔피언 통계
                  </span>
                </div>
                <div className="h-[220px] overflow-y-auto pr-[8px] flex flex-col gap-[8px]">
                  {memberStats && memberStats.length > 0 ? (
                    memberStats.map((stat) => {
                      const championName =
                        (championsJson as any)[stat.championId.toString()] ||
                        "챔피언";
                      return (
                        <div
                          key={stat.id}
                          className="flex items-center justify-between p-[8px] rounded-[10px] bg-gray-50 dark:bg-gray-800/40 border border-transparent hover:border-gray-200 dark:hover:border-gray-600 transition-all"
                        >
                          <div className="flex items-center gap-[12px]">
                            <Image
                              src={`${constant.SERVER_URL}/public/champions/${stat.championId}.png`}
                              alt={championName}
                              width={35}
                              height={35}
                              className="rounded-[8px]"
                            />
                            <div className="flex flex-col">
                              <span className="text-[13px] font-semibold text-gray-800 dark:text-gray-100">
                                {championName}
                              </span>
                              <span className="text-[11px] text-gray-400">
                                {stat.gamesPlayed}게임
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p
                              className={`text-[14px] font-bold ${stat.winRate >= 60 ? "text-red-500" : stat.winRate >= 50 ? "text-blue-500" : "text-gray-600 dark:text-gray-300"}`}
                            >
                              {stat.winRate}%
                            </p>
                            <p className="text-[11px] text-gray-400">
                              {stat.avgKDA.toFixed(2)} KDA
                            </p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-[13px]">
                      기록된 통계가 없습니다.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 길드 정보 카드 */}
        {member.memberGuild && (
          <div className="w-full rounded-[16px] bg-white dark:bg-branddark border dark:border-branddarkborder shadow-lg overflow-hidden">
            <div className="flex items-center gap-[8px] px-[20px] py-[14px] bg-gray-50 dark:bg-gray-800/50 border-b dark:border-branddarkborder">
              <span className="text-[15px] font-bold text-gray-800 dark:text-white">
                소속 길드
              </span>
            </div>

            <div className="p-[20px]">
              <div className="flex items-center gap-[20px]">
                <Image
                  src={`${constant.SERVER_URL}/${member.memberGuild.guildIcon}`}
                  alt="guild icon"
                  width={100}
                  height={100}
                  className={`${isMobile ? "w-[80px] h-[80px]" : "w-[100px] h-[100px]"} object-cover rounded-[12px] shadow-md`}
                />
                <div className="flex flex-col gap-[12px] flex-1">
                  <p
                    className={`font-bold text-gray-900 dark:text-white ${isMobile ? "text-[20px]" : "text-[24px]"}`}
                  >
                    {member.memberGuild.guildName}
                  </p>
                  <div className="flex flex-wrap gap-[8px]">
                    {[
                      {
                        label: "순위",
                        value: `#${member.memberGuild.guildRecord?.recordRanking ?? "-"}`,
                      },
                      {
                        label: "래더",
                        value: `${member.memberGuild.guildRecord?.recordLadder ?? 0}점`,
                      },
                      {
                        label: "티어",
                        value: member.memberGuild.guildTier,
                        style: getTierStyle(member.memberGuild.guildTier),
                      },
                      {
                        label: "전적",
                        value: `${member.memberGuild.guildRecord?.recordVictory ?? 0}승 ${member.memberGuild.guildRecord?.recordDefeat ?? 0}패`,
                      },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-[6px] px-[12px] py-[6px] rounded-[8px] bg-gray-100 dark:bg-gray-800"
                      >
                        <span className="text-[12px] text-gray-500 dark:text-gray-400">
                          {item.label}
                        </span>
                        <span
                          className={`text-[13px] font-semibold text-gray-800 dark:text-gray-100 ${item.style || ""}`}
                        >
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 배지 섹션 */}
        <div className="w-full rounded-[16px] bg-white dark:bg-branddark border dark:border-branddarkborder shadow-lg overflow-hidden">
          <div className="flex items-center gap-[8px] px-[20px] py-[14px] bg-gray-50 dark:bg-gray-800/50 border-b dark:border-branddarkborder">
            <span className="text-[15px] font-bold text-gray-800 dark:text-white">
              획득한 배지
            </span>
            {member.memberBadge && member.memberBadge.length > 0 && (
              <span className="text-[13px] text-gray-400 dark:text-gray-500">
                {member.memberBadge.length}개
              </span>
            )}
          </div>

          <div className="p-[20px]">
            {member.memberBadge && member.memberBadge.length > 0 ? (
              <div className="flex flex-wrap gap-[10px]">
                {member.memberBadge.map((badge) => (
                  <div
                    key={badge.id}
                    className="relative group flex items-center"
                  >
                    <div
                      className="flex items-center text-white px-[10px] py-[4px] rounded-[6px] text-[13px] font-semibold cursor-default whitespace-nowrap shadow-sm"
                      style={{ background: badge.badge.color }}
                    >
                      {badge.badge.name}
                    </div>

                    <div
                      className="absolute left-1/2 -translate-x-1/2 bottom-full hidden group-hover:flex flex-col items-center z-50 pointer-events-none"
                      style={{ marginBottom: "8px" }}
                    >
                      <div className="bg-gray-900/95 backdrop-blur-sm text-white text-[12px] rounded-[8px] py-[6px] px-[12px] whitespace-nowrap shadow-xl">
                        {badge.badge.description}
                      </div>
                      <div className="w-0 h-0 border-x-[6px] border-x-transparent border-t-[6px] border-t-gray-900/95"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-[20px] text-gray-400 dark:text-gray-500">
                <p className="text-[14px]">아직 획득한 배지가 없습니다.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

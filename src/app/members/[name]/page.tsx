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
      .then((response) => setMember(response.data.data))
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
    <div className="flex max-w-[1200px] h-full mx-auto w-full py-[28px] px-4 gap-[24px]">
      <div className="w-full flex flex-col items-center gap-[12px] p-[12px] border rounded-[12px] shadow-md bg-white dark:bg-dark dark:border-branddarkborder relative overflow-hidden">
        {/* [배너 섹션] */}
        <div className="w-full h-[280px] relative">
          <Image
            src={
              member.memberItem?.banner
                ? `${constant.SERVER_URL}/${member.memberItem.banner}`
                : `${constant.SERVER_URL}/public/default-banner.png`
            }
            alt="member-banner"
            width={1000}
            height={1000}
            className="w-full h-full object-cover rounded-[12px] opacity-80"
          />
        </div>

        {/* [중단 메인 컨테이너] */}
        <div className="flex flex-col md:flex-row w-full items-stretch justify-between gap-[12px] p-[12px] rounded-[12px] mt-[-60px] relative z-10 bg-white/90 dark:bg-dark shadow-md backdrop-blur-sm border dark:border-branddarkborder">
          {/* 1. 프로필 정보 (좌측) */}
          <div className="flex flex-col gap-[16px] flex-1">
            <div className="flex items-center gap-[12px]">
              {/* 이미지 사이즈 고정 (요청사항 반영) */}
              <div className={`${member.memberItem?.border}`}>
                <Image
                  src={`${constant.SERVER_URL}/${member.memberIcon}`}
                  alt={member.memberName}
                  width={130}
                  height={130}
                  className={`${isMobile ? "w-[100px] h-[100px]" : "w-[130px] h-[130px]"} object-cover rounded-[12px]`}
                />
              </div>
              <div className="flex flex-col gap-[4px]">
                <p
                  className={`font-bold text-gray-900 dark:text-gray-100 ${isMobile ? "text-[20px]" : "text-[26px]"} ${member.memberItem?.effect}`}
                >
                  {member.memberName}
                </p>
                <p
                  className={`text-gray-500 ${isMobile ? "text-[10px]" : "text-[14px]"}`}
                >
                  가입일 : {member.createdAt?.toString().split("T")[0]}
                </p>
                {member.memberGame && (
                  <button
                    disabled={isDisabled}
                    onClick={() => !isDisabled && handleRefreshSummonerInfo()}
                    className={`rounded-[8px] font-medium transition-all ${
                      isDisabled
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : "bg-brandcolor hover:bg-brandhover text-white shadow-md"
                    } ${isMobile ? "text-[12px] px-[8px] py-[4px]" : "text-[14px] px-[12px] py-[4px]"}`}
                  >
                    티어 갱신
                  </button>
                )}
                <p className="text-[10px] text-gray-500">
                  {updatedAt ? formatElapsedTime(updatedAt) : "-"}
                </p>
              </div>
            </div>

            {/* 인게임 정보 카드 */}
            {member.memberGame && (
              <div className="flex items-center gap-[12px] p-[12px] rounded-[12px] bg-gray-50 dark:bg-branddark border dark:border-branddarkborder shadow-sm">
                <Image
                  src={`${constant.SERVER_URL}/public/rank/${member.memberGame.gameTier!.split(" ")[0]}.png`}
                  alt="Tier"
                  width={80}
                  height={80}
                  className={`object-contain ${isMobile ? "w-[60px] h-[60px]" : "w-[80px] h-[80px]"}`}
                />
                <div className="flex flex-col gap-[6px]">
                  <span
                    className={`${getTierStyle(member.memberGame.gameTier!.split(" ")[0])} ${isMobile ? "text-[14px]" : "text-[16px]"} font-semibold`}
                  >
                    {member.memberGame.gameTier}
                  </span>
                  <div className="flex gap-[8px] text-[12px] md:text-[14px] text-gray-700 dark:text-gray-300">
                    <span className="px-[8px] py-[2px] rounded-[8px] bg-gray-200 dark:bg-gray-700">
                      {member.memberGame.gameName}
                    </span>
                    <span className="px-[8px] py-[2px] rounded-[8px] bg-gray-200 dark:bg-gray-700">
                      {member.memberGame.line}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 2. 챔피언 통계 (우측/스크롤 유지) */}
          <div
            className={`flex flex-col border-gray-200 dark:border-gray-700 ${isMobile ? "w-full border-t mt-4 pt-4" : "w-[410px] border-l pl-4"}`}
          >
            <p className="text-[14px] font-bold mb-2 flex items-center gap-2">
              <span className="w-1 h-3 bg-brandcolor rounded-full"></span>
              챔피언 통계
            </p>
            {/* 스크롤 강제 적용 (h-[230px] 고정 및 overflow-y-auto) */}
            <div className="h-[210px] overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-2">
              {memberStats && memberStats.length > 0 ? (
                memberStats.map((stat) => {
                  const championName =
                    (championsJson as any)[stat.championId.toString()] ||
                    "챔피언";
                  return (
                    <div
                      key={stat.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-gray-50/50 dark:bg-gray-800/40 border border-transparent hover:border-gray-200 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <Image
                          src={`${constant.SERVER_URL}/public/champions/${stat.championId}.png`}
                          alt={championName}
                          width={34}
                          height={34}
                          className="rounded-md"
                        />
                        <div className="flex flex-col leading-tight">
                          <span className="text-[12px] font-bold">
                            {championName}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {stat.gamesPlayed}판
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-[12px] font-bold ${stat.winRate >= 60 ? "text-red-500" : stat.winRate >= 50 ? "text-blue-500" : ""}`}
                        >
                          {stat.winRate}%
                        </p>
                        <p className="text-[10px] text-gray-500">
                          {stat.avgKDA.toFixed(2)} KDA
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 text-[12px]">
                  기록된 통계가 없습니다.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* [하단 길드 섹션] */}
        {member.memberGuild && (
          <div className="flex items-center w-full gap-[12px] p-[12px] rounded-[12px] dark:bg-dark border dark:border-branddarkborder shadow-lg mt-2">
            <Image
              src={`${constant.SERVER_URL}/${member.memberGuild.guildIcon}`}
              alt="guild icon"
              width={130}
              height={130}
              className={`${isMobile ? "w-[100px] h-[100px]" : "w-[130px] h-[130px]"} object-cover rounded-[12px]`}
            />
            <div className="flex flex-col justify-center flex-1 gap-[8px]">
              <p
                className={`font-bold text-gray-900 dark:text-gray-100 ${isMobile ? "text-[20px]" : "text-[22px]"}`}
              >
                <span className="text-xs text-gray-500 block">[길드]</span>
                {member.memberGuild.guildName}
              </p>
              <div
                className={`flex flex-wrap gap-[6px] ${isMobile ? "text-[10px]" : "text-[12px]"}`}
              >
                {/* 길드 스탯 칩들 */}
                {[
                  {
                    label: "순위",
                    value: `#${member.memberGuild.guildRecord?.recordRanking ?? "-"}`,
                  },
                  {
                    label: "래더점수",
                    value: `${member.memberGuild.guildRecord?.recordLadder ?? 0} 점`,
                  },
                  {
                    label: "티어",
                    value: member.memberGuild.guildTier,
                    style: getTierStyle(member.memberGuild.guildTier),
                  },
                  {
                    label: "전적",
                    value: `${member.memberGuild.guildRecord?.recordVictory ?? 0}승 / ${member.memberGuild.guildRecord?.recordDefeat ?? 0}패`,
                  },
                ].map((item, idx) => (
                  <p
                    key={idx}
                    className="px-[8px] py-[2px] rounded-[8px] bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium"
                  >
                    {item.label} :{" "}
                    <span className={item.style}>{item.value}</span>
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* [배지 섹션] */}
        <div className="w-full py-[16px] border border-dashed border-gray-300 dark:border-branddarkborder rounded-[12px] bg-transparent mt-2">
          <p className="text-center text-[14px] text-gray-400">
            🏅 획득한 배지가 없습니다. (개발 중)
          </p>
        </div>
      </div>
    </div>
  );
}

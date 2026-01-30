"use client";
import { getGuildInfo } from "@/src/api/guild.api";
import GuildBanner from "./components/GuildBanner";
import GuildDetail from "./components/GuildDetail";
import GuildFightRecord from "./components/GuildFightRecord";
import GuildSummeryRecord from "./components/GuildSummeryRecord";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { GuildDto } from "@/src/common/DTOs/guild/guild.dto";
import {
  BattleDto,
  BattleListResponseDto,
} from "@/src/common/DTOs/battle/battle.dto";
import { getBattleList } from "@/src/api/battle.api";
import constant from "@/src/common/constant/constant";
import { getTierStyle } from "@/src/utils/string/string.util";
import { useIsMobile } from "@/src/hooks/useMediaQuery";
import Image from "next/image";
import {
  getGuildChampionStats,
  getMostGuildChampionStats,
} from "@/src/api/guild_stats.api";
import { GuildChampionStatsDto } from "@/src/common/DTOs/guild/guild_champion_stats.dto";

export default function GuildPage() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const guildPath = usePathname();
  const [guild, setGuild] = useState<GuildDto>();
  const [currentTab, setCurrentTab] = useState("guildInfo");
  const [battleDataList, setBattleDataList] = useState<BattleDto[]>([]);
  const [mostPlayedChampions, setMostPlayedChampions] = useState<
    GuildChampionStatsDto[]
  >([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const battlesPerPage = 5;

  useEffect(() => {
    const guildName = decodeURIComponent(guildPath.replace(/^\/league\//, ""));

    getGuildInfo(guildName)
      .then((response) => {
        setGuild(response.data.data);
      })
      .catch((error) => {
        console.log(error);
        router.push("/error");
      });

    getBattleList(guildName, currentPage, battlesPerPage).then((response) => {
      const data = response.data.data as BattleListResponseDto;
      if (Array.isArray(data.battleList)) {
        setBattleDataList(data.battleList);
        setCurrentPage(currentPage + 1);
        setTotalPage(data.pagination.totalPage!);
      } else {
        setBattleDataList([]);
      }
    });
  }, []);

  useEffect(() => {
    if (guild) {
      getMostGuildChampionStats(guild.id, 6).then((response) => {
        setMostPlayedChampions(response.data.data);
      });
    }
  }, [guild]);

  const changeTab = (tab: string) => {
    setCurrentTab(tab);
  };

  const fetchBattleData = () => {
    const guildName = decodeURIComponent(guildPath.replace(/^\/league\//, ""));
    getBattleList(guildName, currentPage, battlesPerPage).then((response) => {
      const data = response.data.data as BattleListResponseDto;
      if (Array.isArray(data.battleList)) {
        setBattleDataList((prevList) => [...prevList, ...data.battleList]);
        setCurrentPage(currentPage + 1);
      } else {
        setBattleDataList([]);
      }
    });
  };

  const handleMemberClick = (name: string) => {
    router.push(`/members/${name}`);
  };

  return (
    <>
      <div className="w-full h-full py-[24px]">
        {guild && <GuildBanner guild={guild} />}
        <div
          className={`flex flex-col py-[12px] h-full max-w-[1200px] mx-auto gap-[16px] ${
            isMobile ? "px-[12px]" : "px-[16px]"
          }`}
        >
          {/* 탭 네비게이션 */}
          <div className="w-full rounded-[12px] bg-white dark:bg-branddark border dark:border-branddarkborder shadow-md overflow-hidden">
            <div className="flex border-b dark:border-branddarkborder">
              <button
                onClick={() => changeTab("banner")}
                className={`flex-1 px-[16px] py-[14px] font-medium transition-colors ${
                  isMobile ? "text-[13px]" : "text-[14px]"
                } ${
                  currentTab === "banner"
                    ? "text-brandcolor border-b-[2px] border-brandcolor bg-brandcolor/5"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
              >
                길드소개
              </button>
              <button
                onClick={() => changeTab("guildInfo")}
                className={`flex-1 px-[16px] py-[14px] font-medium transition-colors ${
                  isMobile ? "text-[13px]" : "text-[14px]"
                } ${
                  currentTab === "guildInfo"
                    ? "text-brandcolor border-b-[2px] border-brandcolor bg-brandcolor/5"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
              >
                대전기록
              </button>
              <button
                onClick={() => changeTab("members")}
                className={`flex-1 px-[16px] py-[14px] font-medium transition-colors ${
                  isMobile ? "text-[13px]" : "text-[14px]"
                } ${
                  currentTab === "members"
                    ? "text-brandcolor border-b-[2px] border-brandcolor bg-brandcolor/5"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
              >
                길드원
              </button>
            </div>
          </div>

          {currentTab === "banner" && (
            <div className="flex flex-col w-full gap-[16px]">
              {/* 소개글 카드 */}
              <div className="w-full rounded-[16px] bg-white dark:bg-branddark border dark:border-branddarkborder shadow-lg overflow-hidden">
                <div className="flex items-center gap-[8px] px-[20px] py-[14px] bg-gray-50 dark:bg-gray-800/50 border-b dark:border-branddarkborder">
                  <span className="w-[4px] h-[16px] bg-brandcolor rounded-full"></span>
                  <span
                    className={`font-bold text-gray-800 dark:text-white ${
                      isMobile ? "text-[14px]" : "text-[15px]"
                    }`}
                  >
                    길드 소개
                  </span>
                </div>
                <div className={`p-[20px] ${isMobile ? "p-[16px]" : "p-[20px]"}`}>
                  <p
                    className={`leading-relaxed whitespace-pre-wrap text-gray-700 dark:text-gray-300 ${
                      isMobile ? "text-[13px]" : "text-[15px]"
                    }`}
                  >
                    {guild?.guildDescription ??
                      "아직 길드 소개가 작성되지 않았습니다."}
                  </p>
                </div>
              </div>

              {/* 배너 이미지 카드 */}
              <div className="w-full rounded-[16px] bg-white dark:bg-branddark border dark:border-branddarkborder shadow-lg overflow-hidden">
                <div className="flex items-center gap-[8px] px-[20px] py-[14px] bg-gray-50 dark:bg-gray-800/50 border-b dark:border-branddarkborder">
                  <span className="w-[4px] h-[16px] bg-brandcolor rounded-full"></span>
                  <span
                    className={`font-bold text-gray-800 dark:text-white ${
                      isMobile ? "text-[14px]" : "text-[15px]"
                    }`}
                  >
                    길드 배너
                  </span>
                </div>
                <div className={`flex justify-center items-center ${isMobile ? "p-[16px]" : "p-[24px]"}`}>
                  {guild?.guildBanner ? (
                    <Image
                      src={`${constant.SERVER_URL}/${guild.guildBanner}`}
                      width={700}
                      height={500}
                      alt="Guild Banner"
                      className="rounded-[12px] shadow-md max-w-full"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center py-[30px] text-gray-400 dark:text-gray-500">
                      <p className={`${isMobile ? "text-[13px]" : "text-[14px]"}`}>
                        등록된 배너가 없습니다.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {currentTab === "guildInfo" && (
            <div className="flex flex-col gap-[16px]">
              {/* 통계 영역 */}
              <div
                className={`flex w-full gap-[16px] ${isMobile ? "flex-col" : "flex-row"}`}
              >
                <div className={`${isMobile ? "w-full" : "flex-[2]"}`}>
                  <GuildSummeryRecord
                    guildVictory={guild?.guildRecord?.recordVictory}
                    guildDefeat={guild?.guildRecord?.recordDefeat}
                    mostChampionStats={mostPlayedChampions}
                  />
                </div>
                <div className={`${isMobile ? "w-full" : "flex-[1]"}`}>
                  <GuildDetail
                    guildVictory={guild?.guildRecord?.recordVictory}
                    guildDefeat={guild?.guildRecord?.recordDefeat}
                    guildLadder={guild?.guildRecord?.recordLadder}
                    guildRank={guild?.guildRecord?.recordRanking}
                  />
                </div>
              </div>

              {/* 대전 기록 리스트 */}
              <div className="w-full rounded-[16px] bg-white dark:bg-branddark border dark:border-branddarkborder shadow-lg overflow-hidden">
                <div className="flex items-center gap-[8px] px-[20px] py-[14px] bg-gray-50 dark:bg-gray-800/50 border-b dark:border-branddarkborder">
                  <span className="w-[4px] h-[16px] bg-brandcolor rounded-full"></span>
                  <span
                    className={`font-bold text-gray-800 dark:text-white ${
                      isMobile ? "text-[14px]" : "text-[15px]"
                    }`}
                  >
                    대전 기록
                  </span>
                  {battleDataList.length > 0 && (
                    <span
                      className={`text-gray-500 dark:text-gray-400 ${
                        isMobile ? "text-[12px]" : "text-[13px]"
                      }`}
                    >
                      {battleDataList.length}경기
                    </span>
                  )}
                </div>

                <div className={`${isMobile ? "p-[12px]" : "p-[16px]"}`}>
                  {guild ? (
                    battleDataList.length > 0 ? (
                      <div className="flex flex-col gap-[12px]">
                        {battleDataList.map((battle) => (
                          <GuildFightRecord
                            key={battle.id}
                            battleData={battle}
                            guildName={guild?.guildName}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center py-[30px] text-gray-400 dark:text-gray-500">
                        <p className={`${isMobile ? "text-[13px]" : "text-[14px]"}`}>
                          아직 대전 기록이 없습니다.
                        </p>
                      </div>
                    )
                  ) : (
                    <div className="flex items-center justify-center py-[30px] text-gray-400 dark:text-gray-500">
                      <p className={`${isMobile ? "text-[13px]" : "text-[14px]"}`}>
                        길드 정보를 불러오는 중입니다...
                      </p>
                    </div>
                  )}

                  {battleDataList.length < totalPage && battleDataList.length > 0 && (
                    <button
                      className={`w-full mt-[12px] py-[10px] bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-[10px] font-medium transition-colors ${
                        isMobile ? "text-[13px]" : "text-[14px]"
                      }`}
                      onClick={fetchBattleData}
                    >
                      더보기
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
          {currentTab === "members" && (
            <div className="w-full rounded-[16px] bg-white dark:bg-branddark border dark:border-branddarkborder shadow-lg overflow-hidden">
              {/* 헤더 */}
              <div className="flex items-center justify-between px-[20px] py-[14px] bg-gray-50 dark:bg-gray-800/50 border-b dark:border-branddarkborder">
                <div className="flex items-center gap-[8px]">
                  <span className="w-[4px] h-[16px] bg-brandcolor rounded-full"></span>
                  <span
                    className={`font-bold text-gray-800 dark:text-white ${
                      isMobile ? "text-[14px]" : "text-[15px]"
                    }`}
                  >
                    길드원 목록
                  </span>
                </div>
                <span
                  className={`text-gray-500 dark:text-gray-400 ${
                    isMobile ? "text-[12px]" : "text-[13px]"
                  }`}
                >
                  총 {guild?.guildMembers.length}명
                </span>
              </div>

              {/* 테이블 */}
              <div className="overflow-x-auto">
                <div className="min-w-[550px]">
                  {/* 테이블 헤더 */}
                  <div
                    className={`flex bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-medium text-center ${
                      isMobile
                        ? "text-[11px] px-[12px] py-[10px]"
                        : "text-[13px] px-[16px] py-[12px]"
                    }`}
                  >
                    <div className="flex-[1]">닉네임</div>
                    <div className="flex-[2]">소환사명</div>
                    <div className="flex-[1]">티어</div>
                    <div className="flex-[1]">라인</div>
                  </div>

                  {/* 테이블 바디 */}
                  <div className="max-h-[500px] overflow-y-auto">
                    {guild?.guildMembers.map((member, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleMemberClick(member.memberName)}
                        className={`flex items-center text-center border-b border-gray-100 dark:border-gray-700 last:border-b-0 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                          isMobile
                            ? "text-[12px] px-[12px] py-[10px]"
                            : "text-[14px] px-[16px] py-[12px]"
                        }`}
                      >
                        {/* 닉네임 */}
                        <div className="flex gap-[8px] flex-[1] font-medium justify-center items-center min-w-0">
                          {!isMobile && (
                            <div className={`${member.memberItem?.border}`}>
                              <Image
                                src={`${constant.SERVER_URL}/${member.memberIcon}`}
                                alt="member-icon"
                                width={28}
                                height={28}
                                className="object-cover rounded-[8px] w-[28px] h-[28px]"
                              />
                            </div>
                          )}
                          <span
                            className={`truncate ${member.memberItem?.effect} text-gray-800 dark:text-gray-100`}
                          >
                            {member.memberName}
                          </span>
                        </div>

                        {/* 소환사명 */}
                        <div className="flex-[2] font-medium text-gray-600 dark:text-gray-300 truncate">
                          {member.memberGame?.gameName || "-"}
                        </div>

                        {/* 티어 */}
                        <div className="flex-[1] flex items-center justify-center gap-[4px]">
                          {member.memberGame ? (
                            <>
                              <Image
                                src={`${constant.SERVER_URL}/public/rank/${
                                  member.memberGame?.gameTier?.split(" ")[0]
                                }.png`}
                                alt="rank"
                                width={22}
                                height={22}
                                className={`${isMobile ? "w-[18px] h-[18px]" : "w-[22px] h-[22px]"}`}
                              />
                              <span
                                className={`font-medium ${getTierStyle(
                                  member.memberGame?.gameTier
                                )} ${isMobile ? "text-[11px]" : "text-[13px]"}`}
                              >
                                {isMobile
                                  ? member.memberGame?.gameTier?.split(" ")[0]
                                  : member.memberGame?.gameTier}
                              </span>
                            </>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </div>

                        {/* 라인 */}
                        <div className="flex-[1] flex items-center gap-[4px] justify-center">
                          {member.memberGame ? (
                            <>
                              <Image
                                src={`${constant.SERVER_URL}/public/ranked-positions/${member.memberGame?.line}.png`}
                                alt="line"
                                width={22}
                                height={22}
                                className={`${isMobile ? "w-[18px] h-[18px]" : "w-[22px] h-[22px]"}`}
                              />
                              {!isMobile && (
                                <span className="text-gray-600 dark:text-gray-300">
                                  {member.memberGame?.line}
                                </span>
                              )}
                            </>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

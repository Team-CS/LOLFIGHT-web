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

export default function GuildPage() {
  const router = useRouter();
  const guildPath = usePathname();
  const [guild, setGuild] = useState<GuildDto>();
  const [currentTab, setCurrentTab] = useState("guildInfo");
  const [battleDataList, setBattleDataList] = useState<BattleDto[]>([]);
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

  return (
    <>
      <div className="w-full h-full py-[24px]">
        {guild && <GuildBanner guild={guild} />}
        <div className="flex flex-col py-[12px] h-full max-w-[1200px] mx-auto gap-[12px]">
          <div className="w-full bg-brandbgcolor border dark:bg-dark dark:border-gray-700">
            <button
              className="font-medium text-[16px] hover:bg-brandhover px-[8px] py-[4px] dark:hover:bg-gray-700 transition"
              onClick={() => changeTab("banner")}
            >
              길드배너
            </button>
            <button
              className="font-medium text-[16px] hover:bg-brandhover px-[8px] py-[4px] dark:hover:bg-gray-700 transition"
              onClick={() => changeTab("guildInfo")}
            >
              대전기록
            </button>
            <button
              className="font-medium text-[16px] hover:bg-brandhover px-[8px] py-[4px] dark:hover:bg-gray-700 transition"
              onClick={() => changeTab("members")}
            >
              길드원
            </button>
          </div>

          {currentTab === "banner" && (
            <div className="flex flex-col w-full gap-[24px]">
              {/* 소개글 블럭 */}
              <div className="w-full bg-white dark:bg-dark rounded-[12px] p-[24px] shadow-md flex flex-col gap-[12px]">
                <h2 className="text-[20px] font-bold text-brandcolor">
                  📣 길드 소개
                </h2>
                <p className="text-[16px] leading-relaxed whitespace-pre-wrap dark:text-white">
                  {guild?.guildDescription ??
                    "아직 길드 소개가 작성되지 않았습니다."}
                </p>
              </div>

              {/* 배너 이미지 블럭 */}
              <div className="w-full bg-white dark:bg-dark rounded-[12px] p-[24px] shadow-md flex justify-center items-center min-h-[200px]">
                {guild?.guildBanner ? (
                  <img
                    src={`${constant.SERVER_URL}/${guild.guildBanner}`}
                    alt="Guild Banner"
                    className="rounded-[12px]"
                  />
                ) : (
                  <p className="text-gray-400 text-sm">
                    등록된 배너가 없습니다.
                  </p>
                )}
              </div>
            </div>
          )}

          {currentTab === "guildInfo" && (
            <div className="flex flex-col gap-[12px]">
              <div className="flex w-full gap-[12px]">
                <GuildSummeryRecord
                  guildVictory={guild?.guildRecord?.recordVictory}
                  guildDefeat={guild?.guildRecord?.recordDefeat}
                />
                <GuildDetail
                  guildVictory={guild?.guildRecord?.recordVictory}
                  guildDefeat={guild?.guildRecord?.recordDefeat}
                  guildLadder={guild?.guildRecord?.recordLadder}
                  guildRank={guild?.guildRecord?.recordRanking}
                />
              </div>
              {guild ? (
                <div className="w-full flex flex-col gap-[12px]">
                  {battleDataList.map((battle) => (
                    <GuildFightRecord
                      key={battle.id}
                      battleData={battle}
                      guildName={guild?.guildName}
                    />
                  ))}
                </div>
              ) : (
                <p>길드 정보를 불러오는 중입니다...</p>
              )}

              {battleDataList.length < totalPage && (
                <button
                  className="w-full py-[4px] border rounded-[12px]"
                  onClick={fetchBattleData}
                >
                  더보기
                </button>
              )}
            </div>
          )}
          {currentTab === "members" && (
            <div className="flex flex-col w-full overflow-x-auto">
              <div className="min-w-[600px]">
                <div className="flex bg-[#7b92e0] text-white font-semibold text-[13px] p-[8px] text-center rounded-t-md">
                  <div className="flex-[1]">닉네임</div>
                  <div className="flex-[2]">소환사명</div>
                  <div className="flex-[1]">티어</div>
                  <div className="flex-[1]">라인</div>
                </div>

                {guild?.guildMembers.map((member, idx) => (
                  <div
                    key={idx}
                    className={
                      "flex text-[14px] items-center text-center p-[8px] border-b border-[#a9bbee] dark:border-[#3b476d] bg-[#f4f6fd] dark:bg-black"
                    }
                  >
                    <div className="flex-[1] font-bold">
                      {member.memberName}
                    </div>
                    <div className="flex-[2] font-bold">
                      {member.memberGame?.gameName}
                    </div>
                    <div className="flex-[1] flex items-center justify-center gap-[6px]">
                      {member.memberGame && (
                        <>
                          <img
                            src={`${constant.SERVER_URL}/public/rank/${
                              member.memberGame?.gameTier.split(" ")[0]
                            }.png`}
                            alt="rank"
                            className="w-[25px] h-[25px]"
                          />
                          <span
                            className={getTierStyle(
                              member.memberGame?.gameTier
                            )}
                          >
                            {member.memberGame?.gameTier}
                          </span>
                        </>
                      )}
                    </div>
                    <div className="flex-[1] flex items-center gap-[4px] justify-center">
                      {member.memberGame && (
                        <>
                          <img
                            src={`${constant.SERVER_URL}/public/ranked-positions/${member.memberGame?.line}.png`}
                            alt="line"
                            className="w-[25px] h-[25px]"
                          />
                          <span>{member.memberGame?.line}</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

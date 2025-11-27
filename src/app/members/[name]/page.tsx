"use client";

import {
  findMemberByName,
  refreshMemberSummonerInfo,
} from "@/src/api/member.api";
import constant from "@/src/common/constant/constant";
import { MemberPublicDto } from "@/src/common/DTOs/member/member.dto";
import { useIsMobile } from "@/src/hooks/useMediaQuery";
import {
  formatElapsedTime,
  getTierStyle,
} from "@/src/utils/string/string.util";
import Image from "next/image";
import { useEffect, useState } from "react";

type PageProps = {
  name: string;
};

export default function Page({ params }: { params: PageProps }) {
  const isMobile = useIsMobile();
  const name = decodeURIComponent(params.name);
  const [member, setMember] = useState<MemberPublicDto>();
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

  const handleRefreshSummonerInfo = () => {
    if (member) {
      refreshMemberSummonerInfo(member.memberGame!.gameName!).then(
        (response) => {
          const updatedMember = {
            ...member,
            memberGame: response.data.data.memberGame,
          };
          setMember(updatedMember);
        }
      );
    }
  };

  if (!member) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="flex max-w-[1200px] h-full mx-auto w-full py-[28px] gap-[24px] ">
      <div className="w-full flex flex-col items-center gap-[12px] p-[12px] border rounded-[12px] shadow-md bg-white dark:bg-dark dark:border-branddarkborder relative overflow-hidden">
        <div className={"w-full h-[280px] relative"}>
          <Image
            src={`${
              member.memberItem?.banner
                ? `${constant.SERVER_URL}/${member.memberItem.banner}`
                : `${constant.SERVER_URL}/public/default-banner.png`
            }`}
            alt="member-banner"
            width={1000}
            height={1000}
            className="w-full h-full object-cover rounded-[12px] opacity-80"
          />
        </div>

        <div className="flex w-full items-center justify-between gap-[12px] p-[12px] rounded-[12px] mt-[-60px] relative z-10 bg-white/90 dark:bg-dark shadow-md backdrop-blur-sm border dark:border-branddarkborder">
          <div className="flex flex-col gap-[16px] flex-[1]">
            <div className="flex items-center justify-between gap-[12px] w-full">
              <div className="flex items-center gap-[12px]">
                <div className={`${member.memberItem?.border}`}>
                  <Image
                    src={`${constant.SERVER_URL}/${member.memberIcon}`}
                    alt={member.memberName}
                    width={130}
                    height={130}
                    className={`${
                      isMobile ? "w-[100px] h-[100px]" : "w-[130px] h-[130px]"
                    } object-cover rounded-[12px]`}
                  />
                </div>
                <div className="flex flex-col gap-[4px]">
                  <p
                    className={`font-bold text-gray-900 dark:text-gray-100 ${
                      isMobile ? "text-[20px]" : "text-[26px]"
                    } ${member.memberItem?.effect}`}
                  >
                    {member.memberName}
                  </p>
                  <p
                    className={`text-gray-500 ${
                      isMobile ? "text-[10px]" : "text-[14px]"
                    }`}
                  >
                    가입일 : {member.createdAt?.toString().split("T")[0]}
                  </p>
                  {member.memberGame && (
                    <button
                      disabled={isDisabled}
                      onClick={() => !isDisabled && handleRefreshSummonerInfo()}
                      className={`rounded-[8px] font-medium transition-all duration-200 ${
                        isDisabled
                          ? "bg-gray-400 text-white cursor-not-allowed"
                          : "bg-brandcolor hover:bg-brandhover dark:bg-branddark dark:hover:bg-brandgray text-white shadow-md hover:shadow-lg"
                      } ${
                        isMobile
                          ? "text-[12px] px-[8px] py-[4px]"
                          : "text-[14px] px-[12px] py-[4px]"
                      }`}
                    >
                      티어 갱신
                    </button>
                  )}
                  <p className="text-[10px] text-gray-500">
                    {member?.memberGame?.updatedAt
                      ? formatElapsedTime(member.memberGame.updatedAt)
                      : "-"}
                  </p>
                </div>
              </div>
            </div>

            {member.memberGame && (
              <div className="flex items-center gap-[12px] p-[12px] rounded-[12px] bg-gray-50 dark:bg-branddark border dark:border-branddarkborder shadow-sm">
                <Image
                  src={`${constant.SERVER_URL}/public/rank/${
                    member.memberGame.gameTier!.split(" ")[0]
                  }.png`}
                  alt="Tier"
                  width={80}
                  height={80}
                  className={`object-contain ${
                    isMobile ? "w-[60px] h-[60px]" : "w-[80px] h-[80px]"
                  }`}
                />

                <div className="flex flex-col gap-[6px]">
                  <span
                    className={`${getTierStyle(
                      member.memberGame.gameTier!.split(" ")[0]
                    )} ${
                      isMobile ? "text-[14px]" : "text-[16px]"
                    } font-semibold`}
                  >
                    {member.memberGame.gameTier}
                  </span>

                  <div
                    className={`text-gray-700 dark:text-gray-300 flex gap-[8px] ${
                      isMobile ? "text-[12px]" : "text-[14px]"
                    }`}
                  >
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

          {!isMobile && <div className="w-[410px] h-[230px]"></div>}
        </div>

        {member.memberGuild && (
          <div className="flex items-center w-full gap-[12px] p-[12px] rounded-[12px] dark:bg-dark border dark:border-branddarkborder shadow-lg">
            <Image
              src={`${constant.SERVER_URL}/${member.memberGuild.guildIcon}`}
              alt="guild icon"
              width={130}
              height={130}
              className={`${
                isMobile ? "w-[100px] h-[100px]" : "w-[130px] h-[130px]"
              } object-cover rounded-[12px]`}
            />

            <div className="flex flex-col justify-center flex-1 gap-[8px]">
              <div className="flex flex-col gap-[4px]">
                <p
                  className={`text-gray-500 ${
                    isMobile ? "text-[10px]" : "text-[14px]"
                  }`}
                >
                  [길드]
                </p>
                <p
                  className={`font-bold text-gray-900 dark:text-gray-100 ${
                    isMobile ? "text-[20px]" : "text-[22px]"
                  }`}
                >
                  {member.memberGuild.guildName}
                </p>
              </div>

              <div
                className={`flex flex-wrap gap-[6px] ${
                  isMobile ? "text-[10px]" : "text-[12px]"
                }`}
              >
                <p className="px-[8px] py-[2px] rounded-[8px] bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                  순위 #{member.memberGuild.guildRecord?.recordRanking ?? "-"}
                </p>
                <p className="px-[8px] py-[2px] rounded-[8px] bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                  래더점수 : {member.memberGuild.guildRecord?.recordLadder ?? 0}{" "}
                  점
                </p>
                <p className="px-[8px] py-[2px] rounded-[8px] bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                  티어 :
                  <span
                    className={`${getTierStyle(member.memberGuild.guildTier)}`}
                  >
                    {member.memberGuild.guildTier}
                  </span>
                </p>

                <p className="px-[8px] py-[2px] rounded-[8px] bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                  {member.memberGuild.guildRecord?.recordVictory ?? 0} 승 /{" "}
                  {member.memberGuild.guildRecord?.recordDefeat ?? 0} 패
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 🎖 배지 섹션 */}
        <div className="w-full flex flex-col items-center justify-center p-[12px] border border-dashed border-gray-300 dark:border-branddarkborder rounded-[12px] text-gray-500 dark:text-gray-400 bg-transparent">
          <p className="text-center text-[14px] leading-[20px]">
            🏅 아직 획득한 배지가 없습니다.
            <br />
            개발중입니다.
          </p>
        </div>
      </div>
    </div>
  );
}

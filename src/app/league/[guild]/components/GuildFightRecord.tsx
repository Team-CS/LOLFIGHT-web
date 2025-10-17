"use client";
import React, { useEffect, useState } from "react";
import { SlArrowDown } from "react-icons/sl";

import GuildFightDetail from "./GuildFightDetail";
import GuildFightMember from "./GuildFightMember";
import { BattleDto } from "@/src/common/DTOs/battle/battle.dto";
import constant from "@/src/common/constant/constant";
import { getGuildInfo } from "@/src/api/guild.api";
import { GuildDto } from "@/src/common/DTOs/guild/guild.dto";
import { useIsMobile } from "@/src/hooks/useMediaQuery";

interface Props {
  battleData: BattleDto;
  guildName: string;
}
const GuildFightRecord = (props: Props) => {
  const isMobile = useIsMobile();
  const { battleData, guildName } = props;
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [myTeamData, enemyTeamData] =
    battleData.redTeam.guild.guildName === guildName
      ? [battleData.redTeam, battleData.blueTeam]
      : [battleData.blueTeam, battleData.redTeam];
  const result = myTeamData.isWinning ? "win" : "lose";
  const [homeGuild, setHomeGuild] = useState<GuildDto>();
  const [awayGuild, setawayGuild] = useState<GuildDto>();

  useEffect(() => {
    getGuildInfo(myTeamData.guild.guildName).then((response) => {
      setHomeGuild(response.data.data);
    });
    getGuildInfo(enemyTeamData.guild.guildName).then((response) => {
      setawayGuild(response.data.data);
    });
  }, []);

  const clickDetailFight = () => {
    setShowDetails(!showDetails);
  };

  const getTimeDifference = () => {
    const createdAt = new Date(props.battleData.createdAt!);
    const now = new Date();
    const diffInMilliseconds = now.getTime() - createdAt.getTime();
    const diffInSeconds = Math.floor(diffInMilliseconds / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds}초 전`;
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)}분 전`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)}시간 전`;
    } else {
      return `${Math.floor(diffInSeconds / 86400)}일 전`;
    }
  };

  const getPlayTime = () => {
    const playTime = props.battleData.battleLength;
    const minutes = Math.floor(playTime / 60);
    const seconds = playTime % 60;

    return `${minutes}분 ${seconds}초`;
  };

  return (
    <div>
      <div
        className={`w-full h-[130px] flex border shadow rounded-[12px] p-[4px] ${
          result === "win"
            ? "border-winLightBorder bg-winLightColor dark:border-winDarkBorder dark:bg-winDarkColor"
            : "border-loseLightBorder bg-loseLightColor dark:border-loseDarkBorder dark:bg-loseDarkColor"
        } ${isMobile && "flex-col"}`}
      >
        {/* 1 */}
        {isMobile ? (
          <div className={`min-w-[130px] flex justify-between p-[4px]`}>
            <div className="flex gap-[12px] items-center">
              <p
                className={`font-extrabold text-[12px] ${
                  result === "win"
                    ? "text-winLightText dark:text-winDarkText"
                    : "text-loseLightText dark:text-loseDarkText"
                }`}
              >
                {result === "win" ? "승리" : "패배"}
              </p>
              <p className="font-light text-[10px]">{getPlayTime()}</p>
            </div>

            <div className="flex gap-[12px] items-center">
              <p className="font-extrabold text-[12px]">소환사의 협곡</p>
              <p className="font-light text-[10px]">{getTimeDifference()}</p>
              <button
                aria-label="상세보기"
                className=" items-center justify-center text-[12px] gap-[12px]"
                onClick={clickDetailFight}
              >
                <SlArrowDown />
              </button>
            </div>
          </div>
        ) : (
          <div
            className={`min-w-[130px] flex flex-col justify-center items-center p-[12px]`}
          >
            <p className="font-extrabold text-[16px]">소환사의 협곡</p>
            <p className="font-light text-[12px]">{getPlayTime()}</p>
            <p
              className={`font-extrabold text-[18px] ${
                result === "win"
                  ? "text-winLightText dark:text-winDarkText"
                  : "text-loseLightText dark:text-loseDarkText"
              }`}
            >
              {result === "win" ? "승리" : "패배"}
            </p>
            <p className="font-light text-[12px]">{getTimeDifference()}</p>
          </div>
        )}

        {/* 2 */}
        <div className="flex h-full">
          <div className="flex w-[400px] justify-between items-center gap-[12px] p-[12px]">
            <div className="flex flex-col w-full items-center gap-[8px]">
              <div className="flex items-center gap-[8px]">
                <img
                  src={`${constant.SERVER_URL}/${myTeamData.guild.guildIcon}`}
                  alt="GuildBanner"
                  className="w-[30px] h-[30px] rounded-[4px] object-cover shrink-0"
                />
                <p
                  className={`font-bold truncate ${
                    isMobile
                      ? "text-[12px] max-w-[60px]"
                      : "text-[16px] max-w-[120px]"
                  }`}
                >
                  {myTeamData.guild.guildName}
                </p>
              </div>
              <p className="font-light text-gray-600 text-[12px]">
                1부리그 {homeGuild?.guildRecord?.recordLadder}점
              </p>
            </div>

            <p className="font-normal text-[12px]">VS</p>

            <div className="flex flex-col w-full items-center gap-[8px]">
              <div className="flex items-center gap-[8px]">
                <img
                  src={`${constant.SERVER_URL}/${enemyTeamData.guild.guildIcon}`}
                  alt="GuildBanner"
                  className="w-[30px] h-[30px] rounded-[4px] object-cover shrink-0"
                />
                <p
                  className={`font-bold truncate ${
                    isMobile
                      ? "text-[12px] max-w-[60px]"
                      : "text-[16px] max-w-[120px]"
                  }`}
                >
                  {enemyTeamData.guild.guildName}
                </p>
              </div>
              <p className="font-light text-gray-600 text-[12px]">
                1부리그 {awayGuild?.guildRecord?.recordLadder}점
              </p>
            </div>
          </div>

          {/* 3 */}
          <div className="w-[120px] flex flex-col items-center justify-center">
            <p className="font-bold">래더</p>
            <p
              className={`font-extrabold text-20px ${
                result === "win"
                  ? "text-winLightText dark:text-winDarkText"
                  : "text-loseLightText dark:text-loseDarkText"
              }`}
            >
              {result === "win"
                ? `+${myTeamData.point}점`
                : `${myTeamData.point}점`}
            </p>
          </div>

          {/* 4 */}
          {!isMobile && (
            <div className="w-[500px] p-[8px]">
              <GuildFightMember battleData={props.battleData} />
            </div>
          )}

          {/* 5 */}
          {!isMobile && (
            <div
              className={`flex min-w-[45px] border-l justify-center items-center cursor-pointer text-[12px] ${
                result === "win"
                  ? "border-winLightBorder dark:border-winDarkBorder"
                  : "border-loseLightBorder dark:border-loseDarkBorder"
              }`}
              onClick={clickDetailFight}
            >
              <SlArrowDown />
            </div>
          )}
        </div>
      </div>
      {showDetails && (
        <div className="w-full h-full">
          <GuildFightDetail
            battleData={props.battleData}
            guildName={guildName}
          />
        </div>
      )}
    </div>
  );
};

export default GuildFightRecord;

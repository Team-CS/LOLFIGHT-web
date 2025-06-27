"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { SlArrowDown } from "react-icons/sl";

import GuildFightDetail from "./GuildFightDetail";
import GuildFightMember from "./GuildFightMember";
import { BattleDTO } from "@/src/common/DTOs/battle/battle.dto";
import constant from "@/src/common/constant/constant";
import { getGuildInfo } from "@/src/api/guild.api";
import { GuildDto } from "@/src/common/DTOs/guild/guild.dto";
import { BattlePlayerDTO } from "@/src/common/DTOs/battle/battle_player.dto";

interface Props {
  battleData: BattleDTO;
}
const GuildFightRecord = (props: Props) => {
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const result = props.battleData.teamA.isWinning ? "win" : "lose";
  const [homeGuild, setHomeGuild] = useState<GuildDto>();
  const [awayGuild, setawayGuild] = useState<GuildDto>();

  useEffect(() => {
    getGuildInfo(props.battleData.teamA.guildName).then((response) => {
      setHomeGuild(response.data.data);
    });
    getGuildInfo(props.battleData.teamB.guildName).then((response) => {
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
        className={`max-w-[1200px] h-[130px] flex border shadow ${
          result === "win"
            ? "border-blue-300 bg-blue-100"
            : "border-red-300 bg-red-100"
        }`}
      >
        {/* 1 */}
        <div className="w-[130px] flex flex-col justify-center items-center p-[12px]">
          <p className="font-extrabold text-[16px] text-black">소환사의 협곡</p>
          <p className="font-light text-[12px] text-black">{getPlayTime()}</p>
          <p
            className={`font-extrabold text-[18px] ${
              result === "win" ? "text-blue-500" : "text-red-500"
            }`}
          >
            {result === "win" ? "승리" : "패배"}
          </p>
          <p className="font-light text-[12px] text-black">
            {getTimeDifference()}
          </p>
        </div>

        {/* 2 */}
        <div className="flex w-400px justify-between items-center text-black gap-[12px] p-[12px]">
          <div className="flex flex-col w-full items-center gap-[8px]">
            <div className="flex items-center gap-[8px]">
              <img
                src={`${constant.SERVER_URL}/public/guild/${props.battleData.teamA.guildName}.png`}
                alt="GuildBanner"
                className="w-[30px] h-[30px] rounded-[4px] object-cover"
              />
              <p className="font-bold text-[16px]">
                {props.battleData.teamA.guildName}
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
                src={`${constant.SERVER_URL}/public/guild/${props.battleData.teamB.guildName}.png`}
                alt="GuildBanner"
                className="w-[30px] h-[30px] rounded-[4px] object-cover"
              />
              <p
                className={`font-bold ${
                  props.battleData.teamB.guildName.length > 8
                    ? "text-[10px]"
                    : "text-[16px]"
                }`}
              >
                {props.battleData.teamB.guildName}
              </p>
            </div>
            <p className="font-light text-gray-600 text-[12px]">
              1부리그 {awayGuild?.guildRecord?.recordLadder}점
            </p>
          </div>
        </div>

        {/* 3 */}
        <div className="w-120px flex flex-col items-center justify-center text-black">
          <p className="font-bold">래더</p>
          <p
            className={`font-extrabold text-20px ${
              result === "win" ? "text-blue-500" : "text-red-500"
            }`}
          >
            {result === "win"
              ? `+${props.battleData.teamA.point}점`
              : `${props.battleData.teamA.point}점`}
          </p>
        </div>

        {/* 4 */}
        <div className="w-500px p-2 text-black">
          <GuildFightMember battleData={props.battleData} />
        </div>

        {/* 5 */}
        <div
          className={`w-80px flex flex-col border-l justify-center items-center ${
            result === "win" ? "border-blue-300" : "border-red-300 "
          }`}
        >
          <button
            aria-label="상세보기"
            className="flex flex-col w-full h-full items-center justify-center text-black"
            onClick={clickDetailFight}
          >
            상세보기
            <SlArrowDown className="mt-5" />
          </button>
        </div>
      </div>
      {showDetails && (
        <div className="w-full h-full pb-2">
          <GuildFightDetail battleData={props.battleData} />
        </div>
      )}
    </div>
  );
};

export default GuildFightRecord;

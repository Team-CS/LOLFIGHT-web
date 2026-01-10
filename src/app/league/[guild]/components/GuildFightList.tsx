import React, { useEffect, useState } from "react";
import GuildFightBox from "./GuildFightBox";
import { BattleTeamDto } from "@/src/common/DTOs/battle/battle_team.dto";
import constant from "@/src/common/constant/constant";
import { getGuildInfo } from "@/src/api/guild.api";
import { GuildDto } from "@/src/common/DTOs/guild/guild.dto";
import Image from "next/image";

interface Props {
  battleTeamData: BattleTeamDto;
  highestDamage: number;
}

const GuildFightList = (props: Props) => {
  const { battleTeamData, highestDamage } = props;
  const result = battleTeamData.isWinning ? "win" : "lose";
  const highestChampionDamage = highestDamage;
  const [guildData, setGuildData] = useState<GuildDto>();

  useEffect(() => {
    if (battleTeamData.guild?.guildName) {
      getGuildInfo(battleTeamData.guild.guildName).then((response) => {
        setGuildData(response.data.data);
      });
    }
  }, []);

  const objectives = [
    { key: "baronCount", icon: "baron" },
    { key: "dragonCount", icon: "dragon" },
    { key: "riftHeraldCount", icon: "herald" },
    { key: "hordeCount", icon: "horde" },
    { key: "inhibitorCount", icon: "inhibitor" },
    { key: "destroyedTowerCount", icon: "tower" },
  ];

  const playerPositions = [
    battleTeamData.topPlayer,
    battleTeamData.junglePlayer,
    battleTeamData.midPlayer,
    battleTeamData.adcPlayer,
    battleTeamData.supportPlayer,
  ];

  return (
    <div className="w-full h-full flex flex-col drop-shadow-md">
      {/* 1 */}
      <div
        className={`w-full h-full flex py-[4px] px-[8px] justify-between ${
          result === "win"
            ? "bg-[#9ac4fc] dark:bg-[#2d3b6e]"
            : "bg-[#fc9797] dark:bg-[#612f41]"
        }`}
      >
        <div className="flex gap-[12px] items-center">
          <p
            className={`font-extrabold ${
              result === "win"
                ? "text-winLightText dark:winDarkText"
                : "text-loseLightText dark:text-loseDarkText"
            }`}
          >
            {result === "win" ? "승리" : "패배"}
          </p>
          {battleTeamData.guild?.guildIcon ? (
            <Image
              src={`${constant.SERVER_URL}/${battleTeamData.guild.guildIcon}`}
              alt="GuildBanner"
              width={25}
              height={25}
              className="w-[25px] h-[25px] rounded-[4px] object-cover"
            />
          ) : (
            <div className="w-[25px] h-[25px] rounded-[4px] bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-[12px]">
              🏛️
            </div>
          )}
          <p className="font-semibold">
            {battleTeamData.guild?.guildName || "해체된 길드"}
          </p>
        </div>

        <div className="flex gap-[12px] items-center">
          <div className="flex items-center gap-[4px]">
            {objectives.map(({ key, icon }) => (
              <>
                <Image
                  key={key}
                  src={`${constant.SERVER_URL}/public/objects/${icon}-${
                    result === "win" ? "blue" : "red"
                  }.png`}
                  alt="object-icon"
                  width={15}
                  height={15}
                  className={`w-[15px] h-[15px]`}
                />
                <p className="text-[12px]">
                  {
                    battleTeamData[
                      key as
                        | "baronCount"
                        | "dragonCount"
                        | "riftHeraldCount"
                        | "hordeCount"
                        | "inhibitorCount"
                        | "destroyedTowerCount"
                    ]
                  }
                </p>
              </>
            ))}
          </div>

          <div className="flex gap-[4px]">
            {battleTeamData.bans.map((ban, index) => (
              <Image
                key={index}
                src={`${constant.SERVER_URL}/public/champions/${ban}.png`}
                alt="ban-champion"
                width={20}
                height={15}
                className="rounded-[4px]"
              />
            ))}
          </div>

          <p className="text-[14px] text-gray-500">
            1부리그 - {guildData?.guildRecord?.recordLadder || battleTeamData.guild?.guildRecord?.recordLadder || 0}점
          </p>
        </div>
      </div>

      {/* 2 */}
      <div className="w-full flex px-[8px] gap-[12px] text-[12px] dark:text-white">
        <div className="flex-[2.5]">플레이어</div>
        <div className="flex-[0.5]">S/R</div>
        <div className="flex-[1.2]">KDA</div>
        <div className="flex-[2.2]">피해량</div>
        <div className="flex-[0.6]">LV/CS</div>
        <div className="flex-[0.6]">시야점수</div>
        <div className="flex-[3.5]">아이템</div>
      </div>

      {/* 3 */}

      <div
        className={`flex flex-col gap-[4px] justify-center py-[4px] ${
          result === "win"
            ? "bg-winLightColor dark:bg-winDarkColor"
            : "bg-loseLightColor dark:bg-loseDarkColor"
        }`}
      >
        {playerPositions.map((player, idx) => (
          <GuildFightBox
            key={idx}
            battlePlayerData={player}
            isResult={battleTeamData.isWinning}
            guild={battleTeamData.guild || null}
            highestDamage={highestChampionDamage}
          />
        ))}
      </div>
    </div>
  );
};

export default GuildFightList;

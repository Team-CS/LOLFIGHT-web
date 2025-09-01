import React, { useEffect, useState } from "react";
import { BattleTeamDTO } from "@/src/common/DTOs/battle/battle_team.dto";
import constant from "@/src/common/constant/constant";
import { getGuildInfo } from "@/src/api/guild.api";
import { GuildDto } from "@/src/common/DTOs/guild/guild.dto";
import { useIsMobile } from "@/src/hooks/useMediaQuery";
import GuildFightBoxMobile from "./GuildFightBoxMobile";

interface Props {
  battleTeamData: BattleTeamDTO;
  highestDamage: number;
}

const GuildFightListMobile = (props: Props) => {
  const { battleTeamData, highestDamage } = props;
  const result = battleTeamData.isWinning ? "win" : "lose";
  const highestChampionDamage = highestDamage;
  const [guildData, setGuildData] = useState<GuildDto>();

  useEffect(() => {
    getGuildInfo(battleTeamData.guild.guildName).then((response) => {
      setGuildData(response.data.data);
    });
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
        className={`w-full h-full flex flex-col py-[4px] px-[8px] justify-between gap-[4px] ${
          result === "win"
            ? "bg-[#9ac4fc] dark:bg-[#2d3b6e]"
            : "bg-[#fc9797] dark:bg-[#612f41]"
        }`}
      >
        <div className="flex justify-between items-center">
          <div className="flex gap-[12px] items-center">
            <p
              className={`font-extrabold text-[12px] ${
                result === "win"
                  ? "text-winLightText dark:winDarkText"
                  : "text-loseLightText dark:text-loseDarkText"
              }`}
            >
              {result === "win" ? "승리" : "패배"}
            </p>
            <img
              src={`${constant.SERVER_URL}/${battleTeamData.guild.guildIcon}`}
              alt="GuildBanner"
              className="w-[20px] h-[20px] rounded-[4px] object-cover"
            />
            <p className="font-semibold text-[12px]">
              {battleTeamData.guild.guildName}
            </p>
          </div>

          <div className="flex gap-[12px] items-center">
            <p className="text-[10px] text-gray-500">
              1부리그 - {guildData?.guildRecord?.recordLadder}점
            </p>
          </div>
        </div>

        <div className="flex gap-[8px]">
          {objectives.map(({ key, icon }) => (
            <div key={key} className="flex items-center gap-[4px]">
              <img
                src={`${constant.SERVER_URL}/public/objects/${icon}-${
                  result === "win" ? "blue" : "red"
                }.png`}
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
            </div>
          ))}
        </div>
      </div>

      {/* 2 */}
      <div
        className={`flex flex-col gap-[4px] py-[4px] ${
          result === "win"
            ? "bg-winLightColor dark:bg-winDarkColor"
            : "bg-loseLightColor dark:bg-loseDarkColor"
        }`}
      >
        {playerPositions.map((player, idx) => (
          <GuildFightBoxMobile
            key={idx}
            battlePlayerData={player}
            isResult={battleTeamData.isWinning}
            guild={battleTeamData.guild}
            highestDamage={highestChampionDamage}
          />
        ))}
      </div>
    </div>
  );
};

export default GuildFightListMobile;

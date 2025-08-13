import React, { useEffect, useState } from "react";
import GuildFightBox from "./GuildFightBox";
import { BattleTeamDTO } from "@/src/common/DTOs/battle/battle_team.dto";
import constant from "@/src/common/constant/constant";
import { getGuildInfo } from "@/src/api/guild.api";
import { GuildDto } from "@/src/common/DTOs/guild/guild.dto";

interface Props {
  battleTeamData: BattleTeamDTO;
}

const GuildFightList = (props: Props) => {
  const { battleTeamData } = props;
  const result = battleTeamData.isWinning ? "win" : "lose";
  const highestChampionDamage = findHighestDamagePlayer(battleTeamData);
  const [guildData, setGuildData] = useState<GuildDto>();
  useEffect(() => {
    getGuildInfo(battleTeamData.guild.guildName).then((response) => {
      setGuildData(response.data.data);
    });
  }, []);
  return (
    <div className="w-full h-full flex flex-col drop-shadow-md text-black">
      {/* 1 */}
      <div
        className={`w-full h-full flex py-[4px] px-[8px] justify-between ${
          result === "win" ? "bg-blue-300" : "bg-red-300"
        }`}
      >
        <div className="flex gap-[12px] items-center">
          <p
            className={`font-extrabold ${
              result === "win" ? "text-blue-500" : "text-red-500"
            }`}
          >
            {result === "win" ? "승리" : "패배"}
          </p>
          <img
            src={`${constant.SERVER_URL}/${battleTeamData.guild.guildIcon}`}
            alt="GuildBanner"
            className="w-[25px] h-[25px] rounded-[4px] object-cover"
          />
          <p className="font-semibold">{battleTeamData.guild.guildName}</p>
        </div>

        <div className="flex gap-[12px] items-center">
          {/* Baron */}
          <div className="flex items-center gap-[4px]">
            <img
              src={`${constant.SERVER_URL}/public/objects/${
                result === "win" ? "baron-blue.png" : "baron-red.png"
              }`}
              className="w-[15px] h-[15px]"
            />
            <p className="text-[12px]">{battleTeamData.baronCount}</p>
          </div>
          {/* Baron */}
          <div className="flex items-center gap-[4px]">
            <img
              src={`${constant.SERVER_URL}/public/objects/${
                result === "win" ? "baron-blue.png" : "baron-red.png"
              }`}
              className="w-[15px] h-[15px]"
            />
            <p className="text-[12px]">{battleTeamData.baronCount}</p>
          </div>
          {/* Dragon */}
          <div className="flex items-center gap-[4px]">
            <img
              src={`${constant.SERVER_URL}/public/objects/${
                result === "win" ? "dragon-blue.png" : "dragon-red.png"
              }`}
              className="w-[15px] h-[15px]"
            />
            <p className="text-[12px]">{battleTeamData.dragonCount}</p>
          </div>
          {/* Herald */}
          <div className="flex items-center gap-[4px]">
            <img
              src={`${constant.SERVER_URL}/public/objects/${
                result === "win" ? "herald-blue.png" : "herald-red.png"
              }`}
              className="w-[15px] h-[15px]"
            />
            <p className="text-[12px]">{battleTeamData.riftHeraldCount}</p>
          </div>
          {/* Horde */}
          <div className="flex items-center gap-[4px]">
            <img
              src={`${constant.SERVER_URL}/public/objects/${
                result === "win" ? "horde-blue.png" : "horde-red.png"
              }`}
              className="w-[15px] h-[15px]"
            />
            <p className="text-[12px]">{battleTeamData.hordeCount}</p>
          </div>
          {/* Inhibitor */}
          <div className="flex items-center gap-[4px]">
            <img
              src={`${constant.SERVER_URL}/public/objects/${
                result === "win" ? "inhibitor-blue.png" : "inhibitor-red.png"
              }`}
              className="w-[15px] h-[15px]"
            />
            <p className="text-[12px]">{battleTeamData.inhibitorCount}</p>
          </div>
          {/* Tower */}
          <div className="flex items-center gap-[4px]">
            <img
              src={`${constant.SERVER_URL}/public/objects/${
                result === "win" ? "tower-blue.png" : "tower-red.png"
              }`}
              className="w-[17px] h-[17px]"
            />
            <p className="text-[12px]">{battleTeamData.destroyedTowerCount}</p>
          </div>
          <p className="text-[14px] text-gray-500">
            1부리그 - {guildData?.guildRecord?.recordLadder}점
          </p>
        </div>
      </div>

      {/* 2 */}
      <div className="w-full flex px-[8px] gap-[12px] text-[12px] dark:text-white">
        <div className="w-[250px]">플레이어</div>
        <div className="w-[50px]">S/R</div>
        <div className="w-[120px]">KDA</div>
        <div className="w-[220px]">피해량</div>
        <div className="w-[60px]">LV/CS</div>
        <div className="w-[60px]">시야점수</div>
        <div className="w-[350px]">아이템</div>
      </div>

      {/* 3 */}

      <GuildFightBox
        battlePlayerData={battleTeamData.topPlayer}
        isResult={battleTeamData.isWinning}
        guild={battleTeamData.guild}
        highestDamage={highestChampionDamage}
      />
      <GuildFightBox
        battlePlayerData={battleTeamData.junglePlayer}
        isResult={battleTeamData.isWinning}
        guild={battleTeamData.guild}
        highestDamage={highestChampionDamage}
      />
      <GuildFightBox
        battlePlayerData={battleTeamData.midPlayer}
        isResult={battleTeamData.isWinning}
        guild={battleTeamData.guild}
        highestDamage={highestChampionDamage}
      />
      <GuildFightBox
        battlePlayerData={battleTeamData.adcPlayer}
        isResult={battleTeamData.isWinning}
        guild={battleTeamData.guild}
        highestDamage={highestChampionDamage}
      />
      <GuildFightBox
        battlePlayerData={battleTeamData.supportPlayer}
        isResult={battleTeamData.isWinning}
        guild={battleTeamData.guild}
        highestDamage={highestChampionDamage}
      />
    </div>
  );
};

// 가장 높은 피해량을 가진 플레이어를 찾는 함수
const findHighestDamagePlayer = (teamData: BattleTeamDTO) => {
  let highestDamage = 0;

  for (const player of [
    teamData.topPlayer,
    teamData.junglePlayer,
    teamData.midPlayer,
    teamData.adcPlayer,
    teamData.supportPlayer,
  ]) {
    if (player?.totalChampionsDamage > highestDamage) {
      highestDamage = player.totalChampionsDamage;
    }
  }

  return highestDamage;
};

export default GuildFightList;

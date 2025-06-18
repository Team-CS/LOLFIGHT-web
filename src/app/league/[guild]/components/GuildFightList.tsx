import React, { useEffect, useState } from "react";
import GuildFightBox from "./GuildFightBox";
import { BattleTeamDTO } from "@/src/common/DTOs/battle/battle_team.dto";
import constant from "@/src/common/constant/constant";
import { getGuildInfo } from "@/src/api/guild.api";
import { GuildDTO } from "@/src/common/DTOs/guild/guild.dto";

interface Props {
  battleTeamData: BattleTeamDTO;
}

const GuildFightList = (props: Props) => {
  const result = props.battleTeamData.isWinning ? "win" : "lose";
  const highestChampionDamage = findHighestDamagePlayer(props.battleTeamData);
  const [guildData, setGuildData] = useState<GuildDTO>();
  useEffect(() => {
    getGuildInfo(props.battleTeamData.guildName).then((response) => {
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
        <div className="flex gap-[12px]">
          <p
            className={`font-extrabold ${
              result === "win" ? "text-blue-500" : "text-red-500"
            }`}
          >
            {result === "win" ? "승리" : "패배"}
          </p>
          <img
            src={`${constant.SERVER_URL}/public/guild/${props.battleTeamData.guildName}.png`}
            alt="GuildBanner"
            className="w-[25px] h-[25px] rounded-[4px] object-cover"
          />
          <p className="font-semibold">{props.battleTeamData.guildName}</p>
        </div>
        <p className="text-[14px] text-gray-500">
          1부리그 - {guildData?.guildRecord?.recordLadder}점
        </p>
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
        battlePlayerData={props.battleTeamData.player1}
        result={props.battleTeamData.isWinning}
        guildName={props.battleTeamData.guildName}
        highestDamage={highestChampionDamage}
      />
      <GuildFightBox
        battlePlayerData={props.battleTeamData.player2}
        result={props.battleTeamData.isWinning}
        guildName={props.battleTeamData.guildName}
        highestDamage={highestChampionDamage}
      />
      <GuildFightBox
        battlePlayerData={props.battleTeamData.player3}
        result={props.battleTeamData.isWinning}
        guildName={props.battleTeamData.guildName}
        highestDamage={highestChampionDamage}
      />
      <GuildFightBox
        battlePlayerData={props.battleTeamData.player4}
        result={props.battleTeamData.isWinning}
        guildName={props.battleTeamData.guildName}
        highestDamage={highestChampionDamage}
      />
      <GuildFightBox
        battlePlayerData={props.battleTeamData.player5}
        result={props.battleTeamData.isWinning}
        guildName={props.battleTeamData.guildName}
        highestDamage={highestChampionDamage}
      />
    </div>
  );
};

// 가장 높은 피해량을 가진 플레이어를 찾는 함수
const findHighestDamagePlayer = (teamData: BattleTeamDTO) => {
  let highestDamage = 0;

  for (const player of [
    teamData.player1,
    teamData.player2,
    teamData.player3,
    teamData.player4,
    teamData.player5,
  ]) {
    if (player?.totalChampionsDamage > highestDamage) {
      highestDamage = player.totalChampionsDamage;
    }
  }

  return highestDamage;
};

export default GuildFightList;

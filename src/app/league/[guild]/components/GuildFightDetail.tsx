import React from "react";
import GuildFightList from "./GuildFightList";
import { BattleDto } from "@/src/common/DTOs/battle/battle.dto";
import { useIsMobile } from "@/src/hooks/useMediaQuery";
import GuildFightListMobile from "./GuildFightListMobile";

interface Props {
  battleData: BattleDto;
  guildName: string;
}

const formatDate = (batteDate: Date): string => {
  const date = new Date(batteDate);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  return `${year}년 ${month}월 ${day}일 ${hours}시 ${minutes}분`;
};

const GuildFightDetail = (props: Props) => {
  const isMobile = useIsMobile();
  const { battleData, guildName } = props;
  const [myTeamData, enemyTeamData] =
    battleData.redTeam.guild.guildName === guildName
      ? [battleData.redTeam, battleData.blueTeam]
      : [battleData.blueTeam, battleData.redTeam];

  const highestChampionDamage = findHighestDamagePlayer(battleData);
  return (
    <div className="max-w-[1200px] border flex flex-col shadow py-[12px] bg-white dark:bg-dark border dark:border-gray-700 rounded-[12px]">
      {/* 1 */}
      <div className="flex justify-between text-[14px] items-center px-[4px]">
        <div className="flex gap-[12px]">
          <p className="font-bold">소환사의 협곡</p>
          <p className="text-gray-500">5 vs 5</p>
        </div>
        <p className="text-gray-500 text-[14px]">
          {formatDate(props.battleData.createdAt!)}
        </p>
      </div>

      {/* 2 */}
      {isMobile ? (
        <div>
          <GuildFightListMobile
            battleTeamData={myTeamData}
            highestDamage={highestChampionDamage}
          />
          <GuildFightListMobile
            battleTeamData={enemyTeamData}
            highestDamage={highestChampionDamage}
          />
        </div>
      ) : (
        <div>
          <GuildFightList
            battleTeamData={myTeamData}
            highestDamage={highestChampionDamage}
          />
          <GuildFightList
            battleTeamData={enemyTeamData}
            highestDamage={highestChampionDamage}
          />
        </div>
      )}
    </div>
  );
};

// 가장 높은 피해량을 가진 플레이어를 찾는 함수 (배틀 전체 기준)
const findHighestDamagePlayer = (battleData: BattleDto) => {
  const redTeam = battleData.redTeam;
  const blueTeam = battleData.blueTeam;

  let highestDamage = 0;

  const allPlayers = [
    redTeam.topPlayer,
    redTeam.junglePlayer,
    redTeam.midPlayer,
    redTeam.adcPlayer,
    redTeam.supportPlayer,
    blueTeam.topPlayer,
    blueTeam.junglePlayer,
    blueTeam.midPlayer,
    blueTeam.adcPlayer,
    blueTeam.supportPlayer,
  ];

  for (const player of allPlayers) {
    if (player?.totalChampionsDamage > highestDamage) {
      highestDamage = player.totalChampionsDamage;
    }
  }

  return highestDamage;
};

export default GuildFightDetail;

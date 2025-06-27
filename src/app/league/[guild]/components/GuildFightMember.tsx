import { BattleDTO } from "@/src/common/DTOs/battle/battle.dto";
import constant from "@/src/common/constant/constant";
import React from "react";

interface Props {
  battleData: BattleDTO;
}

const renderPlayerInfo = (
  championId: number | null | undefined,
  playerName: string | null | undefined
) => {
  if (championId == null || undefined || playerName == null || undefined) {
    return <div></div>;
  }
  return (
    <div className="w-full flex gap-1">
      <img
        src={`${constant.SERVER_URL}/public/champions/${championId}.png`}
        alt="Champion"
        width={20}
        height={20}
      />
      <p className="text-14px">{playerName}</p>
    </div>
  );
};

const GuildFightMember = (props: Props) => {
  return (
    <div className="flex">
      <div className="flex flex-col w-[250px] gap-[2px]">
        {renderPlayerInfo(
          props.battleData.teamA.player1?.championId,
          props.battleData.teamA.player1?.summonerName
        )}
        {renderPlayerInfo(
          props.battleData.teamA.player2?.championId,
          props.battleData.teamA.player2?.summonerName
        )}
        {renderPlayerInfo(
          props.battleData.teamA.player3?.championId,
          props.battleData.teamA.player3?.summonerName
        )}
        {renderPlayerInfo(
          props.battleData.teamA.player4?.championId,
          props.battleData.teamA.player4?.summonerName
        )}
        {renderPlayerInfo(
          props.battleData.teamA.player5?.championId,
          props.battleData.teamA.player5?.summonerName
        )}
      </div>
      <div className="flex flex-col w-[250px] gap-[2px]">
        {renderPlayerInfo(
          props.battleData.teamB.player1?.championId,
          props.battleData.teamB.player1?.summonerName
        )}
        {renderPlayerInfo(
          props.battleData.teamB.player2?.championId,
          props.battleData.teamB.player2?.summonerName
        )}
        {renderPlayerInfo(
          props.battleData.teamB.player3?.championId,
          props.battleData.teamB.player3?.summonerName
        )}
        {renderPlayerInfo(
          props.battleData.teamB.player4?.championId,
          props.battleData.teamB.player4?.summonerName
        )}
        {renderPlayerInfo(
          props.battleData.teamB.player5?.championId,
          props.battleData.teamB.player5?.summonerName
        )}
      </div>
    </div>
  );
};

export default GuildFightMember;

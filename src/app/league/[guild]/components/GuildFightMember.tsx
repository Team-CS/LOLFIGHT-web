import { BattleDto } from "@/src/common/DTOs/battle/battle.dto";
import constant from "@/src/common/constant/constant";
import React from "react";

interface Props {
  battleData: BattleDto;
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
      <div className="flex items-center">
        <p className="text-[14px] font-medium">{playerName.split("#")[0]}</p>
        <p className="text-[12px] text-gray-600 font-light">
          #{playerName.split("#")[1]}
        </p>
      </div>
    </div>
  );
};

const GuildFightMember = (props: Props) => {
  const { battleData } = props;
  return (
    <div className="flex">
      <div className="flex flex-col w-[250px] gap-[2px]">
        {renderPlayerInfo(
          battleData.redTeam.topPlayer?.championId,
          battleData.redTeam.topPlayer?.summonerName
        )}
        {renderPlayerInfo(
          battleData.redTeam.junglePlayer?.championId,
          battleData.redTeam.junglePlayer?.summonerName
        )}
        {renderPlayerInfo(
          battleData.redTeam.midPlayer?.championId,
          battleData.redTeam.midPlayer?.summonerName
        )}
        {renderPlayerInfo(
          battleData.redTeam.adcPlayer?.championId,
          battleData.redTeam.adcPlayer?.summonerName
        )}
        {renderPlayerInfo(
          battleData.redTeam.supportPlayer?.championId,
          battleData.redTeam.supportPlayer?.summonerName
        )}
      </div>
      <div className="flex flex-col w-[250px] gap-[2px]">
        {renderPlayerInfo(
          battleData.blueTeam.topPlayer?.championId,
          battleData.blueTeam.topPlayer?.summonerName
        )}
        {renderPlayerInfo(
          battleData.blueTeam.junglePlayer?.championId,
          battleData.blueTeam.junglePlayer?.summonerName
        )}
        {renderPlayerInfo(
          battleData.blueTeam.midPlayer?.championId,
          battleData.blueTeam.midPlayer?.summonerName
        )}
        {renderPlayerInfo(
          battleData.blueTeam.adcPlayer?.championId,
          battleData.blueTeam.adcPlayer?.summonerName
        )}
        {renderPlayerInfo(
          battleData.blueTeam.supportPlayer?.championId,
          battleData.blueTeam.supportPlayer?.summonerName
        )}
      </div>
    </div>
  );
};

export default GuildFightMember;

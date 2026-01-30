import { BattleDto } from "@/src/common/DTOs/battle/battle.dto";
import constant from "@/src/common/constant/constant";
import Image from "next/image";
import React from "react";

interface Props {
  battleData: BattleDto;
}

const renderPlayerInfo = (
  championId: number | null | undefined,
  playerName: string | null | undefined,
) => {
  if (championId == null || undefined || playerName == null || undefined) {
    return <div className="h-[18px]"></div>;
  }
  return (
    <div className="w-full flex gap-[4px] items-center justify-start">
      <Image
        src={`${constant.SERVER_URL}/public/champions/${championId}.png`}
        alt="Champion"
        width={17}
        height={17}
        className="w-[17px] h-[17px] rounded-[2px] shrink-0"
      />
      <div className="flex items-center min-w-0">
        <p className="text-[12px] font-medium truncate">
          {playerName.split("#")[0]}
        </p>
        <p className="text-[10px] text-gray-500 font-light shrink-0">
          #{playerName.split("#")[1]}
        </p>
      </div>
    </div>
  );
};

const GuildFightMember = (props: Props) => {
  const { battleData } = props;
  return (
    <div className="flex w-full gap-[8px]">
      <div className="flex flex-col flex-1 gap-[2px] min-w-0">
        {renderPlayerInfo(
          battleData.redTeam.topPlayer?.championId,
          battleData.redTeam.topPlayer?.summonerName,
        )}
        {renderPlayerInfo(
          battleData.redTeam.junglePlayer?.championId,
          battleData.redTeam.junglePlayer?.summonerName,
        )}
        {renderPlayerInfo(
          battleData.redTeam.midPlayer?.championId,
          battleData.redTeam.midPlayer?.summonerName,
        )}
        {renderPlayerInfo(
          battleData.redTeam.adcPlayer?.championId,
          battleData.redTeam.adcPlayer?.summonerName,
        )}
        {renderPlayerInfo(
          battleData.redTeam.supportPlayer?.championId,
          battleData.redTeam.supportPlayer?.summonerName,
        )}
      </div>
      <div className="flex flex-col flex-1 gap-[2px] min-w-0">
        {renderPlayerInfo(
          battleData.blueTeam.topPlayer?.championId,
          battleData.blueTeam.topPlayer?.summonerName,
        )}
        {renderPlayerInfo(
          battleData.blueTeam.junglePlayer?.championId,
          battleData.blueTeam.junglePlayer?.summonerName,
        )}
        {renderPlayerInfo(
          battleData.blueTeam.midPlayer?.championId,
          battleData.blueTeam.midPlayer?.summonerName,
        )}
        {renderPlayerInfo(
          battleData.blueTeam.adcPlayer?.championId,
          battleData.blueTeam.adcPlayer?.summonerName,
        )}
        {renderPlayerInfo(
          battleData.blueTeam.supportPlayer?.championId,
          battleData.blueTeam.supportPlayer?.summonerName,
        )}
      </div>
    </div>
  );
};

export default GuildFightMember;

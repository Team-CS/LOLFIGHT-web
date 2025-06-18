import React from "react";
import GuildFightList from "./GuildFightList";
import { BattleDTO } from "@/src/common/DTOs/battle/battle.dto";

interface Props {
  battleData: BattleDTO;
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
  return (
    <div className="max-w-[1200px] border flex flex-col shadow py-[12px] bg-white dark:bg-dark border dark:border-gray-700">
      {/* 1 */}
      <div className="flex justify-between text-[14px] items-center px-[4px]">
        <div className="flex gap-[12px]">
          <p className="font-bold">소환사의 협곡</p>
          <p className="text-gray-500">5 vs 5</p>
        </div>
        <p className="text-gray-500">
          {formatDate(props.battleData.createdAt!)}
        </p>
      </div>

      {/* 2 */}
      <div>
        <GuildFightList battleTeamData={props.battleData.teamA} />
        <GuildFightList battleTeamData={props.battleData.teamB} />
      </div>
    </div>
  );
};

export default GuildFightDetail;

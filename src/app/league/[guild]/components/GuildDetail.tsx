import React from "react";

interface Props {
  guildLadder: number | undefined;
  guildVictory: number | undefined;
  guildDefeat: number | undefined;
  guildRank: string | undefined;
}

const GuildDetail = (props: Props) => {
  return (
    <div className="flex flex-col w-full h-full rounded p-[12px] gap-[4px] text-white bg-brandcolor dark:bg-branddark border dark:bg-dark dark:border-gray-700">
      <p className="text-[16px] border-b border-[#d0d5e5]">상세정보</p>
      <div className="flex border-b border-[#d0d5e5] text-[26px] justify-between py-[4px]">
        래더 : <p>{props.guildLadder}점</p>
      </div>
      <div className="flex border-b border-[#d0d5e5] text-[26px] justify-between py-[4px]">
        승률 :
        <p className="text-green-500">
          <span className="text-sm text-white">
            {props.guildVictory}승 {props.guildDefeat}패
          </span>{" "}
          {isNaN(
            (props.guildVictory! / (props.guildDefeat! + props.guildVictory!)) *
              100
          )
            ? "기록없음"
            : `(${(
                (props.guildVictory! /
                  (props.guildDefeat! + props.guildVictory!)) *
                100
              ).toFixed(2)}%)`}
        </p>
      </div>
      <div className="flex border-b border-[#d0d5e5] text-[26px] justify-between py-[4px]">
        랭킹 :
        <p>
          <span className="text-sm">1부리그</span> {props.guildRank}등
        </p>
      </div>
    </div>
  );
};
export default GuildDetail;

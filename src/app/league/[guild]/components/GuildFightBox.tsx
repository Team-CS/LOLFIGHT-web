import React, { useEffect } from "react";
import { BattlePlayerDto } from "@/src/common/DTOs/battle/battle_player.dto";
import constant from "@/src/common/constant/constant";
import { GuildDto } from "@/src/common/DTOs/guild/guild.dto";
import Image from "next/image";
interface Props {
  battlePlayerData: BattlePlayerDto;
  isResult: boolean;
  guild: GuildDto;
  highestDamage: number;
}

const GuildFightBox = (props: Props) => {
  const { battlePlayerData, isResult, guild, highestDamage } = props;
  const result = isResult ? "win" : "lose";
  const kda =
    battlePlayerData?.deaths === 0
      ? "Perfect"
      : (
          (battlePlayerData?.killed + battlePlayerData?.assists) /
          battlePlayerData?.deaths
        ).toFixed(2);
  const primayRune = battlePlayerData.primaryPerkStyle.split(",")[1];
  const subRune = battlePlayerData.subPerkStyle.split(",")[0];

  const getKDABackgroundColor = (kda: number | string) => {
    if (
      kda === "Perfect" ||
      (typeof kda === "string" && parseFloat(kda) >= 4.0)
    ) {
      return "text-red-500 font-bold underline";
    } else if (typeof kda === "string" && parseFloat(kda) >= 3.0) {
      return "text-blue-500 font-bold";
    } else if (typeof kda === "string" && parseFloat(kda) >= 2.0) {
      return "text-green-500";
    } else {
      return "text-gray-500";
    }
  };

  if (battlePlayerData == null || undefined) {
    return <div></div>;
  }

  return (
    <div className={`w-full h-[45px] flex text-[14px] px-[8px] gap-[12px]`}>
      {/* 플레이어 */}
      <div className="flex flex-[2.5] h-full font-medium text-[14px] items-center gap-[8px]">
        <Image
          src={`${constant.SERVER_URL}/${guild.guildIcon}`}
          alt="GuildBanner"
          width={25}
          height={25}
          className="w-[25px] h-[25px] rounded-[4px] object-cover"
        />
        <Image
          src={`${constant.SERVER_URL}/public/champions/${battlePlayerData.championId}.png`}
          alt="Champion"
          width={25}
          height={25}
          className="w-[25px] h-[25px]"
        />
        <div className="flex items-center">
          <p className="text-[14px] font-medium">
            {battlePlayerData.summonerName.split("#")[0]}
          </p>
          <p className="text-[12px] text-gray-600 font-light">
            #{battlePlayerData.summonerName.split("#")[1]}
          </p>
        </div>
      </div>

      {/* Spell/Rune */}
      <div className="flex flex-[0.5] gap-[4px]">
        <div className="flex flex-col items-center justify-center">
          <Image
            src={`${constant.SERVER_URL}/public/spell/${battlePlayerData.spell1Id}.png`}
            alt="spell1"
            width={20}
            height={20}
          />
          <Image
            src={`${constant.SERVER_URL}/public/spell/${props.battlePlayerData.spell2Id}.png`}
            alt="spell2"
            width={20}
            height={20}
          />
        </div>
        <div className="flex flex-col items-center justify-center">
          <Image
            src={`${constant.SERVER_URL}/public/rune/${primayRune}.png`}
            alt="rune"
            width={20}
            height={20}
          />
          <Image
            src={`${constant.SERVER_URL}/public/rune/${subRune}.png`}
            alt="sub_rune"
            width={17}
            height={17}
          />
        </div>
      </div>
      {/* KDA */}
      <div className={`flex flex-col flex-[1.2] justify-center font-medium `}>
        <div className={`text-[12px] ${getKDABackgroundColor(kda)}`}>
          평점 {kda}
        </div>
        <div className="font-medium text-[14px]">
          {props.battlePlayerData.killed} / {props.battlePlayerData.deaths} /{" "}
          {props.battlePlayerData.assists}
        </div>
      </div>

      {/* 피해량 */}
      <div className="flex flex-[2.2] py-[12px]">
        <div className="w-full h-full bg-gray-500 relative drop-shadow-md rounded">
          <div
            className={`h-full bg-red-500 rounded`}
            style={{
              width: `${
                (props.battlePlayerData.totalChampionsDamage /
                  props.highestDamage) *
                100
              }%`,
            }}
          ></div>
          <p className="absolute text-[12px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white ">
            {props.battlePlayerData.totalChampionsDamage}
          </p>
        </div>
      </div>

      {/* CS */}
      <div className="flex flex-col flex-[0.6] py-[4px] justify-center text-[12px]">
        <p className="h-full font-normal">
          레벨 {props.battlePlayerData.level}
        </p>
        <p className="h-full font-extrabold ">
          CS {props.battlePlayerData.minionsKilled}
        </p>
      </div>

      {/* 시야점수 */}
      <div className="flex flex-col flex-[0.6] text-[14px] justify-center">
        <p className="font-light">{props.battlePlayerData.visionScore}</p>
      </div>

      {/* 아이템 */}
      <div className="flex flex-[3.5] py-[8px] text-[12px] gap-[2px]">
        {(() => {
          const items = props.battlePlayerData.items
            .split(",")
            .map((id) => parseInt(id.trim()));

          const IMG_SIZE = "w-[30px] h-[30px]"; // 고정 크기

          // 8칸으로 고정, 마지막칸은 빈칸 없이 실제 아이템 또는 회색 div
          const paddedItems = [
            items[0] || 0,
            items[1] || 0,
            items[2] || 0,
            items[3] || 0,
            items[4] || 0,
            items[5] || 0,
            items[6] || 0,
          ];

          return paddedItems.map((itemNumber, index) =>
            itemNumber !== 0 ? (
              <Image
                key={index}
                src={`${constant.SERVER_URL}/public/items/${itemNumber}.png`}
                alt={`Item${itemNumber}`}
                width={30}
                height={30}
                className={`object-contain ${IMG_SIZE} rounded-[4px]`}
              />
            ) : (
              <div
                key={index}
                className={`${IMG_SIZE} bg-gray-300 dark:bg-black rounded-[4px] shrink-0`}
              />
            )
          );
        })()}
      </div>
    </div>
  );
};

export default GuildFightBox;

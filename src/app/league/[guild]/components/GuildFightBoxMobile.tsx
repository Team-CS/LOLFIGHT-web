import React, { useEffect } from "react";
import { BattlePlayerDto } from "@/src/common/DTOs/battle/battle_player.dto";
import constant from "@/src/common/constant/constant";
import { GuildDto } from "@/src/common/DTOs/guild/guild.dto";
import Image from "next/image";
interface Props {
  battlePlayerData: BattlePlayerDto;
  isResult: boolean;
  guild: GuildDto | null;
  highestDamage: number;
}

const GuildFightBoxMobile = (props: Props) => {
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
    <div className={`w-full h-[45px] flex text-[12px] px-[8px] gap-[8px]`}>
      {/* 플레이어 & 룬 & 스펠 */}
      <div className="flex-[1] flex h-full font-medium text-[12px] items-center gap-[2px]">
        <Image
          src={`${constant.SERVER_URL}/public/champions/${battlePlayerData.championId}.png`}
          alt="Champion"
          width={25}
          height={25}
          className="w-[25px] h-[25px] rounded-[4px]"
        />

        <div className="flex gap-[2px] flex-shrink-0">
          <div className="flex flex-col">
            <Image
              src={`${constant.SERVER_URL}/public/spell/${battlePlayerData.spell1Id}.png`}
              alt="spell1"
              width={13}
              height={13}
              className="rounded-full w-[13px] h-[13px]"
            />
            <Image
              src={`${constant.SERVER_URL}/public/spell/${battlePlayerData.spell2Id}.png`}
              alt="spell2"
              width={13}
              height={13}
              className="rounded-full w-[13px] h-[13px]"
            />
          </div>
          <div className="flex flex-col">
            <Image
              src={`${constant.SERVER_URL}/public/rune/${primayRune}.png`}
              alt="rune"
              width={13}
              height={13}
              className="rounded-full w-[13px] h-[13px]"
            />
            <Image
              src={`${constant.SERVER_URL}/public/rune/${subRune}.png`}
              alt="sub_rune"
              width={13}
              height={13}
              className="rounded-full w-[13px] h-[13px]"
            />
          </div>
        </div>
      </div>

      {/* 소환사명 & kda */}
      <div className="flex-[2] flex flex-col justify-center">
        <div className="flex items-center">
          <p className="text-[10px] font-medium">
            {battlePlayerData.summonerName.split("#")[0]}
          </p>
          <p className="text-[10px] text-gray-600 font-light">
            #{battlePlayerData.summonerName.split("#")[1]}
          </p>
        </div>
        <div className="flex gap-[8px]">
          <p className="font-light text-[10px]">
            {battlePlayerData.killed} / {battlePlayerData.deaths} /{" "}
            {battlePlayerData.assists}
          </p>
          <p className={`text-[10px] ${getKDABackgroundColor(kda)}`}>
            평점 {kda}
          </p>
        </div>
      </div>

      {/* CS & 레벨 */}
      <div className="flex-[0.7] flex flex-col justify-center text-[10px]">
        <p className="font-normal">레벨 {battlePlayerData.level}</p>
        <p className="font-extrabold ">CS {battlePlayerData.minionsKilled}</p>
      </div>

      {/* 피해량 */}
      <div className="flex-[1] flex w-[50px] py-[14px]">
        <div className="w-full bg-gray-500 relative drop-shadow-md rounded">
          <div
            className={`h-full bg-red-500 rounded`}
            style={{
              width: `${
                (battlePlayerData.totalChampionsDamage / highestDamage) * 100
              }%`,
            }}
          ></div>
          <p className="absolute text-[10px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white ">
            {battlePlayerData.totalChampionsDamage}
          </p>
        </div>
      </div>

      {/* 아이템 */}
      <div className="w-fit py-[8px] text-[12px]">
        {(() => {
          const items = battlePlayerData.items
            .split(",")
            .map((id) => parseInt(id.trim()));

          const IMG_SIZE = "w-[15px] h-[15px]"; // 고정 크기

          const paddedItems = [
            items[0] || 0,
            items[1] || 0,
            items[2] || 0,
            items[6] || 0,
            items[3] || 0,
            items[4] || 0,
            items[5] || 0,
            -1, // 8번째 빈칸
          ];

          const renderItem = (itemNumber: number, key: string) => {
            if (itemNumber === -1) {
              // 마지막 공백은 투명 div
              return <div key={key} className={`${IMG_SIZE} shrink-0`} />;
            }
            return itemNumber !== 0 ? (
              <Image
                key={key}
                src={`${constant.SERVER_URL}/public/items/${itemNumber}.png`}
                alt={`Item${itemNumber}`}
                width={15}
                height={15}
                className={`object-contain ${IMG_SIZE} shrink-0 rounded-[4px]`}
              />
            ) : (
              <div
                key={key}
                className={`${IMG_SIZE} shrink-0 bg-gray-300 dark:bg-black rounded-[4px]`}
              />
            );
          };

          return (
            <div className="flex flex-col gap-[4px]">
              {/* 위 줄 (4칸) */}
              <div className="grid grid-cols-4 gap-[2px] justify-items-center items-center">
                {paddedItems
                  .slice(0, 4)
                  .map((n, i) => renderItem(n, `top-${i}`))}
              </div>
              {/* 아래 줄 (4칸) */}
              <div className="grid grid-cols-4 gap-[2px] justify-items-center items-center">
                {paddedItems
                  .slice(4, 8)
                  .map((n, i) => renderItem(n, `bottom-${i}`))}
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};

export default GuildFightBoxMobile;

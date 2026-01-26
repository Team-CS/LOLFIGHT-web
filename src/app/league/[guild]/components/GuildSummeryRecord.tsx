import { GuildChampionStatsDto } from "@/src/common/DTOs/guild/guild_champion_stats.dto";
import { useIsMobile } from "@/src/hooks/useMediaQuery";
import React from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Image from "next/image";
import constant from "@/src/common/constant/constant";
import championsJson from "@/src/common/constant/champion_id_name_map.json";

interface Props {
  guildVictory: number | undefined;
  guildDefeat: number | undefined;
  mostChampionStats?: GuildChampionStatsDto[];
}

const GuildSummeryRecord = (props: Props) => {
  const isMobile = useIsMobile();
  const totalGames = (props.guildVictory || 0) + (props.guildDefeat || 0);
  const winRate = totalGames > 0 ? (props.guildVictory! / totalGames) * 100 : 0;

  return (
    <div className="h-full w-full flex flex-col p-[12px] rounded bg-white dark:bg-dark border dark:border-gray-700">
      <p className="font-extrabold text-[15px]">매치 통계</p>

      <div
        className={`flex ${isMobile ? "flex-col" : "flex-row"} py-[8px] px-[12px] items-center gap-[16px]`}
      >
        <div
          className={`flex items-center gap-[24px] ${isMobile ? "w-full justify-center" : "min-w-[400px]"}`}
        >
          <div
            style={{
              width: isMobile ? "100px" : "140px",
              height: isMobile ? "100px" : "140px",
            }}
          >
            <CircularProgressbar
              value={winRate}
              strokeWidth={8}
              text={totalGames > 0 ? `${winRate.toFixed(2)}%` : "기록없음"}
              styles={{
                path: { stroke: "#007fff" },
                trail: { stroke: "#eee" },
                text: {
                  fill: "currentcolor",
                  fontSize: "16px",
                  fontWeight: "600",
                },
              }}
            />
          </div>
          <div className="flex flex-col items-center justify-center">
            <p
              className={`font-bold ${isMobile ? "text-[14px]" : "text-[20px]"}`}
            >
              {totalGames}전 {props.guildVictory || 0}승{" "}
              {props.guildDefeat || 0}패
            </p>
            <p
              className={`text-red-500 font-medium ${isMobile ? "text-[13px]" : "text-[18px]"}`}
            >
              {totalGames > 0 ? `(${winRate.toFixed(2)}%)` : "기록없음"}
            </p>
          </div>
        </div>

        <div
          className={`flex-1 ${isMobile ? "w-full mt-4 border-t pt-4" : "min-w-[400px] border-l dark:border-gray-700 pl-4"}`}
        >
          <div className="grid grid-cols-2 gap-x-[16px] gap-y-[8px]">
            {props.mostChampionStats?.slice(0, 6).map((champion) => {
              const championName =
                (championsJson as any)[champion.championId.toString()] ||
                "챔피언";

              // 승률에 따른 색상 정의 (직관적인 정보 전달)
              const winRateColor =
                champion.winRate >= 60
                  ? "text-red-500"
                  : champion.winRate >= 50
                    ? "text-blue-500"
                    : "text-gray-700 dark:text-gray-300";

              return (
                <div
                  key={champion.championId}
                  className="flex items-center gap-[8px] p-[2px] overflow-hidden"
                >
                  {/* 챔피언 이미지 */}
                  <div className="relative shrink-0">
                    <Image
                      src={`${constant.SERVER_URL}/public/champions/${champion.championId}.png`}
                      alt={championName}
                      width={30}
                      height={30}
                      className="rounded-[4px] border border-gray-100 dark:border-gray-600"
                    />
                  </div>

                  <div className="flex flex-col leading-tight min-w-0">
                    {/* 상단: 이름 및 판수 */}
                    <div className="flex items-baseline gap-[4px]">
                      <p className="font-bold text-[12px] truncate">
                        {championName}
                      </p>
                      <span className="text-[11px] text-gray-600 shrink-0">
                        {champion.gamesPlayed}회
                      </span>
                    </div>

                    {/* 하단: 승률 및 KDA */}
                    <div className="flex items-center gap-[6px]">
                      <p
                        className={`text-[11px] font-extrabold ${winRateColor}`}
                      >
                        {champion.winRate}%
                      </p>
                      <div className="h-[8px] w-[1px] bg-gray-300 dark:bg-gray-600" />{" "}
                      {/* 구분선 */}
                      <p className="text-[10px] text-gray-500 font-medium">
                        <span
                          className={
                            champion.avgKDA >= 3 ? "text-orange-500" : ""
                          }
                        >
                          {champion.avgKDA.toFixed(2)}
                        </span>{" "}
                        <span className="text-[8px] text-gray-400">KDA</span>
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuildSummeryRecord;

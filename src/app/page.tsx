"use client";
import Search from "../common/components/Search";
import Slider from "../common/components/Slider";
// import { useState, useEffect } from "react";
import GuildInfoComponent from "./league/components/GuildInfoComponent";
import LeagueHeaderComponent from "./league/components/LeagueHeaderComponent";
import { GuildDTO } from "../common/DTOs/guild/guild.dto";
import { getGuildList } from "@/src/api/guild.api";
import { useState, useEffect } from "react";
import { getCookie } from "../utils/cookie/cookie";

export default function Page() {
  const [guildList, setGuildList] = useState<GuildDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      setIsLoading(true);
      getGuildList()
        .then((response) => {
          const sortedGuilds = response.data.data.sort(
            (a: GuildDTO, b: GuildDTO) => {
              const rankA =
                a.guildRecord?.recordRanking !== "기록없음"
                  ? parseInt(a.guildRecord!.recordRanking, 10)
                  : Infinity;
              const rankB =
                b.guildRecord?.recordRanking !== "기록없음"
                  ? parseInt(b.guildRecord!.recordRanking, 10)
                  : Infinity;
              return rankA - rankB;
            }
          );
          setGuildList(sortedGuilds);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log("Guild fetch error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <>
      <Slider></Slider>
      <div className="flex flex-col max-w-[1200px] mx-auto py-[28px]">
        <LeagueHeaderComponent guildLength={guildList.length} />
        <div className="flex flex-col">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <p>로딩 중...</p>
            </div>
          ) : (
            <>
              {guildList.map((guild) => (
                <GuildInfoComponent key={guild.id} guild={guild} />
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
}

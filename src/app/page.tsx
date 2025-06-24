"use client";

import GuildInfoComponent from "./league/components/GuildInfoComponent";
import LeagueHeaderComponent from "./league/components/LeagueHeaderComponent";
import { GuildDto, GuildListResponseDto } from "../common/DTOs/guild/guild.dto";
import { getGuildList } from "@/src/api/guild.api";
import { useState, useEffect } from "react";

export default function Page() {
  const [guilds, setGuilds] = useState<GuildDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      setIsLoading(true);
      getGuildList(1, 5)
        .then((response) => {
          const data = response.data.data as GuildListResponseDto;
          if (Array.isArray(data.guildList)) {
            setGuilds(data.guildList);
          } else {
            setGuilds([]);
          }
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
      {/* <Slider></Slider> */}
      <div className="flex flex-col max-w-[1200px] mx-auto py-[28px] gap-[12px]">
        <LeagueHeaderComponent guildLength={guilds.length} />

        <div className="flex flex-col">
          <div className="flex bg-brandcolor text-white dark:bg-dark font-thin rounded-t-[4px] w-full whitespace-nowrap">
            <div className="flex-[0.25] text-center px-[8px]">순위</div>
            <div className="flex-[1] text-center px-[8px]">길드이름</div>
            <div className="flex-[2] text-center px-[8px]">길드소개</div>
            <div className="flex-[0.25] text-center px-[8px]">길드원</div>
            <div className="flex-[0.25] text-center px-[8px]">승</div>
            <div className="flex-[0.25] text-center px-[8px]">패</div>
            <div className="flex-[0.5] text-center px-[8px]">티어</div>
            <div className="flex-[1] text-center px-[8px]">길드장</div>
          </div>
          {isLoading ? (
            <div className="flex justify-center items-center py-[28px]">
              <p>로딩 중...</p>
            </div>
          ) : (
            <>
              {guilds.map((guild) => (
                <GuildInfoComponent key={guild.id} guild={guild} />
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
}

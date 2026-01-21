"use client";
import React from "react";
import {
  StandingsResponseDto,
  MatchTeamDto,
} from "../../DTOs/league/league_standing.dto";
import localFont from "next/font/local";
import { useIsMobile } from "@/src/hooks/useMediaQuery";
import Image from "next/image";

interface LCKStandingsComponentProps {
  data: StandingsResponseDto | undefined;
}

const sacheon = localFont({
  src: "../../../fonts/SacheonHangGong-Regular.ttf",
  display: "swap",
});

const LCKStandingsComponent = ({ data }: LCKStandingsComponentProps) => {
  const isMobile = useIsMobile();
  const standings = data?.data?.standings;
  if (!standings?.length) {
    return (
      <div className="flex flex-col justify-center w-full h-full bg-white dark:bg-dark rounded-[16px] p-[12px] shadow-lg gap-[8px]">
        <div className="flex justify-center items-center py-[28px] bg-[#f0f4ff] dark:bg-[#1e1e2f] rounded-[12px] shadow-md">
          <p
            className={`${sacheon.className} font-medium text-gray-700 dark:text-gray-200 text-center`}
          >
            현재 순위 정보가 없습니다 😅
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full gap-[24px]">
      {standings.map((stage) =>
        stage.stages
          .filter((stageItem) => stageItem.slug === "group_stage")
          .map((stageItem) => (
            <div key={stageItem.slug} className="flex flex-col gap-[12px]">
              {stageItem.sections.map((section) => (
                <div
                  key={section.name}
                  className="flex flex-col bg-white dark:bg-dark rounded-[16px] shadow-lg py-[16px] px-[12px] gap-[8px]"
                >
                  {/* 스테이지 이름 */}
                  <h2
                    className={`${
                      isMobile ? "text-[14px]" : "text-[16px]"
                    } font-medium ${
                      sacheon.className
                    } text-gray-800 dark:text-gray-100`}
                  >
                    {section.name === "알파조" ? "알파조" : "오메가조"}
                  </h2>

                  {/* 섹션 헤더 */}
                  <div
                    className={`${
                      isMobile ? "text-[12px]" : "text-[14px]"
                    } grid grid-cols-[0.5fr_3fr_0.5fr_0.5fr] gap-[12px] p-[8px] bg-[#f4f7ff] dark:bg-branddark border-t border-b border-brandborder dark:border-branddarkborder text-brandcolor font-semibold`}
                  >
                    <div className="text-center">순위</div>
                    <div className="text-center">팀</div>
                    <div className="text-center">승</div>
                    <div className="text-center">패</div>
                  </div>

                  {/* 팀 리스트 */}
                  {section.rankings.map((ranking) =>
                    ranking.teams.map((team: MatchTeamDto, idx) => (
                      <div
                        key={team.code || idx}
                        className="grid grid-cols-[0.5fr_3fr_0.5fr_0.5fr] items-center gap-[12px] rounded-[8px]"
                      >
                        {/* 순위 배지 */}
                        <div className="flex justify-center items-center">
                          <span
                            className={`flex justify-center items-center ${
                              isMobile ? "text-[16px]" : "text-[20px]"
                            } ${sacheon.className}`}
                          >
                            {ranking.ordinal + idx}
                          </span>
                        </div>

                        {/* 팀 로고 + 이름 */}
                        <div className="flex items-center gap-[12px]">
                          {team.image && (
                            <div
                              className={`${
                                isMobile
                                  ? "w-[24px] h-[24px] rounded-[4px]"
                                  : "w-[36px] h-[36px] rounded-[8px] "
                              } bg-black dark:bg-black flex justify-center items-center p-[4px] shadow-md`}
                            >
                              <Image
                                src={team.image}
                                alt={team.name || "team"}
                                width={35}
                                height={35}
                                sizes="36px"
                                className="w-full h-full object-contain"
                              />
                            </div>
                          )}
                          <span
                            className={`${
                              isMobile ? "text-[12px]" : "text-[14px]"
                            } font-medium`}
                          >
                            {team.name}
                          </span>
                        </div>

                        {/* 승/패 컬러 */}
                        <div
                          className={`${
                            isMobile ? "text-[12px]" : "text-[14px]"
                          } text-center text-green-600 dark:text-green-400 font-semibold`}
                        >
                          {team.record?.wins ?? "-"}
                        </div>
                        <div
                          className={`${
                            isMobile ? "text-[12px]" : "text-[14px]"
                          } text-center text-red-600 dark:text-red-400 font-semibold`}
                        >
                          {team.record?.losses ?? "-"}
                        </div>
                      </div>
                    )),
                  )}
                </div>
              ))}
            </div>
          )),
      )}
    </div>
  );
};

export default LCKStandingsComponent;

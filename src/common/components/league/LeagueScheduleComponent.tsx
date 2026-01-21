"use client";
import localFont from "next/font/local";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ScheduleResponseDto } from "../../DTOs/league/league_schedule.dto";
import { useIsMobile } from "@/src/hooks/useMediaQuery";
import Image from "next/image";
import BetModal from "./modal/betModal";
import { CreateBetDto } from "../../DTOs/bet/bet.dto";
import { createBet } from "@/src/api/bet.api";
import CustomAlert from "../alert/CustomAlert";
import { useMemberStore } from "../../zustand/member.zustand";
import { getCookie } from "@/src/utils/cookie/cookie";

interface LeagueScheduleComponentProps {
  data: ScheduleResponseDto | undefined;
}

const sacheon = localFont({
  src: "../../../fonts/SacheonHangGong-Regular.ttf",
  display: "swap",
});

export default function LeagueScheduleComponent(
  props: LeagueScheduleComponentProps,
) {
  const { data } = props;
  const isMobile = useIsMobile();
  const { member, updateMember } = useMemberStore();
  const [open, setOpen] = useState<boolean>(false);
  const [selectedMatch, setSelectedMatch] = useState<string>("");
  const today = new Date();

  const containerRef = useRef<HTMLDivElement>(null);
  const todayRef = useRef<HTMLDivElement>(null);

  const scheduleByDate = useMemo(() => {
    if (!data?.data?.schedule?.events) return [];

    const map: Record<string, any[]> = {};

    data.data.schedule.events.forEach((event) => {
      if (!event.match?.teams || event.match.teams.length < 2) return;

      const d = new Date(event.startTime);
      const dateKey = `${String(d.getFullYear()).slice(2)}.${String(
        d.getMonth() + 1,
      ).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")} ${
        ["일", "월", "화", "수", "목", "금", "토"][d.getDay()]
      }`;

      const t1 = event.match.teams[0];
      const t2 = event.match.teams[1];
      const isCompleted = event.state === "completed";

      if (!map[dateKey]) map[dateKey] = [];

      map[dateKey].push({
        id: event.match.id,
        time: `${String(d.getHours()).padStart(2, "0")}:${String(
          d.getMinutes(),
        ).padStart(2, "0")}`,
        team1: {
          name: t1.code ?? "TBD",
          image: t1.image,
          wins: t1.result?.gameWins ?? 0,
        },
        team2: {
          name: t2.code ?? "TBD",
          image: t2.image,
          wins: t2.result?.gameWins ?? 0,
        },
        league: event.league?.slug ?? "TBD",
        isCompleted,
        dateObj: d,
      });
    });

    return Object.entries(map)
      .map(([date, matches]) => ({
        date,
        matches: matches.sort(
          (a: any, b: any) =>
            parseInt(a.time.replace(":", ""), 10) -
            parseInt(b.time.replace(":", ""), 10),
        ),
        dateObj: matches[0]?.dateObj,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [data]);

  useEffect(() => {
    if (containerRef.current && todayRef.current) {
      const container = containerRef.current;
      const todayEl = todayRef.current;

      const relativeTop = todayEl.offsetTop - container.offsetTop;

      container.scrollTo({
        top: relativeTop,
        behavior: "smooth",
      });
    }
  }, [scheduleByDate]);

  const handleClickSchedule = (riotMatchId: string) => {
    setSelectedMatch(riotMatchId);
    setOpen(true);
  };

  const handleSumbitBet = async (
    riotMatchId: string,
    teamCode: string,
    // betAmount: number
  ) => {
    const accessToken = getCookie("lf_atk");
    if (!member || !accessToken) {
      CustomAlert("warning", "승부예측", "로그인이 필요한 서비스입니다.");
      return;
    }
    const dto: CreateBetDto = {
      proMatchId: riotMatchId,
      betTeamCode: teamCode,
      // betAmount: betAmount,
    };

    await createBet(dto)
      .then((res) => {
        CustomAlert("success", "승부예측", "완료되었습니다!");
        setOpen(false);
      })
      .catch((error) => {
        const code = error?.response?.data?.code;
        if (code === "COMMON-005") {
          CustomAlert(
            "warning",
            "승부예측",
            "이미 예측한 경기입니다. \n 내정보에서 상세정보와 취소가 가능합니다.",
          );
        }
      });
  };

  return (
    <div className="w-full flex flex-col h-full bg-white dark:bg-dark rounded-[16px] p-[12px] shadow-lg gap-[8px]">
      <h2
        className={`${isMobile ? "text-[14px]" : "text-[16px]"} ${
          sacheon.className
        } text-gray-800 dark:text-gray-100 font-medium border-b border-gray-300`}
      >
        {(today.getMonth() + 1).toString()}월 경기 일정
      </h2>

      <div
        className="flex-[1] w-full overflow-y-scroll max-h-[580px] pr-[12px]"
        ref={containerRef}
      >
        <div className="flex flex-col gap-[16px]">
          {scheduleByDate.length > 0 ? (
            scheduleByDate.map((day, i) => (
              <div
                className="flex flex-col gap-[8px]"
                key={i}
                ref={
                  day.dateObj?.toDateString() === today.toDateString()
                    ? todayRef
                    : null
                }
              >
                <div
                  className={`flex gap-[4px] font-normal items-center ${
                    isMobile ? "text-[12px]" : "text-[14px]"
                  }`}
                >
                  <p>{day.date}</p>
                  {day.dateObj?.toDateString() === today.toDateString() && (
                    <span
                      className={`px-[6px] py-[1px] bg-red-500 text-white font-semibold rounded-full ${
                        isMobile ? "text-[10px]" : "text-[12px]"
                      }`}
                    >
                      오늘
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-[8px]">
                  {day.matches.map((match, j) => (
                    <div
                      key={j}
                      className="flex justify-between items-center rounded-[8px] px-[12px] py-[8px] border border-brandborder dark:border-branddarkborder hover:bg-brandhover dark:hover:bg-branddarkborder cursor-pointer shadow-sm"
                      onClick={() => handleClickSchedule(match.id)}
                    >
                      <div className="flex justify-start">
                        <span
                          className={`font-light ${
                            isMobile ? "text-[12px]" : "text-[14px]"
                          }`}
                        >
                          {match.time}
                        </span>
                      </div>

                      <div className="flex justify-center items-center">
                        <div
                          className={`flex w-full items-center justify-center ${
                            isMobile ? "gap-[4px]" : "gap-[12px]"
                          }`}
                        >
                          {/* 팀1 */}
                          <div
                            className={`flex items-center gap-[8px] justify-end ${
                              isMobile ? "w-[80px]" : "w-[100px]"
                            }`}
                          >
                            <span
                              className={`${
                                isMobile ? "text-[12px]" : "text-[16px]"
                              } font-bold truncate`}
                            >
                              {match.team1.name}
                            </span>
                            {match.team1.image && (
                              <div
                                className={`${
                                  isMobile
                                    ? "w-[24px] h-[24px] rounded-[4px]"
                                    : "w-[36px] h-[36px] rounded-[8px]"
                                } bg-black flex justify-center items-center p-[4px] shadow-md`}
                              >
                                <Image
                                  src={match.team1.image}
                                  alt={match.team1.name}
                                  width={35}
                                  height={35}
                                  sizes="36px"
                                  className="w-full h-full object-contain"
                                />
                              </div>
                            )}
                          </div>

                          {/* 점수박스 */}
                          <div className="flex shrink-0 justify-center">
                            {match.isCompleted ? (
                              <div className="flex items-center rounded-[6px] border border-brandborder bg-[#f4f7ff] dark:bg-black dark:border-branddarkborder">
                                <div
                                  className={`flex items-center justify-center font-semibold ${
                                    isMobile
                                      ? "w-[15px] h-[15px] m-[2px] text-[10px]"
                                      : "w-[20px] h-[20px] m-[4px] text-[14px]"
                                  }`}
                                >
                                  {match.team1.wins}
                                </div>
                                <div className="w-[1px] h-full bg-gray-400 dark:bg-branddarkborder" />
                                <div
                                  className={`flex items-center justify-center font-semibold ${
                                    isMobile
                                      ? "w-[15px] h-[15px] m-[2px] text-[10px]"
                                      : "w-[20px] h-[20px] m-[4px] text-[14px]"
                                  }`}
                                >
                                  {match.team2.wins}
                                </div>
                              </div>
                            ) : (
                              <div
                                className={`flex items-center justify-center rounded-[8px] font-semibold bg-[#f4f7ff] border border-brandborder dark:bg-black dark:border-branddarkborder
                            ${
                              isMobile
                                ? "px-[8px] py-[2px] text-[10px]"
                                : "px-[12px] py-[4px] text-[14px]"
                            }`}
                              >
                                VS
                              </div>
                            )}
                          </div>

                          {/* 팀2 */}
                          <div
                            className={`flex items-center gap-[8px] justify-start ${
                              isMobile ? "w-[80px]" : "w-[100px]"
                            }`}
                          >
                            {match.team2.image && (
                              <div
                                className={`${
                                  isMobile
                                    ? "w-[24px] h-[24px] rounded-[4px]"
                                    : "w-[36px] h-[36px] rounded-[8px]"
                                } bg-black flex justify-center items-center p-[4px] shadow-md`}
                              >
                                <Image
                                  src={match.team2.image}
                                  alt={match.team2.name}
                                  width={35}
                                  height={35}
                                  sizes="36px"
                                  className="w-full h-full object-contain"
                                />
                              </div>
                            )}
                            <span
                              className={`${
                                isMobile ? "text-[12px]" : "text-[16px]"
                              } font-semibold truncate`}
                            >
                              {match.team2.name}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end w-[50px] truncate">
                        <span
                          className={`font-light text-gray-400 ${
                            isMobile ? "text-[10px]" : "text-[14px]"
                          }`}
                        >
                          {match.league}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center py-[28px] bg-[#f0f4ff] dark:bg-[#1e1e2f] rounded-[12px] shadow-md">
              <p
                className={`${sacheon.className} font-medium text-gray-700 dark:text-gray-200 text-center`}
              >
                현재 경기 일정이 없습니다 😅
              </p>
            </div>
          )}
        </div>
      </div>
      {open && (
        <BetModal
          riotMatchId={selectedMatch}
          onClose={() => {
            (setOpen(false), setSelectedMatch(""));
          }}
          onSumbit={handleSumbitBet}
        />
      )}
    </div>
  );
}

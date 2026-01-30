"use client";

import {
  acceptGuildTeamInvite,
  getMyGuildTeam,
  rejectGuildTeamInvite,
} from "@/src/api/guild_team.api";
import {
  acceptScrimApplcation,
  rejectScrimApplcation,
} from "@/src/api/scrim.api";
import CustomAlert from "@/src/common/components/alert/CustomAlert";
import {
  ScrimApplicationDecisionDto,
  ScrimApplicationDto,
} from "@/src/common/DTOs/scrim/scrim_application.dto";
import { useGuildTeamStore } from "@/src/common/zustand/guild_team.zustand";
import { useMemberStore } from "@/src/common/zustand/member.zustand";
import { formatKoreanDatetime } from "@/src/utils/string/string.util";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BattleTeamModal } from "../battle/components/modals/BattleTeamModal";
import { GuildTeamDto } from "@/src/common/DTOs/guild/guild_team/guild_team.dto";
import { useIsMobile } from "@/src/hooks/useMediaQuery";
import { useAlarmStore } from "@/src/common/zustand/alarm.zustand";

export default function Page() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const { member } = useMemberStore();
  const { guildTeam, setGuildTeam } = useGuildTeamStore();
  const {
    teamInvites,
    setTeamInvites,
    applications,
    setApplications,
    checkAlarms,
    isMatched,
  } = useAlarmStore();
  const [tab, setTab] = useState<"team" | "battle">("team");
  const [selectedTeam, setSelectedTeam] = useState<GuildTeamDto | null>(null);

  useEffect(() => {
    if (!member) {
      CustomAlert("warning", "알림", "로그인이 필요합니다");
      router.replace("/");
      return;
    }
    checkAlarms();

    getMyGuildTeam()
      .then((response) => {
        setGuildTeam(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [tab]);

  const handleAccept = (inviteId: string) => {
    acceptGuildTeamInvite(inviteId)
      .then((response) => {
        CustomAlert("success", "팀 초대", "팀 초대를 수락 하셨습니다.");
        setTeamInvites((prev) =>
          prev.map((invite) =>
            invite.id === inviteId ? { ...invite, status: "ACCEPTED" } : invite
          )
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleReject = (inviteId: string) => {
    rejectGuildTeamInvite(inviteId)
      .then((response) => {
        setTeamInvites((prev) =>
          prev.map((invite) =>
            invite.id === inviteId ? { ...invite, status: "REJECTED" } : invite
          )
        );
        CustomAlert("success", "팀 초대", "팀 초대를 거절 하셨습니다.");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleScrimAccept = (scrimApplicationDto: ScrimApplicationDto) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === scrimApplicationDto.id ? { ...app, status: "ACCEPTED" } : app
      )
    );

    const acceptApplicationDto: ScrimApplicationDecisionDto = {
      id: scrimApplicationDto.id,
      scrimSlot: scrimApplicationDto.scrimSlot.id,
      applicationTeam: scrimApplicationDto.applicationTeam.id,
    };

    acceptScrimApplcation(acceptApplicationDto)
      .then(() => {
        CustomAlert(
          "success",
          "스크림 신청 수락",
          "스크림 신청을 수락하셨습니다. \n 해당일시 5분 전에 방 코드가 생성됩니다!"
        );
      })
      .catch((error) => {
        setApplications((prev) =>
          prev.map((app) =>
            app.id === scrimApplicationDto.id
              ? { ...app, status: "PENDING" }
              : app
          )
        );
        CustomAlert(
          "error",
          "스크림 신청 수락 실패",
          "잠시 후 다시 시도해주세요."
        );
        console.error(error);
      });
  };

  const handleScrimReject = (scrimApplicationDto: ScrimApplicationDto) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === scrimApplicationDto.id ? { ...app, status: "REJECTED" } : app
      )
    );

    const rejectApplicationDto: ScrimApplicationDecisionDto = {
      id: scrimApplicationDto.id,
      scrimSlot: scrimApplicationDto.scrimSlot.id,
      applicationTeam: scrimApplicationDto.applicationTeam.id,
    };

    rejectScrimApplcation(rejectApplicationDto)
      .then(() => {
        CustomAlert(
          "success",
          "스크림 신청 거절",
          "스크림 신청을 거절하셨습니다."
        );
      })
      .catch((error) => {
        setApplications((prev) =>
          prev.map((app) =>
            app.id === scrimApplicationDto.id
              ? { ...app, status: "PENDING" }
              : app
          )
        );
        CustomAlert(
          "error",
          "스크림 신청 거절 실패",
          "잠시 후 다시 시도해주세요."
        );
        console.error(error);
      });
  };

  const handleSelectedTeam = (application: ScrimApplicationDto) => {
    const isRecipient = application.scrimSlot.hostTeam.id === guildTeam?.id;

    // ✅ 상대 팀 구분
    const opponentTeam = isRecipient
      ? application.applicationTeam
      : application.scrimSlot.hostTeam;

    setSelectedTeam(opponentTeam);
  };

  return (
    <div className={`max-w-[1200px] mx-auto flex flex-col gap-[24px] min-h-[600px] ${
      isMobile ? "p-[16px]" : "p-[28px]"
    }`}>
      {/* 헤더 */}
      <div className="bg-white dark:bg-dark rounded-[16px] shadow-lg border border-gray-100 dark:border-branddarkborder overflow-hidden">
        <div className="flex items-center gap-[12px] px-[20px] py-[16px] bg-gradient-to-r from-gray-50 to-white dark:from-branddark dark:to-dark border-b border-gray-100 dark:border-branddarkborder">
          <div className="w-[4px] h-[24px] bg-gradient-to-b from-brandcolor to-blue-400 rounded-full" />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={`text-brandcolor ${isMobile ? "w-[20px] h-[20px]" : "w-[24px] h-[24px]"}`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
            />
          </svg>
          <h1 className={`font-bold ${isMobile ? "text-[18px]" : "text-[22px]"}`}>
            알림
          </h1>
        </div>

        {/* 탭 */}
        <div className="flex">
          <button
            className={`flex-1 py-[14px] font-semibold transition-all ${
              tab === "team"
                ? "bg-white dark:bg-dark text-brandcolor border-b-[3px] border-brandcolor"
                : "bg-gray-50 dark:bg-branddark text-gray-500 hover:bg-gray-100 dark:hover:bg-branddarkborder"
            } ${isMobile ? "text-[12px]" : "text-[14px]"}`}
            onClick={() => setTab("team")}
            aria-selected={tab === "team"}
            role="tab"
          >
            팀 초대 알림
          </button>
          <button
            className={`flex-1 py-[14px] font-semibold transition-all ${
              tab === "battle"
                ? "bg-white dark:bg-dark text-brandcolor border-b-[3px] border-brandcolor"
                : "bg-gray-50 dark:bg-branddark text-gray-500 hover:bg-gray-100 dark:hover:bg-branddarkborder"
            } ${isMobile ? "text-[12px]" : "text-[14px]"}`}
            onClick={() => setTab("battle")}
            aria-selected={tab === "battle"}
            role="tab"
          >
            스크림 알림
          </button>
        </div>
      </div>

      {/* 내용 */}
      {tab === "team" && (
        <div className="flex flex-col gap-[12px]">
          {!teamInvites || teamInvites.length === 0 ? (
            <div className="bg-white dark:bg-dark rounded-[16px] shadow-lg border border-gray-100 dark:border-branddarkborder p-[40px] flex flex-col items-center gap-[12px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-[48px] h-[48px] text-gray-300 dark:text-gray-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                />
              </svg>
              <p className="text-gray-400 text-[14px]">
                새로운 팀 초대 알림이 없습니다.
              </p>
            </div>
          ) : (
            teamInvites.map((invite) => (
              <div
                key={invite.id}
                className={`bg-white dark:bg-dark rounded-[12px] shadow-md border overflow-hidden transition-all hover:shadow-lg ${
                  invite.status === "PENDING"
                    ? "border-brandcolor/50"
                    : "border-gray-100 dark:border-branddarkborder"
                }`}
              >
                <div className={`flex flex-col md:flex-row md:items-center justify-between gap-[12px] ${
                  isMobile ? "p-[14px]" : "p-[18px]"
                }`}>
                  <div className="flex items-center gap-[10px]">
                    {invite.status === "PENDING" && (
                      <div className="w-[8px] h-[8px] rounded-full bg-brandcolor animate-pulse" />
                    )}
                    <p className={`${isMobile ? "text-[13px]" : "text-[15px]"}`}>
                      <span className="font-bold text-brandcolor">{invite.team.leader.memberName}</span>
                      <span className="text-gray-600 dark:text-gray-300">님이 </span>
                      <span className="font-semibold px-[8px] py-[2px] bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-[12px]">
                        {invite.position}
                      </span>
                      <span className="text-gray-600 dark:text-gray-300"> 라인으로 초대했습니다.</span>
                    </p>
                  </div>
                  <div className="flex gap-[10px]">
                    {invite.status === "PENDING" ? (
                      <>
                        <button
                          className={`bg-gradient-to-r from-brandcolor to-blue-500 text-white rounded-[8px] hover:opacity-90 transition-opacity shadow-sm font-medium ${
                            isMobile ? "px-[12px] py-[6px] text-[12px]" : "px-[16px] py-[8px] text-[13px]"
                          }`}
                          onClick={() => handleAccept(invite.id)}
                        >
                          수락
                        </button>
                        <button
                          className={`border border-gray-200 dark:border-branddarkborder rounded-[8px] hover:bg-gray-50 dark:hover:bg-branddarkborder transition-colors font-medium text-gray-600 dark:text-gray-300 ${
                            isMobile ? "px-[12px] py-[6px] text-[12px]" : "px-[16px] py-[8px] text-[13px]"
                          }`}
                          onClick={() => handleReject(invite.id)}
                        >
                          거절
                        </button>
                      </>
                    ) : (
                      <span
                        className={`px-[12px] py-[4px] rounded-full font-semibold text-[12px] ${
                          invite.status === "ACCEPTED"
                            ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                            : "bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400"
                        }`}
                      >
                        {invite.status === "ACCEPTED" ? "수락됨" : "거절됨"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {tab === "battle" && (
        <div className="flex flex-col gap-[12px]">
          {applications.length === 0 ? (
            <div className="bg-white dark:bg-dark rounded-[16px] shadow-lg border border-gray-100 dark:border-branddarkborder p-[40px] flex flex-col items-center gap-[12px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-[48px] h-[48px] text-gray-300 dark:text-gray-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
                />
              </svg>
              <p className="text-gray-400 text-[14px]">
                스크림 알림이 없습니다.
              </p>
            </div>
          ) : (
            applications.map((application) => {
              const isRecipient =
                application.scrimSlot.hostTeam.id === guildTeam?.id;

              const opponentTeam = isRecipient
                ? application.applicationTeam
                : application.scrimSlot.hostTeam;

              const statusConfig = {
                ACCEPTED: {
                  text: "확정되었습니다.",
                  badge: "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
                  badgeText: "확정"
                },
                REJECTED: {
                  text: "거절되었습니다.",
                  badge: "bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400",
                  badgeText: "거절됨"
                },
                CLOSED: {
                  text: "종료되었습니다.",
                  badge: "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400",
                  badgeText: "종료"
                },
                PENDING: {
                  text: "신청 대기 중입니다.",
                  badge: "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
                  badgeText: "대기중"
                }
              };

              const status = statusConfig[application.status as keyof typeof statusConfig] || statusConfig.PENDING;

              return (
                <div
                  key={application.id}
                  className={`bg-white dark:bg-dark rounded-[12px] shadow-md border overflow-hidden transition-all hover:shadow-lg ${
                    application.status === "PENDING" && isRecipient
                      ? "border-brandcolor/50"
                      : "border-gray-100 dark:border-branddarkborder"
                  }`}
                >
                  <div className={`flex flex-col gap-[12px] ${isMobile ? "p-[14px]" : "p-[18px]"}`}>
                    <div className="flex justify-between items-start gap-[12px]">
                      <div className="flex flex-col gap-[8px]">
                        <div className="flex items-center gap-[8px] flex-wrap">
                          {application.status === "PENDING" && isRecipient && (
                            <div className="w-[8px] h-[8px] rounded-full bg-brandcolor animate-pulse" />
                          )}
                          <span className={`px-[10px] py-[3px] rounded-full font-medium text-[11px] ${status.badge}`}>
                            {status.badgeText}
                          </span>
                          <span className={`px-[10px] py-[3px] rounded-full bg-gray-100 dark:bg-branddark text-gray-600 dark:text-gray-300 font-medium ${
                            isMobile ? "text-[10px]" : "text-[11px]"
                          }`}>
                            {formatKoreanDatetime(application.scrimSlot.scheduledAt.toString())}
                          </span>
                        </div>
                        <p className={`text-gray-700 dark:text-gray-200 ${isMobile ? "text-[13px]" : "text-[15px]"}`}>
                          <span className="font-bold text-brandcolor">
                            {opponentTeam.leader?.memberName ?? "상대팀"}
                          </span>
                          <span> 팀과의 스크림이 {status.text}</span>
                        </p>
                      </div>
                      <button
                        className={`flex items-center gap-[6px] bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-[8px] hover:opacity-90 transition-opacity shadow-sm font-medium flex-shrink-0 ${
                          isMobile ? "text-[11px] px-[10px] py-[6px]" : "text-[13px] px-[14px] py-[8px]"
                        }`}
                        onClick={() => handleSelectedTeam(application)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className={`${isMobile ? "w-[12px] h-[12px]" : "w-[14px] h-[14px]"}`}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                          />
                        </svg>
                        팀 보기
                      </button>
                    </div>

                    {isRecipient &&
                      application.status === "PENDING" &&
                      guildTeam.leader.id === member?.id && (
                        <div className="flex gap-[10px] pt-[8px] border-t border-gray-100 dark:border-branddarkborder">
                          <button
                            className={`bg-gradient-to-r from-brandcolor to-blue-500 text-white rounded-[8px] hover:opacity-90 transition-opacity shadow-sm font-medium ${
                              isMobile ? "px-[14px] py-[8px] text-[12px]" : "px-[18px] py-[10px] text-[13px]"
                            }`}
                            onClick={() => {
                              if (isMatched) {
                                CustomAlert(
                                  "error",
                                  "진행중인 매치",
                                  "이미 진행중인 매치가 존재합니다.\n매치가 종료된 후에 다시 시도해주세요."
                                );
                                return;
                              }
                              handleScrimAccept(application);
                            }}
                          >
                            수락
                          </button>
                          <button
                            className={`border border-gray-200 dark:border-branddarkborder rounded-[8px] hover:bg-gray-50 dark:hover:bg-branddarkborder transition-colors font-medium text-gray-600 dark:text-gray-300 ${
                              isMobile ? "px-[14px] py-[8px] text-[12px]" : "px-[18px] py-[10px] text-[13px]"
                            }`}
                            onClick={() => {
                              if (isMatched) {
                                CustomAlert(
                                  "error",
                                  "진행중인 매치",
                                  "이미 진행중인 매치가 존재합니다.\n매치가 종료된 후에 다시 시도해주세요."
                                );
                                return;
                              }
                              handleScrimReject(application);
                            }}
                          >
                            거절
                          </button>
                        </div>
                      )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {selectedTeam && (
        <BattleTeamModal
          team={selectedTeam}
          mode="view"
          onClose={() => setSelectedTeam(null)}
          onApply={() => {}}
        />
      )}
    </div>
  );
}

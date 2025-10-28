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
    <div className="max-w-[1200px] mx-auto p-[28px] flex flex-col gap-[24px] min-h-[600px]">
      {/* 탭 */}
      <div className="flex border-b border-gray-300 dark:border-gray-700">
        <button
          className={`px-[20px] py-[10px] font-semibold transition-colors ${
            tab === "team"
              ? "border-b-[2px] border-brandcolor text-brandcolor"
              : "text-gray-500 hover:text-brandcolor"
          } ${isMobile ? "text-[12px]" : "text-[16px]"}`}
          onClick={() => setTab("team")}
          aria-selected={tab === "team"}
          role="tab"
        >
          팀 초대 알림
        </button>
        <button
          className={`px-[20px] py-[10px] font-semibold transition-colors ${
            tab === "battle"
              ? "border-b-[2px] border-brandcolor text-brandcolor"
              : "text-gray-500 hover:text-brandcolor"
          } ${isMobile ? "text-[12px]" : "text-[16px]"}`}
          onClick={() => setTab("battle")}
          aria-selected={tab === "battle"}
          role="tab"
        >
          스크림 알림
        </button>
      </div>

      {/* 내용 */}
      {tab === "team" && (
        <div className="flex flex-col gap-[16px]">
          {!teamInvites ? (
            <p className="text-center text-gray-400 py-[40px]">
              새로운 팀 초대 알림이 없습니다.
            </p>
          ) : (
            teamInvites.map((invite) => (
              <div
                key={invite.id}
                className={`p-[16px] rounded-lg border ${
                  invite.status === "PENDING"
                    ? "border-brandcolor bg-white dark:bg-branddark"
                    : "border-gray-300 bg-gray-50 dark:bg-gray-800"
                } flex flex-col md:flex-row md:items-center justify-between gap-[12px]`}
              >
                <div className="text-[15px]">
                  <strong>{invite.team.leader.memberName}</strong>님이{" "}
                  <strong>{invite.position}</strong> 라인으로 초대했습니다.
                </div>
                <div className="flex gap-[12px]">
                  {invite.status === "PENDING" ? (
                    <>
                      <button
                        className="px-[14px] py-[4px] bg-brandcolor text-white rounded-md hover:opacity-90 transition"
                        onClick={() => handleAccept(invite.id)}
                      >
                        수락
                      </button>
                      <button
                        className="px-[14px] py-[4px] border border-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-brandgray transition"
                        onClick={() => handleReject(invite.id)}
                      >
                        거절
                      </button>
                    </>
                  ) : (
                    <p
                      className={`font-semibold ${
                        invite.status === "ACCEPTED"
                          ? "text-blue-500"
                          : "text-red-500"
                      }`}
                    >
                      {invite.status === "ACCEPTED" ? "수락됨" : "거절됨"}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {tab === "battle" && (
        <div className="flex flex-col gap-[16px]">
          {applications.length === 0 ? (
            <p className="text-center text-gray-400 py-[40px]">
              스크림 알림이 없습니다.
            </p>
          ) : (
            applications.map((application) => {
              const isRecipient =
                application.scrimSlot.hostTeam.id === guildTeam?.id;

              // ✅ 상대 팀 구분
              const opponentTeam = isRecipient
                ? application.applicationTeam
                : application.scrimSlot.hostTeam;

              return (
                <div
                  key={application.id}
                  className={`p-[16px] rounded-lg border flex flex-col gap-[12px] ${
                    application.status === "PENDING" && isRecipient
                      ? "border-brandcolor bg-white dark:bg-branddark"
                      : "border-gray-300 bg-gray-50 dark:bg-gray-800"
                  }`}
                >
                  <div className="flex gap-[12px] justify-between items-center">
                    <p>
                      <strong>
                        {formatKoreanDatetime(
                          application.scrimSlot.scheduledAt.toString()
                        )}
                      </strong>
                      에{" "}
                      <strong>
                        {opponentTeam.leader?.memberName ?? "상대팀"}
                      </strong>
                      {` 팀과의 스크림이 `}
                      {application.status === "ACCEPTED"
                        ? "확정되었습니다."
                        : application.status === "REJECTED"
                        ? "거절되었습니다."
                        : application.status === "CLOSED"
                        ? "종료되었습니다."
                        : "신청 대기 중입니다."}
                    </p>
                    <button
                      className={`bg-green-500 text-white rounded-md hover:opacity-90 transition ${
                        isMobile
                          ? "text-[12px] p-[6px] min-w-[50px]"
                          : "text-[14px] px-[14px] py-[6px] "
                      }`}
                      onClick={() => handleSelectedTeam(application)}
                    >
                      팀 보기
                    </button>
                  </div>

                  {isRecipient &&
                    application.status === "PENDING" &&
                    guildTeam.leader.id === member?.id && (
                      <div className="flex gap-[12px] ">
                        <button
                          className="px-[16px] py-[8px] bg-brandcolor text-white rounded-md hover:opacity-90 transition"
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
                          className="px-[16px] py-[8px] border border-gray-300 rounded-md hover:bg-gray-100 transition"
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

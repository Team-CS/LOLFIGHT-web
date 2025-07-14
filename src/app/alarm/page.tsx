"use client";

import {
  acceptGuildTeamInvite,
  getMyGuildTeam,
  getMyInviteList,
  rejectGuildTeamInvite,
} from "@/src/api/guild_team.api";
import { getScrimApplicationList } from "@/src/api/scrim.api";
import CustomAlert from "@/src/common/components/alert/CustomAlert";
import { GuildTeamInviteDto } from "@/src/common/DTOs/guild/guild_team/guild_team_invite.dto";
import { ScrimApplicationDto } from "@/src/common/DTOs/scrim/scrim_application.dto";
import { useGuildTeamStore } from "@/src/common/zustand/guild_team.zustand";
import { formatKoreanDatetime } from "@/src/utils/string/string.util";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const router = useRouter();
  const { guildTeam, setGuildTeam } = useGuildTeamStore();
  const [tab, setTab] = useState<"team" | "battle">("team");
  const [teamInvites, setTeamInvites] = useState<GuildTeamInviteDto[]>([]);
  const [applications, setApplications] = useState<ScrimApplicationDto[]>([]);

  useEffect(() => {
    getMyInviteList()
      .then((response) => {
        setTeamInvites(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
    getScrimApplicationList()
      .then((response) => {
        setApplications(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
    getMyGuildTeam()
      .then((response) => {
        setGuildTeam(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleAccept = (inviteId: string) => {
    acceptGuildTeamInvite(inviteId)
      .then((response) => {
        CustomAlert("success", "팀 초대", "팀 초대를 수락 하셨습니다.");
        router.refresh();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleReject = (inviteId: string) => {
    rejectGuildTeamInvite(inviteId)
      .then((response) => {
        CustomAlert("success", "팀 초대", "팀 초대를 거절 하셨습니다.");
        router.refresh();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="max-w-[1200px] mx-auto p-[28px] flex flex-col gap-[24px] min-h-[600px]">
      {/* 탭 */}
      <div className="flex border-b border-gray-300 dark:border-gray-700">
        <button
          className={`px-[20px] py-[10px] font-semibold transition-colors ${
            tab === "team"
              ? "border-b-[4px] border-brandcolor text-brandcolor"
              : "text-gray-500 hover:text-brandcolor"
          }`}
          onClick={() => setTab("team")}
          aria-selected={tab === "team"}
          role="tab"
        >
          팀 초대 알림
        </button>
        <button
          className={`px-[20px] py-[10px] font-semibold transition-colors ${
            tab === "battle"
              ? "border-b-[4px] border-brandcolor text-brandcolor"
              : "text-gray-500 hover:text-brandcolor"
          }`}
          onClick={() => setTab("battle")}
          aria-selected={tab === "battle"}
          role="tab"
        >
          내전 알림
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
              내전 알림이 없습니다.
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
                  className={`p-[16px] rounded-lg border flex flex-col gap-[6px] ${
                    application.status === "PENDING" && isRecipient
                      ? "border-brandcolor bg-white dark:bg-branddark"
                      : "border-gray-300 bg-gray-50 dark:bg-gray-800"
                  }`}
                >
                  <p>
                    팀{" "}
                    <strong>
                      {opponentTeam.leader?.memberName ?? "상대팀"}
                    </strong>{" "}
                    과(와){" "}
                    <strong>
                      {formatKoreanDatetime(
                        application.scrimSlot.scheduledAt.toString()
                      )}
                    </strong>{" "}
                    에 스크림이{" "}
                    {application.status === "ACCEPTED"
                      ? "생성되었습니다"
                      : application.status === "REJECTED"
                      ? "거절되었습니다"
                      : "신청 대기 중입니다"}
                    .
                  </p>

                  {/* ✅ 신청 받은 사람만 수락/거절 버튼 노출 */}
                  {isRecipient && application.status === "PENDING" && (
                    <div className="flex gap-[12px] mt-[8px]">
                      <button
                        className="px-[16px] py-[8px] bg-brandcolor text-white rounded-md hover:opacity-90 transition"
                        // onClick={() => handleBattleAccept(application.id)}
                      >
                        수락
                      </button>
                      <button
                        className="px-[16px] py-[8px] border border-gray-300 rounded-md hover:bg-gray-100 transition"
                        // onClick={() => handleBattleDecline(application.id)}
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
    </div>
  );
}

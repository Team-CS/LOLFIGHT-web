"use client";

import { useState } from "react";

type TeamInviteAlarm = {
  id: number;
  inviter: string;
  teamName: string;
  role: string;
  status: "pending" | "accepted" | "declined";
};

type BattleAlarm = {
  id: number;
  opponentTeam: string;
  date: string;
  status: "pending" | "scheduled" | "declined";
  role: "applicant" | "recipient"; // 신청한 사람 or 신청 받은 사람 구분
};

const dummyBattleAlarms: BattleAlarm[] = [
  // 신청 받은 사람 예시: 수락/거절 가능 상태 pending
  {
    id: 1,
    opponentTeam: "다리우스의형제들",
    date: "2025-07-05 21:00",
    status: "pending",
    role: "recipient",
  },
  // 신청한 사람 예시: 생성됨 상태
  {
    id: 2,
    opponentTeam: "모데카이저팀",
    date: "2025-07-01 18:30",
    status: "scheduled",
    role: "applicant",
  },
  // 신청한 사람 예시: 거절됨 상태
  {
    id: 3,
    opponentTeam: "블루팀",
    date: "2025-06-30 20:00",
    status: "declined",
    role: "applicant",
  },
];

const dummyTeamInvites: TeamInviteAlarm[] = [
  {
    id: 1,
    inviter: "길드원A",
    teamName: "다리우스의형제들",
    role: "TOP",
    status: "pending",
  },
  {
    id: 2,
    inviter: "길드원B",
    teamName: "모데카이저팀",
    role: "JUNGLE",
    status: "accepted",
  },
  {
    id: 3,
    inviter: "길드원C",
    teamName: "블루팀",
    role: "MID",
    status: "declined",
  },
];

export default function Page() {
  const [tab, setTab] = useState<"team" | "battle">("team");

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
          {dummyTeamInvites.length === 0 ? (
            <p className="text-center text-gray-400 py-[40px]">
              새로운 팀 초대 알림이 없습니다.
            </p>
          ) : (
            dummyTeamInvites.map((invite) => (
              <div
                key={invite.id}
                className={`p-[16px] rounded-lg border ${
                  invite.status === "pending"
                    ? "border-brandcolor bg-white dark:bg-branddark"
                    : "border-gray-300 bg-gray-50 dark:bg-gray-800"
                } flex flex-col md:flex-row md:items-center justify-between gap-[12px]`}
              >
                <div className="text-[15px]">
                  <strong>{invite.inviter}</strong>님이
                  <strong>{invite.teamName}</strong>팀의
                  <strong>{invite.role}</strong> 라인으로 초대했습니다.
                </div>
                <div className="flex gap-[12px]">
                  {invite.status === "pending" ? (
                    <>
                      <button
                        className="px-[14px] py-[4px] bg-brandcolor text-white rounded-md hover:opacity-90 transition"
                        // onClick={() => handleAccept(invite.id)}
                      >
                        수락
                      </button>
                      <button
                        className="px-[14px] py-[4px] border border-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-brandgray transition"
                        // onClick={() => handleDecline(invite.id)}
                      >
                        거절
                      </button>
                    </>
                  ) : (
                    <p
                      className={`font-semibold ${
                        invite.status === "accepted"
                          ? "text-blue-500"
                          : "text-red-500"
                      }`}
                    >
                      {invite.status === "accepted" ? "수락됨" : "거절됨"}
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
          {dummyBattleAlarms.length === 0 ? (
            <p className="text-center text-gray-400 py-[40px]">
              내전 알림이 없습니다.
            </p>
          ) : (
            dummyBattleAlarms.map((alarm) => {
              const isRecipient = alarm.role === "recipient";
              return (
                <div
                  key={alarm.id}
                  className={`p-[16px] rounded-lg border flex flex-col gap-[6px] ${
                    alarm.status === "pending" && isRecipient
                      ? "border-brandcolor bg-white dark:bg-branddark"
                      : "border-gray-300 bg-gray-50 dark:bg-gray-800"
                  }`}
                >
                  <p>
                    팀 <strong>{alarm.opponentTeam}</strong>과(와)
                    <strong>{alarm.date}</strong>에 내전이
                    {alarm.status === "scheduled"
                      ? "생성되었습니다"
                      : alarm.status === "declined"
                      ? "거절되었습니다"
                      : "신청 대기 중입니다"}
                    .
                  </p>

                  {/* 신청 받은 사람(수락/거절 버튼 있음) */}
                  {isRecipient && alarm.status === "pending" && (
                    <div className="flex gap-[12px] mt-[8px]">
                      <button
                        className="px-[16px] py-[8px] bg-brandcolor text-white rounded-md hover:opacity-90 transition"
                        // onClick={() => handleBattleAccept(alarm.id)}
                      >
                        수락
                      </button>
                      <button
                        className="px-[16px] py-[8px] border border-gray-300 rounded-md hover:bg-gray-100 transition"
                        // onClick={() => handleBattleDecline(alarm.id)}
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

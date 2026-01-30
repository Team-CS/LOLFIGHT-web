import CustomAlert from "@/src/common/components/alert/CustomAlert";
import { ScrimApplicationDto } from "@/src/common/DTOs/scrim/scrim_application.dto";
import { useGuildTeamStore } from "@/src/common/zustand/guild_team.zustand";
import { useMemberStore } from "@/src/common/zustand/member.zustand";
import { formatKoreanDatetime } from "@/src/utils/string/string.util";
import { useState } from "react";

interface MatchCardProps {
  scrim: ScrimApplicationDto;
  onCancel: (id: string) => void;
}

const MatchCard = (props: MatchCardProps) => {
  const { scrim, onCancel } = props;
  const { guildTeam } = useGuildTeamStore();
  const { member } = useMemberStore();

  const isFinished = scrim.status === "CLOSED";

  const myTeamId = guildTeam?.id;
  const applicantTeamId = scrim.applicationTeam?.id;
  const isRecipient = myTeamId === applicantTeamId;
  const isLeader = guildTeam?.leader.id === member?.id;

  const opponentTeam = isRecipient
    ? scrim.scrimSlot?.hostTeam
    : scrim.applicationTeam;

  const resultText = (() => {
    switch (scrim.status) {
      case "PENDING":
        return isRecipient ? "신청 대기중" : "수락 대기중";
      case "ACCEPTED":
        return "대기중";
      case "CLOSED":
        return "종료";
      default:
        return "오류";
    }
  })();

  const getResultColor = () => {
    switch (resultText) {
      case "대기중":
        return "text-blue-500";
      case "종료":
        return "text-red-500";
      case "신청 대기중":
      case "수락 대기중":
        return "text-yellow-500";
      default:
        return "text-gray-500";
    }
  };

  // ✅ 입장 코드 표시 조건: 상태가 ACCEPTED이고 예정 시간이 10분 전 이내
  const scheduledAtStr = scrim.scrimSlot?.scheduledAt || null;
  const now = new Date();
  const scheduledAt = scheduledAtStr ? new Date(scheduledAtStr) : null;
  const isAccepted = scrim.status === "ACCEPTED";
  const isWithin10Min =
    scheduledAt && (scheduledAt.getTime() - now.getTime()) / 1000 / 60 <= 10;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const codes = Array.isArray(scrim.scrimSlot?.code)
    ? scrim.scrimSlot.code
    : [];

  const showCodeClick = () => {
    if (isWithin10Min && isAccepted) {
      setIsModalOpen(true);
    } else {
      CustomAlert(
        "info",
        "코드 확인",
        "스크림 시작 시간 10분전에 확인 가능합니다."
      );
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    alert(`${index + 1}세트 코드가 복사되었습니다!`);
  };

  const statusBadge = (() => {
    switch (scrim.status) {
      case "PENDING":
        return {
          bg: "bg-amber-50 dark:bg-amber-900/30",
          text: "text-amber-600 dark:text-amber-400",
          label: isRecipient ? "신청 대기" : "수락 대기"
        };
      case "ACCEPTED":
        return {
          bg: "bg-blue-50 dark:bg-blue-900/30",
          text: "text-blue-600 dark:text-blue-400",
          label: "확정"
        };
      case "CLOSED":
        return {
          bg: "bg-gray-100 dark:bg-gray-700",
          text: "text-gray-500 dark:text-gray-400",
          label: "종료"
        };
      default:
        return {
          bg: "bg-gray-100 dark:bg-gray-700",
          text: "text-gray-500",
          label: "오류"
        };
    }
  })();

  return (
    <>
      <div
        className={`p-[14px] rounded-[12px] border flex flex-col gap-[10px] transition-all ${
          isFinished
            ? "bg-gray-50 dark:bg-branddark border-gray-100 dark:border-branddarkborder opacity-70"
            : "bg-white dark:bg-dark border-gray-100 dark:border-branddarkborder hover:border-brandcolor/30"
        }`}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-[8px]">
            <span className={`px-[10px] py-[3px] rounded-full text-[11px] font-medium ${statusBadge.bg} ${statusBadge.text}`}>
              {statusBadge.label}
            </span>
            {!isFinished && (
              <div className="w-[6px] h-[6px] rounded-full bg-green-500 animate-pulse" />
            )}
          </div>
          {!isFinished && isLeader && (
            <button
              className="px-[12px] py-[5px] text-[11px] text-red-500 border border-red-200 dark:border-red-900/50 rounded-[6px] hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium"
              onClick={() => onCancel(scrim.scrimSlot.id)}
            >
              취소
            </button>
          )}
        </div>

        <div className="flex flex-col gap-[4px]">
          <div className="flex items-center gap-[6px] text-[12px]">
            <span className="text-gray-400">상대</span>
            <span className="font-semibold text-brandcolor">
              {opponentTeam?.leader?.memberName ?? "알 수 없음"}
            </span>
          </div>
          <div className="flex items-center gap-[6px] text-[12px]">
            <span className="text-gray-400">일정</span>
            <span className="font-medium text-gray-600 dark:text-gray-300">
              {scrim.scrimSlot?.scheduledAt
                ? formatKoreanDatetime(scrim.scrimSlot.scheduledAt.toString())
                : "미정"}
            </span>
          </div>
        </div>

        {scrim.status === "ACCEPTED" && (
          <button
            className="flex items-center justify-center gap-[6px] w-full py-[8px] bg-gradient-to-r from-brandcolor to-blue-500 text-white text-[12px] font-medium rounded-[8px] hover:opacity-90 transition-opacity"
            onClick={showCodeClick}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-[14px] h-[14px]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z"
              />
            </svg>
            입장 코드 확인
          </button>
        )}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-dark w-full max-w-md rounded-[16px] shadow-2xl border border-gray-100 dark:border-branddarkborder overflow-hidden">
            <div className="p-[20px] bg-gradient-to-r from-gray-50 to-white dark:from-branddark dark:to-dark border-b border-gray-100 dark:border-branddarkborder flex justify-between items-center">
              <div className="flex items-center gap-[10px]">
                <div className="w-[4px] h-[20px] bg-gradient-to-b from-brandcolor to-blue-400 rounded-full" />
                <h3 className="text-[16px] font-bold">경기 입장 코드</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-[6px] rounded-full hover:bg-gray-100 dark:hover:bg-branddarkborder transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-[18px] h-[18px] text-gray-500"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-[16px] max-h-[350px] overflow-y-auto flex flex-col gap-[10px]">
              {codes.length > 0 ? (
                codes.map((c, idx) => {
                  const isGameFinished =
                    idx < (scrim.scrimSlot?.currentGameCount || 0);

                  return (
                    <div
                      key={idx}
                      className={`flex flex-col gap-[8px] p-[14px] rounded-[10px] border transition-all ${
                        isGameFinished
                          ? "bg-gray-50 dark:bg-branddark border-gray-100 dark:border-branddarkborder opacity-60"
                          : "bg-white dark:bg-dark border-brandcolor/30 shadow-sm"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-[8px]">
                          <span
                            className={`px-[10px] py-[3px] rounded-full text-[11px] font-bold ${
                              isGameFinished
                                ? "bg-gray-100 dark:bg-gray-700 text-gray-500"
                                : "bg-brandcolor/10 text-brandcolor"
                            }`}
                          >
                            {idx + 1} SET
                          </span>
                          {isGameFinished && (
                            <span className="text-[10px] px-[8px] py-[2px] bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 rounded-full">
                              종료됨
                            </span>
                          )}
                        </div>

                        {!isGameFinished && (
                          <button
                            onClick={() => handleCopy(c, idx)}
                            className="flex items-center gap-[4px] text-[11px] bg-gray-50 dark:bg-branddark border border-gray-200 dark:border-branddarkborder px-[10px] py-[5px] rounded-[6px] hover:bg-gray-100 dark:hover:bg-branddarkborder active:scale-95 transition-all font-medium"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={2}
                              stroke="currentColor"
                              className="w-[12px] h-[12px]"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                            </svg>
                            복사
                          </button>
                        )}
                      </div>

                      <code
                        className={`text-[12px] break-all font-mono p-[10px] rounded-[6px] ${
                          isGameFinished
                            ? "bg-gray-100 dark:bg-gray-800 text-gray-400 line-through"
                            : "bg-gray-50 dark:bg-branddark text-gray-700 dark:text-gray-200"
                        }`}
                      >
                        {c}
                      </code>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center gap-[8px] py-[30px]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-[32px] h-[32px] text-gray-300"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                  </svg>
                  <p className="text-gray-400 text-[13px]">생성된 코드가 없습니다</p>
                </div>
              )}
            </div>

            <div className="p-[16px] border-t border-gray-100 dark:border-branddarkborder">
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full py-[12px] bg-gradient-to-r from-brandcolor to-blue-500 text-white rounded-[10px] font-medium hover:opacity-90 transition-opacity shadow-md"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MatchCard;

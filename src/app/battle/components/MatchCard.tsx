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

  return (
    <>
      <div
        className={`p-[12px] rounded-lg border border-brandborder dark:border-branddarkborder flex flex-col gap-[4px] ${
          isFinished
            ? "bg-gray-100 dark:bg-black"
            : "bg-white dark:bg-brandgray"
        }`}
      >
        <div className="flex justify-between items-center">
          <p
            className={`text-[14px] font-medium ${
              isFinished ? "text-gray-400" : "text-branddark dark:text-white"
            }`}
          >
            {isFinished ? "✅ 최근 내전 결과" : "🔥 예정된 내전"}
          </p>
          {!isFinished && isLeader && (
            <div className="flex items-center gap-[8px]">
              <button
                className="px-[12px] py-[4px] bg-brandcolor text-[14px] text-white rounded-md hover:opacity-90"
                onClick={() => onCancel(scrim.scrimSlot.id)}
              >
                취소
              </button>
            </div>
          )}
        </div>

        <p className="text-[13px] text-gray-600 dark:text-gray-300">
          상대팀:{" "}
          <span className="font-semibold">
            {opponentTeam?.leader?.memberName ?? "알 수 없음"}
          </span>
        </p>

        <p className="text-[13px] text-gray-600 dark:text-gray-300">
          일정:{" "}
          {scrim.scrimSlot?.scheduledAt
            ? formatKoreanDatetime(scrim.scrimSlot.scheduledAt.toString())
            : "미정"}
        </p>

        <div className="flex justify-between">
          <p className="text-[13px] text-gray-600 dark:text-gray-300">
            상태:{" "}
            <span className={`${getResultColor()} font-semibold`}>
              {resultText}
            </span>
          </p>
          {scrim.status === "ACCEPTED" && (
            <div
              className="flex items-center gap-[12px] bg-brandcolor dark:bg-branddark text-white text-[12px] px-[8px] py-[2px] rounded-[12px] cursor-pointer"
              onClick={showCodeClick}
            >
              코드 확인
            </div>
          )}
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white dark:bg-brandgray w-full max-w-md rounded-xl shadow-xl overflow-hidden">
            <div className="p-[20px] border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-[18px] font-bold dark:text-white">
                🎮 경기 입장 코드
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="p-[20px] max-h-[400px] overflow-y-auto flex flex-col gap-[12px]">
              {codes.length > 0 ? (
                codes.map((c, idx) => {
                  // ✅ 이미 진행된 게임인지 확인 (예: 1판 진행했다면 0번 인덱스는 종료)
                  const isFinished =
                    idx < (scrim.scrimSlot?.currentGameCount || 0);

                  return (
                    <div
                      key={idx}
                      className={`flex flex-col gap-[4px] p-[12px] rounded-lg border transition-all ${
                        isFinished
                          ? "bg-gray-200 dark:bg-[#1a1a1a] border-gray-300 dark:border-gray-800 opacity-60"
                          : "bg-gray-50 dark:bg-[#2f2f2f] border-gray-200 dark:border-gray-600 shadow-sm"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[12px] font-bold ${
                              isFinished ? "text-gray-500" : "text-brandcolor"
                            }`}
                          >
                            {idx + 1} SET
                          </span>
                          {isFinished && (
                            <span className="text-[10px] bg-gray-400 text-white px-1.5 py-0.5 rounded">
                              종료됨
                            </span>
                          )}
                        </div>

                        {!isFinished && (
                          <button
                            onClick={() => handleCopy(c, idx)}
                            className="text-[11px] bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-500 px-[8px] py-[3px] rounded hover:bg-gray-100 active:scale-95 transition-transform shadow-sm"
                          >
                            복사하기
                          </button>
                        )}
                      </div>

                      <code
                        className={`text-[13px] break-all font-mono mt-[4px] ${
                          isFinished
                            ? "text-gray-400 line-through decoration-1"
                            : "text-gray-800 dark:text-gray-200"
                        }`}
                      >
                        {c}
                      </code>
                    </div>
                  );
                })
              ) : (
                <p className="text-center text-gray-500 py-4">
                  생성된 코드가 없습니다.
                </p>
              )}
            </div>

            <div className="p-[16px] bg-gray-50 dark:bg-branddark text-center">
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full py-[10px] bg-brandcolor text-white rounded-lg font-medium hover:brightness-110 transition-all"
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

import CustomAlert from "@/src/common/components/alert/CustomAlert";
import { ScrimApplicationDto } from "@/src/common/DTOs/scrim/scrim_application.dto";
import { useGuildTeamStore } from "@/src/common/zustand/guild_team.zustand";
import { useMemberStore } from "@/src/common/zustand/member.zustand";
import { formatKoreanDatetime } from "@/src/utils/string/string.util";
import { useState } from "react";

interface MatchCardProps {
  scrim: ScrimApplicationDto;
  onCancel: (id: string) => void;
  onRematch: (scrimSlotId: string, applicationTeamId: string) => void;
}

const MatchCard = (props: MatchCardProps) => {
  const { scrim, onCancel, onRematch } = props;
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

  // ✅ 입장 코드 표시 조건: 상태가 ACCEPTED이고 예정 시간이 5분 전 이내
  const scheduledAtStr = scrim.scrimSlot?.scheduledAt || null;
  const now = new Date();
  const scheduledAt = scheduledAtStr ? new Date(scheduledAtStr) : null;
  const isAccepted = scrim.status === "ACCEPTED";
  const isWithin5Min =
    scheduledAt && (scheduledAt.getTime() - now.getTime()) / 1000 / 60 <= 5;
  const [showEntryCode, setShowEntryCode] = useState<boolean>(false);
  const [code, setCode] = useState<string>("");
  const isClosed = scrim.status === "CLOSED";
  const finishedAtStr = scrim?.updatedAt;
  const finishedAt = finishedAtStr ? new Date(finishedAtStr) : null;

  const isWithin10MinAfterFinish =
    finishedAt &&
    (now.getTime() - finishedAt.getTime()) / 1000 / 60 <= 10 &&
    now.getTime() > finishedAt.getTime();

  const showRematchButton =
    isRecipient && isClosed && Boolean(isWithin10MinAfterFinish);

  const showCodeClick = () => {
    if (isWithin5Min && isAccepted) {
      if (showEntryCode === false) setShowEntryCode(true);
      // const data = @TODO 실제 방 코드 요쳥 api
      setCode(scrim.scrimSlot.code);
    } else {
      CustomAlert(
        "info",
        "코드 확인",
        "스크림 시작 시간 10분전에 확인 가능합니다."
      );
    }
  };

  return (
    <div
      className={`p-[12px] rounded-lg border border-brandborder dark:border-branddarkborder flex flex-col gap-[4px] ${
        isFinished ? "bg-gray-100 dark:bg-black" : "bg-white dark:bg-brandgray"
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
          <div className="flex items-center gap-[12px]" onClick={showCodeClick}>
            {showEntryCode ? (
              <span
                className="text-[14px]"
                onClick={() => {
                  navigator.clipboard.writeText(code);
                  alert("입장 코드가 복사되었습니다!");
                }}
              >
                <p className="text-[13px] text-gray-600 dark:text-gray-300">
                  입장 코드 :{" "}
                  <span className="font-semibold cursor-pointer text-blue-500">
                    {code}
                  </span>
                </p>
              </span>
            ) : (
              <div className="bg-brandcolor dark:bg-branddark text-white text-[12px] px-[8px] py-[2px] rounded-[12px] cursor-pointer">
                코드 확인
              </div>
            )}
          </div>
        )}
        {showRematchButton && (
          <button
            className="px-[8px] py-[4px] text-[14px] bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            onClick={() => {
              onRematch(scrim.scrimSlot.id, scrim.applicationTeam.id);
            }}
          >
            재경기 신청
          </button>
        )}
      </div>
    </div>
  );
};

export default MatchCard;

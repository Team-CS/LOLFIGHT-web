import Image from "next/image";
import { BetDto } from "@/src/common/DTOs/bet/bet.dto";
import { BetStatus } from "@/src/common/types/enums/bet.enum";

interface BetHistoryItemProps {
  bet: BetDto;
  onCancel: (betId: string) => void;
}

export default function BetHistoryItem(props: BetHistoryItemProps) {
  const { bet, onCancel } = props;
  const { proMatch } = bet;

  const isWin = bet.status === BetStatus.WON;
  const isLost = bet.status === BetStatus.LOST;
  const isPending = bet.status === BetStatus.PENDING;

  const isBetOnTeamA = bet.betTeamCode === proMatch.teamACode;
  const betTeamName = isBetOnTeamA ? proMatch.teamAName : proMatch.teamBName;

  const statusLabel = {
    [BetStatus.PENDING]: "대기 중",
    [BetStatus.WON]: "승리",
    [BetStatus.LOST]: "패배",
    [BetStatus.CANCELLED]: "취소됨",
    [BetStatus.REFUNDED]: "환불됨",
  };

  const statusBadgeStyle = {
    [BetStatus.PENDING]:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-500",
    [BetStatus.WON]:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-500",
    [BetStatus.LOST]:
      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-500",
    [BetStatus.CANCELLED]:
      "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
    [BetStatus.REFUNDED]:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-500",
  };

  return (
    <div
      className={`relative flex flex-col gap-[12px] p-[16px] border rounded-[12px] transition-all shadow-sm
      ${
        isWin
          ? "bg-green-50/50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
          : isLost
            ? "bg-red-50/50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
            : "bg-white dark:bg-branddark dark:border-branddarkborder"
      }`}
    >
      {/* 상단 */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <span className="text-[11px] font-medium text-gray-400 uppercase tracking-[1px]">
            {proMatch.leagueName}
          </span>
          <span className="text-[10px] text-gray-400">
            {new Date(proMatch.startTime).toLocaleString("ko-KR", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        <div className="flex items-center gap-[8px]">
          <span
            className={`px-[8px] py-[2px] rounded-[4px] text-[11px] font-bold ${
              statusBadgeStyle[bet.status]
            } `}
          >
            {statusLabel[bet.status]}
          </span>

          {isPending && (
            <button
              onClick={() => onCancel(bet.id)}
              className="text-[11px] font-medium text-red-500 hover:text-red-700 underline underline-offset-[2px] transition-colors"
            >
              취소
            </button>
          )}
        </div>
      </div>

      {/* 중앙 VS */}
      <div className="flex items-center justify-between py-[8px] border-y border-gray-100 dark:border-gray-800">
        <div className="flex flex-col items-center gap-[4px] flex-1">
          <Image
            src={proMatch.teamAImage!}
            alt="teamA"
            width={32}
            height={32}
            className="rounded-[12px] bg-gray-800 p-[2px] shadow-sm"
          />
          <span
            className={`text-[12px] ${
              isBetOnTeamA ? "font-bold text-brandcolor" : "text-gray-600"
            }`}
          >
            {proMatch.teamAName}
          </span>
        </div>

        <div className="flex flex-col items-center px-[16px]">
          <span className="text-[10px] font-black text-gray-300 italic">
            VS
          </span>
        </div>

        <div className="flex flex-col items-center gap-[4px] flex-1">
          <Image
            src={proMatch.teamBImage!}
            alt="teamB"
            width={32}
            height={32}
            className="rounded-[12px] bg-gray-800 p-[2px] shadow-sm"
          />
          <span
            className={`text-[12px] ${
              !isBetOnTeamA ? "font-bold text-brandcolor" : "text-gray-600"
            }`}
          >
            {proMatch.teamBName}
          </span>
        </div>
      </div>

      {/* 하단 */}
      <div className="flex flex-col gap-[8px]">
        <div className="flex justify-between items-center bg-gray-100/50 dark:bg-black/20 p-[8px] rounded-[8px]">
          <div className="flex items-center gap-[8px]">
            <div className="w-[4px] h-[12px] bg-brandcolor rounded-full" />
            <span className="text-[12px] font-medium">
              선택:{" "}
              <span className="text-brandcolor font-bold">{betTeamName}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

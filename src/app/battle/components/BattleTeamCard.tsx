import constant from "@/src/common/constant/constant";
import { ScrimSlotDto } from "@/src/common/DTOs/scrim/scrim_slot.dto";
import {
  calGuildTier,
  formatKoreanDatetime,
  getTierStyle,
} from "@/src/utils/string/string.util";
import Image from "next/image";

interface BattleTeamCardProps {
  scrimSlot: ScrimSlotDto;
  onClick?: () => void;
}

export const BattleTeamCard = (props: BattleTeamCardProps) => {
  const { scrimSlot, onClick } = props;
  const team = scrimSlot.hostTeam;
  const guild = scrimSlot.hostTeam.guild;
  const guildTier = guild?.guildRecord?.recordLadder
    ? calGuildTier(guild.guildRecord.recordLadder)
    : "없음";

  return (
    <div
      className="flex flex-col w-full max-w-[210px] p-[14px] rounded-[14px] bg-white dark:bg-dark border border-gray-100 dark:border-branddarkborder gap-[12px] cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-brandcolor/50 hover:-translate-y-[2px]"
      onClick={onClick}
    >
      {/* Guild Info */}
      <div className="flex items-center gap-[10px]">
        <div className="relative">
          {guild?.guildIcon ? (
            <Image
              src={`${constant.SERVER_URL}/${guild.guildIcon}`}
              alt="Guild Logo"
              width={40}
              height={40}
              className="w-[38px] h-[38px] rounded-[10px] object-cover shadow-sm"
            />
          ) : (
            <div className="w-[38px] h-[38px] rounded-[10px] bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center text-[18px] shadow-sm">
              🏛️
            </div>
          )}
        </div>
        <div className="flex flex-col min-w-0">
          <p className="text-[14px] font-bold truncate">
            {guild?.guildName || "해체된 길드"}
          </p>
          <p className="text-[11px] text-gray-400 truncate">
            {team.leader.memberName}
          </p>
        </div>
      </div>

      {/* Ladder Info */}
      <div className="flex flex-col gap-[6px] py-[8px] px-[10px] bg-gray-50 dark:bg-branddark rounded-[8px]">
        {guild ? (
          <>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-gray-500 dark:text-gray-400">래더</span>
              <span className="font-semibold text-brandcolor">
                {guild.guildRecord?.recordLadder || 0}점
              </span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-gray-500 dark:text-gray-400">순위</span>
              <span className="font-medium">
                {guild.guildRecord?.recordRanking || "-"}위
              </span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-gray-500 dark:text-gray-400">티어</span>
              <span className={`font-semibold ${getTierStyle(guildTier)}`}>
                {guildTier}
              </span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-gray-500 dark:text-gray-400">판수</span>
              <span className={`font-medium `}>{scrimSlot.totalGameCount}</span>
            </div>
          </>
        ) : (
          <p className="text-gray-400 text-[11px] text-center">
            길드 정보 없음
          </p>
        )}
      </div>

      {/* Match Time */}
      <div className="flex items-center gap-[6px] mt-auto pt-[8px] border-t border-gray-100 dark:border-branddarkborder">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-[14px] h-[14px] text-brandcolor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
        <span className="text-[11px] text-gray-500 dark:text-gray-400">
          {formatKoreanDatetime(scrimSlot.scheduledAt.toString())}
        </span>
      </div>
    </div>
  );
};

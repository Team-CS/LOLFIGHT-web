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

export const BattleTeamCardMobile = (props: BattleTeamCardProps) => {
  const { scrimSlot, onClick } = props;
  const team = scrimSlot.hostTeam;
  const guild = scrimSlot.hostTeam.guild;
  const guildTier = guild?.guildRecord?.recordLadder
    ? calGuildTier(guild.guildRecord.recordLadder)
    : "없음";

  return (
    <div
      className="flex flex-col w-full p-[14px] rounded-[12px] bg-white dark:bg-dark border border-gray-100 dark:border-branddarkborder gap-[10px] cursor-pointer transition-all duration-200 active:scale-[0.99]"
      onClick={onClick}
    >
      {/* Guild Info & Stats */}
      <div className="flex items-center justify-between">
        <div className="flex gap-[10px] items-center">
          {guild?.guildIcon ? (
            <Image
              src={`${constant.SERVER_URL}/${guild.guildIcon}`}
              alt="Guild Logo"
              width={35}
              height={35}
              className="w-[38px] h-[38px] rounded-[10px] object-cover shadow-sm"
            />
          ) : (
            <div className="w-[38px] h-[38px] rounded-[10px] bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center text-[16px] shadow-sm">
              🏛️
            </div>
          )}
          <div className="flex flex-col">
            <p className="text-[13px] font-bold">
              {guild?.guildName || "해체된 길드"}
            </p>
            <p className="text-[11px] text-gray-400">
              {team.leader.memberName}
            </p>
          </div>
        </div>

        {/* Ladder Info */}
        <div className="flex gap-[8px]">
          {guild ? (
            <>
              <div className="flex flex-col items-end gap-[2px]">
                <div className="flex items-center gap-[4px]">
                  <span className="text-[10px] text-gray-400">래더</span>
                  <span className="text-[11px] font-semibold text-brandcolor">{guild.guildRecord?.recordLadder || 0}</span>
                </div>
                <div className="flex items-center gap-[4px]">
                  <span className="text-[10px] text-gray-400">순위</span>
                  <span className="text-[11px] font-medium">{guild.guildRecord?.recordRanking || "-"}위</span>
                </div>
              </div>
              <div className="w-[1px] h-[28px] bg-gray-100 dark:bg-branddarkborder" />
              <div className="flex flex-col items-end gap-[2px]">
                <div className="flex items-center gap-[4px]">
                  <span className="text-[10px] text-gray-400">티어</span>
                  <span className={`text-[11px] font-semibold ${getTierStyle(guildTier)}`}>{guildTier}</span>
                </div>
                <div className="flex items-center gap-[4px]">
                  <span className="text-[10px] text-gray-400">멤버</span>
                  <span className="text-[11px] font-medium">{team.members.length}명</span>
                </div>
              </div>
            </>
          ) : (
            <span className="text-[11px] text-gray-400 px-[8px] py-[4px] bg-gray-50 dark:bg-branddark rounded-[6px]">정보 없음</span>
          )}
        </div>
      </div>

      {/* Match Time */}
      <div className="flex items-center gap-[6px] pt-[8px] border-t border-gray-100 dark:border-branddarkborder">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-[12px] h-[12px] text-brandcolor"
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

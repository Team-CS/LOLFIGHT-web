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
  const guildTier = calGuildTier(guild.guildRecord!.recordLadder);

  return (
    <div
      className="flex flex-col w-full max-w-[280px] p-[16px] rounded-[12px] shadow-md bg-white dark:bg-brandgray gap-[12px] transform transition-transform duration-200 ease-in-out hover:scale-105"
      onClick={onClick}
    >
      {/* Guild Info */}
      <div className="flex items-center gap-[12px]">
        <Image
          src={`${constant.SERVER_URL}/${scrimSlot.hostTeam.guild.guildIcon}`}
          alt="Guild Logo"
          width={40}
          height={40}
          className="w-[40px] h-[40px] rounded-[12px] object-cover"
        />
        <div className="flex flex-col">
          <p className="text-[16px] font-semibold">{guild.guildName}</p>
          <p className="text-[12px] text-gray-400">
            리더: {team.leader.memberName}
          </p>
        </div>
      </div>

      {/* Ladder Info */}
      <div className="text-[13px] dark:text-gray-300 flex flex-col gap-[2px]">
        <p>🏆 래더 점수: {guild.guildRecord?.recordLadder}점</p>
        <p>📈 전체 순위: {guild.guildRecord?.recordRanking}위</p>
        <p>
          💠 길드티어:{" "}
          <span className={getTierStyle(guildTier)}>{guildTier}</span>
        </p>
        <p>
          👥 멤버:{" "}
          {team.members
            .slice(0, 1)
            .map((m) => m.member.memberName)
            .join(", ")}{" "}
          외 {team.members.length - 1}명
        </p>
      </div>

      {/* Members (간략) */}

      {/* Match Time */}
      <div className="mt-auto text-[13px] text-gray-400">
        🕒 {formatKoreanDatetime(scrimSlot.scheduledAt.toString())}
      </div>
    </div>
  );
};

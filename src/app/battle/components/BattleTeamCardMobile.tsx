import constant from "@/src/common/constant/constant";
import { ScrimSlotDto } from "@/src/common/DTOs/scrim/scrim_slot.dto";
import {
  calGuildTier,
  formatKoreanDatetime,
  getTierStyle,
} from "@/src/utils/string/string.util";

interface BattleTeamCardProps {
  scrimSlot: ScrimSlotDto;
  onClick?: () => void;
}

export const BattleTeamCardMobile = (props: BattleTeamCardProps) => {
  const { scrimSlot, onClick } = props;
  const team = scrimSlot.hostTeam;
  const guild = scrimSlot.hostTeam.guild;
  const guildTier = calGuildTier(guild.guildRecord!.recordLadder);

  return (
    <div
      className="flex flex-col w-full w-full p-[16px] rounded-[12px] shadow-md bg-white dark:bg-brandgray gap-[12px] transform transition-transform duration-200 ease-in-out hover:scale-105"
      onClick={onClick}
    >
      {/* Guild Info */}
      <div className="flex items-center justify-between">
        <div className="flex gap-[12px]">
          <img
            src={`${constant.SERVER_URL}/${scrimSlot.hostTeam.guild.guildIcon}`}
            alt="Guild Logo"
            className="w-[35px] h-[35px] rounded-[12px] object-cover"
          />
          <div className="flex flex-col">
            <p className="text-[14px] font-semibold">{guild.guildName}</p>
            <p className="text-[12px] text-gray-400">
              리더: {team.leader.memberName}
            </p>
          </div>
        </div>

        {/* Ladder Info */}
        <div className="text-[12px] dark:text-gray-300 flex gap-[12px]">
          <div>
            <p>🏆 : {guild.guildRecord?.recordLadder}점</p>
            <p>📈 : {guild.guildRecord?.recordRanking}위</p>
          </div>

          <div>
            <p>
              💠 : <span className={getTierStyle(guildTier)}>{guildTier}</span>
            </p>
            <p>
              👥 :{" "}
              {team.members
                .slice(0, 1)
                .map((m) => m.member.memberName)
                .join(", ")}{" "}
              외 {team.members.length - 1}명
            </p>
          </div>
        </div>
      </div>

      {/* Match Time */}
      <div className="text-[13px] text-gray-400">
        🕒 {formatKoreanDatetime(scrimSlot.scheduledAt.toString())}
      </div>
    </div>
  );
};

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
      className="flex flex-col w-full w-full p-[16px] rounded-[12px] shadow-md bg-white dark:bg-brandgray gap-[12px] transform transition-transform duration-200 ease-in-out hover:scale-105"
      onClick={onClick}
    >
      {/* Guild Info */}
      <div className="flex items-center justify-between">
        <div className="flex gap-[12px]">
          {guild?.guildIcon ? (
            <Image
              src={`${constant.SERVER_URL}/${guild.guildIcon}`}
              alt="Guild Logo"
              width={35}
              height={35}
              className="w-[35px] h-[35px] rounded-[12px] object-cover"
            />
          ) : (
            <div className="w-[35px] h-[35px] rounded-[12px] bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-[16px]">
              🏛️
            </div>
          )}
          <div className="flex flex-col">
            <p className="text-[14px] font-semibold">
              {guild?.guildName || "해체된 길드"}
            </p>
            <p className="text-[12px] text-gray-400">
              리더: {team.leader.memberName}
            </p>
          </div>
        </div>

        {/* Ladder Info */}
        <div className="text-[12px] dark:text-gray-300 flex gap-[12px]">
          {guild ? (
            <>
              <div>
                <p>🏆 : {guild.guildRecord?.recordLadder || 0}점</p>
                <p>📈 : {guild.guildRecord?.recordRanking || "-"}위</p>
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
            </>
          ) : (
            <div>
              <p className="text-gray-400">길드 정보 없음</p>
              <p>
                👥 :{" "}
                {team.members
                  .slice(0, 1)
                  .map((m) => m.member.memberName)
                  .join(", ")}{" "}
                외 {team.members.length - 1}명
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Match Time */}
      <div className="text-[13px] text-gray-400">
        🕒 {formatKoreanDatetime(scrimSlot.scheduledAt.toString())}
      </div>
    </div>
  );
};

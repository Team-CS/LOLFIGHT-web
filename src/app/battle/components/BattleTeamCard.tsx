import { getTierStyle } from "@/src/utils/string/string.util";

type BattleTeamCardProps = {
  guildLogo: string;
  guildName: string;
  leaderName: string;
  members: string[];
  matchTime: string;
  ladderPoint: number;
  rank: number;
  tier: string;
  onClick?: () => void;
};

export default function BattleTeamCard({
  guildLogo,
  guildName,
  leaderName,
  members,
  matchTime,
  ladderPoint,
  rank,
  tier,
  onClick,
}: BattleTeamCardProps) {
  return (
    <div
      className="w-full max-w-[280px] p-[16px] rounded-[12px] shadow-md bg-white dark:bg-brandgray flex flex-col gap-[12px] transform transition-transform duration-200 ease-in-out hover:scale-105"
      onClick={onClick}
    >
      {/* Guild Info */}
      <div className="flex items-center gap-[12px]">
        <img
          src={guildLogo}
          alt="Guild Logo"
          className="w-[40px] h-[40px] rounded-full object-cover"
        />
        <div className="flex flex-col">
          <p className="text-[16px] font-semibold">{guildName}</p>
          <p className="text-[12px] text-gray-400">리더: {leaderName}</p>
        </div>
      </div>

      {/* Ladder Info */}
      <div className="text-[13px] dark:text-gray-300 flex flex-col gap-[2px]">
        <p>🏆 래더 점수: {ladderPoint}점</p>
        <p>📈 전체 순위: {rank}위</p>
        <p>
          💠 길드티어: <span className={getTierStyle(tier)}>{tier}</span>
        </p>
      </div>

      {/* Members (간략) */}
      <div className="text-[13px] dark:text-gray-300">
        👥 멤버: {members.slice(0, 2).join(", ")} 외 {members.length - 2}명
      </div>

      {/* Match Time */}
      <div className="mt-auto text-[13px] text-gray-400">🕒 {matchTime}</div>
    </div>
  );
}

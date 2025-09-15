import constant from "@/src/common/constant/constant";
import { GuildTeamMemberDto } from "@/src/common/DTOs/guild/guild_team/guild_team_member.dto";
import { useIsMobile } from "@/src/hooks/useMediaQuery";
import { getTierStyle } from "@/src/utils/string/string.util";

interface TeamMemberCardProps {
  teamMember: GuildTeamMemberDto | undefined;
  roleTag: "TOP" | "JUNGLE" | "MID" | "ADC" | "SUPPORT";
  isEmpty?: boolean;
  onAddClick?: () => void;
}

const TeamMemberCard = (props: TeamMemberCardProps) => {
  const { teamMember, roleTag, isEmpty = false, onAddClick } = props;
  const isMobile = useIsMobile();

  if (isEmpty || !teamMember || !teamMember.member) {
    return (
      <div
        onClick={onAddClick}
        className="cursor-pointer flex items-center justify-center h-[60px] px-[8px] py-[12px] border border-dashed border-brandborder dark:border-branddarkborder rounded-lg bg-white/60 dark:bg-brandgray text-branddark dark:text-white hover:bg-brandhover transition"
      >
        <div className="flex items-center gap-[4px]">
          <span className="text-[14px]">+</span>
          <span className="text-[14px] font-medium">{roleTag} 자리 추가</span>
        </div>
      </div>
    );
  }

  const summonerName = teamMember.member.memberGame?.gameName || "Unknown";

  const tier = teamMember.member.memberGame?.gameTier || "UNRANKED";
  const rankImageUrl = `${constant.SERVER_URL}/public/rank/${
    tier.split(" ")[0]
  }.png`;
  const profileImgUrl = `${constant.SERVER_URL}/${teamMember.member.memberIcon}`;

  return (
    <div
      className="flex w-full items-center justify-center border border-brandborder rounded-lg bg-no-repeat bg-center dark:border-branddark"
      style={{
        backgroundImage: `url(${rankImageUrl})`,
        backgroundColor: "#f0f6fd",
        backgroundSize: "50%",
        backgroundPosition: "center",
      }}
    >
      <div className="flex w-full items-center justify-between bg-white/70 rounded-md px-[12px] py-[8px] gap-[8px] shadow-sm dark:bg-black/70">
        <div className="flex items-center gap-[8px] min-w-0">
          <img
            src={profileImgUrl}
            alt="profile"
            width={isMobile ? 28 : 32}
            height={isMobile ? 28 : 32}
            className="object-cover rounded-full"
          />
          <div className="truncate min-w-0">
            <p className="text-[14px] font-medium dark:text-white truncate">
              {summonerName}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-[6px] whitespace-nowrap">
          <img
            src={rankImageUrl}
            alt={tier}
            width={isMobile ? 22 : 24}
            height={isMobile ? 22 : 24}
          />
          <p className={`${isMobile ? "text-[12px]" : "text-[14px]"}`}>
            <span className={getTierStyle(tier)}>{tier}</span>
          </p>
          {isMobile ? (
            <img
              src={`${constant.SERVER_URL}/public/ranked-positions/${roleTag}.png`}
              width={18}
              height={18}
            />
          ) : (
            <div className="text-[14px] px-[6px] py-[2px] rounded-md bg-brandhover text-branddark font-medium select-none">
              {roleTag}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamMemberCard;

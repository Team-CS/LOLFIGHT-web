import constant from "@/src/common/constant/constant";
import { GuildTeamMemberDto } from "@/src/common/DTOs/guild/guild_team/guild_team_member.dto";
import { MemberDto } from "@/src/common/DTOs/member/member.dto";
import { useIsMobile } from "@/src/hooks/useMediaQuery";
import { getTierStyle } from "@/src/utils/string/string.util";
import Image from "next/image";

interface TeamMemberCardProps {
  teamMember: GuildTeamMemberDto | undefined;
  roleTag: "TOP" | "JUNGLE" | "MID" | "ADC" | "SUPPORT";
  isEmpty?: boolean;
  onAddClick?: () => void;
  invitedMember?: MemberDto;
}

const TeamMemberCard = (props: TeamMemberCardProps) => {
  const {
    teamMember,
    roleTag,
    isEmpty = false,
    onAddClick,
    invitedMember,
  } = props;
  const isMobile = useIsMobile();

  // 초대 중인 멤버가 있는 경우 초대 상태 표시
  if (invitedMember && !teamMember) {
    const summonerName = invitedMember.memberGame?.gameName || "Unknown";
    const tier = invitedMember.memberGame?.gameTier || "UNRANKED";
    const rankImageUrl = `${constant.SERVER_URL}/public/rank/${
      tier.split(" ")[0]
    }.png`;
    const profileImgUrl = `${constant.SERVER_URL}/${invitedMember.memberIcon}`;

    return (
      <div
        className="relative flex w-full items-center justify-center border border-amber-300 dark:border-amber-600 rounded-[10px] overflow-hidden bg-no-repeat"
        style={{
          backgroundImage: `url(${rankImageUrl})`,
          backgroundSize: "50px",
          backgroundPosition: "center",
        }}
      >
        {/* 배경 흐리게 하는 오버레이 */}
        <div className="absolute inset-0 bg-amber-50/90 dark:bg-amber-900/80" />
        <div
          className={`relative z-10 flex w-full items-center justify-between px-[14px] gap-[8px] ${
            isMobile ? "py-[8px]" : "py-[10px]"
          }`}
        >
          <div className="flex items-center gap-[10px] min-w-0">
            <div className="relative">
              <Image
                src={profileImgUrl}
                alt="profile"
                width={34}
                height={34}
                className={`${
                  isMobile ? "w-[30px] h-[30px]" : "w-[36px] h-[36px]"
                } rounded-[8px] object-cover shadow-sm`}
              />
              <div className="absolute -bottom-[2px] -right-[2px] w-[12px] h-[12px] bg-amber-500 rounded-full border-2 border-white dark:border-dark animate-pulse" />
            </div>
            <div className="truncate min-w-0">
              <p
                className={`font-semibold dark:text-white truncate ${isMobile ? "text-[12px]" : "text-[13px]"}`}
              >
                {summonerName}
              </p>
              <p
                className={`text-amber-600 dark:text-amber-400 ${isMobile ? "text-[10px]" : "text-[11px]"}`}
              >
                초대 대기중
              </p>
            </div>
          </div>
          <div className="flex items-center gap-[6px] whitespace-nowrap">
            <Image
              src={rankImageUrl}
              alt={tier}
              width={24}
              height={24}
              className={isMobile ? "w-[20px] h-[20px]" : "w-[22px] h-[22px]"}
            />
            <p
              className={`font-medium ${isMobile ? "text-[11px]" : "text-[12px]"}`}
            >
              <span className={getTierStyle(tier)}>{tier}</span>
            </p>
            {isMobile ? (
              <Image
                src={`${constant.SERVER_URL}/public/ranked-positions/${roleTag}.png`}
                alt="roleTag"
                width={16}
                height={16}
              />
            ) : (
              <div className="text-[11px] px-[8px] py-[3px] rounded-[6px] bg-amber-100 text-amber-700 font-semibold select-none dark:bg-amber-800/50 dark:text-amber-300">
                {roleTag}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (isEmpty || !teamMember || !teamMember.member) {
    return (
      <div
        onClick={onAddClick}
        className={`cursor-pointer flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-branddarkborder rounded-[10px] bg-gray-50/50 dark:bg-branddark/50 text-gray-400 hover:border-brandcolor hover:text-brandcolor hover:bg-brandcolor/5 transition-all ${
          isMobile ? "h-[50px]" : "h-[56px]"
        }`}
      >
        <div className="flex items-center gap-[6px]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className={isMobile ? "w-[14px] h-[14px]" : "w-[16px] h-[16px]"}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          <span
            className={`font-medium ${isMobile ? "text-[11px]" : "text-[13px]"}`}
          >
            {roleTag} 추가
          </span>
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
      className="relative flex w-full items-center justify-center border border-gray-100 dark:border-branddarkborder rounded-[10px] overflow-hidden bg-no-repeat"
      style={{
        backgroundImage: `url(${rankImageUrl})`,
        backgroundSize: "50%",
        backgroundPosition: "center",
      }}
    >
      {/* 배경 흐리게 하는 오버레이 */}
      <div className="absolute inset-0 bg-gray-50/70 dark:bg-branddark/70" />
      <div
        className={`relative z-10 flex w-full items-center justify-between px-[14px] gap-[8px] ${
          isMobile ? "py-[8px]" : "py-[10px]"
        }`}
      >
        <div className="flex items-center gap-[10px] min-w-0">
          <Image
            src={profileImgUrl}
            alt="profile"
            width={34}
            height={34}
            className={`object-cover rounded-[8px] shadow-sm ${
              isMobile ? "w-[30px] h-[30px]" : "w-[36px] h-[36px]"
            }`}
          />
          <div className="truncate min-w-0">
            <p
              className={`font-semibold dark:text-white truncate ${isMobile ? "text-[12px]" : "text-[13px]"}`}
            >
              {summonerName}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-[6px] whitespace-nowrap">
          <Image
            src={rankImageUrl}
            alt={tier}
            width={24}
            height={24}
            className={isMobile ? "w-[20px] h-[20px]" : "w-[22px] h-[22px]"}
          />
          <p
            className={`font-medium ${isMobile ? "text-[11px]" : "text-[12px]"}`}
          >
            <span className={getTierStyle(tier)}>{tier}</span>
          </p>
          {isMobile ? (
            <Image
              src={`${constant.SERVER_URL}/public/ranked-positions/${roleTag}.png`}
              alt="roleTag"
              width={16}
              height={16}
            />
          ) : (
            <div className="text-[11px] px-[8px] py-[3px] rounded-[6px] bg-brandcolor/10 text-brandcolor font-semibold select-none">
              {roleTag}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamMemberCard;

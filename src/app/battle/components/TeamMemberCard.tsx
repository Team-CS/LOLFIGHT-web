import constant from "@/src/common/constant/constant";
import { getTierStyle } from "@/src/utils/string/string.util";

interface TeamMemberCardProps {
  summonerName?: string;
  summonerTag?: string;
  tier?: string;
  rankImageUrl?: string;
  roleTag: "TOP" | "JUNGLE" | "MID" | "ADC" | "SUPPORT";
  profileImgUrl?: string;
  isEmpty?: boolean;
  onAddClick?: () => void;
}

const TeamMemberCard = (props: TeamMemberCardProps) => {
  const {
    summonerName = "",
    summonerTag = "",
    tier = "GOLD",
    rankImageUrl = `${constant.SERVER_URL}/public/rank/GOLD.png`,
    roleTag,
    profileImgUrl = "/LOLFIGHT_NONE_TEXT.png",
    isEmpty = false,
    onAddClick,
  } = props;

  if (isEmpty) {
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
            className="w-[32px] h-[32px] rounded-full object-cover"
          />
          <div className="truncate min-w-0">
            <p className="text-sm font-medium dark:text-white truncate">
              {summonerName}
            </p>
            <p className="text-xs font-semibold dark:text-white truncate">
              {summonerTag}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-[6px] whitespace-nowrap">
          <img src={rankImageUrl} alt={tier} className="w-[24px] h-[24px]" />
          <p className="text-sm">
            <span className={getTierStyle(tier)}>{tier}</span>
          </p>
          <div className="text-sm px-[6px] py-[2px] rounded-md bg-brandhover text-branddark font-medium select-none">
            {roleTag}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberCard;

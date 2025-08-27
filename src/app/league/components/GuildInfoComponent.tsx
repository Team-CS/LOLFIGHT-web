import { GuildDto } from "@/src/common/DTOs/guild/guild.dto";
import constant from "@/src/common/constant/constant";
import { useIsMobile } from "@/src/hooks/useMediaQuery";
import { getTierStyle } from "@/src/utils/string/string.util";
import { useRouter } from "next/navigation";
import React from "react";

interface GuildInfoComponentProps {
  guild: GuildDto;
}

const GuildInfoComponent = (props: GuildInfoComponentProps) => {
  const router = useRouter();
  const isMobile = useIsMobile();

  const handleGuildInfo = () => {
    const encodedGuildName = encodeURIComponent(props.guild.guildName);
    router.push(`/league/${encodedGuildName}`);
  };

  return (
    <div
      className="flex items-center py-[6px] border-b bg-brandbgcolor dark:border-dark dark:bg-branddark hover:cursor-pointer"
      onClick={handleGuildInfo}
    >
      <div className="flex flex-[0.25] px-[8px] items-center justify-center">
        {props.guild.guildRecord?.recordRanking === "1" ||
        props.guild.guildRecord?.recordRanking === "2" ||
        props.guild.guildRecord?.recordRanking === "3" ? (
          <img
            className="object-fit"
            width={isMobile ? 24 : 32}
            height={isMobile ? 24 : 32}
            src={`/images/ranking${props.guild.guildRecord.recordRanking}.png`}
            alt="랭킹아이콘"
          />
        ) : props.guild.guildRecord?.recordRanking === "기록없음" ? null : (
          <div className="text-[14px] font-bold">
            {props.guild.guildRecord?.recordRanking}
          </div>
        )}
      </div>

      <div className="flex flex-[1] px-[8px] gap-[12px] items-center">
        <img
          className={`object-cover rounded-md ${
            isMobile ? "w-[25px] h-[25px]" : "w-[35px] h-[35px]"
          }`}
          src={`${constant.SERVER_URL}/${props.guild.guildIcon}`}
          alt="길드 아이콘"
        />
        <div
          className={`font-semibold ${
            isMobile ? "text-[14px]" : "text-[16px]"
          }`}
        >
          {props.guild.guildName}
        </div>
      </div>
      {!isMobile && (
        <>
          <div className="flex items-center justify-center flex-[2] px-[8px] text-[14px] h-[60px] whitespace-normal break-words overflow-hidden text-center">
            <span className="w-full">{props.guild.guildDescription}</span>
          </div>

          <div className={`flex-[0.25] px-[8px] text-center`}>
            {props.guild.guildMembers.length}{" "}
            <span className={"text-[14px]"}> 명</span>
          </div>
        </>
      )}
      <div
        className={`flex-[0.25] text-center ${
          isMobile ? "px-[4px] text-[10px]" : "px-[8px] text-[16px]"
        }`}
      >
        {props.guild.guildRecord!.recordVictory}
        {!isMobile && <span className={"text-[14px]"}> 승</span>}
      </div>
      <div
        className={`flex-[0.25] text-center ${
          isMobile ? "px-[4px] text-[10px]" : "px-[8px] text-[16px]"
        }`}
      >
        {props.guild.guildRecord!.recordDefeat}
        {!isMobile && <span className={"text-[14px]"}> 패</span>}
      </div>
      <div
        className={`flex-[0.5] px-[8px] text-center ${
          isMobile ? "text-[10px]" : "text-[14px]"
        } ${getTierStyle(props.guild.guildTier)}`}
      >
        {props.guild.guildTier}
      </div>
      <div
        className={`flex-[0.5] px-[8px] text-center font-medium ${
          isMobile ? "text-[12px]" : "text-[16px]"
        }`}
      >
        {props.guild.guildRecord?.recordLadder}{" "}
        <span className={`${isMobile ? "text-[10px]" : "text-[14px]"}`}>
          점
        </span>
      </div>
    </div>
  );
};

export default GuildInfoComponent;

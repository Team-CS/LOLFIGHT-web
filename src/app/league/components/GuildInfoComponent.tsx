import { GuildDto } from "@/src/common/DTOs/guild/guild.dto";
import constant from "@/src/common/constant/constant";
import { useIsMobile } from "@/src/hooks/useMediaQuery";
import { getTierStyle } from "@/src/utils/string/string.util";
import Image from "next/image";
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
      className="flex items-center py-[8px] rounded-[10px] bg-white dark:bg-dark hover:bg-blue-50 dark:hover:bg-branddarkborder cursor-pointer transition-all duration-200 hover:shadow-sm border border-transparent hover:border-blue-100 dark:hover:border-branddarkborder"
      onClick={handleGuildInfo}
    >
      <div className="flex flex-[0.25] px-[8px] items-center justify-center">
        {props.guild.guildRecord?.recordRanking === "1" ||
        props.guild.guildRecord?.recordRanking === "2" ||
        props.guild.guildRecord?.recordRanking === "3" ? (
          <Image
            src={`/images/ranking${props.guild.guildRecord.recordRanking}.png`}
            alt="랭킹아이콘"
            width={24}
            height={24}
            quality={100}
            className={`${
              isMobile ? "w-[24px] h-[24px]" : "w-[32px] h-[32px]"
            } rounded-[12px] object-cover`}
          />
        ) : props.guild.guildRecord?.recordRanking === "기록없음" ? null : (
          <div className={`${isMobile ? "text-[12px]" : "text-[15px]"} font-bold text-gray-600 dark:text-gray-300`}>
            {props.guild.guildRecord?.recordRanking}
          </div>
        )}
      </div>

      <div className="flex flex-[1] px-[8px] gap-[12px] items-center">
        <Image
          src={`${constant.SERVER_URL}/${props.guild.guildIcon}`}
          alt="길드 아이콘"
          width={35}
          height={35}
          quality={100}
          className={`${
            isMobile ? "w-[28px] h-[28px]" : "w-[38px] h-[38px]"
          } rounded-[6px] object-cover shadow-sm`}
        />

        <div
          className={`font-semibold truncate ${
            isMobile ? "text-[11px] max-w-[100px]" : "text-[15px]"
          }`}
        >
          {props.guild.guildName}
        </div>
      </div>
      {!isMobile && (
        <>
          <div className="flex flex-[2] px-[8px] h-[60px]">
            <div className="flex items-center justify-center w-full h-full">
              <div className="line-clamp-3 overflow-hidden text-center text-[13px] text-gray-600 dark:text-gray-400 break-words">
                {props.guild.guildDescription}
              </div>
            </div>
          </div>

          <div className={`flex-[0.25] px-[8px] text-center font-medium`}>
            {props.guild.guildMembers.length}
            <span className={"text-[13px] text-gray-500 dark:text-gray-400"}> 명</span>
          </div>
        </>
      )}
      <div
        className={`flex-[0.25] text-center font-semibold text-blue-600 dark:text-blue-400 ${
          isMobile ? "px-[4px] text-[11px]" : "px-[8px] text-[15px]"
        }`}
      >
        {props.guild.guildRecord!.recordVictory}
        {!isMobile && <span className={"text-[13px] font-normal"}> 승</span>}
      </div>
      <div
        className={`flex-[0.25] text-center font-semibold text-red-500 dark:text-red-400 ${
          isMobile ? "px-[4px] text-[11px]" : "px-[8px] text-[15px]"
        }`}
      >
        {props.guild.guildRecord!.recordDefeat}
        {!isMobile && <span className={"text-[13px] font-normal"}> 패</span>}
      </div>
      <div
        className={`flex-[0.5] px-[8px] text-center font-bold ${
          isMobile ? "text-[10px]" : "text-[14px]"
        } ${getTierStyle(props.guild.guildTier)}`}
      >
        {props.guild.guildTier}
      </div>
      <div
        className={`flex-[0.5] px-[8px] text-center font-bold ${
          isMobile ? "text-[12px]" : "text-[16px]"
        }`}
      >
        {props.guild.guildRecord?.recordLadder}
        <span className={`font-normal text-gray-500 dark:text-gray-400 ${isMobile ? "text-[10px]" : "text-[13px]"}`}>
          {" "}점
        </span>
      </div>
    </div>
  );
};

export default GuildInfoComponent;

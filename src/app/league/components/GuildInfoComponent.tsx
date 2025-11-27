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
      className="flex items-center py-[6px] rounded-[12px] bg-white dark:border-dark dark:bg-dark hover:bg-brandhover dark:hover:bg-branddarkborder cursor-pointer"
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
          <div className="text-[14px] font-bold">
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
            isMobile ? "w-[25px] h-[25px]" : "w-[35px] h-[35px]"
          } rounded-[4px] object-cover`}
        />

        <div
          className={`font-semibold truncate ${
            isMobile ? "text-[10px] max-w-[100px]" : "text-[16px]"
          }`}
        >
          {props.guild.guildName}
        </div>
      </div>
      {!isMobile && (
        <>
          <div className="flex flex-[2] px-[8px] h-[60px]">
            <div className="flex items-center justify-center w-full h-full">
              <div className="line-clamp-3 overflow-hidden text-center text-[14px] break-words">
                {props.guild.guildDescription}
              </div>
            </div>
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

import { GuildDto } from "@/src/common/DTOs/guild/guild.dto";
import constant from "@/src/common/constant/constant";
import { useRouter } from "next/navigation";
import React from "react";

interface GuildInfoComponentProps {
  guild: GuildDto;
}

const GuildInfoComponent = (props: GuildInfoComponentProps) => {
  const router = useRouter();

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
            width={32}
            height={32}
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
          className="object-cover w-[35px] h-[35px] rounded-md"
          src={`${constant.SERVER_URL}/${props.guild.guildIcon}`}
          alt="길드 아이콘"
        />
        <div className="font-semibold ">{props.guild.guildName}</div>
      </div>
      <div className="flex items-center justify-center flex-[2] px-[8px] text-[14px] h-[60px] whitespace-normal break-words overflow-hidden text-center">
        <span className="w-full">{props.guild.guildDescription}</span>
      </div>
      <div className="flex-[0.25] px-[8px] text-center">
        {props.guild.guildMembers.length}
      </div>
      <div className="flex-[0.25] px-[8px] text-center">
        {props.guild.guildRecord!.recordVictory}승
      </div>
      <div className="flex-[0.25] px-[8px] text-center">
        {props.guild.guildRecord!.recordDefeat}패
      </div>
      <div className="flex-[0.5] px-[8px] text-center">
        {props.guild.guildTier}
      </div>
      <div className="flex-[1] px-[8px] text-center">
        {props.guild.guildMaster}
      </div>
    </div>
  );
};

export default GuildInfoComponent;

import { GuildDTO } from "@/src/common/DTOs/guild/guild.dto";
import { MemberDTO } from "@/src/common/DTOs/member/member.dto";
import constant from "@/src/common/constant/constant";
import { useMemberStore } from "@/src/common/zustand/member.zustand";

interface Props {
  guildMember: MemberDTO;
  guild: GuildDTO;
  type: string;
  expulsionMember?: (member: MemberDTO) => void;
  transferGuildMaste?: (memberName: string, guildName: string) => void;
  acceptMember?: (memberId: string, guildId: string) => void;
  rejectMember?: (memberId: string, guildId: string) => void;
}

const GuildMemberBox = (props: Props) => {
  const {
    guildMember,
    guild,
    type,
    expulsionMember,
    transferGuildMaste,
    acceptMember,
    rejectMember,
  } = props;
  const { member } = useMemberStore();

  return (
    <div className="flex flex-col p-[8px] gap-[12px] border border-[#CDCDCD] rounded-[8px] bg-[#EEEEEE] dark:bg-branddark">
      <div className="grid grid-cols-4 gap-x-[8px]">
        <div className="flex items-center text-16px font-medium">
          {guildMember.memberName}
        </div>
        <div className="flex items-center text-16px font-medium">
          {guildMember.memberGame?.gameName}
        </div>
        <div className="flex items-center text-16px font-medium">
          {guildMember.memberGame ? (
            <div className="flex gap-[8px]">
              <img
                src={`${constant.SERVER_URL}/public/rank/${
                  guildMember.memberGame?.gameTier.split(" ")[0]
                }.png`}
                alt="rank"
                className="w-[25px] h-[25px]"
              />
              {guildMember.memberGame?.gameTier}
            </div>
          ) : null}
        </div>
        <div className="flex gap-[16px]">
          {type === "guildMember" ? (
            guildMember.memberName !== guild.guildMaster &&
            guild.guildMaster === member?.memberName && (
              <>
                <button
                  className="font-extrabold text-base hover:text-red-500 "
                  onClick={() => expulsionMember?.(guildMember)}
                >
                  추방
                </button>
                <button
                  className="font-extrabold text-base hover:text-green-500 "
                  onClick={() =>
                    transferGuildMaste?.(
                      guildMember.memberName,
                      guild.guildName
                    )
                  }
                >
                  길드 마스터 변경
                </button>
              </>
            )
          ) : (
            <>
              <button
                aria-label="수락"
                onClick={() => acceptMember?.(guildMember.id, guild.id)}
                className="flex items-center text-16px font-semibold pl-2 hover:text-blue-700"
              >
                수락
              </button>
              <button
                aria-label="거절"
                onClick={() => rejectMember?.(guildMember.id, guild.id)}
                className="flex items-center text-16px font-semibold pl-2 hover:text-red-500"
              >
                거절
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuildMemberBox;

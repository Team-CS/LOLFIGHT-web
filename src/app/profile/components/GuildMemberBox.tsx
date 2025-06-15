import { GuildDTO } from "@/src/common/DTOs/guild/guild.dto";
import { MemberDTO } from "@/src/common/DTOs/member/member.dto";
import ButtonAlert from "../../../common/components/alert/ButtonAlert";
import CustomAlert from "../../../common/components/alert/CustomAlert";
import { changeGuildMaster, expulsionGuildMember } from "@/src/api/guild.api";
import constant from "@/src/common/constant/constant";
import { useMemberStore } from "@/src/common/zustand/member.zustand";

interface Props {
  guildIcon: string;
  guildMember: MemberDTO;
  guild: GuildDTO;
}

const GuildMemberBox = (props: Props) => {
  const { guildIcon, guildMember, guild } = props;
  const { member } = useMemberStore();
  const expulsionMember = (member: MemberDTO) => {
    const expulsion = () => {
      expulsionGuildMember(member.memberName, guild.guildName)
        .then((response) => {
          CustomAlert(
            "success",
            "길드추방",
            `${member.memberName}-길드원을 추방하였습니다.`
          );
        })
        .catch((error) => {
          console.log(error);
        });
    };

    ButtonAlert(
      "길드추방",
      `${member.memberName}길드원을 추방하시겠습니까?`,
      "추방",
      expulsion
    );
  };

  const transferGuildMaste = (memberName: string, guildName: string) => {
    const changeMaster = () => {
      changeGuildMaster(memberName, guildName)
        .then((response) => {
          CustomAlert(
            "success",
            "길드마스터 변경",
            `${guildName}의 길드마스터가 ${memberName}으로 변경되었습니다`
          );
          window.location.reload();
        })
        .catch((error) => {
          console.log(error);
        });
    };

    ButtonAlert(
      "길드마스터 변경",
      `길드마스터를 ${memberName}으로 변경하시겠습니까?`,
      "변경",
      changeMaster
    );
  };

  return (
    <div className="flex flex-col p-[8px] gap-[12px] border border-[#CDCDCD] rounded-[8px] bg-[#EEEEEE] dark:bg-branddark">
      <div className="grid grid-cols-3 gap-x-[8px]">
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
                alt="Champion"
                width={25}
                height={25}
              />
              {guildMember.memberGame?.gameTier}
            </div>
          ) : null}
        </div>
        <div>
          {guildMember.memberName !== guild.guildMaster &&
          guild.guildMaster === member?.memberName ? (
            <button
              className="font-extrabold text-base hover:text-red-500 "
              onClick={() => expulsionMember(guildMember)}
            >
              추방
            </button>
          ) : null}
        </div>
        <div className="pl-2 ">
          {guildMember.memberName !== guild.guildMaster &&
          guild.guildMaster === member?.memberName ? (
            <button
              className="font-extrabold text-base hover:text-green-500 "
              onClick={() =>
                transferGuildMaste(guildMember.memberName, guild.guildName)
              }
            >
              길드 마스터 변경
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default GuildMemberBox;

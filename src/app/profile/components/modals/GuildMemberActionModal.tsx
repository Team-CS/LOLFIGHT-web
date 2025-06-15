import { GuildDTO } from "@/src/common/DTOs/guild/guild.dto";
import { MemberDTO } from "@/src/common/DTOs/member/member.dto";

interface GuildMemberActionModalProps {
  member: MemberDTO;
  guild: GuildDTO;
  onclose: () => void;
}

const GuildMemberActionModal = ({ member, guild, onClose }: ModalProps) => {
  const handleExpel = () => {
    ButtonAlert(
      "길드추방",
      `${member.memberName} 길드원을 추방하시겠습니까?`,
      "추방",
      () =>
        expulsionGuildMember(member.memberName, guild.guildName).then(onClose)
    );
  };

  const handleMasterChange = () => {
    ButtonAlert(
      "마스터 변경",
      `${member.memberName}으로 변경하시겠습니까?`,
      "변경",
      () =>
        changeGuildMaster(member.memberName, guild.guildName).then(() => {
          window.location.reload();
        })
    );
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-branddark p-4 rounded w-64">
        <p className="text-base font-semibold mb-4">길드원 관리</p>
        <div className="flex flex-col gap-2">
          <button className="text-red-500" onClick={handleExpel}>
            길드원 추방
          </button>
          <button className="text-green-500" onClick={handleMasterChange}>
            마스터 위임
          </button>
          <button onClick={onClose}>닫기</button>
        </div>
      </div>
    </div>
  );
};

export default GuildMemberActionModal;

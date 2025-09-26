import constant from "@/src/common/constant/constant";
import { GuildInviteDto } from "@/src/common/DTOs/guild/guild_invite.dto";

interface GuildInviteReviewModalProps {
  inviteData: GuildInviteDto;
  onClose: () => void;
  onAccept: (memberId: string, guildId: string) => void;
  onReject: (memberId: string, guildId: string) => void;
}

export const GuildInviteReviewModal = (props: GuildInviteReviewModalProps) => {
  const { inviteData, onClose, onAccept, onReject } = props;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[50]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex flex-col bg-white dark:bg-gray-900 rounded-[16px] p-[24px] gap-[24px] w-[90%] max-w-[500px] shadow-2xl border border-gray-200 dark:border-gray-700"
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-[16px] right-[16px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          ✕
        </button>

        {/* 헤더 - 유저 기본 정보 */}
        <div className="flex items-center gap-[16px]">
          <img
            src={`${constant.SERVER_URL}/${inviteData.member?.memberIcon}`}
            alt="tier"
            className="w-[48px] h-[48px] rounded-full "
          />
          <div className="flex flex-col">
            <span className="text-[16px] font-bold text-gray-900 dark:text-white">
              {inviteData.member?.memberName}
            </span>
            <span className="text-[14px] text-gray-600 dark:text-gray-300">
              {inviteData.member?.memberGame?.gameName}
            </span>
            <div className="flex items-center gap-[6px] mt-[4px]">
              <img
                src={`${constant.SERVER_URL}/public/ranked-positions/${inviteData.member?.memberGame?.line}.png`}
                alt="tier"
                className="w-[20px] h-[20px]"
              />
              <span className="text-[13px] text-gray-700 dark:text-gray-400">
                {inviteData.member?.memberGame?.line}
              </span>
            </div>
          </div>
        </div>

        {/* 소개글 */}
        <div className="flex flex-col gap-[8px]">
          <span className="text-[14px] font-medium text-gray-800 dark:text-gray-200">
            가입 신청글
          </span>
          <div className="p-[12px] rounded-[8px] border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[13px] text-gray-700 dark:text-gray-300 whitespace-pre-line">
            {inviteData.applicationText}
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="flex gap-[12px] mt-[8px]">
          <button
            onClick={() => {
              onReject(inviteData.member!.id, inviteData.guild!.id);
              onClose();
            }}
            className="flex-1 px-[12px] py-[10px] rounded-[8px] border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            거절
          </button>
          <button
            onClick={() => {
              onAccept(inviteData.member!.id, inviteData.guild!.id);
              onClose();
            }}
            className="flex-1 px-[12px] py-[10px] rounded-[8px] bg-blue-600 text-white hover:bg-blue-700"
          >
            수락
          </button>
        </div>
      </div>
    </div>
  );
};

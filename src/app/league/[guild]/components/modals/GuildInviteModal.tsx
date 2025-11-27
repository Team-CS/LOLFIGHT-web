import constant from "@/src/common/constant/constant";
import Image from "next/image";
import { useState } from "react";

interface GuildInviteModalProps {
  guildName: string;
  guildIcon: string;
  guildDescription?: string;
  guildMemberCount?: number;
  onClose: () => void;
  onSubmit: (message: string) => void;
}

export const GuildInviteModal = (props: GuildInviteModalProps) => {
  const {
    onClose,
    guildName,
    guildIcon,
    guildDescription,
    guildMemberCount,
    onSubmit,
  } = props;
  const [message, setMessage] = useState("");
  const maxLength = 200;

  const handleSubmit = () => {
    if (!message.trim()) return;
    onSubmit(message);
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[50]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex flex-col bg-white dark:bg-gray-900 rounded-[16px] p-[24px] gap-[24px] w-[90%] max-w-[500px] shadow-2xl border border-gray-200 dark:border-gray-700"
      >
        <button
          onClick={onClose}
          className="absolute top-[16px] right-[16px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          X
        </button>

        {/* 헤더: 길드마크 + 길드명 + 정보 */}
        <div className="flex items-center gap-[16px]">
          <Image
            src={`${constant.SERVER_URL}/${guildIcon}`}
            alt="Guild Mark"
            width={56}
            height={56}
            className="w-[56px] h-[56px] rounded-full"
          />
          <div className="flex flex-col">
            <h2 className="text-[20px] font-bold text-gray-900 dark:text-white">
              {guildName}
            </h2>
            {guildDescription && (
              <p className="text-[14px] text-gray-600 dark:text-gray-400 line-clamp-2">
                {guildDescription}
              </p>
            )}
            {guildMemberCount !== undefined && (
              <span className="text-[12px] text-gray-500 dark:text-gray-400">
                멤버 수: {guildMemberCount}명
              </span>
            )}
          </div>
        </div>

        {/* 가입 신청글 입력 */}
        <div className="flex flex-col gap-[8px]">
          <label className="text-[14px] font-medium text-gray-700 dark:text-gray-300">
            가입 신청글
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value.slice(0, maxLength))}
            placeholder="자신을 소개하고, 왜 이 길드에 가입하고 싶은지 작성해주세요..."
            className="w-full h-[128px] p-[12px] rounded-[8px] border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-[2px] focus:ring-blue-500 resize-none"
          />
          <div className="flex justify-end text-[12px] text-gray-500 dark:text-gray-400">
            {message.length}/{maxLength}
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="flex gap-[12px]">
          <button
            onClick={onClose}
            className="flex-1 px-[16px] py-[8px] rounded-[8px] border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={!message.trim()}
            className={`flex-1 px-[16px] py-[8px] rounded-[8px] text-white ${
              message.trim()
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-blue-300 cursor-not-allowed"
            }`}
          >
            신청하기
          </button>
        </div>
      </div>
    </div>
  );
};

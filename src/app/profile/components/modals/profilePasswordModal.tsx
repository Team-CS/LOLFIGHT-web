import { useState } from "react";

interface ProfilePasswordModalProps {
  onClose: () => void;
  onSubmit: (currentPassword: string, newPassword: string) => void;
}

export const ProfilePasswordModal = (props: ProfilePasswordModalProps) => {
  const { onClose, onSubmit } = props;
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="flex flex-col bg-white p-[22px] rounded-[12px] gap-[12px] dark:text-black">
        <h2 className="text-[24px] font-bold">비밀번호변경</h2>
        <div className="flex flex-col gap-[12px]">
          <div className="flex flex-col">
            <p>현재 비밀번호</p>
            <input
              className="bordor border-[1px] rounded-[4px] p-[4px] bg-white"
              placeholder="현재 비밀번호를 입력하세요."
              type="password"
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <p>새 비밀번호</p>
            <input
              className="bordor border-[1px] rounded-[4px] p-[4px] bg-white"
              placeholder="새 비밀번호를 입력하세요."
              type="password"
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button
            className="bg-gray-300 text-black px-[12px] py-[8px] rounded mr-[8px]"
            onClick={onClose}
          >
            취소
          </button>
          <button
            className="bg-blue-500 text-white px-[12px] py-[8px] rounded"
            onClick={() => onSubmit(currentPassword, newPassword)}
          >
            등록
          </button>
        </div>
      </div>
    </div>
  );
};

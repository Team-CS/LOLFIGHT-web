import React, { useState } from "react";

interface GuildDescriptionModalProps {
  onTextChange: (value: string) => void;
  onClose: () => void;
  onSubmit: (desc: string) => void;
  value: string;
}

export const GuildDescriptionModal = (props: GuildDescriptionModalProps) => {
  const { onTextChange, onClose, onSubmit, value } = props;
  const [charCount, setCharCount] = useState(value.length);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value.slice(0, 80);
    setCharCount(val.length);
    onTextChange(val);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="flex flex-col bg-white dark:bg-gray-900 dark:text-gray-100 rounded-[16px] p-[24px] gap-[16px] w-[90%] max-w-[400px] shadow-lg">
        <h2 className="text-[20px] font-semibold text-center">
          길드 소개 수정
        </h2>

        <textarea
          className="w-full h-[112px] resize-none rounded-[12px] border border-gray-300 px-[12px] py-[8px] text-gray-900 placeholder-gray-400
                     focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
          placeholder="길드 소개글을 입력해주세요 (최대 80글자)"
          value={value}
          onChange={handleChange}
          maxLength={80}
        />

        <div className="flex justify-between items-center text-[14px] text-gray-500 dark:text-gray-400">
          <span>{charCount} / 80 글자</span>
          <div className="flex gap-[12px]">
            <button
              className="px-[16px] py-[8px] rounded-[8px] bg-gray-200 text-gray-800 hover:bg-gray-300 transition dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              onClick={onClose}
            >
              취소
            </button>
            <button
              className="px-[16px] py-[8px] rounded-[8px] bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
              onClick={() => onSubmit(value)}
              disabled={value.trim().length === 0}
            >
              등록
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import REPORT_REASONS from "@/src/data/reportReason";
import { useState } from "react";

interface ReportModalProps {
  onClose: () => void;
  onSubmit: (reason: string) => void;
}

export const ReportModal = (props: ReportModalProps) => {
  const { onClose, onSubmit } = props;
  const [selectedReason, setSelectedReason] = useState<string>(
    REPORT_REASONS[0]
  );
  const [customReason, setCustomReason] = useState<string>(""); // 기타 입력값

  const handleSubmit = () => {
    if (selectedReason === "기타사유") {
      if (!customReason.trim()) {
        alert("신고 사유를 입력해주세요.");
        return;
      }
      onSubmit(customReason);
    } else {
      onSubmit(selectedReason);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[24px] shadow-lg w-[350px] p-[24px]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-[18px] font-semibold mb-[16px] text-center">
          신고하기
        </h2>

        <select
          value={selectedReason}
          onChange={(e) => setSelectedReason(e.target.value)}
          className="w-full border border-gray-300 rounded-[12px] p-[8px] mb-[16px] focus:outline-none focus:ring-2 focus:ring-blue-400 text-[14px]"
        >
          {REPORT_REASONS.map((reason: string) => (
            <option key={reason} value={reason}>
              {reason}
            </option>
          ))}
        </select>

        {selectedReason === "기타사유" && (
          <input
            className="w-full rounded-[12px] border p-[8px] text-[14px] mb-[16px]"
            placeholder="신고 사유를 입력해주세요"
            value={customReason}
            onChange={(e) => setCustomReason(e.target.value)}
          />
        )}

        <div className="flex justify-end gap-[8px]">
          <button
            className="px-[16px] py-[8px] bg-gray-200 rounded-[12px] hover:bg-gray-300 transition text-[14px]"
            onClick={onClose}
          >
            취소
          </button>
          <button
            className="px-[16px] py-[8px] bg-blue-500 text-white rounded-[12px] hover:bg-blue-600 transition text-[14px]"
            onClick={handleSubmit}
          >
            신고
          </button>
        </div>
      </div>
    </div>
  );
};

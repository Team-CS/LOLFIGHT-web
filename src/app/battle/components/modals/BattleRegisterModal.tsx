import { useState } from "react";

interface BattleRegisterModalProps {
  onClose: () => void;
  onSubmit: (datetime: string, note: string, count: number) => void;
}

const BattleRegisterModal = ({
  onClose,
  onSubmit,
}: BattleRegisterModalProps) => {
  const [datetime, setDatetime] = useState("");
  const [note, setNote] = useState("");
  const [count, setCount] = useState(1);

  const handleSubmit = () => {
    if (!datetime) {
      alert("일시를 선택해주세요.");
      return;
    }
    if (note.length > 50) {
      alert("노트는 최대 50글자까지 입력 가능합니다.");
      return;
    }
    const selectedTime = new Date(datetime);
    const now = new Date();

    if (selectedTime < now) {
      alert("선택한 일시는 현재 시간 이후여야 합니다.");
      return;
    }

    onSubmit(datetime, note, count);
    onClose();
  };

  return (
    <div
      className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="flex flex-col w-[400px] p-[24px] bg-white rounded-[12px] shadow-md dark:bg-branddark"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="font-semibold text-[20px] mb-[16px] text-brandgray dark:text-brandhover">
          스크림 대기 등록
        </p>

        <label className="flex flex-col mb-[16px] text-brandgray dark:text-brandhover">
          <span className="mb-[8px]">일시</span>
          <input
            type="datetime-local"
            value={datetime}
            onChange={(e) => setDatetime(e.target.value)}
            className="p-[12px] border border-brandborder rounded-[8px] bg-brandbgcolor dark:bg-brandgray dark:border-branddarkborder focus:outline-none text-[14px] text-brandgray dark:text-brandhover"
          />
        </label>

        <label className="flex flex-col mb-[24px] text-brandgray dark:text-brandhover">
          <span className="mb-[8px]">우리 팀 한마디 (최대 50자)</span>
          <input
            type="text"
            maxLength={50}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="예) 피드백 주고받는 스크림 원해요"
            className="p-[12px] border border-brandborder rounded-[8px] bg-brandbgcolor dark:bg-brandgray dark:border-branddarkborder focus:outline-none text-[14px] text-brandgray dark:text-brandhover"
          />
        </label>

        <label className="flex flex-col mb-[24px] text-brandgray dark:text-brandhover">
          <span className="mb-[8px]">스크림 횟수 (최대 10회)</span>
          <select
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="p-[12px] border border-brandborder rounded-[8px] bg-brandbgcolor dark:bg-brandgray dark:border-branddarkborder focus:outline-none text-[14px] text-brandgray dark:text-brandhover appearance-none"
          >
            {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
              <option key={num} value={num}>
                {num}회
              </option>
            ))}
          </select>
        </label>

        <div className="flex justify-end gap-[12px]">
          <button
            onClick={onClose}
            className="px-[16px] py-[8px] rounded-[8px] border border-brandborder text-brandgray dark:text-brandhover dark:border-branddarkborder hover:bg-brandbgcolor dark:hover:bg-branddarkborder transition"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            className="px-[16px] py-[8px] rounded-[8px] bg-brandcolor text-white hover:bg-brandhover transition"
          >
            등록
          </button>
        </div>
      </div>
    </div>
  );
};

export default BattleRegisterModal;

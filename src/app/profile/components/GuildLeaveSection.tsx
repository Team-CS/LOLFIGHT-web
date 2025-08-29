import { useIsMobile } from "@/src/hooks/useMediaQuery";

interface GuildLeaveSectionProps {
  isChecked: boolean;
  onChange: () => void;
  onClick: () => void;
}

export default function GuildLeaveSection(props: GuildLeaveSectionProps) {
  const { isChecked, onChange, onClick } = props;
  const isMobile = useIsMobile();
  return (
    <div className="flex flex-col p-[16px] gap-[24px] justify-center items-center">
      <div className="flex flex-col w-full gap-[14px] p-[12px]">
        <InfoBlock
          title="1. 정보 유실"
          content="길드를 탈퇴하면 해당 길드와 관련된 모든 데이터가 삭제됩니다."
        />
        <InfoBlock
          title="2. 접근 권한"
          content="길드를 탈퇴하면 해당 길드에 대한 접근 권한을 잃게 됩니다."
        />
        <InfoBlock
          title="3. 서비스 이용 중단"
          content="길드를 탈퇴한 후에는 해당 길드의 서비스 및 혜택을 더 이상 이용할 수 없게 됩니다. 이는 길드 멤버 간의 활동 및 협업에 영향을 줄 수 있으며, 데이터 또한 다시 복구, 이용할 수 없습니다."
        />
      </div>
      <label
        className={`flex gap-[4px] ${isMobile ? "text-[14px]" : "text-[16px]"}`}
      >
        <input type="checkbox" checked={isChecked} onChange={onChange} />
        주의사항을 모두 확인하였습니다.
      </label>
      <button
        className={`bg-red-500 rounded ${
          isMobile
            ? "w-[40xp] px-[12px] py-[4px] text-[14px]"
            : "w-[160px] p-[4px] text-[16px]"
        }`}
        onClick={onClick}
      >
        <p className="text-white font-extrabold tracking-widest">길드탈퇴</p>
      </button>
    </div>
  );
}

export const InfoBlock = ({
  title,
  content,
}: {
  title: string;
  content: string;
}) => {
  const isMobile = useIsMobile();
  return (
    <div>
      <span
        className={`text-sky-950 dark:text-sky-700 font-bold ${
          isMobile ? "text-[14px]" : "text-[16px]"
        }`}
      >
        {title}
      </span>
      <p className={`${isMobile ? "text-[12px]" : "text-[14px]"}`}>{content}</p>
    </div>
  );
};

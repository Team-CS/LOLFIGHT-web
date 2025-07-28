interface GuildDeleteSectionProps {
  isChecked: boolean;
  onChange: () => void;
  onClick: () => void;
}

export default function GuildDeleteSection(props: GuildDeleteSectionProps) {
  const { isChecked, onChange, onClick } = props;
  return (
    <div className="flex flex-col p-[16px] gap-[24px] justify-center items-center">
      <div className="flex flex-col w-full gap-[14px] p-[12px]">
        <InfoBlock
          title="1. 정보 유실"
          content="길드를 해체하면 해당 길드와 관련된 모든 데이터가 삭제될 수 있습니다."
        />
        <InfoBlock
          title="2. 접근 권한"
          content="길드를 해체하면 해당 길드에 대한 접근 권한을 잃게 됩니다."
        />
        <InfoBlock
          title="3. 서비스 이용 중단"
          content="길드를 해체한 후에는 해당 길드의 서비스 및 혜택을 더 이상 이용할 수 없게 됩니다."
        />
        <InfoBlock
          title="4. 서비스 연관성"
          content="길드를 해체할 경우 해당 길드와 연관된 모든 서비스와 기능에 대한 접근 권한이 손실될 수 있습니다. 이는 길드 멤버 간의 활동 및 협업에 영향을 줄 수 있습니다."
        />
      </div>
      <label>
        <input type="checkbox" checked={isChecked} onChange={onChange} />
        주의사항을 모두 확인하였습니다.
      </label>
      <button className="w-full bg-red-500 rounded p-2" onClick={onClick}>
        <p className="text-white font-extrabold tracking-widest">길드해체</p>
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
  return (
    <div>
      <span className="text-sky-950 font-bold dark:text-sky-500">{title}</span>
      <p className="text-sm">{content}</p>
    </div>
  );
};

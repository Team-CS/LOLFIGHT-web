interface GuildInfoItemProps {
  title: string;
  value: string | undefined;
}

export const GuildInfoItem = (props: GuildInfoItemProps) => {
  const { title, value } = props;
  return (
    <div className="flex flex-col gap-[8px]">
      <label className="font-bold text-[16px]">{title}</label>
      <div className="w-full bg-[#EFEFEF] dark:bg-brandgray border border-[#CDCDCD] rounded px-[8px] py-[8px]">
        <p className="text-[16px] font-medium">{value}</p>
      </div>
    </div>
  );
};

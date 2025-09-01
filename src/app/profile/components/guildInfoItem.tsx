"use client";
import { useIsMobile } from "@/src/hooks/useMediaQuery";

interface GuildInfoItemProps {
  title: string;
  value: string | undefined;
}

export const GuildInfoItem = (props: GuildInfoItemProps) => {
  const { title, value } = props;
  const isMobile = useIsMobile();
  return (
    <div className="flex flex-col gap-[8px]">
      <label
        className={`font-bold ${isMobile ? "text-[12px]" : "text-[16px]"}`}
      >
        {title}
      </label>
      <div
        className={`w-full bg-[#EFEFEF] dark:bg-brandgray border border-[#CDCDCD] rounded dark:border-branddarkborder ${
          isMobile ? "p-[4px]" : "p-[8px]"
        }`}
      >
        <p
          className={`font-medium ${isMobile ? "text-[12px]" : "text-[16px]"}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
};

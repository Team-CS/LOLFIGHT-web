"use client";

import { useIsMobile } from "@/src/hooks/useMediaQuery";

export const SectionCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const isMobile = useIsMobile();

  return (
    <div className="w-full max-w-[1200px] flex flex-col gap-[14px] p-[16px] md:p-[20px] rounded-[16px] shadow-md border border-gray-100 dark:border-branddarkborder bg-white dark:bg-dark">
      <div className="flex items-center gap-[10px]">
        <div className="w-[4px] h-[20px] bg-gradient-to-b from-red-500 to-orange-400 rounded-full" />
        <h2
          className={`font-bold ${
            isMobile ? "text-[16px]" : "text-[20px]"
          }`}
        >
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
};

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
    <div className="w-full max-w-[1200px] flex flex-col gap-[12px] p-[12px] rounded-2xl shadow-sm border border-brandborder dark:border-branddarkborder bg-white dark:bg-branddark">
      <h2
        className={`font-bold text-brandgray dark:text-brandhover ${
          isMobile ? "text-[18px]" : "text-[22px]"
        }`}
      >
        {title}
      </h2>
      {children}
    </div>
  );
};

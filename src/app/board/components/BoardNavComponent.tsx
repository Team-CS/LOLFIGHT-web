"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import boardNavLinks from "@/src/data/boardNavLinks";
import { useIsMobile } from "@/src/hooks/useMediaQuery";

const BoardNavComponent = () => {
  const pathname = usePathname();
  const isMobile = useIsMobile();

  return (
    <div
      className={`rounded-[12px] shadow-md bg-white dark:bg-dark h-full ${
        isMobile
          ? "w-full overflow-x-auto"
          : "sticky top-[100px] w-[200px] overflow-y-auto"
      }`}
    >
      <nav
        className={`flex ${
          isMobile
            ? "flex-nowrap gap-[8px] items-center p-[8px] min-w-max"
            : "flex-col py-[12px]"
        }`}
      >
        {boardNavLinks
          .filter((link) => link.href !== "/")
          .map((link) => {
            const isActive = pathname.startsWith(link.href);

            return (
              <Link
                key={link.title}
                href={link.href}
                className={`flex items-center rounded-[8px] font-medium transition-colors
              ${
                isActive
                  ? "bg-brandcolor text-white"
                  : "text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
              } ${
                  isMobile
                    ? "w-fit h-[25px] text-[10px] px-[8px]"
                    : "h-[40px] text-[16px] px-[16px] mx-[8px] my-[4px]"
                }`}
              >
                {link.title}
              </Link>
            );
          })}
      </nav>
    </div>
  );
};

export default BoardNavComponent;

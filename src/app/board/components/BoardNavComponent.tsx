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
      className={`rounded-[14px] shadow-lg bg-white dark:bg-dark border border-gray-100 dark:border-branddarkborder ${
        isMobile
          ? "w-full overflow-x-auto"
          : "sticky top-[100px] w-[200px] h-fit overflow-y-auto"
      }`}
    >
      {!isMobile && (
        <div className="px-[16px] py-[14px] border-b border-gray-100 dark:border-branddarkborder">
          <p className="text-[14px] font-bold text-gray-700 dark:text-gray-200">
            게시판
          </p>
        </div>
      )}
      <nav
        className={`flex ${
          isMobile
            ? "flex-nowrap gap-[8px] items-center p-[10px] min-w-max"
            : "flex-col py-[8px]"
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
                className={`flex items-center rounded-[8px] font-medium transition-all duration-200
              ${
                isActive
                  ? "bg-gradient-to-r from-brandcolor to-blue-500 text-white shadow-md"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-branddarkborder"
              } ${
                isMobile
                  ? "w-fit h-[28px] text-[11px] px-[10px]"
                  : "h-[42px] text-[14px] px-[14px] mx-[8px] my-[3px]"
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

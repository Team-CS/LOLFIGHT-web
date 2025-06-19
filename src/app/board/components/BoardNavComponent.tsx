"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import boardNavLinks from "@/src/data/boardNavLinks";

const BoardNavComponent = () => {
  const pathname = usePathname();

  return (
    <div className="sticky top-[300px] shadow-md w-[200px] h-full rounded-[12px] overflow-y-auto bg-white dark:bg-dark">
      <nav className="flex flex-col py-[12px]">
        {boardNavLinks
          .filter((link) => link.href !== "/")
          .map((link) => {
            const isActive = pathname.startsWith(link.href);

            return (
              <Link
                key={link.title}
                href={link.href}
                className={`flex items-center h-[40px] px-[16px] mx-[8px] my-[4px] rounded-[8px] font-medium transition-colors
                  ${
                    isActive
                      ? "bg-brandcolor text-white"
                      : "text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
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

import { useIsMobile } from "@/src/hooks/useMediaQuery";
import { usePathname } from "next/navigation";
import React from "react";
import { FaSearch } from "react-icons/fa";

interface Props {
  guildLength: number;
  searchTerm?: string;
  setSearchTerm?: React.Dispatch<React.SetStateAction<string>>;
  onSearch?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const LeagueHeaderComponent = ({
  guildLength,
  searchTerm,
  setSearchTerm,
  onSearch,
  onKeyDown,
}: Props) => {
  const pathName = usePathname();
  const isSearchVisible = pathName === "/";
  const isMobile = useIsMobile();
  return (
    <>
      <div
        className={`flex items-center justify-between gap-[12px] ${
          isMobile ? "px-[12px] pb-[16px]" : "pb-[16px]"
        }`}
      >
        <div className="flex gap-[10px] items-center">
          <div
            className={`flex rounded-[8px] bg-gradient-to-r from-brandcolor to-blue-400 text-white items-center shadow-md ${
              isMobile
                ? "px-[10px] py-[5px] gap-[6px]"
                : "px-[12px] py-[6px] gap-[8px]"
            }`}
          >
            <p
              className={`font-bold ${
                isMobile ? "text-[11px]" : "text-[13px]"
              }`}
            >
              공식 리그
            </p>
            <div className="flex w-[8px] h-[8px] bg-green-400 rounded-full animate-pulse" />
          </div>
          <p
            className={`${isMobile ? "text-[12px]" : "text-[14px]"} font-medium text-gray-600 dark:text-gray-300`}
          >
            <span className="font-bold text-brandcolor">{guildLength}</span>개의 길드 참여중
          </p>
        </div>
        {!isSearchVisible && (
          <div className="flex justify-center">
            <div
              className={`bg-gray-100 flex flex-wrap justify-center content-center dark:bg-branddark rounded-l-[8px] cursor-pointer hover:bg-gray-200 dark:hover:bg-branddarkborder transition-colors ${
                isMobile ? "p-[10px]" : "p-[12px]"
              }`}
              onClick={onSearch}
            >
              <FaSearch
                className={`text-gray-500 dark:text-gray-300 ${
                  isMobile ? "w-[12px] h-[12px]" : "w-[16px] h-[16px]"
                }`}
              />
            </div>
            <input
              className={`max-w-[160px] bg-gray-100 focus:outline-none dark:bg-branddark font-normal rounded-r-[8px] placeholder:text-gray-400 ${
                isMobile
                  ? "px-[12px] py-[6px] text-[12px]"
                  : "px-[14px] py-[10px] text-[14px]"
              }`}
              type="text"
              placeholder="길드 이름 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm!(e.target.value)}
              onKeyDown={onKeyDown}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default LeagueHeaderComponent;

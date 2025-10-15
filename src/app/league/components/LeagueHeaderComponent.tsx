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
          isMobile ? "px-[12px] pb-[12px]" : "pb-[12px]"
        }`}
      >
        <div className="flex flex gap-[8px] items-center">
          <div
            className={`flex rounded rounded-[12px] bg-white shadow-md text-black items-center  ${
              isMobile
                ? "px-[8px] py-[4px] gap-[4px]"
                : "px-[8px] py-[4px] gap-[8px]"
            }`}
          >
            <p
              className={`font-extrabold ${
                isMobile ? "text-[12px]" : "text-[14px]"
              }`}
            >
              공식
            </p>
            <div className="flex w-[8px] h-[8px] bg-green-500 rounded-full" />
          </div>
          <p
            className={`${isMobile ? "text-[12px]" : "text-[14px]"} font-light`}
          >
            {guildLength}개의 길드 참여중
          </p>
        </div>
        {!isSearchVisible && (
          <div className="flex justify-center">
            <div
              className={`bg-gray-100 flex flex-wrap justify-center content-center dark:bg-branddark rounded-l-md ${
                isMobile ? "p-[8px]" : "p-[12px]"
              }`}
              onClick={onSearch}
            >
              <FaSearch
                className={`${
                  isMobile ? "w-[10px] h-[10px]" : "w-[15px] h-[15px]"
                }`}
              />
            </div>
            <input
              className={`max-w-[140px] bg-gray-100 focus:outline-none dark:bg-branddark font-normal rounded-r-md ${
                isMobile
                  ? "px-[12px] py-[4px] text-[12px]"
                  : "px-[12px] py-[8px] text-[14px]"
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

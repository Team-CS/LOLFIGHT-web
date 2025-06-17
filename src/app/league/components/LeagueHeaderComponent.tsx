import { usePathname } from "next/navigation";
import React from "react";
import { FaSearch } from "react-icons/fa";

interface Props {
  guildLength: number;
  searchTerm?: string;
  setSearchTerm?: React.Dispatch<React.SetStateAction<string>>;
}

const LeagueHeaderComponent = ({
  guildLength,
  searchTerm,
  setSearchTerm,
}: Props) => {
  const pathName = usePathname();
  const isSearchVisible = pathName === "/";
  return (
    <>
      <div className="flex items-center">
        <div className="flex flex gap-[8px] items-center">
          <div className="flex rounded rounded-[12px] bg-white shadow-md text-black items-center p-[8px] gap-[8px]">
            <p className="font-extrabold text-sm">공식</p>
            <div className="flex w-8px h-8px bg-green-500 rounded-full" />
          </div>
          <p className="text-[14px] font-light">
            {guildLength}개의 길드 참여중
          </p>
        </div>
        {!isSearchVisible && (
          <div className="flex justify-center ml-auto">
            <div className="bg-gray-100 p-[12px] flex flex-wrap justify-center content-center dark:bg-dark rounded-l-md">
              <FaSearch />
            </div>
            <input
              className="w-full px-[12px] py-[8px] bg-gray-100 focus:outline-none dark:bg-dark font-normal rounded-r-md"
              type="text"
              placeholder="길드 이름 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm!(e.target.value)}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default LeagueHeaderComponent;

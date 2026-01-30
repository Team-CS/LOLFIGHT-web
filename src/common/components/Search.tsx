"use client";
import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

const Search = () => {
  const [summonerName, setSummonerName] = useState<string>();

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (summonerName) {
        const name = summonerName.split("#")[0];
        const tag = summonerName.split("#")[1];
        window.open(`https://www.fow.lol/find/kr/${name}-${tag}`, "_blank");
      }
    }
  };

  const handleClick = () => {
    if (summonerName) {
      const name = summonerName.split("#")[0];
      const tag = summonerName.split("#")[1];
      window.open(`https://www.fow.lol/find/kr/${name}-${tag}`, "_blank");
    }
  };

  const handleInputText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSummonerName(e.target.value);
  };

  return (
    <div className="flex h-[46px] mt-[6px] rounded-b-[12px] border border-gray-100 dark:border-branddarkborder overflow-hidden shadow-sm">
      <input
        className="w-full px-[14px] bg-gray-50 dark:bg-dark focus:outline-none text-[14px] placeholder:text-gray-400"
        type="text"
        placeholder="소환사명#태그 검색"
        onKeyDown={handleKeyPress}
        onChange={handleInputText}
      />
      <button
        className="bg-gradient-to-r from-brandcolor to-blue-500 w-[50px] flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
        onClick={handleClick}
      >
        <FaSearch className="text-white w-[16px] h-[16px]" />
      </button>
    </div>
  );
};

export default Search;

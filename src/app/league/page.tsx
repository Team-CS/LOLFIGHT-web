"use client";
import { useCallback, useEffect, useState } from "react";
import GuildInfoComponent from "./components/GuildInfoComponent";
import LeagueHeaderComponent from "./components/LeagueHeaderComponent";
import {
  GuildDto,
  GuildListResponseDto,
} from "@/src/common/DTOs/guild/guild.dto";
import { getGuildList, getTopGuilds } from "@/src/api/guild.api";
import Pagination from "@mui/material/Pagination";
import LeaguePodium from "./components/LeaguePodium";
import { useIsMobile } from "@/src/hooks/useMediaQuery";

export default function Page() {
  const isMobile = useIsMobile();
  const [guilds, setGuilds] = useState<GuildDto[]>([]);
  const [topGuilds, setTopGuilds] = useState<GuildDto[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0); // 총 페이지 수
  const [searchTerm, setSearchTerm] = useState<string>(""); // 검색어
  const guildsPerPage = 10;

  useEffect(() => {
    fetchTopGuilds();
  }, []);

  useEffect(() => {
    fetchGuilds(currentPage);
  }, [currentPage]);

  const fetchGuilds = async (page: number) => {
    try {
      const response = await getGuildList(page, guildsPerPage, searchTerm);
      const data = response.data.data as GuildListResponseDto;
      if (Array.isArray(data.guildList)) {
        setGuilds(data.guildList);
      } else {
        setGuilds([]);
      }

      if (data.pagination) {
        const { totalPage } = data.pagination;
        const pages = Math.ceil(totalPage! / guildsPerPage);
        setTotalPages(Math.max(1, pages));
      }
    } catch (error) {
      console.error("게시글 목록 조회 실패:", error);
      setGuilds([]);
      setTotalPages(1);
    }
  };

  const fetchTopGuilds = async () => {
    try {
      const response = await getTopGuilds();
      const data = response.data.data as GuildListResponseDto;
      setTopGuilds(data.guildList);
    } catch (e) {
      setTopGuilds([]);
    }
  };

  const handlePageClick = (
    event: React.ChangeEvent<unknown>,
    pageNumber: number
  ) => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = () => {
    const trimmed = searchTerm.trim();
    if (trimmed.length >= 2) {
      setCurrentPage(1);
      fetchGuilds(1);
    } else {
      alert("검색어는 최소 2자 이상 입력해주세요.");
    }
  };

  // 엔터키 입력 시 실행
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto flex flex-col gap-[12px] py-[28px]">
      {topGuilds.length === 0 ? (
        <div className="w-full text-center text-gray-400 py-[20px] text-[14px]">
          순위 기록이 없습니다 😅
        </div>
      ) : (
        <LeaguePodium
          first={topGuilds[0]}
          second={topGuilds[1]}
          third={topGuilds[2]}
        />
      )}

      <LeagueHeaderComponent
        guildLength={guilds.length}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSearch={handleSearch}
        onKeyDown={handleKeyDown}
      />
      <div className="flex flex-col px-[12px] rounded-t-[12px]">
        <div className="flex bg-brandcolor text-white dark:bg-dark font-thin rounded-t-[12px] w-full whitespace-nowrap">
          <div
            className={`flex-[0.25] text-center ${
              isMobile ? "px-[8px] text-[14px]" : "px-[8px] text-[16px]"
            }`}
          >
            순위
          </div>
          <div
            className={`flex-[1] text-center ${
              isMobile ? "px-[8px] text-[14px]" : "px-[8px] text-[16px]"
            }`}
          >
            길드명
          </div>
          {!isMobile && (
            <>
              <div className={`flex-[2] text-center px-[8px] text-[16px]`}>
                길드소개
              </div>

              <div className={`flex-[0.25] text-center px-[8px] text-[16px]`}>
                길드원
              </div>
            </>
          )}
          <div
            className={`flex-[0.25] text-center ${
              isMobile ? "px-[8px] text-[14px]" : "px-[8px] text-[16px]"
            }`}
          >
            승
          </div>
          <div
            className={`flex-[0.25] text-center ${
              isMobile ? "px-[8px] text-[14px]" : "px-[8px] text-[16px]"
            }`}
          >
            패
          </div>
          <div
            className={`flex-[0.5] text-center ${
              isMobile ? "px-[8px] text-[14px]" : "px-[8px] text-[16px]"
            }`}
          >
            티어
          </div>
          <div
            className={`flex-[0.5] text-center ${
              isMobile ? "px-[8px] text-[14px]" : "px-[8px] text-[16px]"
            }`}
          >
            래더점수
          </div>
        </div>
        <div className="flex flex-col">
          {guilds.map((guild) => (
            <GuildInfoComponent key={guild.id} guild={guild} />
          ))}
        </div>
      </div>
      <div className="notice__pagination w-full flex justify-center mt-1 p-3">
        <Pagination
          count={totalPages}
          page={currentPage}
          shape="rounded"
          boundaryCount={2}
          onChange={(event, page) => handlePageClick(event, page)}
          sx={{
            ".dark & .Mui-selected": {
              backgroundColor: "#4C4C4C",
              color: "#CACACA", // 텍스트 색상
              "&:hover": {
                backgroundColor: "#707070", // 호버 시 색상
              },
            },
            ".dark & .MuiPaginationItem-root": {
              color: "#EEEEEE", // 선택되지 않은 아이템의 기본 텍스트 색상
            },
            ".dark & .MuiPaginationItem-icon": {
              color: "#EEEEEE", // 텍스트 색상
            },
          }}
        />
      </div>
    </div>
  );
}

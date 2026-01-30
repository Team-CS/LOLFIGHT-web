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
    <div className="max-w-[1200px] mx-auto flex flex-col gap-[16px] py-[32px]">
      {topGuilds.length === 0 ? (
        <div className="w-full text-center text-gray-400 py-[24px] text-[14px]">
          순위 기록이 없습니다
        </div>
      ) : (
        <LeaguePodium
          first={topGuilds[0]}
          second={topGuilds[1]}
          third={topGuilds[2]}
        />
      )}

      <div className={`flex flex-col ${isMobile ? "p-[12px]" : "py-[16px]"}`}>
        <div
          className={`shadow-lg rounded-[16px] bg-white dark:bg-dark border border-gray-100 dark:border-branddarkborder ${
            isMobile ? "py-[14px]" : "p-[16px]"
          }`}
        >
          <LeagueHeaderComponent
            guildLength={guilds.length}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onSearch={handleSearch}
            onKeyDown={handleKeyDown}
          />

          <div className="flex w-full whitespace-nowrap py-[10px] bg-gradient-to-r from-[#f0f4ff] to-[#f4f7ff] dark:from-branddark dark:to-branddark border-t border-b border-blue-100 dark:border-branddarkborder text-brandcolor font-bold">
            <div
              className={`flex-[0.25] text-center ${
                isMobile ? "px-[8px] text-[11px]" : "px-[8px] text-[13px]"
              }`}
            >
              순위
            </div>
            <div
              className={`flex-[1] text-center ${
                isMobile ? "px-[8px] text-[11px]" : "px-[8px] text-[13px]"
              }`}
            >
              길드명
            </div>
            {!isMobile && (
              <>
                <div className={`flex-[2] text-center px-[8px] text-[13px]`}>
                  길드소개
                </div>

                <div className={`flex-[0.25] text-center px-[8px] text-[13px]`}>
                  길드원
                </div>
              </>
            )}
            <div
              className={`flex-[0.25] text-center ${
                isMobile ? "px-[8px] text-[11px]" : "px-[8px] text-[13px]"
              }`}
            >
              승
            </div>
            <div
              className={`flex-[0.25] text-center ${
                isMobile ? "px-[8px] text-[11px]" : "px-[8px] text-[13px]"
              }`}
            >
              패
            </div>
            <div
              className={`flex-[0.5] text-center ${
                isMobile ? "px-[8px] text-[11px]" : "px-[8px] text-[13px]"
              }`}
            >
              티어
            </div>
            <div
              className={`flex-[0.5] text-center ${
                isMobile ? "px-[8px] text-[11px]" : "px-[8px] text-[13px]"
              }`}
            >
              래더점수
            </div>
          </div>
          <div className="flex flex-col gap-[6px] pt-[10px]">
            {guilds.map((guild) => (
              <GuildInfoComponent key={guild.id} guild={guild} />
            ))}
          </div>
        </div>
      </div>
      <div className="w-full flex justify-center mt-2 p-4">
        <Pagination
          count={totalPages}
          page={currentPage}
          shape="rounded"
          boundaryCount={2}
          onChange={(event, page) => handlePageClick(event, page)}
          sx={{
            // 다크 모드 선택된 아이템
            ".dark & .Mui-selected": {
              backgroundColor: "#4C4C4C",
              color: "#CACACA",
              "&:hover": {
                backgroundColor: "#707070",
              },
            },
            // 다크 모드 일반 아이템
            ".dark & .MuiPaginationItem-root": {
              color: "#EEEEEE",
            },
            ".dark & .MuiPaginationItem-icon": {
              color: "#EEEEEE",
            },
            // 모바일 / PC 반응형
            "& .MuiPaginationItem-root": {
              fontSize: isMobile ? "10px" : "14px", // 폰트 크기
              minWidth: isMobile ? "24px" : "36px", // 버튼 최소 너비
              height: isMobile ? "24px" : "36px", // 버튼 높이
            },
          }}
        />
      </div>
    </div>
  );
}

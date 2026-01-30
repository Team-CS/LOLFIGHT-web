"use client";
import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import CustomAlert from "@/src/common/components/alert/CustomAlert";
import { useRouter } from "next/navigation";
import { getJudgmentList } from "@/src/api/judgment.api";
import {
  JudgmentDto,
  JudgmentListResponseDto,
} from "@/src/common/DTOs/judgment/judgment.dto";
import JudgmentBox from "./components/JudgmentBox";
import Pagination from "@mui/material/Pagination";
import { useMemberStore } from "@/src/common/zustand/member.zustand";
import { useIsMobile } from "@/src/hooks/useMediaQuery";

export default function Page() {
  const router = useRouter();
  const [judgments, setJudgments] = useState<JudgmentDto[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { member } = useMemberStore();
  const judgmentPerPage = 10;
  const isMobile = useIsMobile();

  useEffect(() => {
    fetchJudgments(currentPage);
  }, [currentPage]);

  const handlePageClick = (
    event: React.ChangeEvent<unknown>,
    pageNumber: number,
  ) => {
    setCurrentPage(pageNumber);
  };

  const fetchJudgments = async (page: number) => {
    try {
      const response = await getJudgmentList(page, judgmentPerPage, searchTerm);
      const data = response.data.data as JudgmentListResponseDto;

      if (Array.isArray(data.judgmentList)) {
        setJudgments(data.judgmentList);
      } else {
        setJudgments([]);
      }

      if (data.pagination) {
        const { totalPage } = data.pagination;
        const pages = Math.ceil(totalPage! / judgmentPerPage);
        setTotalPages(Math.max(1, pages));
      }
    } catch (error) {
      console.log(error);
      setJudgments([]);
      setTotalPages(1);
    }
  };

  const handleWriteClick = () => {
    if (member) {
      router.push(`/judgment//write`);
    } else {
      CustomAlert("info", "글쓰기", "로그인이 필요합니다");
    }
  };

  const handleSearch = () => {
    const trimmed = searchTerm.trim();
    if (trimmed.length >= 2) {
      setCurrentPage(1);
      fetchJudgments(1);
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
    <div className="flex flex-col max-w-[1200px] h-full mx-auto w-full py-[32px] gap-[20px] px-[12px] md:px-0">
      <div className="w-full bg-white dark:bg-dark rounded-[16px] shadow-lg border border-gray-100 dark:border-branddarkborder">
        {/* Header */}
        <div className="flex gap-[12px] py-[16px] px-[16px] md:px-[24px] items-center justify-between">
          <div className="flex items-center gap-[10px]">
            <div className="w-[4px] h-[24px] bg-gradient-to-b from-red-500 to-orange-400 rounded-full" />
            <p
              className={`font-bold ${
                isMobile ? "text-[16px]" : "text-[20px]"
              }`}
            >
              롤로세움
            </p>
          </div>
          <div className="flex gap-[10px] items-center">
            <div
              className={`flex items-center rounded-[10px] px-[12px] gap-[8px] bg-gray-50 dark:bg-branddark border border-gray-200 dark:border-branddarkborder hover:border-brandcolor dark:hover:border-brandcolor transition-colors ${
                isMobile ? "w-[120px]" : "w-[200px]"
              }`}
            >
              <div
                className="flex items-center justify-center cursor-pointer"
                onClick={handleSearch}
              >
                <FaSearch
                  className={`text-gray-400 ${
                    isMobile ? "w-[12px] h-[12px]" : "w-[14px] h-[14px]"
                  }`}
                />
              </div>
              <input
                className={`w-full bg-transparent focus:outline-none font-normal placeholder:text-gray-400 ${
                  isMobile ? "py-[8px] text-[12px]" : "py-[10px] text-[14px]"
                }`}
                type="text"
                placeholder="재판 검색"
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <button
              className={`bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-[8px] font-medium hover:opacity-90 transition-opacity shadow-sm ${
                isMobile
                  ? "h-[34px] px-[12px] text-[12px]"
                  : "h-[42px] px-[16px] text-[14px]"
              }`}
              onClick={handleWriteClick}
            >
              글쓰기
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full border-t border-gray-100 dark:border-branddarkborder" />

        {/* Body */}
        <div className="flex flex-col w-full h-full p-[16px] md:p-[20px] gap-[14px]">
          {judgments.length > 0 ? (
            judgments.map((judgment) => (
              <JudgmentBox key={judgment.id} judgment={judgment} />
            ))
          ) : (
            <div className="w-full text-center text-gray-400 py-[40px] text-[14px]">
              해당 글이 존재하지 않습니다
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="w-full flex justify-center py-[16px] border-t border-gray-100 dark:border-branddarkborder">
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
    </div>
  );
}

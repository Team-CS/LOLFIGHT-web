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

export default function Page() {
  const router = useRouter();
  const [judgments, setJudgments] = useState<JudgmentDto[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { member } = useMemberStore();
  const judgmentPerPage = 10;

  useEffect(() => {
    fetchJudgments(currentPage);
  }, [currentPage]);

  const handlePageClick = (
    event: React.ChangeEvent<unknown>,
    pageNumber: number
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
    <div className="flex flex-col max-w-[1200px] h-full mx-auto w-full py-[28px] gap-[24px]">
      <div className="w-full bg-white dark:bg-dark rounded-[12px] shadow-md">
        {/* Header */}
        <div className="flex gap-[12px] py-[12px] px-[24px] items-center justify-between">
          <p className="flex text-[18px] font-bold text-center justify-center items-center">
            롤로세움
          </p>
          <div className="flex gap-[12px] items-center">
            <div className="flex w-[200px] border border-gray-200 rounded-md px-[12px] gap-[4px] bg-gray-100 dark:bg-black dark:border-black">
              <div
                className="flex flex-wrap justify-center content-center dark:bg-black"
                onClick={handleSearch}
              >
                <FaSearch />
              </div>
              <input
                className="w-full rounded-md bg-gray-100 px-[12px] py-[4px] text-[14px] focus:outline-none dark:bg-black font-normal"
                type="text"
                placeholder="검색"
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <button
              className="h-[30px] w-[60px] border border-brandcolor bg-brandcolor text-white text-[14px] rounded-[8px]"
              onClick={handleWriteClick}
            >
              글쓰기
            </button>
          </div>
        </div>

        {/* Divier */}
        <div className="w-full flex justify-center border-t border-brandborder dark:border-branddarkborder" />

        {/* Body */}
        <div className="flex flex-col w-full h-full p-[20px] gap-[12px]">
          {judgments.length > 0 ? (
            judgments.map((judgment) => (
              <JudgmentBox key={judgment.id} judgment={judgment} />
            ))
          ) : (
            <div className="w-full text-center text-gray-400 py-[20px] text-[14px]">
              해당 글이 존재하지 않습니다 😅
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="w-full flex justify-center py-[12px] border-t border-brandborder dark:border-branddarkborder">
          <Pagination
            count={totalPages}
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
    </div>
  );
}

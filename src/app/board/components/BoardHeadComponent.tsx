"use client";
import { FaSearch } from "react-icons/fa";
import { useRouter } from "next/navigation";
import CustomAlert from "@/src/common/components/alert/CustomAlert";
import { useMemberStore } from "@/src/common/zustand/member.zustand";
import { useIsMobile } from "@/src/hooks/useMediaQuery";
import { useState } from "react";
import { getTitleFromSlug } from "@/src/utils/string/string.util";

interface BoardHeadComponentProps {
  head: { slug: string };
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  onSearch: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  searchTarget: string;
  setSearchTarget: React.Dispatch<React.SetStateAction<string>>;
}

const BoardHeadComponent = (props: BoardHeadComponentProps) => {
  const router = useRouter();
  const { member } = useMemberStore();
  const isMobile = useIsMobile();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleWriteClick = () => {
    if (member) {
      router.push(`/board/${props.head.slug}/write`);
    } else {
      CustomAlert("info", "글쓰기", "로그인이 필요합니다");
    }
  };

  return (
    <div className="notice-head">
      <div className="flex justify-between items-center py-[16px] px-[16px] md:px-[24px]">
        <div className="flex items-center gap-[10px]">
          <div className="w-[4px] h-[22px] bg-gradient-to-b from-brandcolor to-blue-400 rounded-full" />
          <p
            className={`font-bold ${
              isMobile ? "text-[14px]" : "text-[20px]"
            }`}
          >
            {getTitleFromSlug(props.head.slug)}
          </p>
        </div>
        <div className="flex gap-[10px] items-center">
          {isMobile ? (
            <>
              {/* 검색 아이콘 */}
              <div
                onClick={() => setIsSearchOpen(true)}
                className="cursor-pointer p-[8px] rounded-[8px] bg-gray-100 dark:bg-branddark hover:bg-gray-200 dark:hover:bg-branddarkborder transition-colors"
              >
                <FaSearch className="text-gray-500 dark:text-gray-300" />
              </div>

              {/* 검색 팝업 */}
              {isSearchOpen && (
                <div
                  className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 pt-[20px]"
                  onClick={() => setIsSearchOpen(false)}
                >
                  <div
                    className="w-[90%] max-w-md bg-white dark:bg-dark rounded-[14px] shadow-xl p-[16px]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-[8px]">
                      <select
                        className="border border-gray-200 dark:border-branddarkborder rounded-[8px] bg-gray-50 dark:bg-branddark h-[38px] px-[10px] text-[12px] focus:outline-none focus:border-brandcolor"
                        value={props.searchTarget}
                        onChange={(e) => props.setSearchTarget(e.target.value)}
                      >
                        <option value="title">제목</option>
                        <option value="author">작성자</option>
                      </select>
                      <div className="flex flex-1 items-center border border-gray-200 dark:border-branddarkborder rounded-[8px] px-[10px] gap-[8px] bg-gray-50 dark:bg-branddark">
                        <div
                          className="flex items-center justify-center cursor-pointer"
                          onClick={props.onSearch}
                        >
                          <FaSearch className="text-gray-400" />
                        </div>
                        <input
                          autoFocus
                          className="w-full bg-transparent py-[10px] text-[12px] focus:outline-none font-normal placeholder:text-gray-400"
                          type="text"
                          placeholder="검색어 입력 (2자 이상)"
                          onChange={(e) => props.setSearchTerm(e.target.value)}
                          onKeyDown={props.onKeyDown}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <select
                className="border border-gray-200 dark:border-branddarkborder rounded-[8px] bg-gray-50 dark:bg-branddark h-[40px] px-[12px] text-[13px] focus:outline-none focus:border-brandcolor transition-colors"
                value={props.searchTarget}
                onChange={(e) => props.setSearchTarget(e.target.value)}
              >
                <option value="title">제목</option>
                <option value="author">작성자</option>
              </select>
              <div className="flex w-[200px] items-center border border-gray-200 dark:border-branddarkborder rounded-[10px] px-[12px] gap-[8px] bg-gray-50 dark:bg-branddark hover:border-brandcolor transition-colors">
                <div
                  className="flex items-center justify-center cursor-pointer"
                  onClick={props.onSearch}
                >
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  className="w-full bg-transparent py-[10px] text-[14px] focus:outline-none font-normal placeholder:text-gray-400"
                  type="text"
                  placeholder="검색어 입력 (2자 이상)"
                  onChange={(e) => props.setSearchTerm(e.target.value)}
                  onKeyDown={props.onKeyDown}
                />
              </div>
            </>
          )}

          <button
            className={`${
              isMobile
                ? "h-[34px] px-[12px] text-[12px]"
                : "h-[40px] px-[16px] text-[14px]"
            } bg-gradient-to-r from-brandcolor to-blue-500 text-white rounded-[8px] font-medium hover:opacity-90 transition-opacity shadow-sm`}
            onClick={handleWriteClick}
          >
            글쓰기
          </button>
        </div>
      </div>

      {/* 테이블 헤드 */}
      <div
        className={`w-full py-[10px] flex border-t border-b border-blue-100 dark:border-branddarkborder bg-gradient-to-r from-[#f0f4ff] to-[#f4f7ff] dark:from-branddark dark:to-branddark ${
          isMobile ? "text-[10px]" : "text-[13px]"
        }`}
      >
        <div className="w-1/12 flex items-center justify-center text-brandcolor font-bold">
          추천
        </div>
        <div className="w-1/12 flex items-center justify-center text-brandcolor font-bold">
          말머리
        </div>
        <div className="w-1/2 flex items-center justify-center text-brandcolor font-bold">
          제목
        </div>
        <div className="w-2/12 flex items-center justify-center text-brandcolor font-bold">
          작성자
        </div>
        <div className="w-1/6 flex items-center justify-center text-brandcolor font-bold">
          작성일
        </div>
        <div className="w-1/12 flex items-center justify-center text-brandcolor font-bold">
          조회수
        </div>
      </div>
    </div>
  );
};

export default BoardHeadComponent;

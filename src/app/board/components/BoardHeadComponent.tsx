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
      <div className="flex justify-between items-center py-[12px] px-[24px]">
        <p
          className={`flex font-bold text-center justify-center items-center ${
            isMobile ? "text-[12px]" : "text-[18px]"
          }`}
        >
          {getTitleFromSlug(props.head.slug)}
        </p>
        <div className="flex gap-[12px] items-center">
          {isMobile ? (
            <>
              {/* 검색 아이콘 */}
              <div
                onClick={() => setIsSearchOpen(true)}
                className="cursor-pointer"
              >
                <FaSearch />
              </div>

              {/* 검색 팝업 */}
              {isSearchOpen && (
                <div
                  className="fixed inset-0 z-50 flex items-start justify-center bg-black/30"
                  onClick={() => setIsSearchOpen(false)} // overlay 클릭 닫기
                >
                  {/* 팝업 박스 */}
                  <div
                    className="mt-[40px] w-[90%] max-w-md rounded-xl border border-gray-300 bg-white dark:bg-black dark:border-gray-700 shadow-lg p-[12px]"
                    onClick={(e) => e.stopPropagation()} // 내부 클릭 시 닫히지 않게
                  >
                    <div className="flex items-center gap-[8px]">
                      {/* select + input */}
                      <select
                        className="border border-gray-300 rounded-md bg-white dark:bg-black dark:text-white dark:border-gray-700 h-[30px] px-[6px] text-[12px]"
                        value={props.searchTarget}
                        onChange={(e) => props.setSearchTarget(e.target.value)}
                      >
                        <option value="title">제목</option>
                        <option value="author">작성자</option>
                      </select>
                      <div className="flex flex-1 border border-gray-200 rounded-md px-[8px] gap-[4px] bg-gray-100 dark:bg-black dark:border-black">
                        <div
                          className="flex flex-wrap justify-center content-center cursor-pointer"
                          onClick={props.onSearch}
                        >
                          <FaSearch />
                        </div>
                        <input
                          autoFocus
                          className="w-full rounded-md bg-gray-100 px-[8px] py-[4px] text-[12px] focus:outline-none dark:bg-black font-normal"
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
                className="border border-gray-300 rounded-md bg-white dark:bg-black dark:text-white dark:border-gray-700 h-[30px] px-[8px] text-[14px]"
                value={props.searchTarget}
                onChange={(e) => props.setSearchTarget(e.target.value)}
              >
                <option value="title">제목</option>
                <option value="author">작성자</option>
              </select>
              <div className="flex w-[200px] border border-gray-200 rounded-md px-[12px] gap-[4px] bg-gray-100 dark:bg-black dark:border-black">
                <div
                  className="flex flex-wrap justify-center content-center cursor-pointer"
                  onClick={props.onSearch}
                >
                  <FaSearch />
                </div>
                <input
                  className="w-full rounded-md bg-gray-100 px-[12px] py-[4px] text-[14px] focus:outline-none dark:bg-black font-normal"
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
                ? "h-[25px] w-[50px] text-[12px]"
                : "h-[30px] w-[60px] text-[14px]"
            } border border-brandcolor bg-brandcolor text-white rounded-[8px]`}
            onClick={handleWriteClick}
          >
            글쓰기
          </button>
        </div>
      </div>

      {/* 아래 테이블 헤드 부분 그대로 */}
      <div
        className={`w-full py-[8px] flex border-t border-b border-brandborder dark:border-branddarkborder bg-[#f4f7ff] dark:bg-branddark ${
          isMobile ? "text-[10px]" : "text-[14px]"
        }`}
      >
        <div className="w-1/12 flex items-center justify-center text-brandcolor font-semibold">
          추천
        </div>
        <div className="w-1/12 flex items-center justify-center text-brandcolor font-semibold">
          말머리
        </div>
        <div className="w-1/2 flex items-center justify-center text-brandcolor font-semibold">
          제목
        </div>
        <div className="w-2/12 flex items-center justify-center text-brandcolor font-semibold">
          작성자
        </div>
        <div className="w-1/6 flex items-center justify-center text-brandcolor font-semibold">
          작성일
        </div>
        <div className="w-1/12 flex items-center justify-center text-brandcolor font-semibold">
          조회수
        </div>
      </div>
    </div>
  );
};

export default BoardHeadComponent;

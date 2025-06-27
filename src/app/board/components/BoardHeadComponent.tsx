"use client";
import { FaSearch } from "react-icons/fa";
import boardNavLinks from "@/src/data/boardNavLinks";
import { useRouter } from "next/navigation";
import CustomAlert from "@/src/common/components/alert/CustomAlert";
import { useMemberStore } from "@/src/common/zustand/member.zustand";

interface BoardHeadComponentProps {
  head: {
    slug: string;
  };
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  onSearch: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

function getTitleFromSlug(slug: string) {
  const link = boardNavLinks.find((link) => link.href === `/board/${slug}`);
  return link?.title ?? "";
}

const BoardHeadComponent = (props: BoardHeadComponentProps) => {
  const router = useRouter();
  const { member } = useMemberStore();

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
        <p className="flex text-[18px] font-bold text-center justify-center items-center">
          {getTitleFromSlug(props.head.slug)}
        </p>
        <div className="flex gap-[12px] items-center">
          <div className="flex w-[200px] border border-gray-200 rounded-md px-[12px] gap-[4px] bg-gray-100 dark:bg-black dark:border-black">
            <div
              className="flex flex-wrap justify-center content-center dark:bg-black"
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
          <button
            className="h-[30px] w-[60px] border border-brandcolor bg-brandcolor text-white text-[14px] rounded-[8px]"
            onClick={handleWriteClick}
          >
            글쓰기
          </button>
        </div>
      </div>

      <div className="w-full py-[8px] text-sm flex border-t border-b border-brandborder dark:border-branddarkborder bg-[#f4f7ff] dark:bg-branddark">
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

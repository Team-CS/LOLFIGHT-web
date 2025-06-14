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
      <div className="notice-head__title flex flex-col">
        <div className="flex justify-between m-8">
          <span className="text-xl font-bold text-center justify-center items-center flex">
            {getTitleFromSlug(props.head.slug)}
          </span>
          <button
            className="h-8 w-16 border border-brandcolor bg-brandcolor text-white m-1 rounded-lg"
            onClick={handleWriteClick}
          >
            글쓰기
          </button>
        </div>

        <div className="flex justify-between font-semibold">
          <div className="flex my-2 ml-2"></div>
          <div className="flex w-[300px] border border-gray-200 rounded-md my-2 mr-2 dark:bg-black dark:border-black">
            <div className="bg-gray-100 w-12 h-10 flex flex-wrap justify-center content-center dark:bg-black">
              <FaSearch />
            </div>
            <input
              className="w-full h-10 rounded-md px-2 bg-gray-100 focus:outline-none dark:bg-black font-normal"
              type="text"
              placeholder="검색"
              onChange={(e) => props.setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="w-full h-16 text-sm flex border-t border-b border-slate-500 dark:bg-branddark">
        <div className="w-1/12 flex items-center justify-center">추천</div>
        <div className="w-1/12 flex items-center justify-center">말머리</div>
        <div className="w-1/2 flex items-center justify-center">제목</div>
        <div className="w-2/12 flex items-center justify-center">작성자</div>
        <div className="w-1/6 flex items-center justify-center">작성일</div>
        <div className="w-1/12 flex items-center justify-center">조회수</div>
      </div>
    </div>
  );
};

export default BoardHeadComponent;

// components/BoardSection.tsx

import { memo } from "react";
import { useIsMobile } from "@/src/hooks/useMediaQuery";

interface Post {
  id: number;
  postTitle: string;
  postContent: string;
  postComments: number;
}

interface BoardSectionProps {
  tabTitles: [string, string];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  postLists: {
    [key: string]: Post[];
  };
  onPostClick: (id: number) => void;
  containsImage: (content: string) => boolean;
}

const BoardSection = memo(function BoardSection({
  tabTitles,
  activeTab,
  setActiveTab,
  postLists,
  onPostClick,
  containsImage,
}: BoardSectionProps) {
  const isMobile = useIsMobile();

  return (
    <div
      className={`flex flex-col w-full min-w-[150px] bg-white dark:bg-dark rounded-[12px] border border-gray-100 dark:border-branddarkborder overflow-hidden shadow-sm ${
        isMobile ? "h-[150px]" : "h-[200px]"
      }`}
    >
      {/* 탭 버튼 */}
      <div className="flex w-full">
        {tabTitles.map((title) => (
          <button
            key={title}
            className={`w-full transition-all ${
              activeTab === title
                ? "font-bold text-brandcolor dark:text-white bg-white dark:bg-dark border-b-2 border-brandcolor"
                : "bg-gray-50 dark:bg-branddark text-gray-500 hover:bg-gray-100 dark:hover:bg-branddarkborder"
            } ${isMobile ? "text-[11px] py-[8px]" : "text-[13px] py-[10px]"}`}
            onClick={() => setActiveTab(title)}
          >
            {title}
          </button>
        ))}
      </div>

      {/* 게시글 목록 */}
      <div className="flex flex-col px-[12px] py-[8px] gap-[6px]">
        {postLists[activeTab] && postLists[activeTab].length > 0 ? (
          (isMobile
            ? postLists[activeTab].slice(0, 4)
            : postLists[activeTab]
          ).map((post) => (
            <div key={post.id} className="flex gap-[6px] items-center group">
              <div className="flex-shrink-0">
                {containsImage(post.postContent) ? <ImageIcon /> : <TextIcon />}
              </div>
              <p
                className={`cursor-pointer truncate group-hover:text-brandcolor transition-colors ${
                  isMobile
                    ? "text-[11px] max-w-[100px]"
                    : "text-[14px] max-w-[300px]"
                }`}
                onClick={() => onPostClick(post.id)}
              >
                {post.postTitle}
              </p>
              {post.postComments > 0 && (
                <span
                  className={`text-brandcolor font-semibold ${
                    isMobile ? "text-[9px]" : "text-[11px]"
                  }`}
                >
                  [{post.postComments}]
                </span>
              )}
            </div>
          ))
        ) : (
          <p
            className={`${
              isMobile ? "text-[11px]" : "text-[13px]"
            } text-gray-400 py-[8px]`}
          >
            게시글이 없습니다.
          </p>
        )}
      </div>
    </div>
  );
});

export default BoardSection;

function ImageIcon() {
  const isMobile = useIsMobile();

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={`text-brandcolor ${isMobile ? "w-[12px] h-[12px]" : "w-[16px] h-[16px]"}`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
      />
    </svg>
  );
}

function TextIcon() {
  const isMobile = useIsMobile();

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={`text-gray-400 ${isMobile ? "w-[12px] h-[12px]" : "w-[16px] h-[16px]"}`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
      />
    </svg>
  );
}

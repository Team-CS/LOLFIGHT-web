"use client";

import React, { useEffect, useState } from "react";
import { likePost, getLike } from "@/src/api/post.api";
import dynamic from "next/dynamic";
import { PostDto } from "@/src/common/DTOs/board/post.dto";

import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor/dist/theme/toastui-editor-dark.css";
import "@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css";
import "@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css";
import "@toast-ui/editor/toastui-editor-viewer.css";

import CustomAlert from "@/src/common/components/alert/CustomAlert";
import { useMemberStore } from "@/src/common/zustand/member.zustand";
import { useTheme } from "next-themes";
import clsx from "clsx";
import { useIsMobile } from "@/src/hooks/useMediaQuery";

interface BoardPostBodyComponentProps {
  data: PostDto | null | undefined;
}

const DynamicViewer = dynamic(
  () => import("@toast-ui/react-editor").then((mod) => mod.Viewer),
  { ssr: false }
);

const BoardPostBodyComponent = (props: BoardPostBodyComponentProps) => {
  const { data } = props;
  const isMobile = useIsMobile();
  const { member } = useMemberStore();
  const [like, setLike] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const { theme } = useTheme();

  useEffect(() => {
    if (data) {
      setIsLoading(false);

      if (member) {
        getLike(data, member.id).then((res) => {
          setLike(res.data.data ? 1 : 0);
        });
      }
    }
  }, [data, member]);

  const handleOnClick = () => {
    if (member && data) {
      likePost(data, member.id).then(() => {
        setLike((prev) => (prev === 0 ? 1 : 0));
      });
    } else {
      CustomAlert("info", "추천", "로그인이 필요합니다");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-[40px]">
        <div className="w-[32px] h-[32px] border-[3px] border-brandcolor border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center py-[40px] text-gray-400 text-[14px]">
        게시글을 찾을 수 없습니다.
      </div>
    );
  }

  return (
    <div className="flex flex-col pb-[24px] px-[16px] md:px-[24px] gap-[20px]">
      <div className="min-h-[200px]">
        <DynamicViewer
          key={data.postContent}
          initialValue={data.postContent}
          theme={theme}
        />
      </div>

      {/* 추천 버튼 */}
      <div className="flex justify-center pt-[16px] border-t border-gray-100 dark:border-branddarkborder">
        <button
          className={clsx(
            "flex items-center justify-center gap-[6px] rounded-[10px] transition-all duration-200 font-semibold shadow-sm",
            isMobile
              ? "h-[36px] px-[16px] text-[12px]"
              : "h-[44px] px-[24px] text-[14px]",
            like === 0
              ? "border-2 border-gray-200 dark:border-branddarkborder text-gray-500 hover:border-brandcolor hover:text-brandcolor"
              : "bg-gradient-to-r from-brandcolor to-blue-500 text-white border-0 shadow-md"
          )}
          onClick={handleOnClick}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill={like === 1 ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={isMobile ? "w-[14px] h-[14px]" : "w-[18px] h-[18px]"}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
            />
          </svg>
          추천
        </button>
      </div>
    </div>
  );
};

export default BoardPostBodyComponent;

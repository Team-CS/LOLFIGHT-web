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
      <div className="flex justify-center items-center py-[24px] text-gray-600">
        로딩 중...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center py-[24px] text-gray-600">
        게시글을 찾을 수 없습니다.
      </div>
    );
  }

  return (
    <div className="flex flex-col pb-[24px] px-[24px] gap-[12px]">
      <DynamicViewer
        key={data.postContent}
        initialValue={data.postContent}
        theme={theme}
      />
      <div className="m-auto">
        <button
          className={clsx(
            "border rounded transition font-bold",
            isMobile
              ? "h-[30px] w-[50px] text-[12px]"
              : "h-[40px] w-[80px] text-[14px]",
            like === 0
              ? "border-gray-400 text-gray-400"
              : "border-gray-400 text-white bg-brandcolor dark:border-gray-700"
          )}
          onClick={handleOnClick}
        >
          추천
        </button>
      </div>
    </div>
  );
};

export default BoardPostBodyComponent;

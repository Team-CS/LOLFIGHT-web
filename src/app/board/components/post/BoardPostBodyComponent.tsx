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

import { useRouter } from "next/navigation";
import CustomAlert from "@/src/common/components/alert/CustomAlert";
import { useMemberStore } from "@/src/common/zustand/member.zustand";

interface BoardPostBodyComponentProps {
  data: PostDto | null | undefined;
}

const DynamicViewer = dynamic(
  () => import("@toast-ui/react-editor").then((mod) => mod.Viewer),
  { ssr: false }
);

const BoardPostBodyComponent = (props: BoardPostBodyComponentProps) => {
  const { data } = props;
  const router = useRouter();
  const { member } = useMemberStore();

  const [like, setLike] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

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
        router.refresh();
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
      <div className="w-full">
        <DynamicViewer key={data.postContent} initialValue={data.postContent} />
      </div>
      <div className="m-auto">
        {like === 0 ? (
          <button
            className="border border-gray-400 h-10 text-gray-400 rounded transition hover:bg-brandcolor hover:text-white w-20 m-1"
            onClick={handleOnClick}
          >
            추천
          </button>
        ) : (
          <button
            className="border border-gray-400 h-10 text-white rounded bg-brandcolor transition hover:bg-white hover:text-gray-400 w-20 m-1 dark:border-gray-700"
            onClick={handleOnClick}
          >
            추천
          </button>
        )}
      </div>
    </div>
  );
};

export default BoardPostBodyComponent;

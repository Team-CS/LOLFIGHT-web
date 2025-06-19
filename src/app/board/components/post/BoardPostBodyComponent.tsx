"use client";

import React, { useEffect, useRef, useState } from "react";
import { getPostContent, likePost, getLike } from "@/src/api/post.api";
import { writeComment } from "@/src/api/comment.api";
import { PostDTO } from "@/src/common/DTOs/board/post.dto";

import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor/dist/theme/toastui-editor-dark.css";
import "@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css";
import "@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css";
import "@toast-ui/editor/toastui-editor-viewer.css";

import CommentBoxComponent from "./comment/CommentBoxComponent";
import { useRouter } from "next/navigation";
import CustomAlert from "@/src/common/components/alert/CustomAlert";
import { useMemberStore } from "@/src/common/zustand/member.zustand";

interface BoardPostBodyComponentProps {
  data: PostDTO;
}

const BoardPostBodyComponent = (props: BoardPostBodyComponentProps) => {
  const router = useRouter();
  const [content, setContent] = useState<String>();
  const [commentContent, setCommentContent] = useState("");
  const [commentBoxKey, setCommentBoxKey] = useState(0); // State for key prop
  const [like, setLike] = useState(0);
  const { member } = useMemberStore();

  useEffect(() => {
    setContent(props.data?.postContent);
  }, [props.data]);

  useEffect(() => {
    if (member) {
      if (props.data) {
        getLike(props.data, member.id).then((res) => {
          if (res.data.data) {
            setLike(1);
          } else {
            setLike(0);
          }
        });
      }
    }
  }, [props.data]);

  const handleOnClick = () => {
    if (member) {
      likePost(props.data, member.id).then((res) => {
        router.refresh();
        if (like === 0) {
          setLike(1);
        } else {
          setLike(0);
        }
      });
    } else {
      CustomAlert("info", "추천", "로그인이 필요합니다");
    }
  };

  return (
    <div className="flex flex-col pb-[24px] px-[24px] gap-[12px]">
      <div className="w-full">
        <div
          dangerouslySetInnerHTML={{
            __html: props.data?.postContent,
          }}
        ></div>
      </div>
      <div className="m-auto">
        {like === 0 ? (
          <button
            className="border border-gray-400 h-10 text-gray-400 rounded transition hover:bg-brandcolor hover:text-white w-20 m-1"
            onClick={handleOnClick}
          >
            <span className="">추천</span>
          </button>
        ) : (
          <button
            className="border border-gray-400 h-10 text-white rounded bg-brandcolor transition hover:bg-white hover:text-gray-400 w-20 m-1 dark:border-gray-700"
            onClick={handleOnClick}
          >
            <span className="">추천</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default BoardPostBodyComponent;

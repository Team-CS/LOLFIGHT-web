"use client";

import React, { useEffect, useRef, useState } from "react";
import { getPostContent, likePost, getLike } from "@/src/api/post.api";
import { writeComment } from "@/src/api/comment.api";
import { PostDTO } from "@/src/common/DTOs/board/post.dto";
import { Editor } from "@toast-ui/react-editor";
import { Viewer } from "@toast-ui/react-editor";
import codeSyntaxHighlight from "@toast-ui/editor-plugin-code-syntax-highlight";
import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor/dist/theme/toastui-editor-dark.css";
import "@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css";
import "@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css";
import "@toast-ui/editor/toastui-editor-viewer.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
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

  const handleChangeComment = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommentContent(e.target.value);
  };

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

  const handleSaveCommentClick = () => {
    if (!member) {
      CustomAlert("info", "댓글", "로그인이 필요합니다");
    } else if (!commentContent || commentContent.trim() === "") {
      CustomAlert("info", "댓글", "댓글을 작성해주세요");
    } else {
      writeComment(props.data, member.id, commentContent).then((res) => {
        router.refresh();
        setCommentBoxKey((prevKey) => prevKey + 1);
        setCommentContent("");
        // window.location.reload();
      });
    }
  };

  return (
    <div className="board-post-body flex flex-col m-12">
      <div className="board-post-body__body w-full mb-12">
        <div
          dangerouslySetInnerHTML={{
            __html: props.data?.postContent,
          }}
        ></div>
      </div>
      <div className="board-post-body__status m-auto">
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
      <div className="board-post-body__comment">
        <div className="border-b w-full mt-4 dark:border-gray-700"></div>
        <div className="my-8">댓글 {props.data?.postComments}</div>
        <CommentBoxComponent
          key={commentBoxKey}
          data={props.data}
        ></CommentBoxComponent>
        <div className="w-full rounded-md px-4 border dark:border-gray-700 dark:bg-black">
          <div className="w-full h-36">
            <input
              className="w-full h-12 focus:outline-none dark:bg-black"
              placeholder="댓글을 입력하세요."
              value={commentContent}
              onChange={handleChangeComment}
            />
          </div>
          <div className="border-b w-full mt-4 dark:border-gray-700"></div>
          <div className="flex justify-end m-2">
            <button
              className="border rounded-md bg-brandcolor text-white w-20 h-8 dark:border-gray-700"
              onClick={handleSaveCommentClick}
            >
              작성하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardPostBodyComponent;

"use client";

import { PostDto } from "@/src/common/DTOs/board/post.dto";
import CommentBoxComponent from "./comment/CommentBoxComponent";
import CustomAlert from "@/src/common/components/alert/CustomAlert";
import { writeComment } from "@/src/api/comment.api";
import { useMemberStore } from "@/src/common/zustand/member.zustand";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/src/hooks/useMediaQuery";

interface BoardPostCommentComponentProps {
  data: PostDto;
}

const BoardPostCommentComponent = (props: BoardPostCommentComponentProps) => {
  const { member } = useMemberStore();
  const isMobile = useIsMobile();
  const [commentBoxKey, setCommentBoxKey] = useState(0); // State for key prop
  const [commentContent, setCommentContent] = useState("");
  const router = useRouter();

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
      });
    }
  };

  return (
    <div className="flex flex-col p-[24px] gap-[12px]">
      <div className="w-full rounded-md border dark:border-gray-700 dark:bg-black">
        <textarea
          className={`w-full p-[12px] rounded-[12px] focus:outline-none dark:bg-black ${
            isMobile ? "text-[12px] h-[50px]" : "text-[14px] h-[100px]"
          }`}
          placeholder="댓글을 입력하세요."
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
        />
        <div className="flex justify-end py-[4px] px-[8px]">
          <button
            className={`border rounded-md bg-brandcolor text-white px-[12px] py-[4px] dark:border-gray-700 ${
              isMobile ? "text-[12px]" : "text-[14px]"
            }`}
            onClick={handleSaveCommentClick}
          >
            작성하기
          </button>
        </div>
      </div>
      <CommentBoxComponent
        key={commentBoxKey}
        data={props.data}
      ></CommentBoxComponent>
    </div>
  );
};

export default BoardPostCommentComponent;

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
      writeComment(props.data, member.id, commentContent)
        .then((res) => {
          router.refresh();
          setCommentBoxKey((prevKey) => prevKey + 1);
          setCommentContent("");
        })
        .catch((error) => {
          const code = error.response.data.code;
          if (code === "COMMON-018") {
            CustomAlert("error", "댓글", "부적절한 단어가 포함되어 있습니다.");
          }
        });
    }
  };

  return (
    <div className="flex flex-col px-[16px] md:px-[24px] py-[16px] gap-[16px]">
      {/* 댓글 헤더 */}
      <div className="flex items-center gap-[10px]">
        <div className="w-[4px] h-[20px] bg-gradient-to-b from-brandcolor to-blue-400 rounded-full" />
        <h3 className={`font-bold ${isMobile ? "text-[14px]" : "text-[16px]"}`}>
          댓글
        </h3>
      </div>

      {/* 댓글 입력창 */}
      <div className="w-full rounded-[12px] border border-gray-200 dark:border-branddarkborder bg-gray-50 dark:bg-branddark overflow-hidden">
        <textarea
          className={`w-full p-[14px] bg-transparent focus:outline-none resize-none placeholder:text-gray-400 ${
            isMobile ? "text-[12px] h-[60px]" : "text-[14px] h-[100px]"
          }`}
          placeholder="댓글을 입력하세요."
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
        />
        <div className="flex justify-end py-[10px] px-[12px] border-t border-gray-200 dark:border-branddarkborder">
          <button
            className={`bg-gradient-to-r from-brandcolor to-blue-500 text-white rounded-[8px] font-medium hover:opacity-90 transition-opacity shadow-sm ${
              isMobile ? "text-[12px] px-[14px] py-[6px]" : "text-[14px] px-[16px] py-[8px]"
            }`}
            onClick={handleSaveCommentClick}
          >
            작성하기
          </button>
        </div>
      </div>

      {/* 댓글 목록 */}
      <CommentBoxComponent
        key={commentBoxKey}
        data={props.data}
      />
    </div>
  );
};

export default BoardPostCommentComponent;

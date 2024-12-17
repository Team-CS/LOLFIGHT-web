import { PostDTO } from "@/src/common/DTOs/board/post.dto";
import { SetStateAction, useEffect, useState } from "react";
import { getCommentList } from "@/src/api/comment.api";
import { CommentDTO } from "@/src/common/DTOs/board/comment.dto";
import { writeReplyComment } from "@/src/api/comment.api";
import CustomAlert from "@/src/common/components/alert/CustomAlert";
import constant from "@/src/common/constant/constant";
import Image from "next/image";
import { useMember } from "@/src/common/zustand/member.zustand";
import { findMemberByName } from "@/src/api/member.api";

interface CommentBoxComponentProps {
  data: PostDTO;
}

const CommentBoxComponent = (props: CommentBoxComponentProps) => {
  const [commentList, setCommentList] = useState<CommentDTO[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [openCommentId, setOpenCommentId] = useState<string>("");
  const [replyCommentContent, setReplyCommentContent] = useState("");
  const [refresh, setRefresh] = useState(1);
  // const [commentBoxKey, setCommentBoxKey] = useState(0);
  const [isImageError, setIsImageError] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (props.data && props.data.id) {
      getCommentList(props.data).then((res) => {
        setCommentList(res.data.data);
      });
    }
  }, [props.data, refresh]);

  const handleChangeReplyComment = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReplyCommentContent(e.target.value);
  };

  const handleReplyButtonClick = (comment: CommentDTO) => {
    setIsOpen(!isOpen); // isOpen 상태를 토글합니다.
    setOpenCommentId(comment.id as string);
  };

  const handleSaveReplyButtonClick = () => {
    const storedId = sessionStorage.getItem("id")?.toString();
    if (!storedId) {
      CustomAlert("info", "답글", "로그인이 필요합니다.");
    } else if (!replyCommentContent || replyCommentContent.trim() === "") {
      CustomAlert("info", "답글", "답글을 작성해주세요");
    } else {
      writeReplyComment(
        props.data,
        storedId,
        replyCommentContent,
        openCommentId
      ).then((res) => {
        // router.refresh();
        setRefresh((prev) => prev + 1);
        setIsOpen(false);
        setOpenCommentId("");
        setReplyCommentContent("");
        // setCommentBoxKey((prevKey) => prevKey + 1);
      });
    }
  };

  const getDate = (date: string | number | Date) => {
    const today = new Date();
    const commentDateTime = new Date(date);

    const diffMilliseconds = today.getTime() - commentDateTime.getTime();
    const diffSeconds = Math.floor(diffMilliseconds / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths =
      today.getMonth() -
      commentDateTime.getMonth() +
      12 * (today.getFullYear() - commentDateTime.getFullYear());

    if (
      commentDateTime.getDate() === today.getDate() &&
      commentDateTime.getMonth() === today.getMonth() &&
      commentDateTime.getFullYear() === today.getFullYear()
    ) {
      if (diffMinutes < 60) {
        return `${diffMinutes}분 전`;
      } else if (diffHours < 24) {
        return `${diffHours}시간 전`;
      }
    } else if (diffDays < 7) {
      return `${diffDays}일 전`;
    } else if (diffWeeks < 4) {
      return `${diffWeeks}주 전`;
    } else {
      return `${diffMonths}달 전`;
    }
  };

  const getMargin = (depth: number) => {
    return {
      marginLeft: `${depth * 2}rem`,
    };
  };

  const handleImageError = (id: string) => {
    setIsImageError((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="comment_box">
      {commentList.map((comment) => (
        <div
          className="my-4 p-2 flex border-b dark:border-gray-700"
          key={comment.id}
          style={getMargin(comment.depth)}
        >
          {comment.depth > 0 && (
            <div className="border-b-2 border-l-2 border-brandcolor w-2 h-2 mr-4 dark:border-white" />
          )}
          <div className="w-full">
            <div className="flex items-center mb-1">
              <div className="w-[30px] h-[30px] mr-[5px] my-auto">
                <Image
                  className="w-full h-full rounded-full"
                  width={35}
                  height={35}
                  src={
                    isImageError[comment.id as string] // 타입 단언을 사용하여 오류 방지
                      ? `${constant.SERVER_URL}/public/default.png`
                      : `${constant.SERVER_URL}/public/member/${comment.writer}.png`
                  }
                  alt="memberIcon"
                  onError={(event) => {
                    event.preventDefault();
                    handleImageError(comment.id as string);
                  }}
                  unoptimized
                />
              </div>
              <span className="font-bold">{comment.writer}</span>
              <span className="text-gray-400 pl-3 font-normal text-xs">
                {getDate(comment.commentDate)}
              </span>
            </div>
            <span className="font-normal text-base">
              {comment.commentContent}
            </span>
            {comment.depth == 0 && (
              <div className="my-1">
                <button onClick={() => handleReplyButtonClick(comment)}>
                  <span className="text-gray-400 py-1 hover:bg-gray-100 dark:hover:bg-gray-700">
                    답글 쓰기
                  </span>
                </button>
              </div>
            )}

            {isOpen && comment.id == openCommentId && (
              <div className="my-4 p-2">
                <div className="rounded-md ml-8 px-4 border dark:border-gray-700 dark:bg-black">
                  <div className=" h-36">
                    <input
                      className="w-full h-12 focus:outline-none dark:bg-black"
                      placeholder="댓글을 입력하세요."
                      onChange={handleChangeReplyComment}
                    />
                  </div>
                  <div className="border-b w-full mt-4 dark:border-gray-700"></div>
                  <div className="flex justify-end m-2 dark:border-gray-700">
                    <button
                      className="border rounded-md bg-brandcolor text-white w-20 h-8 dark:border-gray-700"
                      onClick={handleSaveReplyButtonClick}
                    >
                      작성하기
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentBoxComponent;

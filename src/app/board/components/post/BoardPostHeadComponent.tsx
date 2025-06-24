import { deletePost } from "@/src/api/post.api";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { PostDto } from "@/src/common/DTOs/board/post.dto";
import { useRouter } from "next/navigation";
import ButtonAlert from "../../../../common/components/alert/ButtonAlert";
import CustomAlert from "../../../../common/components/alert/CustomAlert";
import constant from "@/src/common/constant/constant";
import { findMember } from "@/src/api/member.api";
import { useMemberStore } from "@/src/common/zustand/member.zustand";

interface BoardPostHeadComponentProps {
  post: PostDto;
}

const BoardPostHeadComponent = (props: BoardPostHeadComponentProps) => {
  const [isMine, setIsMine] = useState(false);
  const [isImageError, setIsImageError] = useState<Record<string, boolean>>({});
  const { member } = useMemberStore();
  const router = useRouter();
  const postDateTime = new Date(props.post?.postDate);
  const year = postDateTime.getFullYear();
  const month = (postDateTime.getMonth() + 1).toString().padStart(2, "0");
  const day = postDateTime.getDate().toString().padStart(2, "0");

  useEffect(() => {
    if (member?.memberName) {
      if (props.post?.postWriter === member.memberName) {
        setIsMine(true);
      }
    }
  }, [props.post]);

  const handleDeleteButtonClick = () => {
    const onConfirmDelete = () => {
      deletePost(props.post).then((res) => {
        CustomAlert("success", "게시글 삭제", "게시글을 삭제했습니다.");
      });
      router.push("/board/free");
    };

    ButtonAlert(
      "게시글 삭제",
      "게시글을 삭제하시겠습니까?",
      "삭제",
      onConfirmDelete
    );
  };

  const handleImageError = () => {
    setIsImageError((prev) => ({ ...prev, [props.post?.postWriter]: true }));
  };

  return (
    <div className="flex flex-col p-[24px] gap-[12px]">
      <p className="text-[24px] font-bold">{props.post?.postTitle}</p>
      <div className="flex justify-between pb-[12px] border-b dark:border-gray-700">
        <div className="flex items-center gap-[8px]">
          <img
            className="w-[30px] h-[30px] rounded-[12px]"
            src={
              isImageError[props.post?.postWriter] // 작성자 이름으로 이미지 오류 체크
                ? `${constant.SERVER_URL}/public/default.png`
                : `${constant.SERVER_URL}/public/member/${props.post?.postWriter}.png`
            }
            alt="memberIcon"
            onError={handleImageError} // 오류 발생 시 핸들러 호출
          />
          <p className="text-[16px] font-bold dark:text-gray-100">
            {props.post?.postWriter}
          </p>
          <p className="text-[12px] text-gray-400">{`${year}.${month}.${day}`}</p>
          <p className="text-[12px] text-gray-400">
            조회수 : {props.post?.postViews}
          </p>
        </div>
        {isMine && (
          <div className="head_btn content-center">
            <button
              className="text-[14px] text-gray-400"
              onClick={handleDeleteButtonClick}
            >
              삭제
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BoardPostHeadComponent;

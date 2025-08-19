import { deletePost } from "@/src/api/post.api";
import React, { useEffect, useState } from "react";
import { PostDto } from "@/src/common/DTOs/board/post.dto";
import { useRouter } from "next/navigation";
import ButtonAlert from "../../../../common/components/alert/ButtonAlert";
import CustomAlert from "../../../../common/components/alert/CustomAlert";
import constant from "@/src/common/constant/constant";
import { useMemberStore } from "@/src/common/zustand/member.zustand";

interface BoardPostHeadComponentProps {
  post: PostDto;
}

const BoardPostHeadComponent = (props: BoardPostHeadComponentProps) => {
  const { post } = props;

  const { member } = useMemberStore();
  const router = useRouter();
  const postDateTime = new Date(post?.postDate);
  const year = postDateTime.getFullYear();
  const month = (postDateTime.getMonth() + 1).toString().padStart(2, "0");
  const day = postDateTime.getDate().toString().padStart(2, "0");

  const handleDeleteButtonClick = () => {
    const onConfirmDelete = () => {
      deletePost(post).then((res) => {
        CustomAlert("success", "게시글 삭제", "게시글을 삭제했습니다.");
      });
      router.push("/board/free");
    };

    ButtonAlert(
      "게시글 삭제",
      "게시글을 삭제하시겠습니까?",
      "삭제",
      "닫기",
      onConfirmDelete
    );
  };

  const isMine = post?.postWriter.memberName === member?.memberName;

  return (
    <div className="flex flex-col p-[24px] gap-[12px]">
      <p className="text-[24px] font-bold">{post?.postTitle}</p>
      <div className="flex justify-between pb-[12px] border-b dark:border-gray-700">
        <div className="flex items-center gap-[8px]">
          <img
            className="w-[30px] h-[30px] object-cover rounded-[12px]"
            src={`${constant.SERVER_URL}/${
              post?.postWriter.memberIcon || "public/default.png"
            }`}
            alt="memberIcon"
          />
          <p className="text-[16px] font-bold dark:text-gray-100">
            {post?.postWriter.memberName}
          </p>
          <p className="text-[12px] text-gray-400">{`${year}.${month}.${day}`}</p>
          <p className="text-[12px] text-gray-400">
            조회수 : {post?.postViews}
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

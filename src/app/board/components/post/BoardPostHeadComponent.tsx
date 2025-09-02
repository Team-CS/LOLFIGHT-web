import { deletePost } from "@/src/api/post.api";
import React, { useEffect, useState } from "react";
import { PostDto } from "@/src/common/DTOs/board/post.dto";
import { useRouter } from "next/navigation";
import ButtonAlert from "../../../../common/components/alert/ButtonAlert";
import CustomAlert from "../../../../common/components/alert/CustomAlert";
import constant from "@/src/common/constant/constant";
import { useMemberStore } from "@/src/common/zustand/member.zustand";
import { useIsMobile } from "@/src/hooks/useMediaQuery";
import { getCookie } from "@/src/utils/cookie/cookie";
import { jwtDecode } from "jwt-decode";

interface BoardPostHeadComponentProps {
  post: PostDto;
}

const BoardPostHeadComponent = (props: BoardPostHeadComponentProps) => {
  const { post } = props;
  const { member } = useMemberStore();
  const router = useRouter();
  const isMobile = useIsMobile();
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
  const token = getCookie("lf_atk");
  const isAdmin = token ? (jwtDecode(token) as any)?.role === "ADMIN" : false;

  return (
    <div className="flex flex-col p-[24px] gap-[12px]">
      <p className={`font-bold ${isMobile ? "text-[20px]" : "text-[24px]"}`}>
        {post?.postTitle}
      </p>
      <div className="flex justify-between pb-[12px] border-b dark:border-gray-700">
        <div className="flex items-center gap-[8px]">
          <img
            className={`object-cover rounded-[12px] ${
              isMobile ? "w-[25px] h-[25px]" : "w-[30px] h-[30px]"
            }`}
            src={`${constant.SERVER_URL}/${
              post?.postWriter.memberIcon || "public/default.png"
            }`}
            alt="memberIcon"
          />
          <p
            className={`font-bold dark:text-gray-100 ${
              isMobile ? "text-[14px]" : "text-[16px]"
            }`}
          >
            {post?.postWriter.memberName}
          </p>
          <p
            className={`text-gray-400 ${
              isMobile ? "text-[10px]" : "text-[12px]"
            }`}
          >{`${year}.${month}.${day}`}</p>
          <p
            className={`text-gray-400 ${
              isMobile ? "text-[10px]" : "text-[12px]"
            }`}
          >
            조회수 : {post?.postViews}
          </p>
        </div>
        {(isMine || isAdmin) && (
          <div className="head_btn content-center">
            <button
              className={`text-gray-400 ${
                isMobile ? "text-[10px]" : "text-[12px]"
              }`}
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

"use client";

import { deletePost } from "@/src/api/post.api";
import React, { useState } from "react";
import { PostDto } from "@/src/common/DTOs/board/post.dto";
import { useRouter } from "next/navigation";
import ButtonAlert from "../../../../common/components/alert/ButtonAlert";
import CustomAlert from "../../../../common/components/alert/CustomAlert";
import constant from "@/src/common/constant/constant";
import { useMemberStore } from "@/src/common/zustand/member.zustand";
import { useIsMobile } from "@/src/hooks/useMediaQuery";
import { getCookie } from "@/src/utils/cookie/cookie";
import { jwtDecode } from "jwt-decode";
import { ReportModal } from "@/src/common/components/modal/ReportModal";
import { convertBoardNameToCode } from "@/src/utils/string/string.util";
import { CreateReportDto } from "@/src/common/DTOs/report/report.dto";
import { reportSubmit } from "@/src/api/report.api";
import "@/src/css/index.ts";
import Image from "next/image";

interface BoardPostHeadComponentProps {
  post: PostDto;
}

const BoardPostHeadComponent = (props: BoardPostHeadComponentProps) => {
  const { post } = props;
  const { member } = useMemberStore();
  const router = useRouter();
  const isMobile = useIsMobile();
  const [reportModalOpen, setReportModalOpen] = useState<boolean>(false);

  const postDateTime = new Date(post?.postDate);
  const year = postDateTime.getFullYear();
  const month = (postDateTime.getMonth() + 1).toString().padStart(2, "0");
  const day = postDateTime.getDate().toString().padStart(2, "0");

  const isMine = post?.postWriter.memberName === member?.memberName;
  const token = getCookie("lf_atk");
  const isAdmin = token ? (jwtDecode(token) as any)?.role === "ADMIN" : false;
  const isAdminWriter = post?.postWriter.role === "ADMIN";

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

  const handleReport = (reason: string) => {
    if (!member) {
      alert("로그인이 필요합니다");
      setReportModalOpen(false);
      return;
    }
    setReportModalOpen(false);
    const reportDto: CreateReportDto = {
      type: "post",
      targetId: post.id.toString(),
      board: post.postBoard,
      targetMemberId: post.postWriter.id,
      reporterId: member.id,
      reason: reason,
    };
    reportSubmit(reportDto).then((response) => {
      if (response.data.data) {
        CustomAlert(
          "success",
          "신고",
          "신고가 완료되었습니다. \n 빠른 검토 후 조치 취하도록 하겠습니다. \n 감사합니다."
        );
      } else {
        CustomAlert("error", "신고", "에러");
      }
    });
  };

  const handleEditClick = () => {
    router.push(
      `/board/${convertBoardNameToCode(post.postBoard)}/${post.id}/edit`
    );
  };

  const handleMemberClick = (name: string) => {
    router.push(`/members/${name}`);
  };

  return (
    <div className="flex flex-col p-[24px] gap-[12px]">
      <p className={`font-bold ${isMobile ? "text-[20px]" : "text-[24px]"}`}>
        {post?.postTitle}
      </p>

      <div className="flex justify-between pb-[12px] border-b dark:border-gray-700">
        <div className="flex items-center gap-[8px]">
          <div
            className="flex items-center gap-[8px] cursor-pointer hover:underline"
            onClick={() => handleMemberClick(post.postWriter.memberName)}
          >
            <div className={`${post?.postWriter?.memberItem?.border}`}>
              <Image
                src={`${constant.SERVER_URL}/${
                  post?.postWriter.memberIcon || "public/default.png"
                }`}
                alt="memberIcon"
                width={30}
                height={30}
                className={`object-cover rounded-[12px] ${
                  isMobile ? "w-[25px] h-[25px]" : "w-[30px] h-[30px]"
                }`}
              />
            </div>
            <div className="flex gap-[4px]">
              <p
                className={`font-bold ${
                  isMobile ? "text-[14px]" : "text-[16px]"
                } ${post?.postWriter?.memberItem?.effect} `}
              >
                {post?.postWriter.memberName}
              </p>
              {isAdminWriter && (
                <Image
                  src="/icon_verificated.svg"
                  alt="verificated icon"
                  width={15}
                  height={15}
                  draggable={false}
                />
              )}
            </div>
          </div>
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
          {post?.isEdited && (
            <span
              className={`px-2 py-0.5 rounded-full bg-gray-200 text-gray-600 
      dark:bg-gray-700 dark:text-gray-300 
      ${isMobile ? "text-[10px]" : "text-[12px]"}`}
            >
              수정됨
            </span>
          )}
        </div>
        <div className="flex gap-[8px] content-center">
          {(!isMine || isAdmin) && (
            <button
              className={`text-gray-400 ${
                isMobile ? "text-[10px]" : "text-[12px]"
              }`}
              onClick={() => setReportModalOpen(!reportModalOpen)}
            >
              신고하기
            </button>
          )}
          {(isMine || isAdmin) && (
            <button
              className={`text-gray-400 ${
                isMobile ? "text-[10px]" : "text-[12px]"
              }`}
              onClick={handleEditClick}
            >
              편집
            </button>
          )}
          {(isMine || isAdmin) && (
            <button
              className={`text-gray-400 ${
                isMobile ? "text-[10px]" : "text-[12px]"
              }`}
              onClick={handleDeleteButtonClick}
            >
              삭제
            </button>
          )}
        </div>
      </div>
      {reportModalOpen && (
        <ReportModal
          onClose={() => setReportModalOpen(false)}
          onSubmit={handleReport}
        />
      )}
    </div>
  );
};

export default BoardPostHeadComponent;

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
      onConfirmDelete,
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
          "신고가 완료되었습니다. \n 빠른 검토 후 조치 취하도록 하겠습니다. \n 감사합니다.",
        );
      } else {
        CustomAlert("error", "신고", "에러");
      }
    });
  };

  const handleEditClick = () => {
    router.push(
      `/board/${convertBoardNameToCode(post.postBoard)}/${post.id}/edit`,
    );
  };

  const handleMemberClick = (name: string) => {
    router.push(`/members/${name}`);
  };

  return (
    <div className="flex flex-col px-[16px] md:px-[24px] py-[16px] gap-[14px]">
      {/* 제목 */}
      <div className="flex items-center gap-[10px]">
        <div className="w-[4px] h-[26px] bg-gradient-to-b from-brandcolor to-blue-400 rounded-full" />
        <p className={`font-bold ${isMobile ? "text-[18px]" : "text-[24px]"}`}>
          {post?.postTitle}
        </p>
      </div>

      {/* 작성자 정보 및 액션 버튼 */}
      <div
        className={`flex pb-[14px] border-b border-gray-100 dark:border-branddarkborder ${
          isMobile ? "flex-col gap-[10px]" : "justify-between items-center"
        }`}
      >
        <div className={`flex items-center gap-[4px]`}>
          <div className="flex items-center gap-[4px]">
            <div
              className="flex items-center gap-[8px] cursor-pointer group"
              onClick={() => handleMemberClick(post.postWriter.memberName)}
            >
              <div className={`${post?.postWriter?.memberItem?.border}`}>
                <Image
                  src={`${constant.SERVER_URL}/${
                    post?.postWriter.memberIcon || "public/default.png"
                  }`}
                  alt="memberIcon"
                  width={32}
                  height={32}
                  className={`object-cover rounded-[10px] shadow-sm ${
                    isMobile ? "w-[28px] h-[28px]" : "w-[32px] h-[32px]"
                  }`}
                />
              </div>
              <p
                className={`font-semibold group-hover:text-brandcolor transition-colors ${
                  isMobile ? "text-[13px]" : "text-[15px]"
                } ${post?.postWriter?.memberItem?.effect}`}
              >
                {post?.postWriter.memberName}
              </p>
              {isAdminWriter && (
                <Image
                  src="/icon_verificated.svg"
                  alt="verificated icon"
                  width={14}
                  height={14}
                  draggable={false}
                />
              )}
            </div>

            <span className="text-gray-300 dark:text-gray-600">|</span>
            <p className="text-gray-400 text-[11px]">{`${year}.${month}.${day}`}</p>
          </div>

          <div className="flex items-center gap-[4px]">
            <div
              className={`flex items-center gap-[4px] px-[8px] py-[2px] rounded-full bg-gray-100 dark:bg-branddark ${isMobile ? "text-[10px]" : "text-[11px]"}`}
            >
              <span className="text-gray-500 dark:text-gray-400">조회</span>
              <span className="font-medium text-gray-600 dark:text-gray-300">
                {post?.postViews}
              </span>
            </div>

            {post?.isEdited && (
              <span
                className={`px-[8px] py-[2px] rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 ${isMobile ? "text-[10px]" : "text-[11px]"}`}
              >
                수정됨
              </span>
            )}
          </div>
        </div>

        <div
          className={`flex items-center ${isMobile ? "justify-end gap-[16px]" : "gap-[12px]"}`}
        >
          {(!isMine || isAdmin) && (
            <button
              className={`text-gray-400 hover:text-red-500 transition-colors ${
                isMobile ? "text-[11px]" : "text-[13px]"
              }`}
              onClick={() => setReportModalOpen(!reportModalOpen)}
            >
              신고하기
            </button>
          )}
          {(isMine || isAdmin) && (
            <button
              className={`text-gray-400 hover:text-brandcolor transition-colors ${
                isMobile ? "text-[11px]" : "text-[13px]"
              }`}
              onClick={handleEditClick}
            >
              편집
            </button>
          )}
          {(isMine || isAdmin) && (
            <button
              className={`text-gray-400 hover:text-red-500 transition-colors ${
                isMobile ? "text-[11px]" : "text-[13px]"
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

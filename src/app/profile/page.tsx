"use client";
import React, { useEffect, useState } from "react";
import ProfileInfoPage from "../profile/components/ProfileInfoPage";
import { MemberDTO } from "@/src/common/DTOs/member/member.dto";
import { findMember, getMemberData } from "@/src/api/member.api";
import ChangePasswordPage from "./components/ChangePasswordPage";
import WithdrawalPage from "./components/WithdrawalPage";
import { useRouter } from "next/navigation";
import CustomAlert from "../../common/components/alert/CustomAlert";
import GuildManagePage from "./components/GuildManagePage";
import { useMemberStore } from "@/src/common/zustand/member.zustand";

export default function Page() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState("profile"); // 초기 페이지: 프로필 페이지
  const { member, setMember } = useMemberStore();

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!member) {
        router.push("/");
        CustomAlert("warning", "프로필", "로그인후 이용하실 수 있습니다.");
      } else {
        getMemberData().then((response) => {
          const memberData: MemberDTO = response.data.data;
          setMember(memberData);
        });
      }
    }
  }, []);

  const changePage = (page: string) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div className="w-full mx-auto h-full gap-5 rounded">
        <div className="w-1200px h-16 flex flex-row items-center mx-auto">
          {/* 각 페이지로 이동하는 버튼들 */}
          <button
            onClick={() => changePage("profile")}
            className="w-full h-full hover:bg-gray-100 dark:hover:bg-dark"
          >
            내 정보
          </button>
          <button
            onClick={() => changePage("password")}
            className="w-full h-full hover:bg-gray-100 dark:hover:bg-dark"
          >
            비밀번호 변경
          </button>
          <button
            onClick={() => changePage("guild")}
            className="w-full h-full hover:bg-gray-100 dark:hover:bg-dark"
          >
            길드
          </button>
          <button
            onClick={() => changePage("withdrawal")}
            className="w-full h-full hover:bg-gray-100 dark:hover:bg-dark"
          >
            회원탈퇴
          </button>

          {/* <button onClick={() => changePage("customerService")}>고객센터</button>
          <button onClick={() => changePage("announcement")}>공지사항</button> */}
        </div>
        {/* <div className="w-full h-48 bg-black text-white">여기 커버 사진</div> */}
        {member ? (
          <div className="w-full h-full rounded bg-white dark:bg-dark">
            {currentPage === "profile" && <ProfileInfoPage />}
            {currentPage === "password" && <ChangePasswordPage />}
            {currentPage === "withdrawal" && <WithdrawalPage />}
            {currentPage === "guild" && <GuildManagePage />}
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
}

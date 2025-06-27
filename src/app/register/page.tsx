"use client";
import { findMember, getMemberData } from "@/src/api/member.api";
import Link from "@/src/common/components/Link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import CustomAlert from "../../common/components/alert/CustomAlert";
import { authLogin } from "@/src/api/auth.api";
import { useMemberStore } from "@/src/common/zustand/member.zustand";

export default function Page() {
  const router = useRouter();
  const [memberId, setMemberId] = useState("");
  const [memberPw, setMemberPw] = useState("");
  const { member, setMember } = useMemberStore();
  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMemberId(e.target.value);
  };

  const handlePwChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMemberPw(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleLoginClick();
    }
  };

  const handleLoginClick = () => {
    authLogin(memberId, memberPw)
      .then((response) => {
        if (response.data.ok) {
          window.location.href = response.data.redirectUrl;
        }
      })
      .catch((error) => {
        CustomAlert("warning", "로그인", "아이디 비밀번호를 확인해주세요.");
        console.log(error);
      });
  };

  return (
    <div className="">
      <span className="text-32px mb-4">
        무자비하게 <p />
        우리와 함께하세요
      </span>
      <div className="w-full">
        <div className="border border-gray-200 rounded-md my-4 dark:border-gray-700">
          <input
            className="w-full h-12 rounded-md px-2 bg-gray-100 dark:bg-gray-900"
            type="text"
            placeholder="이메일"
            onChange={handleIdChange}
          />
        </div>
        <div className="border border-gray-200 rounded-md my-4 dark:border-gray-700">
          <input
            className="w-full h-12 rounded-md px-2 bg-gray-100 dark:bg-gray-900"
            type="password"
            placeholder="비밀번호"
            onChange={handlePwChange}
            onKeyDown={handleKeyPress}
          />
        </div>
        <div className="border-b w-full dark:border-gray-700"></div>
        <button
          className="flex font-medium bg-brandcolor text-white h-10 items-center justify-center rounded-md cursor-pointer my-4 w-full my-1"
          onClick={handleLoginClick}
        >
          이메일로 로그인
        </button>
      </div>
      <div className="flex justify-center mt-4">
        <span className="text-xs text-gray-700 font-bold mx-2 dark:text-white">
          <Link key={"회원가입"} href="/register/signup">
            <span className="">회원가입</span>
          </Link>
        </span>
        <span className="h-4 w-1px mx-1 bg-gray-700"></span>
        <span className="text-xs text-gray-700 font-bold mx-2 dark:text-white">
          <Link key={"비밀번호 찾기"} href="/register/find">
            비밀번호 찾기
          </Link>
        </span>
      </div>
    </div>
  );
}

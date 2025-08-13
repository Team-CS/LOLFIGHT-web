"use client";
import React, { useState } from "react";
import constant from "@/src/common/constant/constant";

export default function Page() {
  const googleLogin = () => {
    window.open(`${constant.SERVER_URL}/auth/google`, "_self");
  };

  return (
    <div className="flex flex-col gap-[24px]">
      <span className="text-32px">
        무자비하게 <p />
        우리와 함께하세요
      </span>
      <div className="flex flex-col gap-[12px] w-full">
        <div className="border-b w-full dark:border-gray-700"></div>
        <button
          className="flex items-center justify-center gap-[12px] w-full bg-white border border-brandborder text-[20px] font-bold py-[8px] rounded border border-brandborder hover:bg-brandhover"
          onClick={googleLogin}
        >
          <img
            src={`${constant.SERVER_URL}/public/Google_Original.png`}
            alt="google-image"
            width={25}
            height={25}
          />
          <p className="text-[16px] font-normal">구글 로그인</p>
        </button>
      </div>
    </div>
  );
}

"use client";
import React from "react";
import { motion } from "framer-motion";
import constant from "@/src/common/constant/constant";
import localFont from "next/font/local";
import { useRouter } from "next/navigation";

const rixi = localFont({
  src: "../../fonts/RixInooAriDuriRegular.ttf",
  display: "swap",
  variable: "--font-rixi",
});

export default function Page() {
  const router = useRouter();
  const googleLogin = () => {
    window.open(`${constant.SERVER_URL}/auth/google`, "_self");
  };

  const naverLogin = () => {
    window.open(`${constant.SERVER_URL}/auth/naver`, "_self");
  };

  const kakaoLogin = () => {
    window.open(`${constant.SERVER_URL}/auth/kakao`, "_self");
  };

  const buttonBaseClass = `
    flex items-center justify-center gap-[12px] w-full
    text-[16px] font-medium p-[12px] rounded-xl
    transition-colors duration-200 shadow-sm
  `;

  return (
    <div className="flex flex-col items-center gap-[20px] w-full">
      {/* 로고 */}
      <motion.img
        src="/LOLFIGHT_NONE_TEXT.png"
        className="w-[100px] h-[100px] drop-shadow-lg cursor-pointer"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        onClick={() => router.replace("/")}
      />

      {/* 타이틀 */}
      <div className="flex flex-col items-center gap-[4px]">
        <motion.p
          className={`text-[32px] font-thin ${rixi.className} tracking-[1px]`}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          LOLFIGHT
        </motion.p>
        <span className="text-[12px] text-gray-500 dark:text-gray-400 font-normal tracking-[0.5px]">
          저희와 함께하며, 스크림을 통해 실력을 검증해 보세요.
        </span>
      </div>

      {/* 구분선 */}
      <div className="border-b border-brandborder dark:border-branddarkborder w-full pb-[12px]"></div>

      {/* 구글 로그인 버튼 */}
      <motion.button
        onClick={googleLogin}
        className={`${buttonBaseClass} bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <img
          src={`${constant.SERVER_URL}/public/Google_Original.png`}
          alt="google-login"
          width={24}
          height={24}
        />
        <span>Google 계정으로 로그인</span>
      </motion.button>

      {/* 네이버 로그인 버튼 */}
      <motion.button
        onClick={naverLogin}
        className={`${buttonBaseClass} bg-[#03C75A] border border-[#03C75A] text-white hover:bg-[#02B051]`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <img
          src={`${constant.SERVER_URL}/public/Naver_Original.png`}
          alt="naver-login"
          width={24}
          height={24}
        />
        <span>Naver 계정으로 로그인</span>
      </motion.button>

      {/* 카카오 로그인 버튼 */}
      <motion.button
        onClick={kakaoLogin}
        className={`${buttonBaseClass} bg-[#FEE500] border border-[#FEE500] text-black hover:bg-[#FFD700]`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <img
          src={`${constant.SERVER_URL}/public/Kakao_Original.png`}
          alt="kakao-login"
          width={28}
          height={28}
        />
        <span>Kakao 계정으로 로그인</span>
      </motion.button>

      {/* 푸터 텍스트 */}

      <motion.p
        className="text-sm text-gray-600 dark:text-gray-300 text-center leading-relaxed pt-[12px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        계속 진행하면{" "}
        <span
          className="font-semibold text-brandcolor cursor-pointer"
          onClick={() => router.push("/policies/agreement")}
        >
          서비스 이용약관
        </span>{" "}
        및{" "}
        <span
          className="font-semibold text-brandcolor cursor-pointer"
          onClick={() => router.push("/policies/privacy")}
        >
          개인정보 처리방침
        </span>
        에 동의하게 됩니다.
      </motion.p>
    </div>
  );
}

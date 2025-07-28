"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMemberStore } from "@/src/common/zustand/member.zustand";
import { getMemberData } from "@/src/api/member.api";

export default function LoginCallbackPage() {
  const router = useRouter();
  const { setMember } = useMemberStore();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getMemberData();
        setMember(response.data.data);
        router.push("/"); // 또는 원하는 경로로
      } catch (error) {
        console.error("유저 정보 불러오기 실패:", error);
        router.push("/register"); // 실패 시 로그인으로 다시 보내기
      }
    };

    fetchUser();
  }, [router, setMember]);

  return (
    <div className="flex justify-center items-center ">
      <p>로그인 처리 중입니다...</p>
    </div>
  );
}

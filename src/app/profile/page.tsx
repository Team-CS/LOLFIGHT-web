"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMemberData } from "@/src/api/member.api";
import { useMemberStore } from "@/src/common/zustand/member.zustand";
import CustomAlert from "../../common/components/alert/CustomAlert";
import { MemberDto } from "@/src/common/DTOs/member/member.dto";

import ProfileInfoPage from "../profile/components/ProfileInfoPage";
import WithdrawalPage from "./components/WithdrawalPage";
import GuildManagePage from "./components/GuildManagePage";
import { ProfileHeader } from "./components/profileHeader";
import { useIsMobile } from "@/src/hooks/useMediaQuery";

type ProfileSection = "profile" | "guild" | "withdrawal";

export default function Page() {
  const router = useRouter();
  const { member, setMember } = useMemberStore();
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<ProfileSection>("profile");

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const response = await getMemberData();
        const memberData: MemberDto = response.data.data;
        setMember(memberData);
      } catch (error) {
        console.error(error);
        CustomAlert("warning", "프로필", "로그인 후 이용하실 수 있습니다.");
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMember();
  }, [setMember, router]);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "profile":
        return <ProfileInfoPage />;
      case "guild":
        return <GuildManagePage />;
      case "withdrawal":
        return <WithdrawalPage />;
      default:
        return null;
    }
  };

  if (isLoading) return <div className="text-center mt-[40px]">로딩 중...</div>;

  return (
    <div className="flex flex-col items-center p-[16px] gap-[28px]">
      <div className="grid grid-cols-3 w-full max-w-[1200px] mx-auto gap-[16px]">
        <ProfileHeader
          title="내정보"
          onClick={() => setCurrentPage("profile")}
        />
        <ProfileHeader title="길드" onClick={() => setCurrentPage("guild")} />
        <ProfileHeader
          title="회원탈퇴"
          onClick={() => setCurrentPage("withdrawal")}
        />
      </div>

      {member && (
        <div className="w-full max-w-[1200px] mx-auto rounded-[12px] shadow-md dark:bg-dark">
          {renderCurrentPage()}
        </div>
      )}
    </div>
  );
}

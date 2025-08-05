"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Navigation from "./Navigation";
import ThemeToggler from "../components/Desktop/ThemeToggler";
import Search from "./Search";
import constant from "@/src/common/constant/constant";
import { PostDto } from "../DTOs/board/post.dto";
import { getRecentPostList } from "@/src/api/post.api";
import { useMemberStore } from "../zustand/member.zustand";
import { removeCookie } from "@/src/utils/cookie/cookie";
import BoardSection from "./header/boardSection";
import localFont from "next/font/local";
import CustomAlert from "./alert/CustomAlert";
import { CiBellOn } from "react-icons/ci";
import { useGuildTeamStore } from "../zustand/guild_team.zustand";
import { useFirebaseStore } from "../zustand/firebase.zustand";
const rixi = localFont({
  src: "../../fonts/RixInooAriDuriRegular.ttf",
  display: "swap",
  variable: "--font-rixi",
});

export const Header = () => {
  const router = useRouter();
  const pathname = usePathname();

  const { member, setMember } = useMemberStore();

  const [noticePostList, setNoticePostList] = useState<PostDto[]>([]);
  const [eventPostList, setEventPostList] = useState<PostDto[]>([]);
  const [freePostList, setFreePostList] = useState<PostDto[]>([]);
  const [joinPostList, setJoinPostList] = useState<PostDto[]>([]);

  const [activeTabLeft, setActiveTabLeft] = useState("공지사항");
  const [activeTabRight, setActiveTabRight] = useState("자유게시판");

  const rgmBoardId = 2;
  const freeBoardId = 0;
  const noticeBoardId = 3;
  const eventBoardId = 4;

  const hasNotification = true;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const [freeRes, rgmRes, noticeRes, eventRes] = await Promise.all([
          getRecentPostList(freeBoardId),
          getRecentPostList(rgmBoardId),
          getRecentPostList(noticeBoardId),
          getRecentPostList(eventBoardId),
        ]);

        // 데이터 유효성 검사 및 fallback 처리
        setFreePostList(freeRes?.data?.data ?? []);
        setJoinPostList(rgmRes?.data?.data ?? []);
        setNoticePostList(noticeRes?.data?.data ?? []);
        setEventPostList(eventRes?.data?.data ?? []);
      } catch (error) {
        console.error("게시판 목록 로드 실패:", error);
        // 필요 시 에러 상태 설정 or 사용자 알림
      }
    };

    fetchPosts();
  }, []);

  const handleLogoutClick = async () => {
    setMember(null);

    removeCookie("accessToken");
    removeCookie("refreshToken");
    localStorage.removeItem("member-store");
    // 메모리 상태도 완전 클리어
    useMemberStore.setState({ member: null });
    useGuildTeamStore.setState({ guildTeam: null });
    useFirebaseStore.setState({
      fcmToken: null,
      isServiceWorkerRegistered: false,
    });
    router.push("/");

    CustomAlert("success", "로그아웃", "로그아웃 되었습니다.");
  };

  const handleLoginClick = () => {
    router.push("/register");
  };

  const handleProfileClick = () => {
    router.push("/profile");
  };

  const handleRightPostClick = (postId: number) => {
    if (activeTabRight === "자유게시판") {
      router.push(`/board/free/${postId}`);
    } else if (activeTabRight === "길드원 모집") {
      router.push(`/board/rgm/${postId}`);
    }
  };

  const handleLeftPostClick = (postId: number) => {
    if (activeTabLeft === "공지사항") {
      router.push(`/board/notice/${postId}`);
    } else if (activeTabLeft === "이벤트") {
      router.push(`/board/event/${postId}`);
    }
  };

  const containsImage = (content: string) => {
    return /<img\s+[^>]*src=/.test(content);
  };
  return (
    <header className="flex flex-col w-full gap-[12px] bg-white dark:bg-black">
      <section className={`w-full bg-brandcolor dark:bg-dark`}>
        <div className="max-w-[1200px] mx-auto flex justify-between items-center py-[4px] gap-[32px]">
          <div className={`flex items-center gap-[32px]`}>
            <div className="flex gap-[4px] items-center">
              <img
                onClick={() => router.push("/")}
                width={50}
                height={50}
                src="/LOLFIGHT_NONE_TEXT.png"
                alt="logo"
                className="cursor-pointer"
              />

              <p
                className={`text-white text-[24px] tracking-[1px] leading-none  ${rixi.className}`}
              >
                <Link key="home" href="/">
                  LOLFIGHT
                </Link>
              </p>
            </div>
            <Navigation />
          </div>

          <ThemeToggler />
        </div>
      </section>

      {!(
        pathname.startsWith("/profile") || pathname.startsWith("/league/")
      ) && (
        <section className="max-w-[1200px] mx-auto flex gap-[4px]">
          <div className="flex gap-[4px] w-[800px] h-[200px]">
            <BoardSection
              tabTitles={["공지사항", "이벤트"]}
              activeTab={activeTabLeft}
              setActiveTab={setActiveTabLeft}
              postLists={{
                공지사항: noticePostList,
                이벤트: eventPostList,
              }}
              onPostClick={handleLeftPostClick}
              containsImage={containsImage}
            />

            <BoardSection
              tabTitles={["자유게시판", "길드원 모집"]}
              activeTab={activeTabRight}
              setActiveTab={setActiveTabRight}
              postLists={{
                자유게시판: freePostList,
                "길드원 모집": joinPostList,
              }}
              onPostClick={handleRightPostClick}
              containsImage={containsImage}
            />
          </div>

          <div className="flex-col">
            <div className="bg-brandbgcolor dark:bg-branddark">
              {member ? (
                <div className="w-[400px] h-[150px] flex flex-col items-center border dark:border-branddarkborder">
                  <div className="flex w-full items-center p-[12px] gap-[14px] relative">
                    <div className="w-[70px] h-[70px] my-auto">
                      <img
                        className="w-full h-full rounded-[12px]"
                        src={`${constant.SERVER_URL}/${member.memberIcon}`}
                      />
                    </div>
                    <div className="flex flex-col">
                      <p className="font-extrabold text-[18px]">
                        {member.memberName} 님
                      </p>
                      <p className="font-light text-base">{member.memberId}</p>
                    </div>
                    <CiBellOn
                      className="w-[30px] h-[30px] absolute top-[5px] right-[5px] cursor-pointer"
                      onClick={() => router.push("/alarm")}
                    />
                    {hasNotification && (
                      <span className="absolute top-[5px] right-[5px] w-[10px] h-[10px] rounded-full bg-red-500 border-2 border-white" />
                    )}
                  </div>

                  <div className="flex grid grid-cols-2 w-full h-full items-center justify-center dark:border-gray-800">
                    <button
                      className="flex w-full h-full items-center justify-center cursor-pointer hover:bg-brandhover dark:hover:bg-gray-600 transition"
                      onClick={handleProfileClick}
                    >
                      내정보
                    </button>
                    <button
                      className="flex w-full h-full items-center justify-center cursor-pointer hover:bg-brandhover dark:hover:bg-gray-600 transition"
                      onClick={handleLogoutClick}
                    >
                      <span>로그아웃</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="w-[400px] h-[150px] flex flex-col justify-between items-center p-[16px]">
                  <p className="text-center">
                    롤파이트의 서비스를 편리하게 이용하세요
                  </p>
                  <button
                    className="w-full bg-brandcolor text-white text-[20px] font-bold py-[8px] rounded hover:bg-brandhover"
                    onClick={handleLoginClick}
                  >
                    롤파이트 로그인
                  </button>
                  <div className="flex gap-[8px] text-sm">
                    <Link key={"회원가입"} href="/register/signup">
                      회원가입
                    </Link>
                    <span>|</span>
                    <Link key={"비밀번호 찾기"} href="/register/find">
                      비밀번호 찾기
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <Search />
          </div>
        </section>
      )}
    </header>
  );
};

export default Header;

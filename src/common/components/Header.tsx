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
import { useIsMobile } from "@/src/hooks/useMediaQuery";
import Sidebar from "./sidebar";
const rixi = localFont({
  src: "../../fonts/RixInooAriDuriRegular.ttf",
  display: "swap",
  variable: "--font-rixi",
});

export const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const { member, setMember } = useMemberStore();

  const [noticePostList, setNoticePostList] = useState<PostDto[]>([]);
  const [eventPostList, setEventPostList] = useState<PostDto[]>([]);
  const [freePostList, setFreePostList] = useState<PostDto[]>([]);
  const [joinPostList, setJoinPostList] = useState<PostDto[]>([]);

  const [activeTabLeft, setActiveTabLeft] = useState("공지사항");
  const [activeTabRight, setActiveTabRight] = useState("자유게시판");

  const rgmBoardId = 3;
  const freeBoardId = 1;
  const noticeBoardId = 4;
  const eventBoardId = 5;

  const hasNotification = false;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

    removeCookie("lf_atk");
    removeCookie("lf_rtk");
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
    <>
      {" "}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <header className="flex flex-col w-full gap-[12px] bg-white dark:bg-black">
        <section
          className={`w-full bg-brandcolor dark:bg-dark px-[16px] py-[4px]`}
        >
          <div
            className={`max-w-[1200px] mx-auto flex items-center gap-[32px] ${
              isMobile ? "justify-between" : "justify-between"
            }`}
          >
            {isMobile && (
              <img
                className="hoverable"
                alt="menu"
                width={isMobile ? 20 : 30}
                height={isMobile ? 20 : 30}
                src={"/textalign.svg"}
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              />
            )}
            <div className={`flex items-center gap-[32px]`}>
              <div className="flex gap-[4px] items-center">
                <img
                  onClick={() => router.push("/")}
                  width={isMobile ? 40 : 50}
                  height={isMobile ? 40 : 50}
                  src="/LOLFIGHT_NONE_TEXT.png"
                  alt="logo"
                  className="cursor-pointer"
                />
                <p
                  className={`text-white ${
                    isMobile ? "text-[20px]" : "text-[24px]"
                  } tracking-[1px] leading-none  ${rixi.className}`}
                >
                  <Link key="home" href="/">
                    LOLFIGHT
                  </Link>
                </p>
              </div>
              {!isMobile && <Navigation />}
            </div>

            <ThemeToggler />
          </div>
        </section>

        {!(
          pathname.startsWith("/profile") || pathname.startsWith("/league/")
        ) && (
          <section className="w-full px-[16px] py-[4px]">
            <div className="max-w-[1200px] mx-auto flex gap-[4px]">
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

              {!isMobile && (
                <div className="flex-col w-full">
                  <div className="bg-brandbgcolor dark:bg-branddark h-[150px] border dark:border-branddarkborder">
                    {member ? (
                      <div className="flex flex-col h-full">
                        <div className="flex items-center p-[12px] gap-[14px] relative">
                          <img
                            className="object-cover rounded-[12px] w-[70px] h-[70px]"
                            src={`${constant.SERVER_URL}/${member.memberIcon}`}
                            alt="member-icon"
                          />
                          <div className="flex flex-col">
                            <p className="font-extrabold text-[18px]">
                              {member.memberName} 님
                            </p>
                            <p className="font-light text-base">
                              {member.memberId}
                            </p>
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
                            className="flex w-full h-full items-center justify-center cursor-pointer hover:bg-brandhover dark:hover:bg-gray-800 transition"
                            onClick={handleProfileClick}
                          >
                            내정보
                          </button>
                          <button
                            className="flex w-full h-full items-center justify-center cursor-pointer hover:bg-brandhover dark:hover:bg-gray-800 transition"
                            onClick={handleLogoutClick}
                          >
                            <span>로그아웃</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-[24px] justify-center items-center p-[16px]">
                        <p className="text-center text-[16px]">
                          롤파이트의 서비스를 편리하게 이용하세요
                        </p>
                        <button
                          className="flex items-center justify-center gap-[12px] w-full bg-brandcolor text-white text-[20px] font-bold py-[8px] rounded border border-brandborder hover:bg-brandhover"
                          onClick={() => router.push("/login")}
                        >
                          롤파이트 로그인
                        </button>
                      </div>
                    )}
                  </div>
                  <Search />
                </div>
              )}
            </div>
          </section>
        )}
      </header>
    </>
  );
};

export default Header;

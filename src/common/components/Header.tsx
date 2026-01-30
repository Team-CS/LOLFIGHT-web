"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Navigation from "./Navigation";
import Search from "./Search";
import constant from "@/src/common/constant/constant";
import { PostDto } from "../DTOs/board/post.dto";
import { getRecentPostList } from "@/src/api/post.api";
import { useMemberStore } from "../zustand/member.zustand";
import { getCookie, removeCookie } from "@/src/utils/cookie/cookie";
import BoardSection from "./header/boardSection";
import localFont from "next/font/local";
import CustomAlert from "./alert/CustomAlert";
import { CiBellOn } from "react-icons/ci";
import { useGuildTeamStore } from "../zustand/guild_team.zustand";
import { useFirebaseStore } from "../zustand/firebase.zustand";
import { useIsMobile } from "@/src/hooks/useMediaQuery";
import Sidebar from "./sidebar";
import ThemeToggler from "./ThemeToggler";
import { toast } from "react-toastify";
import { useAlarmStore } from "../zustand/alarm.zustand";
import Image from "next/image";
import { get } from "http";

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
  const { checkAlarms, hasAlarm } = useAlarmStore();
  const [noticePostList, setNoticePostList] = useState<PostDto[]>([]);
  const [eventPostList, setEventPostList] = useState<PostDto[]>([]);
  const [freePostList, setFreePostList] = useState<PostDto[]>([]);
  const [joinPostList, setJoinPostList] = useState<PostDto[]>([]);
  const [activeTabLeft, setActiveTabLeft] = useState("공지사항");
  const [activeTabRight, setActiveTabRight] = useState("자유게시판");

  const freeBoardId = 1;
  const rgmBoardId = 3;
  const noticeBoardId = 4;
  const eventBoardId = 5;

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getRecentPostList([
          freeBoardId,
          rgmBoardId,
          noticeBoardId,
          eventBoardId,
        ]);

        const postData = response.data.data ?? {};

        setFreePostList(postData[freeBoardId] ?? []);
        setJoinPostList(postData[rgmBoardId] ?? []);
        setNoticePostList(postData[noticeBoardId] ?? []);
        setEventPostList(postData[eventBoardId] ?? []);
      } catch (error) {
        console.error("게시판 목록 로드 실패:", error);
      }
    };

    fetchPosts();

    const accessToken = getCookie("lf_atk");
    const refreshToken = getCookie("lf_rtk");

    if (accessToken && refreshToken) {
      checkAlarms();
    }
  }, []);

  useEffect(() => {
    if (hasAlarm) {
      toast.info(
        <div
          onClick={() => {
            router.push("/alarm");
          }}
          className="cursor-pointer"
        >
          <strong>{"새로운 소식이에요 🔔"}</strong>
          <p>{"알림이 도착했습니다"}</p>
        </div>,
      );
    }
  }, [hasAlarm]);

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
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <header className="flex flex-col w-full gap-[12px] bg-[#FCFCFC] dark:bg-black">
        {/* 상단 네비게이션 바 */}
        <section className="w-full bg-gradient-to-r from-brandcolor via-blue-500 to-brandcolor dark:from-dark dark:via-branddark dark:to-dark px-[16px] py-[8px] shadow-md">
          <div className="max-w-[1200px] mx-auto flex items-center justify-between">
            {isMobile && (
              <Image
                src={"/textalign.svg"}
                alt="menu"
                width={30}
                height={30}
                className="w-[22px] h-[22px] cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              />
            )}
            <div className="flex items-center gap-[32px]">
              <div
                className="flex gap-[6px] items-center group cursor-pointer"
                onClick={() => router.push("/")}
              >
                <Image
                  src="/LOLFIGHT_NONE_TEXT.png"
                  alt="logo"
                  width={50}
                  height={50}
                  priority
                  className={`${
                    isMobile ? "w-[32px] h-[32px]" : "w-[42px] h-[42px]"
                  } group-hover:scale-105 transition-transform`}
                />
                <p
                  className={`text-white ${
                    isMobile ? "text-[18px]" : "text-[22px]"
                  } tracking-[2px] leading-none drop-shadow-sm ${rixi.className}`}
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

        {/* 게시판 섹션 */}
        {!(
          pathname.startsWith("/profile") || pathname.startsWith("/league/")
        ) && (
          <section className="w-full px-[16px] py-[4px]">
            <div className="max-w-[1200px] mx-auto flex gap-[8px]">
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
                  {/* 프로필/로그인 섹션 */}
                  <div className="bg-white dark:bg-dark h-[150px] rounded-t-[12px] border border-gray-100 dark:border-branddarkborder overflow-hidden shadow-sm">
                    {member ? (
                      <div className="flex flex-col h-full">
                        <div className="flex items-center p-[14px] gap-[14px] relative bg-gradient-to-r from-gray-50 to-white dark:from-branddark dark:to-dark">
                          <div className={`${member.memberItem?.border}`}>
                            <Image
                              src={`${constant.SERVER_URL}/${member.memberIcon}`}
                              alt="member-icon"
                              width={70}
                              height={70}
                              className="object-cover rounded-[12px] w-[65px] h-[65px] shadow-md"
                            />
                          </div>
                          <div className="flex flex-col gap-[2px]">
                            <p className="font-bold text-[17px]">
                              <span className={`${member.memberItem?.effect}`}>
                                {member.memberName}
                              </span>{" "}
                              <span className="text-gray-500 font-normal text-[14px]">
                                님
                              </span>
                            </p>
                            <p className="text-gray-400 text-[13px]">
                              {member.memberId}
                            </p>
                            <div className="flex items-center gap-[6px] mt-[2px]">
                              <div className="flex items-center gap-[4px] px-[8px] py-[2px] rounded-full bg-amber-50 dark:bg-amber-900/20">
                                <Image
                                  src={`/images/point.png`}
                                  alt="포인트"
                                  width={14}
                                  height={14}
                                  className="object-cover"
                                />
                                <p className="font-semibold text-[12px] text-amber-600 dark:text-amber-400">
                                  {member.memberWallet.point.toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div
                            className="absolute top-[10px] right-[10px] p-[6px] rounded-full hover:bg-gray-100 dark:hover:bg-branddarkborder transition-colors cursor-pointer"
                            onClick={() => router.push("/alarm")}
                          >
                            <CiBellOn className="w-[24px] h-[24px] text-gray-500" />
                            {hasAlarm && (
                              <span className="absolute top-[6px] right-[6px] block w-[10px] h-[10px] bg-red-500 rounded-full border-[2px] border-white animate-pulse" />
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 w-full h-full border-t border-gray-100 dark:border-branddarkborder">
                          <button
                            className="flex w-full h-full items-center justify-center cursor-pointer text-[14px] font-medium text-gray-600 dark:text-gray-300 hover:bg-brandcolor hover:text-white transition-all"
                            onClick={handleProfileClick}
                          >
                            내정보
                          </button>
                          <button
                            className="flex w-full h-full items-center justify-center cursor-pointer text-[14px] font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-branddarkborder transition-all border-l border-gray-100 dark:border-branddarkborder"
                            onClick={handleLogoutClick}
                          >
                            로그아웃
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-[20px] justify-center items-center p-[20px] h-full">
                        <p className="text-center text-[15px] text-gray-600 dark:text-gray-300">
                          롤파이트의 서비스를 편리하게 이용하세요
                        </p>
                        <button
                          className="flex items-center justify-center gap-[8px] w-full bg-gradient-to-r from-brandcolor to-blue-500 text-white text-[16px] font-bold py-[10px] rounded-[10px] hover:opacity-90 transition-opacity shadow-md"
                          onClick={() => router.push("/login")}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-[18px] h-[18px]"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                            />
                          </svg>
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

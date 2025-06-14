"use client";
import darklogo from "../../../public/icon-blue.png";
import lightlogo from "../../../public/icon.png";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Navigation from "./Navigation";
import ThemeToggler from "../components/Desktop/ThemeToggler";
import Search from "./Search";
import constant from "@/src/common/constant/constant";
import { PostDTO } from "../DTOs/board/post.dto";
import { getRecentPostList } from "@/src/api/post.api";
import { useMemberStore } from "../zustand/member.zustand";
import { removeCookie } from "@/src/utils/cookie/cookie";
import BoardSection from "./header/boardSection";

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();

  const { member, setMember } = useMemberStore();

  const [noticePostList, setNoticePostList] = useState<PostDTO[]>([]);
  const [eventPostList, setEventPostList] = useState<PostDTO[]>([]);
  const [freePostList, setFreePostList] = useState<PostDTO[]>([]);
  const [joinPostList, setJoinPostList] = useState<PostDTO[]>([]);

  const [activeTabLeft, setActiveTabLeft] = useState("공지사항");
  const [activeTabRight, setActiveTabRight] = useState("자유게시판");

  const [isImageError, setIsImageError] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const rgmBoardId = 2;
  const freeBoardId = 0;
  const noticeBoardId = 3;
  const eventBoardId = 4;

  useEffect(() => {
    console.log();
    getRecentPostList(freeBoardId).then((response) => {
      setFreePostList(response.data.data);
    });
    getRecentPostList(rgmBoardId).then((response) => {
      setJoinPostList(response.data.data);
    });
    getRecentPostList(noticeBoardId).then((response) => {
      setNoticePostList(response.data.data);
    });
    getRecentPostList(eventBoardId).then((response) => {
      setEventPostList(response.data.data);
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % noticePostList.length);
    }, 3000); // 3초마다 업데이트

    return () => clearInterval(interval); // 컴포넌트가 언마운트될 때 타이머를 정리
  }, [noticePostList.length]);

  const handleLogoutClick = async () => {
    setMember(null);

    removeCookie("accessToken");
    removeCookie("refreshToken");

    router.push("/");
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

  const handleHeaderNoticeClick = (postId: number) => {
    router.push(`/board/notice/${postId}`);
  };

  const containsImage = (content: string) => {
    return /<img\s+[^>]*src=/.test(content);
  };

  return (
    <header className="w-full top-0">
      <section className="w-[1200px] mx-auto flex items-center py-[16px]">
        <img
          className="hidden dark:block h-[60px] object-contain cursor-pointer"
          onClick={() => router.push("/")}
          src={lightlogo.src}
          alt="light logo"
        />
        <img
          className="block dark:hidden h-[60px] object-contain cursor-pointer"
          onClick={() => router.push("/")}
          src={darklogo.src}
          alt="dark logo"
        />
        <div className="flex items-center pl-[10px] gap-2">
          <span className="text-red-400 font-bold">[공지]</span>
          {containsImage(noticePostList[currentIndex]?.postContent) ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.2"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
              <circle cx="20" cy="5" r="3" fill="red" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.2"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
              />
              <circle cx="20" cy="5" r="3" fill="red" />
            </svg>
          )}
          <div
            className="w-fit hover:underline hover:decoration-gray-400 hover:decoration-opacity-50 cursor-pointer"
            onClick={() =>
              handleHeaderNoticeClick(noticePostList[currentIndex]?.id)
            }
          >
            {noticePostList[currentIndex]?.postTitle}
            <span className="text-red-400 text-xs pl-1">
              [{noticePostList[currentIndex]?.postComments}]
            </span>
          </div>
        </div>
      </section>

      <section className="w-full bg-brandcolor dark:bg-dark my-2">
        <div className="w-1200px mx-auto h-16 flex justify-between items-center">
          <div className="items-center">
            {/* <Image width={64} height={64} src={logo} alt="logo" /> */}
            <p className="font-extrabold text-white ml-2 text-xl">
              <Link key="home" href={"/"}>
                LOLFIGHT
              </Link>
            </p>
          </div>
          <Navigation />
          <ThemeToggler />
        </div>
      </section>

      {!(
        pathname.startsWith("/profile") || pathname.startsWith("/league/")
      ) && (
        <section className="w-[1200px] mx-auto flex mb-1">
          <div className="w-[800px] h-[200px] flex gap-1">
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

          <div className="flex-col ml-2">
            <div className="bg-brandbgcolor dark:bg-branddark">
              {member ? (
                <div className="w-[400px] h-[150px] flex flex-col justify-between items-centerborder dark:border-branddark">
                  <div className="flex w-full items-center p-4">
                    <div className="w-[70px] h-[70px] my-auto mr-[20px]">
                      <img
                        className="w-full h-full rounded-full"
                        src={`${constant.SERVER_URL}/${member?.memberIcon}`}
                      />
                    </div>
                    <div className="flex flex-col flex-grow">
                      <p className="font-extrabold text-lg">
                        {member.memberName} 님
                      </p>
                      <p className="font-light text-base">{member.memberId}</p>
                    </div>
                  </div>
                  <div className="w-full h-full flex items-center justify-between dark:border-gray-800">
                    <button
                      className="w-1/2 h-full flex items-center justify-center px-2 py-1 cursor-pointer hover:bg-brandhover dark:hover:bg-gray-600 transition"
                      onClick={handleProfileClick}
                    >
                      내정보
                    </button>
                    <div className="w-[1px] h-full bg-gray-300 dark:bg-gray-600"></div>
                    <div
                      className="w-1/2 h-full flex items-center justify-center px-2 py-1 cursor-pointer hover:bg-brandhover dark:hover:bg-gray-600 transition"
                      onClick={handleLogoutClick}
                    >
                      <span>로그아웃</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-[400px] h-[150px] flex flex-col justify-between items-center p-4">
                  <p className="text-center">
                    롤파이트의 서비스를 편리하게 이용하세요
                  </p>
                  <button
                    className="w-full h-[50px] bg-brandcolor text-white text-xl font-bold py-2 px-4 rounded hover:bg-brandhover"
                    onClick={handleLoginClick}
                  >
                    롤파이트 로그인
                  </button>
                  <div className="mt-2 text-sm">
                    <Link key={"회원가입"} href="/register/signup">
                      회원가입
                    </Link>
                    <span className="mx-2">|</span>
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

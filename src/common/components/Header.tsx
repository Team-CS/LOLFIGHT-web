"use client";
import Image from "next/image";
import darklogo from "../../../public/icon-blue.png";
import lightlogo from "../../../public/icon.png";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import CustomAlert from "../components/alert/CustomAlert";
import Navigation from "./Navigation";
import ThemeToggler from "../components/Desktop/ThemeToggler";
import Search from "./Search";
import constant from "@/src/common/constant/constant";
import { PostDTO } from "../DTOs/board/post.dto";
import { getRecentPostList } from "@/src/api/post.api";
import { authLogout } from "@/src/api/auth.api";
import { useMember } from "../zustand/member.zustand";

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [memberName, setMemberName] = useState<string | null>(null);
  const [memberId, setMemberId] = useState<string | null>(null);

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
    if (typeof window !== "undefined") {
      const storedMemberName = sessionStorage.getItem("memberName");
      const storedMemberId = sessionStorage.getItem("memberId");

      setMemberName(storedMemberName);
      setMemberId(storedMemberId);
    }
  }, []);

  useEffect(() => {
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
    try {
      const response = await authLogout();

      if (response.status === 200) {
        // access token, sessionStorage 지우기
        sessionStorage.clear();
        localStorage.clear();

        CustomAlert("success", "로그아웃", "로그아웃 되었습니다.");
        setMemberName("");
        router.replace("/");
      }
    } catch (error) {
      CustomAlert(
        "error",
        "로그아웃 실패",
        "로그아웃 처리 중 문제가 발생했습니다."
      );
    }
  };

  const handleLoginClick = () => {
    router.replace("/register");
  };

  const handleProfileClick = () => {
    router.replace("/profile");
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
      <section className="w-[1200px] mx-auto flex items-center">
        <Image
          className="hidden dark:block"
          onClick={() => router.replace("/")}
          width={100}
          height={100}
          src={lightlogo}
          alt="light logo"
        />
        <Image
          className="block dark:hidden"
          width={100}
          height={100}
          src={darklogo}
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
            <div className="w-1/2 h-full bg-brandbgcolor dark:bg-branddark">
              <div className="w-full flex items-center justify-between mb-4">
                <button
                  className={`w-1/2 px-8 py-3 ${
                    activeTabLeft === "공지사항"
                      ? "font-bold text-brandcolor dark:text-white"
                      : "bg-[#e4eefb] dark:bg-brandgray text-gray-500"
                  }`}
                  onClick={() => setActiveTabLeft("공지사항")}
                >
                  공지사항
                </button>
                <button
                  className={`w-1/2 px-8 py-3 ${
                    activeTabLeft === "이벤트"
                      ? "font-bold text-brandcolor dark:text-white"
                      : "bg-[#e4eefb] dark:bg-brandgray text-gray-500"
                  }`}
                  onClick={() => setActiveTabLeft("이벤트")}
                >
                  이벤트
                </button>
              </div>
              <div className="px-4 py-2">
                {activeTabLeft === "공지사항" && (
                  <div className="space-y-2">
                    {noticePostList.length > 0 ? (
                      noticePostList.map((post) => (
                        <div key={post.id} className="flex gap-1">
                          {containsImage(post.postContent) ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke-width="1.2"
                              stroke="currentColor"
                              className="w-5 h-5"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                              />
                              <circle cx="20" cy="5" r="3" fill="red" />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke-width="1.2"
                              stroke="currentColor"
                              className="w-5 h-5"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                              />
                              <circle cx="20" cy="5" r="3" fill="red" />
                            </svg>
                          )}
                          <p
                            key={post.id}
                            className="w-fit hover:underline hover:decoration-gray-400 hover:decoration-opacity-50 cursor-pointer"
                            onClick={() => handleLeftPostClick(post.id)}
                          >
                            {post.postTitle}
                            <span className="text-red-400 text-xs pl-1">
                              [{post.postComments}]
                            </span>
                          </p>
                        </div>
                      ))
                    ) : (
                      <p>공지사항이 없습니다</p>
                    )}
                  </div>
                )}
                {activeTabLeft === "이벤트" && (
                  <div className="space-y-2">
                    {eventPostList.length > 0 ? (
                      eventPostList.map((post) => (
                        <div key={post.id} className="flex gap-1">
                          {containsImage(post.postContent) ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke-width="1.2"
                              stroke="currentColor"
                              className="w-5 h-5"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                              />
                              <circle cx="20" cy="5" r="3" fill="red" />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke-width="1.2"
                              stroke="currentColor"
                              className="w-5 h-5"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                              />
                              <circle cx="20" cy="5" r="3" fill="red" />
                            </svg>
                          )}
                          <p
                            key={post.id}
                            className="w-fit hover:underline hover:decoration-gray-400 hover:decoration-opacity-50 cursor-pointer"
                            onClick={() => handleLeftPostClick(post.id)}
                          >
                            {post.postTitle}
                            <span className="text-red-400 text-xs pl-1">
                              [{post.postComments}]
                            </span>
                          </p>
                        </div>
                      ))
                    ) : (
                      <p>진행중인 이벤트가 없습니다</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="w-1/2 h-full bg-brandbgcolor dark:bg-branddark">
              <div className="flex justify-start mb-4">
                <button
                  className={`w-1/2 px-8 py-3 ${
                    activeTabRight === "자유게시판"
                      ? "font-bold text-brandcolor dark:text-white"
                      : "bg-[#e4eefb] dark:bg-brandgray text-gray-500"
                  }`}
                  onClick={() => setActiveTabRight("자유게시판")}
                >
                  자유게시판
                </button>
                <button
                  className={`w-1/2 px-8 py-3 ${
                    activeTabRight === "길드원 모집"
                      ? "font-bold text-brandcolor dark:text-white"
                      : "bg-[#e4eefb] dark:bg-brandgray text-gray-500"
                  }`}
                  onClick={() => setActiveTabRight("길드원 모집")}
                >
                  길드원 모집
                </button>
              </div>
              <div className="px-4 py-2">
                {activeTabRight === "자유게시판" && (
                  <div className="space-y-2">
                    {freePostList.length > 0 ? (
                      freePostList.map((post) => (
                        <div key={post.id} className="flex gap-1">
                          {containsImage(post.postContent) ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke-width="1.2"
                              stroke="currentColor"
                              className="w-5 h-5"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                              />
                              <circle cx="20" cy="5" r="3" fill="red" />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke-width="1.2"
                              stroke="currentColor"
                              className="w-5 h-5"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                              />
                              <circle cx="20" cy="5" r="3" fill="red" />
                            </svg>
                          )}
                          <p
                            key={post.id}
                            className="w-fit hover:underline hover:decoration-gray-400 hover:decoration-opacity-50 cursor-pointer"
                            onClick={() => handleRightPostClick(post.id)}
                          >
                            {post.postTitle}
                            <span className="text-red-400 text-xs pl-1">
                              [{post.postComments}]
                            </span>
                          </p>
                        </div>
                      ))
                    ) : (
                      <p>내용이 없습니다.</p>
                    )}
                  </div>
                )}

                {activeTabRight === "길드원 모집" && (
                  <div className="space-y-2">
                    {joinPostList.length > 0 ? (
                      joinPostList.map((post) => (
                        <div key={post.id} className="flex gap-1">
                          {containsImage(post.postContent) ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke-width="1.2"
                              stroke="currentColor"
                              className="w-5 h-5"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                              />
                              <circle cx="20" cy="5" r="3" fill="red" />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke-width="1.2"
                              stroke="currentColor"
                              className="w-5 h-5"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                              />
                              <circle cx="20" cy="5" r="3" fill="red" />
                            </svg>
                          )}
                          <p
                            key={post.id}
                            className="w-fit hover:underline hover:decoration-gray-400 hover:decoration-opacity-50 cursor-pointer"
                            onClick={() => handleRightPostClick(post.id)}
                          >
                            {post.postTitle}
                            <span className="text-red-400 text-xs pl-1">
                              [{post.postComments}]
                            </span>
                          </p>
                        </div>
                      ))
                    ) : (
                      <p>게시글이 없습니다</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex-col ml-2">
            <div className="bg-brandbgcolor dark:bg-branddark">
              {memberName ? (
                <div className="w-[400px] h-[150px] flex flex-col justify-between items-centerborder dark:border-branddark">
                  <div className="flex w-full items-center p-4">
                    <div className="w-[70px] h-[70px] my-auto mr-[20px]">
                      <Image
                        className="w-full h-full rounded-full"
                        width={70}
                        height={70}
                        src={
                          isImageError
                            ? `${constant.SERVER_URL}/public/default.png`
                            : `${constant.SERVER_URL}/public/member/${memberName}.png`
                        }
                        alt={"memberIcon"}
                        onError={(event) => {
                          event.preventDefault();
                          setIsImageError(true);
                        }}
                        unoptimized
                      />
                    </div>
                    <div className="flex flex-col flex-grow">
                      <p className="font-extrabold text-lg">{memberName} 님</p>
                      <p className="font-light text-base">{memberId}</p>
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

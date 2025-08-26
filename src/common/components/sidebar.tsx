"use client";

import React from "react";

import { useRouter } from "next/navigation";
import { useMemberStore } from "../zustand/member.zustand";
import { removeCookie } from "@/src/utils/cookie/cookie";
import { useGuildTeamStore } from "../zustand/guild_team.zustand";
import { useFirebaseStore } from "../zustand/firebase.zustand";
import CustomAlert from "./alert/CustomAlert";
import Navigation from "./Navigation";
import headerNavLinks from "@/src/data/headerNavLinks";
import Link from "next/link";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { member, setMember } = useMemberStore();

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

  return (
    <>
      <div
        className={`fixed top-0 left-0 h-full w-[300px] bg-white dark:bg-branddark transform transition-transform duration-300 z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 flex justify-between items-center border-b border-black dark:border-branddarkborder">
          <span className="text-[20px] font-extrabold">MENU</span>
          <button onClick={onClose} className="text-xl">
            ×
          </button>
        </div>
        <div className="flex flex-col p-[16px] gap-[18px]">
          {member ? (
            <div className="flex justify-center gap-[4px] bg-brandcolor dark:bg-brandgray px-[14px] py-[8px] rounded-[8px] hover:bg-brandhover dark:hover:bg-gray-800 hoverable duration-300 gap-[8px]">
              <p
                className="font-medium text-[16px] text-white"
                onClick={() => {
                  router.push("/profile");
                  onClose();
                }}
              >
                내 정보
              </p>
            </div>
          ) : (
            <div
              className="flex justify-center gap-[4px] bg-[#0B1A28] px-[14px] py-[8px] rounded-[8px] hover:bg-[#1E364D] hoverable duration-300 gap-[8px] cursor-pointer"
              onClick={() => {
                router.push("/login");
                onClose();
              }}
            >
              <p className="font-bold text-[16px] text-white">
                로그인 / 회원가입
              </p>
            </div>
          )}
          <div className="flex flex-col gap-[12px]">
            {headerNavLinks
              .filter((link) => link.href !== "/")
              .map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  className="block w-full px-[12px] py-[10px] rounded-[8px] text-[14px] font-medium text-gray-800 dark:text-white hover:bg-brandhover dark:hover:bg-gray-700 transition duration-300"
                  onClick={onClose}
                >
                  {link.title}
                </Link>
              ))}
          </div>

          {member && (
            <div
              className="flex justify-center gap-[4px] bg-[#CDCDCD] px-[14px] py-[8px] rounded-[8px] hover:bg-[#A7A7A7] hoverable duration-300 gap-[8px]"
              onClick={() => {
                handleLogoutClick();
                onClose();
              }}
            >
              <p className="font-bold text-[16px] text-black">로그아웃</p>
            </div>
          )}
        </div>
      </div>

      {/* 오버레이 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={onClose}
        />
      )}
    </>
  );
};

export default Sidebar;

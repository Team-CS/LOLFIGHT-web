"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import ThemeToggler from "./ThemeToggler";

const Header = () => {
  // Sticky Navbar
  const [sticky, setSticky] = useState(false);
  const handleStickyNavbar = () => {
    if (window.scrollY >= 80) {
      setSticky(true);
    } else {
      setSticky(false);
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleStickyNavbar);
  });

  return (
    <>
      <header
        className={`header top-0 z-40 flex w-full items-center ${
          sticky
            ? "dark:bg-gray-dark dark:shadow-sticky-dark fixed z-[9999] bg-white !bg-opacity-80 shadow-sticky backdrop-blur-sm transition"
            : "absolute bg-transparent"
        }`}
      >
        {/* ✅ 중앙 정렬되며 max-width 제한 */}
        <div className="container mx-auto w-full max-w-[1200px] px-4 flex justify-between items-center">
          {/* 왼쪽: 로고 */}
          <div className="w-60 max-w-full">
            <Link key="home" href={"/"}>
              LOL.FIGHT
            </Link>
          </div>

          {/* 오른쪽: 토글 버튼 */}
          <div className="flex items-center">
            <ThemeToggler />
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;

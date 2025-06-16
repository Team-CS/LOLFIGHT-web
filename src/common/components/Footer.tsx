"use client";
import { useRouter } from "next/navigation";
import React from "react";

import darklogo from "../../../public/icon-blue.png";
import lightlogo from "../../../public/icon.png";

const Footer = () => {
  const router = useRouter();
  const footerNavs = [
    {
      href: "/policies/agreement",
      name: "이용약관",
    },
    {
      href: "/policies/privacy",
      name: "개인정보처리방침",
    },
  ];

  return (
    <footer className="flex w-full py-[24px]">
      <div className="flex max-w-[1200px] mx-auto justify-center items-center gap-[24px]">
        <img
          className="hidden dark:block h-[40px] object-contain cursor-pointer"
          onClick={() => router.push("/")}
          src={lightlogo.src}
          alt="light logo"
        />
        <img
          className="block dark:hidden h-[40px] object-contain cursor-pointer"
          onClick={() => router.push("/")}
          src={darklogo.src}
          alt="dark logo"
        />
        <div className="flex flex-col flex text-[12px] font-normal items-center">
          <div className="flex gap-[4px]">
            <a
              className="hover:text-[#757575] hoverable"
              href={"/policies/agreement"}
            >
              이용약관
            </a>
            <p> · </p>
            <a
              className="hover:text-[#757575] hoverable"
              href={"/policies/privacy"}
            >
              개인정보처리방침
            </a>
          </div>
          <div className="items-center justify-between sm:flex">
            <p>
              {" "}
              Copyright <span className="font-bold">©LOLFIGHT</span> All rights
              reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
{
  /* <a
href="https://discord.gg/3cKD3maUga"
onClick={(e) => e.preventDefault}
>
<svg
  className="w-7 h-7 hover:text-gray-500 duration-150"
  viewBox="0 0 24 24"
  fill="currentColor"
>
  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
</svg>
</a> */
}

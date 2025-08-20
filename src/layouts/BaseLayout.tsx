"use client";
import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import Header from "../common/components/Header";
import Footer from "../common/components/Footer";
import DesktopNavigation from "../common/components/Desktop/DesktopHeader";
import { ToastContainer } from "react-toastify";
import useFirebaseMessaging from "../hooks/useFirebaseMessaging";

type Props = {
  children: React.ReactNode;
};
export default function BaseLayout({ children }: Props) {
  const pathname = usePathname();
  const hideDefaultLayoutPaths =
    pathname.startsWith("/login") || pathname.startsWith("/desktop");
  useFirebaseMessaging();

  return (
    <>
      {!hideDefaultLayoutPaths && <Header />}
      {hideDefaultLayoutPaths && <DesktopNavigation />}
      <div className="main">{children}</div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        pauseOnHover
        theme="light"
      />
      {!hideDefaultLayoutPaths && <Footer />}
    </>
  );
}

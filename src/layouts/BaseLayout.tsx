"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Header from "../common/components/Header";
import Footer from "../common/components/Footer";
import DesktopNavigation from "../common/components/Desktop/DesktopHeader";

type Props = {
  children: React.ReactNode;
};
export default function BaseLayout({ children }: Props) {
  const pathname = usePathname();
  const hideDefaultLayoutPaths =
    pathname.startsWith("/register") || pathname.startsWith("/desktop");

  return (
    <>
      {!hideDefaultLayoutPaths && <Header />}
      {hideDefaultLayoutPaths && <DesktopNavigation />}
      <div className="main">{children}</div>
      {!hideDefaultLayoutPaths && <Footer />}
    </>
  );
}

"use client";
import { useIsMobile } from "@/src/hooks/useMediaQuery";
import BoardNavComponent from "../../components/BoardNavComponent";
import BoardWriteComponent from "../../components/write/BoardWriteComponent";

type PageProps = {
  slug: string;
};

export default function Page({ params }: { params: PageProps }) {
  const isMobile = useIsMobile();

  return (
    <>
      <div
        className={`flex max-w-[1200px] h-full mx-auto w-full py-[28px] gap-[24px] ${
          isMobile && "flex-col px-[12px]"
        }`}
      >
        <BoardNavComponent></BoardNavComponent>
        <BoardWriteComponent></BoardWriteComponent>
      </div>
    </>
  );
}

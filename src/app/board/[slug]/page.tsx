"use client";
import { notFound } from "next/navigation";
import BoardNavComponent from "../components/BoardNavComponent";
import BoardComponent from "../components/BoardComponent";
import boardNavLinks from "@/src/data/boardNavLinks"; // slug 정의된 곳
import { useIsMobile } from "@/src/hooks/useMediaQuery";

type PageProps = {
  slug: string;
};

export default function Page({ params }: { params: PageProps }) {
  const isValidSlug = boardNavLinks.some((link) => link.slug === params.slug);
  const isMobile = useIsMobile();

  if (!isValidSlug) {
    notFound();
  }

  return (
    <div
      className={`flex max-w-[1200px] h-full mx-auto w-full py-[28px] gap-[24px] ${
        isMobile && "flex-col px-[12px]"
      }`}
    >
      <BoardNavComponent />
      <BoardComponent slug={params.slug} />
    </div>
  );
}

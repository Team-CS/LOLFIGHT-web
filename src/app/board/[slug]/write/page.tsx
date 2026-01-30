"use client";
import BoardNavComponent from "../../components/BoardNavComponent";
import BoardWriteComponent from "../../components/write/BoardWriteComponent";

type PageProps = {
  slug: string;
};

export default function Page({ params }: { params: PageProps }) {
  return (
    <div className="flex max-w-[1200px] h-full mx-auto w-full py-[28px] gap-[24px] px-[12px] md:px-0 flex-col md:flex-row">
      <BoardNavComponent />
      <BoardWriteComponent />
    </div>
  );
}

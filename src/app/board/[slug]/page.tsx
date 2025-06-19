import BoardNavComponent from "../components/BoardNavComponent";
import BoardComponent from "../components/BoardComponent";
import { useRouter } from "next/router";
import boardNavLinks from "@/src/data/boardNavLinks";

type PageProps = {
  slug: string;
};

export default function Page({ params }: { params: PageProps }) {
  return (
    <>
      <div className="flex max-w-[1200px] h-full mx-auto w-full py-[28px] gap-[24px]">
        <BoardNavComponent></BoardNavComponent>
        <BoardComponent slug={params.slug}></BoardComponent>
      </div>
    </>
  );
}

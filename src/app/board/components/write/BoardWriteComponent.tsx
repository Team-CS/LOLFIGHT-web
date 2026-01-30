import dynamic from "next/dynamic";
import { PostDto } from "@/src/common/DTOs/board/post.dto";

const WysiwygEditor = dynamic(
  () => import("@/src/common/components/WysiwygEditor"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[400px] flex items-center justify-center">
        <div className="w-[32px] h-[32px] border-[3px] border-brandcolor border-t-transparent rounded-full animate-spin" />
      </div>
    ),
  }
);

interface BoardWriteComponentProps {
  post?: PostDto;
  isEdit?: boolean;
}

const BoardWriteComponent = ({ post, isEdit }: BoardWriteComponentProps) => {
  return (
    <div className="w-full bg-white dark:bg-dark rounded-[16px] shadow-lg border border-gray-100 dark:border-branddarkborder overflow-hidden">
      {/* 헤더 */}
      <div className="flex items-center gap-[10px] px-[16px] md:px-[24px] py-[16px] border-b border-gray-100 dark:border-branddarkborder">
        <div className="w-[4px] h-[22px] bg-gradient-to-b from-brandcolor to-blue-400 rounded-full" />
        <h2 className="font-bold text-[16px] md:text-[20px]">
          {isEdit ? "글 수정하기" : "글 작성하기"}
        </h2>
      </div>

      {/* 에디터 */}
      <div className="p-[16px] md:p-[24px]">
        <WysiwygEditor post={post} isEdit={isEdit} />
      </div>
    </div>
  );
};

export default BoardWriteComponent;

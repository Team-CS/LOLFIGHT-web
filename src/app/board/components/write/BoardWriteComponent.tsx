import dynamic from "next/dynamic";
import { PostDto } from "@/src/common/DTOs/board/post.dto";

const WysiwygEditor = dynamic(
  () => import("@/src/common/components/WysiwygEditor"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
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
    <div className="w-full bg-white rounded-[12px] p-[24px] shadow-md dark:bg-dark">
      <WysiwygEditor post={post} isEdit={isEdit} />
    </div>
  );
};

export default BoardWriteComponent;

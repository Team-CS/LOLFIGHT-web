import WysiwygEditor from "@/src/common/components/WysiwygEditor";
import { PostDto } from "@/src/common/DTOs/board/post.dto";

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

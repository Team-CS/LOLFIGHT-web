import BoardPostHeadComponent from "./BoardPostHeadComponent";
import BoardPostBodyComponent from "./BoardPostBodyComponent";
import { PostDto } from "@/src/common/DTOs/board/post.dto";
import BoardPostCommentComponent from "./BoardPostCommentComponent";

interface PostProps {
  data: PostDto;
}

const BoardPostComponent = (props: PostProps) => {
  return (
    <div className="flex flex-col w-full gap-[16px]">
      <div className="bg-white dark:bg-dark rounded-[16px] shadow-lg border border-gray-100 dark:border-branddarkborder">
        <BoardPostHeadComponent post={props.data} />
        <BoardPostBodyComponent data={props.data} />
      </div>
      <div className="bg-white dark:bg-dark rounded-[16px] shadow-lg border border-gray-100 dark:border-branddarkborder">
        <BoardPostCommentComponent data={props.data} />
      </div>
    </div>
  );
};

export default BoardPostComponent;

import BoardPostHeadComponent from "./BoardPostHeadComponent";
import BoardPostBodyComponent from "./BoardPostBodyComponent";
import { PostDTO } from "@/src/common/DTOs/board/post.dto";
import BoardPostCommentComponent from "./BoardPostCommentComponent";

interface PostProps {
  data: PostDTO;
}

const BoardPostComponent = (props: PostProps) => {
  return (
    <div className="flex flex-col w-full gap-[12px]">
      <div className="bg-white rounded-[12px] shadow-md dark:bg-dark">
        <BoardPostHeadComponent post={props.data}></BoardPostHeadComponent>
        <BoardPostBodyComponent data={props.data} />
      </div>
      <div className="bg-white rounded-[12px] shadow-md dark:bg-dark">
        <BoardPostCommentComponent data={props.data} />
      </div>
    </div>
  );
};

export default BoardPostComponent;

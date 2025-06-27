import { BaseDto } from "../base.dto";
import { MemberDto } from "../member/member.dto";
import { PostDto } from "./post.dto";

export interface CommentDto extends BaseDto {
  id?: string;
  commentContent: string;
  depth: number;
  orderNumber: number;
  parentComment: string;
  isCommentForComment: boolean;
  postId: number;
  postBoardId: PostDto;
  commentDate: Date;
  writer: MemberDto;
  writerId: string;
}

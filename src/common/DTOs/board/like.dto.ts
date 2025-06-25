import { LargeNumberLike } from "crypto";
import { BaseDto } from "../base.dto";
import { PostDto } from "./post.dto";
import { MemberDto } from "../member/member.dto";

export interface LikeDTO extends BaseDto {
  id: number;
  likePost: PostDto;
  likeMember: MemberDto;
}

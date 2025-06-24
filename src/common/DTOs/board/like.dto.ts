import { LargeNumberLike } from "crypto";
import { BaseDto } from "../base.dto";
import { PostDto } from "./post.dto";
import { MemberDTO } from "../member/member.dto";

export interface LikeDTO extends BaseDto {
  id: number;
  likePost: PostDto;
  likeMember: MemberDTO;
}

import { BaseDto } from "../base.dto";
import { MemberDto } from "../member/member.dto";
import { PaginationDto } from "../pagination.dto";

export interface PostDto extends BaseDto {
  id: number;
  postTitle: string;
  postContent: string;
  postWriter: MemberDto;
  postDate: Date;
  postViews: number;
  postLikes: number;
  postComments: number;
  postBoard: string;
}

export interface PostCreateDto extends BaseDto {
  postTitle: string;
  postContent: string;
  postWriter: MemberDto;
  postBoard: string;
}

export interface PostListResponseDto extends BaseDto {
  postList: PostDto[];
  pagination: PaginationDto;
}

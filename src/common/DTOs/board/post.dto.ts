import { BaseDto } from "../base.dto";
import { PaginationDto } from "../pagination.dto";

export interface PostDto extends BaseDto {
  id: number;
  postTitle: string;
  postContent: string;
  postWriter: string;
  postDate: Date;
  postViews: number;
  postLikes: number;
  postComments: number;
  postBoard: string;
}

export interface PostCreateDto extends BaseDto {
  postTitle: string;
  postContent: string;
  postWriter: string;
  postBoard: string;
}

export interface PostListResponseDto extends BaseDto {
  postList: PostDto[];
  pagination: PaginationDto;
}

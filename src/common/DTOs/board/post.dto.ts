import { BaseDTO } from "../base.dto";

export interface PostDto extends BaseDTO {
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

export interface PostCreateDto extends BaseDTO {
  postTitle: string;
  postContent: string;
  postWriter: string;
  postBoard: string;
}

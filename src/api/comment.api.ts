import constant from "../common/constant/constant";
import axios from "axios";
import { PostDto } from "../common/DTOs/board/post.dto";
import { CommentDto } from "../common/DTOs/board/comment.dto";
import { ResponseDto } from "../common/DTOs/response.dto";
import { AxiosResponse } from "axios";
import { deleteData, getData, postData } from "../utils/axios/serverHelper";

const baseUrl = `${constant.SERVER_URL}/comment`;

/*
 * 댓글 작성
 * @param postDto, memberId, commentContent
 * @returns
 */
export const writeComment = async (
  post: PostDto,
  memberId: string,
  commentContent: string
): Promise<AxiosResponse<ResponseDto<CommentDto>>> => {
  let url = `${baseUrl}`;
  const formData = new FormData();

  formData.append("postId", post.id.toString());
  formData.append("postBoard", post.postBoard);
  formData.append("memberId", memberId);
  formData.append("commentContent", commentContent);

  const body = {
    postId: post.id,
    postBoard: post.postBoard,
    post: post,
    memberId: memberId,
    commentContent: commentContent,
  };

  return await postData(url, body);
};

/*
 * 대댓글 작성
 * @param postDto, memberId, commentContent, parentCommentId
 * @returns
 */
export const writeReplyComment = async (
  post: PostDto,
  memberId: string,
  commentContent: string,
  parentCommentId: string
): Promise<AxiosResponse<ResponseDto<CommentDto>>> => {
  let url = `${baseUrl}`;
  const formData = new FormData();

  formData.append("postId", post.id.toString());
  formData.append("postBoard", post.postBoard);
  formData.append("memberId", memberId);
  formData.append("commentContent", commentContent);
  formData.append("parentCommentId", parentCommentId);

  const body = {
    postId: post.id,
    postBoard: post.postBoard,
    post: post,
    memberId: memberId,
    commentContent: commentContent,
    parentComment: parentCommentId,
  };

  return await postData(url, body);
};

/*
 * 댓글 리스트 조회
 * @param commentDto
 * @returns
 */
export const getCommentList = async (
  post: PostDto
): Promise<AxiosResponse<ResponseDto<CommentDto[]>>> => {
  let url = `${baseUrl}`;
  const queryParams = `?postId=${post.id}&postBoard=${post.postBoard}`;
  url += queryParams;

  return await getData(url);
};

export const deleteComment = async (commentId: string): Promise<void> => {
  let url = `${baseUrl}`;
  const queryParams = `?id=${commentId}`;

  url += queryParams;

  await deleteData(url);
};

import constant from "../common/constant/constant";
import axios, { AxiosResponse } from "axios";
import {
  PostCreateDto,
  PostDto,
  PostListResponseDto,
} from "../common/DTOs/board/post.dto";
import { ResponseDto } from "../common/DTOs/response.dto";
import { LikeDTO } from "../common/DTOs/board/like.dto";
import { getData, postData } from "../utils/axios/serverHelper";

const baseUrl = `${constant.SERVER_URL}/post`;

/*
 * 게시글 작성
 * @param postDto
 * @returns
 */
export const writePost = async (
  data: PostCreateDto
): Promise<AxiosResponse<ResponseDto<PostDto>>> => {
  let url = `${baseUrl}`;

  return await postData(url, data);
};

/*
 * 게시글 목록 조회
 * @param postDto
 * @returns
 */
export const getPostList = async (
  board: string,
  page: number,
  limit: number,
  keyword?: string | null
): Promise<AxiosResponse<ResponseDto<PostListResponseDto>>> => {
  let url = `${baseUrl}/list` + `?board=${board}&page=${page}&limit=${limit}`;
  if (keyword) {
    url += `&keyword=${encodeURIComponent(keyword)}`;
  }
  return await getData(url);
};

/**
 * 게시글 최근 목록 조회
 * @param boardId
 * @returns
 */
export const getRecentPostList = async (
  boardId: number
): Promise<AxiosResponse<ResponseDto<PostDto[]>>> => {
  let url = `${baseUrl}/recentlist` + `?boardId=${boardId}`;
  return await getData(url);
};

/*
 * 게시글 내용 보기
 * @param board, postId
 * @returns
 */
export const getPostContent = async (
  board: string,
  postId: string
): Promise<AxiosResponse<ResponseDto<PostDto>>> => {
  let url = `${baseUrl}/?board=${board}&postId=${postId}`;

  return await getData(url);
};

/*
 * 게시글 추천
 * @param
 * @returns
 */
export const likePost = async (
  postDto: PostDto,
  memberId: string
): Promise<AxiosResponse<ResponseDto<LikeDTO>>> => {
  let url = `${baseUrl}/like`;

  const body = {
    postDto: postDto,
    memberId: memberId,
  };

  return await postData(url, body);
};

/*
 * 게시글 추천 여부 조회
 * @param
 * @returns
 */
export const getLike = async (
  postDto: PostDto,
  memberId: string
): Promise<AxiosResponse<ResponseDto<LikeDTO>>> => {
  let url = `${baseUrl}/getLike`;

  const body = {
    postDto: postDto,
    memberId: memberId,
  };

  return await postData(url, body);
};

/*
 * 게시글 삭제
 * @param
 * @returns
 */
export const deletePost = async (
  postDto: PostDto
): Promise<AxiosResponse<ResponseDto<PostDto>>> => {
  let url = `${baseUrl}/delete`;

  const body = {
    postDto: postDto,
  };

  return await postData(url, body);
};

export const getPopularPosts = async (
  page: number,
  limit: number,
  keyword?: string | null
): Promise<AxiosResponse<ResponseDto<PostListResponseDto>>> => {
  let url = `${baseUrl}/popular-list` + `?page=${page}&limit=${limit}`;

  if (keyword) {
    url += `&keyword=${encodeURIComponent(keyword)}`;
  }
  return await getData(url);
};

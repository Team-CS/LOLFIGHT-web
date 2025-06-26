import constant from "../common/constant/constant";
import axios, { Axios, AxiosResponse } from "axios";
import { ResponseDto } from "../common/DTOs/response.dto";
import {
  JudgmentCreateDto,
  JudgmentDto,
  JudgmentListResponseDto,
} from "../common/DTOs/judgment/judgment.dto";
import {
  deleteData,
  getData,
  patchData,
  postData,
} from "../utils/axios/serverHelper";

const baseUrl = `${constant.SERVER_URL}/judgment`;

/**
 * Judgment 생성
 * @param judgmentDto
 * @param judgmentVideo
 * @returns
 */
export const createJudgment = async (
  judgmentDto: JudgmentCreateDto,
  judgmentVideo?: File | null
): Promise<AxiosResponse<ResponseDto<JudgmentDto>>> => {
  const url = `${baseUrl}`;
  const formData = new FormData();

  formData.append("judgmentTitle", judgmentDto.judgmentTitle);
  formData.append("judgmentDesc", judgmentDto.judgmentDesc);
  formData.append("judgmentLeftChampion", judgmentDto.judgmentLeftChampion);
  formData.append("judgmentLeftName", judgmentDto.judgmentLeftName);
  formData.append("judgmentLeftTier", judgmentDto.judgmentLeftTier);
  formData.append("judgmentLeftLine", judgmentDto.judgmentLeftLine);
  formData.append("judgmentRightChampion", judgmentDto.judgmentRightChampion);
  formData.append("judgmentRightName", judgmentDto.judgmentRightName);
  formData.append("judgmentRightTier", judgmentDto.judgmentRightTier);
  formData.append("judgmentRightLine", judgmentDto.judgmentRightLine);

  if (judgmentVideo) {
    formData.append("judgmentVideo", judgmentVideo);
  }

  return await postData(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/**
 * Judgment 게시글 리스트 조회
 * @returns
 */
export const getJudgmentList = async (
  page: number,
  limit: number,
  keyword?: string | null
): Promise<AxiosResponse<ResponseDto<JudgmentListResponseDto>>> => {
  let url = `${baseUrl}/list` + `?page=${page}&limit=${limit}`;
  if (keyword) {
    url += `&keyword=${encodeURIComponent(keyword)}`;
  }
  return await getData(url);
};

/**
 * Judgment 게시글 조회
 * @param id
 * @returns
 */
export const getJudgment = async (
  id: number
): Promise<AxiosResponse<ResponseDto<JudgmentDto>>> => {
  let url = `${baseUrl}/post`;
  let queryParams = `?id=${id}`;

  url += queryParams;
  return await getData(url);
};

/**
 * Judgment 투표
 * @param faction
 * @param judgmentId
 * @param memberId
 * @returns
 */
export const voteFactionJudgment = async (
  faction: string,
  judgmentId: number,
  memberId: string
): Promise<AxiosResponse<ResponseDto<boolean>>> => {
  let url = `${baseUrl}/vote`;
  const data = {
    faction: faction,
    judgmentId: judgmentId,
    memberId: memberId,
  };

  return await patchData(url, data);
};

export const deleteJudgment = async (
  judgmentId: number
): Promise<AxiosResponse<void>> => {
  let url = `${baseUrl}?id=${judgmentId}`;
  return await deleteData(url);
};

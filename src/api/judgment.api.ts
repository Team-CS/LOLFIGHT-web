import constant from "../common/constant/constant";
import axios, { Axios, AxiosResponse } from "axios";
import { ResponseDTO } from "../common/DTOs/response.dto";
import { JudgmentDTO } from "../common/DTOs/judgment/judgment.dto";
import api from "./interceptors/axiosInstance";

const baseUrl = `${constant.SERVER_URL}/judgment`;

/**
 * Judgment 생성
 * @param judgmentDTO
 * @param judgmentVideo
 * @returns
 */
export const createJudgment = async (
  judgmentDTO: JudgmentDTO,
  judgmentVideo?: File | null
): Promise<AxiosResponse<ResponseDTO<JudgmentDTO>>> => {
  const url = `${baseUrl}`;
  const formData = new FormData();

  //   formData.append("id", judgmentDTO.id);
  formData.append("judgmentWriter", judgmentDTO.judgmentWriter);
  formData.append("judgmentTitle", judgmentDTO.judgmentTitle);
  formData.append("judgmentDesc", judgmentDTO.judgmentDesc);
  formData.append("judgmentLeftChampion", judgmentDTO.judgmentLeftChampion);
  formData.append("judgmentLeftName", judgmentDTO.judgmentLeftName);
  formData.append("judgmentLeftTier", judgmentDTO.judgmentLeftTier);
  formData.append("judgmentLeftLine", judgmentDTO.judgmentLeftLine);
  formData.append("judgmentLeftLike", String(judgmentDTO.judgmentLeftLike));
  formData.append("judgmentRightChampion", judgmentDTO.judgmentRightChampion);
  formData.append("judgmentRightName", judgmentDTO.judgmentRightName);
  formData.append("judgmentRightTier", judgmentDTO.judgmentRightTier);
  formData.append("judgmentRightLine", judgmentDTO.judgmentRightLine);
  formData.append("judgmentRightLike", String(judgmentDTO.judgmentRightLike));

  if (judgmentVideo) {
    formData.append("judgmentVideo", judgmentVideo);
  }

  return await api.post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/**
 * Judgment 게시글 리스트 조회
 * @returns
 */
export const getJudgmentList = async (): Promise<
  AxiosResponse<ResponseDTO<JudgmentDTO[]>>
> => {
  const url = `${baseUrl}/list`;
  return await axios.get(url);
};

/**
 * Judgment 게시글 조회
 * @param id
 * @returns
 */
export const getJudgment = async (
  id: number
): Promise<AxiosResponse<ResponseDTO<JudgmentDTO>>> => {
  let url = `${baseUrl}/post`;
  let queryParams = `?id=${id}`;

  url += queryParams;
  return await axios.get(url);
};

/**
 * Judgment 게시글 조회수 증가
 * @param Judgment
 * @returns
 */
export const increaseJudgment = async (
  Judgment: JudgmentDTO
): Promise<AxiosResponse<ResponseDTO<boolean>>> => {
  let url = `${baseUrl}/view`;
  return await axios.patch(url, Judgment);
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
): Promise<AxiosResponse<ResponseDTO<boolean>>> => {
  let url = `${baseUrl}/vote`;
  const data = {
    faction: faction,
    judgmentId: judgmentId,
    memberId: memberId,
  };

  return await api.patch(url, data);
};

/**
 * Judgment 투표여부 조회
 * @param judgmentId
 * @param memberId
 * @returns
 */
export const getVoteFaction = async (
  judgmentId: number,
  memberId: string
): Promise<AxiosResponse<ResponseDTO<string>>> => {
  let url = `${baseUrl}/getvote`;
  const data = {
    judgmentId: judgmentId,
    memberId: memberId,
  };

  return await axios.post(url, data);
};

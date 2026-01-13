import axios, { AxiosResponse } from "axios";
import constant from "../common/constant/constant";
import { ResponseDto } from "../common/DTOs/response.dto";
import {
  BetDto,
  BetListResponseDto,
  CreateBetDto,
  ProMatchDto,
} from "../common/DTOs/bet/bet.dto";
import { deleteData, getData, postData } from "../utils/axios/serverHelper";

const baseUrl = `${constant.SERVER_URL}/bet`;

export const getMatch = async (
  riotMatchId: string
): Promise<AxiosResponse<ResponseDto<ProMatchDto>>> => {
  let url = `${baseUrl}/matches/${riotMatchId}`;
  return await axios.get(url);
};

export const createBet = async (
  createBetDto: CreateBetDto
): Promise<AxiosResponse<ResponseDto<BetDto>>> => {
  let url = `${baseUrl}/create`;

  return postData(url, createBetDto);
};

export const getMyBets = async (
  page: number,
  limit: number,
  keyword?: string | null
): Promise<AxiosResponse<ResponseDto<BetListResponseDto>>> => {
  let url = `${baseUrl}/my` + `?page=${page}&limit=${limit}`;
  if (keyword) {
    url += `&keyword=${encodeURIComponent(keyword)}`;
  }

  return getData(url);
};

export const cancelBet = async (betId: string): Promise<void> => {
  let url = `${baseUrl}/${betId}`;

  await deleteData(url);
};

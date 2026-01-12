import axios, { AxiosResponse } from "axios";
import constant from "../common/constant/constant";
import { ResponseDto } from "../common/DTOs/response.dto";
import { BetDto, CreateBetDto, ProMatchDto } from "../common/DTOs/bet/bet.dto";
import { postData } from "../utils/axios/serverHelper";

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
  let url = `${baseUrl}/bets`;

  return postData(url, createBetDto);
};

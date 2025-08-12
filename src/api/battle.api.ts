import {
  BattleDto,
  BattleListResponseDto,
} from "../common/DTOs/battle/battle.dto";
import { ResponseDto } from "../common/DTOs/response.dto";
import constant from "../common/constant/constant";
import axios, { AxiosResponse } from "axios";

const baseUrl = `${constant.SERVER_URL}/battle`;

/**
 * Battle 길드 리스트
 * @returns
 */
export const getBattleList = async (
  guildName: string,
  page: number,
  limit: number
): Promise<AxiosResponse<ResponseDto<BattleListResponseDto>>> => {
  let url = `${baseUrl}/list`;
  let queryParams = `?guildName=${guildName}&page=${page}&limit=${limit}`;

  url += queryParams;

  return await axios.get(url);
};

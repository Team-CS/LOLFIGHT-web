import constant from "../common/constant/constant";
import { StandingsResponseDto } from "../common/DTOs/league_standing.dto";
import { ResponseDto } from "../common/DTOs/response.dto";
import { getData } from "../utils/axios/serverHelper";
import { AxiosResponse } from "axios";

const baseUrl = `${constant.SERVER_URL}/riot`;

export const getStandings = async (): Promise<
  AxiosResponse<ResponseDto<StandingsResponseDto>>
> => {
  let url = `${baseUrl}/standing`;

  return await getData(url);
};

import { AxiosResponse } from "axios";
import {
  CreateScrimSlotDto,
  ScrimSlotDto,
  ScrimSlotListDto,
} from "../common/DTOs/scrim/scrim_slot.dto";
import constant from "../common/constant/constant";
import { getData, postData } from "../utils/axios/serverHelper";
import { ResponseDto } from "../common/DTOs/response.dto";
import {
  CreateScrimApplicationDto,
  ScrimApplicationDto,
} from "../common/DTOs/scrim/scrim_application.dto";

const baseUrl = `${constant.SERVER_URL}/scrim`;

export const createScrimSlot = async (
  createScrimSlotDto: CreateScrimSlotDto
): Promise<AxiosResponse<ResponseDto<ScrimSlotDto>>> => {
  let url = `${baseUrl}`;

  return await postData(url, createScrimSlotDto);
};

export const applyScrim = async (
  scrimSlotId: string,
  createScrimApplicationDto: CreateScrimApplicationDto
): Promise<AxiosResponse<ResponseDto<ScrimApplicationDto>>> => {
  let url = `${baseUrl}/${scrimSlotId}/apply`;

  return await postData(url, createScrimApplicationDto);
};

export const getScrimSlotList = async (
  page: number,
  limit: number,
  keyword?: string | null
): Promise<AxiosResponse<ResponseDto<ScrimSlotListDto>>> => {
  let url = `${baseUrl}/list` + `?page=${page}&limit=${limit}`;
  if (keyword) {
    url += `&keyword=${encodeURIComponent(keyword)}`;
  }
  return await getData(url);
};

export const getScrimApplicationList = async (): Promise<
  AxiosResponse<ResponseDto<ScrimApplicationDto[]>>
> => {
  let url = `${baseUrl}/application/list`;

  return await getData(url);
};

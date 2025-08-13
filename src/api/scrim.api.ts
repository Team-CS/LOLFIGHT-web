import { AxiosResponse } from "axios";
import {
  CreateScrimSlotDto,
  ScrimSlotDto,
  ScrimSlotListDto,
} from "../common/DTOs/scrim/scrim_slot.dto";
import constant from "../common/constant/constant";
import {
  deleteData,
  getData,
  patchData,
  postData,
} from "../utils/axios/serverHelper";
import { ResponseDto } from "../common/DTOs/response.dto";
import {
  CreateScrimApplicationDto,
  ScrimApplicationDecisionDto,
  ScrimApplicationDto,
  ScrimApplicationRematchDto,
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

export const getScrimSlot = async (
  hostTeamId: string
): Promise<AxiosResponse<ResponseDto<ScrimSlotDto>>> => {
  const url = `${baseUrl}/my-team-slot/${hostTeamId}`;

  return await getData(url);
};

export const getScrimApplicationList = async (): Promise<
  AxiosResponse<ResponseDto<ScrimApplicationDto[]>>
> => {
  let url = `${baseUrl}/application/list`;

  return await getData(url);
};

export const acceptScrimApplcation = async (
  scrimApplicationDecisionDto: ScrimApplicationDecisionDto
): Promise<AxiosResponse<ResponseDto<ScrimApplicationDto>>> => {
  let url = `${baseUrl}/application/accept`;

  return await patchData(url, scrimApplicationDecisionDto);
};

export const rejectScrimApplcation = async (
  scrimApplicationDecisionDto: ScrimApplicationDecisionDto
): Promise<AxiosResponse<ResponseDto<ScrimApplicationDto>>> => {
  let url = `${baseUrl}/application/reject`;

  return await patchData(url, scrimApplicationDecisionDto);
};

export const deleteScrimSlot = async (
  scrimSlotId: string
): Promise<AxiosResponse<ResponseDto<void>>> => {
  let url = `${baseUrl}/${scrimSlotId}`;

  return await deleteData(url);
};

export const cancelScrim = async (
  scrimSlotId: string,
  guildTeamId: string
): Promise<AxiosResponse<ResponseDto<void>>> => {
  let url = `${baseUrl}/cancel`;
  const data = {
    scrimSlotId: scrimSlotId,
    guildTeamId: guildTeamId,
  };

  return await patchData(url, data);
};

export const rematchScrim = async (
  scrimApplicationRematchDto: ScrimApplicationRematchDto
): Promise<AxiosResponse<ResponseDto<ScrimApplicationDto>>> => {
  let url = `${baseUrl}/rematch`;

  return await patchData(url, scrimApplicationRematchDto);
};

import { AxiosResponse } from "axios";
import constant from "../common/constant/constant";
import {
  CreateGuildTeamDto,
  GuildTeamDto,
  UpdateGuildTeamDto,
} from "../common/DTOs/guild/guild_team/guild_team.dto";
import { ResponseDto } from "../common/DTOs/response.dto";
import {
  deleteData,
  getData,
  patchData,
  postData,
} from "../utils/axios/serverHelper";
import { GuildTeamInviteDto } from "../common/DTOs/guild/guild_team/guild_team_invite.dto";

const baseUrl = `${constant.SERVER_URL}/guild_team`;

export const createGuildTeam = async (
  createGuildTeamDto: CreateGuildTeamDto
): Promise<AxiosResponse<ResponseDto<GuildTeamDto>>> => {
  let url = `${baseUrl}`;

  return await postData(url, createGuildTeamDto);
};

export const getMyGuildTeam = async (): Promise<
  AxiosResponse<ResponseDto<GuildTeamDto>>
> => {
  let url = `${baseUrl}/me`;

  return await getData(url);
};

export const getMyInviteList = async (): Promise<
  AxiosResponse<ResponseDto<GuildTeamInviteDto[]>>
> => {
  let url = `${baseUrl}/invite/me`;

  return await getData(url);
};

export const acceptGuildTeamInvite = async (
  inviteId: string
): Promise<void> => {
  let url = `${baseUrl}/invite/accept`;

  await patchData(url, { inviteId });
};

export const rejectGuildTeamInvite = async (
  inviteId: string
): Promise<void> => {
  let url = `${baseUrl}/invite/reject`;

  await patchData(url, { inviteId });
};

export const guildTeamUpdate = async (
  updateGuildTeamDto: UpdateGuildTeamDto
): Promise<AxiosResponse<ResponseDto<GuildTeamDto>>> => {
  let url = `${baseUrl}/update`;

  return await patchData(url, updateGuildTeamDto);
};

export const leaveGuildTeam = async (teamId: string): Promise<void> => {
  let url = `${baseUrl}/leave-team`;

  let queryParams = `?teamId=${teamId}`;
  url += queryParams;

  await deleteData(url);
};

export const deleteGuildTeam = async (leaderId: string): Promise<void> => {
  let url = `${baseUrl}`;

  let queryParams = `?leaderId=${leaderId}`;
  url += queryParams;

  await deleteData(url);
};

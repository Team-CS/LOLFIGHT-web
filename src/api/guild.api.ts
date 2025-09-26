import constant from "../common/constant/constant";
import axios, { AxiosResponse } from "axios";
import { ResponseDto } from "../common/DTOs/response.dto";
import {
  CreateGuildDto,
  GuildDto,
  GuildListResponseDto,
} from "../common/DTOs/guild/guild.dto";
import { MemberDto } from "../common/DTOs/member/member.dto";
import { GuildInviteDto } from "../common/DTOs/guild/guild_invite.dto";
import {
  deleteData,
  getData,
  patchData,
  postData,
} from "../utils/axios/serverHelper";

const baseUrl = `${constant.SERVER_URL}/guild`;

/**
 * Guild 생성
 * @param GuildDto
 * @returns
 */
export const createGuild = async (
  CreateGuildDto: CreateGuildDto,
  guildImage?: File | null
): Promise<AxiosResponse<ResponseDto<GuildDto>>> => {
  let url = `${baseUrl}`;

  const formData = new FormData();

  // formData.append("guildMaster", CreateGuildDto.guildMaster);
  formData.append("guildName", CreateGuildDto.guildName);
  formData.append("guildDescription", CreateGuildDto.guildDescription);
  if (guildImage) {
    formData.append("guildImage", guildImage);
  }

  return await postData(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/**
 * Guild 길드 리스트
 * @returns
 */
export const getGuildList = async (
  page: number,
  limit: number,
  keyword?: string | null
): Promise<AxiosResponse<ResponseDto<GuildListResponseDto>>> => {
  let url = `${baseUrl}/list` + `?page=${page}&limit=${limit}`;
  if (keyword) {
    url += `&keyword=${encodeURIComponent(keyword)}`;
  }
  return await getData(url);
};

export const getTopGuilds = async (): Promise<
  AxiosResponse<ResponseDto<GuildListResponseDto>>
> => {
  let url = `${baseUrl}/top3`;
  return await getData(url);
};

/**
 * Guild 정보
 * @param guildName
 * @returns
 */
export const getGuildInfo = async (
  guildName: string
): Promise<AxiosResponse<ResponseDto<GuildDto>>> => {
  let url = `${baseUrl}/info`;

  const queryParams = `?name=${guildName}`;
  url += queryParams;
  return await getData(url);
};

/**
 * guild 길드원 추방
 * @param memberName
 * @param guildName
 * @returns
 */
export const expulsionGuildMember = async (
  memberName: string,
  guildName: string
): Promise<AxiosResponse<ResponseDto<GuildDto>>> => {
  let url = `${baseUrl}/expulsion`;

  const queryParams = `?member_name=${memberName}&guild_name=${guildName}`;

  url += queryParams;

  return await patchData(url);
};

/**
 * Guild 해체
 * @param guildName
 * @returns
 */
export const destroyGuild = async (
  guildName: string
): Promise<AxiosResponse<ResponseDto<GuildDto>>> => {
  let url = `${baseUrl}`;

  const queryParams = `?name=${guildName}`;
  url += queryParams;
  return await deleteData(url);
};

/**
 * Guild-Invite 길드 가입신청
 * @param guildInviteDto
 * @returns
 */
export const inviteGuild = async (
  applicationText: string,
  memberId: string,
  guildId: string
): Promise<AxiosResponse<ResponseDto<GuildInviteDto>>> => {
  let url = `${baseUrl}/invite`;

  const body = {
    applicationText: applicationText,
    memberId: memberId,
    guildId: guildId,
  };

  return await postData(url, body);
};

/**
 * Guild-Invite 길드 가입신청자 리스트
 * @param guildName
 * @returns
 */
export const getInviteGuildList = async (
  guildName: string
): Promise<AxiosResponse<ResponseDto<GuildInviteDto[]>>> => {
  let url = `${baseUrl}/invite/list`;

  const queryParams = `?name=${guildName}`;
  url += queryParams;

  return await getData(url);
};

/**
 * Guild-Invite 길드 가입신청 수락
 * @param memberId
 * @param guildId
 * @returns
 */
export const inviteAccept = async (
  memberId: string,
  guildId: string
): Promise<AxiosResponse<ResponseDto<MemberDto>>> => {
  let url = `${baseUrl}/invite/accept`;

  const queryParams = `?memberId=${memberId}&guildId=${guildId}`;
  url += queryParams;

  return await getData(url);
};

/**
 * Guild-Invite 길드 가입신청 거절
 * @param memberId
 * @param guildId
 * @returns
 */
export const inviteReject = async (
  memberId: string,
  guildId: string
): Promise<AxiosResponse<ResponseDto<MemberDto>>> => {
  let url = `${baseUrl}/invite/reject`;

  const queryParams = `?memberId=${memberId}&guildId=${guildId}`;
  url += queryParams;

  return await getData(url);
};

/**
 * GuildMaster 변경
 * @param memberName
 * @param guildName
 * @returns
 */
export const changeGuildMaster = async (
  memberName: string,
  guildName: string
): Promise<AxiosResponse<ResponseDto<GuildDto>>> => {
  let url = `${baseUrl}/changeMaster`;

  const queryParams = `?memberName=${memberName}&guildName=${guildName}`;
  url += queryParams;

  return await getData(url);
};

export const getMembersNotInTeam = async (
  guildId: string
): Promise<AxiosResponse<ResponseDto<MemberDto[]>>> => {
  const url = `${baseUrl}/${guildId}/members/not-in-team`;
  return await getData(url);
};

export const updateGuildBanner = async (
  guildBanner: File
): Promise<AxiosResponse<ResponseDto<GuildDto>>> => {
  let url = `${baseUrl}/banner`;

  const formData = new FormData();
  formData.append("guildBanner", guildBanner);

  return await patchData(url, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const updateGuildDescription = async (
  desc: string
): Promise<AxiosResponse<ResponseDto<GuildDto>>> => {
  let url = `${baseUrl}/description`;

  return await patchData(url, { desc });
};

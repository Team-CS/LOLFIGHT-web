import constant from "../common/constant/constant";
import { MemberDto } from "../common/DTOs/member/member.dto";
import { AxiosResponse } from "axios";
import { ResponseDto } from "../common/DTOs/response.dto";
import { GuildDto } from "../common/DTOs/guild/guild.dto";
import { MemberGameDto } from "../common/DTOs/member/member_game.dto";
import { deleteData, getData, patchData } from "../utils/axios/serverHelper";

const baseUrl = `${constant.SERVER_URL}/member`;

export const getMemberData = (): Promise<
  AxiosResponse<ResponseDto<MemberDto>>
> => {
  let url = `${baseUrl}/find`;

  return getData(url);
};

export const updatePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<AxiosResponse<ResponseDto<MemberDto>>> => {
  let url = `${baseUrl}/password`;

  const body = {
    currentPassword: currentPassword,
    newPassword: newPassword,
  };

  return await patchData(url, body);
};

export const updateNickname = async (
  nickname: string
): Promise<AxiosResponse<ResponseDto<MemberDto>>> => {
  let url = `${baseUrl}/nickname`;

  const body = {
    nickname: nickname,
  };

  return await patchData(url, body);
};

/**
 * member 길드 탈퇴
 * @param id
 * @returns
 */
export const leaveMember = async (
  id: string
): Promise<AxiosResponse<ResponseDto<MemberDto>>> => {
  let url = `${baseUrl}/leave`;

  const queryParams = `?id=${id}`;

  url += queryParams;

  return patchData(url);
};

/**
 * member 찾기 (id)
 * @param id
 * @returns
 */
export const findMember = async (
  id: string
): Promise<AxiosResponse<ResponseDto<MemberDto>>> => {
  let url = `${baseUrl}/find`;

  let queryParams = `?id=${id}`;
  url += queryParams;
  return await getData(url);
};

/**
 * member 찾기 (name)
 * @param id
 * @returns
 */
export const findMemberByName = async (
  name: string
): Promise<AxiosResponse<ResponseDto<MemberDto>>> => {
  let url = `${baseUrl}/findByName`;

  let queryParams = `?name=${name}`;
  url += queryParams;
  return await getData(url);
};

/**
 * member 탈퇴
 * @param id
 * @returns
 */
export const deleteMember = async (
  id: string
): Promise<AxiosResponse<ResponseDto<MemberDto>>> => {
  let url = `${baseUrl}`;

  let queryParams = `?id=${id}`;
  url += queryParams;
  return await deleteData(url);
};

/**
 * member 아이콘 변경
 * @param MemberDto
 * @param memberIcon
 * @returns
 */
export const updateMemberIcon = async (
  memberIcon?: File | null
): Promise<AxiosResponse<ResponseDto<MemberDto>>> => {
  let url = `${baseUrl}/icon`;

  const formData = new FormData();
  if (memberIcon) {
    formData.append("memberIcon", memberIcon);
  }
  return await patchData(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateMemberGameLine = async (
  memberId: string,
  newLine: string
): Promise<AxiosResponse<ResponseDto<MemberDto>>> => {
  let url = `${baseUrl}/game-line`;

  const body = {
    id: memberId,
    line: newLine,
  };

  return await patchData(url, body);
};

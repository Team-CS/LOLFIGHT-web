import { MemberDto } from "../common/DTOs/member/member.dto";
import { ResponseDto } from "../common/DTOs/response.dto";
import constant from "../common/constant/constant";
import axios, { Axios, AxiosResponse } from "axios";

const baseUrl = `${constant.SERVER_URL}/auth`;

/**
 * 로그인
 * @param id
 * @param pw
 * @returns
 */
export const authLogin = async (id: string, pw: string) => {
  let url = `${baseUrl}/login`;
  const body = {
    id: id,
    pw: pw,
  };

  return await axios.post(url, body, { withCredentials: true });
};

/**
 * member 회원가입
 * @param MemberDto
 * @returns
 */
export const signUp = async (
  MemberDto: MemberDto
): Promise<AxiosResponse<ResponseDto<MemberDto>>> => {
  let url = `${baseUrl}`;
  const body = {
    memberId: MemberDto.memberId,
    memberPw: MemberDto.memberPw,
    memberName: MemberDto.memberName,
  };

  return await axios.post(url, body);
};

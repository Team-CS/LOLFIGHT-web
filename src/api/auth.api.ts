import { MemberDTO } from "../common/DTOs/member/member.dto";
import { ResponseDTO } from "../common/DTOs/response.dto";
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
 * @param memberDTO
 * @returns
 */
export const signUp = async (
  memberDTO: MemberDTO
): Promise<AxiosResponse<ResponseDTO<MemberDTO>>> => {
  let url = `${baseUrl}`;
  const body = {
    memberId: memberDTO.memberId,
    memberPw: memberDTO.memberPw,
    memberName: memberDTO.memberName,
  };

  return await axios.post(url, body);
};

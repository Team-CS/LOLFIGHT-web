import { MailDTO } from "../common/DTOs/mail/mail.dto";
import axios, { AxiosResponse } from "axios";
import constant from "../common/constant/constant";
import { getData, patchData, postData } from "../utils/axios/serverHelper";

const baseUrl = `${constant.SERVER_URL}/mail`;

/**
 * 메일 인증 코드 받기
 * @param mailDTO
 * @returns
 */
export const giveMailCode = async (
  mailDTO: MailDTO
): Promise<AxiosResponse<MailDTO>> => {
  let url = `${baseUrl}`;

  const body = {
    mailAddr: mailDTO.mailAddr,
  };

  return await postData(url, body);
};

/**
 * 메일 인증 코드 인증 전송
 * @param mailDTO
 * @returns
 */
export const sendMailAuth = async (
  mailDTO: MailDTO
): Promise<AxiosResponse<boolean>> => {
  let url = `${baseUrl}/auth`;

  const params = {
    mailAddr: mailDTO.mailAddr,
    mailCode: mailDTO.mailCode,
  };

  return await getData(url, { params });
};

export const resetPassword = async (mailDTO: MailDTO): Promise<void> => {
  let url = `${baseUrl}/password-reset`;

  const body = {
    mailAddr: mailDTO.mailAddr,
  };

  await postData(url, body);
};

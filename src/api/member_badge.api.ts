import { AxiosResponse } from "axios";
import constant from "../common/constant/constant";
import { ResponseDto } from "../common/DTOs/response.dto";
import { getData } from "../utils/axios/serverHelper";
import { MemberBadgeDto } from "../common/DTOs/member/member_badge.dto";

const baseUrl = `${constant.SERVER_URL}/badge`;

export const getMyBadges = async (): Promise<
  AxiosResponse<ResponseDto<MemberBadgeDto[]>>
> => {
  let url = `${baseUrl}/my`;

  return await getData(url);
};

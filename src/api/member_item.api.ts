import { AxiosResponse } from "axios";
import constant from "../common/constant/constant";
import {
  MemberActiveItemDto,
  MemberItemDto,
} from "../common/DTOs/member/member_item.dto";
import { ResponseDto } from "../common/DTOs/response.dto";
import { getData, patchData, postData } from "../utils/axios/serverHelper";

const baseUrl = `${constant.SERVER_URL}/member_item`;

export const purchaseItem = async (
  memberItemDto: MemberItemDto
): Promise<AxiosResponse<ResponseDto<MemberItemDto>>> => {
  let url = `${baseUrl}/purchase`;

  return await postData(url, memberItemDto);
};

export const getMyItems = async (): Promise<
  AxiosResponse<ResponseDto<MemberItemDto[]>>
> => {
  let url = `${baseUrl}/my-items`;

  return await getData(url);
};

export const toggleActiveItems = async (
  itemId: string
): Promise<AxiosResponse<ResponseDto<MemberActiveItemDto>>> => {
  let url = `${baseUrl}/active`;

  return await patchData(url, { itemId });
};

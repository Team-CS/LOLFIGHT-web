import { AxiosResponse } from "axios";
import constant from "../common/constant/constant";
import { ResponseDto } from "../common/DTOs/response.dto";
import { getData } from "../utils/axios/serverHelper";
import { ShopListResponseDto } from "../common/DTOs/shop/shop.dto";
import { Category } from "../common/types/enums/category.enum";

const baseUrl = `${constant.SERVER_URL}/shop`;

export const getShopItems = async (
  page: number,
  limit: number,
  category?: Category,
  keyword?: string
): Promise<AxiosResponse<ResponseDto<ShopListResponseDto>>> => {
  let url = `${baseUrl}/list` + `?page=${page}&limit=${limit}`;

  if (category) {
    url += `&category=${category}`;
  }
  if (keyword) {
    url += `&keyword=${keyword}`;
  }

  return await getData(url);
};

import { AxiosResponse } from "axios";
import constant from "../common/constant/constant";
import { ResponseDto } from "../common/DTOs/response.dto";
import { WalletDto } from "../common/DTOs/wallet/wallet.dto";
import { patchData } from "../utils/axios/serverHelper";

const baseUrl = `${constant.SERVER_URL}/wallet`;

export const checkAttendance = async (): Promise<
  AxiosResponse<ResponseDto<WalletDto>>
> => {
  let url = `${baseUrl}/attendance`;

  return await patchData(url);
};

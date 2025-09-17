import { AxiosResponse } from "axios";
import constant from "../common/constant/constant";
import { CreateReportDto } from "../common/DTOs/report/report.dto";
import { ResponseDto } from "../common/DTOs/response.dto";
import { postData } from "../utils/axios/serverHelper";

const baseUrl = `${constant.SERVER_URL}/report`;
export const reportSubmit = (
  data: CreateReportDto
): Promise<AxiosResponse<ResponseDto<Boolean>>> => {
  let url = `${baseUrl}`;

  return postData(url, data);
};

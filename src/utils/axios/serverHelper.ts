import { AxiosRequestConfig } from "axios";
import axiosService from "./axiosInstance";

function getData<ResponseData>(url: string, config?: AxiosRequestConfig) {
  return axiosService.getAxiosInstance().get<ResponseData>(url, config);
}

function postData<RequestData, ResponseData>(
  url: string,
  data?: RequestData,
  config?: AxiosRequestConfig
) {
  return axiosService.getAxiosInstance().post<ResponseData>(url, data, config);
}

function deleteData<ResponseData>(url: string, config?: AxiosRequestConfig) {
  return axiosService.getAxiosInstance().delete<ResponseData>(url, config);
}

function patchData<RequestData, ResponseData>(
  url: string,
  data?: RequestData,
  config?: AxiosRequestConfig
) {
  return axiosService.getAxiosInstance().patch<ResponseData>(url, data, config);
}

export { getData, postData, deleteData, patchData };

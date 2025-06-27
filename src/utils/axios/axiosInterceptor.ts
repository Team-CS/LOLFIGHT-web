import { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import axiosService from "./axiosInstance";
import { useMemberStore } from "@/src/common/zustand/member.zustand";
import { getCookie, removeCookie, setCookie } from "../cookie/cookie";
import { getMemberData } from "@/src/api/member.api";
//========================================================================//
//function
//========================================================================//
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (callback: () => void) => {
  refreshSubscribers.push(callback);
};

const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};
//========================================================================//

export const onRequest = (config: InternalAxiosRequestConfig) => {
  const token = getCookie("accessToken");

  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
};

export const onErrorRequest = (error: Error) => {
  return Promise.reject(error);
};

export const onResponse = (response: AxiosResponse) => response;

export const onErrorResponse = async (error: AxiosError) => {
  const { setMember } = useMemberStore.getState();
  const axiosInstance = axiosService.getAxiosInstance();
  const errorData = error.response?.data as { code?: string; message?: string };

  const originalRequest = error.config!;

  if (
    error.response?.status === 401 &&
    originalRequest &&
    !originalRequest.url?.includes("/auth/refresh")
  ) {
    const refreshToken = getCookie("refreshToken");
    console.log(refreshToken);

    if (!refreshToken) {
      alert("리프레시 토큰이 없습니다. 로그인 페이지로 이동합니다.");
      window.location.href = "/register";
      return Promise.reject(error);
    }

    if (
      errorData.code === "WRONG_TOKEN" ||
      errorData.code === "EXPIRED_TOKEN"
    ) {
      alert("잘못된 토큰입니다. 만료되었을 가능성이 큽니다.");
      removeCookie("accessToken");
      removeCookie("refreshToken");
      window.location.href = "/";
      return Promise.reject(error);
    }

    if (!isRefreshing) {
      isRefreshing = true;

      try {
        console.log("토큰 재발급 시도 중...", isRefreshing);

        const refreshTokenResponse = await axiosInstance.post(
          `${process.env.NEXT_PUBLIC_SERVER_HOST}/auth/refresh`,
          {},
          {
            headers: { Authorization: `Bearer ${refreshToken}` },
            withCredentials: true,
          }
        );

        console.log("refreshToken 재발급 응답:", refreshTokenResponse);

        if (refreshTokenResponse.data.ok) {
          // const accessToken = refreshTokenResponse.data.data.accessToken;
          // const newRefreshToken = refreshTokenResponse.data.data.refreshToken;

          const accessToken = getCookie("accessToken");
          const newRefreshToken = getCookie("refreshToken");

          onTokenRefreshed(accessToken!); // 대기 중 요청 처리

          // ✅ 최초 요청도 수동으로 재시도해서 반환
          originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
          return axiosInstance.request(originalRequest);
        }
      } catch (e) {
        alert("토큰 재발급에 실패했습니다.");
        isRefreshing = false;
        window.location.href = "/register";
        setMember(null);
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
        console.log("토큰 재발급 종료");
      }
    }

    // ✅ isRefreshing 중이면 대기 -> 이후 재시도
    return new Promise((resolve) => {
      subscribeTokenRefresh(() => {
        const newToken = getCookie("accessToken");
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        console.log("재시도하는 요청", originalRequest);
        resolve(axiosInstance.request(originalRequest));
      });
    });
  }

  return Promise.reject(error);
};

const axiosInterceptor = {
  onRequest,
  onErrorRequest,
  onResponse,
  onErrorResponse,
};

export default axiosInterceptor;

import { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import axiosService from "./axiosInstance";
import { useMemberStore } from "@/src/common/zustand/member.zustand";
import { getCookie, removeCookie, setCookie } from "../cookie/cookie";

declare module "axios" {
  export interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

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
  const token = getCookie("lf_atk");

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

  // ✅ 무한루프 방지용 플래그
  if (
    error.response?.status === 401 &&
    originalRequest &&
    !originalRequest._retry &&
    !originalRequest.url?.includes("/auth/refresh") &&
    !originalRequest.url?.includes("/register")
  ) {
    originalRequest._retry = true; // ✅ 딱 한 번만 재시도

    const refreshToken = getCookie("lf_rtk");
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
      removeCookie("lf_atk");
      removeCookie("lf_rtk");
      setMember(null);
      window.location.href = "/";
      return Promise.reject(error);
    }

    // ✅ 토큰 재발급 중이 아닌 경우
    if (!isRefreshing) {
      isRefreshing = true;

      try {
        console.log("🔁 토큰 재발급 시도 중...");

        const refreshTokenResponse = await axiosInstance.post(
          `${process.env.NEXT_PUBLIC_SERVER_HOST}/auth/refresh`,
          {},
          {
            headers: { Authorization: `Bearer ${refreshToken}` },
            withCredentials: true,
          }
        );

        console.log("🔐 토큰 재발급 응답:", refreshTokenResponse);

        if (refreshTokenResponse.data.ok) {
          const accessToken = getCookie("lf_atk");
          onTokenRefreshed(accessToken!);

          originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
          return axiosInstance.request(originalRequest);
        } else {
          throw new Error("refreshToken 응답 실패");
        }
      } catch (e) {
        console.error("❌ 토큰 재발급 실패:", e);
        removeCookie("lf_atk");
        removeCookie("lf_rtk");
        setMember(null);
        window.location.href = "/register";
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
        console.log("🔚 토큰 재발급 종료");
      }
    }

    // ✅ 토큰 재발급 대기 중이면 구독 대기 → 완료 후 재시도
    return new Promise((resolve) => {
      subscribeTokenRefresh(() => {
        const newToken = getCookie("lf_rtk");
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        console.log("⏱ 재시도하는 요청", originalRequest);
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

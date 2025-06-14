import { Cookies } from "react-cookie";

const cookies = new Cookies();

export const setCookie = (
  name: string,
  value: string,
  options?: Record<string, any>
): void => {
  cookies.set(name, value, { ...options });
};

export const getCookie = (name: string): string | undefined => {
  return cookies.get(name);
};

export const removeCookie = (name: string): void => {
  cookies.remove(name, { path: "/" });
};

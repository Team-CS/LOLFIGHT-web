import { BooleanType } from "../types/boolean.type";

export interface ResponseDto<T> {
  isSuccess: BooleanType;
  code: string;
  message: string;
  count: number;
  data: T;
}

import { BaseDto } from "../base.dto";

export interface MailDTO extends BaseDto {
  id?: string;
  mailAddr: string;
  mailCode: string;
  mailStatus: string;
}

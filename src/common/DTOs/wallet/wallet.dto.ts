import { BaseDto } from "../base.dto";

export interface WalletDto extends BaseDto {
  id: string;
  point: number;
  lastAttendance: Date;
  attendanceStreak: number;
}

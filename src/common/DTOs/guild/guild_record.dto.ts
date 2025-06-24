import { BaseDto } from "../base.dto";

export interface GuildRecrodDTO extends BaseDto {
  id: string;
  recordLadder: number;
  recordVictory: number;
  recordDefeat: number;
  recordRanking: string;
}

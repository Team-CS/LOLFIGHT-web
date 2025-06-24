import { BaseDto } from "../base.dto";

export interface MemberGameDTO extends BaseDto {
  id: string;
  gameName: string;
  gameTier: string;
}

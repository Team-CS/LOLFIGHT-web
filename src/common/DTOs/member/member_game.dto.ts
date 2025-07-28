import { BaseDto } from "../base.dto";

export interface MemberGameDto extends BaseDto {
  id: string;
  gameName: string;
  gameTier: string;
  line: string;
}

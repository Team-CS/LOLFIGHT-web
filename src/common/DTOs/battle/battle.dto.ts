import { BaseDto } from "../base.dto";
import { PaginationDto } from "../pagination.dto";
import { BattleTeamDto } from "./battle_team.dto";

export interface BattleDto extends BaseDto {
  id: string;
  matchId: number;
  battleMode: string;
  battleLength: number;
  redTeam: BattleTeamDto;
  blueTeam: BattleTeamDto;
}

export interface BattleListResponseDto {
  battleList: BattleDto[];
  pagination: PaginationDto;
}

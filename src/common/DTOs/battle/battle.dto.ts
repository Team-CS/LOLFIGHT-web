import { BaseDto } from "../base.dto";
import { PaginationDto } from "../pagination.dto";
import { BattleTeamDTO } from "./battle_team.dto";

export interface BattleDto extends BaseDto {
  id: string;
  matchId: number;
  battleMode: string;
  battleLength: number;
  redTeam: BattleTeamDTO;
  blueTeam: BattleTeamDTO;
}

export interface BattleListResponseDto {
  battleList: BattleDto[];
  pagination: PaginationDto;
}

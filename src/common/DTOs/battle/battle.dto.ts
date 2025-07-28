import { BaseDto } from "../base.dto";
import { BattleTeamDTO } from "./battle_team.dto";

export interface BattleDTO extends BaseDto {
  id: string;
  battleId: number;
  battleMode: string;
  battleLength: number;
  teamA: BattleTeamDTO;
  teamB: BattleTeamDTO;
}

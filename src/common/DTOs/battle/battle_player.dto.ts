import { BaseDto } from "../base.dto";

export interface BattlePlayerDTO extends BaseDto {
  id: string;
  championId: number;
  summonerName: string;
  detectedTeamPosition: string;
  items: string;
  spell1Id: number;
  spell2Id: number;
  killed: number;
  deaths: number;
  assists: number;
  gold: number;
  level: number;
  minionsKilled: number;
  totalDamage: number;
  totalChampionsDamage: number;
  visionScore: number;

  perk0: number;
  perk1: number;
  perk2: number;
  perk3: number;
  perk4: number;
  perk5: number;

  perkSub: number;
}

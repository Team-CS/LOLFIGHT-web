import { BaseDto } from "../base.dto";

export interface BattlePlayerDto extends BaseDto {
  id: string;
  championId: number;
  summonerName: string;
  puuid: string;
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
  primaryPerkStyle: string;
  subPerkStyle: string;
}

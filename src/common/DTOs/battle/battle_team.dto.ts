import { BaseDto } from "../base.dto";
import { GuildDto } from "../guild/guild.dto";
import { BattlePlayerDto } from "./battle_player.dto";

export interface BattleTeamDto extends BaseDto {
  id: string;
  isWinning: boolean;
  point: number;
  guild: GuildDto | null;
  bans: number[];
  destroyedTowerCount: number; // 부순 타워 개수
  dragonCount: number; // 먹은 드래곤 개수
  baronCount: number; // 먹은 바론 개수
  atakhanCount: number; // 아타칸 개수
  hordeCount: number; // 공허유충 개수
  inhibitorCount: number; // 억제기 개수
  riftHeraldCount: number; // 전령 개수
  topPlayer: BattlePlayerDto;
  junglePlayer: BattlePlayerDto;
  midPlayer: BattlePlayerDto;
  adcPlayer: BattlePlayerDto;
  supportPlayer: BattlePlayerDto;
}

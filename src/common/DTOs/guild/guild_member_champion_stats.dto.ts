import { BaseDto } from "../base.dto";

export interface GuildMemberChampionStatsDto extends BaseDto {
  id: string;
  memberId: string;
  memberName: string;
  guildId: string;
  championId: number;
  wins: number;
  losses: number;
  totalKills: number;
  totalDeaths: number;
  totalAssists: number;
  gamesPlayed: number;
  winRate: number;
  avgKDA: number;
}

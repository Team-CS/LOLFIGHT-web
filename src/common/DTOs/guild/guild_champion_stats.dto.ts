import { BaseDto } from "../base.dto";
import { PaginationDto } from "../pagination.dto";

export interface GuildChampionStatsDto extends BaseDto {
  id: string;
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

export interface GuildChampionStatsListResponseDto extends BaseDto {
  stats: GuildChampionStatsDto[];
  pagination?: PaginationDto;
}

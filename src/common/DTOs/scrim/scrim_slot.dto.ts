import { GuildTeamDto } from "../guild/guild_team/guild_team.dto";
import { PaginationDto } from "../pagination.dto";
import { ScrimApplicationDto } from "./scrim_application.dto";

export interface ScrimSlotDto {
  id: string;
  hostTeam: GuildTeamDto;
  scheduledAt: Date;
  note: string;
  totalGameCount: number;
  currentGameCount: number;
  status: string;
  code: string;
  applications: ScrimApplicationDto[];
}

export interface CreateScrimSlotDto {
  hostTeam: GuildTeamDto;
  scheduledAt: Date;
  note: string;
  totalGameCount: number;
}

export interface ScrimSlotListDto {
  scrimSlotList: ScrimSlotDto[];
  pagination: PaginationDto;
}

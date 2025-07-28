import { GuildTeamDto } from "../guild/guild_team/guild_team.dto";
import { ScrimSlotDto } from "./scrim_slot.dto";

export interface ScrimApplicationDto {
  id: string;
  scrimSlot: ScrimSlotDto;
  applicationTeam: GuildTeamDto;
  status: string;
}

export interface CreateScrimApplicationDto {
  applicationTeam: GuildTeamDto;
}

export interface ScrimApplicationDecisionDto {
  id: string;
  scrimSlot: string;
  applicationTeam: string;
}

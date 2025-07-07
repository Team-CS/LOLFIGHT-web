import { Position } from "@/src/common/types/enums/position.enum";
import { MemberDto } from "../../member/member.dto";
import { GuildTeamDto } from "./guild_team.dto";

export interface GuildTeamMemberDto {
  id: string;
  team: GuildTeamDto;
  member: MemberDto;
  position: Position;
}

export interface CreateGuildTeamMemberDto {
  team?: string;
  member: string;
  position: Position;
}

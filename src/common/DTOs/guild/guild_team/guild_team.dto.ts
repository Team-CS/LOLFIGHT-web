import { MemberDto } from "../../member/member.dto";
import { GuildDto } from "../guild.dto";
import {
  CreateGuildTeamMemberDto,
  GuildTeamMemberDto,
} from "./guild_team_member.dto";

export interface GuildTeamDto {
  id: string;
  guild: GuildDto;
  leader: MemberDto;
  members: GuildTeamMemberDto[];
}

export interface CreateGuildTeamDto {
  guild: string;
  leader: string;
  members: CreateGuildTeamMemberDto[];
}

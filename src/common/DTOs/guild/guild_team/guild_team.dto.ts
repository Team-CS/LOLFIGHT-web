import { BaseDto } from "../../base.dto";
import { MemberDto } from "../../member/member.dto";
import { GuildDto } from "../guild.dto";
import {
  CreateGuildTeamMemberDto,
  GuildTeamMemberDto,
  UpdateGuildTeamMemberDto,
} from "./guild_team_member.dto";

export interface GuildTeamDto extends BaseDto {
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

export interface UpdateGuildTeamDto {
  id: string;
  leader: string;
  members: UpdateGuildTeamMemberDto[];
}

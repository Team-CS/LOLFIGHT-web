import { BaseDto } from "../base.dto";
import { MemberDto } from "../member/member.dto";
import { PaginationDto } from "../pagination.dto";
import { GuildRecrodDTO } from "./guild_record.dto";

export interface GuildDto extends BaseDto {
  id: string;
  guildMaster: string;
  guildName: string;
  guildMembers: MemberDto[];
  memberCount: number;
  guildDescription: string;
  guildTier: string;
  guildIcon: string;
  guildRecord: GuildRecrodDTO | null;
}

export interface CreateGuildDto extends BaseDto {
  guildMaster: string;
  guildName: string;
  guildDescription: string;
  guildIcon: string;
}

export interface GuildListResponseDto extends BaseDto {
  guildList: GuildDto[];
  pagination: PaginationDto;
}

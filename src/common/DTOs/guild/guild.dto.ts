import { BaseDTO } from "../base.dto";
import { MemberDTO } from "../member/member.dto";
import { GuildRecrodDTO } from "./guild_record.dto";

export interface GuildDTO extends BaseDTO {
  id: string;
  guildMaster: string;
  guildName: string;
  guildMembers: MemberDTO[];
  memberCount: number;
  guildDescription: string;
  guildTier: string;
  guildIcon: string;
  guildRecord: GuildRecrodDTO | null;
}

export interface CreateGuildDTO extends BaseDTO {
  guildMaster: string;
  guildName: string;
  guildDescription: string;
  guildIcon: string;
}

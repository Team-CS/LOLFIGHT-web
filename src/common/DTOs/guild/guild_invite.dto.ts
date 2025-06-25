import { BaseDto } from "../base.dto";
import { MemberDto } from "../member/member.dto";
import { GuildDto } from "./guild.dto";

export interface GuildInviteDTO extends BaseDto {
  id: string;
  member: MemberDto | null;
  guild: GuildDto | null;
}

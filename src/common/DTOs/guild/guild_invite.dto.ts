import { BaseDto } from "../base.dto";
import { MemberDto } from "../member/member.dto";
import { GuildDto } from "./guild.dto";

export interface GuildInviteDto extends BaseDto {
  id: string;
  applicationText: string;
  member: MemberDto | null;
  guild: GuildDto | null;
}

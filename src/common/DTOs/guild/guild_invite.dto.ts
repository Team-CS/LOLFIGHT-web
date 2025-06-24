import { BaseDto } from "../base.dto";
import { MemberDTO } from "../member/member.dto";
import { GuildDto } from "./guild.dto";

export interface GuildInviteDTO extends BaseDto {
  id: string;
  member: MemberDTO | null;
  guild: GuildDto | null;
}

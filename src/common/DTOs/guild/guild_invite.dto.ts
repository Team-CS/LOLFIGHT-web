import { BaseDTO } from "../base.dto";
import { MemberDTO } from "../member/member.dto";
import { GuildDTO } from "./guild.dto";

export interface GuildInviteDTO extends BaseDTO {
  id: string;
  member: MemberDTO | null;
  guild: GuildDTO | null;
}

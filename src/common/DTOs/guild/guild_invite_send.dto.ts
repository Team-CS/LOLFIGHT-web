import { BaseDto } from "../base.dto";
import { MemberDTO } from "../member/member.dto";
import { GuildDto } from "./guild.dto";

export interface GuildInviteSendDTO extends BaseDto {
  id: string;
  memberId: string | undefined;
  guildId: string | undefined;
}

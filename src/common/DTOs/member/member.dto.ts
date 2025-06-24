import { BaseDto } from "../base.dto";
import { GuildDto } from "../guild/guild.dto";
import { MemberGameDTO } from "./member_game.dto";

export interface MemberDTO extends BaseDto {
  id: string;
  memberId: string;
  memberPw: string;
  memberName: string;
  memberIcon: string;
  memberGuild: GuildDto | null;
  memberGame: MemberGameDTO | null;
}

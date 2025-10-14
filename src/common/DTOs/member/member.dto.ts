import { BaseDto } from "../base.dto";
import { GuildDto } from "../guild/guild.dto";
import { MemberGameDto } from "./member_game.dto";

export interface MemberDto extends BaseDto {
  id: string;
  memberId: string;
  memberPw: string;
  memberName: string;
  memberIcon: string;
  type: string;
  role: string;
  memberGuild: GuildDto | null;
  memberGame: MemberGameDto | null;
}

export interface MemberPublicDto extends BaseDto {
  id: string;
  memberName: string;
  memberIcon: string;
  memberGuild: GuildDto | null;
  memberGame: MemberGameDto | null;
}

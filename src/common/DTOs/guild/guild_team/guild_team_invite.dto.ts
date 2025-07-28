import { Position } from "@/src/common/types/enums/position.enum";
import { MemberDto } from "../../member/member.dto";
import { GuildTeamDto } from "./guild_team.dto";

export interface GuildTeamInviteDto {
  id: string;
  team: GuildTeamDto;
  member: MemberDto;
  status: string;
  position: Position;
}

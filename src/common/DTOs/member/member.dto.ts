import { BaseDto } from "../base.dto";
import { GuildDto } from "../guild/guild.dto";
import { WalletDto } from "../wallet/wallet.dto";
import { MemberBadgeDto } from "./member_badge.dto";
import { MemberGameDto } from "./member_game.dto";
import { MemberActiveItemDto, MemberItemDto } from "./member_item.dto";

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
  memberWallet: WalletDto;
  memberItem: MemberActiveItemDto | null;
  memberBadge: MemberBadgeDto[] | null;
}

export interface MemberPublicDto extends BaseDto {
  id: string;
  memberName: string;
  memberIcon: string;
  memberGuild: GuildDto | null;
  memberGame: MemberGameDto | null;
  memberItem: MemberActiveItemDto | null;
  memberBadge: MemberBadgeDto[] | null;
}

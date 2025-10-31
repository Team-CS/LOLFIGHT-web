import { BaseDto } from "../base.dto";
import { ShopDto } from "../shop/shop.dto";
import { MemberDto } from "./member.dto";

export interface MemberItemDto extends BaseDto {
  id?: string;
  member: MemberDto;
  shop: ShopDto;
  isActive?: boolean;
}

export interface MemberActiveItemDto {
  banner: string;
  border: string;
  effect: string;
}

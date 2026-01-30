import { BadgeCategory, BadgeCode } from "../../types/enums/badge.enum";
import { BaseDto } from "../base.dto";
import { ShopDto } from "../shop/shop.dto";
import { MemberDto } from "./member.dto";

export interface MemberBadgeDto extends BaseDto {
  id: string | null;
  badge: BadgeDto;
  earnedAt: Date | null;
  championId: number | null;
}

export interface BadgeDto extends BaseDto {
  id: string;
  code: BadgeCode;
  name: string;
  description: string;
  category: BadgeCategory;
  displayOrder: number;
  color: string;
}

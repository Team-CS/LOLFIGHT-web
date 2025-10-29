import { Category } from "../../types/enums/category.enum";
import { BaseDto } from "../base.dto";
import { PaginationDto } from "../pagination.dto";

export interface ShopDto {
  id: string;
  name: string;
  category: Category;
  price: number;
  cssClass?: string;
  imageUrl?: string;
  isActive: boolean;
}

export interface ShopListResponseDto extends BaseDto {
  shopList: ShopDto[];
  pagination: PaginationDto;
}

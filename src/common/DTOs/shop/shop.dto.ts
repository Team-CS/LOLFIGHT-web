import { Category } from "../../types/enums/category.enum";

export interface ShopDto {
  id: string;
  name: string;
  category: Category;
  price: number;
  imageUrl: string;
}

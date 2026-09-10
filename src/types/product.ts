import type { Category } from "./category";
import type { ProductVariant } from "./product-variant";

export interface Product {
  id: string;
  name: string;
  description: string | null;
  material: string | null;
  care_instructions: string | null;
  category: Category;
  variants: ProductVariant[];
  created_at: string;
  updated_at: string;
}

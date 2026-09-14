import type { ProductVariant } from "./product-variant";

export interface CartItem {
  id: string;
  productVariant: ProductVariant;
  quantity: number;
  created_at: string;
  updated_at: string;
}

import type { Product } from "./product";

export interface ProductVariant {
  id: string;
  size: string;
  color: string;
  price: number;
  stock_quantity: number;
  sku: string;
  product: Product;
  created_at: string;
  updated_at: string;
}

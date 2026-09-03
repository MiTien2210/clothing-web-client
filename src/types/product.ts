import type { Category } from "./category";

export interface Product {
  id: string;
  name: string;
  description: string | null;
  material: string | null;
  care_instructions: string | null;
  category: Category;
  created_at: string;
  updated_at: string;
}

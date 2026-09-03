export interface Category {
  id: string;
  name: string;
  parent: Category | null;
  children: Category[];
  created_at: string;
}

import axiosClient from "./axiosClient";
import type { Product } from "../types/product";

export interface PaginationProducts {
  data: Product[];
  total: number;
  page: number;
  limit: number;
}
export interface ProductFilters {
  sizes: string[];
  colors: string[];
  materials: string[];
}

export const getProductsApi = (params?: {
  page?: number;
  limit?: number;
  categoryId?: string;
  search?: string;
  size?: string;
  color?: string;
  material?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "newest" | "price_asc" | "price_desc";
}) => {
  return axiosClient.get<PaginationProducts>("/products", { params });
};

export const createProductApi = (payload: {
  name: string;
  description?: string;
  material?: string;
  care_instructions?: string;
  categoryId: string;
}) => {
  return axiosClient.post<Product>("/products", payload);
};

export const updateProductApi = (
  id: string,
  payload: {
    name?: string;
    description?: string;
    material?: string;
    care_instructions?: string;
    categoryId?: string;
  },
) => {
  return axiosClient.patch<Product>(`/products/${id}`, payload);
};

export const deleteProductApi = (id: string) => {
  return axiosClient.delete(`/products/${id}`);
};

export const getProductByIdApi = (id: string) => {
  return axiosClient.get<Product>(`/products/${id}`);
};

export const getRelatedProductsApi = (id: string) => {
  return axiosClient.get<Product[]>(`/products/${id}/related`);
};

export const getProductFiltersApi = () => {
  return axiosClient.get<ProductFilters>("/products/filters");
};

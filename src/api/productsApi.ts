import axiosClient from "./axiosClient";
import type { Product } from "../types/product";

export const getProductsApi = () => {
  return axiosClient.get<Product[]>("/products");
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

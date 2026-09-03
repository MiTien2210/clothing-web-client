import axiosClient from "./axiosClient";
import type { Category } from "../types/category";

export const getCategoriesApi = () => {
  return axiosClient.get<Category[]>("/categories");
};

export const createCategoryApi = (payload: {
  name: string;
  parentId?: string;
}) => {
  return axiosClient.post<Category>("/categories", payload);
};

export const updateCategoryApi = (
  id: string,
  payload: { name?: string; parentId?: string },
) => {
  return axiosClient.patch<Category>(`/categories/${id}`, payload);
};

export const deleteCategoryApi = (id: string) => {
  return axiosClient.delete(`/categories/${id}`);
};

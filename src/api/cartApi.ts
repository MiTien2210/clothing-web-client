import type { CartItem } from "../types/cart";
import axiosClient from "./axiosClient";

export const getCartApi = () => {
  return axiosClient.get<CartItem[]>("/cart");
};

export const addCartItemApi = (payload: {
  productVariantId: string;
  quantity: number;
}) => {
  return axiosClient.post<CartItem>("/cart", payload);
};

export const updateCartItemApi = (
  id: string,
  payload: { quantity: number },
) => {
  return axiosClient.patch<CartItem>(`/cart/${id}`, payload);
};

export const removeCartItemApi = (id: string) => {
  return axiosClient.delete(`/cart/${id}`);
};

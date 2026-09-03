import type { ProductVariant } from "../types/product-variant";
import axiosClient from "./axiosClient";

export const getProductVariantsApi = () => {
  return axiosClient.get<ProductVariant[]>("/product-variants");
};

export const createProductVariantApi = (payload: {
  size: string;
  color: string;
  price: number;
  stock_quantity: number;
  sku: string;
  productId: string;
}) => {
  return axiosClient.post<ProductVariant>("/product-variants", payload);
};

export const updateProductVariantApi = (
  id: string,
  payload: {
    size?: string;
    color?: string;
    price?: number;
    stock_quantity?: number;
    sku?: string;
    productId?: string;
  },
) => {
  return axiosClient.patch<ProductVariant>(`/product-variants/${id}`, payload);
};

export const deleteProductVariantApi = (id: string) => {
  return axiosClient.delete(`/product-variants/${id}`);
};

import type { Address } from "../types/address";
import axiosClient from "./axiosClient";

export const getAddressesApi = () => {
  return axiosClient.get<Address[]>("/addresses");
};

export const createAddressApi = (payload: {
  recipient_name: string;
  phone: string;
  address_line: string;
  ward: string;
  district: string;
  province: string;
  is_default?: boolean;
}) => {
  return axiosClient.post<Address>("/addresses", payload);
};

export const updateAddressApi = (
  id: string,
  payload: Partial<{
    recipient_name: string;
    phone: string;
    address_line: string;
    ward: string;
    district: string;
    province: string;
    is_default: boolean;
  }>,
) => {
  return axiosClient.patch<Address>(`/addresses/${id}`, payload);
};

export const deleteAddressApi = (id: string) => {
  return axiosClient.delete(`/addresses/${id}`);
};

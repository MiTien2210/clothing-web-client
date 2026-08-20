import axiosClient from "./axiosClient";

export interface RegisterPayload {
  full_name: string;
  email: string;
  phone?: string;
  password: string;
}

export const registerApi = (payload: RegisterPayload) => {
  return axiosClient.post("/account/register", payload);
};

export const verifyOtpApi = (email: string, otp: string) => {
  return axiosClient.post("/account/verify-otp", { email, otp });
};

export const resendOtpApi = (email: string) => {
  return axiosClient.post("/account/resend-otp", { email });
};

export const loginApi = (email: string, password: string) => {
  return axiosClient.post("/account/login", { email, password });
};

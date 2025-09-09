import { api } from "./api";

export const sendOtpService = async (mobile: string,productId:string) => {
  try {
    const { data } = await api.post(`/QRPortal/SendOtpToMobile`, {
      mobile,
      productId,
    },{  headers: {
    "Content-Type": "application/json",
  },});

    return {
      success: data?.success || false,
      message: data?.resultMessage || "OTP request processed",
      data: data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Something went wrong while sending OTP",
      data: [],
    };
  }
};

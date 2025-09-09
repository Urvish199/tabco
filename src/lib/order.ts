// src/lib/placeOrder.ts
import { api } from "./api";

export interface OrgDetail {
  mobileNo: string;
  productId: string;
  orgName: string;
  gstNo: string;
  contactPerson: string;
  salesmanId: number;
}

export interface ItemDetail {
  id: number;
  name: string;
  price: number;
  qty: number;
  qPcs: number;
  set: number;
  amount: number;
  catelog: string;
  bidPrice: number;
  note: string;
}

export const placeOrderService = async (
  orderDetail: {
    orgDetail: OrgDetail;
    itemDetails: ItemDetail[];
  },
  file?: File | null
) => {
  try {
    const formData = new FormData();
    formData.append("orderDetail", JSON.stringify(orderDetail));
    if (file) {
      formData.append("file", file);
    }

    const { data } = await api.post(
      "/QRPortal/PlaceOrder",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return { success: true, message: data?.message, data };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Something went wrong",
      data: [],
    };
  }
};

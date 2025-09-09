import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { placeOrderService } from "@/lib/order";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { resetAllProductSet, selectCatalogId, selectProductsWithSet, TypeProduct } from "@/redux/slices/productSlice";

type ItemDetail = {
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
};

export const convertToItemDetails = (products: TypeProduct[]): ItemDetail[] => {
  return products.map((p) => {
    const qty = p?.set ? p.set * p.qPcs : 0;
    const amount = qty * p.price;

    return {
      id: p.id,
      name: p.name,
      price: p.price,
      qty,
      qPcs: p.qPcs,
      set: p?.set ? p.set : 0,
      amount,
      catelog: p.catelog || "",
      bidPrice: 0,
      note: "",
    };
  });
};

export default function ConfirmOrderModal({
  confirmOrderOpen,
  handleConfirmOrderToggle,
  mobileNo,
}: {
  confirmOrderOpen: boolean;
  handleConfirmOrderToggle: () => void;
  mobileNo: string;
}) {
  // keep in one object
  const [orgDetail, setOrgDetail] = useState({
    organization: "",
    gst: "",
    name: "",
  });

  const [file, setFile] = useState<File | null>(null);

  const data = useAppSelector(selectProductsWithSet);
  const catalogId = useAppSelector(selectCatalogId);
const dispatch = useAppDispatch();
  const handleSubmit = async () => {
    if (!orgDetail.organization || !orgDetail.gst || !orgDetail.name) {
      toast.error("Please fill in all required fields");
      return;
    }

    const orderDetail = {
      orgDetail: {
        mobileNo,
        productId: catalogId,
        orgName: orgDetail.organization,
        gstNo: orgDetail.gst,
        contactPerson: orgDetail.name,
        salesmanId: 16113,
      },
      itemDetails: convertToItemDetails(data),
    };

    const res = await placeOrderService(orderDetail, file);

    if (res.success) {
      toast.success("✅ Order placed successfully!");
      handleConfirmOrderToggle();
      setOrgDetail({
        organization: "",
        gst: "",
        name: "",
      });
      setFile(null);
      dispatch(resetAllProductSet());
    } else {
      toast.error("❌ Failed: " + res.message);
    }
  };

  return (
    <Dialog open={confirmOrderOpen} onOpenChange={handleConfirmOrderToggle}>
      <DialogContent className="bg-white rounded-xl shadow-lg w-full max-w-[95vw] sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center mb-4">
            Finalize Order
          </DialogTitle>
          <p className="text-gray-600 mb-6 text-center">
            Please enter your details to complete the order.
          </p>

          {/* Organization Name */}
          <input
            type="text"
            placeholder="Enter organization name"
            value={orgDetail.organization}
            onChange={(e) => setOrgDetail({ ...orgDetail, organization: e.target.value })}
            className="w-full border rounded-lg px-4 py-3 mb-4 focus:ring-2 focus:ring-green-400 outline-none"
          />

          {/* GST Number */}
          <input
            type="text"
            placeholder="Enter GST Number"
            value={orgDetail.gst}
            onChange={(e) => setOrgDetail({ ...orgDetail, gst: e.target.value })}
            className="w-full border rounded-lg px-4 py-3 mb-4 focus:ring-2 focus:ring-green-400 outline-none"
          />

          {/* Your Name */}
          <input
            type="text"
            placeholder="Enter your name"
            value={orgDetail.name}
            onChange={(e) => setOrgDetail({ ...orgDetail, name: e.target.value })}
            className="w-full border rounded-lg px-4 py-3 mb-4 focus:ring-2 focus:ring-green-400 outline-none"
          />

          {/* File Upload */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2 text-sm">
              Attach File (optional)
            </label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>

          {/* Place Order Button */}
          <button
            onClick={handleSubmit}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-lg transition"
          >
            Place Order
          </button>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

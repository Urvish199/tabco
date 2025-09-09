"use client";

import ProductCard from "@/app/components/OrderCard";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchCatalogProducts,
  selectProducts,
  selectProductsLoading,
  selectProductsError,
  updateRemark,
  updateSet,
  removeProduct,
  selectTotalQuantity,
  selectTotalAmount,
} from "@/redux/slices/productSlice";
import CartViewModal from "@/app/components/Modals/CartViewModal";
import { formatePrice } from "@/helper/helper";
import OtpModal from "@/app/components/Modals/OtpModal";
import ConfirmOrderModal from "@/app/components/Modals/ConfirmOrderModal";

export default function ProductList({ catalogId }: { catalogId: string }) {
  const [cartOpen, setCartOpen] = useState<boolean>(false); 
  const [otpOpen, setOtpOpen] = useState<boolean>(false);
  const [confirmOrderOpen, setConfirmOrderOpen] = useState<boolean>(false);
  const [mobileNo, setMobileNo] = useState<string>("");

  const handleCartToggle = () => setCartOpen(!cartOpen);
  const handleConfirmOrderToggle = () => setConfirmOrderOpen(!confirmOrderOpen);
  const handleOtpToggle = () => setOtpOpen(!otpOpen);

  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProducts);
  const loading = useAppSelector(selectProductsLoading);
  const error = useAppSelector(selectProductsError);

  useEffect(() => {
    dispatch(fetchCatalogProducts(catalogId));
  }, [dispatch, catalogId]);

  const productArray = products;
  const handleDelete: (id: number) => void = (id) => {
    if (window.confirm("Are you sure you want to delete the product?")) {
      dispatch(removeProduct(id));
      toast.success("Product deleted successfully!");
    }
  };

  const totalQuantity = useAppSelector(selectTotalQuantity);
  const onSetChange = (set: number, id: number) => {
    if (set < 0) {
      toast.error("Set cannot be negative");
      return;
    }
    dispatch(updateSet({ set, id }));
  };

  const handleRemarkChange = (remark: string, id: number) => {
    dispatch(updateRemark({ remark, id }));
  };

  return (
    <div className="relative min-h-[80vh] p-4">
      {loading ? (
        <div className="flex justify-center items-center h-40">
          Loading products...
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-40 text-red-500">
          {error}
        </div>
      ) : (
        <div className="flex justify-center items-center">
          <div className="w-full max-w-[800px] ">
            {productArray && productArray.length > 0 ? (
              productArray.map((item: any, index: number) => (
                <ProductCard
                  key={index}
                  product={item}
                  onDelete={handleDelete}
                  onSetChange={onSetChange}
                  onRemarkChange={handleRemarkChange}
                />
              ))
            ) : (
              <div>No products found.</div>
            )}
          </div>
        </div>
      )}
      <div className="sticky bottom-0 right-0 w-full border-t py-3 flex flex-wrap gap-5 justify-between items-center bg-white">
        <div className="flex font-semibold">
          <span className="mr-6">
            Total Qty: {useAppSelector(selectTotalQuantity)}
          </span>
          <span>Total Amt: {formatePrice( useAppSelector(selectTotalAmount))}</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button className="px-4 py-2 rounded-lg bg-purple-600 text-white">
            Add Catalog
          </button>
          <button
            onClick={handleCartToggle}
            className="cursor-pointer px-4 py-2 rounded-lg bg-red-600 text-white"
          >
            Show
          </button>
          <button 
            onClick={()=>{
              if(totalQuantity > 0){
                handleOtpToggle()
              }else{
                toast.error("Please add products to cart")
              }
              }}
            className="cursor-pointer px-4 py-2 rounded-lg bg-green-600 text-white">
            Submit
          </button>
        </div>
      </div>

      <CartViewModal cartOpen={cartOpen} handleCartToggle={handleCartToggle} />

      <OtpModal 
        otpOpen={otpOpen}
        handleOtpToggle={handleOtpToggle}
        handleConfirmOrderToggle={handleConfirmOrderToggle}
        catalogId={catalogId}
        setMobileNo={setMobileNo}
        />

      <ConfirmOrderModal 
        confirmOrderOpen={confirmOrderOpen}
        handleConfirmOrderToggle={handleConfirmOrderToggle}
        mobileNo={mobileNo}
        //  ={catalogId}
      />
    </div>
  );
}

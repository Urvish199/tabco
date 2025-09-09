import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppSelector } from "@/redux/hooks";
import {
  selectProductsWithSet,
} from "@/redux/slices/productSlice";
import Image from "next/image";

import React from "react";

const getCalculatedString = ({
  set,
  qPcs,
  price,
}: {
  set: number;
  qPcs: number;
  price: number;
}) => {
  return `${qPcs} x ${set} =  ${qPcs * set} x ${price} = ${
    qPcs * set * price
  } `;
};

export default function CartViewModal({
  handleCartToggle,
  cartOpen,
}: {
  handleCartToggle: () => void;
  cartOpen: boolean;
}) {
  const products = useAppSelector(selectProductsWithSet);
  
  return (
    <>
      <Dialog open={cartOpen} onOpenChange={handleCartToggle} >
        <DialogContent className="bg-white rounded-xl shadow-lg w-full max-w-[95vw]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-center mb-4">
                Entered Items
            </DialogTitle>
              <div>
                <div className="grid grid-cols-2 font-medium border-b pb-2 mb-4">
                  <span>Item Name</span>
                  <span className="text-right">Quantity</span>
                </div>

                {/* Items or empty state */}
                {products.length > 0 ? (
                  <div className="space-y-2 max-h-60 pr-3 overflow-y-auto">
                    {products.map((item, id) => (
                      <div
                        key={item.id}
                        className="grid grid-cols-3  text-sm py-1 border-b last:border-none"
                      >
                        <div className="flex col-span-2 gap-3">
                          <Image
                            src={item.images[0]}
                            alt={item.name}
                            width={50}
                            height={50}
                            className="rounded-md object-cover object-center"
                          />
                          <div className="text-left">
                            <span>{item.id}</span>
                            <br />
                            <span >
                              {getCalculatedString({
                                set: item.set || 0,
                                qPcs: item.qPcs,
                                price: item.price,
                              })}
                            </span>
                          </div>
                        </div>
                        <div  className="text-right">
                          <span>{(item.set || 0) * item.qPcs}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-center text-gray-500 text-sm">
                    No items with quantity entered yet.
                  </span>
                )}
              </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}

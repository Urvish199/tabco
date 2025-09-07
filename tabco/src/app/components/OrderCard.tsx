// components/ProductCard.tsx
import { X } from "lucide-react";
import ImageSlider from "./ImageSlider";
import { useRouter } from "next/navigation";
import useDeviceType from "@/hooks/useDeviceType";
import { formatePrice } from "@/helper/helper";

export interface Product {
  id: number;
  name: string;
  catelog: string;
  qPcs: number;
  price: number;
  cut: number;
  type: string;
  description: string;
  images: string[];
  set?: number;
  remark?: string;
}

interface ProductCardProps {
  product: Product;
  onDelete?: (id: number) => void;
  onRemarkChange?: (remark: string, id: number) => void;
  onSetChange?: (quantity: number, id: number) => void;
}

export default function ProductCard({
  product,
  onDelete,
  onSetChange,
  onRemarkChange,
}: ProductCardProps) {
  const router = useRouter();
  const [deviceType] = useDeviceType();
  const showImage = (imgURL: string) => {
    router.push(imgURL);
  };

  const renderSection = () => {
    return (
      <>
        <div className="flex-1">
          {/* Stock Details */}
          <div className="grid grid-cols-3 gap-2 mt-3">
            <div className="bg-white text-black border flex justify-center items-center rounded-lg text-center">
              <div className="flex flex-col justify-center items-center">
                <p className="text-gray-500 text-sm">Set</p>
                <input
                  value={product.set || 0}
                  onChange={(e) =>
                    onSetChange?.(
                      Number(e.target.value.replace(/\D/g, "")),
                      product.id
                    )
                  }
                  className="appearance-none text-center focus:outline-none"
                />
              </div>
            </div>
            <div className="bg-white text-black border rounded-lg p-2 text-center">
              <p className="text-gray-500 text-sm">Quantity</p>
              <p className="font-semibold">
                {product.qPcs * (product.set || 0)}
              </p>
            </div>
            {/* <div className="bg-white text-black border rounded-lg p-2 text-center">
              <p className="text-gray-500 text-sm">Rate</p>
              <p className="font-semibold">{product.price?.toFixed(2)}</p>
            </div> */}
            <div className="bg-white text-black border rounded-lg p-2 text-center">
              <p className="text-red-500 text-sm text">Total Amount</p>
              <p className="font-semibold">
                {formatePrice(
                  (product.qPcs || 0) * (product.set || 0) * product.price
                )}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 mt-2">
            {/* <div className="relative inline-block text-black border rounded-lg text-sm">
              <select
                className="appearance-none border rounded-lg h-full px-3 bg-white w-full"
                defaultValue={product.price}
              >
                <option>None</option>
                <option>Box</option>
                <option>Bag</option>
              </select>
              <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
                <ChevronDown />
              </span>
            </div> */}
            {/* <div className="bg-white text-black border rounded-lg p-2 text-center">
              <p className="text-red-500 text-sm text">Total Amount</p>
              <p className="font-semibold">
                {formatePrice(
                  (product.qPcs || 0) * (product.set || 0) * product.price
                )}
              </p>
            </div> */}
            <textarea
              value={product.remark}
              onChange={(e) => onRemarkChange?.(e.target.value, product.id)}
              placeholder="Remark"
              className="bg-white text-black w-full mt-3 border rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="relative bg-[#faddcf] h-full rounded-xl p-4 shadow-md mb-4">
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <div
            onClick={() => {}}
            className="cursor-pointer relative w-[30%] max-h-[300px] rounded-md overflow-hidden "
          >
            <ImageSlider
              onClickHandler={showImage}
              images={product.images}
              styleCss={"hover:scale-105 transition-transform duration-300"}
            />
            <div className="absolute top-0 left-0 bg-black/60 text-white text-xs px-2 py-1">
              Pcs: {product?.images?.length || 0}
            </div>
          </div>
          <div>
            <div className="">
              <div className="flex justify-between items-start mb-2">
                <h2 className="font-bold text-black text-2xl">
                  {product.name}
                </h2>
              </div>
              <div className="whitespace-pre-line">
                {product.description.replace(/\\n/g, "\n")}
              </div>
              {/* <a href="#" className="text-blue-600 text-sm underline">
                Catelog : {product.catelog}
              </a> */}
              <p className="font-semibold text-red-500 text-2xl">
                Rate : {product.price?.toFixed(2)}
              </p>
            </div>

            {(deviceType === "desktop" || deviceType === "tablet") &&
              renderSection()}
          </div>
          <button
            onClick={() => onDelete?.(product.id)}
            className="absolute right-1.5 top-1.5 text-red-500 hover:text-red-700"
          >
            <X size={30} className="cursor-pointer" />
          </button>
        </div>
      </div>
      {deviceType === "mobile" && renderSection()}

      {/* Remark */}
      {/* <textarea
        value={product.remark}
        onChange={(e) => onRemarkChange?.(e.target.value, product.id)}
        placeholder="Remark"
        className="bg-white text-black w-full mt-3 border rounded-lg px-3 py-2 text-sm"
      /> */}
    </div>
  );
}

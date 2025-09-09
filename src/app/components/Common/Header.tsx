"use client";
import Image from "next/image";
import { selectCompanyDetils } from "@/redux/slices/productSlice";
import { useAppSelector } from "@/redux/hooks";

export default function Header() {
  const { appName, logoUrl, salesmanName, salesmanMobileNo } =
    useAppSelector(selectCompanyDetils);

  return (
    <header
      id="header"
      className="bg-white px-10 py-5 border-b border-gray-300 flex items-center justify-between"
    >
      <div className="flex items-center gap-3">
        {logoUrl && (
          <Image
            src={logoUrl || ""}
            alt="Company Logo"
            width={60}
            height={60}
          />
        )}
      <div className="flex flex-col items-start">
        <h1 className="text-xl font-bold">{appName}</h1>
        <p className="font-medium">{salesmanName} | {salesmanMobileNo}</p>
      </div>
      </div>
    </header>
  );
}

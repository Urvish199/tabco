"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { Result } from "@zxing/library"; // react-qr-barcode-scanner internally uses ZXing


const BarcodeScanner = dynamic(() => import("react-qr-barcode-scanner"), {
  ssr: false,
});

export default function QrCodeScanner() {
  const [QRCodeData, setQRCodeData] = useState<any>();
  const [permission, setPermission] = useState<
    "checking" | "granted" | "denied"
  >("checking");

  useEffect(() => {
    // ask for permission as soon as component mounts
    const requestCamera = async () => {
      try {
        const stream = await navigator?.mediaDevices?.getUserMedia?.({
          video: true,
        });
        // stop preview right after permission granted
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
          setPermission("granted");
        }
      } catch (error) {
        console.error("Camera permission denied:", error);
        setPermission("denied");
      }
    };

    requestCamera();
  }, []);

  useEffect(() => {
    if (QRCodeData) {
      const data = (QRCodeData);
      if (data) {
        setQRCodeData(data);
      }
    }
  }, [QRCodeData]);

  return (
    <div className="flex flex-col items-center justify-center min-w-full min-h-screen">
      {permission === "checking" && (
        <p className="text-gray-600">Requesting camera access...</p>
      )}

      {permission === "granted" && (
        <BarcodeScanner
          onUpdate={(err, result) => {
            if (result) {
              const jsonData =result.getText?.()
              const data = JSON.parse(jsonData);
              setQRCodeData(data);
            }
          }}
        />
      )}

      {permission === "denied" && (
        <p className="text-red-600">
          Camera access denied. Please enable it in your browser settings.
        </p>
      )}

    </div>
  );
}

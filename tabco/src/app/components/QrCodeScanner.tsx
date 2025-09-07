"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

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
        console.log("🚀 ~ requestCamera ~ stream:", stream);
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
      const data = JSON.parse(QRCodeData);
      console.log("🚀 ~ useEffect ~ data:", data);
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
              // for ZXing 0.19+, use getText(); for older, result.text
              console.log("🚀 ~ result:", result);
              setQRCodeData(result.getText?.() || result || "Scanned!");
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

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { sendOtpService } from "@/lib/sendOtp";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function OtpModal({
  otpOpen,
  handleOtpToggle,
  handleConfirmOrderToggle,
  catalogId,
  setMobileNo,
}: {
  otpOpen: boolean;
  handleOtpToggle: () => void;
  handleConfirmOrderToggle: () => void;
  catalogId: string;  
  setMobileNo: (mobile: string) => void;
}) {
  const [step, setStep] = useState<"mobile" | "otp">("mobile");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [serverOtp, setServerOtp] = useState(""); // store OTP from API
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);

  

  // Timer countdown for OTP resend
  useEffect(() => {
    let interval: any;
    if (step === "otp" && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => {
      // setStep("mobile");
      clearInterval(interval)};
  }, [step, timer]);

  const handleSendOtp = async () => {
    if (!mobile || mobile.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }
    setLoading(true)
    const res = await sendOtpService(mobile, catalogId);
    if (res.success) {
      setStep("otp");
      setServerOtp(res.data.value); 
      setTimer(60); // reset timer
    } else {
      toast.error(res.message);
    }
    setLoading(false);
  };

  const handleVerifyOtp = () => {
    if (!otp) {
      toast.error("Enter OTP");
      return;
    }
    if (otp === serverOtp) {
      setMobileNo(mobile);
      toast.success(`✅ OTP Verified for ${mobile}`);
      setStep("mobile");
      setServerOtp("");
      setOtp("");
      setMobile("");
      handleConfirmOrderToggle();
      handleOtpToggle();  // close modal
    } else {
      toast.error("❌ Invalid OTP, please try again");
    }
  };

  return (
    <Dialog open={otpOpen} onOpenChange={handleOtpToggle}>
      <DialogContent className="bg-white rounded-xl shadow-lg w-full max-w-[95vw] sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center mb-4">
            {step === "mobile" ? "Confirm Order" : "Enter OTP"}
          </DialogTitle>
          {step === "mobile" ? (
            <>
              <p className="text-gray-600 mb-4">
                Please enter your mobile number to receive an OTP.
              </p>

              <input
                type="text"
                placeholder="Enter mobile number"
                value={mobile}
                onChange={(e) =>
                  setMobile(e.target.value.replace(/[^0-9]/g, "").slice(0, 10))
                }
                className="w-full border rounded-lg px-4 py-3 mb-4 focus:ring-2 focus:ring-green-400 outline-none"
              />

              <button
                onClick={handleSendOtp}
                disabled={loading}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-lg transition disabled:opacity-60"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </>
          ) : (
            <>
              <p className="text-gray-600 mb-4">
                OTP sent to <span className="font-medium">+91-{mobile}</span>
              </p>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
                className="w-full border rounded-lg px-4 py-3 mb-4 focus:ring-2 focus:ring-green-400 outline-none"
              />

              <button
                onClick={handleVerifyOtp}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-lg transition"
              >
                Verify OTP
              </button>

              {/* Resend Options */}
              <div className="flex justify-between text-sm text-gray-600 mt-3">
                <button
                  onClick={handleSendOtp}
                  disabled={timer > 0}
                  className={`${
                    timer > 0
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-green-600 hover:underline"
                  }`}
                >
                  Resend
                </button>
                <span>
                  {timer > 0 ? `Resend in ${timer}s` : "You can resend now"}
                </span>
              </div>
            </>
          )}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

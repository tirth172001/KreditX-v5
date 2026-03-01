"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { UserRound } from "lucide-react";
import { BottomSheet } from "@/components/loan/shared/BottomSheet";
import { Input } from "@/components/ui/input";
import { OTPInput } from "@/components/loan/shared/OTPInput";
import { StepProgressBar } from "@/components/loan/shared/StepProgressBar";
import { cn } from "@/lib/utils";
import { useLoanStore, SCREENS } from "@/store/loanStore";
import { screenContainer, screenItem } from "@/components/loan/shared/motion";

function formatAadhaar(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 12);
  return digits.replace(/(\d{4})(?=\d)/g, "$1-");
}

// ─── Aadhaar OTP bottom sheet ─────────────────────────────────────────────────

function AadhaarOTPSheet({
  mobile,
  onVerify,
}: {
  mobile: string;
  onVerify: () => void;
}) {
  const [otp, setOtp] = useState("");
  const [retriesLeft, setRetriesLeft] = useState(3);
  const [isVerifying, setIsVerifying] = useState(false);

  const mobileLast4 = mobile.slice(-4) || "9898";

  const handleVerify = async () => {
    if (otp.length !== 6) return;
    setIsVerifying(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    toast.success("Aadhaar verified successfully");
    onVerify();
  };

  return (
    <div className="w-full max-w-[390px] overflow-hidden rounded-t-2xl bg-white">
      <div className="px-6 pt-6 pb-6 space-y-6">
        <div>
          <h3 className="text-[18px] font-semibold text-[#1c1917]">
            OTP sent on xx{mobileLast4}
          </h3>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium text-[#0a0a0a]">Enter OTP</p>
          <OTPInput length={6} value={otp} onChange={setOtp} fullWidth />
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                if (retriesLeft === 0) return;
                setRetriesLeft((v) => v - 1);
                setOtp("");
                toast.info("OTP resent");
              }}
              disabled={retriesLeft === 0}
              className="text-xs font-medium text-[#003323] disabled:text-[#78716c]/60"
            >
              Resend OTP
            </button>
            <p className="text-xs text-[#7a7a7a]">{retriesLeft} retries left</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleVerify}
          disabled={otp.length !== 6 || isVerifying}
          className="w-full h-10 rounded-lg bg-[#003323] text-white text-sm font-medium disabled:opacity-60"
        >
          {isVerifying ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Verifying…
            </span>
          ) : "Verify OTP"}
        </button>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function S11_AadhaarKYC() {
  const { data, update, goTo } = useLoanStore();
  const [aadhaarNumber, setAadhaarNumber] = useState(
    formatAadhaar(data.aadhaarNumber || "3238585746895")
  );
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [otpSheetOpen, setOtpSheetOpen] = useState(false);

  const handleVerify = async () => {
    const digits = aadhaarNumber.replace(/\D/g, "");
    if (digits.length !== 12) {
      setError("Please enter a valid 12-digit Aadhaar number");
      return;
    }
    setError("");
    setIsSending(true);
    toast.info("OTP sent to your Aadhaar registered number");
    await new Promise((resolve) => setTimeout(resolve, 800));
    update({ aadhaarNumber: digits });
    setIsSending(false);
    setOtpSheetOpen(true);
  };

  const handleOtpVerified = () => {
    update({ aadhaarVerified: true });
    setOtpSheetOpen(false);
    goTo(SCREENS.FACE_VERIFICATION);
  };

  return (
    <>
      <motion.div
        className="flex flex-col gap-6 pb-44"
        variants={screenContainer}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={screenItem} className="h-[108px] w-full rounded-lg bg-[#f5f5f4]" />

        <motion.div variants={screenItem} className="space-y-1">
          <h2 className="text-[18px] leading-7 font-semibold text-[#1c1917]">Aadhaar verification</h2>
          <p className="text-sm leading-5 text-[#78716c]">
            Provide your Aadhaar number and verify it using OTP sent on your registered number
          </p>
        </motion.div>

        {/* Aadhaar card */}
        <motion.div
          variants={screenItem}
          className="rounded-xl bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.1)]"
        >
          {/* Card header */}
          <div className="flex items-center gap-2 pb-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#003323]/10 text-[8px] font-bold text-[#003323]">
              GOI
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="flex flex-col gap-0.5">
                <div className="h-2 w-full bg-gradient-to-r from-[#f8a628] via-[#f8a628]/50 to-transparent rounded" />
                <div className="h-2 bg-white" />
                <div className="h-2 w-full bg-gradient-to-r from-[#259c4d] via-[#259c4d]/50 to-transparent rounded" />
              </div>
            </div>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#8B1A1A] text-[7px] font-bold text-white leading-tight text-center">
              AADH<br/>AAR
            </div>
          </div>

          {/* User info */}
          <div className="flex gap-3 mb-4">
            <div className="flex h-14 w-12 shrink-0 items-center justify-center rounded-md bg-[#003323]/10">
              <UserRound className="h-7 w-7 text-[#003323]" strokeWidth={1.5} />
            </div>
            <div className="space-y-0.5 text-xs text-[#1c1917]">
              <p><span className="text-[#78716c]">Name:  </span><span className="font-medium">{`${data.firstName || "Tirth"} ${data.lastName || "Trivedi"}`}</span></p>
              <p><span className="text-[#78716c]">Gender: </span><span className="font-medium">{data.gender || "Male"}</span></p>
              <p><span className="text-[#78716c]">DOB:  </span><span className="font-medium">17/06/2001</span></p>
            </div>
          </div>

          {/* Aadhaar input */}
          <div className="space-y-2">
            <Input
              value={aadhaarNumber}
              onChange={(e) => {
                setAadhaarNumber(formatAadhaar(e.target.value));
                if (error) setError("");
              }}
              inputMode="numeric"
              placeholder="0000-0000-0000"
              className={cn(
                "h-10 rounded-lg border-[#e7e5e4] bg-[#fafaf9] text-base text-[#1c1917]",
                error && "border-[#dc2626]"
              )}
            />
            {error && <p className="text-xs text-[#dc2626]">{error}</p>}
          </div>

          <div className="mt-4 border-t border-[#e7e5e4]" />
          <p className="mt-3 text-xs text-[#78716c]">OTP will be shared to Aadhaar registered number</p>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-[390px] -translate-x-1/2 bg-white px-4 pb-4 pt-3 border-t border-[#e7e5e4]">
        <div className="flex justify-center mb-3">
          <StepProgressBar currentStep={2} />
        </div>
        <button
          type="button"
          onClick={handleVerify}
          disabled={isSending}
          className="w-full h-10 rounded-lg bg-[#003323] text-white text-sm font-medium disabled:opacity-60"
        >
          {isSending ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Sending OTP…
            </span>
          ) : "Verify Aadhaar"}
        </button>
        <div className="mt-2 flex items-center justify-center gap-1.5">
          <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#78716c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span className="text-xs text-[#78716c]">100% secure as per RBI</span>
        </div>
      </div>

      <BottomSheet open={otpSheetOpen} onClose={() => setOtpSheetOpen(false)}>
        <AadhaarOTPSheet
          mobile={data.mobile}
          onVerify={handleOtpVerified}
        />
      </BottomSheet>
    </>
  );
}

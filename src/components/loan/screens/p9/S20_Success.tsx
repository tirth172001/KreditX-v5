"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { BottomSheet } from "@/components/loan/shared/BottomSheet";
import { OTPInput } from "@/components/loan/shared/OTPInput";
import { formatINR } from "@/lib/utils";
import { useLoanStore } from "@/store/loanStore";
import { screenContainer, screenItem } from "@/components/loan/shared/motion";

type TransferStep = "transfer" | "processing" | "done";

export function S20_Success() {
  const { data, update, reset } = useLoanStore();
  const setMerchantStripMode = useLoanStore((s) => s.setMerchantStripMode);

  const [step, setStep] = useState<TransferStep>("transfer");
  const [otpSheetOpen, setOtpSheetOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    setMerchantStripMode("none");
    return () => setMerchantStripMode(null);
  }, [setMerchantStripMode]);

  const mobile = data.mobile || "9876543210";
  const mobileLast4 = mobile.slice(-4);
  const loanAmount = data.finalLoanAmount || 500000;
  const finalEMI = data.finalEMI || 0;
  const selectedTenure = data.selectedTenure || 9;

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) return;
    setIsVerifying(true);
    await new Promise((r) => setTimeout(r, 1200));
    toast.success("Transfer initiated successfully");
    setOtpSheetOpen(false);
    setIsVerifying(false);
    setStep("processing");
    update({ transferOtpSent: true, transferProcessing: true });
    await new Promise((r) => setTimeout(r, 2500));
    update({ transferProcessing: false, transferCompleted: true });
    setStep("done");
  };

  // ─── Processing ──────────────────────────────────────────────────────────────

  if (step === "processing") {
    return (
      <motion.div
        className="flex flex-col items-center justify-center min-h-[60vh] gap-5"
        variants={screenContainer}
        initial="hidden"
        animate="show"
      >
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-[#e7e5e4] border-t-[#003323]" />
        <div className="text-center space-y-1">
          <h2 className="text-[18px] font-semibold text-[#1c1917]">Processing transfer…</h2>
          <p className="text-sm text-[#78716c] max-w-[260px]">
            Your loan amount is being transferred to your bank account. Please wait.
          </p>
        </div>
      </motion.div>
    );
  }

  // ─── Done ─────────────────────────────────────────────────────────────────────

  if (step === "done") {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#fafaf9] px-6">
        {/* Illustration */}
        <div className="relative mb-8 flex items-center justify-center">
          {/* Confetti dots */}
          <svg width="220" height="220" viewBox="0 0 220 220" fill="none" className="absolute">
            <circle cx="110" cy="18" r="5" fill="#f59e0b" />
            <circle cx="168" cy="38" r="4" fill="#10b981" />
            <circle cx="196" cy="90" r="5" fill="#3b82f6" />
            <circle cx="188" cy="150" r="4" fill="#f43f5e" />
            <circle cx="150" cy="195" r="5" fill="#a855f7" />
            <circle cx="90" cy="202" r="4" fill="#f59e0b" />
            <circle cx="38" cy="178" r="5" fill="#10b981" />
            <circle cx="18" cy="126" r="4" fill="#3b82f6" />
            <circle cx="28" cy="68" r="5" fill="#f43f5e" />
            <circle cx="62" cy="28" r="4" fill="#a855f7" />
            <rect x="145" y="55" width="6" height="6" rx="1" fill="#f59e0b" transform="rotate(20 145 55)" />
            <rect x="60" y="155" width="6" height="6" rx="1" fill="#3b82f6" transform="rotate(-15 60 155)" />
            <rect x="170" y="130" width="5" height="5" rx="1" fill="#10b981" transform="rotate(30 170 130)" />
            <rect x="42" y="80" width="5" height="5" rx="1" fill="#f43f5e" transform="rotate(-25 42 80)" />
          </svg>
          {/* Green circle */}
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#10b981]">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Text */}
        <div className="text-center space-y-2">
          <h2 className="text-[22px] font-semibold text-[#1c1917]">
            {formatINR(loanAmount)} transferred successfully
          </h2>
          <p className="text-sm text-[#78716c] leading-5">
            We have transferred fund amount in your{" "}
            {data.repaymentBankAccount || "Canara Bank"} account xx{data.repaymentBankMasked || "8234"}
          </p>
        </div>

        {/* Done button */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-8">
          <button
            type="button"
            onClick={reset}
            className="w-full h-12 rounded-xl bg-[#0293a6] text-white text-base font-semibold"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  // ─── Transfer page (default) ──────────────────────────────────────────────────

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
          <h2 className="text-[18px] leading-7 font-semibold text-[#1c1917]">
            Get {formatINR(loanAmount)} in your bank account
          </h2>
          <p className="text-sm leading-5 text-[#78716c]">
            Please provide OTP to transfer the fund in your bank account
          </p>
        </motion.div>

        {/* Loan summary card */}
        <motion.div
          variants={screenItem}
          className="rounded-xl bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.1)] space-y-3"
        >
          <p className="text-sm font-semibold text-[#1c1917]">Loan summary</p>
          <div className="h-px bg-[#e7e5e4]" />
          {[
            { label: "Loan amount", value: formatINR(loanAmount) },
            { label: "EMI amount", value: `${finalEMI ? formatINR(finalEMI) : "—"}/month` },
            { label: "Tenure", value: `${selectedTenure} months` },
            { label: "EMI date", value: "2nd of every month" },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between">
              <p className="text-xs text-[#78716c]">{label}</p>
              <p className="text-sm font-medium text-[#1c1917]">{value}</p>
            </div>
          ))}
        </motion.div>

        {/* Bank details card */}
        <motion.div
          variants={screenItem}
          className="rounded-xl bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.1)] space-y-3"
        >
          <p className="text-sm font-semibold text-[#1c1917]">Bank details</p>
          <div className="h-px bg-[#e7e5e4]" />
          {[
            { label: "Bank", value: data.repaymentBankAccount || "Canara Bank" },
            { label: "Bank account", value: data.repaymentAccountNumber || "CAN001234" },
            { label: "IFSC", value: data.repaymentIFSC || "CNRB0001234" },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between">
              <p className="text-xs text-[#78716c]">{label}</p>
              <p className="text-sm font-medium text-[#1c1917]">{value}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>

      <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-[390px] -translate-x-1/2 bg-white px-4 pb-4 pt-3 border-t border-[#e7e5e4]">
        <button
          type="button"
          onClick={() => setOtpSheetOpen(true)}
          className="w-full h-10 rounded-lg bg-[#003323] text-white text-sm font-medium"
        >
          Get loan amount
        </button>
      </div>

      <BottomSheet open={otpSheetOpen} onClose={() => setOtpSheetOpen(false)}>
        <div className="w-full max-w-[390px] overflow-hidden rounded-t-2xl bg-white">
          <div className="px-6 pt-6 pb-6 space-y-6">
            <div>
              <h3 className="text-[18px] font-semibold text-[#1c1917]">Verify transfer</h3>
              <p className="mt-0.5 text-sm text-[#78716c]">
                OTP sent to number ending xx{mobileLast4}
              </p>
            </div>
            <div className="space-y-3">
              <p className="text-sm font-medium text-[#0a0a0a]">Enter OTP</p>
              <OTPInput length={6} value={otp} onChange={setOtp} onComplete={handleVerifyOtp} fullWidth />
            </div>
            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={otp.length !== 6 || isVerifying}
              className="w-full h-10 rounded-lg bg-[#003323] text-white text-sm font-medium disabled:opacity-60"
            >
              {isVerifying ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Verifying…
                </span>
              ) : "Verify & Transfer"}
            </button>
          </div>
        </div>
      </BottomSheet>
    </>
  );
}

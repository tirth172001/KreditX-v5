"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ChevronRight } from "lucide-react";
import { useLoanStore } from "@/store/loanStore";
import { Button } from "@/components/ui/button";
import { OTPInput } from "@/components/loan/shared/OTPInput";
import { screenContainer, screenItem } from "@/components/loan/shared/motion";

const BANK_LOGOS: Record<string, string> = {
  bob:      "/logos/banks/bank-of-baroda.svg",
  canara:   "/logos/banks/canara-bank.svg",
  hdfc:     "/logos/banks/hdfc-bank.svg",
  icici:    "/logos/banks/icici-bank.svg",
  indusind: "/logos/banks/induslnd-bank.svg",
};

export function S8_AccountsFound() {
  const { data, next } = useLoanStore();
  const [otp, setOtp] = useState("");
  const [retriesLeft, setRetriesLeft] = useState(3);
  const [isLoading, setIsLoading] = useState(false);

  const mobileLast4 = (data.mobile || "").slice(-4) || "9747";
  const selectedBanks = data.selectedBanks.length > 0 ? data.selectedBanks : ["canara", "hdfc", "icici"];
  const avatarsToShow = selectedBanks.slice(0, 3);

  const handleVerify = async (val?: string) => {
    const code = val ?? otp;
    if (code.length !== 6) return;
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    toast.success("OTP verified successfully");
    next();
  };

  const handleResend = () => {
    if (retriesLeft > 0) {
      setOtp("");
      setRetriesLeft((value) => Math.max(0, value - 1));
      toast.info("OTP resent to your mobile");
    }
  };

  return (
    <>
      <motion.div
        className="flex flex-col gap-6 pb-44"
        variants={screenContainer}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={screenItem} className="h-[108px] w-full rounded-lg overflow-hidden">
          <img src="/illustrations/accounts_found.svg" alt="" className="h-full w-full object-cover" />
        </motion.div>

        <motion.div variants={screenItem} className="space-y-2">
          <h2 className="text-[18px] leading-7 font-semibold text-[#1c1917]">Verify your number</h2>
          <p className="text-sm leading-5 text-[#78716c]">
            Enter the OTP sent to your number ending ••••{mobileLast4} by Onemoney to link your bank accounts
          </p>
        </motion.div>

        <motion.div variants={screenItem} className="rounded-lg bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {avatarsToShow.map((bankId, index) => (
                  <div
                    key={bankId}
                    className="flex h-5 w-5 items-center justify-center rounded-full border border-[#d6d3d1] bg-white overflow-hidden p-0.5"
                    style={{ marginLeft: index === 0 ? 0 : -4 }}
                  >
                    <img src={BANK_LOGOS[bankId] ?? ""} alt={bankId} className="h-full w-full object-contain" />
                  </div>
                ))}
              </div>
              <p className="text-xs text-[#1c1917]">{selectedBanks.length} banks selected</p>
            </div>
            <ChevronRight className="h-4 w-4 text-[#003323]" />
          </div>
        </motion.div>

        <motion.div variants={screenItem} className="space-y-2">
          <p className="text-sm font-medium text-[#1c1917]">Enter OTP</p>

          <OTPInput length={6} value={otp} onChange={setOtp} onComplete={handleVerify} fullWidth />

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleResend}
              disabled={retriesLeft === 0}
              className="text-xs font-medium text-[#003323] disabled:text-[#78716c]/60"
            >
              Resend OTP
            </button>
            <p className="text-xs text-[#7a7a7a]">{retriesLeft} retries left</p>
          </div>
        </motion.div>
      </motion.div>

      <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-[390px] -translate-x-1/2 bg-[#fafaf9] px-4 py-4">
        <p className="text-center text-xs text-[#84878a]">
          By continuing, I agree to OneMoney <span className="text-[#2563eb]">TnC</span>
        </p>

        <Button
          type="button"
          onClick={() => handleVerify()}
          disabled={otp.length !== 6 || isLoading}
          className="mt-3 h-10 w-full text-sm font-semibold"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Verifying...
            </span>
          ) : "Verify OTP"}
        </Button>

        <p className="mt-3 text-center text-xs text-[#84878a]">Powered by RBI regulated AA</p>
      </div>
    </>
  );
}

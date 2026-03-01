"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Building2,
  ChevronRight,
  CreditCard,
  Pencil,
  Smartphone,
  UserSquare2,
} from "lucide-react";
import { BottomSheet } from "@/components/loan/shared/BottomSheet";
import { cn } from "@/lib/utils";
import { useLoanStore, SCREENS } from "@/store/loanStore";
import { StepProgressBar } from "@/components/loan/shared/StepProgressBar";
import { screenContainer, screenItem } from "@/components/loan/shared/motion";

type MethodOption = "upi" | "aadhaar" | "debit" | "netbanking";

const METHOD_OPTIONS: Array<{ id: MethodOption; label: string; icon: ReactNode }> = [
  { id: "upi", label: "UPI", icon: <Smartphone className="h-4 w-4" /> },
  { id: "aadhaar", label: "Aadhaar", icon: <UserSquare2 className="h-4 w-4" /> },
  { id: "debit", label: "Debit card", icon: <CreditCard className="h-4 w-4" /> },
  { id: "netbanking", label: "Net banking", icon: <Building2 className="h-4 w-4" /> },
];

export function S15_MandateSummary() {
  const { data, update, goTo } = useLoanStore();
  const setMerchantStripMode = useLoanStore((s) => s.setMerchantStripMode);

  useEffect(() => {
    setMerchantStripMode("none");
    return () => setMerchantStripMode(null);
  }, [setMerchantStripMode]);

  const [verifySheetOpen, setVerifySheetOpen] = useState(false);
  const [methodSheetOpen, setMethodSheetOpen] = useState(false);
  const [upiAppsSheetOpen, setUpiAppsSheetOpen] = useState(false);

  const bankVerified = data.bankVerified;

  const handleVerifyBank = async () => {
    setVerifySheetOpen(true);
    await new Promise((r) => setTimeout(r, 1800));
    update({ bankVerified: true });
    toast.success("Bank account verified successfully");
    setVerifySheetOpen(false);
  };

  const handleSelectMethod = (method: MethodOption) => {
    setMethodSheetOpen(false);
    if (method === "upi") {
      update({ autopayMethod: "upi" });
      setUpiAppsSheetOpen(true);
    } else {
      update({ autopayMethod: method, autopayApp: "", mandateSetup: true });
      goTo(SCREENS.TRANSFER_AMOUNT);
    }
  };

  const handleSelectUpiApp = (appId: string) => {
    update({ autopayApp: appId });
    setUpiAppsSheetOpen(false);
    goTo(SCREENS.SELECT_AUTOPAY);
  };

  const UPI_APPS = [
    { id: "phonepe", label: "PhonePe", bg: "#5f259f", text: "Pe" },
    { id: "bhim", label: "BHIM", bg: "#138808", text: "B" },
    { id: "gpay", label: "Google Pay", bg: "#2563eb", text: "G" },
    { id: "supermoney", label: "super.money", bg: "#4f46e5", text: "S" },
    { id: "whatsapp", label: "WhatsApp", bg: "#16a34a", text: "W" },
    { id: "paytm", label: "Paytm", bg: "#00baf2", text: "P" },
    { id: "idfc", label: "IDFC Bank", bg: "#dc2626", text: "I" },
    { id: "imobile", label: "iMobile Pay", bg: "#a16207", text: "M" },
  ];

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
          <h2 className="text-[18px] leading-7 font-semibold text-[#1c1917]">Setup auto-repayment</h2>
          <p className="text-sm leading-5 text-[#78716c]">
            Verify your bank account and set up auto-repayment for EMI collection.
          </p>
        </motion.div>

        {/* Bank account card */}
        <motion.div
          variants={screenItem}
          className="rounded-xl bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.1)]"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-[#1c1917]">Repayment account</p>
            <button type="button" className="text-[#1c1917]" aria-label="Edit bank">
              <Pencil className="h-4 w-4" />
            </button>
          </div>
          <div className="h-px bg-[#e7e5e4] mb-4" />
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e0f9ff] text-xs font-bold text-[#0369a1]">
              CB
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#1c1917]">{data.repaymentBankAccount}</p>
              <p className="text-xs text-[#78716c]">Savings account • xx{data.repaymentBankMasked}</p>
            </div>
            {bankVerified && (
              <div className="flex items-center gap-1 rounded-full bg-[#ecfdf3] px-2 py-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
                <span className="text-[10px] font-medium text-[#065f46]">Verified</span>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-[390px] -translate-x-1/2 bg-white px-4 pb-4 pt-3 border-t border-[#e7e5e4]">
        <div className="flex justify-center mb-3">
          <StepProgressBar currentStep={5} />
        </div>
        <button
          type="button"
          onClick={bankVerified ? () => setMethodSheetOpen(true) : handleVerifyBank}
          className="w-full h-10 rounded-lg bg-[#003323] text-white text-sm font-medium"
        >
          {bankVerified ? "Setup auto-repayment" : "Verify bank account"}
        </button>
        <div className="mt-2 flex items-center justify-center gap-1.5">
          <svg width="13" height="13" fill="none" viewBox="0 0 24 24">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#78716c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-xs text-[#78716c]">100% secure as per RBI</span>
        </div>
      </div>

      {/* Verify bank loading sheet (non-dismissible) */}
      <BottomSheet open={verifySheetOpen}>
        <div className="w-full max-w-[390px] overflow-hidden rounded-t-2xl bg-white">
          <div className="px-6 pt-6 pb-8 text-center space-y-5">
            <div className="flex justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#e7e5e4] border-t-[#003323]" />
            </div>
            <div>
              <h3 className="text-[18px] font-semibold text-[#1c1917]">Verifying bank account</h3>
              <p className="mt-1 text-sm text-[#78716c]">Please wait while we verify your account…</p>
            </div>
          </div>
        </div>
      </BottomSheet>

      {/* UPI app selection bottomsheet */}
      <BottomSheet open={upiAppsSheetOpen} onClose={() => setUpiAppsSheetOpen(false)}>
        <div className="w-full max-w-[390px] overflow-hidden rounded-t-2xl">
          {/* Header */}
          <div className="bg-[#f0f3f8] border-b border-[#d6d3d1] px-6 py-3 text-center">
            <p className="text-sm text-[#78716c]">Pay with</p>
          </div>
          {/* App grid */}
          <div className="bg-[#f0f3f8] px-6 py-5 space-y-5">
            {[UPI_APPS.slice(0, 4), UPI_APPS.slice(4)].map((row, rowIdx) => (
              <div key={rowIdx}>
                <div className="flex items-start justify-between">
                  {row.map((app) => (
                    <button
                      key={app.id}
                      type="button"
                      onClick={() => handleSelectUpiApp(app.id)}
                      className="flex flex-col items-center gap-2 w-16"
                    >
                      <div
                        className="flex h-16 w-16 items-center justify-center rounded-full text-base font-semibold text-white"
                        style={{ backgroundColor: app.bg }}
                      >
                        {app.text}
                      </div>
                      <p className="text-center text-[11px] leading-4 text-[#1c1917]">{app.label}</p>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </BottomSheet>

      {/* Select autopay method bottomsheet */}
      <BottomSheet open={methodSheetOpen} onClose={() => setMethodSheetOpen(false)}>
        <div className="w-full max-w-[390px] overflow-hidden rounded-t-2xl bg-white">
          <div className="px-6 pt-6 pb-2 border-b border-[#e7e5e4]">
            <h3 className="text-[18px] font-semibold text-[#1c1917]">Select autopay method</h3>
            <p className="mt-0.5 text-sm text-[#78716c]">Choose how you want to authorise mandate</p>
          </div>
          <div className="px-6 py-4 space-y-2">
            {METHOD_OPTIONS.map((method) => (
              <button
                key={method.id}
                type="button"
                onClick={() => handleSelectMethod(method.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg border border-[#e7e5e4] bg-white p-3 text-left",
                  "shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                )}
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f3f4f6] text-[#1c1917]">
                  {method.icon}
                </span>
                <span className="flex-1 text-sm font-medium text-[#1c1917]">{method.label}</span>
                <ChevronRight className="h-4 w-4 text-[#78716c]" />
              </button>
            ))}
          </div>
        </div>
      </BottomSheet>
    </>
  );
}

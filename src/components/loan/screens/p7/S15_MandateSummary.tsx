"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Building2,
  ChevronRight,
  CreditCard,
  Smartphone,
  UserSquare2,
  X,
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

function formatDate(d: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}

function addMonths(d: Date, n: number): Date {
  const result = new Date(d);
  result.setMonth(result.getMonth() + n);
  return result;
}

function addDays(d: Date, n: number): Date {
  const result = new Date(d);
  result.setDate(result.getDate() + n);
  return result;
}

export function S15_MandateSummary() {
  const { data, update, goTo } = useLoanStore();
  const setMerchantStripMode = useLoanStore((s) => s.setMerchantStripMode);

  useEffect(() => {
    setMerchantStripMode("none");
    return () => setMerchantStripMode(null);
  }, [setMerchantStripMode]);

  const [methodSheetOpen, setMethodSheetOpen] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const [upiAppsSheetOpen, setUpiAppsSheetOpen] = useState(false);
  const [bankDetailsSheetOpen, setBankDetailsSheetOpen] = useState(false);
  const [verifyingSheetOpen, setVerifyingSheetOpen] = useState(false);
  const [accountNumber, setAccountNumber] = useState("");
  const [ifsc, setIfsc] = useState("");

  // Mandate summary values
  const emi = data.finalEMI || 4321;
  const tenure = data.selectedTenure || 9;
  const today = new Date();
  const startDate = formatDate(addMonths(today, 1));
  const endDate = formatDate(addMonths(today, tenure));
  const firstDebitDate = formatDate(addDays(today, 30));
  const maxMandate = Math.ceil(emi * 1.1);

  const handleSelectMethod = (method: MethodOption) => {
    setMethodSheetOpen(false);
    if (method === "upi") {
      update({ autopayMethod: "upi" });
      setUpiAppsSheetOpen(true);
    } else {
      update({ autopayMethod: method });
      setBankDetailsSheetOpen(true);
    }
  };

  useEffect(() => {
    if (verifyingSheetOpen && progressRef.current) {
      // Reset then animate
      progressRef.current.style.transition = "none";
      progressRef.current.style.width = "0%";
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (progressRef.current) {
            progressRef.current.style.transition = "width 2s ease-in-out";
            progressRef.current.style.width = "100%";
          }
        });
      });
    }
  }, [verifyingSheetOpen]);

  const handleVerifyBankDetails = async () => {
    setBankDetailsSheetOpen(false);
    setVerifyingSheetOpen(true);
    await new Promise((r) => setTimeout(r, 2000));
    update({
      repaymentAccountNumber: accountNumber,
      repaymentIFSC: ifsc,
      bankVerified: true,
      mandateSetup: true,
    });
    toast.success("Bank account verified");
    setVerifyingSheetOpen(false);
    goTo(SCREENS.TRANSFER_AMOUNT);
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
        {/* Illustration placeholder */}
        <motion.div variants={screenItem} className="h-[108px] w-full rounded-lg overflow-hidden"><img src="/illustrations/setup_autopay.svg" alt="" className="h-full w-full object-cover" /></motion.div>

        <motion.div variants={screenItem} className="space-y-1">
          <h2 className="text-[18px] leading-7 font-semibold text-[#1c1917]">Setup auto-repayment</h2>
          <p className="text-sm leading-5 text-[#78716c]">
            Please verify your bank account and setup auto repayment facility
          </p>
        </motion.div>

        {/* Mandate summary card */}
        <motion.div
          variants={screenItem}
          className="rounded-xl bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.1)]"
        >
          <p className="text-sm font-semibold text-[#1c1917] mb-4">Auto-repayment details</p>
          <div className="h-px bg-[#e7e5e4] mb-4" />
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#78716c]">EMI amount</span>
              <span className="text-sm font-semibold text-[#1c1917]">
                ₹{emi.toLocaleString("en-IN")} every month on 2nd
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#78716c]">Start date</span>
              <span className="text-sm font-medium text-[#1c1917]">{startDate}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#78716c]">End date</span>
              <span className="text-sm font-medium text-[#1c1917]">{endDate}</span>
            </div>
            <div className="h-px bg-[#e7e5e4]" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#78716c]">First debit date</span>
              <span className="text-sm font-medium text-[#1c1917]">{firstDebitDate}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#78716c]">Maximum mandate amount</span>
              <span className="text-sm font-medium text-[#1c1917]">₹{maxMandate.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#78716c]">Purpose</span>
              <span className="text-sm font-medium text-[#1c1917]">Loan repayment</span>
            </div>
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
          onClick={() => setMethodSheetOpen(true)}
          className="w-full h-10 rounded-lg bg-[#003323] text-white text-sm font-medium"
        >
          Setup auto-repayment
        </button>
        <div className="mt-2 flex items-center justify-center gap-1.5">
          <svg width="13" height="13" fill="none" viewBox="0 0 24 24">
            <path
              d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
              stroke="#78716c"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-xs text-[#78716c]">100% secure as per RBI</span>
        </div>
      </div>

      {/* Select autopay method bottom sheet */}
      <BottomSheet open={methodSheetOpen} onClose={() => setMethodSheetOpen(false)}>
        <div className="w-full max-w-[390px] overflow-hidden rounded-t-2xl bg-white">
          <img src="/illustrations/loan_steps.svg" alt="" className="w-full object-cover" />
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

      {/* UPI app selection bottom sheet */}
      <BottomSheet open={upiAppsSheetOpen} onClose={() => setUpiAppsSheetOpen(false)}>
        <div className="w-full max-w-[390px] overflow-hidden rounded-t-2xl">
          <div className="bg-[#f0f3f8] border-b border-[#d6d3d1] px-6 py-3 text-center">
            <p className="text-sm text-[#78716c]">Pay with</p>
          </div>
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

      {/* Add bank details bottom sheet */}
      <BottomSheet
        open={bankDetailsSheetOpen}
        onClose={() => {
          setBankDetailsSheetOpen(false);
          update({ autopayMethod: "" });
        }}
      >
        <div className="w-full max-w-[390px] overflow-hidden rounded-t-2xl bg-white">
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#e7e5e4]">
            <h3 className="text-[18px] font-semibold text-[#1c1917]">Add bank details</h3>
            <button
              type="button"
              aria-label="Close"
              onClick={() => {
                setBankDetailsSheetOpen(false);
                update({ autopayMethod: "" });
              }}
              className="text-[#78716c]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="px-6 py-5 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#78716c] uppercase tracking-wide">
                Account number
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={18}
                placeholder="Enter account number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))}
                className="w-full rounded-lg border border-[#e7e5e4] bg-white px-3 py-2.5 text-sm text-[#1c1917] placeholder:text-[#a8a29e] focus:border-[#003323] focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#78716c] uppercase tracking-wide">
                IFSC code
              </label>
              <input
                type="text"
                placeholder="e.g. SBIN0001234"
                value={ifsc}
                onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                className="w-full rounded-lg border border-[#e7e5e4] bg-white px-3 py-2.5 text-sm text-[#1c1917] placeholder:text-[#a8a29e] focus:border-[#003323] focus:outline-none"
              />
              {ifsc.length >= 4 && (
                <p className="text-xs text-[#78716c]">Branch, City</p>
              )}
            </div>
            <button
              type="button"
              disabled={!accountNumber || !ifsc}
              onClick={handleVerifyBankDetails}
              className={cn(
                "mt-2 w-full h-10 rounded-lg text-sm font-medium",
                accountNumber && ifsc
                  ? "bg-[#003323] text-white"
                  : "bg-[#e7e5e4] text-[#a8a29e] cursor-not-allowed"
              )}
            >
              Verify bank details
            </button>
          </div>
        </div>
      </BottomSheet>

      {/* Verifying bank details bottom sheet (non-dismissible) */}
      <BottomSheet open={verifyingSheetOpen}>
        <div className="w-full max-w-[390px] overflow-hidden rounded-t-2xl bg-white">
          <div className="px-6 pt-8 pb-10 text-center space-y-5">
            <div className="flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e0f9ff]">
                <Building2 className="h-7 w-7 text-[#0369a1]" />
              </div>
            </div>
            <div>
              <h3 className="text-[18px] font-semibold text-[#1c1917]">Verifying your bank details</h3>
              <p className="mt-1 text-sm text-[#78716c]">Please wait a moment…</p>
            </div>
            {/* Animated progress bar */}
            <div className="h-1.5 w-full rounded-full bg-[#e7e5e4] overflow-hidden">
              <div
                ref={progressRef}
                className="h-full rounded-full bg-[#003323]"
                style={{ width: "0%" }}
              />
            </div>
          </div>
        </div>
      </BottomSheet>
    </>
  );
}

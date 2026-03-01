"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { calcEMI, formatINR, cn } from "@/lib/utils";
import { useLoanStore, SCREENS } from "@/store/loanStore";
import { screenContainer, screenItem } from "@/components/loan/shared/motion";

const MIN_LOAN_AMOUNT = 50000;
const TENURE_OPTIONS = [9, 6, 3];

export function S14_ConfirmOffer() {
  const { data, update, goTo } = useLoanStore();
  const setMerchantStripMode = useLoanStore((s) => s.setMerchantStripMode);

  useEffect(() => {
    setMerchantStripMode("none");
    return () => setMerchantStripMode(null);
  }, [setMerchantStripMode]);

  const lender = useMemo(() => {
    return (
      data.finalOffers.find((o) => o.id === data.selectedOfferId) ??
      data.finalOffers[0]
    );
  }, [data.finalOffers, data.selectedOfferId]);

  const maxAmount = lender?.maxAmount ?? 500000;
  const [selectedLoanAmount, setSelectedLoanAmount] = useState(maxAmount);
  const [selectedTenure, setSelectedTenure] = useState(TENURE_OPTIONS[0]);
  const [isConfirming, setIsConfirming] = useState(false);

  const tenureBreakdown = useMemo(() => {
    if (!lender) return [];
    return TENURE_OPTIONS.map((months) => {
      const emi = calcEMI(selectedLoanAmount, months, lender.rate);
      const interestCharged = Math.max(0, emi * months - selectedLoanAmount);
      const totalPayable = emi * months + lender.processingFee;
      return { months, emi, interestCharged, totalPayable };
    });
  }, [lender, selectedLoanAmount]);

  const handleConfirm = async () => {
    if (!lender) return;
    setIsConfirming(true);
    await new Promise((r) => setTimeout(r, 800));
    const emi = calcEMI(selectedLoanAmount, selectedTenure, lender.rate);
    update({ selectedTenure, finalLoanAmount: selectedLoanAmount, finalEMI: emi });
    goTo(SCREENS.SETUP_AUTOREPAYMENT);
  };

  if (!lender) return null;

  return (
    <>
      <motion.div
        className="flex flex-col gap-6 pb-44"
        variants={screenContainer}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={screenItem} className="h-[108px] w-full rounded-lg bg-[#f5f5f4]" />

        {/* Lender header */}
        <motion.div variants={screenItem} className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
            style={{ backgroundColor: lender.color }}
          >
            {lender.logoInitial}
          </div>
          <div>
            <h2 className="text-[18px] font-semibold text-[#1c1917]">{lender.name}</h2>
            <p className="text-xs text-[#78716c]">Interest rate: {lender.rate}% p.a.</p>
          </div>
        </motion.div>

        {/* Loan amount */}
        <motion.div
          variants={screenItem}
          className="rounded-xl bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.1)] space-y-4"
        >
          <div className="text-center">
            <p className="text-xs text-[#78716c]">Loan amount</p>
            <p className="mt-1 text-[32px] leading-[38px] font-semibold text-[#1c1917]">
              {formatINR(selectedLoanAmount)}
            </p>
          </div>
          <div className="space-y-2">
            <Slider
              min={MIN_LOAN_AMOUNT}
              max={maxAmount}
              step={5000}
              value={[selectedLoanAmount]}
              onValueChange={(v) => setSelectedLoanAmount(v[0] ?? MIN_LOAN_AMOUNT)}
            />
            <div className="flex items-center justify-between text-xs text-[#78716c]">
              <p>Min: {formatINR(MIN_LOAN_AMOUNT)}</p>
              <p>Max: {formatINR(maxAmount)}</p>
            </div>
          </div>
        </motion.div>

        {/* Tenure selection */}
        <motion.div
          variants={screenItem}
          className="rounded-xl bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.1)] space-y-3"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-[#1c1917]">Select tenure</p>
            <p className="text-xs text-[#78716c]">Processing fee: {formatINR(lender.processingFee)}</p>
          </div>

          {tenureBreakdown.map((option) => {
            const checked = selectedTenure === option.months;
            return (
              <button
                key={option.months}
                type="button"
                onClick={() => setSelectedTenure(option.months)}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg border p-3 text-left transition-colors",
                  checked ? "border-[#003323] bg-[#003323]/5" : "border-[#e7e5e4] bg-[#fafaf9]"
                )}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "flex h-4 w-4 items-center justify-center rounded-full border",
                      checked ? "border-[#003323]" : "border-[#d6d3d1]"
                    )}
                  >
                    {checked && <span className="h-2 w-2 rounded-full bg-[#003323]" />}
                  </span>
                  <p className="text-sm font-medium text-[#1c1917]">{option.months} months</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-[#1c1917]">{formatINR(option.emi)}/mo</p>
                  <p className="text-xs text-[#78716c]">Total: {formatINR(option.totalPayable)}</p>
                </div>
              </button>
            );
          })}

          <button type="button" className="text-xs font-medium text-[#0293a6]">
            View full KFS
          </button>
        </motion.div>
      </motion.div>

      <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-[390px] -translate-x-1/2 bg-white px-4 pb-4 pt-3 border-t border-[#e7e5e4]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => goTo(SCREENS.FINAL_OFFERS)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#e7e5e4] text-[#1c1917]"
            aria-label="Back"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isConfirming}
            className="flex-1 h-10 rounded-lg bg-[#003323] text-white text-sm font-medium disabled:opacity-60"
          >
            {isConfirming ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Confirming…
              </span>
            ) : "Confirm and proceed"}
          </button>
        </div>
      </div>
    </>
  );
}

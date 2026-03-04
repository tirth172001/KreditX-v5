"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, X } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { calcEMI, formatINR, cn } from "@/lib/utils";
import { useLoanStore, SCREENS } from "@/store/loanStore";
import { screenContainer, screenItem } from "@/components/loan/shared/motion";
import { BottomSheet } from "@/components/loan/shared/BottomSheet";

const MIN_LOAN_AMOUNT = 50000;
const TENURE_OPTIONS = [9, 6, 3];

// ─── Amortization helper ──────────────────────────────────────────────────────

function computeAmortizationRow(principal: number, months: number, annualRate: number, month: number) {
  const r = annualRate / 12 / 100;
  const emi = Math.round((principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1));
  let outstanding = principal;
  let principalPaid = 0;
  let interest = 0;
  for (let i = 0; i < month; i++) {
    interest = Math.round(outstanding * r);
    principalPaid = emi - interest;
    outstanding = Math.max(0, outstanding - principalPaid);
  }
  return { emi, interest, principalPaid, outstanding };
}

// ─── KFS Content ─────────────────────────────────────────────────────────────

function KFSContent({
  lender,
  firstName,
  lastName,
  loanAmount,
  tenure,
  emi,
  processingFee,
  interestCharged,
  totalPayable,
  appId,
}: {
  lender: { name: string; rate: number };
  firstName: string;
  lastName: string;
  loanAmount: number;
  tenure: number;
  emi: number;
  processingFee: number;
  interestCharged: number;
  totalPayable: number;
  appId: string;
}) {
  const lenderDomain = lender.name.toLowerCase().replace(/\s+/g, "") + ".com";

  const row1 = computeAmortizationRow(loanAmount, tenure, lender.rate, 1);
  const row2 = computeAmortizationRow(loanAmount, tenure, lender.rate, 2);
  const row3 = computeAmortizationRow(loanAmount, tenure, lender.rate, 3);

  const line = "─────────────────────────────────────";

  return (
    <pre className="whitespace-pre-wrap font-mono text-[11px] text-[#1c1917] leading-5">
{`KEY FACT STATEMENT (KFS)
As per RBI Guidelines on Digital Lending (2022)

LENDER DETAILS
${line}
Lender Name:      ${lender.name}
Borrower Name:    ${firstName} ${lastName}
Loan Product:     Instant Personal Loan
Application ID:   KX${appId}

LOAN SUMMARY
${line}
Sanctioned Amount      ${formatINR(loanAmount)}
Loan Tenure            ${tenure} months
Annual Rate (APR)      ${lender.rate}% p.a. (reducing balance)
Monthly EMI            ${formatINR(emi)}
First EMI Date         2nd of next month
Processing Fee         ${formatINR(processingFee)} (deducted upfront)
Total Interest         ${formatINR(interestCharged)}
Total Payable          ${formatINR(totalPayable)}

FEES & CHARGES
${line}
Processing Fee         ${formatINR(processingFee)} (one-time, non-refundable)
Prepayment Charges     Nil after payment of 3 EMIs
Foreclosure Charges    2% of outstanding principal (within 3 months)
Late Payment Penalty   ₹500 per missed EMI
Bounce / ECS Charges   ₹500 per bounce instance
Stamp Duty             As per applicable state law

REPAYMENT SCHEDULE (Indicative — First 3 Months)
${line}
Month 1  Principal ${formatINR(row1.principalPaid)}   Interest ${formatINR(row1.interest)}   Outstanding ${formatINR(row1.outstanding)}
Month 2  Principal ${formatINR(row2.principalPaid)}   Interest ${formatINR(row2.interest)}   Outstanding ${formatINR(row2.outstanding)}
Month 3  Principal ${formatINR(row3.principalPaid)}   Interest ${formatINR(row3.interest)}   Outstanding ${formatINR(row3.outstanding)}

BORROWER RIGHTS
${line}
• Cooling-off period: 3 business days from disbursement to cancel without penalty
• Right to prepay after 3 EMIs without foreclosure charges
• Right to receive a copy of this KFS before loan disbursal
• Grievance: grievances@${lenderDomain} | 1800-XXX-XXXX (Toll-free)
• RBI Ombudsman: https://rbi.org.in/Scripts/Complaints.aspx

DECLARATION
${line}
By accepting, I confirm I have read and understood this Key Fact Statement and agree to the Loan Agreement, Privacy Policy, and Terms & Conditions of ${lender.name}.

This KFS is issued pursuant to RBI Master Direction – Reserve Bank of India (Regulatory Framework for Microfinance Loans) Directions, 2022.`}
    </pre>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

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
  const [showTotal, setShowTotal] = useState(true);
  const [kfsOpen, setKfsOpen] = useState(false);

  // stable app id
  const [appId] = useState(() => String(Math.floor(10000000 + Math.random() * 90000000)));

  const tenureBreakdown = useMemo(() => {
    if (!lender) return [];
    return TENURE_OPTIONS.map((months) => {
      const emi = calcEMI(selectedLoanAmount, months, lender.rate);
      const interestCharged = Math.max(0, emi * months - selectedLoanAmount);
      const totalPayable = emi * months + lender.processingFee;
      return { months, emi, interestCharged, totalPayable };
    });
  }, [lender, selectedLoanAmount]);

  const selectedBreakdown = tenureBreakdown.find((t) => t.months === selectedTenure) ?? tenureBreakdown[0];

  const handleConfirm = async () => {
    if (!lender) return;
    setIsConfirming(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsConfirming(false);
    setKfsOpen(true);
  };

  const handleAccept = () => {
    if (!lender || !selectedBreakdown) return;
    update({
      selectedTenure,
      finalLoanAmount: selectedLoanAmount,
      finalEMI: selectedBreakdown.emi,
    });
    setKfsOpen(false);
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
        <motion.div variants={screenItem} className="h-[108px] w-full rounded-lg overflow-hidden"><img src="/illustrations/eligible_lenders.svg" alt="" className="h-full w-full object-cover" /></motion.div>

        {/* Lender header — centered */}
        <motion.div variants={screenItem} className="flex flex-col items-center gap-2">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-full text-[13px] font-bold text-white shadow-sm"
            style={{ backgroundColor: lender.color }}
          >
            {lender.logoInitial}
          </div>
          <div className="text-center">
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
            {/* Total / Interest toggle pill */}
            <div className="flex items-center rounded-lg bg-[#f5f5f4] p-0.5">
              <button
                type="button"
                onClick={() => setShowTotal(true)}
                className={cn(
                  "rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors",
                  showTotal ? "bg-white text-[#1c1917] shadow-sm" : "text-[#78716c]"
                )}
              >
                Total
              </button>
              <button
                type="button"
                onClick={() => setShowTotal(false)}
                className={cn(
                  "rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors",
                  !showTotal ? "bg-white text-[#1c1917] shadow-sm" : "text-[#78716c]"
                )}
              >
                Interest
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <p className="text-xs text-[#78716c]">EMI per month</p>
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
                  <p className="text-xs text-[#78716c]">
                    {showTotal
                      ? formatINR(option.totalPayable)
                      : formatINR(option.interestCharged)}
                  </p>
                </div>
              </button>
            );
          })}

          <p className="text-xs text-[#78716c]">Processing fees: {formatINR(lender.processingFee)}</p>
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

      {/* KFS Bottom Sheet — non-dismissible via backdrop */}
      <BottomSheet open={kfsOpen}>
        <div className="w-full max-w-[390px] overflow-hidden rounded-t-2xl bg-white">
          {/* Step tracker illustration */}
          <img src="/illustrations/loan_steps.svg" alt="" className="w-full object-cover" />
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#e7e5e4] px-5 py-3">
            <p className="text-sm font-semibold text-[#1c1917]">Terms &amp; conditions</p>
            <div className="flex items-center gap-2">
              <span className="rounded border border-[#e7e5e4] px-2 py-0.5 text-[11px] text-[#78716c]">
                ENGLISH ▾
              </span>
              <button
                type="button"
                onClick={() => setKfsOpen(false)}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f5f5f4] text-[#78716c]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Scrollable body */}
          <div className="overflow-y-auto max-h-[55vh] px-5 py-4 bg-[#fafaf9]">
            {selectedBreakdown && (
              <KFSContent
                lender={lender}
                firstName={data.firstName || "Applicant"}
                lastName={data.lastName || ""}
                loanAmount={selectedLoanAmount}
                tenure={selectedTenure}
                emi={selectedBreakdown.emi}
                processingFee={lender.processingFee}
                interestCharged={selectedBreakdown.interestCharged}
                totalPayable={selectedBreakdown.totalPayable}
                appId={appId}
              />
            )}
          </div>

          {/* Accept footer */}
          <div className="border-t border-[#e7e5e4] px-5 py-4">
            <button
              type="button"
              onClick={handleAccept}
              className="w-full h-11 rounded-lg bg-[#003323] text-white text-sm font-semibold"
            >
              Accept &amp; proceed
            </button>
          </div>
        </div>
      </BottomSheet>
    </>
  );
}

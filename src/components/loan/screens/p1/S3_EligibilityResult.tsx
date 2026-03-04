"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, ChevronRight, Shield, X } from "lucide-react";
import { useLoanStore, SCREENS } from "@/store/loanStore";
import { cn } from "@/lib/utils";
import { listContainer, listItem } from "@/components/loan/shared/motion";
import { BottomSheet } from "@/components/loan/shared/BottomSheet";

// ─── Lender logo — 24×24 white circle with colored initial ────────────────────

function LenderLogo({ logoInitial, color, size = "sm" }: {
  logoInitial: string;
  color: string;
  size?: "sm" | "lg";
}) {
  if (size === "lg") {
    return (
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
        style={{ backgroundColor: color }}
      >
        {logoInitial}
      </div>
    );
  }
  return (
    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white border border-[#d6d3d1] overflow-hidden p-1">
      <span className="text-[7px] font-bold leading-none" style={{ color }}>
        {logoInitial}
      </span>
    </div>
  );
}

// ─── Steps Bottom Sheet ───────────────────────────────────────────────────────

const LOAN_STEPS = [
  "Share your bank statement",
  "Verify your Aadhaar",
  "Selfie verification",
  "Select an offer",
  "Set up auto-repayment",
];

function StepsBottomSheet({ onCTA }: { onCTA: () => void }) {
  return (
    <div className="w-full max-w-[390px] overflow-hidden rounded-t-2xl bg-white">
      <div className="overflow-hidden">
        <img src="/illustrations/loan_steps.svg" alt="" className="w-full object-cover" />
      </div>

      <div className="px-6 pb-6">
        <h3 className="mt-5 text-[18px] leading-7 font-semibold text-[#1c1917]">
          Steps to get a loan
        </h3>
        <div className="mt-4 space-y-3">
          {LOAN_STEPS.map((label, index) => (
            <div key={label} className="flex items-center gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#d6d3d1] text-xs font-semibold text-[#78716c]">
                {index + 1}
              </div>
              <p className="text-sm text-[#1c1917]">{label}</p>
            </div>
          ))}
        </div>
        <p className="mt-5 text-xs leading-5 text-[#78716c]">
          By continuing, you agree to share your details with all selected lenders to analyse your details and generate an offer
        </p>
        <button
          type="button"
          onClick={onCTA}
          className="mt-5 w-full h-10 rounded-lg bg-[#003323] text-white text-sm font-medium"
        >
          Share bank statement
        </button>
        <div className="mt-3 flex items-center justify-center gap-1.5">
          <Shield className="h-3.5 w-3.5 text-[#78716c]" strokeWidth={1.5} />
          <span className="text-xs text-[#78716c]">100% secure as per RBI</span>
        </div>
      </div>
    </div>
  );
}

// ─── Excluded Lenders Sheet ───────────────────────────────────────────────────

function ExcludedLendersSheet({ lenders }: {
  lenders: Array<{ id: string; name: string; logoInitial: string; color: string; ineligibleReason?: string }>;
}) {
  return (
    <div className="w-full max-w-[390px] overflow-hidden rounded-t-2xl bg-white">
      <div className="bg-[#003323] px-5 py-4">
        <p className="text-sm text-white leading-5">
          You are not eligible for below lenders, hence they are excluded
        </p>
      </div>
      <div className="px-5 py-4 space-y-3">
        {lenders.map((lender) => (
          <div key={lender.id} className="flex items-center gap-3 py-1">
            <LenderLogo logoInitial={lender.logoInitial} color={lender.color} size="lg" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#1c1917]">{lender.name}</p>
              {lender.ineligibleReason && (
                <p className="text-xs text-[#78716c]">{lender.ineligibleReason}</p>
              )}
            </div>
            <X className="h-4 w-4 shrink-0 text-[#ef4444]" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function S3_EligibilityResult() {
  const { data, update, goTo } = useLoanStore();
  const [stepsOpen, setStepsOpen] = useState(false);
  const [excludedSheetOpen, setExcludedSheetOpen] = useState(false);

  const eligible = data.eligibleLenders.filter((l) => l.isEligible);
  const ineligible = data.eligibleLenders.filter((l) => !l.isEligible);

  const [localSelected, setLocalSelected] = useState<string[]>(
    data.eligibleLenders.filter((l) => l.isSelected).map((l) => l.id)
  );

  const toggleLender = (id: string) => {
    setLocalSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleGenerateOffer = () => {
    update({
      eligibleLenders: data.eligibleLenders.map((l) => ({
        ...l,
        isSelected: localSelected.includes(l.id),
      })),
    });
    setStepsOpen(true);
  };

  return (
    <>
      <div className="flex flex-col gap-6 pb-36">
        {/* Illustration */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="h-[108px] w-full rounded-lg overflow-hidden"
        >
          <img src="/illustrations/eligible_lenders.svg" alt="" className="h-full w-full object-cover" />
        </motion.div>

        {/* Heading + excluded row — tighter 16px gap between them */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.2 }}
          className="flex flex-col gap-4"
        >
          <div className="space-y-1">
            <h2 className="text-[18px] leading-7 font-semibold text-[#1c1917]">
              Yay! you are eligible for {eligible.length} lenders
            </h2>
            <p className="text-sm leading-5 text-[#78716c]">
              You are eligible for loans from below lenders, select from whom do you want to get an offer
            </p>
          </div>

          {/* Excluded lenders pill row */}
          {ineligible.length > 0 && (
            <button
              type="button"
              onClick={() => setExcludedSheetOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-white p-2 shadow-[0_1px_1px_rgba(0,0,0,0.02),0_1px_2px_rgba(0,0,0,0.04)]"
            >
              {/* Overlapping logo circles */}
              <div className="flex items-center shrink-0">
                {ineligible.slice(0, 3).map((l, idx) => (
                  <div
                    key={l.id}
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-white border border-[#d6d3d1] overflow-hidden p-0.5"
                    style={{ marginLeft: idx === 0 ? 0 : -8 }}
                  >
                    <span className="text-[6px] font-bold leading-none" style={{ color: l.color }}>
                      {l.logoInitial}
                    </span>
                  </div>
                ))}
              </div>
              <p className="flex-1 text-xs font-medium text-[#1c1917] text-left">
                {ineligible.length} Lenders excluded
              </p>
              {/* Chevron right — using -rotate-90 on chevron-down matches Figma */}
              <ChevronRight className="h-5 w-5 shrink-0 text-[#78716c]" />
            </button>
          )}
        </motion.div>

        {/* Eligible lenders list — 8px gap between rows */}
        <motion.div
          variants={listContainer}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-2"
        >
          {eligible.map((lender) => {
            const isChecked = localSelected.includes(lender.id);
            return (
              <motion.button
                key={lender.id}
                variants={listItem}
                type="button"
                onClick={() => toggleLender(lender.id)}
                className="flex w-full items-start gap-3 rounded-lg bg-white p-3 text-left shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
              >
                <LenderLogo logoInitial={lender.logoInitial} color={lender.color} />

                <div className={cn("flex-1 min-w-0", lender.maxAmount ? "flex flex-col gap-1" : "flex items-center")}>
                  <p className="text-sm font-semibold leading-5 text-[#1c1917]">{lender.name}</p>
                  {lender.maxAmount && (
                    <p className="text-xs leading-4 text-[#78716c]">
                      Upto ₹{lender.maxAmount.toLocaleString("en-IN")}
                    </p>
                  )}
                </div>

                {/* Checkbox — 16×16, rounded-[4px], solid green when checked */}
                <div
                  className={cn(
                    "flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border transition-colors mt-0.5",
                    isChecked
                      ? "border-[#003323] bg-[#003323]"
                      : "border-[#d6d3d1] bg-white"
                  )}
                >
                  {isChecked && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
                </div>
              </motion.button>
            );
          })}
        </motion.div>
      </div>

      {/* Fixed footer */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] bg-white px-4 py-3 z-10 border-t border-[#e7e5e4] shadow-[0_-1px_3px_rgba(0,0,0,0.06)] space-y-2">
        <button
          type="button"
          onClick={handleGenerateOffer}
          disabled={localSelected.length === 0}
          className="w-full h-10 rounded-lg bg-[#003323] text-white text-sm font-semibold disabled:opacity-60"
        >
          Generate offer
        </button>
        <div className="flex items-center justify-center gap-1.5">
          <Shield className="h-3.5 w-3.5 text-[#78716c]" strokeWidth={1.5} />
          <span className="text-xs text-[#78716c]">100% secure as per RBI</span>
        </div>
      </div>

      {/* Steps sheet */}
      <BottomSheet open={stepsOpen} onClose={() => setStepsOpen(false)}>
        <StepsBottomSheet
          onCTA={() => {
            setStepsOpen(false);
            goTo(SCREENS.BANK_SELECTION);
          }}
        />
      </BottomSheet>

      {/* Excluded lenders sheet */}
      <BottomSheet open={excludedSheetOpen} onClose={() => setExcludedSheetOpen(false)}>
        <ExcludedLendersSheet lenders={ineligible} />
      </BottomSheet>
    </>
  );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, ChevronRight, Shield, X } from "lucide-react";
import { useLoanStore, SCREENS } from "@/store/loanStore";
import { cn } from "@/lib/utils";
import { listContainer, listItem } from "@/components/loan/shared/motion";
import { BottomSheet } from "@/components/loan/shared/BottomSheet";

// ─── Lender logo ──────────────────────────────────────────────────────────────

function LenderLogo({ logoInitial, color }: { logoInitial: string; color: string }) {
  return (
    <div
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
      style={{ backgroundColor: color }}
    >
      {logoInitial}
    </div>
  );
}

// ─── Steps Bottom Sheet ───────────────────────────────────────────────────────

const LOAN_STEPS = [
  "Share your bank statement",
  "Verify your Aadhar",
  "Selfie verification",
  "Select an offer",
  "Setup autopay",
];

function StepsBottomSheet({ onCTA }: { onCTA: () => void }) {
  return (
    <div className="w-full max-w-[390px] overflow-hidden rounded-t-2xl bg-white">
      {/* Illustration */}
      <div className="bg-[#f5f5f4] px-6 pt-6 pb-4">
        <div className="flex justify-center">
          <div className="w-52 h-28 bg-white rounded-lg border border-[#e7e5e4] p-4 shadow-sm flex flex-col gap-2">
            <p className="text-[10px] text-[#78716c]">Loan application</p>
            <div className="flex gap-3">
              <div className="flex-1 flex flex-col gap-1.5">
                <div className="h-2 w-full bg-[#d6d3d1] rounded" />
                <div className="h-2 w-3/4 bg-[#d6d3d1] rounded" />
                <div className="h-2 w-1/2 bg-[#003323]/30 rounded" />
              </div>
              <div className="w-14 flex flex-col gap-1.5">
                <div className="h-2 w-full bg-[#d6d3d1] rounded" />
                <div className="h-2 w-full bg-[#d6d3d1] rounded" />
              </div>
            </div>
            <div className="flex gap-1 mt-1">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-3 flex-1 bg-[#e7e5e4] rounded" />
              ))}
            </div>
          </div>
        </div>
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

function ExcludedLendersSheet({ lenders }: { lenders: Array<{ id: string; name: string; logoInitial: string; color: string; ineligibleReason?: string }> }) {
  return (
    <div className="w-full max-w-[390px] overflow-hidden rounded-t-2xl bg-white">
      {/* Dark green banner */}
      <div className="bg-[#003323] px-5 py-4">
        <p className="text-sm text-white leading-5">
          You are not eligible for below lenders, hence they are excluded
        </p>
      </div>

      <div className="px-5 py-4 space-y-3">
        {lenders.map((lender) => (
          <div key={lender.id} className="flex items-center gap-3 py-1">
            <LenderLogo logoInitial={lender.logoInitial} color={lender.color} />
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
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="h-[108px] w-full rounded-lg bg-[#f5f5f4]"
        />

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.2 }}
          className="space-y-1"
        >
          <h2 className="text-[18px] leading-7 font-semibold text-[#1c1917]">
            Yay! you are eligible for {eligible.length} lenders
          </h2>
          <p className="text-sm leading-5 text-[#78716c]">
            You are eligible for loans from below lenders, select from whom do you want to get an offer
          </p>
        </motion.div>

        {/* Excluded lenders row */}
        {ineligible.length > 0 && (
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.2 }}
            onClick={() => setExcludedSheetOpen(true)}
            className="flex items-center gap-3 rounded-xl bg-[#fafaf9] px-4 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.05)] border border-[#e7e5e4]"
          >
            {/* Logo stack */}
            <div className="flex items-center">
              {ineligible.slice(0, 3).map((l, idx) => (
                <div
                  key={l.id}
                  className="flex h-6 w-6 items-center justify-center rounded-full text-[7px] font-bold text-white border-2 border-white"
                  style={{ backgroundColor: l.color, marginLeft: idx === 0 ? 0 : -6 }}
                >
                  {l.logoInitial}
                </div>
              ))}
            </div>
            <p className="flex-1 text-sm text-[#78716c] text-left">
              {ineligible.length} Lender{ineligible.length > 1 ? "s" : ""} excluded
            </p>
            <ChevronRight className="h-4 w-4 text-[#78716c]" />
          </motion.button>
        )}

        {/* Eligible lenders list */}
        <motion.div
          variants={listContainer}
          initial="hidden"
          animate="show"
          className="space-y-2"
        >
          {eligible.map((lender) => {
            const isChecked = localSelected.includes(lender.id);
            return (
              <motion.button
                key={lender.id}
                variants={listItem}
                type="button"
                onClick={() => toggleLender(lender.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl bg-white px-4 py-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-colors",
                  isChecked ? "border border-[#003323]/20" : "border border-transparent"
                )}
              >
                <LenderLogo logoInitial={lender.logoInitial} color={lender.color} />
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-semibold text-[#1c1917]">{lender.name}</p>
                  {lender.maxAmount && (
                    <p className="text-xs text-[#78716c]">
                      Upto ₹{(lender.maxAmount / 100000).toFixed(0)},00,000
                    </p>
                  )}
                </div>
                {/* Green checkbox */}
                <div
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors",
                    isChecked
                      ? "border-[#003323] bg-[#003323]"
                      : "border-[#d6d3d1] bg-white"
                  )}
                >
                  {isChecked && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
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
          className="w-full h-10 rounded-lg bg-[#003323] text-white text-sm font-medium disabled:opacity-60"
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

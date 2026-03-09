"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Shield, X } from "lucide-react";
import { useLoanStore, SCREENS, type LenderOffer } from "@/store/loanStore";
import { listContainer, listItem } from "@/components/loan/shared/motion";
import { BottomSheet } from "@/components/loan/shared/BottomSheet";

// ─── Lender logo ──────────────────────────────────────────────────────────────

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

// ─── Bank Statement Decision Sheet ───────────────────────────────────────────

function BankStatementDecisionSheet({
  lender,
  onShareBankStatement,
  onSkip,
}: {
  lender: LenderOffer;
  onShareBankStatement: () => void;
  onSkip: () => void;
}) {
  return (
    <div className="w-full max-w-[390px] overflow-hidden rounded-t-2xl bg-white">
      {/* Handle */}
      <div className="flex justify-center pt-3 pb-1">
        <div className="h-1 w-10 rounded-full bg-[#d6d3d1]" />
      </div>

      <div className="px-5 pb-6 pt-3 space-y-5">
        {/* Heading */}
        <div className="space-y-1">
          <h3 className="text-[18px] font-semibold leading-7 text-[#1c1917]">
            Your tentative offer
          </h3>
          <p className="text-xs text-[#78716c]">Based on your credit profile</p>
        </div>

        {/* Offer card — same design as lender list */}
        <div className="overflow-hidden rounded-xl border border-[#e7e5e4] bg-white">
          {/* Identity row */}
          <div className="flex items-center gap-3 px-4 py-3.5">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white"
              style={{ backgroundColor: lender.color }}
            >
              {lender.logoInitial}
            </div>
            <p className="flex-1 text-sm font-semibold text-[#1c1917]">{lender.name}</p>
          </div>

          {/* Stat bar */}
          <div className="grid grid-cols-3 divide-x divide-[#f0f0ef] border-t border-[#f0f0ef]">
            <div className="flex flex-col pl-4 py-2.5 gap-0.5">
              <p className="text-xs font-semibold text-[#1c1917]">
                ₹{((lender.maxAmount ?? 0) / 100000).toFixed(0)}L
              </p>
              <p className="text-[10px] text-[#a8a29e]">Max amount</p>
            </div>
            <div className="flex flex-col pl-4 py-2.5 gap-0.5">
              <p className="text-xs font-semibold text-[#1c1917]">
                {lender.minRate === lender.maxRate
                  ? `${lender.minRate}%`
                  : `${lender.minRate}–${lender.maxRate}%`}
              </p>
              <p className="text-[10px] text-[#a8a29e]">Rate p.a.</p>
            </div>
            <div className="flex flex-col pl-4 py-2.5 gap-0.5">
              <p className="text-xs font-semibold text-[#1c1917]">
                {lender.minTenure}–{lender.maxTenure}m
              </p>
              <p className="text-[10px] text-[#a8a29e]">Tenure</p>
            </div>
          </div>
        </div>

        {/* Banner */}
        <div className="overflow-hidden rounded-xl bg-[#003323] relative">
          {/* Decorative circle */}
          <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/[0.04]" />
          <div className="pointer-events-none absolute -right-2 -bottom-6 h-20 w-20 rounded-full bg-white/[0.04]" />

          <div className="relative px-4 py-5 space-y-4">
            <div className="space-y-1">
              <p className="text-base font-bold text-white">Get a better offer</p>
              <p className="text-xs text-white/55 leading-5">
                Share your bank statement and let lenders see your full financial picture for higher limits and lower rates.
              </p>
            </div>

            <button
              type="button"
              onClick={onShareBankStatement}
              className="w-full h-10 rounded-lg bg-white text-[#003323] text-sm font-semibold"
            >
              Share bank statement
            </button>

            <div className="flex items-center justify-center gap-1.5">
              <Shield className="h-3 w-3 text-white/35" strokeWidth={1.5} />
              <span className="text-[10px] text-white/35">100% secure as per RBI</span>
            </div>
          </div>
        </div>

        {/* Skip */}
        <button
          type="button"
          onClick={onSkip}
          className="w-full py-1 text-center text-sm font-medium text-[#003323]"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function S3_EligibilityResult() {
  const { data, update, goTo } = useLoanStore();
  const [pendingLenderId, setPendingLenderId] = useState<string>("");
  const [decisionSheetOpen, setDecisionSheetOpen] = useState(false);
  const [excludedSheetOpen, setExcludedSheetOpen] = useState(false);

  const eligible = data.eligibleLenders.filter((l) => l.isEligible);
  const ineligible = data.eligibleLenders.filter((l) => !l.isEligible);

  const pendingLender = eligible.find((l) => l.id === pendingLenderId);

  const handleCardTap = (lenderId: string) => {
    setPendingLenderId(lenderId);
    setDecisionSheetOpen(true);
  };

  return (
    <>
      <div className="flex flex-col gap-6 pb-10">
        {/* Illustration */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="h-[108px] w-full rounded-lg overflow-hidden"
        >
          <img src="/illustrations/eligible_lenders.svg" alt="" className="h-full w-full object-cover" />
        </motion.div>

        {/* Heading */}
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
            Tap a lender to see your tentative offer and proceed
          </p>
        </motion.div>

        {/* Eligible lenders — tentative offer cards */}
        <motion.div
          variants={listContainer}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-2"
        >
          {eligible.map((lender) => (
            <motion.button
              key={lender.id}
              variants={listItem}
              type="button"
              onClick={() => handleCardTap(lender.id)}
              whileTap={{ scale: 0.985 }}
              className="w-full overflow-hidden rounded-xl bg-white text-left shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
            >
              {/* Identity row */}
              <div className="flex items-center gap-3 px-4 py-3.5">
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white"
                  style={{ backgroundColor: lender.color }}
                >
                  {lender.logoInitial}
                </div>
                <p className="flex-1 text-sm font-semibold text-[#1c1917]">{lender.name}</p>
                <ChevronRight className="h-4 w-4 shrink-0 text-[#a8a29e]" />
              </div>

              {/* Stat bar */}
              <div className="grid grid-cols-3 divide-x divide-[#f0f0ef] border-t border-[#f0f0ef]">
                <div className="flex flex-col pl-4 py-2.5 gap-0.5">
                  <p className="text-xs font-semibold text-[#1c1917]">
                    ₹{lender.maxAmount ? (lender.maxAmount / 100000).toFixed(0) + "L" : "—"}
                  </p>
                  <p className="text-[10px] text-[#a8a29e]">Max amount</p>
                </div>
                <div className="flex flex-col pl-4 py-2.5 gap-0.5">
                  <p className="text-xs font-semibold text-[#1c1917]">
                    {lender.minRate === lender.maxRate
                      ? `${lender.minRate}%`
                      : `${lender.minRate}–${lender.maxRate}%`}
                  </p>
                  <p className="text-[10px] text-[#a8a29e]">Rate p.a.</p>
                </div>
                <div className="flex flex-col pl-4 py-2.5 gap-0.5">
                  <p className="text-xs font-semibold text-[#1c1917]">
                    {lender.minTenure && lender.maxTenure
                      ? `${lender.minTenure}–${lender.maxTenure}m`
                      : "—"}
                  </p>
                  <p className="text-[10px] text-[#a8a29e]">Tenure</p>
                </div>
              </div>
            </motion.button>
          ))}

          {/* Excluded lenders — quiet footnote at bottom of list */}
          {ineligible.length > 0 && (
            <motion.button
              variants={listItem}
              type="button"
              onClick={() => setExcludedSheetOpen(true)}
              className="flex items-center justify-center gap-1.5 py-2"
            >
              <span className="text-xs text-[#a8a29e]">
                {ineligible.length} lender{ineligible.length > 1 ? "s" : ""} not eligible
              </span>
              <ChevronRight className="h-3 w-3 text-[#a8a29e]" />
            </motion.button>
          )}
        </motion.div>
      </div>

      {/* Decision sheet */}
      <BottomSheet open={decisionSheetOpen} onClose={() => setDecisionSheetOpen(false)}>
        {pendingLender && (
          <BankStatementDecisionSheet
            lender={pendingLender}
            onShareBankStatement={() => {
              update({ selectedLenderId: pendingLenderId });
              setDecisionSheetOpen(false);
              goTo(SCREENS.BANK_SELECTION);
            }}
            onSkip={() => {
              update({ selectedLenderId: pendingLenderId });
              setDecisionSheetOpen(false);
              goTo(SCREENS.AADHAAR_KYC);
            }}
          />
        )}
      </BottomSheet>

      {/* Excluded lenders sheet */}
      <BottomSheet open={excludedSheetOpen} onClose={() => setExcludedSheetOpen(false)}>
        <ExcludedLendersSheet lenders={ineligible} />
      </BottomSheet>
    </>
  );
}

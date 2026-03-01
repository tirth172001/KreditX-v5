"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Shield } from "lucide-react";
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

// ─── Main component ───────────────────────────────────────────────────────────

export function S3_EligibilityResult() {
  const { data, goTo } = useLoanStore();
  const [stepsOpen, setStepsOpen] = useState(false);

  const eligible = data.eligibleLenders.filter((l) => l.isEligible);
  const ineligible = data.eligibleLenders.filter((l) => !l.isEligible);

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

        <motion.div
          variants={listContainer}
          initial="hidden"
          animate="show"
          className="space-y-2"
        >
          {eligible.map((lender) => (
            <motion.div
              key={lender.id}
              variants={listItem}
              className="flex items-center gap-3 rounded-xl bg-white px-4 py-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
            >
              <LenderLogo logoInitial={lender.logoInitial} color={lender.color} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#1c1917]">{lender.name}</p>
                {lender.maxAmount && (
                  <p className="text-xs text-[#78716c]">
                    Upto ₹{(lender.maxAmount / 100000).toFixed(0)},{lender.maxAmount >= 100000 ? "00,000" : "00,000"}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {ineligible.length > 0 && (
          <button
            type="button"
            className={cn(
              "text-sm font-medium text-[#0293a6] text-center",
            )}
          >
            Edit lender list
          </button>
        )}
      </div>

      {/* Fixed footer */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] bg-white px-4 py-3 z-10 border-t border-[#e7e5e4] shadow-[0_-1px_3px_rgba(0,0,0,0.06)] space-y-2">
        <button
          type="button"
          onClick={() => setStepsOpen(true)}
          className="w-full h-10 rounded-lg bg-[#003323] text-white text-sm font-medium"
        >
          Generate offer from all
        </button>
        <div className="flex items-center justify-center gap-1.5">
          <Shield className="h-3.5 w-3.5 text-[#78716c]" strokeWidth={1.5} />
          <span className="text-xs text-[#78716c]">100% secure as per RBI</span>
        </div>
      </div>

      <BottomSheet open={stepsOpen} onClose={() => setStepsOpen(false)}>
        <StepsBottomSheet
          onCTA={() => {
            setStepsOpen(false);
            goTo(SCREENS.BANK_SELECTION);
          }}
        />
      </BottomSheet>
    </>
  );
}

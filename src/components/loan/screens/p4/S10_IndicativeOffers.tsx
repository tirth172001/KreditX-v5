"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { formatINR } from "@/lib/utils";
import { useLoanStore, SCREENS } from "@/store/loanStore";
import { StepProgressBar } from "@/components/loan/shared/StepProgressBar";
import { screenContainer, screenItem } from "@/components/loan/shared/motion";

// ─── Confetti burst ───────────────────────────────────────────────────────────

const CONFETTI_COLORS = ["#003323", "#10b981", "#fbbf24", "#3b82f6", "#f43f5e", "#8b5cf6", "#fb923c"];

function ConfettiBurst() {
  const particles = useMemo(
    () =>
      Array.from({ length: 32 }, (_, i) => ({
        id: i,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        left: 5 + (i * 2.9) % 90,
        delay: (i * 0.055) % 1.0,
        duration: 1.6 + (i * 0.09) % 1.0,
        size: 5 + (i % 4) * 2,
        isRect: i % 3 !== 0,
        spin: i % 2 === 0 ? 1 : -1,
      })),
    []
  );

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 h-52 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className={p.isRect ? "absolute rounded-[2px]" : "absolute rounded-full"}
          style={{
            left: `${p.left}%`,
            top: -p.size * 2,
            width: p.size,
            height: p.isRect ? p.size * 0.45 : p.size,
            backgroundColor: p.color,
          }}
          initial={{ y: 0, opacity: 1, rotate: 0 }}
          animate={{
            y: 220,
            opacity: [1, 1, 0.9, 0],
            rotate: 540 * p.spin,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: [0.2, 0, 0.8, 1],
          }}
        />
      ))}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function S10_IndicativeOffers() {
  const { data, update, goTo } = useLoanStore();

  // Single offer — the one the user selected at S3
  const offer =
    data.finalOffers.find((o) => o.id === data.selectedLenderId) ?? data.finalOffers[0];

  // Pull tenure range from eligibleLenders for richer display
  const eligibleLender = data.eligibleLenders.find((l) => l.id === offer?.id);

  const handleProceed = () => {
    if (!offer) return;
    update({ selectedOfferId: offer.id });
    goTo(SCREENS.LENDER_DETAIL);
  };

  if (!offer) return null;

  return (
    <>
      <motion.div
        className="flex flex-col gap-6 pb-44"
        variants={screenContainer}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={screenItem}>
          <StepProgressBar currentStep={4} />
        </motion.div>

        {/* Celebration hero */}
        <motion.div
          variants={screenItem}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#003323] via-[#00533a] to-[#006647] px-5 pt-7 pb-7"
        >
          <ConfettiBurst />

          <motion.div
            className="relative z-10 flex justify-center mb-4"
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 260, damping: 18 }}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm">
              <span className="text-3xl" role="img" aria-label="trophy">🎉</span>
            </div>
          </motion.div>

          <motion.div
            className="relative z-10 text-center space-y-1"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.3 }}
          >
            <p className="text-[22px] font-bold leading-7 text-white">Your offer is ready!</p>
          </motion.div>
        </motion.div>

        {/* Offer details card — lender + terms unified */}
        <motion.div
          variants={screenItem}
          className="rounded-xl border border-[#e7e5e4] bg-white overflow-hidden"
        >
          {/* Lender row */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#f0f0ef]">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white"
              style={{ backgroundColor: offer.color }}
            >
              {offer.logoInitial}
            </div>
            <p className="flex-1 text-sm font-semibold text-[#1c1917]">{offer.name}</p>
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#003323]">
              <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                <path d="M1 3l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 divide-x divide-[#f0f0ef] px-0 py-0">
            <div className="flex flex-col items-center py-4 gap-0.5">
              <p className="text-sm font-semibold text-[#1c1917]">{formatINR(data.finalLoanAmount)}</p>
              <p className="text-[11px] text-[#a8a29e]">Loan amount</p>
            </div>
            <div className="flex flex-col items-center py-4 gap-0.5">
              <p className="text-sm font-semibold text-[#1c1917]">{offer.rate}% p.a.</p>
              <p className="text-[11px] text-[#a8a29e]">Interest rate</p>
            </div>
            <div className="flex flex-col items-center py-4 gap-0.5">
              <p className="text-sm font-semibold text-[#1c1917]">
                {eligibleLender?.minTenure && eligibleLender?.maxTenure
                  ? `${eligibleLender.minTenure}–${eligibleLender.maxTenure}m`
                  : "3–24m"}
              </p>
              <p className="text-[11px] text-[#a8a29e]">Tenure</p>
            </div>
          </div>
        </motion.div>

        <motion.p variants={screenItem} className="text-xs text-center text-[#a8a29e] px-2">
          You can adjust the loan amount and tenure on the next screen
        </motion.p>
      </motion.div>

      {/* Footer */}
      <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-[390px] -translate-x-1/2 border-t border-[#e7e5e4] bg-white px-4 py-4">
        <button
          type="button"
          onClick={handleProceed}
          className="w-full h-11 rounded-lg bg-[#003323] text-white text-sm font-semibold"
        >
          Customise &amp; proceed
        </button>
      </div>
    </>
  );
}

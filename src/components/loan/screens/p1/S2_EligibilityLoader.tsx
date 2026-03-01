"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gauge } from "lucide-react";
import { useLoanStore } from "@/store/loanStore";

const STEPS = [
  { label: "Matching your details...", duration: 1400 },
  { label: "Checking your eligibility...", duration: 1400 },
  { label: "Finding lender matches...", duration: 1400 },
  { label: "Generating your result...", duration: 1200 },
];

export function S2_EligibilityLoader() {
  const { next } = useLoanStore();
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    let elapsed = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];

    STEPS.forEach((step, index) => {
      const t = setTimeout(() => {
        setActiveStep(index);
      }, elapsed + step.duration);
      timers.push(t);
      elapsed += step.duration;
    });

    const doneTimer = setTimeout(() => next(), elapsed + 400);
    timers.push(doneTimer);

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [next]);

  const progress = ((activeStep + 1) / STEPS.length) * 100;
  const progressWidth = `${Math.min(100, Math.max(0, progress))}%`;

  return (
    <div className="flex min-h-[calc(100dvh-170px)] flex-col items-center justify-center px-4">
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
          <Gauge className="h-6 w-6 text-[#292524]" strokeWidth={1.75} />
        </div>
        <AnimatePresence mode="wait">
          <motion.p
            key={activeStep}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
            className="min-h-6 text-base font-medium text-[#1c1917]"
          >
            {STEPS[activeStep]?.label ?? STEPS[0].label}
          </motion.p>
        </AnimatePresence>

        <div className="h-1.5 w-[172px] overflow-hidden rounded-[40px] bg-[#f5f5f4]">
          <motion.div
            className="h-full rounded-[40px] bg-[#003323]"
            animate={{ width: progressWidth }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          />
        </div>

      </div>
    </div>
  );
}

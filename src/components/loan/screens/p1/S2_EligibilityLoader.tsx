"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLoanStore } from "@/store/loanStore";

const STEPS = [
  { label: "Validating PAN number…", duration: 1200 },
  { label: "Fetching credit profile…", duration: 1800 },
  { label: "Calculating risk score…", duration: 1400 },
  { label: "Matching with lenders…", duration: 1600 },
];

const TRUST_FACTS = [
  "Soft check only — zero impact on your credit score",
  "Your data is encrypted with 256-bit SSL",
  "Compliant with RBI data privacy guidelines",
  "Over 2 lakh customers approved monthly",
];

export function S2_EligibilityLoader() {
  const { next } = useLoanStore();
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [currentFact, setCurrentFact] = useState(0);

  useEffect(() => {
    let elapsed = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];

    STEPS.forEach((step, i) => {
      const t = setTimeout(() => {
        setCompletedSteps((prev) => [...prev, i]);
      }, elapsed + step.duration);
      timers.push(t);
      elapsed += step.duration;
    });

    const doneTimer = setTimeout(() => next(), elapsed + 400);
    timers.push(doneTimer);

    const factTimer = setInterval(() => {
      setCurrentFact((f) => (f + 1) % TRUST_FACTS.length);
    }, 2200);

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(factTimer);
    };
  }, [next]);

  const progress = ((completedSteps.length) / STEPS.length) * 100;

  return (
    <div className="flex flex-col items-center gap-8 py-6">
      {/* Animated ring */}
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
          <circle cx="48" cy="48" r="40" fill="none" stroke="var(--color-muted)" strokeWidth="6" />
          <motion.circle
            cx="48" cy="48" r="40"
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 40}`}
            initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
            animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - progress / 100) }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-primary">{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Steps */}
      <div className="w-full space-y-3">
        {STEPS.map((step, i) => {
          const isDone = completedSteps.includes(i);
          const isActive = !isDone && completedSteps.length === i;

          return (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3"
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                isDone ? "bg-green-500" : isActive ? "bg-primary" : "bg-muted"
              }`}>
                {isDone ? (
                  <span className="text-white text-[10px] font-bold">✓</span>
                ) : isActive ? (
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                )}
              </div>
              <span className={`text-sm transition-all ${
                isDone ? "text-foreground font-medium line-through text-muted-foreground"
                : isActive ? "text-foreground font-semibold"
                : "text-muted-foreground"
              }`}>
                {step.label}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Rotating trust fact */}
      <div className="w-full bg-primary/8 rounded-2xl px-5 py-4 min-h-[64px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentFact}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="text-sm text-center text-primary font-medium"
          >
            🛡️ {TRUST_FACTS[currentFact]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

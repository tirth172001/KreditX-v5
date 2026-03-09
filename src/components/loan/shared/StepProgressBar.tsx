"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { BottomSheet } from "@/components/loan/shared/BottomSheet";

const STEPS = [
  "Share your bank statement",
  "Verify your Aadhar",
  "Selfie verification",
  "Select an offer",
  "Setup autopay",
];

interface StepProgressBarProps {
  currentStep: 2 | 3 | 4 | 5;
}

export function StepProgressBar({ currentStep }: StepProgressBarProps) {
  const [open, setOpen] = useState(false);
  const currentLabel = STEPS[currentStep - 1];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full text-left"
      >
        {/* Label row */}
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-medium text-[#1c1917]">{currentLabel}</p>
          <span className="text-xs text-[#a8a29e]">{currentStep} of 5</span>
        </div>

        {/* Thin progress bar */}
        <div className="flex gap-0.5">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-0.5 flex-1 rounded-full transition-all duration-500 ${
                i + 1 <= currentStep ? "bg-[#003323]" : "bg-[#e7e5e4]"
              }`}
            />
          ))}
        </div>
      </button>

      <BottomSheet open={open} onClose={() => setOpen(false)}>
        <div className="w-full max-w-[390px] overflow-hidden rounded-t-2xl bg-white">
          {/* Illustration */}
          <div className="bg-[#f5f5f4] px-6 pt-6 pb-4">
            <div className="h-24 w-full rounded-lg bg-white/60 flex items-center justify-center">
              <div className="w-40 h-20 bg-white rounded-md border border-[#e7e5e4] p-3 flex flex-col gap-1.5">
                <p className="text-[9px] text-[#78716c]">Loan application</p>
                <div className="h-1.5 w-full bg-[#d6d3d1] rounded" />
                <div className="h-1.5 w-3/4 bg-[#d6d3d1] rounded" />
                <div className="h-1.5 w-1/2 bg-[#d6d3d1] rounded" />
                <div className="flex gap-1 mt-0.5">
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
              {STEPS.map((label, index) => {
                const stepNum = index + 1;
                const done = stepNum < currentStep;
                const active = stepNum === currentStep;

                return (
                  <div key={label} className="flex items-center gap-3">
                    {done ? (
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#003323]">
                        <Check className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
                      </div>
                    ) : (
                      <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold ${active ? "border-[#003323] text-[#003323]" : "border-[#d6d3d1] text-[#78716c]"}`}>
                        {stepNum}
                      </div>
                    )}
                    <p className={`text-sm ${done ? "font-medium text-[#1c1917]" : active ? "font-semibold text-[#1c1917]" : "text-[#78716c]"}`}>
                      {label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </BottomSheet>
    </>
  );
}

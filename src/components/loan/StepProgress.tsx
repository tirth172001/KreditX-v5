"use client";

import { cn } from "@/lib/utils";

export interface StepConfig {
  label: string;
}

interface StepProgressProps {
  steps: StepConfig[];
  currentStep: number; // 1-based
  className?: string;
}

/**
 * Matches the Figma design exactly:
 * — Pill-shaped progress bar (72px track, variable green fill)
 * — Step label to the right
 */
export function StepProgress({ steps, currentStep, className }: StepProgressProps) {
  const total = steps.length;
  const fillPercent = Math.min((currentStep / total) * 100, 100);
  const label = steps[currentStep - 1]?.label ?? "";

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* Track + fill */}
      <div className="relative w-[72px] h-[6px] rounded-full bg-[#e7e5e4] flex-shrink-0">
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-[#003323] transition-all duration-400"
          style={{ width: `${fillPercent}%` }}
        />
      </div>
      {/* Step label */}
      <span className="text-xs font-medium text-[#44403c] whitespace-nowrap">
        {label}
      </span>
    </div>
  );
}

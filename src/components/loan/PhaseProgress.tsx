"use client";

import { PHASES, getPhaseForScreen } from "@/store/loanStore";
import { cn } from "@/lib/utils";

interface PhaseProgressProps {
  currentScreen: number;
}

export function PhaseProgress({ currentScreen }: PhaseProgressProps) {
  const currentPhase = getPhaseForScreen(currentScreen);

  return (
    <div className="px-4 pb-2.5 pt-1 bg-white border-t border-[#f5f5f4]">
      <div className="flex items-center">
        {PHASES.map((phase, i) => {
          const isCompleted = phase.id < currentPhase.id;
          const isCurrent = phase.id === currentPhase.id;
          const isLast = i === PHASES.length - 1;

          return (
            <div key={phase.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-0.5">
                <div
                  className={cn(
                    "w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold transition-all",
                    isCompleted
                      ? "bg-[#003323] text-white"
                      : isCurrent
                      ? "bg-[#003323] text-white ring-2 ring-[#003323]/20"
                      : "bg-[#e7e5e4] text-[#78716c]"
                  )}
                >
                  {isCompleted ? (
                    <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    phase.id
                  )}
                </div>
                <span
                  className={cn(
                    "text-[7px] font-medium whitespace-nowrap leading-none",
                    isCurrent
                      ? "text-[#003323]"
                      : isCompleted
                      ? "text-[#003323]/60"
                      : "text-[#78716c]"
                  )}
                >
                  {phase.label}
                </span>
              </div>
              {!isLast && (
                <div
                  className={cn(
                    "h-px flex-1 mx-0.5 mb-3 transition-all",
                    isCompleted ? "bg-[#003323]/40" : "bg-[#e7e5e4]"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

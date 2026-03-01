"use client";

import { useEffect } from "react";
import { useLoanStore } from "@/store/loanStore";

const BANK_AVATARS = [
  { initial: "H",  color: "#004C8F" },
  { initial: "IC", color: "#F58220" },
  { initial: "B",  color: "#F58220" },
];

export function S7_AAOTP() {
  const { next } = useLoanStore();

  useEffect(() => {
    const timer = setTimeout(() => next(), 2200);
    return () => clearTimeout(timer);
  }, [next]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 pt-10">
      <div className="flex items-center">
        {BANK_AVATARS.map((bank, index) => (
          <div
            key={bank.initial}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-[#d6d3d1] text-[11px] font-bold text-white"
            style={{ marginLeft: index === 0 ? 0 : -8, backgroundColor: bank.color }}
          >
            {bank.initial}
          </div>
        ))}
      </div>

      <p className="text-base font-semibold text-[#1c1917]">Connecting with your banks...</p>

      <div className="h-1.5 w-[172px] rounded-full bg-[#003323]" />
    </div>
  );
}

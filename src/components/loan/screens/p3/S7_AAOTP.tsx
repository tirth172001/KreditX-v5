"use client";

import { useEffect } from "react";
import { useLoanStore } from "@/store/loanStore";

const BANK_LOGOS: Record<string, string> = {
  bob:      "/logos/banks/bank-of-baroda.svg",
  canara:   "/logos/banks/canara-bank.svg",
  hdfc:     "/logos/banks/hdfc-bank.svg",
  icici:    "/logos/banks/icici-bank.svg",
  indusind: "/logos/banks/induslnd-bank.svg",
};

export function S7_AAOTP() {
  const { data, next } = useLoanStore();

  useEffect(() => {
    const timer = setTimeout(() => next(), 2200);
    return () => clearTimeout(timer);
  }, [next]);

  const selectedBanks = data.selectedBanks.length > 0
    ? data.selectedBanks
    : ["canara", "hdfc", "icici"];

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 pt-10">
      <div className="flex items-center">
        {selectedBanks.slice(0, 3).map((bankId, index) => (
          <div
            key={bankId}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-[#d6d3d1] bg-white p-2 overflow-hidden"
            style={{ marginLeft: index === 0 ? 0 : -8 }}
          >
            <img src={BANK_LOGOS[bankId] ?? ""} alt={bankId} className="h-full w-full object-contain" />
          </div>
        ))}
      </div>

      <p className="text-base font-semibold text-[#1c1917]">Connecting with your banks...</p>

      <div className="h-1.5 w-[172px] rounded-full bg-[#003323]" />
    </div>
  );
}

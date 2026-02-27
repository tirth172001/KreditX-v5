"use client";

import { useEffect } from "react";
import { useLoanStore } from "@/store/loanStore";

const BANK_LOGOS = [
  "https://www.figma.com/api/mcp/asset/dc75269d-c34d-4a2e-a1b0-40758516b974",
  "https://www.figma.com/api/mcp/asset/087d5b11-abec-4b5e-a29e-3d05fe24f06c",
  "https://www.figma.com/api/mcp/asset/43db6e65-7b9a-4f84-ac46-6dc4399cb5bb",
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
        {BANK_LOGOS.map((logo, index) => (
          <div
            key={logo}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-[#d6d3d1] bg-white"
            style={{ marginLeft: index === 0 ? 0 : -8 }}
          >
            <img src={logo} alt="" className="h-6 w-6 object-contain" />
          </div>
        ))}
      </div>

      <p className="text-base font-semibold text-[#1c1917]">Connecting with your banks...</p>

      <div className="h-1.5 w-[172px] rounded-full bg-[#003323]" />
    </div>
  );
}

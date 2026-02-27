"use client";

import { useEffect } from "react";
import { BadgeCheck, Landmark, Shield } from "lucide-react";
import { useLoanStore } from "@/store/loanStore";

export function S13_FinalOffers() {
  const { next } = useLoanStore();

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("loan:merchant-strip-mode", { detail: { mode: "close" } })
    );

    return () => {
      window.dispatchEvent(
        new CustomEvent("loan:merchant-strip-mode", { detail: { mode: "default" } })
      );
    };
  }, []);

  return (
    <div className="flex min-h-[calc(100dvh-170px)] flex-col gap-6">
      <div className="h-[108px] w-full rounded-lg bg-[#f5f5f4]" />

      <div className="space-y-1">
        <h2 className="text-[32px] leading-[38px] font-semibold tracking-[-0.02em] text-[#1c1917]">
          Yay! you are eligible
        </h2>
        <p className="text-sm leading-5 text-[#78716c]">
          Complete below steps to get the loan in your bank account
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-start gap-3 rounded-lg p-3">
          <BadgeCheck className="mt-0.5 h-5 w-5 text-[#10b981]" strokeWidth={2} />
          <div>
            <p className="text-sm font-semibold text-[#1c1917]">Generate offer</p>
            <p className="text-xs text-[#78716c]">Select your lenders and generate possible offers</p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-lg p-3">
          <BadgeCheck className="mt-0.5 h-5 w-5 text-[#10b981]" strokeWidth={2} />
          <div>
            <p className="text-sm font-semibold text-[#1c1917]">Complete KYC</p>
            <p className="text-xs text-[#78716c]">Provide Aadhaar and identity proof to get money</p>
          </div>
        </div>

        <div className="rounded-lg bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          <div className="flex items-start gap-3">
            <Landmark className="mt-0.5 h-5 w-5 text-[#1c1917]" strokeWidth={2} />
            <div>
              <p className="text-sm font-semibold text-[#1c1917]">Select tenure &amp; setup autopay</p>
              <p className="text-xs text-[#78716c]">Select preferred tenure &amp; setup autopay</p>
            </div>
          </div>

          <button
            type="button"
            onClick={next}
            className="mt-3 text-sm font-medium text-[#003323]"
          >
            Select tenure
          </button>
        </div>

        {[
          "Setup autopay",
          "Get money in your bank",
        ].map((label) => (
          <div key={label} className="flex items-start gap-3 rounded-lg p-3 opacity-50">
            <Landmark className="mt-0.5 h-5 w-5 text-[#78716c]" strokeWidth={2} />
            <div>
              <p className="text-sm font-semibold text-[#1c1917]">{label}</p>
              <p className="text-xs text-[#78716c]">Select preferred terms &amp; setup autopay</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-center gap-2 pb-2 text-xs text-[#78716c]">
        <Shield className="h-4 w-4" strokeWidth={1.75} />
        <span>100% secure as per RBI</span>
      </div>
    </div>
  );
}

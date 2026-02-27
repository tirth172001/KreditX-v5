"use client";

import { useEffect } from "react";
import { BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLoanStore } from "@/store/loanStore";

export function S19_AgreementSigned() {
  const { data, update, next } = useLoanStore();

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("loan:merchant-strip-mode", { detail: { mode: "none" } })
    );

    return () => {
      window.dispatchEvent(
        new CustomEvent("loan:merchant-strip-mode", { detail: { mode: "default" } })
      );
    };
  }, []);

  return (
    <>
      <div className="flex flex-col gap-6 pb-44">
        <div className="h-[108px] w-full rounded-lg bg-[#f5f5f4]" />

        <div className="space-y-1">
          <h2 className="text-[32px] leading-[38px] font-semibold tracking-[-0.02em] text-[#1c1917]">
            Agreement signed
          </h2>
          <p className="text-sm leading-5 text-[#78716c]">
            Your loan agreement has been digitally signed via Aadhaar OTP.
          </p>
        </div>

        <div className="rounded-lg bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          <div className="rounded bg-[#003323]/15 p-4">
            <div className="h-[180px] rounded bg-white p-3">
              <div className="space-y-2 text-left">
                <p className="text-sm font-semibold text-[#003323]">Loan Agreement</p>
                <div className="h-px bg-[#e7e5e4]" />
                <div className="grid grid-cols-3 gap-2">
                  {Array.from({ length: 15 }).map((_, i) => (
                    <div key={i} className="h-3 rounded border border-[#e7e5e4]" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-sm text-[#78716c]">Signed by</p>
            <p className="text-[22px] leading-[28px] font-semibold text-[#1c1917]">
              {(data.firstName || "Tirth")} {(data.lastName || "Nehalkumar Trivedi")}
            </p>
          </div>

          <button type="button" className="mt-3 text-sm font-semibold text-[#003323]">
            Download signed document
          </button>
        </div>

        <div className="rounded-lg bg-[#ecfdf3] p-4">
          <div className="flex items-start gap-3">
            <BadgeCheck className="mt-0.5 h-5 w-5 text-[#10b981]" />
            <p className="text-sm font-semibold text-[#065f46]">Document signed successfully via Aadhaar</p>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-[390px] -translate-x-1/2 border-t border-[#e7e5e4] bg-[#fafaf9] px-4 py-4">
        <Button
          type="button"
          onClick={() => {
            update({ agreementSigned: true });
            next();
          }}
          className="h-10 w-full text-sm font-semibold"
        >
          Continue
        </Button>
      </div>
    </>
  );
}

"use client";

import { useEffect } from "react";
import { BadgeCheck, Landmark, Shield, LoaderCircle } from "lucide-react";
import { useLoanStore } from "@/store/loanStore";

export function S17_UPIMandate() {
  const { data, goTo } = useLoanStore();

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

  const completedSteps = [
    {
      title: "Generate offer",
      subtitle: "Select your lenders and generate possible offers",
    },
    {
      title: "Complete KYC",
      subtitle: "Provide Aadhaar and identity proof to get money",
    },
    {
      title: "Select tenure",
      subtitle: "Select preferred terms",
    },
    {
      title: "Setup autopay",
      subtitle: "Provide your bank details and setup autopay",
    },
  ];

  const isTransferProcessing = data.transferProcessing;

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
        {completedSteps.map((item) => (
          <div key={item.title} className="flex items-start gap-3 rounded-lg p-3">
            <BadgeCheck className="mt-0.5 h-5 w-5 text-[#10b981]" strokeWidth={2} />
            <div>
              <p className="text-sm font-semibold text-[#1c1917]">{item.title}</p>
              <p className="text-xs text-[#78716c]">{item.subtitle}</p>
            </div>
          </div>
        ))}

        <div className="rounded-lg bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          <div className="flex items-start gap-3">
            {isTransferProcessing ? (
              <BadgeCheck className="mt-0.5 h-5 w-5 text-[#10b981]" strokeWidth={2} />
            ) : (
              <Landmark className="mt-0.5 h-5 w-5 text-[#1c1917]" strokeWidth={2} />
            )}

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-[#1c1917]">Get money in your bank</p>
                {isTransferProcessing && (
                  <span className="rounded-full bg-[#fef3c7] px-2 py-0.5 text-[10px] font-semibold text-[#92400e]">
                    Process
                  </span>
                )}
              </div>

              <p className="mt-0.5 text-xs text-[#78716c]">
                {isTransferProcessing
                  ? "Processing money transfer to your selected bank account"
                  : "Sign the loan agreement and get money in your bank"}
              </p>

              {isTransferProcessing ? (
                <div className="mt-3 flex items-center gap-2 text-sm font-medium text-[#003323]">
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Processing money transfer
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    if (!data.agreementSigned) {
                      goTo(18);
                      return;
                    }
                    goTo(20);
                  }}
                  className="mt-3 text-sm font-medium text-[#003323]"
                >
                  {data.agreementSigned ? "Transfer money" : "Sign loan agreement"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-center gap-2 pb-2 text-xs text-[#78716c]">
        <Shield className="h-4 w-4" strokeWidth={1.75} />
        <span>100% secure as per RBI</span>
      </div>
    </div>
  );
}

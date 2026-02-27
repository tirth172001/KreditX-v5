"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, EyeOff, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLoanStore } from "@/store/loanStore";

type AgreementStage = "agreement" | "aadhaar";

export function S18_Agreement() {
  const { data, update, next, back } = useLoanStore();
  const [stage, setStage] = useState<AgreementStage>("agreement");

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("loan:merchant-strip-mode", { detail: { mode: "menu-close" } })
    );

    return () => {
      window.dispatchEvent(
        new CustomEvent("loan:merchant-strip-mode", { detail: { mode: "default" } })
      );
    };
  }, []);

  const handleSendOtp = () => {
    update({ agreementOtpSent: true });
    next();
  };

  if (stage === "aadhaar") {
    return (
      <>
        <div className="flex flex-col gap-6 pb-44">
          <div className="h-[108px] w-full rounded-lg bg-[#f5f5f4]" />

          <div className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-[32px] leading-[38px] font-semibold tracking-[-0.02em] text-[#1c1917]">
                Aadhaar verification
              </h2>
              <p className="text-sm leading-5 text-[#78716c]">
                Verify Aadhaar with OTP to sign your loan agreement.
              </p>
            </div>

            <div className="flex items-center gap-3 py-1">
              <div className="h-1.5 w-[72px] rounded-full bg-[#e7e5e4]">
                <div className="h-1.5 w-full rounded-full bg-[#003323]" />
              </div>
              <p className="text-xs font-medium text-[#44403c]">Verify Aadhaar</p>
            </div>
          </div>

          <div className="rounded-lg bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <div className="flex gap-4">
              <div className="flex h-16 w-[58px] items-center justify-center rounded bg-[#003323]/10">
                <UserRound className="h-8 w-8 text-[#003323]" strokeWidth={2} />
              </div>

              <div className="space-y-1 text-xs leading-4 text-[#1c1917]">
                <p>
                  <span className="text-[#44403c]">Name:</span>{" "}
                  <span className="font-medium">{`${data.firstName || "Tirth"} ${data.lastName || "Trivedi"}`}</span>
                </p>
                <p>
                  <span className="text-[#44403c]">Gender:</span>{" "}
                  <span className="font-medium">Male</span>
                </p>
                <p>
                  <span className="text-[#44403c]">DOB:</span>{" "}
                  <span className="font-medium">17/06/2001</span>
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-lg border border-[#e7e5e4] bg-[#fafaf9] px-3 py-2">
              <p className="flex-1 text-base tracking-[0.02em] text-[#1c1917]">3238 5857 4689</p>
              <EyeOff className="h-4 w-4 text-[#78716c]" />
            </div>

            <div className="mt-4 border-t border-[#e7e5e4]" />
            <p className="mt-4 text-xs text-[#78716c]">OTP will be shared to Aadhaar registered number</p>
          </div>
        </div>

        <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-[390px] -translate-x-1/2 border-t border-[#e7e5e4] bg-[#fafaf9] px-4 py-4">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="h-10 w-10 bg-[#e8fbff] text-[#0293a6] hover:bg-[#daf7fb]"
              onClick={() => setStage("agreement")}
              aria-label="Back"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <Button type="button" onClick={handleSendOtp} className="h-10 flex-1 text-sm font-semibold">
              Send OTP
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-6 pb-44">
        <div className="h-[108px] w-full rounded-lg bg-[#f5f5f4]" />

        <div className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-[32px] leading-[38px] font-semibold tracking-[-0.02em] text-[#1c1917]">
              Get money in your bank
            </h2>
            <p className="text-sm leading-5 text-[#78716c]">
              Sign the loan agreement and get money in your bank
            </p>
          </div>

          <div className="flex items-center gap-3 py-1">
            <div className="h-1.5 w-[72px] rounded-full bg-[#e7e5e4]">
              <div className="h-1.5 w-[38px] rounded-full bg-[#003323]" />
            </div>
            <p className="text-xs font-medium text-[#44403c]">Sign loan agreement</p>
          </div>
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

          <p className="mt-4 text-lg font-semibold text-[#1c1917]">Loan agreement document</p>

          <button type="button" className="mt-2 text-sm font-medium text-[#003323]">
            View full document
          </button>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-[390px] -translate-x-1/2 border-t border-[#e7e5e4] bg-[#fafaf9] px-4 py-4">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="h-10 w-10 bg-[#e8fbff] text-[#0293a6] hover:bg-[#daf7fb]"
            onClick={back}
            aria-label="Back"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <Button type="button" onClick={() => setStage("aadhaar")} className="h-10 flex-1 text-sm font-semibold">
            Sign agreement
          </Button>
        </div>
      </div>
    </>
  );
}

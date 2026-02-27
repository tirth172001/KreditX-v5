"use client";

import { useEffect, useState } from "react";
import { BadgeCheck, ChevronLeft, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OTPInput } from "@/components/loan/shared/OTPInput";
import { formatINR } from "@/lib/utils";
import { useLoanStore } from "@/store/loanStore";

type MandateStep = "mandate" | "pin" | "success";

export function S16_SelectAutopay() {
  const { data, update, next, back } = useLoanStore();
  const [step, setStep] = useState<MandateStep>("mandate");
  const [upiPin, setUpiPin] = useState("");

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

  const emiAmount = data.finalEMI || 200;
  const holdAmount = data.finalLoanAmount ? Math.min(data.finalLoanAmount, 10000) : 10000;
  const upiApp = data.autopayApp || "bhim";

  const finishMandate = () => {
    update({ mandateSetup: true });
    next();
  };

  if (step === "pin") {
    return (
      <>
        <div className="flex flex-col gap-6 pb-44">
          <div className="h-[108px] w-full rounded-lg bg-[#f5f5f4]" />

          <div className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-[32px] leading-[38px] font-semibold tracking-[-0.02em] text-[#1c1917]">
                Enter UPI PIN
              </h2>
              <p className="text-sm leading-5 text-[#78716c]">
                Enter your 4-digit UPI PIN to authorize autopay mandate.
              </p>
            </div>

            <div className="flex items-center gap-3 py-1">
              <div className="h-1.5 w-[72px] rounded-full bg-[#e7e5e4]">
                <div className="h-1.5 w-[48px] rounded-full bg-[#003323]" />
              </div>
              <p className="text-xs font-medium text-[#44403c]">Verify UPI PIN</p>
            </div>
          </div>

          <div className="space-y-4 rounded-lg bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <div>
              <p className="text-sm font-semibold text-[#1c1917]">ICICI Bank XXXXXXX5</p>
              <p className="mt-1 text-sm text-[#78716c]">Mandate amount: {formatINR(emiAmount)}</p>
            </div>

            <div className="rounded-lg bg-[#fafaf9] p-4 text-center">
              <p className="text-sm font-semibold tracking-wide text-[#57534e]">ENTER 4-DIGIT UPI PIN</p>
              <div className="mx-auto mt-4 w-fit">
                <OTPInput length={4} value={upiPin} onChange={setUpiPin} />
              </div>
            </div>

            <div className="rounded-lg bg-[#fef3c7] px-3 py-2 text-sm text-[#44403c]">
              You are authorizing {formatINR(emiAmount)} monthly debit through {upiApp.toUpperCase()}.
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-[390px] -translate-x-1/2 border-t border-[#e7e5e4] bg-[#fafaf9] px-4 py-4">
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setStep("mandate")} className="h-10 flex-1">
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => setStep("success")}
              disabled={upiPin.length !== 4}
              className="h-10 flex-1"
            >
              Submit
            </Button>
          </div>
        </div>
      </>
    );
  }

  if (step === "success") {
    return (
      <>
        <div className="flex flex-col gap-6 pb-44">
          <div className="h-[108px] w-full rounded-lg bg-[#f5f5f4]" />

          <div className="space-y-1">
            <h2 className="text-[32px] leading-[38px] font-semibold tracking-[-0.02em] text-[#1c1917]">
              Mandate created
            </h2>
            <p className="text-sm leading-5 text-[#78716c]">
              Your autopay setup is complete. We will proceed to the next step.
            </p>
          </div>

          <div className="space-y-4 rounded-lg bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <div className="flex items-center gap-3 rounded-lg bg-[#ecfdf3] p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#10b981] text-white">
                <BadgeCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#065f46]">Mandate approved successfully</p>
                <p className="text-xs text-[#065f46]/80">Authorized in {upiApp.toUpperCase()}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-[#78716c]">Mandate amount</p>
                <p className="mt-1 font-semibold text-[#1c1917]">{formatINR(holdAmount)}</p>
              </div>
              <div>
                <p className="text-[#78716c]">Frequency</p>
                <p className="mt-1 font-semibold text-[#1c1917]">As presented</p>
              </div>
            </div>

            <div className="rounded-lg bg-[#f5f5f4] px-3 py-2 text-xs text-[#57534e]">
              Mandate is linked to your selected repayment account.
            </div>
          </div>

          <div className="mt-auto flex items-center justify-center gap-2 pb-2 text-xs text-[#78716c]">
            <ShieldCheck className="h-4 w-4" strokeWidth={1.75} />
            <span>100% secure as per RBI</span>
          </div>
        </div>

        <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-[390px] -translate-x-1/2 border-t border-[#e7e5e4] bg-[#fafaf9] px-4 py-4">
          <Button type="button" onClick={finishMandate} className="h-10 w-full text-sm font-semibold">
            Continue
          </Button>
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
              Approve autopay mandate
            </h2>
            <p className="text-sm leading-5 text-[#78716c]">
              Review mandate details and approve on your selected UPI app.
            </p>
          </div>

          <div className="flex items-center gap-3 py-1">
            <div className="h-1.5 w-[72px] rounded-full bg-[#e7e5e4]">
              <div className="h-1.5 w-6 rounded-full bg-[#003323]" />
            </div>
            <p className="text-xs font-medium text-[#44403c]">Approve mandate</p>
          </div>
        </div>

        <div className="space-y-4 rounded-lg bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          <div>
            <p className="text-sm font-semibold text-[#1c1917]">Mandate from KreditX</p>
            <p className="mt-1 text-xs text-[#78716c]">Requested via {upiApp.toUpperCase()}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-[#78716c]">Debit amount</p>
              <p className="mt-1 font-semibold text-[#1c1917]">{formatINR(emiAmount)}</p>
            </div>
            <div>
              <p className="text-[#78716c]">Validity</p>
              <p className="mt-1 font-semibold text-[#1c1917]">Till loan closure</p>
            </div>
          </div>

          <div className="rounded-lg bg-[#f5f5f4] px-3 py-2 text-xs text-[#57534e]">
            Mandate allows automatic EMI collection on due dates only.
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-[390px] -translate-x-1/2 border-t border-[#e7e5e4] bg-[#fafaf9] px-4 py-4">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="secondary"
            size="icon"
            onClick={back}
            className="h-10 w-10 bg-[#e8fbff] text-[#0293a6] hover:bg-[#daf7fb]"
            aria-label="Back"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <Button type="button" onClick={() => setStep("pin")} className="h-10 flex-1 text-sm font-semibold">
            Approve mandate
          </Button>
        </div>
      </div>
    </>
  );
}

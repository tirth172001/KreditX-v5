"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OTPInput } from "@/components/loan/shared/OTPInput";
import { useLoanStore } from "@/store/loanStore";

export function S20_Success() {
  const { data, back, goTo, update } = useLoanStore();
  const [otpSheetOpen, setOtpSheetOpen] = useState(false);
  const [otp, setOtp] = useState("");

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

  const mobile = data.mobile || "9876543210";
  const mobileLast4 = mobile.slice(-4);

  const handleVerifyOtp = () => {
    if (otp.length !== 6) return;

    setOtpSheetOpen(false);
    update({ transferOtpSent: true, transferProcessing: true, transferCompleted: false });
    goTo(17);
  };

  return (
    <>
      <div className="flex flex-col gap-6 pb-44">
        <div className="h-[108px] w-full rounded-lg bg-[#f5f5f4]" />

        <div className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-[32px] leading-[38px] font-semibold tracking-[-0.02em] text-[#1c1917]">
              Transfer money
            </h2>
            <p className="text-sm leading-5 text-[#78716c]">
              We will transfer the loan amount to your selected bank account.
            </p>
          </div>

          <div className="flex items-center gap-3 py-1">
            <div className="h-1.5 w-[72px] rounded-full bg-[#e7e5e4]">
              <div className="h-1.5 w-full rounded-full bg-[#003323]" />
            </div>
            <p className="text-xs font-medium text-[#44403c]">Transfer money</p>
          </div>
        </div>

        <div className="rounded-lg bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between">
            <p className="text-base font-semibold text-[#1c1917]">Bank account</p>
            <button type="button" className="text-[#1c1917]" aria-label="Edit bank">
              <Pencil className="h-4 w-4" />
            </button>
          </div>

          <div className="my-4 h-px bg-[#e7e5e4]" />

          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e0f2fe] text-xs font-bold text-[#0369a1]">
              K
            </div>
            <div>
              <p className="text-sm font-semibold text-[#1c1917]">Kotak mahindra bank</p>
              <p className="text-xs text-[#78716c]">Savings account • xx3456</p>
            </div>
          </div>
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

          <Button type="button" onClick={() => setOtpSheetOpen(true)} className="h-10 flex-1 text-sm font-semibold">
            Transfer amount
          </Button>
        </div>
      </div>

      {otpSheetOpen && (
        <>
          <button
            type="button"
            onClick={() => setOtpSheetOpen(false)}
            className="fixed inset-0 z-[60] bg-black/85"
            aria-label="Close transfer OTP sheet"
          />

          <div className="fixed inset-0 z-[70] flex flex-col justify-end">
            <button
              type="button"
              onClick={() => setOtpSheetOpen(false)}
              className="mb-4 self-center rounded-full bg-[#78716c] p-2 text-white"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="w-full max-w-[390px] self-center overflow-hidden rounded-t-2xl bg-[#fafaf9]">
              <div className="border-b border-[#d6d3d1] bg-white px-6 py-4 text-center">
                <h3 className="text-[18px] leading-7 font-semibold text-[#1c1917]">Verify transfer OTP</h3>
                <p className="text-sm text-[#78716c]">
                  OTP sent to mobile number ending with {mobileLast4}
                </p>
              </div>

              <div className="space-y-6 bg-white px-6 py-6">
                <div className="flex justify-center">
                  <OTPInput length={6} value={otp} onChange={setOtp} />
                </div>

                <Button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={otp.length !== 6}
                  className="h-10 w-full text-sm font-semibold"
                >
                  Verify OTP
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

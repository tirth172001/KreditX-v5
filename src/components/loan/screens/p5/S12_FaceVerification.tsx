"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, ChevronLeft, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLoanStore } from "@/store/loanStore";
import { SelectedLendersRow } from "@/components/loan/shared/SelectedLendersRow";

type FaceStep = "intro" | "capture" | "verifying" | "success";

const SELFIE_PLACEHOLDER = "https://www.figma.com/api/mcp/asset/220016a6-cdf3-40aa-a758-8200951590cf";
const SELFIE_SAMPLE = "https://www.figma.com/api/mcp/asset/5ff5fbb0-7d94-4b10-bd41-869e90ad0f36";
const SUCCESS_ICON = "https://www.figma.com/api/mcp/asset/52008dc1-5b1d-4c2b-b46e-563828e5c39f";

export function S12_FaceVerification() {
  const { data, update, next, back } = useLoanStore();
  const [step, setStep] = useState<FaceStep>("intro");

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

  useEffect(() => {
    if (step !== "verifying") return;

    const timer = setTimeout(() => {
      update({ faceVerified: true });
      setStep("success");
    }, 2200);

    return () => clearTimeout(timer);
  }, [step, update]);

  if (step === "capture") {
    return (
      <>
        <div className="flex min-h-[calc(100dvh-210px)] flex-col items-center justify-center gap-2 pb-20">
          <img src={SELFIE_PLACEHOLDER} alt="Selfie guide" className="h-[312px] w-[312px] rounded-full" />

          <div className="rounded border border-[#e7e5e4] bg-[#fafaf9] px-3 py-2 text-xs text-[#1c1917]">
            Please ensure good lighting &amp; clear face
          </div>
        </div>

        <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-[390px] -translate-x-1/2 bg-[#fafaf9] px-4 py-4">
          <Button
            type="button"
            onClick={() => setStep("verifying")}
            className="h-10 w-full text-sm font-semibold"
          >
            Capture
          </Button>
        </div>
      </>
    );
  }

  if (step === "verifying") {
    return (
      <>
        <div className="flex min-h-[calc(100dvh-210px)] flex-col items-center justify-center gap-2 pb-20">
          <div className="relative h-[312px] w-[312px] overflow-hidden rounded-full">
            <img src={SELFIE_SAMPLE} alt="Captured selfie" className="h-full w-full object-cover" />
            <div className="absolute inset-x-0 top-1/2 h-px bg-[#10b981]" />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-white/55" />
          </div>

          <div className="rounded border border-[#e7e5e4] bg-[#fafaf9] px-3 py-2 text-xs text-[#1c1917]">
            Please ensure good lighting &amp; clear face
          </div>
        </div>

        <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-[390px] -translate-x-1/2 bg-[#fafaf9] px-4 py-4">
          <Button
            type="button"
            disabled
            className="h-10 w-full bg-[#7e9f95] text-sm font-semibold text-white opacity-100"
          >
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            Verifying details
          </Button>
        </div>
      </>
    );
  }

  if (step === "success") {
    return (
      <>
        <div className="flex min-h-[calc(100dvh-210px)] flex-col justify-center gap-6 pb-20">
          <div className="mx-auto w-full max-w-[328px] space-y-6 text-center">
            <div className="space-y-4">
              <img src={SUCCESS_ICON} alt="Verification success" className="mx-auto h-[82px] w-[104px]" />
              <div>
                <h2 className="text-[32px] leading-[38px] font-semibold tracking-[-0.02em] text-[#1c1917]">
                  Face verified successfully
                </h2>
                <p className="mt-2 text-sm leading-5 text-[#44403c]">
                  We will share the KYC details with lenders selected lenders to generate final offer
                </p>
              </div>
            </div>

            <SelectedLendersRow lenders={data.eligibleLenders} />
          </div>
        </div>

        <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-[390px] -translate-x-1/2 bg-[#fafaf9] px-4 py-4">
          <Button type="button" onClick={next} className="h-10 w-full text-sm font-semibold">
            Confirm &amp; share
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
              Complete KYC
            </h2>
            <p className="text-sm leading-5 text-[#78716c]">
              Please verify your Aadhaar details and face verification to generate final offer
            </p>
          </div>

          <div className="flex items-center gap-3 py-1">
            <div className="h-1.5 w-[72px] rounded-full bg-[#e7e5e4]">
              <div className="h-1.5 w-full rounded-full bg-[#003323]" />
            </div>
            <p className="text-xs font-medium text-[#44403c]">Face verification</p>
          </div>
        </div>

        <div className="space-y-1">
          {[
            "Find a good place and lighting",
            "Click a clear picture of the face",
            "Keep your facial expression natural",
          ].map((item) => (
            <div key={item} className="flex items-center gap-3 rounded-lg px-1 py-2">
              <CheckCircle2 className="h-5 w-5 text-[#10b981]" strokeWidth={2} />
              <p className="text-sm font-semibold text-[#1c1917]">{item}</p>
            </div>
          ))}
        </div>

        <SelectedLendersRow lenders={data.eligibleLenders} className="mt-auto" />
      </div>

      <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-[390px] -translate-x-1/2 bg-[#fafaf9] px-4 py-4">
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

          <Button
            type="button"
            onClick={() => setStep("capture")}
            className="h-10 flex-1 text-sm font-semibold"
          >
            Take selfie
          </Button>
        </div>
      </div>
    </>
  );
}

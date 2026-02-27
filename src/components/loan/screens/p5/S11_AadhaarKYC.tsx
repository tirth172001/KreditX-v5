"use client";

import { useEffect, useState } from "react";
import {
  BadgeCheck,
  ChevronLeft,
  Landmark,
  Shield,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useLoanStore } from "@/store/loanStore";
import { SelectedLendersRow } from "@/components/loan/shared/SelectedLendersRow";

type KYCStep = "eligible" | "aadhaar" | "digilocker";

const INDIA_EMBLEM = "https://www.figma.com/api/mcp/asset/f919c99f-2f8f-443d-a77f-16428700844e";
const AADHAAR_LOGO = "https://www.figma.com/api/mcp/asset/364cb512-017a-4025-a4b4-b26cf50d0358";

function formatAadhaar(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 12);
  return digits.replace(/(\d{4})(?=\d)/g, "$1-");
}

export function S11_AadhaarKYC() {
  const { data, update, next } = useLoanStore();
  const [step, setStep] = useState<KYCStep>("eligible");
  const [aadhaarNumber, setAadhaarNumber] = useState(
    formatAadhaar(data.aadhaarNumber || "323858574689")
  );
  const [error, setError] = useState("");

  useEffect(() => {
    const mode = step === "eligible" ? "close" : "none";
    window.dispatchEvent(new CustomEvent("loan:merchant-strip-mode", { detail: { mode } }));

    return () => {
      window.dispatchEvent(
        new CustomEvent("loan:merchant-strip-mode", { detail: { mode: "default" } })
      );
    };
  }, [step]);

  const goToAadhaar = () => setStep("aadhaar");

  const verifyAadhaar = () => {
    const digits = aadhaarNumber.replace(/\D/g, "");
    if (digits.length !== 12) {
      setError("Please enter a valid 12-digit Aadhaar number");
      return;
    }

    setError("");
    update({ aadhaarNumber: digits });
    setStep("digilocker");
  };

  const completeAadhaar = () => {
    update({ aadhaarVerified: true });
    next();
  };

  if (step === "eligible") {
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
              <p className="text-xs text-[#78716c]">
                Select your lenders and generate possible offers
              </p>
            </div>
          </div>

          <div className="rounded-lg bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <div className="flex items-start gap-3">
              <UserRound className="mt-0.5 h-5 w-5 text-[#1c1917]" strokeWidth={2} />
              <div>
                <p className="text-sm font-semibold text-[#1c1917]">Complete KYC</p>
                <p className="text-xs text-[#78716c]">
                  Provide Aadhaar and identity proof to get money
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={goToAadhaar}
              className="mt-3 text-sm font-medium text-[#003323]"
            >
              Start KYC
            </button>
          </div>

          {[
            "Select tenure",
            "Setup autopay",
            "Get money in your bank",
          ].map((label) => (
            <div key={label} className="flex items-start gap-3 rounded-lg p-3 opacity-50">
              <Landmark className="mt-0.5 h-5 w-5 text-[#78716c]" strokeWidth={2} />
              <div>
                <p className="text-sm font-semibold text-[#1c1917]">{label}</p>
                <p className="text-xs text-[#78716c]">
                  Select preferred terms &amp; setup autopay
                </p>
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

  if (step === "digilocker") {
    return (
      <div className="mx-[-16px] min-h-[calc(100dvh-136px)] bg-[#f3f4f6] px-4 pb-8 pt-4">
        <div className="mb-4 flex items-center justify-center gap-2 text-center">
          <p className="text-[20px] font-bold text-[#5b7ee0]">MeriPehchaan</p>
          <p className="text-[20px] font-bold text-[#d18b2e]">G20</p>
        </div>

        <div className="rounded-xl bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
          <h3 className="text-[34px] leading-[40px] font-semibold text-[#1c1917]">Setu</h3>

          <p className="mt-4 text-[15px] leading-6 text-[#525252]">
            You are about to link your DigiLocker account with Setu application of
            Brokentusk Technologies Pvt Ltd. You will be signed up for DigiLocker
            account if it does not exist.
          </p>

          <Input
            value="989589389295"
            readOnly
            className="mt-4 h-11 rounded-sm border-[#d6d3d1] bg-white text-[#1c1917]"
          />

          <p className="mt-4 text-[15px] text-[#525252]">
            Please enter the following text in the box below:
          </p>

          <div className="mt-2 flex gap-2">
            <div className="flex h-11 w-[45%] items-center justify-center rounded-sm border border-[#fecaca] bg-[#fff1f2] text-[#f87171] line-through">
              F8X3JL
            </div>
            <Input
              value="FYUF3U"
              readOnly
              className="h-11 flex-1 rounded-sm border-[#3b82f6] bg-[#eff6ff] text-center font-medium"
            />
          </div>

          <p className="mt-2 text-[13px] text-[#737373]">
            Unable to read the above image? <span className="text-[#4f46e5]">Try another!</span>
          </p>

          <Button
            type="button"
            onClick={completeAadhaar}
            className="mt-6 h-10 w-full rounded-sm bg-[#53a653] text-base hover:bg-[#469346]"
          >
            Next
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setStep("aadhaar")}
          className="mx-auto mt-3 block text-[26px] font-medium text-[#4f46e5]"
        >
          Return to Setu
        </button>
      </div>
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
              <div className="h-1.5 w-1/2 rounded-full bg-[#003323]" />
            </div>
            <p className="text-xs font-medium text-[#44403c]">Aadhaar verification</p>
          </div>
        </div>

        <div className="rounded-lg border border-[#f5f5f4] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
          <div className="flex items-center gap-2">
            <img src={INDIA_EMBLEM} alt="Government of India" className="h-9 w-auto opacity-90" />
            <div className="min-w-0 flex-1 opacity-90">
              <div className="h-2 w-full bg-gradient-to-r from-[#f8a628] to-[rgba(248,166,40,0)]" />
              <div className="h-2 w-full bg-white" />
              <div className="h-2 w-full bg-gradient-to-r from-[#259c4d] to-[rgba(37,156,77,0)]" />
            </div>
            <img src={AADHAAR_LOGO} alt="Aadhaar" className="h-9 w-auto opacity-90" />
          </div>

          <div className="mt-4 flex gap-4">
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

          <div className="mt-4 space-y-2">
            <Input
              value={aadhaarNumber}
              onChange={(event) => {
                setAadhaarNumber(formatAadhaar(event.target.value));
                if (error) setError("");
              }}
              inputMode="numeric"
              className={cn(
                "h-10 rounded-lg border-[#e7e5e4] bg-[#fafaf9] text-base text-[#1c1917]",
                error && "border-[#dc2626]"
              )}
            />

            {error && <p className="text-xs text-[#dc2626]">{error}</p>}
          </div>

          <div className="mt-4 border-t border-[#e7e5e4]" />
          <p className="mt-4 text-xs text-[#78716c]">OTP will be shared to Aadhaar registered number</p>
        </div>

        <SelectedLendersRow lenders={data.eligibleLenders} />
      </div>

      <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-[390px] -translate-x-1/2 bg-[#fafaf9] px-4 py-4">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="secondary"
            size="icon"
            onClick={() => setStep("eligible")}
            className="h-10 w-10 bg-[#e8fbff] text-[#0293a6] hover:bg-[#daf7fb]"
            aria-label="Back"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <Button type="button" onClick={verifyAadhaar} className="h-10 flex-1 text-sm font-semibold">
            Verify Aadhaar
          </Button>
        </div>
      </div>
    </>
  );
}

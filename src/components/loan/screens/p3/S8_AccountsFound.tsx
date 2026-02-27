"use client";

import { useRef, useState } from "react";
import { ChevronRight } from "lucide-react";
import { useLoanStore } from "@/store/loanStore";
import { Button } from "@/components/ui/button";

const BANK_LOGO_BY_ID: Record<string, string> = {
  canara: "https://www.figma.com/api/mcp/asset/03e890dd-9b37-44c0-9981-6fe1c9ae0c26",
  hdfc: "https://www.figma.com/api/mcp/asset/c8c3dde3-b3a7-4160-8405-ee7ffdd5c48f",
  icici: "https://www.figma.com/api/mcp/asset/f54acd72-2044-479d-9b02-3e158f5c81db",
};

const DEFAULT_BANK_LOGOS = [
  BANK_LOGO_BY_ID.canara,
  BANK_LOGO_BY_ID.hdfc,
  BANK_LOGO_BY_ID.icici,
];

const ONEMONEY_LOGO = "https://www.figma.com/api/mcp/asset/433b2e53-87c7-4467-b1ae-fcf273909a92";

export function S8_AccountsFound() {
  const { data, next } = useLoanStore();
  const [otp, setOtp] = useState("");
  const [retriesLeft, setRetriesLeft] = useState(3);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const mobileLast4 = (data.mobile || "").slice(-4) || "9747";
  const selectedBanks = data.selectedBanks.length > 0 ? data.selectedBanks : ["canara", "hdfc", "icici"];
  const selectedLogos = selectedBanks
    .map((id) => BANK_LOGO_BY_ID[id])
    .filter(Boolean)
    .slice(0, 3);
  const logosToShow = selectedLogos.length > 0 ? selectedLogos : DEFAULT_BANK_LOGOS;

  const digits = Array.from({ length: 6 }, (_, index) => otp[index] ?? "");

  const updateDigit = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const nextValue = digits.map((digit, digitIndex) => (digitIndex === index ? value : digit)).join("");
    setOtp(nextValue);
    if (value && index < 5) refs.current[index + 1]?.focus();
  };

  const handleVerify = () => {
    if (otp.length !== 6) return;
    next();
  };

  const handleResend = () => {
    if (retriesLeft > 0) {
      setOtp("");
      setRetriesLeft((value) => Math.max(0, value - 1));
      refs.current[0]?.focus();
    }
  };

  return (
    <>
      <div className="flex flex-col gap-6 pb-44">
        <div className="h-[108px] w-full rounded-lg bg-[#f5f5f4]" />

        <div className="space-y-2">
          <h2 className="text-[18px] leading-7 font-semibold text-[#1c1917]">Verify your number xx{mobileLast4}</h2>
          <p className="text-sm leading-5 text-[#78716c]">
            Please enter OTP that you have received on number ending with {mobileLast4} from Onemoney to discover linked bank accounts
          </p>
        </div>

        <div className="rounded-lg bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {logosToShow.map((logo, index) => (
                  <div
                    key={`${logo}-${index}`}
                    className="flex h-4 w-4 items-center justify-center overflow-hidden rounded-full border border-[#d6d3d1] bg-white"
                    style={{ marginLeft: index === 0 ? 0 : -3 }}
                  >
                    <img src={logo} alt="" className="h-3 w-3 object-contain" />
                  </div>
                ))}
              </div>

              <p className="text-xs text-[#1c1917]">{selectedBanks.length} banks selected</p>
            </div>

            <ChevronRight className="h-4 w-4 text-[#003323]" />
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-[#1c1917]">Enter OTP</p>

          <div className="flex w-full overflow-hidden rounded-lg border border-[#e5e5e5] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={(element) => {
                  refs.current[index] = element;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(event) => updateDigit(index, event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Backspace" && !digit && index > 0) {
                    refs.current[index - 1]?.focus();
                  }
                }}
                className="h-10 flex-1 border-r border-[#e5e5e5] bg-white text-center text-base text-[#1c1917] outline-none last:border-r-0"
              />
            ))}
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleResend}
              disabled={retriesLeft === 0}
              className="text-xs font-medium text-[#003323] disabled:text-[#78716c]/60"
            >
              Resend OTP
            </button>
            <p className="text-xs text-[#7a7a7a]">{retriesLeft} retries left</p>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-[390px] -translate-x-1/2 bg-[#fafaf9] px-4 py-4">
        <p className="text-center text-xs text-[#84878a]">
          By continuing, I agree to OneMoney <span className="text-[#2563eb]">TnC</span>
        </p>

        <Button
          type="button"
          onClick={handleVerify}
          disabled={otp.length !== 6}
          className="mt-3 h-10 w-full text-sm font-semibold"
        >
          Verify OTP
        </Button>

        <div className="mt-3 flex items-center justify-center gap-2 text-xs text-[#84878a]">
          <span>Powered by RBI regulated AA</span>
          <img src={ONEMONEY_LOGO} alt="Onemoney" className="h-5 w-[68px] object-contain" />
        </div>
      </div>
    </>
  );
}

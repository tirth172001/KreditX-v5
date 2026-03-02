"use client";

import { useEffect, useState } from "react";
import { useLoanStore, SCREENS } from "@/store/loanStore";
import { formatINR } from "@/lib/utils";

type MandateStep = "mandate" | "pin" | "success";

const NUMPAD = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["back", "0", "submit"],
];

// ─── Browser chrome simulation ────────────────────────────────────────────────

function BrowserChrome({ dark }: { dark?: boolean }) {
  return (
    <div
      className={`flex h-9 w-full items-center justify-center gap-1.5 px-4 ${
        dark ? "bg-[#2c2c2e]" : "bg-[#f2f2f7]"
      }`}
    >
      <svg width="8" height="10" viewBox="0 0 8 10" fill="none">
        <path
          d="M6 4V3a2 2 0 0 0-4 0v1M1 4h6a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5H1a.5.5 0 0 1-.5-.5v-4A.5.5 0 0 1 1 4z"
          stroke={dark ? "#8e8e93" : "#636366"}
          strokeWidth="1"
          strokeLinecap="round"
        />
      </svg>
      <span className={`text-[12px] ${dark ? "text-[#8e8e93]" : "text-[#636366]"}`}>
        gateway.plural.com
      </span>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function S16_SelectAutopay() {
  const { data, update, goTo } = useLoanStore();
  const setMerchantStripMode = useLoanStore((s) => s.setMerchantStripMode);

  const [step, setStep] = useState<MandateStep>("mandate");
  const [pin, setPin] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMerchantStripMode("none");
    return () => setMerchantStripMode(null);
  }, [setMerchantStripMode]);

  const emi = data.finalEMI || 4800;
  const upiApp = data.autopayApp || "bhim";
  const appLabel = upiApp === "bhim" ? "BHIM" : upiApp.charAt(0).toUpperCase() + upiApp.slice(1);

  const tenure = data.selectedTenure || 9;
  const endDate = new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" })
    .format(new Date(new Date().setMonth(new Date().getMonth() + tenure)));

  const handleNumpad = (key: string) => {
    if (key === "back") {
      setPin((p) => p.slice(0, -1));
    } else if (key === "submit") {
      if (pin.length !== 4) return;
      void handleSubmitPin();
    } else if (pin.length < 4) {
      setPin((p) => p + key);
    }
  };

  const handleSubmitPin = async () => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1400));
    setIsSubmitting(false);
    setStep("success");
  };

  // ─── State 1: BHIM mandate approval ────────────────────────────────────────

  if (step === "mandate") {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-[#1d1d1f]">
        {/* Browser chrome */}
        <BrowserChrome dark />

        {/* App header */}
        <div className="flex items-center justify-between px-5 py-3">
          <button type="button" className="text-[#8e8e93]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="#8e8e93" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <span className="text-[15px] font-semibold text-white">Mandates</span>
          <button type="button" className="text-[#8e8e93]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" stroke="#8e8e93" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3 3v5h5" stroke="#8e8e93" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Mandate card */}
        <div className="mx-4 mt-2 rounded-2xl bg-[#2c2c2e] p-4 space-y-4">
          <p className="text-xs text-[#8e8e93]">Block amount requested by</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#003323] text-sm font-bold text-white">
                K
              </div>
              <div>
                <p className="text-sm font-semibold text-white">KreditX</p>
                <p className="text-xs text-[#8e8e93]">Just now</p>
              </div>
            </div>
            <p className="text-lg font-semibold text-white">{formatINR(emi)}</p>
          </div>

          <div className="h-px bg-[#3a3a3c]" />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-[#8e8e93]">Frequency</p>
              <p className="mt-0.5 text-sm font-medium text-white">Monthly</p>
            </div>
            <div>
              <p className="text-xs text-[#8e8e93]">Valid until</p>
              <p className="mt-0.5 text-sm font-medium text-white">{endDate}</p>
            </div>
          </div>

          <div>
            <p className="text-xs text-[#8e8e93]">Order ID</p>
            <p className="mt-0.5 text-sm font-medium text-white">12837982349570249580028</p>
          </div>
        </div>

        {/* Approve button */}
        <div className="mx-4 mt-6">
          <button
            type="button"
            onClick={() => setStep("pin")}
            className="w-full h-14 rounded-full bg-[#fc5b00] text-base font-semibold text-white"
          >
            Approve
          </button>
        </div>
      </div>
    );
  }

  // ─── State 2: UPI PIN entry ─────────────────────────────────────────────────

  if (step === "pin") {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-white">
        {/* Browser chrome */}
        <BrowserChrome />

        {/* CANCEL */}
        <div className="px-4 pt-3 pb-1">
          <button
            type="button"
            onClick={() => setStep("mandate")}
            className="text-xs font-semibold tracking-wider text-[#636366]"
          >
            CANCEL
          </button>
        </div>

        {/* Bank info */}
        <div className="px-4 py-3 border-b border-[#e5e5ea]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[#1c1917]">
                {data.repaymentBankAccount || "Canara Bank"}
              </p>
              <p className="text-sm text-[#8e8e93]">XXXXXXX{data.repaymentBankMasked || "8234"}</p>
            </div>
            {/* UPI logo text */}
            <div className="flex items-center gap-0.5">
              <span className="text-[13px] font-bold text-[#2b2d7e]">UPI</span>
              <div className="flex gap-0.5">
                <div className="w-2.5 h-4 rounded-sm bg-[#ff8800]" />
                <div className="w-2.5 h-4 rounded-sm bg-[#1a9e2f]" />
              </div>
            </div>
          </div>
        </div>

        {/* To / Sending */}
        <div className="bg-[#f2f2f7] px-4 py-2 border-b border-[#e5e5ea] space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#636366]">To:</span>
            <span className="text-[#1c1917]">Your app...</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#636366]">Sending:</span>
            <div className="flex items-center gap-1">
              <span className="font-medium text-[#1c1917]">{formatINR(emi)}</span>
              <span className="text-[#636366]">▾</span>
            </div>
          </div>
        </div>

        {/* PIN label + dots */}
        <div className="flex flex-col items-center gap-4 py-6">
          <p className="text-[13px] font-semibold tracking-widest text-[#636366]">ENTER 4-DIGIT UPI PIN</p>
          <div className="flex gap-4">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-5 w-5 rounded-full border-2 transition-colors ${
                  i < pin.length
                    ? "border-[#1c1917] bg-[#1c1917]"
                    : "border-[#d1d1d6] bg-transparent"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Warning notice */}
        <div className="mx-4 mb-3 rounded-lg bg-[#fef3c7] px-3 py-2 flex items-start gap-2">
          <span className="text-[#d97706] text-sm mt-0.5">⚠</span>
          <p className="text-xs text-[#92400e]">
            You are reserving {formatINR(emi)} from your account. This amount will get debited upon delivery.
          </p>
        </div>

        {/* Number pad */}
        <div className="mt-auto border-t border-[#e5e5ea]">
          {NUMPAD.map((row, rIdx) => (
            <div key={rIdx} className="flex">
              {row.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleNumpad(key)}
                  disabled={key === "submit" && (pin.length !== 4 || isSubmitting)}
                  className={`flex-1 border-r border-b border-[#e5e5ea] py-4 text-center transition-colors last:border-r-0 ${
                    key === "submit"
                      ? "text-[13px] font-bold tracking-wider text-[#007aff] disabled:text-[#c7c7cc]"
                      : key === "back"
                      ? "text-xl text-[#1c1917]"
                      : "text-[22px] font-light text-[#1c1917]"
                  } active:bg-[#f2f2f7]`}
                >
                  {key === "back" ? "⌫" : key === "submit" ? (isSubmitting ? "..." : "SUBMIT") : key}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ─── State 3: BHIM mandate success ─────────────────────────────────────────

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#1d1d1f]">
      {/* Browser chrome */}
      <BrowserChrome dark />

      {/* BHIM green header */}
      <div className="bg-gradient-to-b from-[#008b40] to-[#006b32] px-5 pt-5 pb-8 text-center space-y-3">
        <p className="text-xs font-medium tracking-wide text-white/80">BHIM – Bharat&apos;s Own Payments App</p>
        <div className="flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-lg">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17l-5-5" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-white/80">Mandate created</p>
          <div className="mt-1 mx-auto inline-block rounded bg-[#005a2b] px-4 py-1.5">
            <p className="text-2xl font-bold tracking-wide text-white">{formatINR(emi)}</p>
          </div>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#005a2b] px-3 py-1">
          <span className="text-[#fbbf24]">⚡</span>
          <span className="text-xs font-medium text-white">Done in 1.8 seconds</span>
        </div>
      </div>

      {/* Details card */}
      <div className="mx-4 -mt-4 rounded-2xl bg-[#2c2c2e] p-4 space-y-3">
        <div>
          <p className="text-xs text-[#8e8e93]">Banking Name</p>
          <p className="mt-0.5 text-sm font-semibold text-white uppercase">
            {`${data.firstName || "TIRTH"} ${data.lastName || "TRIVEDI"}`}
          </p>
        </div>
        <div className="h-px bg-[#3a3a3c]" />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-[#8e8e93]">Transaction ID</p>
            <div className="flex items-center gap-1 mt-0.5">
              <p className="text-sm font-medium text-white">215000453888</p>
              <button type="button" className="text-[#8e8e93]">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <rect x="9" y="9" width="13" height="13" rx="2" stroke="#8e8e93" strokeWidth="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="#8e8e93" strokeWidth="2" />
                </svg>
              </button>
            </div>
          </div>
          <div>
            <p className="text-xs text-[#8e8e93]">Date &amp; Time</p>
            <p className="mt-0.5 text-sm font-medium text-white">
              {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "2-digit" })}, {new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
        </div>
        <div className="h-px bg-[#3a3a3c]" />
        <div className="flex gap-2">
          <button
            type="button"
            className="flex-1 rounded-full border border-[#3a3a3c] py-2 text-sm font-medium text-white"
          >
            More details ↓
          </button>
          <button
            type="button"
            className="flex-1 rounded-full border border-[#3a3a3c] py-2 text-sm font-medium text-white"
          >
            Share ↗
          </button>
        </div>
      </div>

      {/* Continue */}
      <div className="mt-auto px-4 pb-6">
        <button
          type="button"
          onClick={() => {
            update({ mandateSetup: true });
            goTo(SCREENS.TRANSFER_AMOUNT);
          }}
          className="w-full h-12 rounded-xl bg-[#2c2c2e] text-base font-semibold text-white"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

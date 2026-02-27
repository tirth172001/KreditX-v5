"use client";

import { useEffect, useState } from "react";
import { useLoanStore } from "@/store/loanStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, ChevronLeft, Shield, X } from "lucide-react";

export function S4_LenderSelection() {
  const { data, update, goTo, back } = useLoanStore();
  const [excludedSheetOpen, setExcludedSheetOpen] = useState(false);
  const [bankStatementSheetOpen, setBankStatementSheetOpen] = useState(false);

  const eligible = data.eligibleLenders.filter((l) => l.isEligible);
  const ineligible = data.eligibleLenders.filter((l) => !l.isEligible);
  const selectedCount = eligible.filter((l) => l.isSelected).length;

  useEffect(() => {
    const openExcludedSheet = () => setExcludedSheetOpen(true);
    window.addEventListener("loan:open-excluded-lenders", openExcludedSheet);
    return () => window.removeEventListener("loan:open-excluded-lenders", openExcludedSheet);
  }, []);

  const toggleLender = (id: string) => {
    update({
      eligibleLenders: data.eligibleLenders.map((l) =>
        l.id === id ? { ...l, isSelected: !l.isSelected } : l
      ),
    });
  };

  const startBankStatementFlow = () => {
    setBankStatementSheetOpen(false);
    goTo(6);
  };

  return (
    <>
      <div className="flex flex-col gap-6 pb-44">
        <div className="h-[108px] w-full rounded-lg bg-[#f5f5f4]" />

        <div className="space-y-1">
          <h2 className="text-[18px] leading-7 font-semibold text-[#1c1917]">
            Eligible for {eligible.length} lender{eligible.length === 1 ? "" : "s"}
          </h2>
          <p className="text-sm leading-5 text-[#78716c]">
            You are eligible for loans from below lenders, select from whom do you want to get an offer
          </p>
        </div>

        <div className="space-y-2">
          {eligible.map((lender) => (
            <button
              key={lender.id}
              type="button"
              onClick={() => toggleLender(lender.id)}
              className="flex w-full items-center gap-2 rounded-lg bg-white p-3 text-left shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
            >
              <div
                className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white"
                style={{ backgroundColor: lender.color }}
              >
                {lender.logoInitial}
              </div>
              <p className="flex-1 text-sm text-[#1c1917]">{lender.name}</p>

              <span
                className={cn(
                  "flex h-4 w-4 items-center justify-center rounded border",
                  lender.isSelected
                    ? "border-[#003323] bg-[#003323]"
                    : "border-[#e7e5e4] bg-[#fafaf9]"
                )}
              >
                {lender.isSelected && <Check className="h-3 w-3 text-white" strokeWidth={2.5} />}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-[390px] -translate-x-1/2 border-t border-[#e7e5e4] bg-[#fafaf9] px-4 py-4">
        <p className="text-xs leading-4 text-[#78716c]">
          By continuing, I am providing consent to share my details with all of the selected lenders to generate an offer
        </p>

        <div className="mt-3 flex items-center gap-3">
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="h-10 w-10 bg-[#e8fbff] text-[#0293a6] hover:bg-[#daf7fb]"
            onClick={back}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <Button
            type="button"
            onClick={() => setBankStatementSheetOpen(true)}
            disabled={selectedCount === 0}
            className="h-10 flex-1 text-sm font-semibold"
          >
            Confirm &amp; generate
          </Button>
        </div>
      </div>

      {excludedSheetOpen && (
        <>
          <button
            type="button"
            onClick={() => setExcludedSheetOpen(false)}
            className="fixed inset-0 z-40 bg-black/40"
            aria-label="Close excluded lenders sheet"
          />

          <div className="fixed bottom-0 left-1/2 z-50 w-full max-w-[390px] -translate-x-1/2 rounded-t-2xl bg-white p-4 shadow-2xl">
            <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-muted" />
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#1c1917]">
                {ineligible.length} lender{ineligible.length === 1 ? "" : "s"} excluded
              </h3>
              <button
                type="button"
                onClick={() => setExcludedSheetOpen(false)}
                className="rounded-md p-1 text-muted-foreground"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2">
              {ineligible.map((lender) => (
                <div
                  key={lender.id}
                  className="flex items-start gap-3 rounded-lg border border-[#e7e5e4] bg-[#fafaf9] p-3"
                >
                  <div
                    className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white"
                    style={{ backgroundColor: lender.color }}
                  >
                    {lender.logoInitial}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[#1c1917]">{lender.name}</p>
                    <p className="text-xs leading-4 text-[#78716c]">
                      {lender.ineligibleReason || "This lender is currently unavailable for your profile."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {bankStatementSheetOpen && (
        <>
          <button
            type="button"
            onClick={() => setBankStatementSheetOpen(false)}
            className="fixed inset-0 z-[60] bg-black/75"
            aria-label="Close bank statement sheet"
          />

          <div className="fixed inset-0 z-[70] flex flex-col justify-end">
            <button
              type="button"
              onClick={() => setBankStatementSheetOpen(false)}
              className="mb-4 self-center rounded-full bg-white/30 p-2 text-white"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="w-full max-w-[390px] self-center rounded-t-2xl bg-[#fafaf9] p-4">
              <div className="mb-4 h-[132px] w-full overflow-hidden rounded-lg bg-[#f5f5f4] p-6">
                <div className="mx-auto h-full w-[140px] rounded bg-white p-2 shadow-sm">
                  <p className="text-[10px] text-[#1c1917]">Bank statement</p>
                  <div className="mt-2 space-y-1">
                    <div className="h-1.5 w-14 rounded bg-[#003323]/35" />
                    <div className="h-1.5 w-24 rounded bg-[#003323]/25" />
                    <div className="h-1.5 w-10 rounded bg-[#003323]/25" />
                  </div>
                  <div className="mt-3 h-1.5 w-12 rounded bg-[#003323]/60" />
                  <div className="mt-2 grid grid-cols-4 gap-1">
                    <div className="h-3 rounded border border-[#003323]/20" />
                    <div className="h-3 rounded border border-[#003323]/20" />
                    <div className="h-3 rounded border border-[#003323]/20" />
                    <div className="h-3 rounded border border-[#003323]/20" />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-[18px] leading-7 font-semibold text-[#1c1917]">Share your bank statement</h3>
                <p className="text-sm leading-5 text-[#78716c]">
                  Lender requires your bank statement to generate a loan offer, please share your bank statement
                </p>
              </div>

              <Button
                type="button"
                onClick={startBankStatementFlow}
                className="mt-6 h-10 w-full text-sm font-semibold"
              >
                Share bank statement
              </Button>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[#78716c]">
                <Shield className="h-4 w-4" strokeWidth={1.75} />
                <span>100% secure as per RBI</span>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

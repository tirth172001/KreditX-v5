"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { calcEMI, formatINR } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useLoanStore, type LenderOffer } from "@/store/loanStore";

const ADITYA_BIRLA_LOGO = "https://www.figma.com/api/mcp/asset/81a8e5c9-c68e-4b7a-a2da-0638834830e1";
const AXIS_LOGO_A = "https://www.figma.com/api/mcp/asset/0cb060d0-abcc-4bc1-9740-98205352ab0b";
const AXIS_LOGO_B = "https://www.figma.com/api/mcp/asset/f2db69f8-e61d-44e5-93ac-4f4b2ee871d9";

const MIN_LOAN_AMOUNT = 5000;
const MAX_LOAN_AMOUNT = 500000;
const LOAN_STEP = 5000;
const TENURE_OPTIONS = [3, 6, 12];

type SheetStep = "amount" | "tenure";

function sortByPriority(lenders: LenderOffer[]) {
  const priority = ["ab", "axis", "hdfc", "icici", "kotak"];
  return [...lenders].sort((a, b) => priority.indexOf(a.id) - priority.indexOf(b.id));
}

function lenderDisplayAmount(lenderId: string) {
  if (lenderId === "ab") return 400000;
  if (lenderId === "axis") return 300000;
  return 250000;
}

function lenderSubtitle(lender: LenderOffer) {
  if (lender.id === "ab") return "Aditya birla capital";
  if (lender.id === "axis") return "Axis bank";
  return lender.name;
}

function LenderIcon({ lender }: { lender: LenderOffer }) {
  if (lender.id === "ab") {
    return <img src={ADITYA_BIRLA_LOGO} alt="" className="h-[18px] w-[29px] object-contain" />;
  }

  if (lender.id === "axis") {
    return (
      <div className="relative h-8 w-8">
        <img src={AXIS_LOGO_A} alt="" className="absolute inset-0 h-8 w-8 object-contain" />
        <img src={AXIS_LOGO_B} alt="" className="absolute inset-0 h-8 w-8 object-contain" />
      </div>
    );
  }

  return (
    <div
      className="flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold text-white"
      style={{ backgroundColor: lender.color }}
    >
      {lender.logoInitial}
    </div>
  );
}

export function S14_ConfirmOffer() {
  const { data, update, next } = useLoanStore();
  const [activeLenderId, setActiveLenderId] = useState<string | null>(null);
  const [sheetStep, setSheetStep] = useState<SheetStep>("amount");
  const [selectedLoanAmount, setSelectedLoanAmount] = useState(50000);
  const [selectedTenure, setSelectedTenure] = useState<number>(TENURE_OPTIONS[0]);

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

  const lenders = useMemo(() => {
    const selectedEligible = sortByPriority(
      data.eligibleLenders.filter((lender) => lender.isEligible && lender.isSelected)
    ).slice(0, 2);

    if (selectedEligible.length > 0) return selectedEligible;

    return sortByPriority(data.eligibleLenders.filter((lender) => lender.isEligible)).slice(0, 2);
  }, [data.eligibleLenders]);

  const activeLender = lenders.find((lender) => lender.id === activeLenderId) ?? null;

  const openAmountSheet = (lender: LenderOffer) => {
    setActiveLenderId(lender.id);
    setSheetStep("amount");
    setSelectedTenure(TENURE_OPTIONS[0]);
    setSelectedLoanAmount(50000);
  };

  const closeSheet = () => {
    setActiveLenderId(null);
    setSheetStep("amount");
  };

  const openTenureSheet = () => {
    if (!activeLender) return;
    setSheetStep("tenure");
  };

  const setupAutopay = () => {
    if (!activeLender) return;

    const emi = calcEMI(selectedLoanAmount, selectedTenure, activeLender.minRate);

    update({
      selectedOfferId: activeLender.id,
      selectedTenure,
      finalLoanAmount: selectedLoanAmount,
      finalEMI: emi,
    });

    closeSheet();
    next();
  };

  const tenureBreakdown = useMemo(() => {
    if (!activeLender) return [];

    return TENURE_OPTIONS.map((months) => {
      const emi = calcEMI(selectedLoanAmount, months, activeLender.minRate);
      const interestCharged = Math.max(0, emi * months - selectedLoanAmount);
      const totalPayable = emi * months + activeLender.processingFee;

      return {
        months,
        emi,
        interestCharged,
        totalPayable,
      };
    });
  }, [activeLender, selectedLoanAmount]);

  return (
    <>
      <div className="flex flex-col gap-6 pb-8">
        <div className="h-[108px] w-full rounded-lg bg-[#f5f5f4]" />

        <div className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-[32px] leading-[38px] font-semibold tracking-[-0.02em] text-[#1c1917]">
              Select preferred terms
            </h2>
            <p className="text-sm leading-5 text-[#78716c]">
              Select your preferred lender and tenure to move forward
            </p>
          </div>

          <div className="flex items-center gap-3 py-1">
            <div className="h-1.5 w-[72px] rounded-full bg-[#e7e5e4]">
              <div className="h-1.5 w-1/2 rounded-full bg-[#003323]" />
            </div>
            <p className="text-xs font-medium text-[#44403c]">Select tenure</p>
          </div>
        </div>

        <div className="space-y-2">
          {lenders.map((lender) => (
            <button
              key={lender.id}
              type="button"
              onClick={() => openAmountSheet(lender)}
              className="w-full rounded-lg bg-white p-3 text-left shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
            >
              <div className="flex items-start gap-2">
                <div className="flex min-w-0 flex-1 items-start gap-3">
                  <LenderIcon lender={lender} />

                  <div className="min-w-0">
                    <p className="text-sm font-semibold leading-5 text-[#1c1917]">
                      {lender.id === "ab"
                        ? formatINR(lenderDisplayAmount(lender.id))
                        : `Upto ${formatINR(lenderDisplayAmount(lender.id))}`}
                    </p>
                    <p className="text-xs leading-4 text-[#78716c]">by {lenderSubtitle(lender)}</p>
                  </div>
                </div>

                <ChevronRight className="h-4 w-4 text-[#003323]" />
              </div>

              <div className="mt-4 flex items-start justify-between">
                <div>
                  <p className="text-xs leading-4 text-[#78716c]">Interest rates</p>
                  <p className="text-sm leading-5 font-medium text-[#1c1917]">
                    {lender.minRate}
                    {lender.maxRate > lender.minRate ? `-${lender.maxRate}` : ""}%
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs leading-4 text-[#78716c]">Tenure</p>
                  <p className="text-sm leading-5 font-medium text-[#1c1917]">6 - 24 Months</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {activeLender && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <button
            type="button"
            onClick={closeSheet}
            className="absolute inset-0 bg-black/85"
            aria-label="Dismiss"
          />

          <button
            type="button"
            onClick={closeSheet}
            className="z-10 mb-4 self-center rounded-full bg-[#78716c] p-2 text-white"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="relative z-10 w-full max-w-[390px] self-center rounded-t-2xl bg-white px-6 pb-6 pt-6">
            <div className="max-h-[72dvh] space-y-6 overflow-y-auto pr-0.5">
              <div className="space-y-2 text-center">
                <div className="mx-auto w-fit">
                  <LenderIcon lender={activeLender} />
                </div>

                <p className="text-[22px] leading-[30px] font-semibold text-[#1c1917]">{lenderSubtitle(activeLender)}</p>

                {sheetStep === "amount" ? (
                  <p className="text-xs text-[#78716c]">Interest rate: {activeLender.minRate}%</p>
                ) : (
                  <div className="flex items-center justify-center gap-3 text-xs text-[#78716c]">
                    <span>Loan amount: {formatINR(selectedLoanAmount)}</span>
                    <span className="h-3 w-px bg-[#d6d3d1]" />
                    <span>Interest rate: {activeLender.minRate}%</span>
                  </div>
                )}
              </div>

              {sheetStep === "amount" ? (
                <div className="space-y-6">
                  <div className="rounded-lg bg-[#f5f5f4] p-3">
                    <div className="text-center">
                      <p className="text-xs text-[#78716c]">Choose loan amount</p>
                      <p className="mt-1 text-[32px] leading-[38px] font-medium text-[#1c1917]">
                        {formatINR(selectedLoanAmount)}
                      </p>
                    </div>

                    <div className="mt-4 space-y-2">
                      <Slider
                        min={MIN_LOAN_AMOUNT}
                        max={MAX_LOAN_AMOUNT}
                        step={LOAN_STEP}
                        value={[selectedLoanAmount]}
                        onValueChange={(value) => setSelectedLoanAmount(value[0] ?? MIN_LOAN_AMOUNT)}
                      />

                      <div className="flex items-center justify-between text-xs text-[#78716c]">
                        <p>Min: ₹ 5000</p>
                        <p>Max: ₹ 5,00,000</p>
                      </div>
                    </div>
                  </div>

                  <Button type="button" onClick={openTenureSheet} className="h-10 w-full text-sm font-semibold">
                    Select tenure
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="rounded-lg bg-[#f5f5f4] p-3">
                    <div className="space-y-3">
                      {tenureBreakdown.map((option) => {
                        const checked = selectedTenure === option.months;

                        return (
                          <div key={option.months}>
                            <button
                              type="button"
                              onClick={() => setSelectedTenure(option.months)}
                              className="flex w-full items-center gap-3 text-left"
                            >
                              <span
                                className={cn(
                                  "flex h-4 w-4 items-center justify-center rounded-full border border-[#d6d3d1]",
                                  checked && "border-[#003323]"
                                )}
                              >
                                {checked && <span className="h-2 w-2 rounded-full bg-[#003323]" />}
                              </span>

                              <p className="text-sm font-medium text-[#1c1917]">
                                {formatINR(option.emi)} x {option.months} months
                              </p>
                            </button>

                            {checked && (
                              <div className="mt-3 rounded-lg bg-white p-3">
                                <div className="space-y-3 text-xs">
                                  <div className="flex items-center justify-between">
                                    <p className="text-[#78716c]">EMI per month</p>
                                    <p className="font-medium text-[#1c1917]">{formatINR(option.emi)}</p>
                                  </div>

                                  <div className="flex items-center justify-between">
                                    <p className="text-[#78716c]">Processing fee</p>
                                    <p className="font-medium text-[#1c1917]">{formatINR(activeLender.processingFee)}</p>
                                  </div>

                                  <div className="flex items-center justify-between">
                                    <p className="text-[#78716c]">Interest charged</p>
                                    <p className="font-medium text-[#1c1917]">{formatINR(option.interestCharged)}</p>
                                  </div>

                                  <div className="flex items-center justify-between">
                                    <p className="text-[#78716c]">Total payable</p>
                                    <p className="font-medium text-[#1c1917]">{formatINR(option.totalPayable)}</p>
                                  </div>

                                  <button type="button" className="text-sm font-medium text-[#0293a6]">
                                    View full EMI plan
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <Button type="button" onClick={setupAutopay} className="h-10 w-full text-sm font-semibold">
                    Setup autopay
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

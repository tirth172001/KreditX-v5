"use client";

import { useMemo, useState } from "react";
import { Check, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLoanStore } from "@/store/loanStore";

type OfferCard = {
  lenderId: string;
  amount: number;
  minRate: number;
  maxRate: number;
  tenure: string;
  lenderName: string;
  lenderSubtitle: string;
  logoType: "ab" | "axis" | "fallback";
  logoInitial: string;
};

const ADITYA_BIRLA_LOGO = "https://www.figma.com/api/mcp/asset/abd94726-931c-4054-b926-f4edfe6bc717";
const AXIS_LOGO_A = "https://www.figma.com/api/mcp/asset/a38588b1-b0bf-4d5b-be88-df0d9ebdb90b";
const AXIS_LOGO_B = "https://www.figma.com/api/mcp/asset/18406f18-60ae-4db5-8603-362208a047fc";

const OFFER_PRIORITY = ["ab", "axis", "hdfc", "icici", "kotak"];

function formatShortINR(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

function OfferLogo({ card }: { card: OfferCard }) {
  if (card.logoType === "ab") {
    return <img src={ADITYA_BIRLA_LOGO} alt="" className="h-8 w-8 object-contain" />;
  }

  if (card.logoType === "axis") {
    return (
      <div className="relative h-8 w-8">
        <img src={AXIS_LOGO_A} alt="" className="absolute inset-0 h-8 w-8 object-contain" />
        <img src={AXIS_LOGO_B} alt="" className="absolute inset-0 h-8 w-8 object-contain" />
      </div>
    );
  }

  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#003323] text-[11px] font-bold text-white">
      {card.logoInitial}
    </div>
  );
}

export function S10_IndicativeOffers() {
  const { data, update, next, back } = useLoanStore();

  const tentativeOffers = useMemo<OfferCard[]>(() => {
    const selectedEligible = data.eligibleLenders
      .filter((lender) => lender.isEligible && lender.isSelected)
      .sort((a, b) => OFFER_PRIORITY.indexOf(a.id) - OFFER_PRIORITY.indexOf(b.id));

    const basis = (selectedEligible.length > 0 ? selectedEligible : data.eligibleLenders.filter((l) => l.isEligible)).slice(0, 2);

    return basis.map((lender, index) => ({
      lenderId: lender.id,
      amount: index === 0 ? 400000 : 300000,
      minRate: lender.minRate,
      maxRate: lender.maxRate,
      tenure: "6 - 24 Months",
      lenderName: lender.name,
      lenderSubtitle:
        lender.id === "ab"
          ? "Aditya birla capital"
          : lender.id === "axis"
            ? "Axis bank"
            : lender.name,
      logoType: lender.id === "ab" ? "ab" : lender.id === "axis" ? "axis" : "fallback",
      logoInitial: lender.logoInitial,
    }));
  }, [data.eligibleLenders]);

  const [selectedOfferIds, setSelectedOfferIds] = useState<string[]>(
    tentativeOffers.map((offer) => offer.lenderId)
  );

  const toggleOffer = (id: string) => {
    setSelectedOfferIds((previous) =>
      previous.includes(id)
        ? previous.filter((offerId) => offerId !== id)
        : [...previous, id]
    );
  };

  const handleConfirm = () => {
    const selectedSet = new Set(selectedOfferIds);

    update({
      eligibleLenders: data.eligibleLenders.map((lender) =>
        lender.isEligible
          ? { ...lender, isSelected: selectedSet.has(lender.id) }
          : lender
      ),
    });

    next();
  };

  return (
    <>
      <div className="flex flex-col gap-6 pb-44">
        <div className="h-[108px] w-full rounded-lg bg-[#f5f5f4]" />

        <div className="space-y-1">
          <h2 className="text-[18px] leading-7 font-semibold text-[#1c1917]">
            {tentativeOffers.length} Tentative offers generated
          </h2>
          <p className="text-sm leading-5 text-[#78716c]">
            You are eligible for loans from below lenders, select from whom do you want to get an offer
          </p>
        </div>

        <div className="space-y-2">
          {tentativeOffers.map((offer) => {
            const checked = selectedOfferIds.includes(offer.lenderId);
            return (
              <div
                key={offer.lenderId}
                className="rounded-lg bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
              >
                <div className="relative flex items-start gap-2">
                  <div className="flex min-w-0 flex-1 items-start gap-3">
                    <OfferLogo card={offer} />

                    <div className="min-w-0">
                      <p className="text-sm leading-5 font-semibold text-[#1c1917]">
                        Upto {formatShortINR(offer.amount)}
                      </p>
                      <p className="text-xs leading-4 text-[#78716c]">by {offer.lenderSubtitle}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleOffer(offer.lenderId)}
                    className={cn(
                      "absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded border",
                      checked ? "border-[#003323] bg-[#003323]" : "border-[#e7e5e4] bg-[#fafaf9]"
                    )}
                    aria-label={`Toggle ${offer.lenderName}`}
                  >
                    {checked && <Check className="h-3 w-3 text-white" strokeWidth={2.5} />}
                  </button>
                </div>

                <div className="mt-4 flex items-start justify-between">
                  <div>
                    <p className="text-xs leading-4 text-[#78716c]">Interest rates</p>
                    <p className="text-sm leading-5 font-medium text-[#1c1917]">
                      {offer.minRate}-{offer.maxRate}%
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs leading-4 text-[#78716c]">Tenure</p>
                    <p className="text-sm leading-5 font-medium text-[#1c1917]">{offer.tenure}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-[390px] -translate-x-1/2 border-t border-[#d6d3d1] bg-white px-4 py-4">
        <p className="text-xs leading-4 text-[#78716c]">
          By continuing, I am providing consent to share my KYC details with selected lenders to generate loan offer
        </p>

        <div className="mt-3 flex items-center gap-3">
          <Button
            type="button"
            variant="secondary"
            size="icon"
            onClick={back}
            className="h-10 w-10 bg-[#d6d9d9] text-[#44403c] hover:bg-[#c8cdcd]"
            aria-label="Back"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <Button
            type="button"
            onClick={handleConfirm}
            disabled={selectedOfferIds.length === 0}
            className="h-10 flex-1 text-sm font-semibold"
          >
            Confirm &amp; Share KYC
          </Button>
        </div>
      </div>
    </>
  );
}

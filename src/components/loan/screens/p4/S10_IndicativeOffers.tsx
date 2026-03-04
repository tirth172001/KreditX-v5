"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { formatINR } from "@/lib/utils";
import { useLoanStore, SCREENS } from "@/store/loanStore";
import { StepProgressBar } from "@/components/loan/shared/StepProgressBar";
import { screenContainer, screenItem, listContainer, listItem } from "@/components/loan/shared/motion";

export function S10_IndicativeOffers() {
  const { data, update, goTo } = useLoanStore();

  const offers = data.finalOffers;

  const handleSelectOffer = (offerId: string) => {
    update({ selectedOfferId: offerId });
    goTo(SCREENS.LENDER_DETAIL);
  };

  return (
    <>
      <motion.div
        className="flex flex-col gap-6 pb-44"
        variants={screenContainer}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={screenItem} className="flex justify-center">
          <StepProgressBar currentStep={4} />
        </motion.div>

        <motion.div variants={screenItem} className="h-[108px] w-full rounded-lg overflow-hidden">
          <img src="/illustrations/eligible_lenders.svg" alt="" className="h-full w-full object-cover" />
        </motion.div>

        <motion.div variants={screenItem} className="space-y-1">
          <h2 className="text-[18px] leading-7 font-semibold text-[#1c1917]">Your loan offers</h2>
          <p className="text-sm leading-5 text-[#78716c]">
            Here are personalised offers based on your profile. Tap one to review and customise.
          </p>
        </motion.div>

        <motion.div variants={listContainer} className="space-y-2">
          {offers.map((offer) => (
            <motion.button
              key={offer.id}
              variants={listItem}
              type="button"
              onClick={() => handleSelectOffer(offer.id)}
              className="w-full rounded-xl bg-white p-4 text-left shadow-[0_1px_3px_rgba(0,0,0,0.1)]"
              whileTap={{ scale: 0.985 }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                  style={{ backgroundColor: offer.color }}
                >
                  {offer.logoInitial}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#1c1917]">{offer.name}</p>
                  <p className="text-xs text-[#78716c]">Upto {formatINR(offer.maxAmount)}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-[#003323]" />
              </div>

              <div className="mt-3 flex items-start justify-between">
                <div>
                  <p className="text-xs text-[#78716c]">Interest rate</p>
                  <p className="text-sm font-medium text-[#1c1917]">
                    {offer.rate}{offer.maxRate && offer.maxRate > offer.rate ? `–${offer.maxRate}` : ""}% p.a.
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[#78716c]">Tenure</p>
                  <p className="text-sm font-medium text-[#1c1917]">3–24 months</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[#78716c]">Processing fee</p>
                  <p className="text-sm font-medium text-[#1c1917]">₹{offer.processingFee.toLocaleString("en-IN")}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </motion.div>

    </>
  );
}

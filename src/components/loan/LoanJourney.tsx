"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "sonner";
import { useLoanStore } from "@/store/loanStore";
import { MerchantStrip } from "./MerchantStrip";

// Phase 1
import { S1_ConfirmDetails } from "./screens/p1/S1_ConfirmDetails";
import { S2_EligibilityLoader } from "./screens/p1/S2_EligibilityLoader";
import { S3_EligibilityResult } from "./screens/p1/S3_EligibilityResult";
// Phase 3 — AA bank statement flow
import { S5_AAIntro } from "./screens/p3/S5_AAIntro";
import { S6_BankSelection } from "./screens/p3/S6_BankSelection";
import { S7_AAOTP } from "./screens/p3/S7_AAOTP";
import { S8_AccountsFound } from "./screens/p3/S8_AccountsFound";
import { S9_PerBankOTP } from "./screens/p3/S9_PerBankOTP";
// Phase 4 — KYC
import { S11_AadhaarKYC } from "./screens/p5/S11_AadhaarKYC";
import { S12_FaceVerification } from "./screens/p5/S12_FaceVerification";
// Phase 5 — Offers
import { S10_IndicativeOffers } from "./screens/p4/S10_IndicativeOffers";
import { S14_ConfirmOffer } from "./screens/p6/S14_ConfirmOffer";
// Phase 6 — Repayment & transfer
import { S15_MandateSummary } from "./screens/p7/S15_MandateSummary";
import { S16_SelectAutopay } from "./screens/p7/S16_SelectAutopay";
import { S20_Success } from "./screens/p9/S20_Success";

const SCREENS: Record<number, React.ReactNode> = {
  1: <S1_ConfirmDetails />,
  2: <S2_EligibilityLoader />,
  3: <S3_EligibilityResult />,
  5: <S5_AAIntro />,
  6: <S6_BankSelection />,
  7: <S7_AAOTP />,
  8: <S8_AccountsFound />,
  9: <S9_PerBankOTP />,
  10: <S10_IndicativeOffers />,
  11: <S11_AadhaarKYC />,
  12: <S12_FaceVerification />,
  14: <S14_ConfirmOffer />,
  15: <S15_MandateSummary />,
  16: <S16_SelectAutopay />,
  20: <S20_Success />,
};

export function LoanJourney() {
  const { currentScreen, reset } = useLoanStore();

  return (
    <>
    <div className="min-h-dvh flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white border-b border-[#e7e5e4]">
        <div className="max-w-[390px] mx-auto relative">
          <MerchantStrip />
          <button
            type="button"
            onClick={reset}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded px-2 py-0.5 text-[10px] font-medium text-[#78716c] hover:bg-[#f5f5f4]"
          >
            ↺ Reset
          </button>
        </div>
      </header>

      {/* Screen Content */}
      <main className="flex-1 max-w-[390px] mx-auto w-full px-4 pt-5 pb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {SCREENS[currentScreen]}
          </motion.div>
        </AnimatePresence>
      </main>

    </div>

    <Toaster
      position="top-center"
      toastOptions={{
        classNames: {
          toast: "!rounded-xl !text-sm !font-medium",
          success: "!bg-[#ecfdf3] !text-[#065f46] !border-[#a7f3d0]",
          error: "!bg-[#fef2f2] !text-[#991b1b] !border-[#fecaca]",
          info: "!bg-[#eff6ff] !text-[#1e40af] !border-[#bfdbfe]",
        },
      }}
    />
    </>
  );
}

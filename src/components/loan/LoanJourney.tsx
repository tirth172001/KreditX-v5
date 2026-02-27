"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useLoanStore } from "@/store/loanStore";
import { MerchantStrip } from "./MerchantStrip";

// Phase 1
import { S1_ConfirmDetails } from "./screens/p1/S1_ConfirmDetails";
import { S2_EligibilityLoader } from "./screens/p1/S2_EligibilityLoader";
import { S3_EligibilityResult } from "./screens/p1/S3_EligibilityResult";
// Phase 2
import { S4_LenderSelection } from "./screens/p2/S4_LenderSelection";
// Phase 3
import { S5_AAIntro } from "./screens/p3/S5_AAIntro";
import { S6_BankSelection } from "./screens/p3/S6_BankSelection";
import { S7_AAOTP } from "./screens/p3/S7_AAOTP";
import { S8_AccountsFound } from "./screens/p3/S8_AccountsFound";
import { S9_PerBankOTP } from "./screens/p3/S9_PerBankOTP";
// Phase 4
import { S10_IndicativeOffers } from "./screens/p4/S10_IndicativeOffers";
// Phase 5
import { S11_AadhaarKYC } from "./screens/p5/S11_AadhaarKYC";
import { S12_FaceVerification } from "./screens/p5/S12_FaceVerification";
// Phase 6
import { S13_FinalOffers } from "./screens/p6/S13_FinalOffers";
import { S14_ConfirmOffer } from "./screens/p6/S14_ConfirmOffer";
// Phase 7
import { S15_MandateSummary } from "./screens/p7/S15_MandateSummary";
import { S16_SelectAutopay } from "./screens/p7/S16_SelectAutopay";
import { S17_UPIMandate } from "./screens/p7/S17_UPIMandate";
// Phase 8
import { S18_Agreement } from "./screens/p8/S18_Agreement";
import { S19_AgreementSigned } from "./screens/p8/S19_AgreementSigned";
// Phase 9
import { S20_Success } from "./screens/p9/S20_Success";

const SCREENS: Record<number, React.ReactNode> = {
  1: <S1_ConfirmDetails />,
  2: <S2_EligibilityLoader />,
  3: <S3_EligibilityResult />,
  4: <S4_LenderSelection />,
  5: <S5_AAIntro />,
  6: <S6_BankSelection />,
  7: <S7_AAOTP />,
  8: <S8_AccountsFound />,
  9: <S9_PerBankOTP />,
  10: <S10_IndicativeOffers />,
  11: <S11_AadhaarKYC />,
  12: <S12_FaceVerification />,
  13: <S13_FinalOffers />,
  14: <S14_ConfirmOffer />,
  15: <S15_MandateSummary />,
  16: <S16_SelectAutopay />,
  17: <S17_UPIMandate />,
  18: <S18_Agreement />,
  19: <S19_AgreementSigned />,
  20: <S20_Success />,
};

export function LoanJourney() {
  const { currentScreen } = useLoanStore();

  return (
    <div className="min-h-dvh flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white border-b border-[#e7e5e4]">
        <div className="max-w-[390px] mx-auto">
          <MerchantStrip />
        </div>
      </header>

      {/* Screen Content */}
      <main className="flex-1 max-w-[390px] mx-auto w-full px-4 pt-5 pb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            {SCREENS[currentScreen]}
          </motion.div>
        </AnimatePresence>
      </main>

    </div>
  );
}

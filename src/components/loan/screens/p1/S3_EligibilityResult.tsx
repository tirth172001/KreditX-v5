"use client";

import { motion } from "framer-motion";
import { useLoanStore } from "@/store/loanStore";
import { cn } from "@/lib/utils";
import { FileText, IdCard, Landmark, Shield } from "lucide-react";

const JOURNEY_STEPS = [
  {
    id: "generate-offer",
    title: "Generate offer",
    description: "Select your lenders and generate possible offers",
    state: "active" as const,
  },
  {
    id: "complete-kyc",
    title: "Complete KYC",
    description: "Provide Aadhaar and identity proof to get money",
    state: "upcoming" as const,
  },
  {
    id: "select-tenure",
    title: "Select tenure",
    description: "Select preferred terms & setup autopay",
    state: "upcoming" as const,
  },
  {
    id: "setup-autopay",
    title: "Setup autopay",
    description: "Select preferred terms & setup autopay",
    state: "upcoming" as const,
  },
  {
    id: "get-money",
    title: "Get money in your bank",
    description: "Select preferred terms & setup autopay",
    state: "upcoming" as const,
  },
];

function StepIcon({ stepId }: { stepId: string }) {
  switch (stepId) {
    case "generate-offer":
      return <FileText className="h-6 w-6 text-[#1c1917]" strokeWidth={1.7} />;
    case "complete-kyc":
      return <IdCard className="h-6 w-6 text-[#1c1917]" strokeWidth={1.7} />;
    default:
      return <Landmark className="h-6 w-6 text-[#1c1917]" strokeWidth={1.7} />;
  }
}

export function S3_EligibilityResult() {
  const { next } = useLoanStore();

  return (
    <div className="flex flex-col gap-6 pb-4">
      {/* Illustration block */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="h-[108px] w-full rounded-lg bg-[#f5f5f4]"
      >
      </motion.div>

      <div className="space-y-1">
        <h2 className="text-[18px] leading-7 font-semibold text-[#1c1917]">Yay! you are eligible</h2>
        <p className="text-sm leading-5 text-[#78716c]">
          Complete below steps to get the loan in your bank account
        </p>
      </div>

      <div className="space-y-2">
        {JOURNEY_STEPS.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 * index, duration: 0.2 }}
            className={cn(
              "flex items-start gap-3 rounded-md p-3",
              step.state === "active"
                ? "border border-border/60 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                : "opacity-50"
            )}
          >
            <StepIcon stepId={step.id} />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div className="space-y-1">
                <p className="text-sm leading-5 font-semibold text-[#1c1917]">{step.title}</p>
                <p className="text-xs leading-4 text-[#78716c]">{step.description}</p>
              </div>

              {step.state === "active" && (
                <button
                  type="button"
                  onClick={next}
                  className="h-8 w-fit rounded-md px-3 text-xs font-medium text-[#0293a6] transition-colors hover:text-[#007889]"
                >
                  Generate now
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="pt-2">
        <div className="flex items-center justify-center gap-2 text-xs text-[#78716c]">
          <Shield className="h-4 w-4" strokeWidth={1.75} />
          <span>100% secure as per RBI</span>
        </div>
      </div>
    </div>
  );
}

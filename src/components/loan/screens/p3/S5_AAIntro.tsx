"use client";

import { motion } from "framer-motion";
import { ChevronLeft, Database, Lock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLoanStore } from "@/store/loanStore";
import { screenContainer, screenItem, listContainer, listItem } from "@/components/loan/shared/motion";

export function S5_AAIntro() {
  const { next, back } = useLoanStore();

  return (
    <>
      <motion.div
        className="flex flex-col gap-6 pb-44"
        variants={screenContainer}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={screenItem} className="h-[108px] w-full rounded-lg overflow-hidden">
          <img src="/illustrations/login.svg" alt="" className="h-full w-full object-cover" />
        </motion.div>

        <motion.div variants={screenItem} className="space-y-1">
          <h2 className="text-[32px] leading-[38px] font-semibold tracking-[-0.02em] text-[#1c1917]">
            Share your bank data securely
          </h2>
          <p className="text-sm leading-5 text-[#78716c]">
            We use Account Aggregator (AA) to fetch your bank statements for a faster loan approval.
          </p>
        </motion.div>

        <motion.div variants={listContainer} className="space-y-3">
          <motion.div variants={listItem} className="flex items-start gap-3 rounded-lg bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#ecfdf3]">
              <Database className="h-4 w-4 text-[#059669]" strokeWidth={2} />
            </div>
            <div className="space-y-0.5">
              <p className="text-sm font-semibold text-[#1c1917]">What is Account Aggregator?</p>
              <p className="text-xs leading-5 text-[#78716c]">
                AA is an RBI-regulated framework that lets you securely share your financial data with lenders — without sharing your login credentials.
              </p>
            </div>
          </motion.div>

          <motion.div variants={listItem} className="flex items-start gap-3 rounded-lg bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#eff6ff]">
              <Lock className="h-4 w-4 text-[#2563eb]" strokeWidth={2} />
            </div>
            <div className="space-y-0.5">
              <p className="text-sm font-semibold text-[#1c1917]">What data is shared?</p>
              <p className="text-xs leading-5 text-[#78716c]">
                Only your last 6 months of bank statements are shared — read-only. We cannot initiate transactions or access your passwords.
              </p>
            </div>
          </motion.div>

          <motion.div variants={listItem} className="flex items-start gap-3 rounded-lg bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#fef3c7]">
              <ShieldCheck className="h-4 w-4 text-[#d97706]" strokeWidth={2} />
            </div>
            <div className="space-y-0.5">
              <p className="text-sm font-semibold text-[#1c1917]">Your consent, your control</p>
              <p className="text-xs leading-5 text-[#78716c]">
                You can revoke access at any time through your bank's AA interface. Data sharing requires your explicit OTP confirmation.
              </p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div variants={screenItem} className="flex items-center gap-2 rounded-lg border border-[#d1fae5] bg-[#ecfdf3] px-3 py-2 text-xs text-[#065f46]">
          <ShieldCheck className="h-4 w-4 shrink-0 text-[#10b981]" strokeWidth={2} />
          <span>Protected by RBI&apos;s Account Aggregator framework</span>
        </motion.div>
      </motion.div>

      <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-[390px] -translate-x-1/2 border-t border-[#e7e5e4] bg-[#fafaf9] px-4 py-4">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="secondary"
            size="icon"
            onClick={back}
            className="h-10 w-10 bg-[#e8fbff] text-[#0293a6] hover:bg-[#daf7fb]"
            aria-label="Back"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <Button type="button" onClick={next} className="h-10 flex-1 text-sm font-semibold">
            Connect my banks
          </Button>
        </div>
      </div>
    </>
  );
}

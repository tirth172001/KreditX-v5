"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useLoanStore } from "@/store/loanStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { screenContainer, screenItem, listContainer, listItem } from "@/components/loan/shared/motion";

type BankOption = {
  id: string;
  name: string;
  initial: string;
  color: string;
};

const BANKS: BankOption[] = [
  { id: "bob",      name: "Bank of Baroda", initial: "B",  color: "#F58220" },
  { id: "canara",   name: "Canara Bank",    initial: "CB", color: "#00529B" },
  { id: "hdfc",     name: "HDFC Bank",      initial: "H",  color: "#004C8F" },
  { id: "icici",    name: "ICICI Bank",     initial: "IC", color: "#F58220" },
  { id: "indusind", name: "IndusInd Bank",  initial: "IB", color: "#2E318B" },
];

export function S6_BankSelection() {
  const { data, update, next } = useLoanStore();
  const selected = data.selectedBanks;
  const [isLoading, setIsLoading] = useState(false);

  const toggle = (id: string) => {
    update({
      selectedBanks: selected.includes(id)
        ? selected.filter((bankId) => bankId !== id)
        : [...selected, id],
    });
  };

  const handleFindAccounts = async () => {
    setIsLoading(true);
    toast.info("Looking for your linked accounts…");
    await new Promise((resolve) => setTimeout(resolve, 1400));
    next();
  };

  return (
    <>
      <motion.div
        className="flex flex-col gap-6 pb-44"
        variants={screenContainer}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={screenItem} className="h-[108px] w-full rounded-lg bg-[#f5f5f4]" />

        <motion.div variants={screenItem} className="space-y-2">
          <h2 className="text-[18px] leading-7 font-semibold text-[#1c1917]">
            Select banks with an savings account
          </h2>
          <p className="text-sm leading-5 text-[#78716c]">
            Please select all banks where you have the accounts for better loan offer
          </p>
        </motion.div>

        <motion.div variants={screenItem} className="space-y-4">
          <p className="text-base font-semibold leading-6 text-[#1c1917]">Popular banks</p>

          <motion.div variants={listContainer} className="space-y-2">
            {BANKS.map((bank) => {
              const isSelected = selected.includes(bank.id);
              return (
                <motion.button
                  key={bank.id}
                  variants={listItem}
                  type="button"
                  onClick={() => toggle(bank.id)}
                  className="flex w-full items-center gap-2 rounded-lg bg-white p-3 text-left shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                  whileTap={{ scale: 0.985 }}
                >
                  <div
                    className="flex h-6 w-6 items-center justify-center rounded-full text-[9px] font-bold text-white"
                    style={{ backgroundColor: bank.color }}
                  >
                    {bank.initial}
                  </div>

                  <p className="flex-1 text-sm text-[#1c1917]">{bank.name}</p>

                  <motion.span
                    className={cn(
                      "flex h-4 w-4 items-center justify-center rounded border",
                      isSelected ? "border-[#003323] bg-[#003323]" : "border-[#e7e5e4] bg-[#fafaf9]"
                    )}
                    animate={isSelected ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                    transition={{ duration: 0.18 }}
                  >
                    {isSelected && <Check className="h-3 w-3 text-white" strokeWidth={2.5} />}
                  </motion.span>
                </motion.button>
              );
            })}
          </motion.div>
        </motion.div>
      </motion.div>

      <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-[390px] -translate-x-1/2 border-t border-[#e7e5e4] bg-[#fafaf9] px-4 py-4">
        <p className="text-xs leading-4 text-[#78716c]">
          By continuing, you are allowing Setu to use your mobile number to check for existing Account Aggregator profiles to improve your experience
        </p>

        <Button
          type="button"
          onClick={handleFindAccounts}
          disabled={selected.length === 0 || isLoading}
          className="mt-4 h-10 w-full text-sm font-semibold"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Searching...
            </span>
          ) : "Find accounts"}
        </Button>
      </div>
    </>
  );
}

"use client";

import { useLoanStore } from "@/store/loanStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

type BankOption = {
  id: string;
  name: string;
  logo: string;
};

const BANKS: BankOption[] = [
  {
    id: "bob",
    name: "Bank of Baroda",
    logo: "https://www.figma.com/api/mcp/asset/862c1393-1fe6-4754-ae7d-9bc8d79cb72b",
  },
  {
    id: "canara",
    name: "Canara Bank",
    logo: "https://www.figma.com/api/mcp/asset/020b6104-4c2e-421a-8660-2c4201c2a4e8",
  },
  {
    id: "hdfc",
    name: "HDFC Bank",
    logo: "https://www.figma.com/api/mcp/asset/dc10df77-f328-4b8f-b3f1-05f36a3cf970",
  },
  {
    id: "icici",
    name: "ICICI Bank",
    logo: "https://www.figma.com/api/mcp/asset/38944d8d-a059-46ab-b8a5-d6745a169377",
  },
  {
    id: "indusind",
    name: "IndusInd Bank",
    logo: "https://www.figma.com/api/mcp/asset/5177f69a-1247-4af2-a3b6-068a5a69cc3b",
  },
];

export function S6_BankSelection() {
  const { data, update, next } = useLoanStore();
  const selected = data.selectedBanks;

  const toggle = (id: string) => {
    update({
      selectedBanks: selected.includes(id)
        ? selected.filter((bankId) => bankId !== id)
        : [...selected, id],
    });
  };

  return (
    <>
      <div className="flex flex-col gap-6 pb-44">
        <div className="h-[108px] w-full rounded-lg bg-[#f5f5f4]" />

        <div className="space-y-2">
          <h2 className="text-[18px] leading-7 font-semibold text-[#1c1917]">
            Select banks with an savings account
          </h2>
          <p className="text-sm leading-5 text-[#78716c]">
            Please select all banks where you have the accounts for better loan offer
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-base font-semibold leading-6 text-[#1c1917]">Popular banks</p>

          <div className="space-y-2">
            {BANKS.map((bank) => {
              const isSelected = selected.includes(bank.id);
              return (
                <button
                  key={bank.id}
                  type="button"
                  onClick={() => toggle(bank.id)}
                  className="flex w-full items-center gap-2 rounded-lg bg-white p-3 text-left shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                >
                  <div className="flex h-6 w-6 items-center justify-center overflow-hidden">
                    <img src={bank.logo} alt="" className="h-5 w-5 object-contain" />
                  </div>

                  <p className="flex-1 text-sm text-[#1c1917]">{bank.name}</p>

                  <span
                    className={cn(
                      "flex h-4 w-4 items-center justify-center rounded border",
                      isSelected
                        ? "border-[#003323] bg-[#003323]"
                        : "border-[#e7e5e4] bg-[#fafaf9]"
                    )}
                  >
                    {isSelected && <Check className="h-3 w-3 text-white" strokeWidth={2.5} />}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-[390px] -translate-x-1/2 border-t border-[#e7e5e4] bg-[#fafaf9] px-4 py-4">
        <p className="text-xs leading-4 text-[#78716c]">
          By continuing, you are allowing Setu to use your mobile number to check for existing Account Aggregator profiles to improve your experience
        </p>

        <Button
          type="button"
          onClick={next}
          disabled={selected.length === 0}
          className="mt-4 h-10 w-full text-sm font-semibold"
        >
          Find accounts
        </Button>
      </div>
    </>
  );
}

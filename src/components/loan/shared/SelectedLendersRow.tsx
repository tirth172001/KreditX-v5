"use client";

import { useMemo, useState } from "react";
import { ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { type LenderOffer } from "@/store/loanStore";

const ADITYA_BIRLA_LOGO = "https://www.figma.com/api/mcp/asset/abd94726-931c-4054-b926-f4edfe6bc717";
const AXIS_LOGO_A = "https://www.figma.com/api/mcp/asset/a38588b1-b0bf-4d5b-be88-df0d9ebdb90b";
const AXIS_LOGO_B = "https://www.figma.com/api/mcp/asset/18406f18-60ae-4db5-8603-362208a047fc";

function LenderAvatar({ lender }: { lender: LenderOffer }) {
  if (lender.id === "ab") {
    return <img src={ADITYA_BIRLA_LOGO} alt="" className="h-4 w-4 object-contain" />;
  }

  if (lender.id === "axis") {
    return (
      <div className="relative h-4 w-4">
        <img src={AXIS_LOGO_A} alt="" className="absolute inset-0 h-4 w-4 object-contain" />
        <img src={AXIS_LOGO_B} alt="" className="absolute inset-0 h-4 w-4 object-contain" />
      </div>
    );
  }

  return (
    <div
      className="flex h-4 w-4 items-center justify-center rounded-full text-[8px] font-bold text-white"
      style={{ backgroundColor: lender.color }}
    >
      {lender.logoInitial}
    </div>
  );
}

interface SelectedLendersRowProps {
  lenders: LenderOffer[];
  className?: string;
}

export function SelectedLendersRow({ lenders, className }: SelectedLendersRowProps) {
  const [open, setOpen] = useState(false);
  const selected = useMemo(
    () => lenders.filter((lender) => lender.isEligible && lender.isSelected),
    [lenders]
  );

  if (selected.length === 0) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "flex h-12 w-full items-center justify-between rounded-lg bg-white px-4 py-3 text-left shadow-[0_1px_1px_rgba(0,0,0,0.02)]",
          className
        )}
      >
        <div className="flex items-center gap-2">
          <div className="relative flex items-center">
            {selected.slice(0, 2).map((lender, index) => (
              <div
                key={lender.id}
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full border border-[#d6d3d1] bg-white p-1",
                  index > 0 && "-ml-2"
                )}
              >
                <LenderAvatar lender={lender} />
              </div>
            ))}
          </div>

          <p className="text-xs font-medium text-[#1c1917]">
            {selected.length} Lenders selected
          </p>
        </div>

        <ChevronRight className="h-4 w-4 text-[#003323]" />
      </button>

      {open && (
        <>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 bg-black/45"
            aria-label="Close selected lenders sheet"
          />

          <div className="fixed bottom-0 left-1/2 z-50 w-full max-w-[390px] -translate-x-1/2 rounded-t-2xl bg-white p-4 shadow-2xl">
            <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-[#d6d3d1]" />

            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#1c1917]">
                {selected.length} selected lender{selected.length === 1 ? "" : "s"}
              </h3>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md p-1 text-[#78716c]"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2">
              {selected.map((lender) => (
                <div
                  key={lender.id}
                  className="flex items-center gap-3 rounded-lg border border-[#e7e5e4] bg-[#fafaf9] p-3"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[#d6d3d1] bg-white p-1">
                    <LenderAvatar lender={lender} />
                  </div>

                  <p className="text-sm font-medium text-[#1c1917]">{lender.name}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import { EllipsisVertical, X } from "lucide-react";
import { useLoanStore } from "@/store/loanStore";

type MerchantStripMode = "close" | "none" | "placeholder" | "menu-close";

export function MerchantStrip() {
  const currentScreen = useLoanStore((s) => s.currentScreen);
  const excludedCount = useLoanStore(
    (s) => s.data.eligibleLenders.filter((l) => !l.isEligible).length
  );
  const merchantName = useLoanStore((s) => s.data.merchant.name) || "Croma";
  const merchantInitial = merchantName.charAt(0).toUpperCase();
  const [overrideMode, setOverrideMode] = useState<MerchantStripMode | null>(null);

  useEffect(() => {
    const listener = (event: Event) => {
      const customEvent = event as CustomEvent<{ mode?: MerchantStripMode | "default" }>;
      const mode = customEvent.detail?.mode;
      setOverrideMode(mode && mode !== "default" ? mode : null);
    };

    window.addEventListener("loan:merchant-strip-mode", listener);
    return () => window.removeEventListener("loan:merchant-strip-mode", listener);
  }, []);

  useEffect(() => {
    setOverrideMode(null);
  }, [currentScreen]);

  if (overrideMode === "placeholder" || overrideMode === "none") {
    return (
      <div className="flex h-14 items-center gap-3 px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-black/15 bg-white text-sm font-semibold text-[#1c1917]">
          {merchantInitial}
        </div>

        <span className="text-[17px] font-medium tracking-[0.34px] text-[#003323]">
          {merchantName}
        </span>

        <span className="ml-auto h-6 w-6" aria-hidden />
      </div>
    );
  }

  if (overrideMode === "close") {
    return (
      <div className="flex h-14 items-center gap-3 px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-black/15 bg-white text-sm font-semibold text-[#1c1917]">
          {merchantInitial}
        </div>

        <span className="text-[17px] font-medium tracking-[0.34px] text-[#003323]">
          {merchantName}
        </span>

        <button type="button" className="ml-auto text-[#1c1917]" aria-label="Close">
          <X className="h-6 w-6" strokeWidth={2} />
        </button>
      </div>
    );
  }

  if (overrideMode === "menu-close") {
    return (
      <div className="flex h-14 items-center gap-3 px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-black/15 bg-white text-sm font-semibold text-[#1c1917]">
          {merchantInitial}
        </div>

        <span className="text-[17px] font-medium tracking-[0.34px] text-[#003323]">
          {merchantName}
        </span>

        <div className="ml-auto flex items-center gap-3 text-[#1c1917]">
          <button type="button" aria-label="More options">
            <EllipsisVertical className="h-5 w-5" />
          </button>
          <button type="button" aria-label="Close">
            <X className="h-6 w-6" strokeWidth={2} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-14 items-center gap-3 px-4">
      <div className="flex h-8 w-8 items-center justify-center rounded-full border border-black/15 bg-white text-sm font-semibold text-[#1c1917]">
        {merchantInitial}
      </div>

      <span className="text-[17px] font-medium tracking-[0.34px] text-[#003323]">
        {merchantName}
      </span>

      {currentScreen === 4 && excludedCount > 0 ? (
        <button
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent("loan:open-excluded-lenders"))}
          className="ml-auto text-xs font-medium text-[#003323]"
        >
          {excludedCount} lenders excluded
        </button>
      ) : currentScreen === 7 || currentScreen === 10 ? (
        <span className="ml-auto h-6 w-6" aria-hidden />
      ) : currentScreen === 8 || currentScreen === 9 ? (
        <div className="ml-auto flex items-center gap-3 text-[#1c1917]">
          <button type="button" aria-label="More options">
            <EllipsisVertical className="h-5 w-5" />
          </button>
          <button type="button" aria-label="Close">
            <X className="h-6 w-6" strokeWidth={2} />
          </button>
        </div>
      ) : (
        <button type="button" className="ml-auto text-[#1c1917]" aria-label="Close">
          <X className="h-6 w-6" strokeWidth={2} />
        </button>
      )}
    </div>
  );
}

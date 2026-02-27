"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useLoanStore } from "@/store/loanStore";

interface ScreenShellProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onBack?: () => void;
  hideBack?: boolean;
  className?: string;
}

export function ScreenShell({ title, subtitle, children, onBack, hideBack, className }: ScreenShellProps) {
  const { back } = useLoanStore();

  return (
    <div className={cn("flex flex-col gap-5", className)}>
      <div className="flex flex-col gap-1">
        {!hideBack && (
          <button
            onClick={onBack ?? back}
            className="flex items-center gap-1 text-sm text-muted-foreground mb-1 -ml-1 w-fit"
          >
            <span className="text-base">←</span>
            <span>Back</span>
          </button>
        )}
        <h2 className="text-[1.375rem] font-bold tracking-tight leading-tight">{title}</h2>
        {subtitle && <p className="text-sm text-muted-foreground leading-relaxed">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

interface NavButtonsProps {
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  nextType?: "button" | "submit";
  isLoading?: boolean;
  hideBack?: boolean;
  nextDisabled?: boolean;
}

export function NavButtons({
  onBack,
  onNext,
  nextLabel = "Continue",
  nextType = "button",
  isLoading,
  hideBack,
  nextDisabled,
}: NavButtonsProps) {
  const { back } = useLoanStore();

  return (
    <div className="flex gap-3 pt-2">
      {!hideBack && (
        <Button type="button" variant="outline" className="flex-1 h-12" onClick={onBack ?? back}>
          ← Back
        </Button>
      )}
      <Button
        type={nextType}
        className="flex-1 h-12 font-semibold"
        onClick={nextType === "button" ? onNext : undefined}
        disabled={isLoading || nextDisabled}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            Please wait…
          </span>
        ) : (
          nextLabel
        )}
      </Button>
    </div>
  );
}

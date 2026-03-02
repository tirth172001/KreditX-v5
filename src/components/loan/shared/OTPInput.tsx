"use client";

import { useRef, KeyboardEvent, ClipboardEvent } from "react";
import { cn } from "@/lib/utils";

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (val: string) => void;
  onComplete?: () => void;
  className?: string;
  fullWidth?: boolean;
}

export function OTPInput({ length = 6, value, onChange, onComplete, className, fullWidth = false }: OTPInputProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const digits = Array.from({ length }, (_, i) => value[i] ?? "");

  const handleChange = (i: number, char: string) => {
    if (!/^\d?$/.test(char)) return;
    const next = digits.map((d, idx) => (idx === i ? char : d)).join("").slice(0, length);
    onChange(next);
    if (char && i < length - 1) refs.current[i + 1]?.focus();
    if (next.length === length) onComplete?.();
  };

  const handleKeyDown = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      refs.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (pasted) {
      onChange(pasted);
      refs.current[Math.min(pasted.length, length - 1)]?.focus();
    }
    e.preventDefault();
  };

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-[#e5e5e5] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]",
        fullWidth ? "flex w-full" : "inline-flex",
        className
      )}
    >
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          className={cn(
            "h-10 min-w-0 border-r border-[#e5e5e5] bg-white text-center text-base font-medium text-[#1c1917] outline-none transition-colors last:border-r-0",
            fullWidth ? "flex-1" : "w-11",
            "focus:bg-[#fafaf9]"
          )}
        />
      ))}
    </div>
  );
}

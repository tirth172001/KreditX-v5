"use client";

import { useRef, KeyboardEvent, ClipboardEvent } from "react";
import { cn } from "@/lib/utils";

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (val: string) => void;
  className?: string;
}

export function OTPInput({ length = 6, value, onChange, className }: OTPInputProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const digits = Array.from({ length }, (_, i) => value[i] ?? "");

  const handleChange = (i: number, char: string) => {
    if (!/^\d?$/.test(char)) return;
    const next = digits.map((d, idx) => (idx === i ? char : d)).join("").slice(0, length);
    onChange(next);
    if (char && i < length - 1) refs.current[i + 1]?.focus();
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
    <div className={cn("flex gap-2 justify-center", className)}>
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
            "w-11 h-14 text-center text-xl font-bold rounded-xl border-2 bg-white outline-none transition-all",
            digit
              ? "border-primary text-primary"
              : "border-border text-foreground",
            "focus:border-primary focus:ring-2 focus:ring-primary/20"
          )}
        />
      ))}
    </div>
  );
}

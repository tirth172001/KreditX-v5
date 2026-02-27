"use client";

import { cn } from "@/lib/utils";

interface TrustBarProps {
  className?: string;
  variant?: "default" | "compact";
}

export function TrustBar({ className, variant = "default" }: TrustBarProps) {
  const items = [
    { icon: "🔒", label: "256-bit Encrypted" },
    { icon: "🏦", label: "RBI Regulated" },
    { icon: "✅", label: "Soft Check Only" },
  ];

  if (variant === "compact") {
    return (
      <div className={cn("flex items-center justify-center gap-3", className)}>
        {items.map((item) => (
          <span key={item.label} className="text-xs text-muted-foreground flex items-center gap-1">
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-between bg-muted/60 rounded-xl px-4 py-2.5", className)}>
      {items.map((item) => (
        <div key={item.label} className="flex flex-col items-center gap-0.5">
          <span className="text-base">{item.icon}</span>
          <span className="text-[10px] text-muted-foreground font-medium">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

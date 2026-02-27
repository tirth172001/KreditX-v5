import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calcEMI(principal: number, months: number, annualRate = 12) {
  const r = annualRate / 12 / 100;
  return Math.round(
    (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1)
  );
}

export function maskMobile(mobile: string) {
  return `+91 ${mobile.slice(0, 2)}XXXXXX${mobile.slice(-2)}`;
}

export function maskAccount(acc: string) {
  return `••••${acc.slice(-4)}`;
}

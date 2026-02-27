"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Pencil,
  Plus,
  Smartphone,
  UserSquare2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, formatINR } from "@/lib/utils";
import { useLoanStore } from "@/store/loanStore";

type MethodOption = "upi" | "aadhaar" | "debit" | "netbanking";

const UPI_APPS = [
  { id: "phonepe", label: "PhonePe", short: "P", color: "#5f259f" },
  { id: "bhim", label: "BHIM", short: "B", color: "#f97316" },
  { id: "gpay", label: "Google Pay", short: "G", color: "#2563eb" },
  { id: "supermoney", label: "super.money", short: "S", color: "#4f46e5" },
  { id: "whatsapp", label: "Whatsapp", short: "W", color: "#16a34a" },
  { id: "paytm", label: "Paytm", short: "P", color: "#0ea5e9" },
  { id: "idfc", label: "IDFC bank", short: "I", color: "#dc2626" },
  { id: "imobile", label: "iMobile Pay", short: "M", color: "#a16207" },
];

const METHOD_OPTIONS: Array<{ id: MethodOption; label: string; icon: ReactNode }> = [
  { id: "upi", label: "UPI", icon: <Smartphone className="h-4 w-4" /> },
  { id: "aadhaar", label: "Aadhaar", icon: <UserSquare2 className="h-4 w-4" /> },
  { id: "debit", label: "Debit card", icon: <CreditCard className="h-4 w-4" /> },
  { id: "netbanking", label: "Net banking", icon: <Building2 className="h-4 w-4" /> },
];

function SheetClose({ onClose }: { onClose: () => void }) {
  return (
    <button
      type="button"
      onClick={onClose}
      className="mb-4 self-center rounded-full bg-[#78716c] p-2 text-white"
      aria-label="Close"
    >
      <X className="h-6 w-6" />
    </button>
  );
}

export function S15_MandateSummary() {
  const { data, update, next, back } = useLoanStore();

  const [manualSheetOpen, setManualSheetOpen] = useState(false);
  const [methodSheetOpen, setMethodSheetOpen] = useState(false);
  const [upiAppsSheetOpen, setUpiAppsSheetOpen] = useState(false);

  const [accountNumber, setAccountNumber] = useState("1212121212123456");
  const [ifsc, setIfsc] = useState("KKBK000159");
  const [selectedMethod, setSelectedMethod] = useState<MethodOption>("upi");

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("loan:merchant-strip-mode", { detail: { mode: "none" } })
    );

    return () => {
      window.dispatchEvent(
        new CustomEvent("loan:merchant-strip-mode", { detail: { mode: "default" } })
      );
    };
  }, []);

  const selectedOffer = useMemo(
    () => data.finalOffers.find((offer) => offer.id === data.selectedOfferId),
    [data.finalOffers, data.selectedOfferId]
  );

  const hasBankAccount = Boolean(data.autopayBank);

  const interestRate = selectedOffer?.rate ?? 11.5;
  const tenure = data.selectedTenure || 12;
  const amount = data.finalLoanAmount || 50000;

  const handleAddBank = () => {
    if (accountNumber.replace(/\D/g, "").length < 8 || ifsc.trim().length < 5) return;

    const cleanAccount = accountNumber.replace(/\D/g, "");
    const last4 = cleanAccount.slice(-4) || "3456";

    update({
      autopayBank: `Kotak mahindra bank ••••${last4}`,
    });

    setManualSheetOpen(false);
  };

  const handleSetupAutopay = () => {
    if (!hasBankAccount) return;
    setMethodSheetOpen(true);
  };

  const handleSelectMethod = (method: MethodOption) => {
    setSelectedMethod(method);

    if (method === "upi") {
      setMethodSheetOpen(false);
      setUpiAppsSheetOpen(true);
      return;
    }

    update({
      autopayMethod: method,
      autopayApp: "",
      mandateSetup: true,
    });
    setMethodSheetOpen(false);
    next();
  };

  const handleSelectUpiApp = (appId: string) => {
    update({
      autopayMethod: "upi",
      autopayApp: appId,
      autopayBank: data.autopayBank || "Kotak mahindra bank ••••3456",
      mandateSetup: false,
    });

    setUpiAppsSheetOpen(false);
    next();
  };

  return (
    <>
      <div className="flex flex-col gap-6 pb-44">
        <div className="h-[108px] w-full rounded-lg bg-[#f5f5f4]" />

        <div className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-[32px] leading-[38px] font-semibold tracking-[-0.02em] text-[#1c1917]">
              Setup autopay
            </h2>
            <p className="text-sm leading-5 text-[#78716c]">
              Add your repayment bank account and choose how autopay will be set up.
            </p>
          </div>

          <div className="flex items-center gap-3 py-1">
            <div className="h-1.5 w-[72px] rounded-full bg-[#e7e5e4]">
              <div
                className={cn(
                  "h-1.5 rounded-full bg-[#003323]",
                  hasBankAccount ? "w-full" : "w-[40px]"
                )}
              />
            </div>
            <p className="text-xs font-medium text-[#44403c]">
              {hasBankAccount ? "Choose autopay method" : "Add bank account"}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="rounded-lg bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#fde68a] text-[10px] font-bold text-[#7c2d12]">
                ₹
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[#1c1917]">{formatINR(amount)}</p>
                <p className="text-xs text-[#78716c]">
                  Interest: {interestRate}%
                  <span className="mx-2">|</span>
                  Tenure: {tenure} Months
                </p>
              </div>

              <button type="button" className="text-[#1c1917]" aria-label="Edit offer">
                <Pencil className="h-4 w-4" />
              </button>
            </div>
          </div>

          {hasBankAccount ? (
            <div className="rounded-lg bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
              <div className="flex items-center justify-between">
                <p className="text-base font-semibold text-[#1c1917]">Bank account</p>
                <button
                  type="button"
                  onClick={() => update({ autopayBank: "" })}
                  className="text-[#1c1917]"
                  aria-label="Edit bank account"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              </div>

              <div className="my-4 h-px bg-[#e7e5e4]" />

              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e0f2fe] text-xs font-bold text-[#0369a1]">
                  K
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1c1917]">Kotak mahindra bank</p>
                  <p className="text-xs text-[#78716c]">
                    Savings account • {data.autopayBank.split("••••")[1] ? `xx${data.autopayBank.split("••••")[1]}` : "xx3456"}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-lg bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
              <p className="text-base font-semibold text-[#1c1917]">Add a bank account</p>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMethodSheetOpen(true)}
                  className="rounded-lg border border-[#e7e5e4] px-3 py-4 text-center"
                >
                  <div className="mx-auto mb-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#f3f4f6] text-[#1c1917]">
                    <Smartphone className="h-4 w-4" />
                  </div>
                  <p className="text-sm font-medium text-[#1c1917]">Add via UPI</p>
                </button>

                <button
                  type="button"
                  onClick={() => setManualSheetOpen(true)}
                  className="rounded-lg border border-[#e7e5e4] px-3 py-4 text-center"
                >
                  <div className="mx-auto mb-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#f3f4f6] text-[#1c1917]">
                    <Plus className="h-4 w-4" />
                  </div>
                  <p className="text-sm font-medium text-[#1c1917]">Add manually</p>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-[390px] -translate-x-1/2 border-t border-[#e7e5e4] bg-[#fafaf9] px-4 py-4">
        {hasBankAccount ? (
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="h-10 w-10 bg-[#e8fbff] text-[#0293a6] hover:bg-[#daf7fb]"
              onClick={back}
              aria-label="Back"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <Button type="button" onClick={handleSetupAutopay} className="h-10 flex-1 text-sm font-semibold">
              Setup autopay
            </Button>
          </div>
        ) : (
          <Button type="button" variant="outline" onClick={back} className="h-10 w-full text-sm font-semibold">
            Back
          </Button>
        )}
      </div>

      {manualSheetOpen && (
        <>
          <button
            type="button"
            onClick={() => setManualSheetOpen(false)}
            className="fixed inset-0 z-[60] bg-black/85"
            aria-label="Close add bank manually sheet"
          />

          <div className="fixed inset-0 z-[70] flex flex-col justify-end">
            <SheetClose onClose={() => setManualSheetOpen(false)} />

            <div className="w-full max-w-[390px] self-center overflow-hidden rounded-t-2xl bg-[#fafaf9]">
              <div className="border-b border-[#d6d3d1] bg-white px-6 py-4">
                <h3 className="text-[18px] leading-7 font-semibold text-[#1c1917]">Add bank manually</h3>
                <p className="text-sm text-[#78716c]">Please provide your account details</p>
              </div>

              <div className="space-y-4 bg-white px-6 py-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#1c1917]" htmlFor="account-number">
                    Account number
                  </label>
                  <Input
                    id="account-number"
                    value={accountNumber}
                    onChange={(event) => setAccountNumber(event.target.value)}
                    className="h-10 bg-[#fafaf9]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#1c1917]" htmlFor="ifsc-code">
                    IFSC
                  </label>
                  <Input
                    id="ifsc-code"
                    value={ifsc}
                    onChange={(event) => setIfsc(event.target.value.toUpperCase())}
                    className="h-10 bg-[#fafaf9]"
                  />
                  <p className="text-sm text-[#78716c]">Maninagar, Ahmedabad</p>
                </div>

                <Button type="button" onClick={handleAddBank} className="h-10 w-full text-sm font-semibold">
                  Add bank account
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      {methodSheetOpen && (
        <>
          <button
            type="button"
            onClick={() => setMethodSheetOpen(false)}
            className="fixed inset-0 z-[60] bg-black/85"
            aria-label="Close select method sheet"
          />

          <div className="fixed inset-0 z-[70] flex flex-col justify-end">
            <SheetClose onClose={() => setMethodSheetOpen(false)} />

            <div className="w-full max-w-[390px] self-center overflow-hidden rounded-t-2xl bg-[#fafaf9]">
              <div className="border-b border-[#d6d3d1] bg-white px-6 py-4">
                <h3 className="text-[18px] leading-7 font-semibold text-[#1c1917]">Select autopay method</h3>
                <p className="text-sm text-[#78716c]">Choose how you want to authorize mandate</p>
              </div>

              <div className="space-y-2 bg-white px-6 py-6">
                {METHOD_OPTIONS.map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => handleSelectMethod(method.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg border bg-white p-3 text-left shadow-[0_1px_2px_rgba(0,0,0,0.05)]",
                      selectedMethod === method.id ? "border-[#003323]" : "border-[#e7e5e4]"
                    )}
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f3f4f6] text-[#1c1917]">
                      {method.icon}
                    </span>
                    <span className="flex-1 text-sm font-medium text-[#1c1917]">{method.label}</span>
                    <ChevronRight className="h-4 w-4 text-[#78716c]" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {upiAppsSheetOpen && (
        <>
          <button
            type="button"
            onClick={() => setUpiAppsSheetOpen(false)}
            className="fixed inset-0 z-[60] bg-black/85"
            aria-label="Close UPI app sheet"
          />

          <div className="fixed inset-0 z-[70] flex flex-col justify-end">
            <SheetClose onClose={() => setUpiAppsSheetOpen(false)} />

            <div className="w-full max-w-[390px] self-center overflow-hidden rounded-t-2xl bg-[#fafaf9]">
              <div className="border-b border-[#d6d3d1] bg-white px-6 py-4 text-center">
                <h3 className="text-[18px] leading-7 font-semibold text-[#1c1917]">Choose UPI app</h3>
                <p className="text-sm text-[#78716c]">Select the app to complete mandate setup</p>
              </div>

              <div className="grid grid-cols-4 gap-x-3 gap-y-5 bg-white px-6 py-6">
                {UPI_APPS.map((app) => (
                  <button
                    key={app.id}
                    type="button"
                    onClick={() => handleSelectUpiApp(app.id)}
                    className="flex flex-col items-center gap-2"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#e7e5e4] bg-white text-base font-semibold" style={{ color: app.color }}>
                      {app.short}
                    </div>
                    <p className="text-center text-[11px] leading-4 text-[#1c1917]">{app.label}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

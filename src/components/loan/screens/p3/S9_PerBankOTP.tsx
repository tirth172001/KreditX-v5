"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLoanStore, type BankAccount } from "@/store/loanStore";

type FlowState = "skeleton" | "discovery" | "final_loading";

type BankId = "canara" | "hdfc" | "icici";

type BankMeta = {
  id: BankId;
  name: string;
  logo: string;
  logoInitial: string;
  color: string;
};

type AccountTemplate = {
  id: string;
  bankId: BankId;
  accountType: BankAccount["accountType"];
  maskedNumber: string;
};

type LocalAccount = BankAccount & {
  bankId: BankId;
  logo: string;
};

const ONEMONEY_LOGO = "https://www.figma.com/api/mcp/asset/835e1f2c-e71e-48c1-a357-e8487be7efd5";

const BANK_META: Record<BankId, BankMeta> = {
  canara: {
    id: "canara",
    name: "Canara bank",
    logo: "https://www.figma.com/api/mcp/asset/b9b84308-0d9a-4a0f-94c2-037fc90c28ca",
    logoInitial: "C",
    color: "#0ea5e9",
  },
  hdfc: {
    id: "hdfc",
    name: "HDFC bank",
    logo: "https://www.figma.com/api/mcp/asset/05054687-6aa8-4676-93da-6e53433a0bde",
    logoInitial: "H",
    color: "#ef4444",
  },
  icici: {
    id: "icici",
    name: "ICICI Bank",
    logo: "https://www.figma.com/api/mcp/asset/fd2c0422-8233-4b32-9069-5e59add212bd",
    logoInitial: "I",
    color: "#ea580c",
  },
};

const ACCOUNT_TEMPLATES: AccountTemplate[] = [
  { id: "canara-1", bankId: "canara", accountType: "savings", maskedNumber: "3456" },
  { id: "canara-2", bankId: "canara", accountType: "current", maskedNumber: "9878" },
  { id: "canara-3", bankId: "canara", accountType: "current", maskedNumber: "1342" },
  { id: "hdfc-1", bankId: "hdfc", accountType: "savings", maskedNumber: "8234" },
  { id: "hdfc-2", bankId: "hdfc", accountType: "savings", maskedNumber: "2345" },
  { id: "icici-1", bankId: "icici", accountType: "savings", maskedNumber: "8234" },
];

const BANK_ORDER: BankId[] = ["canara", "hdfc", "icici"];

function inferBankId(bankName: string): BankId {
  const value = bankName.toLowerCase();
  if (value.includes("hdfc")) return "hdfc";
  if (value.includes("icici")) return "icici";
  return "canara";
}

function mapTemplateToLocal(template: AccountTemplate): LocalAccount {
  const meta = BANK_META[template.bankId];
  return {
    id: template.id,
    bankId: template.bankId,
    bankName: meta.name,
    bankLogoInitial: meta.logoInitial,
    bankColor: meta.color,
    logo: meta.logo,
    accountType: template.accountType,
    maskedNumber: template.maskedNumber,
    isSelected: true,
    otpVerified: false,
  };
}

function buildInitialAccounts(selectedBanks: string[], discoveredAccounts: BankAccount[]): LocalAccount[] {
  const selectedSet = new Set(selectedBanks);

  if (selectedSet.size > 0) {
    const preferred = ACCOUNT_TEMPLATES.filter((account) => selectedSet.has(account.bankId));
    if (preferred.length > 0) return preferred.map(mapTemplateToLocal);
  }

  if (discoveredAccounts.length > 0) {
    return discoveredAccounts.map((account) => {
      const bankId = inferBankId(account.bankName);
      const meta = BANK_META[bankId];
      return {
        ...account,
        bankId,
        bankName: account.bankName || meta.name,
        bankLogoInitial: account.bankLogoInitial || meta.logoInitial,
        bankColor: account.bankColor || meta.color,
        logo: meta.logo,
      };
    });
  }

  return ACCOUNT_TEMPLATES.map(mapTemplateToLocal);
}

function toStoreAccount(account: LocalAccount): BankAccount {
  return {
    id: account.id,
    bankName: account.bankName,
    bankLogoInitial: account.bankLogoInitial,
    bankColor: account.bankColor,
    accountType: account.accountType,
    maskedNumber: account.maskedNumber,
    isSelected: account.isSelected,
    otpVerified: account.otpVerified,
  };
}

function AccountLogo({ account, size = 32 }: { account: LocalAccount; size?: number }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#d6d3d1] bg-white"
      style={{ width: size, height: size }}
    >
      <img
        src={account.logo}
        alt=""
        className={cn("object-contain", size >= 48 ? "h-8 w-8" : "h-6 w-6")}
      />
    </div>
  );
}

export function S9_PerBankOTP() {
  const { data, update, next } = useLoanStore();
  const mobileLast4 = (data.mobile || "").slice(-4) || "9747";
  const otpPhoneLast4 = "9898";

  const [flowState, setFlowState] = useState<FlowState>("skeleton");
  const [accounts, setAccounts] = useState<LocalAccount[]>(() =>
    buildInitialAccounts(data.selectedBanks, data.discoveredAccounts)
  );
  const [otpSheetOpen, setOtpSheetOpen] = useState(false);
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [otp, setOtp] = useState("111111");
  const [retriesLeft, setRetriesLeft] = useState(3);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (flowState === "skeleton") {
      const timer = setTimeout(() => setFlowState("discovery"), 2200);
      return () => clearTimeout(timer);
    }

    if (flowState === "final_loading") {
      const timer = setTimeout(() => next(), 2200);
      return () => clearTimeout(timer);
    }

    return;
  }, [flowState, next]);

  const selectedAccounts = useMemo(
    () => accounts.filter((account) => account.isSelected),
    [accounts]
  );

  const selectedGroups = useMemo(() => {
    const grouped = new Map<BankId, LocalAccount[]>();
    selectedAccounts.forEach((account) => {
      if (!grouped.has(account.bankId)) grouped.set(account.bankId, []);
      grouped.get(account.bankId)?.push(account);
    });

    return BANK_ORDER.filter((bankId) => grouped.has(bankId)).map((bankId) => {
      const groupAccounts = grouped.get(bankId) || [];
      const first = groupAccounts[0];
      return {
        bankId,
        bankName: first.bankName,
        accounts: groupAccounts,
      };
    });
  }, [selectedAccounts]);

  const currentGroup = selectedGroups[currentGroupIndex];
  const verifiedBeforeCurrent = selectedGroups
    .slice(0, currentGroupIndex)
    .reduce((count, group) => count + group.accounts.length, 0);

  const otpDigits = Array.from({ length: 6 }, (_, index) => otp[index] ?? "");

  const updateOtpDigit = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const nextValue = otpDigits
      .map((digit, digitIndex) => (digitIndex === index ? value : digit))
      .join("");
    setOtp(nextValue);
    if (value && index < 5) refs.current[index + 1]?.focus();
  };

  const toggleAccount = (id: string) => {
    setAccounts((previous) =>
      previous.map((account) =>
        account.id === id
          ? {
              ...account,
              isSelected: !account.isSelected,
              otpVerified: !account.isSelected ? account.otpVerified : false,
            }
          : account
      )
    );
  };

  const startOtpSequence = () => {
    if (selectedAccounts.length === 0) return;
    setCurrentGroupIndex(0);
    setOtp("111111");
    setRetriesLeft(3);
    setOtpSheetOpen(true);
    setTimeout(() => refs.current[0]?.focus(), 0);
  };

  const handleResendOtp = () => {
    if (retriesLeft === 0) return;
    setRetriesLeft((value) => Math.max(0, value - 1));
    setOtp("111111");
    setTimeout(() => refs.current[0]?.focus(), 0);
  };

  const verifyCurrentBank = () => {
    if (!currentGroup || otp.length !== 6) return;

    const accountIds = new Set(currentGroup.accounts.map((account) => account.id));
    const nextAccounts = accounts.map((account) =>
      accountIds.has(account.id) ? { ...account, otpVerified: true } : account
    );

    setAccounts(nextAccounts);
    update({ discoveredAccounts: nextAccounts.map(toStoreAccount) });

    if (currentGroupIndex >= selectedGroups.length - 1) {
      setOtpSheetOpen(false);
      setFlowState("final_loading");
      return;
    }

    setCurrentGroupIndex((value) => value + 1);
    setOtp("111111");
    setRetriesLeft(3);
    setTimeout(() => refs.current[0]?.focus(), 0);
  };

  if (flowState === "skeleton") {
    return (
      <>
        <div className="flex flex-col gap-6 pb-44">
          <div className="h-[108px] w-full rounded-lg bg-[#f5f5f4]" />

          <div className="space-y-2">
            <div className="h-5 w-[208px] rounded bg-[#d6d3d1]" />
            <div className="h-11 w-full rounded bg-[#e7e5e4]" />
          </div>

          <div className="space-y-3">
            {[1, 2, 3].map((index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-lg bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
              >
                <div className="h-8 w-8 rounded bg-[#e7e5e4]" />
                <div className="flex-1 space-y-1">
                  <div className="h-[18px] w-20 rounded bg-[#e7e5e4]" />
                  <div className="h-4 w-full rounded bg-[#f5f5f4]" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-[390px] -translate-x-1/2 bg-[#fafaf9] px-4 py-4">
          <Button
            type="button"
            disabled
            className="h-10 w-full bg-[#6f8f86] text-sm font-semibold text-white opacity-100"
          >
            Finding your accounts
          </Button>

          <div className="mt-3 flex items-center justify-center gap-2 text-xs text-[#84878a]">
            <span>Powered by RBI regulated AA</span>
            <img src={ONEMONEY_LOGO} alt="Onemoney" className="h-5 w-[68px] object-contain" />
          </div>
        </div>
      </>
    );
  }

  if (flowState === "final_loading") {
    const loadingLogos = selectedGroups
      .map((group) => group.accounts[0])
      .filter(Boolean)
      .slice(0, 3);

    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4">
        <div className="flex items-center">
          {loadingLogos.map((account, index) => (
            <div
              key={account.id}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-[#d6d3d1] bg-white"
              style={{ marginLeft: index === 0 ? 0 : -8 }}
            >
              <img src={account.logo} alt="" className="h-6 w-6 object-contain" />
            </div>
          ))}
        </div>

        <p className="text-base leading-6 font-semibold text-[#1c1917]">Sharing your details...</p>

        <div className="h-1.5 w-[172px] rounded-full bg-[#003323]" />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-6 pb-44">
        <div className="h-[108px] w-full rounded-lg bg-[#f5f5f4]" />

        <div className="space-y-2">
          <h2 className="text-[18px] leading-7 font-semibold text-[#1c1917]">
            {accounts.length} Bank accounts found
          </h2>
          <p className="text-sm leading-5 text-[#78716c]">
            We found below bank accounts linked with your phone number xx{mobileLast4}
          </p>
        </div>

        <div className="space-y-2">
          {accounts.map((account) => (
            <button
              key={account.id}
              type="button"
              onClick={() => toggleAccount(account.id)}
              className="flex w-full items-start gap-2 rounded-lg bg-white p-3 text-left shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
            >
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <AccountLogo account={account} />

                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-5 font-medium text-[#091016]">{account.bankName}</p>
                  <p className="text-sm leading-5 text-[#84878a] capitalize">
                    {account.accountType} account &nbsp;•&nbsp; xx{account.maskedNumber}
                  </p>
                </div>
              </div>

              <span
                className={cn(
                  "mt-0.5 flex h-4 w-4 items-center justify-center rounded border",
                  account.isSelected
                    ? "border-[#003323] bg-[#003323]"
                    : "border-[#e7e5e4] bg-[#fafaf9]"
                )}
              >
                {account.isSelected && <Check className="h-3 w-3 text-white" strokeWidth={2.5} />}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-[390px] -translate-x-1/2 border-t border-[#e7e5e4] bg-[#fafaf9] px-4 py-4">
        <button
          type="button"
          className="h-10 w-full rounded-md text-sm font-medium text-[#003323]"
        >
          Don&apos;t share accounts
        </button>

        <Button
          type="button"
          onClick={startOtpSequence}
          disabled={selectedAccounts.length === 0}
          className="mt-2 h-10 w-full text-sm font-semibold"
        >
          verify accounts
        </Button>

        <div className="mt-3 flex items-center justify-center gap-2 text-xs text-[#84878a]">
          <span>Powered by RBI regulated AA</span>
          <img src={ONEMONEY_LOGO} alt="Onemoney" className="h-5 w-[68px] object-contain" />
        </div>
      </div>

      {otpSheetOpen && currentGroup && (
        <>
          <button
            type="button"
            onClick={() => setOtpSheetOpen(false)}
            className="fixed inset-0 z-[60] bg-black/85"
            aria-label="Close verification"
          />

          <div className="fixed inset-0 z-[70] flex flex-col justify-end">
            <button
              type="button"
              onClick={() => setOtpSheetOpen(false)}
              className="mb-4 self-center rounded-full bg-[#78716c] p-2 text-white"
              aria-label="Close"
            >
              <X className="h-6 w-6" strokeWidth={2} />
            </button>

            <div className="w-full max-w-[390px] self-center overflow-hidden rounded-t-2xl bg-[#fafaf9]">
              <div className="flex items-center justify-center gap-3 border-b border-[#d6d3d1] bg-white px-6 py-3">
                <p className="text-sm font-medium text-[#44403c]">
                  {verifiedBeforeCurrent}/{selectedAccounts.length} accounts verified
                </p>
                <div className="h-1.5 w-[72px] rounded-full bg-[#e7e5e4]">
                  <div
                    className="h-1.5 rounded-full bg-[#003323]"
                    style={{
                      width: `${
                        selectedAccounts.length === 0
                          ? 0
                          : (verifiedBeforeCurrent / selectedAccounts.length) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div className="space-y-6 bg-white px-6 py-6">
                <div className="space-y-2">
                  <AccountLogo account={currentGroup.accounts[0]} size={48} />
                  <h3 className="text-[18px] leading-7 font-semibold text-[#1c1917]">{currentGroup.bankName}</h3>

                  <div className="flex flex-wrap gap-2">
                    {currentGroup.accounts.map((account) => (
                      <span
                        key={account.id}
                        className="rounded-md bg-[#e8fbff] px-2 py-0.5 text-xs font-semibold text-[#171717]"
                      >
                        xx{account.maskedNumber}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-[#0a0a0a]">
                    OTP sent to number ending with {otpPhoneLast4}
                  </p>

                  <div className="flex w-full overflow-hidden rounded-lg border border-[#e5e5e5] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                    {otpDigits.map((digit, index) => (
                      <input
                        key={index}
                        ref={(element) => {
                          refs.current[index] = element;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(event) => updateOtpDigit(index, event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Backspace" && !digit && index > 0) {
                            refs.current[index - 1]?.focus();
                          }
                        }}
                        className="h-10 flex-1 border-r border-[#e5e5e5] bg-white text-center text-base text-[#1c1917] outline-none last:border-r-0"
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={retriesLeft === 0}
                      className="text-xs font-medium text-[#003323] disabled:text-[#78716c]/60"
                    >
                      Resend OTP
                    </button>
                    <p className="text-xs text-[#7a7a7a]">{retriesLeft} retries left</p>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={verifyCurrentBank}
                  disabled={otp.length !== 6}
                  className="h-10 w-full text-sm font-medium"
                >
                  Verify OTP
                </Button>

                <div className="flex items-center justify-center gap-2 text-xs text-[#84878a]">
                  <span>Powered by RBI regulated AA</span>
                  <img src={ONEMONEY_LOGO} alt="Onemoney" className="h-5 w-[68px] object-contain" />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { CheckCircle2, FileCheck2 } from "lucide-react";
import { StepProgressBar } from "@/components/loan/shared/StepProgressBar";
import { useLoanStore, SCREENS } from "@/store/loanStore";
import { screenContainer, screenItem, listContainer, listItem } from "@/components/loan/shared/motion";
import { cn } from "@/lib/utils";

type DigiStep = "intro" | "digilocker_entry" | "digilocker_otp" | "digilocker_pin" | "digilocker_consent";

// ─── DigiLocker Header ────────────────────────────────────────────────────────

function DigiLockerHeader() {
  return (
    <div className="flex w-full items-center justify-between bg-white border-b border-[#e7e5e4] px-4 py-2.5">
      {/* MeriPehchaan logo */}
      <div className="flex items-center gap-1.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#4f46e5] text-white text-[8px] font-bold">
          मेरी
        </div>
        <div className="leading-none">
          <p className="text-[8px] font-bold text-[#4f46e5]">MERI</p>
          <p className="text-[7px] text-[#78716c]">PEHCHAAN</p>
        </div>
      </div>

      {/* G20 India badge */}
      <div className="flex items-center gap-0.5">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f97316] text-white text-[7px] font-bold">G20</div>
        <div className="leading-none">
          <p className="text-[7px] text-[#78716c]">INDIA</p>
          <p className="text-[6px] text-[#a8a29e]">2023</p>
        </div>
      </div>

      {/* DigiLocker logo */}
      <div className="flex items-center gap-1">
        <div className="flex h-7 w-7 items-center justify-center rounded bg-[#1a56db] text-white text-[7px] font-bold leading-tight text-center">
          Digi<br/>Lock
        </div>
        <div className="leading-none">
          <p className="text-[8px] font-bold text-[#1a56db]">DigiLocker</p>
          <p className="text-[6px] text-[#78716c]">Govt of India</p>
        </div>
      </div>
    </div>
  );
}

// ─── DigiLocker wrapper ───────────────────────────────────────────────────────

function DigiLockerWrapper({ children, onBack }: { children: React.ReactNode; onBack: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#f0f0f0] overflow-y-auto">
      <DigiLockerHeader />
      <div className="flex flex-1 flex-col items-center px-4 py-6 gap-4">
        {children}
        <button
          type="button"
          onClick={onBack}
          className="mt-2 text-sm text-[#1a56db] underline"
        >
          Return to Chroma
        </button>
      </div>
    </div>
  );
}

// ─── Captcha SVG art ──────────────────────────────────────────────────────────

function CaptchaImage() {
  return (
    <div className="flex h-10 w-full items-center justify-center rounded border border-[#e7e5e4] bg-[#fce7f3] overflow-hidden select-none">
      <svg width="120" height="30" viewBox="0 0 120 30" fill="none">
        <path d="M8 22 C12 10, 18 8, 22 18" stroke="#c026d3" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M28 8 L32 22 M28 15 L36 15" stroke="#9333ea" strokeWidth="2" strokeLinecap="round"/>
        <path d="M40 8 C44 8, 46 10, 46 14 C46 18, 44 20, 40 20 L40 22" stroke="#db2777" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M52 8 L56 22 M52 22 L60 22 M52 8 L60 8" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round"/>
        <path d="M66 15 C66 10, 70 8, 74 8 C78 8, 80 10, 80 14 C80 18, 78 22, 74 22 C70 22, 66 20, 66 15Z" stroke="#be185d" strokeWidth="2"/>
        <path d="M86 8 L90 22 L94 14 L98 22 L102 8" stroke="#6d28d9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M108 8 L112 15 L108 22 M108 15 L116 15" stroke="#a21caf" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    </div>
  );
}

// ─── DigiLocker Card ──────────────────────────────────────────────────────────

function DigiCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-[340px] rounded-xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.12)] overflow-hidden">
      {/* Card title bar */}
      <div className="bg-[#1a56db] px-4 py-2.5">
        <p className="text-sm font-semibold text-white">Chroma</p>
      </div>
      <div className="px-5 py-5 space-y-4">
        {children}
      </div>
    </div>
  );
}

function TextInput({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  return (
    <div className="space-y-1.5">
      {label && <p className="text-xs font-medium text-[#44403c]">{label}</p>}
      <input
        {...props}
        className={cn(
          "w-full h-9 px-3 text-sm bg-white border border-[#d4d4d4] rounded-lg outline-none",
          "focus:border-[#1a56db] focus:ring-1 focus:ring-[#1a56db]/20",
          "placeholder:text-[#a8a29e]",
          props.className
        )}
      />
    </div>
  );
}

function GreenButton({ children, onClick, disabled }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full h-10 rounded-lg bg-[#15803d] text-white text-sm font-semibold disabled:opacity-60"
    >
      {children}
    </button>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function S11_AadhaarKYC() {
  const { data, update, goTo } = useLoanStore();
  const [step, setStep] = useState<DigiStep>("intro");
  const [captchaInput, setCaptchaInput] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [pinInput, setPinInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const mobileLast4 = (data.mobile || "9898989898").slice(-4);

  // ─── Intro ──────────────────────────────────────────────────────────────────

  if (step === "intro") {
    return (
      <>
        <motion.div
          className="flex flex-col gap-6 pb-44"
          variants={screenContainer}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={screenItem} className="h-[108px] w-full rounded-lg bg-[#f5f5f4]" />

          <motion.div variants={screenItem} className="space-y-1">
            <h2 className="text-[18px] leading-7 font-semibold text-[#1c1917]">Aadhaar verification</h2>
            <p className="text-sm leading-5 text-[#78716c]">
              Provide your Aadhaar number and verify it using OTP sent on your registered number
            </p>
          </motion.div>

          <motion.div variants={listContainer} className="space-y-1">
            {[
              "You will be redirected to DigiLocker",
              "Provide your Aadhar number",
              "Verify using OTP & provide 4 digit pin",
            ].map((item) => (
              <motion.div key={item} variants={listItem} className="flex items-center gap-3 rounded-lg px-1 py-2">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-[#10b981]" strokeWidth={2} />
                <p className="text-sm text-[#1c1917]">{item}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Footer */}
        <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-[390px] -translate-x-1/2 bg-white px-4 pb-4 pt-3 border-t border-[#e7e5e4]">
          <div className="flex justify-center mb-3">
            <StepProgressBar currentStep={2} />
          </div>
          <button
            type="button"
            onClick={() => setStep("digilocker_entry")}
            className="w-full h-10 rounded-lg bg-[#003323] text-white text-sm font-medium"
          >
            Verify Aadhaar
          </button>
          <div className="mt-2 flex items-center justify-center gap-1.5">
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#78716c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span className="text-xs text-[#78716c]">100% secure as per RBI</span>
          </div>
        </div>
      </>
    );
  }

  // ─── DigiLocker Entry ────────────────────────────────────────────────────────

  if (step === "digilocker_entry") {
    return (
      <DigiLockerWrapper onBack={() => setStep("intro")}>
        <DigiCard>
          <p className="text-xs text-[#44403c] leading-5">
            You are about to link your DigiLocker account with <strong>Chroma</strong> application of Chroma Technologies Pvt Ltd. You will be signed up for DigiLocker account if it does not exist.
          </p>

          <TextInput
            label="Mobile number"
            value={data.mobile || ""}
            readOnly
            className="bg-[#f9fafb]"
          />

          <div className="space-y-1.5">
            <p className="text-xs font-medium text-[#44403c]">CAPTCHA verification</p>
            <CaptchaImage />
            <TextInput
              placeholder="Enter captcha"
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value)}
            />
          </div>

          <GreenButton onClick={() => { setCaptchaInput(""); setOtpInput(""); setStep("digilocker_otp"); }}>
            Next
          </GreenButton>
        </DigiCard>
      </DigiLockerWrapper>
    );
  }

  // ─── DigiLocker OTP ──────────────────────────────────────────────────────────

  if (step === "digilocker_otp") {
    const handleContinue = async () => {
      setIsLoading(true);
      await new Promise((r) => setTimeout(r, 1200));
      setIsLoading(false);
      setOtpInput("");
      setStep("digilocker_pin");
    };

    return (
      <DigiLockerWrapper onBack={() => setStep("intro")}>
        <DigiCard>
          <p className="text-xs text-[#44403c] leading-5">
            UIDAI has sent a temporary OTP to your mobile ending in <strong>*******{mobileLast4}</strong> (valid for 10 mins).
          </p>

          <TextInput
            label="Enter OTP"
            type="password"
            inputMode="numeric"
            maxLength={6}
            placeholder="••••••"
            value={otpInput}
            onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, "").slice(0, 6))}
          />

          <div className="rounded-lg bg-[#fef9c3] border border-[#fde047] px-3 py-2">
            <p className="text-xs text-[#854d0e]">
              Wait few minutes for the OTP, <strong>do not refresh or close!</strong>
            </p>
          </div>

          <GreenButton onClick={handleContinue} disabled={otpInput.length !== 6 || isLoading}>
            {isLoading ? "Verifying…" : "Continue"}
          </GreenButton>
        </DigiCard>
      </DigiLockerWrapper>
    );
  }

  // ─── DigiLocker PIN ──────────────────────────────────────────────────────────

  if (step === "digilocker_pin") {
    const handleContinue = async () => {
      setIsLoading(true);
      await new Promise((r) => setTimeout(r, 900));
      setIsLoading(false);
      setStep("digilocker_consent");
    };

    return (
      <DigiLockerWrapper onBack={() => setStep("intro")}>
        <DigiCard>
          <p className="text-xs text-[#44403c]">You are already registered with DigiLocker.</p>
          <p className="text-sm font-medium text-[#1c1917]">Please enter your 6 digit DigiLocker Security PIN</p>

          <TextInput
            type="password"
            inputMode="numeric"
            maxLength={6}
            placeholder="••••••"
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value.replace(/\D/g, "").slice(0, 6))}
          />

          <button type="button" className="text-xs text-[#1a56db] text-left">
            Forgot security PIN?
          </button>

          <GreenButton onClick={handleContinue} disabled={pinInput.length !== 6 || isLoading}>
            {isLoading ? "Verifying…" : "Continue"}
          </GreenButton>
        </DigiCard>
      </DigiLockerWrapper>
    );
  }

  // ─── DigiLocker Consent ──────────────────────────────────────────────────────

  const handleAllow = async () => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    update({ aadhaarVerified: true });
    toast.success("Aadhaar verified successfully");
    goTo(SCREENS.FACE_VERIFICATION);
  };

  return (
    <DigiLockerWrapper onBack={() => setStep("intro")}>
      <DigiCard>
        <div className="flex flex-col items-center gap-3 py-2">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#eff6ff]">
            <FileCheck2 className="h-7 w-7 text-[#1a56db]" strokeWidth={1.5} />
          </div>
          <p className="text-center text-sm text-[#44403c] leading-5">
            You are providing your consent to share your Digilocker document with <strong>Chroma</strong>.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAllow}
          disabled={isLoading}
          className="w-full h-10 rounded-lg bg-[#4f46e5] text-white text-sm font-semibold disabled:opacity-60"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Processing…
            </span>
          ) : "Allow"}
        </button>

        <button
          type="button"
          onClick={() => setStep("intro")}
          className="w-full text-sm text-[#78716c] text-center py-1"
        >
          Deny
        </button>
      </DigiCard>
    </DigiLockerWrapper>
  );
}

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLoanStore } from "@/store/loanStore";
import { Label } from "@/components/ui/label";
import { StepProgress } from "@/components/loan/StepProgress";
import { cn } from "@/lib/utils";

// ─── Schemas ──────────────────────────────────────────────────────────────────

const personalSchema = z.object({
  firstName: z.string().min(2, "Enter first name"),
  lastName: z.string().min(2, "Enter last name"),
  dob: z.string().min(1, "Enter date of birth"),
  fathersName: z.string().min(2, "Enter father's name"),
  gender: z.string().min(1, "Select gender"),
  maritalStatus: z.string().min(1, "Select marital status"),
});

const addressSchema = z.object({
  address1: z.string().min(5, "Enter address"),
  city: z.string().min(2, "Enter city"),
  state: z.string().min(2, "Enter state"),
  pincode: z.string().regex(/^\d{6}$/, "Enter 6-digit pincode"),
  employmentType: z.string().min(1, "Select employment type"),
  companyName: z.string().min(2, "Enter company / employer name"),
  monthlyIncome: z.number().min(1000, "Enter valid income"),
});

const contactSchema = z.object({
  mobile: z.string().regex(/^[6-9]\d{9}$/, "Enter valid 10-digit mobile"),
  email: z.string().email("Enter valid email"),
  panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, "Enter valid PAN (e.g. ABCDE1234F)"),
  loanAmount: z.number().min(10000, "Minimum ₹10,000"),
  loanPurpose: z.string().min(1, "Select loan purpose"),
});

type PersonalForm = z.infer<typeof personalSchema>;
type AddressForm = z.infer<typeof addressSchema>;
type ContactForm = z.infer<typeof contactSchema>;

// ─── Step config ──────────────────────────────────────────────────────────────

const STEPS = [
  { label: "Personal details" },
  { label: "Address & employment" },
  { label: "Contact & loan details" },
];

// ─── Primitives ───────────────────────────────────────────────────────────────

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-sm font-medium text-[#0c0a09]">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function TextInput({ error, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { error?: string }) {
  return (
    <input
      {...props}
      className={cn(
        "w-full h-9 px-3 text-sm bg-[#fafaf9] border border-[#e7e5e4] rounded-lg",
        "shadow-[0_1px_1px_rgba(0,0,0,0.02)] outline-none transition-colors",
        "focus:border-[#003323] focus:ring-2 focus:ring-[#003323]/15",
        "placeholder:text-[#a8a29e]",
        error && "border-destructive",
        props.className
      )}
    />
  );
}

function AmountInput({ prefix, error, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { prefix?: string; error?: string }) {
  return (
    <div className="flex">
      {prefix && (
        <span className="h-9 px-3 flex items-center text-sm bg-[#fafaf9] border border-r-0 border-[#e7e5e4] rounded-l-lg text-[#78716c] select-none">
          {prefix}
        </span>
      )}
      <input
        {...props}
        className={cn(
          "flex-1 h-9 px-3 text-sm bg-[#fafaf9] border border-[#e7e5e4]",
          prefix ? "rounded-r-lg" : "rounded-lg",
          "shadow-[0_1px_1px_rgba(0,0,0,0.02)] outline-none transition-colors",
          "focus:border-[#003323] focus:ring-2 focus:ring-[#003323]/15",
          "placeholder:text-[#a8a29e]",
          error && "border-destructive",
          props.className
        )}
      />
    </div>
  );
}

function ChipGroup<T extends string>({
  options, value, onChange, error,
}: { options: T[]; value: T; onChange: (v: T) => void; error?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={cn(
              "flex-1 h-8 rounded-lg border text-xs font-medium transition-all",
              value === opt
                ? "border-[#003323] bg-[#003323]/8 text-[#003323]"
                : "border-[#e5e5e5] bg-white text-[#0c0a09] shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
            )}
          >
            {opt}
          </button>
        ))}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

// ─── Illustration ──────────────────────────────────────────────────────────────

function Illustration() {
  return (
    <div className="w-full h-[108px] rounded-lg bg-[#f5f5f4] flex items-center justify-center overflow-hidden flex-shrink-0">
      <svg width="80" height="60" viewBox="0 0 80 60" fill="none" className="opacity-20">
        <rect x="8" y="12" width="64" height="44" rx="4" stroke="#003323" strokeWidth="2"/>
        <rect x="16" y="20" width="22" height="28" rx="2" fill="#003323"/>
        <rect x="44" y="20" width="20" height="8" rx="2" fill="#003323" fillOpacity="0.4"/>
        <rect x="44" y="32" width="20" height="8" rx="2" fill="#003323" fillOpacity="0.4"/>
        <rect x="44" y="44" width="12" height="4" rx="2" fill="#003323" fillOpacity="0.3"/>
      </svg>
    </div>
  );
}

// ─── Screen Header ─────────────────────────────────────────────────────────────

function ScreenHeader({ step }: { step: number }) {
  return (
    <div className="flex flex-col gap-4">
      <Illustration />
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-[#1c1917]">Check eligibility</h2>
          <p className="text-sm text-[#78716c]">Provide your basic details to check your eligibility</p>
        </div>
        <StepProgress steps={STEPS} currentStep={step} />
      </div>
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer({
  onBack, onNext, nextLabel = "Next", nextType = "submit", isLoading,
}: {
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  nextType?: "submit" | "button";
  isLoading?: boolean;
}) {
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] bg-[#fafaf9] px-4 py-3 space-y-2 z-10">
      <div className="flex gap-3 items-center">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 rounded-lg bg-[#e8fbff] flex items-center justify-center flex-shrink-0 shadow-sm"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <path d="M15 18l-6-6 6-6" stroke="#0293a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
        <button
          type={nextType}
          onClick={nextType === "button" ? onNext : undefined}
          disabled={isLoading}
          className="flex-1 h-10 rounded-lg bg-[#003323] text-white text-sm font-medium shadow-sm disabled:opacity-60"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Please wait…
            </span>
          ) : nextLabel}
        </button>
      </div>
      <div className="flex items-center justify-center gap-1.5">
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#78716c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="text-xs text-[#222]">No impact on your credit score</span>
      </div>
    </div>
  );
}

// ─── Sub-step 1: Personal ──────────────────────────────────────────────────────

function SubStep1Personal({ onNext }: { onNext: (data: PersonalForm) => void }) {
  const { data } = useLoanStore();
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<PersonalForm>({
    resolver: zodResolver(personalSchema),
    defaultValues: {
      firstName: data.firstName,
      lastName: data.lastName,
      dob: data.dob,
      fathersName: data.fathersName,
      gender: data.gender,
      maritalStatus: data.maritalStatus,
    },
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="flex flex-col gap-5 pb-32">
      <ScreenHeader step={1} />

      <Field label="First name (as per PAN)" error={errors.firstName?.message}>
        <TextInput placeholder="Tirth" {...register("firstName")} />
      </Field>

      <Field label="Last name (as per PAN)" error={errors.lastName?.message}>
        <TextInput placeholder="Trivedi" {...register("lastName")} />
      </Field>

      <Field label="Date of birth" error={errors.dob?.message}>
        <TextInput type="date" max={new Date().toISOString().split("T")[0]} {...register("dob")} />
      </Field>

      <Field label="Father's name" error={errors.fathersName?.message}>
        <TextInput placeholder="Bhavesh Trivedi" {...register("fathersName")} />
      </Field>

      <Field label="Gender" error={errors.gender?.message}>
        <ChipGroup
          options={["Male", "Female", "Other"] as const}
          value={watch("gender") as "Male" | "Female" | "Other"}
          onChange={(v) => setValue("gender", v, { shouldValidate: true })}
        />
      </Field>

      <Field label="Marital status" error={errors.maritalStatus?.message}>
        <ChipGroup
          options={["Married", "Single"] as const}
          value={watch("maritalStatus") as "Married" | "Single"}
          onChange={(v) => setValue("maritalStatus", v, { shouldValidate: true })}
        />
      </Field>

      <Footer nextType="submit" />
    </form>
  );
}

// ─── Sub-step 2: Address & Employment ─────────────────────────────────────────

function SubStep2Address({ onNext, onBack }: { onNext: (data: AddressForm) => void; onBack: () => void }) {
  const { data } = useLoanStore();
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<AddressForm>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      address1: data.address1,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
      employmentType: data.employmentType,
      companyName: data.companyName,
      monthlyIncome: data.monthlyIncome || undefined,
    },
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="flex flex-col gap-5 pb-32">
      <ScreenHeader step={2} />

      <Field label="Address line 1" error={errors.address1?.message}>
        <TextInput placeholder="C1002, SP Nirvana, Ghuma extension" {...register("address1")} />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="City" error={errors.city?.message}>
          <TextInput placeholder="Ahmedabad" {...register("city")} />
        </Field>
        <Field label="State" error={errors.state?.message}>
          <TextInput placeholder="Gujarat" {...register("state")} />
        </Field>
      </div>

      <Field label="Pincode" error={errors.pincode?.message}>
        <TextInput placeholder="380058" inputMode="numeric" maxLength={6} {...register("pincode")} />
      </Field>

      <Field label="Employment type" error={errors.employmentType?.message}>
        <ChipGroup
          options={["Salaried", "Self-Employed", "Business"] as const}
          value={watch("employmentType") as "Salaried" | "Self-Employed" | "Business"}
          onChange={(v) => setValue("employmentType", v, { shouldValidate: true })}
        />
      </Field>

      <Field label="Company / Employer name" error={errors.companyName?.message}>
        <TextInput placeholder="Infosys Ltd." {...register("companyName")} />
      </Field>

      <Field label="Monthly income (take-home)" error={errors.monthlyIncome?.message}>
        <AmountInput
          prefix="₹"
          placeholder="50,000"
          inputMode="numeric"
          {...register("monthlyIncome", { valueAsNumber: true })}
        />
      </Field>

      <Footer onBack={onBack} nextType="submit" />
    </form>
  );
}

// ─── Sub-step 3: Contact & Loan Details ───────────────────────────────────────

const LOAN_PURPOSES = ["Personal", "Travel", "Medical", "Education", "Home", "Other"] as const;

function SubStep3Contact({ onNext, onBack }: { onNext: (data: ContactForm) => void; onBack: () => void }) {
  const { data } = useLoanStore();
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      mobile: data.mobile,
      email: data.email,
      panNumber: data.panNumber,
      loanAmount: data.loanAmount || undefined,
      loanPurpose: data.loanPurpose,
    },
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="flex flex-col gap-5 pb-36">
      <ScreenHeader step={3} />

      <Field label="Contact number" error={errors.mobile?.message}>
        <div className="flex">
          <span className="h-9 px-3 flex items-center text-sm bg-[#fafaf9] border border-r-0 border-[#e7e5e4] rounded-l-lg text-[#78716c] select-none">
            +91
          </span>
          <TextInput
            placeholder="78787 78787"
            inputMode="numeric"
            maxLength={10}
            className="rounded-l-none"
            {...register("mobile")}
          />
        </div>
      </Field>

      <Field label="Email ID" error={errors.email?.message}>
        <TextInput placeholder="yourname@gmail.com" type="email" inputMode="email" {...register("email")} />
      </Field>

      <Field label="PAN" error={errors.panNumber?.message}>
        <TextInput
          placeholder="ABCDE1234F"
          maxLength={10}
          autoCapitalize="characters"
          className="font-mono tracking-widest uppercase"
          {...register("panNumber", { onChange: (e) => (e.target.value = e.target.value.toUpperCase()) })}
        />
      </Field>

      <Field label="Loan amount required" error={errors.loanAmount?.message}>
        <AmountInput
          prefix="₹"
          placeholder="2,00,000"
          inputMode="numeric"
          {...register("loanAmount", { valueAsNumber: true })}
        />
      </Field>

      <Field label="Loan purpose" error={errors.loanPurpose?.message}>
        <div className="grid grid-cols-3 gap-2">
          {LOAN_PURPOSES.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setValue("loanPurpose", p, { shouldValidate: true })}
              className={cn(
                "h-9 rounded-lg border text-xs font-medium transition-all",
                watch("loanPurpose") === p
                  ? "border-[#003323] bg-[#003323]/8 text-[#003323]"
                  : "border-[#e5e5e5] bg-white text-[#0c0a09] shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
              )}
            >
              {p}
            </button>
          ))}
        </div>
        {errors.loanPurpose && <p className="text-xs text-destructive">{errors.loanPurpose.message}</p>}
      </Field>

      {/* Consent */}
      <p className="text-xs text-[#78716c] leading-relaxed">
        By continuing, I am providing consent to do a credit score pull from CRIF / EXPERINE
      </p>

      <Footer onBack={onBack} nextLabel="Check eligibility" nextType="submit" />
    </form>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export function S1_ConfirmDetails() {
  const { update, next } = useLoanStore();
  const [subStep, setSubStep] = useState(1);

  const handlePersonal = (data: PersonalForm) => {
    update(data);
    setSubStep(2);
  };

  const handleAddress = (data: AddressForm) => {
    update(data);
    setSubStep(3);
  };

  const handleContact = (data: ContactForm) => {
    update(data);
    next();
  };

  return (
    <>
      {subStep === 1 && <SubStep1Personal onNext={handlePersonal} />}
      {subStep === 2 && <SubStep2Address onNext={handleAddress} onBack={() => setSubStep(1)} />}
      {subStep === 3 && <SubStep3Contact onNext={handleContact} onBack={() => setSubStep(2)} />}
    </>
  );
}

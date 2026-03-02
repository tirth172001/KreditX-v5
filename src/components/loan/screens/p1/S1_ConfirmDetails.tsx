"use client";

import { useForm, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useLoanStore } from "@/store/loanStore";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
  firstName: z.string().min(2, "Enter first name"),
  lastName: z.string().min(2, "Enter last name"),
  panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, "Enter valid PAN (e.g. ABCDE1234F)"),
  mobile: z.string().regex(/^[6-9]\d{9}$/, "Enter valid 10-digit mobile"),
  email: z.string().email("Enter valid email"),
  address1: z.string().min(5, "Enter address"),
  city: z.string().min(2, "Enter city"),
  state: z.string().min(2, "Enter state"),
  pincode: z.string().regex(/^\d{6}$/, "Enter 6-digit pincode"),
  monthlyIncome: z.string().min(1, "Enter salary"),
  companyName: z.string().min(2, "Enter company name"),
  gender: z.string().min(1, "Select gender"),
  maritalStatus: z.string().min(1, "Select marital status"),
});

type FormData = z.infer<typeof schema>;

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
        "w-full h-10 px-3 text-sm bg-white border border-[#e5e5e5] rounded-lg",
        "shadow-[0_1px_2px_rgba(0,0,0,0.05)] outline-none transition-colors",
        "focus:border-[#003323] focus:ring-2 focus:ring-[#003323]/15",
        "placeholder:text-[#a8a29e]",
        error && "border-destructive",
        props.className
      )}
    />
  );
}

function ChipGroup({ options, value, onChange, error }: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
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

function SectionGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-medium text-[#78716c] uppercase tracking-wide">{label}</p>
      <div className="bg-white rounded-xl p-4 flex flex-col gap-4 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
        {children}
      </div>
    </div>
  );
}

function Illustration() {
  return (
    <div className="w-full h-[108px] rounded-lg bg-[#f5f5f4] flex items-center justify-center overflow-hidden shrink-0">
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

// ─── Main component ────────────────────────────────────────────────────────────

export function S1_ConfirmDetails() {
  const { data, update, next } = useLoanStore();

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      panNumber: data.panNumber || "",
      mobile: data.mobile || "",
      email: data.email || "",
      address1: data.address1 || "",
      city: data.city || "",
      state: data.state || "",
      pincode: data.pincode || "",
      monthlyIncome: data.monthlyIncome ? String(data.monthlyIncome) : "",
      companyName: data.companyName || "",
      gender: data.gender || "",
      maritalStatus: data.maritalStatus || "",
    },
  });

  const onError = (errs: FieldErrors<FormData>) => {
    const first = Object.values(errs)[0];
    if (first?.message) toast.error(first.message as string);
  };

  const onSubmit = (formData: FormData) => {
    update({
      firstName: formData.firstName,
      lastName: formData.lastName,
      panNumber: formData.panNumber,
      mobile: formData.mobile,
      email: formData.email,
      address1: formData.address1,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
      monthlyIncome: Number(formData.monthlyIncome.replace(/,/g, "")),
      companyName: formData.companyName,
      gender: formData.gender,
      maritalStatus: formData.maritalStatus,
    });
    next();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className="flex flex-col gap-6 pb-36">
      <Illustration />

      <div className="flex flex-col gap-1">
        <h2 className="text-[18px] leading-7 font-semibold text-[#1c1917]">Check eligibility</h2>
        <p className="text-sm text-[#78716c]">Provide your basic details to check your eligibility</p>
      </div>

      {/* Personal details */}
      <SectionGroup label="Personal details">
        <Field label="First name (as per PAN)" error={errors.firstName?.message}>
          <TextInput placeholder="Tirth" {...register("firstName")} />
        </Field>

        <Field label="Last name (as per PAN)" error={errors.lastName?.message}>
          <TextInput placeholder="Trivedi" {...register("lastName")} />
        </Field>

        <Field label="PAN" error={errors.panNumber?.message}>
          <TextInput
            placeholder="ABCDE1234F"
            maxLength={10}
            autoCapitalize="characters"
            className="font-mono tracking-widest uppercase"
            {...register("panNumber", { onChange: (e) => { e.target.value = e.target.value.toUpperCase(); } })}
          />
        </Field>

        <Field label="Phone number" error={errors.mobile?.message}>
          <TextInput placeholder="98989 98989" inputMode="numeric" maxLength={10} {...register("mobile")} />
        </Field>

        <Field label="Email" error={errors.email?.message}>
          <TextInput placeholder="yourname@gmail.com" type="email" inputMode="email" {...register("email")} />
        </Field>
      </SectionGroup>

      {/* Current address details */}
      <SectionGroup label="Current address details">
        <Field label="Address line 1" error={errors.address1?.message}>
          <TextInput placeholder="C1002, SP nirvana, Ghuma extension" {...register("address1")} />
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
      </SectionGroup>

      {/* Other details */}
      <SectionGroup label="Other details">
        <Field label="Self declared salary (INR)" error={errors.monthlyIncome?.message}>
          <TextInput placeholder="1,00,000" inputMode="numeric" {...register("monthlyIncome")} />
        </Field>

        <Field label="Company name" error={errors.companyName?.message}>
          <TextInput placeholder="Setu" {...register("companyName")} />
        </Field>

        <Field label="Gender" error={errors.gender?.message}>
          <ChipGroup
            options={["Male", "Female", "Other"]}
            value={watch("gender")}
            onChange={(v) => setValue("gender", v, { shouldValidate: true })}
          />
        </Field>

        <Field label="Marital status" error={errors.maritalStatus?.message}>
          <ChipGroup
            options={["Married", "Single"]}
            value={watch("maritalStatus")}
            onChange={(v) => setValue("maritalStatus", v, { shouldValidate: true })}
          />
        </Field>
      </SectionGroup>

      {/* Footer */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] bg-white px-4 py-3 space-y-2 z-10 border-t border-[#e7e5e4] shadow-[0_-1px_3px_rgba(0,0,0,0.06)]">
        <button
          type="submit"
          className="w-full h-10 rounded-lg bg-[#003323] text-white text-sm font-medium shadow-sm"
        >
          Check eligibility
        </button>
        <div className="flex items-center justify-center gap-1.5">
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#78716c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-xs text-[#444]">No impact on your credit score</span>
        </div>
      </div>
    </form>
  );
}

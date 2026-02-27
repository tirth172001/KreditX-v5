# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server at localhost:3000
npm run build      # Production build (runs TypeScript check)
npm run lint       # ESLint
```

## Architecture

This is a **Next.js 14 App Router** project for a mobile-first loan application journey targeting Indian customers.

### Multi-Step Flow
The loan journey is a 5-step form (+ success screen) managed entirely client-side:

1. **Eligibility** — mobile, pincode, monthly income
2. **Personal Details** — name, DOB, gender, PAN, email
3. **Employment** — type, company, designation, experience
4. **Loan Details** — amount (slider), tenure (pills), purpose
5. **Review & Submit** — summary + consent + fake API call
6. **Success** — confirmation screen

### State Management
All form state persists across steps via **Zustand** with `localStorage` persistence (`zustand/middleware/persist`). The store is at `src/store/loanStore.ts` and holds:
- `currentStep` — controls which step renders
- `formData` — accumulated inputs from all steps
- `nextStep / prevStep / updateFormData / reset` — mutation actions

### Key Files
- `src/store/loanStore.ts` — single source of truth for journey state and step count
- `src/lib/validations.ts` — Zod schemas for each step (one schema per step)
- `src/components/loan/LoanJourney.tsx` — root component; renders the step switcher with Framer Motion slide transitions
- `src/components/loan/steps/Step*.tsx` — each step is self-contained with its own `react-hook-form` instance
- `src/components/loan/StepIndicator.tsx` — progress bar + dot indicators

### Conventions
- Each step form submits via `handleSubmit → updateFormData → nextStep`
- Validation schemas in `validations.ts` are the single source for field rules — do not duplicate validation logic in components
- India-specific inputs use `inputMode="numeric"` and appropriate `maxLength` for mobile keyboards
- EMI calculation uses standard reducing-balance formula at 12% p.a. (placeholder rate)
- shadcn/ui components live in `src/components/ui/` — add new ones via `npx shadcn@latest add <component>`

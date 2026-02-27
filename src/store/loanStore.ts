import { create } from "zustand";
import { persist } from "zustand/middleware";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface MerchantContext {
  name: string;
  productName: string;
  productAmount: number;
  logoInitial: string;
}

export interface LenderOffer {
  id: string;
  name: string;
  logoInitial: string;
  color: string;
  minRate: number;
  maxRate: number;
  processingFee: number;
  isEligible: boolean;
  ineligibleReason?: string;
  isSelected: boolean;
}

export interface FinalOffer {
  id: string;
  name: string;
  logoInitial: string;
  color: string;
  rate: number;
  processingFee: number;
  totalPayable: number;
}

export interface BankAccount {
  id: string;
  bankName: string;
  bankLogoInitial: string;
  bankColor: string;
  accountType: "savings" | "current";
  maskedNumber: string;
  isSelected: boolean;
  otpVerified: boolean;
}

export interface LoanData {
  // Merchant context (kept for backward compat with other screens)
  merchant: MerchantContext;

  // Phase 1 — Personal details
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  maritalStatus: string;
  fathersName: string;

  // Phase 1 — Address & Employment
  address1: string;
  city: string;
  state: string;
  pincode: string;
  employmentType: string;
  companyName: string;
  monthlyIncome: number;

  // Phase 1 — Contact & Loan ask
  mobile: string;
  email: string;
  panNumber: string;
  loanAmount: number;
  loanPurpose: string;

  // Phase 2 — Lenders
  eligibleLenders: LenderOffer[];
  creditScore: number;

  // Phase 3 — Account Aggregator
  selectedBanks: string[];
  discoveredAccounts: BankAccount[];

  // Phase 4 — Indicative Offers (offers with ranges)
  indicativeLoanAmount: number;

  // Phase 5 — KYC
  aadhaarNumber: string;
  aadhaarVerified: boolean;
  faceVerified: boolean;

  // Phase 6 — Final Offer Selection
  finalOffers: FinalOffer[];
  selectedOfferId: string;
  selectedTenure: number;
  finalLoanAmount: number;
  finalEMI: number;

  // Phase 7 — Autopay
  autopayMethod: string;
  autopayApp: string;
  autopayBank: string;
  mandateSetup: boolean;

  // Phase 8 — Agreement
  agreementOtpSent: boolean;
  agreementSigned: boolean;

  // Phase 9 — Transfer
  transferOtpSent: boolean;
  transferProcessing: boolean;
  transferCompleted: boolean;
}

// ─── Phase Map ────────────────────────────────────────────────────────────────

export const PHASES = [
  { id: 1, label: "Eligibility", screens: [1, 2, 3] },
  { id: 2, label: "Lenders", screens: [4] },
  { id: 3, label: "Bank", screens: [5, 6, 7, 8, 9] },
  { id: 4, label: "Offers", screens: [10] },
  { id: 5, label: "KYC", screens: [11, 12] },
  { id: 6, label: "Select", screens: [13, 14] },
  { id: 7, label: "Autopay", screens: [15, 16, 17] },
  { id: 8, label: "Sign", screens: [18, 19] },
  { id: 9, label: "Done", screens: [20] },
];

export const TOTAL_SCREENS = 20;

export function getPhaseForScreen(screen: number) {
  return PHASES.find((p) => p.screens.includes(screen)) ?? PHASES[0];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_MERCHANT: MerchantContext = {
  name: "Croma",
  productName: "Samsung Galaxy Book4 Pro",
  productAmount: 112990,
  logoInitial: "C",
};

const MOCK_LENDERS: LenderOffer[] = [
  { id: "hdfc", name: "HDFC Bank", logoInitial: "H", color: "#004C8F", minRate: 10.5, maxRate: 12.0, processingFee: 999, isEligible: true, isSelected: true },
  { id: "axis", name: "Axis Bank", logoInitial: "A", color: "#800020", minRate: 11.0, maxRate: 13.5, processingFee: 1199, isEligible: true, isSelected: true },
  { id: "ab", name: "Aditya Birla", logoInitial: "AB", color: "#E03B2C", minRate: 12.0, maxRate: 14.0, processingFee: 799, isEligible: true, isSelected: true },
  { id: "icici", name: "ICICI Bank", logoInitial: "IC", color: "#F58220", minRate: 11.5, maxRate: 13.0, processingFee: 1099, isEligible: true, isSelected: true },
  { id: "kotak", name: "Kotak Mahindra", logoInitial: "K", color: "#ED1C24", minRate: 10.99, maxRate: 12.5, processingFee: 999, isEligible: true, isSelected: true },
  { id: "sbi", name: "SBI", logoInitial: "SB", color: "#21409A", minRate: 11.0, maxRate: 14.0, processingFee: 0, isEligible: false, ineligibleReason: "Requires 750+ CIBIL", isSelected: false },
  { id: "bajaj", name: "Bajaj Finance", logoInitial: "BF", color: "#006DB7", minRate: 13.0, maxRate: 16.0, processingFee: 1499, isEligible: false, ineligibleReason: "Minimum income ₹35,000", isSelected: false },
];

const MOCK_ACCOUNTS: BankAccount[] = [
  { id: "hdfc-1", bankName: "HDFC Bank", bankLogoInitial: "H", bankColor: "#004C8F", accountType: "savings", maskedNumber: "4521", isSelected: true, otpVerified: false },
  { id: "icici-1", bankName: "ICICI Bank", bankLogoInitial: "IC", bankColor: "#F58220", accountType: "savings", maskedNumber: "7834", isSelected: true, otpVerified: false },
  { id: "axis-1", bankName: "Axis Bank", bankLogoInitial: "A", bankColor: "#800020", accountType: "current", maskedNumber: "2290", isSelected: false, otpVerified: false },
];

const MOCK_FINAL_OFFERS: FinalOffer[] = [
  { id: "hdfc", name: "HDFC Bank", logoInitial: "H", color: "#004C8F", rate: 10.75, processingFee: 999, totalPayable: 0 },
  { id: "axis", name: "Axis Bank", logoInitial: "A", color: "#800020", rate: 11.25, processingFee: 1199, totalPayable: 0 },
  { id: "ab", name: "Aditya Birla", logoInitial: "AB", color: "#E03B2C", rate: 12.5, processingFee: 799, totalPayable: 0 },
  { id: "kotak", name: "Kotak Mahindra", logoInitial: "K", color: "#ED1C24", rate: 11.0, processingFee: 999, totalPayable: 0 },
];

// ─── Default State ────────────────────────────────────────────────────────────

const defaultData: LoanData = {
  merchant: MOCK_MERCHANT,
  firstName: "",
  lastName: "",
  dob: "",
  gender: "",
  maritalStatus: "",
  fathersName: "",
  address1: "",
  city: "",
  state: "",
  pincode: "",
  employmentType: "",
  companyName: "",
  monthlyIncome: 0,
  mobile: "",
  email: "",
  panNumber: "",
  loanAmount: 0,
  loanPurpose: "",
  eligibleLenders: MOCK_LENDERS,
  creditScore: 742,
  selectedBanks: [],
  discoveredAccounts: MOCK_ACCOUNTS,
  indicativeLoanAmount: 112990,
  aadhaarNumber: "",
  aadhaarVerified: false,
  faceVerified: false,
  finalOffers: MOCK_FINAL_OFFERS,
  selectedOfferId: "",
  selectedTenure: 24,
  finalLoanAmount: 112990,
  finalEMI: 0,
  autopayMethod: "",
  autopayApp: "",
  autopayBank: "",
  mandateSetup: false,
  agreementOtpSent: false,
  agreementSigned: false,
  transferOtpSent: false,
  transferProcessing: false,
  transferCompleted: false,
};

// ─── Store ────────────────────────────────────────────────────────────────────

interface LoanStore {
  currentScreen: number;
  data: LoanData;
  goTo: (screen: number) => void;
  next: () => void;
  back: () => void;
  update: (patch: Partial<LoanData>) => void;
  reset: () => void;
}

export const useLoanStore = create<LoanStore>()(
  persist(
    (set) => ({
      currentScreen: 1,
      data: defaultData,
      goTo: (screen) => set({ currentScreen: screen }),
      next: () => set((s) => ({ currentScreen: Math.min(s.currentScreen + 1, TOTAL_SCREENS) })),
      back: () => set((s) => ({ currentScreen: Math.max(s.currentScreen - 1, 1) })),
      update: (patch) => set((s) => ({ data: { ...s.data, ...patch } })),
      reset: () => set({ currentScreen: 1, data: defaultData }),
    }),
    { name: "loan-journey-v5" }
  )
);

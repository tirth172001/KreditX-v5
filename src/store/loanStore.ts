import { create } from "zustand";
import { persist } from "zustand/middleware";

// ─── Types ───────────────────────────────────────────────────────────────────

export type MerchantStripMode = "close" | "none" | "placeholder" | "menu-close";

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
  maxAmount?: number;
  minTenure?: number;
  maxTenure?: number;
}

export interface FinalOffer {
  id: string;
  name: string;
  logoInitial: string;
  color: string;
  rate: number;
  maxRate?: number;
  maxAmount: number;
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
  merchant: MerchantContext;

  // Eligibility form
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  maritalStatus: string;
  fathersName: string;
  address1: string;
  city: string;
  state: string;
  pincode: string;
  employmentType: string;
  companyName: string;
  monthlyIncome: number;
  mobile: string;
  email: string;
  panNumber: string;
  loanAmount: number;
  loanPurpose: string;

  // Lenders
  eligibleLenders: LenderOffer[];
  creditScore: number;

  // Account Aggregator
  selectedBanks: string[];
  discoveredAccounts: BankAccount[];

  // KYC
  aadhaarNumber: string;
  aadhaarVerified: boolean;
  faceVerified: boolean;

  // Lender chosen at tentative offer step
  selectedLenderId: string;

  // Final Offer Selection
  finalOffers: FinalOffer[];
  selectedOfferId: string;
  selectedTenure: number;
  finalLoanAmount: number;
  finalEMI: number;

  // Bank account for repayment
  repaymentBankAccount: string;
  repaymentBankMasked: string;
  repaymentAccountNumber: string;
  repaymentIFSC: string;
  bankVerified: boolean;

  // Autopay
  autopayMethod: string;
  autopayApp: string;
  autopayBank: string;
  mandateSetup: boolean;

  // Transfer
  transferOtpSent: boolean;
  transferProcessing: boolean;
  transferCompleted: boolean;
}

// ─── Screen Constants ─────────────────────────────────────────────────────────

export const SCREENS = {
  CONFIRM_DETAILS: 1,
  ELIGIBILITY_LOADER: 2,
  ELIGIBILITY_RESULT: 3,
  // 4 removed (was LENDER_SELECTION)
  AA_INTRO: 5,
  BANK_SELECTION: 6,
  AA_OTP: 7,
  ACCOUNTS_FOUND: 8,
  PER_BANK_OTP: 9,
  FINAL_OFFERS: 10,
  AADHAAR_KYC: 11,
  FACE_VERIFICATION: 12,
  // 13 skipped
  LENDER_DETAIL: 14,
  SETUP_AUTOREPAYMENT: 15,
  SELECT_AUTOPAY: 16,
  // 17, 18, 19 removed
  TRANSFER_AMOUNT: 20,
} as const;

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_MERCHANT: MerchantContext = {
  name: "Croma",
  productName: "Samsung Galaxy Book4 Pro",
  productAmount: 112990,
  logoInitial: "C",
};

const MOCK_LENDERS: LenderOffer[] = [
  { id: "ab", name: "Aditya Birla Capital", logoInitial: "AB", color: "#E03B2C", minRate: 11.5, maxRate: 11.5, processingFee: 900, isEligible: true, isSelected: false, maxAmount: 400000, minTenure: 12, maxTenure: 36 },
  { id: "axis", name: "Axis Bank", logoInitial: "A", color: "#800020", minRate: 11.5, maxRate: 13, processingFee: 1199, isEligible: true, isSelected: false, maxAmount: 400000, minTenure: 12, maxTenure: 48 },
  { id: "canara", name: "Canara Bank", logoInitial: "CB", color: "#0ea5e9", minRate: 11.5, maxRate: 13, processingFee: 999, isEligible: true, isSelected: false, maxAmount: 300000, minTenure: 12, maxTenure: 36 },
  { id: "hdfc", name: "HDFC Bank", logoInitial: "H", color: "#004C8F", minRate: 11.5, maxRate: 13, processingFee: 999, isEligible: true, isSelected: false, maxAmount: 300000, minTenure: 12, maxTenure: 48 },
  { id: "idfc", name: "IDFC Bank", logoInitial: "IF", color: "#B91C1C", minRate: 11.5, maxRate: 13, processingFee: 799, isEligible: true, isSelected: false, maxAmount: 300000, minTenure: 6, maxTenure: 24 },
  { id: "sbi", name: "SBI", logoInitial: "SB", color: "#21409A", minRate: 11.0, maxRate: 14.0, processingFee: 0, isEligible: false, ineligibleReason: "Requires 750+ CIBIL", isSelected: false },
  { id: "icici", name: "ICICI Bank", logoInitial: "IC", color: "#F58220", minRate: 11.5, maxRate: 13.0, processingFee: 1099, isEligible: false, ineligibleReason: "Minimum income ₹35,000", isSelected: false },
];

const MOCK_ACCOUNTS: BankAccount[] = [
  { id: "canara-1", bankName: "Canara Bank", bankLogoInitial: "CB", bankColor: "#0ea5e9", accountType: "savings", maskedNumber: "8234", isSelected: true, otpVerified: false },
  { id: "hdfc-1", bankName: "HDFC Bank", bankLogoInitial: "H", bankColor: "#004C8F", accountType: "savings", maskedNumber: "4521", isSelected: true, otpVerified: false },
];

const MOCK_FINAL_OFFERS: FinalOffer[] = [
  { id: "ab", name: "Aditya Birla Capital", logoInitial: "AB", color: "#E03B2C", rate: 11.5, maxRate: 11.5, maxAmount: 400000, processingFee: 900, totalPayable: 0 },
  { id: "canara", name: "Canara Bank", logoInitial: "CB", color: "#0ea5e9", rate: 11.5, maxRate: 13, maxAmount: 300000, processingFee: 999, totalPayable: 0 },
  { id: "hdfc", name: "HDFC Bank", logoInitial: "H", color: "#004C8F", rate: 11.5, maxRate: 13, maxAmount: 300000, processingFee: 999, totalPayable: 0 },
  { id: "idfc", name: "IDFC Bank", logoInitial: "IF", color: "#B91C1C", rate: 11.5, maxRate: 13, maxAmount: 300000, processingFee: 799, totalPayable: 0 },
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
  selectedLenderId: "",
  selectedBanks: [],
  discoveredAccounts: MOCK_ACCOUNTS,
  aadhaarNumber: "",
  aadhaarVerified: false,
  faceVerified: false,
  finalOffers: MOCK_FINAL_OFFERS,
  selectedOfferId: "",
  selectedTenure: 9,
  finalLoanAmount: 500000,
  finalEMI: 0,
  repaymentBankAccount: "Canara Bank",
  repaymentBankMasked: "8234",
  repaymentAccountNumber: "CAN001234",
  repaymentIFSC: "CNRB0001234",
  bankVerified: false,
  autopayMethod: "",
  autopayApp: "",
  autopayBank: "",
  mandateSetup: false,
  transferOtpSent: false,
  transferProcessing: false,
  transferCompleted: false,
};

// ─── Store ────────────────────────────────────────────────────────────────────

interface LoanStore {
  currentScreen: number;
  data: LoanData;
  merchantStripMode: MerchantStripMode | null;
  goTo: (screen: number) => void;
  next: () => void;
  back: () => void;
  update: (patch: Partial<LoanData>) => void;
  reset: () => void;
  setMerchantStripMode: (mode: MerchantStripMode | null) => void;
}

export const useLoanStore = create<LoanStore>()(
  persist(
    (set) => ({
      currentScreen: 1,
      data: defaultData,
      merchantStripMode: null,
      goTo: (screen) => set({ currentScreen: screen }),
      next: () => set((s) => ({ currentScreen: s.currentScreen + 1 })),
      back: () => set((s) => ({ currentScreen: Math.max(s.currentScreen - 1, 1) })),
      update: (patch) => set((s) => ({ data: { ...s.data, ...patch } })),
      reset: () => set({ currentScreen: 1, data: defaultData }),
      setMerchantStripMode: (mode) => set({ merchantStripMode: mode }),
    }),
    { name: "loan-journey-v11" }
  )
);

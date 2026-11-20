import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Calculator,
  Check,
  CheckCircle2,
  ChevronDown,
  Download,
  Globe,
  HelpCircle,
  Info,
  Percent,
  RotateCcw,
  Search,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  XCircle,
} from "lucide-react";

export type CalculatorSuiteTab = "corporate-tax" | "vat";
export type CorporateJurisdiction = "mainland" | "freezone";
export type EntityProfileType = "mainland-llc" | "freezone" | "sole-establishment";
export type VatMode = "add" | "extract";
export type VatRecoveryType = "reclaimable" | "blocked" | "zero-rated";

export interface VatExpenseCategory {
  id: string;
  label: string;
  treatmentLabel: string;
  vatRate: number;
  recovery: VatRecoveryType;
}

export const VAT_EXPENSE_CATEGORIES: VatExpenseCategory[] = [
  {
    id: "advertising",
    label: "Advertising / Marketing",
    treatmentLabel: "Reclaimable (5% Standard)",
    vatRate: 0.05,
    recovery: "reclaimable",
  },
  {
    id: "office-rent",
    label: "Office Rent / Ejari Commercial",
    treatmentLabel: "Reclaimable (5% Standard)",
    vatRate: 0.05,
    recovery: "reclaimable",
  },
  {
    id: "software-saas",
    label: "Software / SaaS / Cloud Subscriptions",
    treatmentLabel: "Reclaimable (5% Reverse Charge / Standard)",
    vatRate: 0.05,
    recovery: "reclaimable",
  },
  {
    id: "legal-accounting",
    label: "Legal, Accounting & Consultancy Fees",
    treatmentLabel: "Reclaimable (5% Standard)",
    vatRate: 0.05,
    recovery: "reclaimable",
  },
  {
    id: "client-entertainment",
    label: "Client Entertainment & Hospitality",
    treatmentLabel: "Blocked (0% Reclaimable under UAE VAT Law)",
    vatRate: 0.05,
    recovery: "blocked",
  },
  {
    id: "staff-medical",
    label: "Staff Medical Insurance (Mandatory by Law)",
    treatmentLabel: "Reclaimable (5% Standard)",
    vatRate: 0.05,
    recovery: "reclaimable",
  },
  {
    id: "motor-vehicle",
    label: "Motor Vehicle (Personal / Mixed Use)",
    treatmentLabel: "Blocked (0% Reclaimable)",
    vatRate: 0.05,
    recovery: "blocked",
  },
  {
    id: "commercial-flights",
    label: "Commercial Flight Tickets / International Travel",
    treatmentLabel: "Zero-Rated (0% VAT)",
    vatRate: 0,
    recovery: "zero-rated",
  },
];

interface UaeTaxCalculatorSuiteProps {
  defaultTab?: CalculatorSuiteTab;
  onNavigate: (path: string) => void;
  onResultViewed?: (result: { liability: number; sbr: boolean; netProfit: number }) => void;
  onCtaClicked?: (ctaType: string) => void;
  onWhatsAppClicked?: () => void;
}

const STEP_LABELS = [
  "Entity & Jurisdiction",
  "Annual Revenue",
  "Profit & Tax Status",
  "Tax Summary",
] as const;

const REVENUE_PRESETS = [
  { label: "Under AED 3M", value: "2,400,000", min: 0, max: 3000000 },
  { label: "AED 3M – 10M", value: "4,200,000", min: 3000001, max: 10000000 },
  { label: "AED 10M+", value: "12,000,000", min: 10000001, max: Infinity },
] as const;

function formatIntegerAed(value: number): string {
  return `AED ${Math.round(value).toLocaleString("en-US")}`;
}

function formatDecimalAed(value: number): string {
  return `AED ${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatCommaInput(rawValue: string, allowDecimal = false): string {
  if (!rawValue) return "";
  if (allowDecimal) {
    const cleaned = rawValue.replace(/[^0-9.]/g, "");
    const parts = cleaned.split(".");
    const intPart = (parts[0] || "").replace(/^0+(?=\d)/, "");
    const formattedInt = intPart ? Number(intPart).toLocaleString("en-US") : parts.length > 1 ? "0" : "";
    if (parts.length > 1) {
      return `${formattedInt}.${parts.slice(1).join("").slice(0, 2)}`;
    }
    return formattedInt;
  }
  const digits = rawValue.replace(/\D/g, "");
  if (!digits) return "";
  return Number(digits).toLocaleString("en-US");
}

function parseNumericInput(formatted: string): number {
  const num = Number(formatted.replace(/,/g, ""));
  return Number.isFinite(num) && num >= 0 ? num : 0;
}

const HelpTooltip: React.FC<{ text: string; label: string }> = ({ text, label }) => {
  const [open, setOpen] = useState(false);
  const tipRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleOutside = (e: MouseEvent) => {
      if (tipRef.current && !tipRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  return (
    <span ref={tipRef} className="relative inline-flex items-center">
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="w-5 h-5 rounded-full inline-flex items-center justify-center text-[#64748B] hover:text-[#0D1B2A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4332] cursor-pointer"
      >
        <HelpCircle className="w-3.5 h-3.5" />
      </button>
      {open && (
        <span
          role="tooltip"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-30 w-60 sm:w-64 rounded-xl bg-[#0D1B2A] text-white text-xs leading-relaxed px-3.5 py-2.5 shadow-lg pointer-events-none"
        >
          {text}
        </span>
      )}
    </span>
  );
};

interface CommaNumberInputProps {
  id: string;
  label: string;
  valueStr: string;
  onChangeStr: (next: string) => void;
  allowDecimal?: boolean;
  tooltip?: string;
  helperText?: string;
  large?: boolean;
}

const CommaNumberInput: React.FC<CommaNumberInputProps> = ({
  id,
  label,
  valueStr,
  onChangeStr,
  allowDecimal = false,
  tooltip,
  helperText,
  large = false,
}) => {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        <label htmlFor={id} className="block text-sm font-semibold text-[#0D1B2A]">
          {label}
        </label>
        {tooltip && <HelpTooltip text={tooltip} label={`About ${label}`} />}
      </div>
      <div className="relative flex items-center">
        <span className="absolute left-4 text-xs font-semibold tracking-wide text-[#64748B] pointer-events-none select-none">
          AED
        </span>
        <input
          id={id}
          type="text"
          inputMode={allowDecimal ? "decimal" : "numeric"}
          value={valueStr}
          onChange={(e) => onChangeStr(formatCommaInput(e.target.value, allowDecimal))}
          placeholder="0"
          className={`w-full rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] hover:border-slate-300 focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/15 pl-14 pr-4 font-semibold text-[#0D1B2A] placeholder:text-slate-400 outline-none transition-all tabular-nums ${
            large ? "py-3.5 text-xl min-h-[54px]" : "py-3 text-base min-h-[48px]"
          }`}
        />
      </div>
      {helperText && <p className="text-xs text-[#64748B]">{helperText}</p>}
    </div>
  );
};

interface ToggleSwitchProps {
  id: string;
  label: string;
  subtext: string;
  tooltip?: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (next: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  id,
  label,
  subtext,
  tooltip,
  checked,
  disabled = false,
  onChange,
}) => {
  return (
    <div
      className={`flex items-center justify-between gap-4 rounded-xl border p-4 transition-colors ${
        disabled
          ? "bg-[#F8FAFC] border-[#E2E8F0] opacity-70"
          : "bg-[#FFFFFF] border-[#E2E8F0] hover:border-slate-300"
      }`}
    >
      <div className="space-y-0.5 min-w-0">
        <div className="flex items-center gap-1.5">
          <label
            htmlFor={id}
            className={`block text-sm font-semibold text-[#0D1B2A] ${
              disabled ? "cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            {label}
          </label>
          {tooltip && <HelpTooltip text={tooltip} label={`About ${label}`} />}
        </div>
        <p className="text-xs text-[#475569] leading-relaxed">{subtext}</p>
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border transition-colors ${
          disabled ? "cursor-not-allowed" : "cursor-pointer"
        } ${
          checked
            ? "bg-[#1B4332] border-[#1B4332]"
            : "bg-slate-200 border-slate-300"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-xs transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
};

export const UaeTaxCalculatorSuite: React.FC<UaeTaxCalculatorSuiteProps> = ({
  defaultTab = "corporate-tax",
  onNavigate,
  onResultViewed,
  onCtaClicked,
  onWhatsAppClicked,
}) => {
  const [activeTab, setActiveTab] = useState<CalculatorSuiteTab>(defaultTab);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  // ==========================
  // TAB 1: Corporate Tax State
  // ==========================
  const [entityProfile, setEntityProfile] = useState<EntityProfileType>("mainland-llc");
  const jurisdiction: CorporateJurisdiction = entityProfile === "freezone" ? "freezone" : "mainland";

  // Mainland / Sole Establishment inputs
  const [mainlandRevenueStr, setMainlandRevenueStr] = useState("4,200,000");
  const [mainlandProfitStr, setMainlandProfitStr] = useState("1,150,000");
  const [sbrPreferred, setSbrPreferred] = useState(true);

  // Free Zone inputs
  const [fzRevenueStr, setFzRevenueStr] = useState("4,200,000");
  const [fzQualifyingProfitStr, setFzQualifyingProfitStr] = useState("980,000");
  const [fzNonQualifyingProfitStr, setFzNonQualifyingProfitStr] = useState("170,000");
  const [fzNonQualifyingRevenueStr, setFzNonQualifyingRevenueStr] = useState("180,000");
  const [isQfzp, setIsQfzp] = useState(true);

  // ==========================
  // TAB 2: 5% UAE VAT State
  // ==========================
  const [vatAmountStr, setVatAmountStr] = useState("345");
  const [vatMode, setVatMode] = useState<VatMode>("add");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("advertising");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setCategoryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // =========================================================================
  // PRESERVED 2026 UAE CORPORATE TAX FORMULAS (100% UNCHANGED)
  // =========================================================================
  const ctResult = useMemo(() => {
    const STATUTORY_BAND = 375000;
    const SBR_REVENUE_CAP = 3000000;
    const CT_RATE = 0.09;

    if (jurisdiction === "mainland") {
      const revenue = parseNumericInput(mainlandRevenueStr);
      const profit = parseNumericInput(mainlandProfitStr);
      const isRevenueWithinSbrCap = revenue <= SBR_REVENUE_CAP;
      const sbrActive = isRevenueWithinSbrCap && sbrPreferred;

      let zeroBandProfit = 0;
      let nineBandProfit = 0;
      let taxAmount = 0;

      if (sbrActive) {
        zeroBandProfit = profit;
        nineBandProfit = 0;
        taxAmount = 0;
      } else {
        zeroBandProfit = Math.min(profit, STATUTORY_BAND);
        nineBandProfit = Math.max(0, profit - STATUTORY_BAND);
        taxAmount = Math.round(nineBandProfit * CT_RATE);
      }

      const effectiveRate = profit > 0 ? (taxAmount / profit) * 100 : 0;

      return {
        mode: "mainland" as const,
        revenue,
        profit,
        isRevenueWithinSbrCap,
        sbrActive,
        zeroBandProfit,
        nineBandProfit,
        taxAmount,
        effectiveRate,
      };
    }

    // Free Zone calculation
    const revenue = parseNumericInput(fzRevenueStr);
    const qualifyingProfit = parseNumericInput(fzQualifyingProfitStr);
    const nonQualifyingProfit = parseNumericInput(fzNonQualifyingProfitStr);
    const nonQualifyingRevenue = parseNumericInput(fzNonQualifyingRevenueStr);
    const totalProfit = qualifyingProfit + nonQualifyingProfit;

    const deMinimisCap = Math.min(revenue * 0.05, 5000000);
    const deMinimisPassed = revenue > 0 ? nonQualifyingRevenue <= deMinimisCap : nonQualifyingRevenue === 0;
    const deMinimisRatio =
      deMinimisCap > 0
        ? Math.min(100, (nonQualifyingRevenue / deMinimisCap) * 100)
        : nonQualifyingRevenue > 0
          ? 100
          : 0;

    const qfzpZeroApplies = isQfzp && deMinimisPassed;

    let taxAmount = 0;
    let zeroBandProfit = 0;
    let nineBandProfit = 0;

    if (qfzpZeroApplies) {
      // Qualifying income at 0%; non-qualifying income at 9% (no AED 375,000 band for QFZPs)
      zeroBandProfit = qualifyingProfit;
      nineBandProfit = nonQualifyingProfit;
      taxAmount = Math.round(nonQualifyingProfit * CT_RATE);
    } else {
      // Standard UAE rules apply across total profit
      zeroBandProfit = Math.min(totalProfit, STATUTORY_BAND);
      nineBandProfit = Math.max(0, totalProfit - STATUTORY_BAND);
      taxAmount = Math.round(nineBandProfit * CT_RATE);
    }

    const effectiveRate = totalProfit > 0 ? (taxAmount / totalProfit) * 100 : 0;

    return {
      mode: "freezone" as const,
      revenue,
      qualifyingProfit,
      nonQualifyingProfit,
      nonQualifyingRevenue,
      totalProfit,
      deMinimisCap,
      deMinimisPassed,
      deMinimisRatio,
      qfzpZeroApplies,
      zeroBandProfit,
      nineBandProfit,
      taxAmount,
      effectiveRate,
    };
  }, [
    jurisdiction,
    mainlandRevenueStr,
    mainlandProfitStr,
    sbrPreferred,
    fzRevenueStr,
    fzQualifyingProfitStr,
    fzNonQualifyingProfitStr,
    fzNonQualifyingRevenueStr,
    isQfzp,
  ]);

  useEffect(() => {
    if (!onResultViewed || step !== 4) return;
    if (ctResult.mode === "mainland") {
      onResultViewed({
        liability: ctResult.taxAmount,
        sbr: ctResult.sbrActive,
        netProfit: ctResult.profit,
      });
    } else {
      onResultViewed({
        liability: ctResult.taxAmount,
        sbr: false,
        netProfit: ctResult.totalProfit,
      });
    }
  }, [ctResult, onResultViewed, step]);

  // =========================================================================
  // PRESERVED 5% UAE VAT FORMULAS (100% UNCHANGED)
  // =========================================================================
  const selectedCategory = useMemo(
    () => VAT_EXPENSE_CATEGORIES.find((cat) => cat.id === selectedCategoryId) || VAT_EXPENSE_CATEGORIES[0],
    [selectedCategoryId]
  );

  const filteredCategories = useMemo(() => {
    const q = categorySearch.trim().toLowerCase();
    if (!q) return VAT_EXPENSE_CATEGORIES;
    return VAT_EXPENSE_CATEGORIES.filter(
      (cat) => cat.label.toLowerCase().includes(q) || cat.treatmentLabel.toLowerCase().includes(q)
    );
  }, [categorySearch]);

  const vatResult = useMemo(() => {
    const inputAmount = parseNumericInput(vatAmountStr);
    const rate = selectedCategory.vatRate;

    let netAmount = inputAmount;
    let vatAmount = 0;
    let grossAmount = inputAmount;

    if (rate > 0) {
      if (vatMode === "add") {
        netAmount = inputAmount;
        vatAmount = inputAmount * rate;
        grossAmount = inputAmount + vatAmount;
      } else {
        grossAmount = inputAmount;
        netAmount = inputAmount / (1 + rate);
        vatAmount = grossAmount - netAmount;
      }
    }

    return {
      netAmount,
      vatAmount,
      grossAmount,
      rate,
      recovery: selectedCategory.recovery,
    };
  }, [vatAmountStr, vatMode, selectedCategory]);

  // Active revenue value helpers for Step 2
  const activeRevenueStr = jurisdiction === "mainland" ? mainlandRevenueStr : fzRevenueStr;
  const setActiveRevenueStr = (next: string) => {
    if (jurisdiction === "mainland") {
      setMainlandRevenueStr(next);
    } else {
      setFzRevenueStr(next);
    }
  };
  const activeRevenueNum = parseNumericInput(activeRevenueStr);

  // Stacked breakdown bar ratios
  const totalTaxableIncome = ctResult.mode === "mainland" ? ctResult.profit : ctResult.totalProfit;
  const zeroPercentWidth =
    totalTaxableIncome > 0
      ? Math.min(100, Math.round((ctResult.zeroBandProfit / totalTaxableIncome) * 100))
      : 100;
  const ninePercentWidth = Math.max(0, 100 - zeroPercentWidth);

  const entityDisplayLabel =
    entityProfile === "mainland-llc"
      ? "UAE Mainland LLC"
      : entityProfile === "freezone"
        ? "UAE Free Zone Entity"
        : "Freelancer / Sole Establishment";

  const buildCorporateSummaryText = () => {
    const lines =
      ctResult.mode === "mainland"
        ? [
            `Entity Type: ${entityDisplayLabel}`,
            `Annual Revenue: ${formatIntegerAed(ctResult.revenue)}`,
            `Taxable Net Profit: ${formatIntegerAed(ctResult.profit)}`,
            `Small Business Relief (0%): ${ctResult.sbrActive ? "Eligible & Elected (0%)" : "Not Applied"}`,
            `0% Tax-Free Portion: ${formatIntegerAed(ctResult.zeroBandProfit)}`,
            `9% Taxable Portion: ${formatIntegerAed(ctResult.nineBandProfit)}`,
            `Estimated 2026 Corporate Tax: ${formatIntegerAed(ctResult.taxAmount)} (${ctResult.effectiveRate.toFixed(2)}% effective)`,
          ]
        : [
            `Entity Type: ${entityDisplayLabel}`,
            `Annual Revenue: ${formatIntegerAed(ctResult.revenue)}`,
            `Qualifying Profit: ${formatIntegerAed(ctResult.qualifyingProfit)}`,
            `Non-Qualifying Profit: ${formatIntegerAed(ctResult.nonQualifyingProfit)}`,
            `De Minimis Status: ${ctResult.deMinimisPassed ? "Passed" : "Exceeded"}`,
            `Estimated 2026 Corporate Tax: ${formatIntegerAed(ctResult.taxAmount)} (${ctResult.effectiveRate.toFixed(2)}% effective)`,
          ];
    return lines;
  };

  const handleBookCorporateReview = () => {
    if (onCtaClicked) onCtaClicked("ct-review");
    if (onWhatsAppClicked) onWhatsAppClicked();
    const lines = buildCorporateSummaryText();
    if (typeof window !== "undefined") {
      sessionStorage.setItem("dias_selected_service", `2026 Corporate Tax Review — ${formatIntegerAed(ctResult.taxAmount)}`);
      sessionStorage.setItem("dias_tax_summary", lines.join(" | "));
    }
    const msg = `Hi Dias Accounting, I completed the 2026 UAE Corporate Tax Calculator:\n• ${lines.join("\n• ")}\n\nI would like to book a free 15-min tax review.`;
    window.open(`https://wa.me/971529226958?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
  };

  const handleDownloadSummary = () => {
    const lines = [
      "DIAS ACCOUNTING & TAX CONSULTING LLC",
      "2026 UAE Corporate Tax Indicative Estimate",
      "--------------------------------------------------",
      ...buildCorporateSummaryText(),
      "--------------------------------------------------",
      "Statutory Note: Corporate Tax returns are due on EmaraTax within 9 months of financial year-end.",
      "FTA-Registered Support: +971 52 922 6958 | info@diasuae.ae | https://diasuae.ae",
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dias-2026-uae-corporate-tax-summary.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleBookVatReview = () => {
    if (onCtaClicked) onCtaClicked("vat-form-201-audit");
    if (onWhatsAppClicked) onWhatsAppClicked();
    const msg = `Hi Dias Accounting, I used the 5% UAE VAT Calculator:\n• Mode: ${vatMode === "add" ? "Add VAT (Excl. -> Incl.)" : "Extract VAT (Incl. -> Excl.)"}\n• Expense Category: ${selectedCategory.label}\n• Net (excl. VAT): ${formatDecimalAed(vatResult.netAmount)}\n• VAT Amount: ${formatDecimalAed(vatResult.vatAmount)}\n• Gross (incl. VAT): ${formatDecimalAed(vatResult.grossAmount)}\n• Recovery Treatment: ${selectedCategory.treatmentLabel}\n\nI would like a free 15-min Form 201 VAT review.`;
    window.open(`https://wa.me/971529226958?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
  };

  const handleWizardKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter" && step < 4) {
      e.preventDefault();
      setStep((prev) => (prev < 4 ? ((prev + 1) as 1 | 2 | 3 | 4) : prev));
    }
  };

  const handleNextStep = () => {
    if (step < 4) {
      setStep((prev) => (prev + 1) as 1 | 2 | 3 | 4);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as 1 | 2 | 3 | 4);
    }
  };

  const handleRecalculate = () => {
    setStep(1);
  };

  // Status badge logic for Results Dashboard
  const statusPill = useMemo(() => {
    if (ctResult.mode === "mainland") {
      if (ctResult.sbrActive) {
        return {
          text: "Eligible for Small Business Relief — 0% Tax",
          tone: "emerald" as const,
        };
      }
      if (ctResult.taxAmount === 0) {
        return {
          text: "Within AED 375,000 0% Threshold",
          tone: "emerald" as const,
        };
      }
      return {
        text: "Standard 9% Tier Applies",
        tone: "slate" as const,
      };
    }

    if (ctResult.qfzpZeroApplies) {
      return {
        text: "0% QFZP Regime — De Minimis Passed",
        tone: "emerald" as const,
      };
    }
    if (isQfzp && !ctResult.deMinimisPassed) {
      return {
        text: "De Minimis Exceeded — Standard 9% Applies",
        tone: "rose" as const,
      };
    }
    return {
      text: "Free Zone — Standard 9% Tier Applies",
      tone: "slate" as const,
    };
  }, [ctResult, isQfzp]);

  return (
    <div className="space-y-6">
      {/* Centered Mode Switcher: Corporate Tax vs 5% VAT */}
      <div className="flex justify-center">
        <div
          role="tablist"
          aria-label="UAE Tax Calculator Tools"
          className="inline-flex w-full sm:w-auto gap-1 p-1.5 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "corporate-tax"}
            onClick={() => setActiveTab("corporate-tax")}
            className={`flex-1 sm:flex-none min-h-[44px] px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer inline-flex items-center justify-center gap-2 ${
              activeTab === "corporate-tax"
                ? "bg-[#1B4332] text-white shadow-xs"
                : "text-[#475569] hover:text-[#0D1B2A]"
            }`}
          >
            <Calculator className="w-4 h-4 shrink-0" />
            <span>Corporate Tax</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "vat"}
            onClick={() => setActiveTab("vat")}
            className={`flex-1 sm:flex-none min-h-[44px] px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer inline-flex items-center justify-center gap-2 ${
              activeTab === "vat"
                ? "bg-[#1B4332] text-white shadow-xs"
                : "text-[#475569] hover:text-[#0D1B2A]"
            }`}
          >
            <Percent className="w-4 h-4 shrink-0" />
            <span>5% UAE VAT</span>
          </button>
        </div>
      </div>

      {/* ================================================= */}
      {/* TAB 1: GUIDED 4-STEP CORPORATE TAX WIZARD         */}
      {/* ================================================= */}
      {activeTab === "corporate-tax" && (
        <div className="max-w-[760px] mx-auto bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl shadow-[0_14px_40px_-16px_rgba(13,27,42,0.1)] overflow-hidden">
          {/* Top Progress Indicator */}
          <div className="px-6 sm:px-10 lg:px-12 pt-6 sm:pt-8 pb-5 border-b border-[#E2E8F0] bg-[#FFFFFF]">
            <div className="flex items-center justify-between gap-4 mb-3">
              <span className="text-xs font-semibold text-[#1B4332] tabular-nums">
                Step {step} of 4
              </span>
              <span className="text-xs font-medium text-[#475569]">
                {STEP_LABELS[step - 1]}
              </span>
            </div>
            <div
              className="h-1.5 w-full rounded-full bg-[#E2E8F0] overflow-hidden"
              role="progressbar"
              aria-valuenow={step * 25}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full rounded-full bg-[#1B4332] transition-all duration-300 ease-out"
                style={{ width: `${step * 25}%` }}
              />
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleNextStep();
            }}
            onKeyDown={handleWizardKeyDown}
            className="p-6 sm:p-10 lg:p-12"
          >
            {/* STEP 1: Business Jurisdiction & Entity Type */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="space-y-1.5">
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-[#0D1B2A] tracking-tight">
                    Select your UAE entity structure
                  </h2>
                  <p className="text-sm text-[#475569]">
                    We apply the exact 2026 Federal Tax Authority regime for your license type.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  {(
                    [
                      {
                        id: "mainland-llc" as const,
                        title: "Mainland LLC",
                        desc: "DED-licensed UAE mainland company",
                        icon: Building2,
                      },
                      {
                        id: "freezone" as const,
                        title: "Free Zone Entity",
                        desc: "DMCC, DIFC, IFZA, SHAMS & other zones",
                        icon: Globe,
                      },
                      {
                        id: "sole-establishment" as const,
                        title: "Freelancer / Sole Est.",
                        desc: "Natural person or sole proprietorship",
                        icon: UserCheck,
                      },
                    ] as const
                  ).map((option) => {
                    const Icon = option.icon;
                    const isSelected = entityProfile === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setEntityProfile(option.id)}
                        className={`relative text-left rounded-xl p-5 min-h-[124px] border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                          isSelected
                            ? "border-[#1B4332] bg-[#1B4332]/[0.04] ring-1 ring-[#1B4332]"
                            : "border-[#E2E8F0] bg-[#FFFFFF] hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div
                            className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                              isSelected
                                ? "bg-[#1B4332] text-white"
                                : "bg-[#F8FAFC] text-[#0D1B2A] border border-[#E2E8F0]"
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          {isSelected && (
                            <span className="w-5 h-5 rounded-full bg-[#1B4332] text-white flex items-center justify-center">
                              <Check className="w-3 h-3" strokeWidth={2.5} />
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-[#0D1B2A]">{option.title}</div>
                          <p className="text-xs text-[#475569] mt-0.5 leading-snug">{option.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 2: Annual Revenue & Financial Profile */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-1.5">
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-[#0D1B2A] tracking-tight">
                    What is your estimated annual revenue?
                  </h2>
                  <p className="text-sm text-[#475569]">
                    Used to check Small Business Relief (AED 3M cap) or Free Zone De Minimis limits.
                  </p>
                </div>

                <CommaNumberInput
                  id="wizard-annual-revenue"
                  label="Annual Revenue (AED)"
                  valueStr={activeRevenueStr}
                  onChangeStr={setActiveRevenueStr}
                  large
                />

                {/* Quick-Select Preset Chips */}
                <div className="space-y-2">
                  <span className="block text-xs font-medium text-[#64748B]">Quick select band</span>
                  <div className="flex flex-wrap gap-2">
                    {REVENUE_PRESETS.map((preset) => {
                      const isPresetActive =
                        activeRevenueNum >= preset.min && activeRevenueNum <= preset.max;
                      return (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => setActiveRevenueStr(preset.value)}
                          className={`min-h-[40px] px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer tabular-nums ${
                            isPresetActive
                              ? "bg-[#1B4332] border-[#1B4332] text-white"
                              : "bg-[#F8FAFC] border-[#E2E8F0] text-[#0D1B2A] hover:border-slate-300"
                          }`}
                        >
                          {preset.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Smooth Slider */}
                <div className="pt-1 space-y-2">
                  <input
                    type="range"
                    min={0}
                    max={15000000}
                    step={50000}
                    value={Math.min(15000000, activeRevenueNum)}
                    onChange={(e) =>
                      setActiveRevenueStr(Number(e.target.value).toLocaleString("en-US"))
                    }
                    aria-label="Annual revenue slider"
                    className="w-full h-2 rounded-lg bg-[#E2E8F0] appearance-none cursor-pointer accent-[#1B4332]"
                  />
                  <div className="flex justify-between text-[11px] font-medium text-[#64748B] tabular-nums">
                    <span>AED 0</span>
                    <span>AED 3M (SBR Cap)</span>
                    <span>AED 10M</span>
                    <span>AED 15M+</span>
                  </div>
                </div>

                {/* Live 1-Line Threshold Feedback */}
                <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] px-4 py-3 text-xs text-[#475569] flex items-center gap-2">
                  <Info className="w-4 h-4 text-[#1B4332] shrink-0" />
                  {jurisdiction === "mainland" ? (
                    <span>
                      {activeRevenueNum <= 3000000
                        ? "Revenue is within the AED 3,000,000 Small Business Relief threshold (0% election available)."
                        : "Revenue exceeds AED 3,000,000 — standard 0% up to AED 375,000 and 9% above applies."}
                    </span>
                  ) : (
                    <span className="tabular-nums">
                      Free Zone De Minimis non-qualifying cap (lower of 5% or AED 5M):{" "}
                      <strong className="text-[#0D1B2A]">
                        {formatIntegerAed(Math.min(activeRevenueNum * 0.05, 5000000))}
                      </strong>
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* STEP 3: Net Profit & Qualifying Status / Deductions */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="space-y-1.5">
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-[#0D1B2A] tracking-tight">
                    {jurisdiction === "mainland"
                      ? "Net profit & relief eligibility"
                      : "Free Zone profit split & QFZP status"}
                  </h2>
                  <p className="text-sm text-[#475569]">
                    {jurisdiction === "mainland"
                      ? "Enter your expected annual net profit and confirm whether you elect Small Business Relief."
                      : "Split qualifying vs. non-qualifying income to verify your 0% QFZP De Minimis position."}
                  </p>
                </div>

                {jurisdiction === "mainland" ? (
                  <div className="space-y-5">
                    <CommaNumberInput
                      id="ct-mainland-profit"
                      label="Annual Taxable Net Profit (AED)"
                      valueStr={mainlandProfitStr}
                      onChangeStr={setMainlandProfitStr}
                      tooltip="Accounting net profit before corporate tax, adjusted for non-deductible expenses such as 50% of client entertainment."
                      large
                    />

                    <ToggleSwitch
                      id="ct-mainland-sbr"
                      label="Elect Small Business Relief (0% CT)"
                      tooltip="Under Ministerial Decision No. 73 of 2023, resident businesses with revenue up to AED 3M can elect 0% Corporate Tax through Dec 31, 2029."
                      subtext={
                        ctResult.mode === "mainland" && ctResult.isRevenueWithinSbrCap
                          ? "Available up to AED 3M annual revenue through 2029."
                          : "Unavailable because annual revenue exceeds AED 3,000,000."
                      }
                      checked={ctResult.mode === "mainland" ? ctResult.sbrActive : false}
                      disabled={ctResult.mode === "mainland" ? !ctResult.isRevenueWithinSbrCap : true}
                      onChange={setSbrPreferred}
                    />
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <CommaNumberInput
                        id="ct-fz-qualifying-profit"
                        label="Qualifying Taxable Profit (AED)"
                        valueStr={fzQualifyingProfitStr}
                        onChangeStr={setFzQualifyingProfitStr}
                        tooltip="Net profit derived from Qualifying Activities or transactions with other Free Zone Persons (eligible for 0% if QFZP)."
                      />
                      <CommaNumberInput
                        id="ct-fz-non-qualifying-profit"
                        label="Non-Qualifying Profit (AED)"
                        valueStr={fzNonQualifyingProfitStr}
                        onChangeStr={setFzNonQualifyingProfitStr}
                        tooltip="Net profit from Excluded Activities or non-qualifying UAE mainland sales (taxed at 9% without the AED 375,000 band)."
                      />
                    </div>

                    <div className="space-y-3">
                      <CommaNumberInput
                        id="ct-fz-non-qualifying-revenue"
                        label="Non-Qualifying Revenue (AED)"
                        valueStr={fzNonQualifyingRevenueStr}
                        onChangeStr={setFzNonQualifyingRevenueStr}
                        tooltip="To keep 0% QFZP status, non-qualifying revenue must not exceed 5% of total revenue or AED 5,000,000 (whichever is lower)."
                      />

                      {ctResult.mode === "freezone" && (
                        <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-3.5 space-y-2">
                          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                            <span className="font-medium text-[#475569]">De Minimis usage</span>
                            <span
                              className={`font-semibold tabular-nums ${
                                ctResult.deMinimisPassed ? "text-[#1B4332]" : "text-rose-600"
                              }`}
                            >
                              {formatIntegerAed(ctResult.nonQualifyingRevenue)} /{" "}
                              {formatIntegerAed(ctResult.deMinimisCap)}
                            </span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-[#E2E8F0] overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                ctResult.deMinimisPassed ? "bg-[#1B4332]" : "bg-rose-500"
                              }`}
                              style={{ width: `${Math.max(2, ctResult.deMinimisRatio)}%` }}
                            />
                          </div>
                          <p
                            className={`text-xs font-medium ${
                              ctResult.deMinimisPassed ? "text-[#1B4332]" : "text-rose-600"
                            }`}
                          >
                            {ctResult.deMinimisPassed
                              ? `Within threshold (${ctResult.deMinimisRatio.toFixed(1)}% of limit used)`
                              : "De Minimis cap exceeded — standard 9% rules apply across total profit"}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <ToggleSwitch
                        id="ct-fz-qfzp"
                        label="Qualifying Free Zone Person (QFZP)"
                        tooltip="Requires adequate UAE substance, audited IFRS financial statements, and arm's-length Transfer Pricing compliance."
                        subtext="Adequate UAE substance, audited IFRS accounts & transfer pricing met."
                        checked={isQfzp}
                        onChange={setIsQfzp}
                      />
                      <ToggleSwitch
                        id="ct-fz-sbr"
                        label="Small Business Relief"
                        subtext="Not available alongside the 0% Free Zone QFZP regime."
                        checked={false}
                        disabled={true}
                        onChange={() => {}}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 4: Executive Results Dashboard */}
            {step === 4 && (
              <div className="space-y-7">
                {/* Top Hero Metric + Status Pill */}
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-[#475569] tracking-wide">
                      Estimated 2026 UAE Corporate Tax Liability
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                        statusPill.tone === "emerald"
                          ? "bg-emerald-50 text-[#1B4332] border-emerald-200"
                          : statusPill.tone === "rose"
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : "bg-[#F8FAFC] text-[#0D1B2A] border-[#E2E8F0]"
                      }`}
                    >
                      {statusPill.tone === "emerald" ? (
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      ) : statusPill.tone === "rose" ? (
                        <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                      ) : (
                        <Building2 className="w-3.5 h-3.5 text-[#475569] shrink-0" />
                      )}
                      <span>{statusPill.text}</span>
                    </span>
                  </div>

                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <span className="font-display text-4xl sm:text-5xl font-bold text-[#0D1B2A] tracking-tight tabular-nums">
                      {formatIntegerAed(ctResult.taxAmount)}
                    </span>
                    <span className="text-sm font-semibold text-[#475569] tabular-nums">
                      {ctResult.effectiveRate.toFixed(2)}% effective tax rate
                    </span>
                  </div>
                </div>

                {/* Visual Breakdown Card: Stacked Bar + Crisp 3-Row Ledger */}
                <div className="rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] p-5 sm:p-6 space-y-5">
                  {/* Minimal Horizontal Stacked Proportion Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-[#475569] tabular-nums">
                      <span>0% Portion ({zeroPercentWidth}%)</span>
                      <span>9% Portion ({ninePercentWidth}%)</span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-[#F1F5F9] overflow-hidden flex">
                      {zeroPercentWidth > 0 && (
                        <div
                          className="h-full bg-[#1B4332] transition-all duration-300"
                          style={{ width: `${zeroPercentWidth}%` }}
                        />
                      )}
                      {ninePercentWidth > 0 && (
                        <div
                          className="h-full bg-[#C5A059] transition-all duration-300"
                          style={{ width: `${ninePercentWidth}%` }}
                        />
                      )}
                    </div>
                  </div>

                  {/* Crisp 3-Row Ledger */}
                  <div className="divide-y divide-[#E2E8F0] text-sm">
                    <div className="py-3 flex items-center justify-between gap-4">
                      <span className="text-[#475569]">Taxable Income</span>
                      <span className="font-semibold text-[#0D1B2A] tabular-nums">
                        {formatIntegerAed(totalTaxableIncome)}
                      </span>
                    </div>

                    <div className="py-3 flex items-center justify-between gap-4">
                      <span className="text-[#475569]">
                        {ctResult.mode === "mainland"
                          ? ctResult.sbrActive
                            ? "0% Small Business Relief (Revenue ≤ AED 3M)"
                            : "0% Tax-Free Threshold (up to AED 375,000)"
                          : ctResult.qfzpZeroApplies
                            ? `Qualifying Free Zone Income at 0% (${formatIntegerAed(ctResult.qualifyingProfit)})`
                            : "0% Tax-Free Threshold (up to AED 375,000)"}
                      </span>
                      <span className="font-semibold text-[#1B4332] tabular-nums">AED 0</span>
                    </div>

                    <div className="py-3 flex items-center justify-between gap-4">
                      <span className="text-[#475569]">
                        9% Taxable Portion{" "}
                        {ctResult.nineBandProfit > 0 ? (
                          <span className="text-xs text-[#64748B] tabular-nums">
                            ({formatIntegerAed(ctResult.nineBandProfit)} × 9%)
                          </span>
                        ) : null}
                      </span>
                      <span className="font-bold text-[#0D1B2A] tabular-nums">
                        {formatIntegerAed(ctResult.taxAmount)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Key Compliance Note (Muted Slate Background + Subtle Gold Left Accent Border) */}
                <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] border-l-[3px] border-l-[#C5A059] p-4 text-xs sm:text-sm text-[#475569] leading-relaxed">
                  <strong className="font-semibold text-[#0D1B2A] block mb-0.5">
                    2026 FTA Compliance Note
                  </strong>
                  {ctResult.mode === "freezone" && ctResult.qfzpZeroApplies
                    ? "To preserve your 0% QFZP rate, audited IFRS financial statements and Transfer Pricing documentation are mandatory. Your EmaraTax Corporate Tax return is due within 9 months of financial year-end."
                    : ctResult.mode === "mainland" && ctResult.sbrActive
                      ? "Even with AED 0 tax under Small Business Relief, you must formally elect SBR on your annual EmaraTax Corporate Tax return within 9 months of financial year-end and keep IFRS books for 7 years."
                      : "Your UAE Corporate Tax return and payment are due on EmaraTax within 9 months of your financial year-end. Maintaining monthly IFRS books avoids late-filing and record-keeping penalties."}
                </div>

                {/* Single Contextual CTA Strip */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <button
                    type="button"
                    onClick={handleBookCorporateReview}
                    className="w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-xl bg-[#1B4332] hover:bg-[#143326] text-white text-sm font-semibold transition-colors cursor-pointer inline-flex items-center justify-center gap-2 shadow-xs"
                  >
                    <span>Book Free 15-Min Tax Review</span>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </button>

                  <div className="flex items-center justify-center sm:justify-end gap-4">
                    <button
                      type="button"
                      onClick={handleDownloadSummary}
                      className="min-h-[44px] px-2 text-xs sm:text-sm font-semibold text-[#0D1B2A] hover:text-[#1B4332] inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Download className="w-4 h-4 shrink-0" />
                      <span>Download Summary</span>
                    </button>
                    <span className="text-[#CBD5E1]" aria-hidden="true">
                      |
                    </span>
                    <button
                      type="button"
                      onClick={handleRecalculate}
                      className="min-h-[44px] px-2 text-xs sm:text-sm font-semibold text-[#475569] hover:text-[#0D1B2A] inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                      <span>Recalculate</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Wizard Navigation Footer (Steps 1–3) */}
            {step < 4 && (
              <div className="mt-8 pt-6 border-t border-[#E2E8F0] flex items-center justify-between gap-4">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="min-h-[44px] px-3 py-2 rounded-xl text-sm font-semibold text-[#475569] hover:text-[#0D1B2A] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                ) : (
                  <span className="text-xs text-[#64748B]">Press Enter or click Continue</span>
                )}

                <button
                  type="submit"
                  className="min-h-[46px] px-6 py-2.5 rounded-xl bg-[#1B4332] hover:bg-[#143326] text-white text-sm font-semibold transition-colors cursor-pointer inline-flex items-center gap-2 shadow-xs"
                >
                  <span>{step === 3 ? "View Tax Summary" : "Continue"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </form>
        </div>
      )}

      {/* ================================================= */}
      {/* TAB 2: 5% UAE VAT & INPUT RECOVERY CALCULATOR     */}
      {/* ================================================= */}
      {activeTab === "vat" && (
        <div className="max-w-[760px] mx-auto bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl shadow-[0_14px_40px_-16px_rgba(13,27,42,0.1)] p-6 sm:p-10 lg:p-12 space-y-7">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#E2E8F0]">
            <div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#0D1B2A] tracking-tight">
                5% UAE VAT &amp; Input Recovery
              </h2>
              <p className="text-sm text-[#475569] mt-0.5">
                Add or extract 5% VAT and verify FTA Form 201 reclaim eligibility.
              </p>
            </div>

            <div
              role="group"
              aria-label="VAT Calculation Mode"
              className="inline-flex p-1 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] self-start sm:self-auto"
            >
              <button
                type="button"
                onClick={() => setVatMode("add")}
                className={`min-h-[40px] px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  vatMode === "add"
                    ? "bg-[#1B4332] text-white shadow-xs"
                    : "text-[#475569] hover:text-[#0D1B2A]"
                }`}
              >
                Add VAT
              </button>
              <button
                type="button"
                onClick={() => setVatMode("extract")}
                className={`min-h-[40px] px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  vatMode === "extract"
                    ? "bg-[#1B4332] text-white shadow-xs"
                    : "text-[#475569] hover:text-[#0D1B2A]"
                }`}
              >
                Extract VAT
              </button>
            </div>
          </div>

          {/* Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <CommaNumberInput
              id="vat-amount-input"
              label={vatMode === "add" ? "Net Amount Excl. VAT (AED)" : "Gross Amount Incl. VAT (AED)"}
              valueStr={vatAmountStr}
              onChangeStr={setVatAmountStr}
              allowDecimal={true}
            />

            {/* Expense Category Dropdown */}
            <div className="space-y-1.5" ref={dropdownRef}>
              <label htmlFor="vat-category-trigger" className="block text-sm font-semibold text-[#0D1B2A]">
                Expense Category
              </label>

              <div className="relative">
                <button
                  id="vat-category-trigger"
                  type="button"
                  aria-expanded={categoryOpen}
                  onClick={() => setCategoryOpen((prev) => !prev)}
                  className="w-full min-h-[48px] rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] hover:border-slate-300 focus:border-[#1B4332] px-4 py-2.5 text-left flex items-center justify-between gap-3 cursor-pointer transition-colors"
                >
                  <span className="text-sm font-semibold text-[#0D1B2A] truncate">
                    {selectedCategory.label}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#475569] shrink-0 transition-transform ${
                      categoryOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {categoryOpen && (
                  <div className="absolute z-30 mt-2 w-full rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xl overflow-hidden">
                    <div className="p-2 border-b border-[#E2E8F0]">
                      <div className="relative flex items-center">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                        <input
                          type="text"
                          value={categorySearch}
                          onChange={(e) => setCategorySearch(e.target.value)}
                          placeholder="Search category..."
                          className="w-full rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#1B4332] pl-9 pr-3 py-2 text-xs text-[#0D1B2A] placeholder:text-slate-400 outline-none"
                        />
                      </div>
                    </div>

                    <div className="max-h-60 overflow-y-auto divide-y divide-[#F1F5F9]">
                      {filteredCategories.length === 0 ? (
                        <div className="p-4 text-xs text-[#64748B] text-center">
                          No matching category found.
                        </div>
                      ) : (
                        filteredCategories.map((cat) => {
                          const isSelected = cat.id === selectedCategory.id;
                          return (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => {
                                setSelectedCategoryId(cat.id);
                                setCategoryOpen(false);
                                setCategorySearch("");
                              }}
                              className={`w-full px-4 py-3 text-left transition-colors cursor-pointer flex items-center justify-between gap-3 ${
                                isSelected ? "bg-[#1B4332]/[0.05]" : "hover:bg-[#F8FAFC]"
                              }`}
                            >
                              <div className="min-w-0">
                                <span className="block text-xs sm:text-sm font-semibold text-[#0D1B2A]">
                                  {cat.label}
                                </span>
                                <span
                                  className={`block text-[11px] mt-0.5 ${
                                    cat.recovery === "reclaimable"
                                      ? "text-[#1B4332]"
                                      : cat.recovery === "blocked"
                                        ? "text-rose-600"
                                        : "text-[#64748B]"
                                  }`}
                                >
                                  {cat.treatmentLabel}
                                </span>
                              </div>
                              {isSelected && <Check className="w-4 h-4 text-[#1B4332] shrink-0" />}
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* VAT Result Summary */}
          <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-5 sm:p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-xs font-semibold text-[#475569] block">
                  {vatMode === "add" ? "5% UAE VAT Added" : "5% UAE VAT Extracted"}
                </span>
                <div className="font-display text-3xl sm:text-4xl font-bold text-[#0D1B2A] tracking-tight tabular-nums mt-1">
                  {formatDecimalAed(vatResult.vatAmount)}
                </div>
              </div>

              {vatResult.recovery === "reclaimable" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#1B4332] text-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Reclaimable on Form 201</span>
                </span>
              )}
              {vatResult.recovery === "blocked" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Blocked Input VAT (0% Reclaimable)</span>
                </span>
              )}
              {vatResult.recovery === "zero-rated" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E2E8F0] text-[#0D1B2A] text-xs font-semibold">
                  <Info className="w-3.5 h-3.5" />
                  <span>Zero-Rated (0% VAT)</span>
                </span>
              )}
            </div>

            <div className="divide-y divide-[#E2E8F0] border-t border-[#E2E8F0] text-sm">
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-[#475569]">Net Amount (excl. VAT)</span>
                <span className="font-semibold text-[#0D1B2A] tabular-nums">
                  {formatDecimalAed(vatResult.netAmount)}
                </span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-[#475569]">UAE VAT ({selectedCategory.vatRate * 100}%)</span>
                <span className="font-semibold text-[#0D1B2A] tabular-nums">
                  {formatDecimalAed(vatResult.vatAmount)}
                </span>
              </div>
              <div className="pt-2.5 flex items-center justify-between">
                <span className="font-semibold text-[#0D1B2A]">Gross Total (incl. VAT)</span>
                <span className="font-bold text-[#0D1B2A] tabular-nums">
                  {formatDecimalAed(vatResult.grossAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Compliance Note */}
          <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] border-l-[3px] border-l-[#C5A059] p-4 text-xs sm:text-sm text-[#475569] leading-relaxed">
            {vatResult.recovery === "reclaimable" && (
              <>
                You may reclaim{" "}
                <strong className="font-semibold text-[#0D1B2A] tabular-nums">
                  {formatDecimalAed(vatResult.vatAmount)}
                </strong>{" "}
                on FTA Form 201 provided the supplier&apos;s TRN and full UAE Tax Invoice requirements are documented.
              </>
            )}
            {vatResult.recovery === "blocked" && (
              <>
                Under UAE VAT Executive Regulations, input VAT on client entertainment and personal/mixed-use motor
                vehicles is blocked and cannot be reclaimed on Form 201.
              </>
            )}
            {vatResult.recovery === "zero-rated" && (
              <>
                International commercial flights are zero-rated (0% VAT) under Article 45 of the UAE VAT Law, resulting
                in AED 0.00 VAT charged or reclaimed.
              </>
            )}
          </div>

          {/* Single Contextual CTA */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-1">
            <button
              type="button"
              onClick={handleBookVatReview}
              className="w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-xl bg-[#1B4332] hover:bg-[#143326] text-white text-sm font-semibold transition-colors cursor-pointer inline-flex items-center justify-center gap-2 shadow-xs"
            >
              <span>Book Free 15-Min VAT Review</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate("/pricing")}
              className="min-h-[44px] px-2 text-xs sm:text-sm font-semibold text-[#475569] hover:text-[#0D1B2A] transition-colors cursor-pointer"
            >
              View Fixed-Fee VAT Retainers →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UaeTaxCalculatorSuite;

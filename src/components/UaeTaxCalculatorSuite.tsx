import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Building2,
  Calculator,
  CheckCircle2,
  ChevronDown,
  Info,
  Percent,
  Search,
  ShieldAlert,
  ShieldCheck,
  XCircle,
} from "lucide-react";

export type CalculatorSuiteTab = "corporate-tax" | "vat";
export type CorporateJurisdiction = "mainland" | "freezone";
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

const WhatsAppSvgIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12.031 2c-5.516 0-9.969 4.453-9.969 9.969 0 1.766.469 3.484 1.344 5l-1.406 5.156 5.281-1.375c1.469.797 3.109 1.219 4.75 1.219 5.516 0 9.969-4.453 9.969-9.969S17.547 2 12.031 2zm5.813 14.125c-.25.703-1.438 1.344-2 1.422-.531.078-1.203.109-1.938-.125-.453-.141-1.031-.328-1.766-.656-3.094-1.344-5.109-4.469-5.266-4.672-.156-.203-1.266-1.688-1.266-3.219 0-1.531.797-2.281 1.078-2.594.281-.313.625-.391.828-.391.203 0 .422.016.609.016.188 0 .453-.078.703.531.266.625.891 2.188.969 2.344.078.156.125.344.031.547-.094.203-.156.344-.313.516-.156.172-.328.391-.469.516-.156.141-.313.297-.141.609.172.313.781 1.297 1.672 2.094 1.156 1.031 2.125 1.359 2.438 1.516.313.156.5.125.688-.078.188-.203.797-.922 1.016-1.234.219-.313.422-.266.719-.156.297.109 1.875.891 2.203 1.047.328.156.547.234.625.375.078.141.078.813-.172 1.516z" />
  </svg>
);

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

interface CommaNumberInputProps {
  id: string;
  label: string;
  valueStr: string;
  onChangeStr: (next: string) => void;
  allowDecimal?: boolean;
  helperText?: string;
}

const CommaNumberInput: React.FC<CommaNumberInputProps> = ({
  id,
  label,
  valueStr,
  onChangeStr,
  allowDecimal = false,
  helperText,
}) => {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-xs font-semibold text-[#cbd5e1] tracking-wide">
        {label}
      </label>
      <div className="relative flex items-center">
        <span className="absolute left-4 text-xs font-mono font-bold text-[#c5a059] pointer-events-none select-none">
          AED
        </span>
        <input
          id={id}
          type="text"
          inputMode={allowDecimal ? "decimal" : "numeric"}
          value={valueStr}
          onChange={(e) => onChangeStr(formatCommaInput(e.target.value, allowDecimal))}
          placeholder="0"
          className="w-full rounded-xl bg-[#070d19] border border-white/15 focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059] pl-14 pr-4 py-3 text-base font-mono font-semibold text-white placeholder:text-slate-500 outline-none transition-colors tabular-nums"
        />
      </div>
      {helperText && <p className="text-[11px] text-slate-400">{helperText}</p>}
    </div>
  );
};

interface ToggleSwitchProps {
  id: string;
  label: string;
  subtext: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (next: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  id,
  label,
  subtext,
  checked,
  disabled = false,
  onChange,
}) => {
  return (
    <div
      className={`flex items-center justify-between gap-4 rounded-xl border p-4 transition-colors ${
        disabled
          ? "bg-[#070d19]/60 border-white/10 opacity-70"
          : "bg-[#070d19] border-white/15 hover:border-[#c5a059]/40"
      }`}
    >
      <div className="space-y-0.5 min-w-0">
        <label
          htmlFor={id}
          className={`block text-sm font-semibold text-white ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
        >
          {label}
        </label>
        <p className="text-xs text-[#cbd5e1]/80 leading-relaxed">{subtext}</p>
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
            ? "bg-[#c5a059] border-[#c5a059]"
            : "bg-[#1a3050] border-white/20"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full transition-transform ${
            checked ? "translate-x-6 bg-[#070d19]" : "translate-x-1 bg-white"
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

  // ==========================
  // TAB 1: Corporate Tax State
  // ==========================
  const [jurisdiction, setJurisdiction] = useState<CorporateJurisdiction>("mainland");

  // Mainland inputs
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

  // Corporate Tax Calculations
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
    if (!onResultViewed) return;
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
  }, [ctResult, onResultViewed]);

  // VAT Calculations
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

  const handleBookReviewClick = (ctaType: string) => {
    if (onCtaClicked) onCtaClicked(ctaType);
    onNavigate("/#contact");
  };

  const handleCorporateWhatsApp = () => {
    if (onWhatsAppClicked) onWhatsAppClicked();
    const lines =
      ctResult.mode === "mainland"
        ? [
            `Jurisdiction: UAE Mainland`,
            `Annual Revenue: ${formatIntegerAed(ctResult.revenue)}`,
            `Taxable Profit: ${formatIntegerAed(ctResult.profit)}`,
            `Small Business Relief (0%): ${ctResult.sbrActive ? "Elected (0%)" : "Not applied"}`,
            `Estimated Corporate Tax: ${formatIntegerAed(ctResult.taxAmount)} (${ctResult.effectiveRate.toFixed(2)}% effective)`,
          ]
        : [
            `Jurisdiction: UAE Free Zone`,
            `Annual Revenue: ${formatIntegerAed(ctResult.revenue)}`,
            `Qualifying Profit: ${formatIntegerAed(ctResult.qualifyingProfit)}`,
            `Non-Qualifying Profit: ${formatIntegerAed(ctResult.nonQualifyingProfit)}`,
            `De Minimis Status: ${ctResult.deMinimisPassed ? "Passed" : "Exceeded"}`,
            `Estimated Corporate Tax: ${formatIntegerAed(ctResult.taxAmount)} (${ctResult.effectiveRate.toFixed(2)}% effective)`,
          ];
    const msg = `Hi Dias Accounting, I used the 2026 UAE Corporate Tax Calculator:\n• ${lines.join("\n• ")}\n\nI would like to book a free 15-min tax review.`;
    window.open(`https://wa.me/971529226958?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
  };

  const handleVatWhatsApp = () => {
    if (onWhatsAppClicked) onWhatsAppClicked();
    const msg = `Hi Dias Accounting, I used the 5% UAE VAT Calculator:\n• Mode: ${vatMode === "add" ? "Add VAT (Excl. -> Incl.)" : "Extract VAT (Incl. -> Excl.)"}\n• Expense Category: ${selectedCategory.label}\n• Net (excl. VAT): ${formatDecimalAed(vatResult.netAmount)}\n• VAT Amount: ${formatDecimalAed(vatResult.vatAmount)}\n• Gross (incl. VAT): ${formatDecimalAed(vatResult.grossAmount)}\n• Recovery Treatment: ${selectedCategory.treatmentLabel}\n\nPlease share a Form 201 VAT audit check.`;
    window.open(`https://wa.me/971529226958?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="space-y-8">
      {/* Top Tab Switcher */}
      <div className="flex justify-center">
        <div
          role="tablist"
          aria-label="UAE Tax Calculator Tools"
          className="inline-flex w-full sm:w-auto flex-col sm:flex-row gap-1.5 p-1.5 rounded-2xl bg-[#0d1b2a] border border-[#c5a059]/40 shadow-xl"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "corporate-tax"}
            onClick={() => setActiveTab("corporate-tax")}
            className={`px-6 py-3 rounded-xl text-sm font-display font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === "corporate-tax"
                ? "bg-[#c5a059] text-[#070d19] shadow-md"
                : "text-[#cbd5e1] hover:text-white hover:bg-white/5"
            }`}
          >
            <Calculator className="w-4 h-4 shrink-0" />
            <span>Corporate Tax Calculator</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "vat"}
            onClick={() => setActiveTab("vat")}
            className={`px-6 py-3 rounded-xl text-sm font-display font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === "vat"
                ? "bg-[#c5a059] text-[#070d19] shadow-md"
                : "text-[#cbd5e1] hover:text-white hover:bg-white/5"
            }`}
          >
            <Percent className="w-4 h-4 shrink-0" />
            <span>5% UAE VAT Calculator</span>
          </button>
        </div>
      </div>

      {/* ================================================= */}
      {/* TAB 1: UAE Corporate Tax Calculator               */}
      {/* ================================================= */}
      {activeTab === "corporate-tax" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* LEFT CARD: Your Numbers */}
          <div className="lg:col-span-6 bg-[#0d1b2a] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-white/10">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-widest text-[#c5a059] font-bold block">
                    Live Inputs
                  </span>
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-white mt-0.5">
                    Your Numbers
                  </h2>
                </div>

                {/* Mainland | Free Zone Segmented Pill */}
                <div
                  role="group"
                  aria-label="Entity Jurisdiction"
                  className="inline-flex p-1 rounded-xl bg-[#070d19] border border-white/15 self-start sm:self-auto"
                >
                  <button
                    type="button"
                    onClick={() => setJurisdiction("mainland")}
                    className={`px-4 py-2 rounded-lg text-xs font-display font-bold transition-all cursor-pointer ${
                      jurisdiction === "mainland"
                        ? "bg-[#c5a059] text-[#070d19] shadow-sm"
                        : "text-[#cbd5e1] hover:text-white"
                    }`}
                  >
                    Mainland
                  </button>
                  <button
                    type="button"
                    onClick={() => setJurisdiction("freezone")}
                    className={`px-4 py-2 rounded-lg text-xs font-display font-bold transition-all cursor-pointer ${
                      jurisdiction === "freezone"
                        ? "bg-[#c5a059] text-[#070d19] shadow-sm"
                        : "text-[#cbd5e1] hover:text-white"
                    }`}
                  >
                    Free Zone
                  </button>
                </div>
              </div>

              {jurisdiction === "mainland" ? (
                <div className="space-y-5">
                  <CommaNumberInput
                    id="ct-mainland-revenue"
                    label="Annual Revenue (AED)"
                    valueStr={mainlandRevenueStr}
                    onChangeStr={setMainlandRevenueStr}
                  />

                  <CommaNumberInput
                    id="ct-mainland-profit"
                    label="Taxable Profit (AED)"
                    valueStr={mainlandProfitStr}
                    onChangeStr={setMainlandProfitStr}
                  />

                  <ToggleSwitch
                    id="ct-mainland-sbr"
                    label="Small Business Relief (0% CT)"
                    subtext={
                      ctResult.mode === "mainland" && ctResult.isRevenueWithinSbrCap
                        ? "Available up to AED 3M revenue through 2029"
                        : "Revenue is above the AED 3M cap"
                    }
                    checked={ctResult.mode === "mainland" ? ctResult.sbrActive : false}
                    disabled={ctResult.mode === "mainland" ? !ctResult.isRevenueWithinSbrCap : true}
                    onChange={setSbrPreferred}
                  />
                </div>
              ) : (
                <div className="space-y-5">
                  <CommaNumberInput
                    id="ct-fz-revenue"
                    label="Annual Revenue (AED)"
                    valueStr={fzRevenueStr}
                    onChangeStr={setFzRevenueStr}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <CommaNumberInput
                      id="ct-fz-qualifying-profit"
                      label="Qualifying Taxable Profit (AED)"
                      valueStr={fzQualifyingProfitStr}
                      onChangeStr={setFzQualifyingProfitStr}
                    />
                    <CommaNumberInput
                      id="ct-fz-non-qualifying-profit"
                      label="Non-Qualifying Taxable Profit (AED)"
                      valueStr={fzNonQualifyingProfitStr}
                      onChangeStr={setFzNonQualifyingProfitStr}
                    />
                  </div>

                  <div className="space-y-3">
                    <CommaNumberInput
                      id="ct-fz-non-qualifying-revenue"
                      label="Non-Qualifying Revenue (AED)"
                      valueStr={fzNonQualifyingRevenueStr}
                      onChangeStr={setFzNonQualifyingRevenueStr}
                    />

                    {/* De Minimis Progress Bar */}
                    {ctResult.mode === "freezone" && (
                      <div className="rounded-xl bg-[#070d19] border border-white/10 p-3.5 space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                          <span className="font-semibold text-[#cbd5e1]">
                            De Minimis Test (5% of Revenue or AED 5M cap)
                          </span>
                          <span
                            className={`font-mono font-bold ${
                              ctResult.deMinimisPassed ? "text-[#c5a059]" : "text-rose-400"
                            }`}
                          >
                            {formatIntegerAed(ctResult.nonQualifyingRevenue)} /{" "}
                            {formatIntegerAed(ctResult.deMinimisCap)}
                          </span>
                        </div>
                        <div className="h-2.5 w-full rounded-full bg-white/10 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              ctResult.deMinimisPassed ? "bg-[#c5a059]" : "bg-rose-500"
                            }`}
                            style={{ width: `${Math.max(2, ctResult.deMinimisRatio)}%` }}
                          />
                        </div>
                        <p
                          className={`text-[11px] font-medium ${
                            ctResult.deMinimisPassed ? "text-emerald-400" : "text-rose-400"
                          }`}
                        >
                          {ctResult.deMinimisPassed
                            ? `Within De Minimis threshold (${ctResult.deMinimisRatio.toFixed(1)}% of limit used)`
                            : "De Minimis threshold exceeded — 0% QFZP status lost for this period"}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <ToggleSwitch
                      id="ct-fz-qfzp"
                      label="Qualifying Free Zone Person (QFZP)"
                      subtext="Substance, audited accounts, transfer pricing"
                      checked={isQfzp}
                      onChange={setIsQfzp}
                    />
                    <ToggleSwitch
                      id="ct-fz-sbr"
                      label="Small Business Relief"
                      subtext="Not available alongside Free Zone 0%"
                      checked={false}
                      disabled={true}
                      onChange={() => {}}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-white/10 flex items-start gap-2.5 text-[11px] text-slate-400">
              <Info className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
              <span>
                Calculates instantly on every keystroke using UAE Federal Decree-Law No. 47 of 2022 &amp; Cabinet
                Decision No. 100 of 2023.
              </span>
            </div>
          </div>

          {/* RIGHT CARD: Estimated Corporate Tax + Conversion Box */}
          <div className="lg:col-span-6 bg-[#0d1b2a] border border-[#c5a059]/60 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              {/* Hero Estimated Output */}
              <div className="space-y-3 pb-5 border-b border-white/10">
                <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#dec18c] font-bold block">
                  ESTIMATED CORPORATE TAX
                </span>

                <div className="font-display text-4xl sm:text-5xl font-extrabold text-[#c5a059] tabular-nums tracking-tight">
                  {formatIntegerAed(ctResult.taxAmount)}
                </div>

                {/* Status Pill Badges */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {ctResult.mode === "mainland" ? (
                    ctResult.sbrActive ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-xs font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Mainland · 0% Small Business Relief elected
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[#cbd5e1] text-xs font-semibold">
                        <Building2 className="w-3.5 h-3.5 text-[#c5a059]" />
                        Mainland, standard rates
                      </span>
                    )
                  ) : (
                    <>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[#cbd5e1] text-xs font-semibold">
                        <Building2 className="w-3.5 h-3.5 text-[#c5a059]" />
                        {isQfzp ? "Qualifying Free Zone Person" : "Free Zone · Standard 9% Regime"}
                      </span>
                      {isQfzp && (
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${
                            ctResult.deMinimisPassed
                              ? "bg-emerald-500/15 border-emerald-400/40 text-emerald-300"
                              : "bg-rose-500/15 border-rose-400/40 text-rose-300"
                          }`}
                        >
                          {ctResult.deMinimisPassed ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              De minimis passed
                            </>
                          ) : (
                            <>
                              <ShieldAlert className="w-3.5 h-3.5" />
                              De minimis exceeded — 9% applies above AED 375k
                            </>
                          )}
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Itemized Breakdown Rows */}
              <div className="divide-y divide-white/10 text-sm">
                {ctResult.mode === "mainland" ? (
                  <>
                    <div className="py-3 flex items-center justify-between gap-4">
                      <span className="text-[#cbd5e1]">Taxable profit</span>
                      <span className="font-mono font-semibold text-white tabular-nums">
                        {formatIntegerAed(ctResult.profit)}
                      </span>
                    </div>
                    <div className="py-3 flex items-center justify-between gap-4">
                      <span className="text-[#cbd5e1]">
                        {ctResult.sbrActive
                          ? "Small Business Relief (0% up to AED 3M revenue)"
                          : "First AED 375,000 at 0%"}
                      </span>
                      <span className="font-mono font-semibold text-emerald-400 tabular-nums">
                        AED 0
                      </span>
                    </div>
                    <div className="py-3 flex items-center justify-between gap-4">
                      <span className="text-[#cbd5e1]">
                        Above AED 375,000 at 9%{" "}
                        {!ctResult.sbrActive && ctResult.nineBandProfit > 0
                          ? `(${formatIntegerAed(ctResult.nineBandProfit)})`
                          : ""}
                      </span>
                      <span className="font-mono font-semibold text-white tabular-nums">
                        {formatIntegerAed(ctResult.taxAmount)}
                      </span>
                    </div>
                  </>
                ) : ctResult.qfzpZeroApplies ? (
                  <>
                    <div className="py-3 flex items-center justify-between gap-4">
                      <span className="text-[#cbd5e1]">
                        Qualifying income at 0% ({formatIntegerAed(ctResult.qualifyingProfit)})
                      </span>
                      <span className="font-mono font-semibold text-emerald-400 tabular-nums">
                        AED 0
                      </span>
                    </div>
                    <div className="py-3 flex items-center justify-between gap-4">
                      <span className="text-[#cbd5e1]">
                        Non-qualifying income at 9%{" "}
                        <span className="block text-[11px] text-slate-400">
                          No AED 375,000 band for QFZPs ({formatIntegerAed(ctResult.nonQualifyingProfit)})
                        </span>
                      </span>
                      <span className="font-mono font-semibold text-white tabular-nums">
                        {formatIntegerAed(ctResult.taxAmount)}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="py-3 flex items-center justify-between gap-4">
                      <span className="text-[#cbd5e1]">Total taxable profit</span>
                      <span className="font-mono font-semibold text-white tabular-nums">
                        {formatIntegerAed(ctResult.totalProfit)}
                      </span>
                    </div>
                    <div className="py-3 flex items-center justify-between gap-4">
                      <span className="text-[#cbd5e1]">First AED 375,000 at 0%</span>
                      <span className="font-mono font-semibold text-emerald-400 tabular-nums">
                        AED 0
                      </span>
                    </div>
                    <div className="py-3 flex items-center justify-between gap-4">
                      <span className="text-[#cbd5e1]">
                        Above AED 375,000 at 9%{" "}
                        {ctResult.nineBandProfit > 0 ? `(${formatIntegerAed(ctResult.nineBandProfit)})` : ""}
                      </span>
                      <span className="font-mono font-semibold text-white tabular-nums">
                        {formatIntegerAed(ctResult.taxAmount)}
                      </span>
                    </div>
                  </>
                )}

                <div className="py-3.5 flex items-center justify-between gap-4">
                  <span className="font-bold text-white">Corporate tax</span>
                  <span className="font-mono font-extrabold text-[#c5a059] text-base tabular-nums">
                    {formatIntegerAed(ctResult.taxAmount)}
                  </span>
                </div>

                <div className="pt-3 flex items-center justify-between gap-4">
                  <span className="text-[#cbd5e1]">Effective rate on profit (%)</span>
                  <span className="font-mono font-bold text-white tabular-nums">
                    {ctResult.effectiveRate.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Dias Accounting Lead Conversion Box */}
            <div className="rounded-2xl bg-[#070d19] border border-[#c5a059]/50 p-5 sm:p-6 space-y-4">
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#c5a059] block">
                  OPTIMIZE &amp; FILE WITH AN FTA-REGISTERED TAX AGENT
                </span>
                <h3 className="font-display text-lg sm:text-xl font-bold text-white">
                  Lock In Your 2026 Corporate Tax Filing
                </h3>
                <p className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed">
                  Avoid the AED 10,000 late-registration penalty and ensure your IFRS accounts &amp; QFZP schedules
                  pass FTA review. Fixed-fee plans from AED 400/month.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => handleBookReviewClick("ct-review")}
                  className="flex-1 bg-[#c5a059] hover:bg-[#dec18c] text-[#070d19] font-display font-bold px-5 py-3 rounded-xl text-xs sm:text-sm transition-all cursor-pointer inline-flex items-center justify-center gap-2 shadow-lg shadow-[#c5a059]/15"
                >
                  <span>Book Free 15-Min Tax Review</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>

                <button
                  type="button"
                  onClick={handleCorporateWhatsApp}
                  className="flex-1 border border-[#c5a059]/70 hover:border-[#c5a059] hover:bg-[#c5a059]/10 text-[#dec18c] hover:text-white font-display font-semibold px-4 py-3 rounded-xl text-xs sm:text-sm transition-all cursor-pointer inline-flex items-center justify-center gap-2"
                >
                  <WhatsAppSvgIcon className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>WhatsApp an Advisor (+971 52 922 6958)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* TAB 2: UAE 5% VAT & Input Recovery Calculator     */}
      {/* ================================================= */}
      {activeTab === "vat" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* LEFT CARD: Calculate 5% VAT for UAE */}
          <div className="lg:col-span-6 bg-[#0d1b2a] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              <div className="pb-5 border-b border-white/10">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#c5a059] font-bold block">
                  5% UAE Value Added Tax
                </span>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-white mt-0.5">
                  Calculate 5% VAT for UAE
                </h2>
              </div>

              <CommaNumberInput
                id="vat-amount-input"
                label="Amount (AED)"
                valueStr={vatAmountStr}
                onChangeStr={setVatAmountStr}
                allowDecimal={true}
              />

              {/* Searchable Expense Category Dropdown */}
              <div className="space-y-1.5" ref={dropdownRef}>
                <label
                  htmlFor="vat-category-trigger"
                  className="block text-xs font-semibold text-[#cbd5e1] tracking-wide"
                >
                  Expense Category (auto-sets VAT recovery treatment)
                </label>

                <div className="relative">
                  <button
                    id="vat-category-trigger"
                    type="button"
                    aria-expanded={categoryOpen}
                    onClick={() => setCategoryOpen((prev) => !prev)}
                    className="w-full rounded-xl bg-[#070d19] border border-white/15 hover:border-[#c5a059]/60 focus:border-[#c5a059] px-4 py-3 text-left flex items-center justify-between gap-3 cursor-pointer transition-colors"
                  >
                    <div className="min-w-0">
                      <span className="block text-sm font-semibold text-white truncate">
                        {selectedCategory.label}
                      </span>
                      <span
                        className={`block text-[11px] mt-0.5 ${
                          selectedCategory.recovery === "reclaimable"
                            ? "text-emerald-400"
                            : selectedCategory.recovery === "blocked"
                              ? "text-rose-400"
                              : "text-[#dec18c]"
                        }`}
                      >
                        {selectedCategory.treatmentLabel}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-[#c5a059] shrink-0 transition-transform ${
                        categoryOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {categoryOpen && (
                    <div className="absolute z-30 mt-2 w-full rounded-2xl bg-[#070d19] border border-[#c5a059]/60 shadow-2xl overflow-hidden">
                      <div className="p-2.5 border-b border-white/10">
                        <div className="relative flex items-center">
                          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                          <input
                            type="text"
                            value={categorySearch}
                            onChange={(e) => setCategorySearch(e.target.value)}
                            placeholder="Search expense category..."
                            className="w-full rounded-lg bg-[#0d1b2a] border border-white/10 focus:border-[#c5a059] pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-400 outline-none"
                          />
                        </div>
                      </div>

                      <div className="max-h-64 overflow-y-auto divide-y divide-white/5">
                        {filteredCategories.length === 0 ? (
                          <div className="p-4 text-xs text-slate-400 text-center">
                            No matching expense category found.
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
                                  isSelected ? "bg-[#c5a059]/15" : "hover:bg-white/5"
                                }`}
                              >
                                <div className="min-w-0">
                                  <span className="block text-xs sm:text-sm font-semibold text-white">
                                    {cat.label}
                                  </span>
                                  <span
                                    className={`block text-[11px] mt-0.5 ${
                                      cat.recovery === "reclaimable"
                                        ? "text-emerald-400"
                                        : cat.recovery === "blocked"
                                          ? "text-rose-400"
                                          : "text-[#dec18c]"
                                    }`}
                                  >
                                    {cat.treatmentLabel}
                                  </span>
                                </div>
                                {isSelected && <CheckCircle2 className="w-4 h-4 text-[#c5a059] shrink-0" />}
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

            {/* Bottom Summary Card */}
            <div className="rounded-2xl bg-[#070d19] border border-white/15 p-5 divide-y divide-white/10">
              <div className="pb-3 flex items-center justify-between gap-4">
                <span className="text-xs sm:text-sm text-[#cbd5e1]">Net (excl. VAT)</span>
                <span className="font-mono text-base sm:text-lg font-bold text-white tabular-nums">
                  {formatDecimalAed(vatResult.netAmount)}
                </span>
              </div>
              <div className="pt-3 flex items-center justify-between gap-4">
                <span className="text-xs sm:text-sm text-[#cbd5e1]">Gross (incl. VAT)</span>
                <span className="font-mono text-base sm:text-lg font-bold text-[#dec18c] tabular-nums">
                  {formatDecimalAed(vatResult.grossAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT CARD: VAT Amount & FTA Recovery Check */}
          <div className="lg:col-span-6 bg-[#0d1b2a] border border-[#c5a059]/60 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              {/* Top Mode Toggle */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-white/10">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-widest text-[#dec18c] font-bold block">
                    FTA Input Recovery
                  </span>
                  <h3 className="font-display text-lg sm:text-xl font-bold text-white mt-0.5">
                    VAT Amount &amp; FTA Recovery Check
                  </h3>
                </div>

                <div
                  role="group"
                  aria-label="VAT Calculation Mode"
                  className="inline-flex p-1 rounded-xl bg-[#070d19] border border-white/15 self-start sm:self-auto"
                >
                  <button
                    type="button"
                    onClick={() => setVatMode("add")}
                    className={`px-3 py-2 rounded-lg text-xs font-display font-bold transition-all cursor-pointer ${
                      vatMode === "add"
                        ? "bg-[#c5a059] text-[#070d19] shadow-sm"
                        : "text-[#cbd5e1] hover:text-white"
                    }`}
                  >
                    Add VAT (Excl. → Incl.)
                  </button>
                  <button
                    type="button"
                    onClick={() => setVatMode("extract")}
                    className={`px-3 py-2 rounded-lg text-xs font-display font-bold transition-all cursor-pointer ${
                      vatMode === "extract"
                        ? "bg-[#c5a059] text-[#070d19] shadow-sm"
                        : "text-[#cbd5e1] hover:text-white"
                    }`}
                  >
                    Extract VAT (Incl. → Excl.)
                  </button>
                </div>
              </div>

              {/* Large Hero VAT Number */}
              <div className="space-y-3">
                <span className="text-xs font-mono uppercase tracking-wider text-[#cbd5e1] block">
                  {vatMode === "add" ? "5% UAE VAT Added" : "5% UAE VAT Extracted"}
                </span>
                <div className="font-display text-4xl sm:text-5xl font-extrabold text-[#c5a059] tabular-nums tracking-tight">
                  {formatDecimalAed(vatResult.vatAmount)}
                </div>

                {/* Recovery Status Badge & FTA Rule Note */}
                {vatResult.recovery === "reclaimable" && (
                  <div className="rounded-2xl bg-emerald-500/10 border border-emerald-400/35 p-4 space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Reclaimable</span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed">
                      You could reclaim <strong className="text-white">{formatDecimalAed(vatResult.vatAmount)}</strong>{" "}
                      on this expense (ensure supplier TRN &amp; FTA Decision 13/2026 due diligence are documented).
                    </p>
                  </div>
                )}

                {vatResult.recovery === "blocked" && (
                  <div className="rounded-2xl bg-rose-500/10 border border-rose-400/35 p-4 space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold">
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Non-Reclaimable (Blocked Input VAT)</span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed">
                      Client entertainment and personal-use vehicles cannot be reclaimed on Form 201.
                    </p>
                  </div>
                )}

                {vatResult.recovery === "zero-rated" && (
                  <div className="rounded-2xl bg-white/5 border border-white/15 p-4 space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-[#dec18c] text-xs font-bold">
                      <Info className="w-3.5 h-3.5" />
                      <span>Zero-Rated (0% VAT)</span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed">
                      International commercial flights are zero-rated (0% VAT) under Article 45 of the UAE VAT Law, so{" "}
                      <strong className="text-white">AED 0.00</strong> VAT is charged or reclaimed on Form 201.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Conversion CTA */}
            <div className="rounded-2xl bg-[#070d19] border border-[#c5a059]/50 p-5 sm:p-6 space-y-3">
              <p className="text-xs text-[#cbd5e1] leading-relaxed">
                Unsure whether supplier invoices meet FTA Tax Invoice &amp; Input Recovery standards under Cabinet
                Decision rules? Have our FTA-registered team verify your VAT 201 return.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => handleBookReviewClick("vat-form-201-audit")}
                  className="flex-1 bg-[#c5a059] hover:bg-[#dec18c] text-[#070d19] font-display font-bold px-5 py-3.5 rounded-xl text-xs sm:text-sm transition-all cursor-pointer inline-flex items-center justify-center gap-2 shadow-lg shadow-[#c5a059]/15"
                >
                  <span>Get a Free Form 201 VAT Audit Check</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>
                <button
                  type="button"
                  onClick={handleVatWhatsApp}
                  className="border border-[#c5a059]/70 hover:border-[#c5a059] hover:bg-[#c5a059]/10 text-[#dec18c] hover:text-white font-display font-semibold px-4 py-3.5 rounded-xl text-xs sm:text-sm transition-all cursor-pointer inline-flex items-center justify-center gap-2"
                >
                  <WhatsAppSvgIcon className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>WhatsApp Check</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UaeTaxCalculatorSuite;

import React, { useEffect, useState, useMemo } from "react";
import {
  Calculator,
  Percent,
  Calendar,
  Shield,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Download,
  Phone,
  Mail,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  FileCheck2,
  DollarSign,
  Building,
  Scale,
  Sparkles,
  Info,
  Clock,
  Briefcase,
} from "lucide-react";
import PageNavigation from "../components/PageNavigation";
import PageFooter from "../components/PageFooter";
import { useLanguage } from "../i18n/LanguageContext";

interface TaxPlannerPageProps {
  onNavigate: (path: string) => void;
  onOpenAudit?: () => void;
  onOpenPrivacy?: () => void;
  onOpenGooglePreferred?: () => void;
}

type PlannerTab = "corporate-tax" | "vat-planner" | "deadline-calculator";

export const TaxPlannerPage: React.FC<TaxPlannerPageProps> = ({
  onNavigate,
  onOpenAudit,
  onOpenPrivacy,
  onOpenGooglePreferred,
}) => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<PlannerTab>("corporate-tax");

  // Corporate Tax State
  const [annualRevenue, setAnnualRevenue] = useState<number>(1500000);
  const [deductibleExpenses, setDeductibleExpenses] = useState<number>(850000);
  const [exemptIncome, setExemptIncome] = useState<number>(0);
  const [companyType, setCompanyType] = useState<"mainland" | "freezone-standard" | "freezone-qfzp">("mainland");
  const [applySBR, setApplySBR] = useState<boolean>(true);

  // VAT State
  const [standardVatSales, setStandardVatSales] = useState<number>(1200000);
  const [zeroRatedSales, setZeroRatedSales] = useState<number>(300000);
  const [vatExpenses, setVatExpenses] = useState<number>(600000);

  // Deadline Planner State
  const [financialYearEndMonth, setFinancialYearEndMonth] = useState<string>("12"); // December
  const [financialYear, setFinancialYear] = useState<number>(2025);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    document.title = "UAE Tax Planner & Corporate Tax Calculator 2026 | Dias UAE";
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  // Format currency
  const formatAED = (amount: number) => {
    const locale = language === "ar" ? "ar-AE" : "en-AE";
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "AED",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Corporate Tax Computations under Federal Decree-Law No. 47 of 2022
  const ctCalculation = useMemo(() => {
    const netProfit = Math.max(0, annualRevenue - deductibleExpenses - exemptIncome);
    const SBR_THRESHOLD = 3000000;
    const STATUTORY_EXEMPT_THRESHOLD = 375000;
    const CT_RATE = 0.09;

    const qualifiesForSBR = annualRevenue <= SBR_THRESHOLD && companyType !== "freezone-qfzp";
    const sbrElected = qualifiesForSBR && applySBR;

    let taxableProfit = netProfit;
    let taxLiability = 0;
    let tier0Profit = 0;
    let tier9Profit = 0;

    if (companyType === "freezone-qfzp") {
      // 0% on Qualifying Income
      taxLiability = 0;
      tier0Profit = netProfit;
      tier9Profit = 0;
    } else if (sbrElected) {
      // Small Business Relief elected under Ministerial Decision No. 73/2023
      taxLiability = 0;
      tier0Profit = netProfit;
      tier9Profit = 0;
    } else {
      if (netProfit <= STATUTORY_EXEMPT_THRESHOLD) {
        tier0Profit = netProfit;
        tier9Profit = 0;
        taxLiability = 0;
      } else {
        tier0Profit = STATUTORY_EXEMPT_THRESHOLD;
        tier9Profit = netProfit - STATUTORY_EXEMPT_THRESHOLD;
        taxLiability = tier9Profit * CT_RATE;
      }
    }

    const effectiveRate = netProfit > 0 ? (taxLiability / netProfit) * 100 : 0;
    const standardWithoutRelief = netProfit > STATUTORY_EXEMPT_THRESHOLD
      ? (netProfit - STATUTORY_EXEMPT_THRESHOLD) * CT_RATE
      : 0;
    const totalTaxSaved = sbrElected || companyType === "freezone-qfzp"
      ? standardWithoutRelief
      : 0;

    return {
      netProfit,
      qualifiesForSBR,
      sbrElected,
      tier0Profit,
      tier9Profit,
      taxLiability: Math.round(taxLiability),
      effectiveRate: parseFloat(effectiveRate.toFixed(2)),
      totalTaxSaved: Math.round(totalTaxSaved),
    };
  }, [annualRevenue, deductibleExpenses, exemptIncome, companyType, applySBR]);

  // VAT Computations under Federal Decree-Law No. 8 of 2017
  const vatCalculation = useMemo(() => {
    const VAT_RATE = 0.05;
    const totalSales = standardVatSales + zeroRatedSales;
    const outputVat = standardVatSales * VAT_RATE;
    const inputVat = vatExpenses * VAT_RATE;
    const netVatPayable = outputVat - inputVat;

    const MANDATORY_THRESHOLD = 375000;
    const VOLUNTARY_THRESHOLD = 187500;

    let registrationStatus = "Exempt / Below Threshold";
    if (totalSales >= MANDATORY_THRESHOLD) {
      registrationStatus = "Mandatory VAT Registration Required";
    } else if (totalSales >= VOLUNTARY_THRESHOLD) {
      registrationStatus = "Eligible for Voluntary Registration";
    }

    return {
      totalSales,
      outputVat: Math.round(outputVat),
      inputVat: Math.round(inputVat),
      netVatPayable: Math.round(netVatPayable),
      isRefund: netVatPayable < 0,
      registrationStatus,
    };
  }, [standardVatSales, zeroRatedSales, vatExpenses]);

  // Statutory Filing Deadlines Computation (9 months from Financial Year End)
  const deadlineCalculation = useMemo(() => {
    const monthIndex = parseInt(financialYearEndMonth, 10) - 1;
    const yearEnd = new Date(financialYear, monthIndex + 1, 0); // Last day of chosen month

    // CT deadline is 9 months after financial year end
    const ctFilingDate = new Date(yearEnd);
    ctFilingDate.setMonth(ctFilingDate.getMonth() + 9);
    // Last day of that 9th month
    const finalCtDeadline = new Date(ctFilingDate.getFullYear(), ctFilingDate.getMonth() + 1, 0);

    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
    const locale = language === "ar" ? "ar-AE" : "en-US";

    return {
      financialYearEndStr: yearEnd.toLocaleDateString(locale, options),
      ctDeadlineStr: finalCtDeadline.toLocaleDateString(locale, options),
      penaltyRisk: "Cabinet Decision No. 75/2023 imposes an immediate AED 10,000 administrative fine for failing to register for Corporate Tax prior to your FTA deadline.",
    };
  }, [financialYearEndMonth, financialYear, language]);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqItems = [
    {
      q: "Can my business elect for 0% Small Business Relief (SBR) in 2026?",
      a: "Yes. Under UAE Ministerial Decision No. 73 of 2023 (extended through December 31, 2029), taxable resident businesses with revenue up to AED 3,000,000 can elect for Small Business Relief. When elected, your taxable income is treated as AED 0, resulting in zero corporate tax liability. However, you must still maintain IFRS-compliant books and file your annual tax return.",
    },
    {
      q: "How does the AED 375,000 0% statutory threshold apply?",
      a: "Under Federal Decree-Law No. 47 of 2022, every UAE resident business benefits from a 0% corporate tax rate on the first AED 375,000 of taxable net profit. Any taxable profit exceeding AED 375,000 is subject to the standard 9% rate.",
    },
    {
      q: "Are Free Zone companies completely exempt from UAE Corporate Tax?",
      a: "No. 100% of UAE Free Zone companies are legally required to register for Corporate Tax and submit an annual return. To benefit from the 0% rate on Qualifying Income (QFZP status), you must meet strict conditions: maintain adequate substance in the Free Zone, derive qualifying income, obtain audited financial statements, and satisfy arm's-length transfer pricing rules.",
    },
    {
      q: "What expenses are non-deductible or capped for UAE Corporate Tax?",
      a: "Client entertainment expenses are capped at 50% deductibility. Government fines, penalties, and non-business expenses are 100% non-deductible. Net interest expenditure is capped at 30% of adjusted EBITDA under general interest deduction limitation rules.",
    },
    {
      q: "When must I register for UAE VAT and what is the rate?",
      a: "The standard UAE VAT rate is 5%. Registration is mandatory if your taxable supplies and imports exceed AED 375,000 over the preceding 12 months or are expected to exceed that threshold in the next 30 days. Voluntary registration is available at AED 187,500.",
    },
  ];

  const shareCalculationOnWhatsApp = () => {
    let msg = `Hello Dias Accounting,\nI used your UAE Tax Planner for my company:\n`;
    if (activeTab === "corporate-tax") {
      msg += `• Annual Revenue: ${formatAED(annualRevenue)}\n• Estimated Net Profit: ${formatAED(ctCalculation.netProfit)}\n• Estimated CT Liability: ${formatAED(ctCalculation.taxLiability)}\n• Company Type: ${companyType}\n`;
    } else if (activeTab === "vat-planner") {
      msg += `• Annual Sales: ${formatAED(vatCalculation.totalSales)}\n• Net VAT Position: ${formatAED(vatCalculation.netVatPayable)}\n`;
    }
    msg += `I would like to schedule an assessment with Glen Dias for our 2026 filing.`;
    window.open(`https://wa.me/971529226958?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased selection:bg-gold-500/30 selection:text-navy-950">
      <PageNavigation
        currentPath="/uae-tax-planner"
        onNavigate={onNavigate}
        onOpenAudit={onOpenAudit}
      />

      <main id="main-content">
        {/* 1. Hero Header Section */}
        <section className="relative bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 text-white py-16 lg:py-24 border-b border-gold-500/20 overflow-hidden">
          {/* Subtle Ambient Brand Glow */}
          <div className="absolute -top-32 right-0 w-[500px] h-[500px] bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-navy-800/40 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-xs font-mono text-gold-400 mb-4">
              <button
                type="button"
                onClick={() => onNavigate("/")}
                className="hover:underline cursor-pointer"
              >
                Home
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-white">UAE Tax Planner &amp; Compliance Hub</span>
            </div>

            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/10 border border-gold-400/30 text-gold-300 text-xs font-semibold uppercase tracking-wider mb-6">
                <Shield className="w-4 h-4 text-gold-400 shrink-0" />
                <span>Federal Decree-Law No. 47 &amp; EmaraTax Ready</span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-6 leading-tight">
                UAE Tax Planner &amp; <span className="text-gold-400">Corporate Tax Calculator</span>
              </h1>

              <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-8">
                Model your 2026 UAE Corporate Tax liability, Small Business Relief (0% up to AED 3M), Free Zone QFZP eligibility, 5% VAT cashflow, and EmaraTax statutory deadlines in seconds with Glen Dias Chartered Accountants.
              </p>

              {/* Key Highlights Metrics Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10">
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <span className="block text-xl sm:text-2xl font-mono font-bold text-gold-400">0%</span>
                  <span className="text-[11px] text-slate-300">Profit up to AED 375K</span>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <span className="block text-xl sm:text-2xl font-mono font-bold text-gold-400">9%</span>
                  <span className="text-[11px] text-slate-300">Standard CT on Excess</span>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <span className="block text-xl sm:text-2xl font-mono font-bold text-gold-400">AED 3M</span>
                  <span className="text-[11px] text-slate-300">0% SBR Relief Limit</span>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <span className="block text-xl sm:text-2xl font-mono font-bold text-emerald-400">5%</span>
                  <span className="text-[11px] text-slate-300">UAE Standard VAT</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Interactive Tax Planner Suite */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tool Navigation Tabs */}
          <div className="flex flex-wrap justify-center gap-2 p-1.5 bg-slate-200/80 rounded-2xl max-w-2xl mx-auto mb-12 shadow-inner">
            <button
              type="button"
              onClick={() => setActiveTab("corporate-tax")}
              className={`flex-1 min-w-[130px] py-3 px-4 rounded-xl text-xs sm:text-sm font-display font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === "corporate-tax"
                  ? "bg-navy-950 text-white shadow-md"
                  : "text-slate-700 hover:text-navy-950 hover:bg-slate-300/40"
              }`}
            >
              <Calculator className="w-4 h-4 text-gold-400" />
              <span>Corporate Tax (9%)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("vat-planner")}
              className={`flex-1 min-w-[130px] py-3 px-4 rounded-xl text-xs sm:text-sm font-display font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === "vat-planner"
                  ? "bg-navy-950 text-white shadow-md"
                  : "text-slate-700 hover:text-navy-950 hover:bg-slate-300/40"
              }`}
            >
              <Percent className="w-4 h-4 text-emerald-500" />
              <span>VAT (5%)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("deadline-calculator")}
              className={`flex-1 min-w-[130px] py-3 px-4 rounded-xl text-xs sm:text-sm font-display font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === "deadline-calculator"
                  ? "bg-navy-950 text-white shadow-md"
                  : "text-slate-700 hover:text-navy-950 hover:bg-slate-300/40"
              }`}
            >
              <Calendar className="w-4 h-4 text-gold-500" />
              <span>FTA Deadlines</span>
            </button>
          </div>

          {/* TAB 1: Corporate Tax Estimator */}
          {activeTab === "corporate-tax" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Input Form Column (7 Cols) */}
              <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
                <div>
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-navy-950">
                    Corporate Tax Parameters (2026 Rules)
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Adjust your turnover, operational expenditures, and jurisdiction to estimate liability.
                  </p>
                </div>

                {/* Company Type Selection */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-navy-900 font-mono">
                    Jurisdiction &amp; Entity Classification
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setCompanyType("mainland")}
                      className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                        companyType === "mainland"
                          ? "border-gold-500 bg-gold-50/30 text-navy-950 font-bold ring-1 ring-gold-500"
                          : "border-slate-200 hover:border-slate-300 text-slate-700"
                      }`}
                    >
                      <span className="block font-semibold">Mainland LLC</span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">Standard 0% / 9%</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCompanyType("freezone-standard")}
                      className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                        companyType === "freezone-standard"
                          ? "border-gold-500 bg-gold-50/30 text-navy-950 font-bold ring-1 ring-gold-500"
                          : "border-slate-200 hover:border-slate-300 text-slate-700"
                      }`}
                    >
                      <span className="block font-semibold">Free Zone (Standard)</span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">Non-Qualifying / General</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCompanyType("freezone-qfzp")}
                      className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                        companyType === "freezone-qfzp"
                          ? "border-gold-500 bg-gold-50/30 text-navy-950 font-bold ring-1 ring-gold-500"
                          : "border-slate-200 hover:border-slate-300 text-slate-700"
                      }`}
                    >
                      <span className="block font-semibold">Free Zone (QFZP)</span>
                      <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">0% Qualifying Income</span>
                    </button>
                  </div>
                </div>

                {/* Annual Revenue Slider & Input */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-bold text-navy-900">
                      Annual Gross Turnover / Revenue (AED)
                    </label>
                    <span className="font-mono font-bold text-gold-600 text-sm">
                      {formatAED(annualRevenue)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="100000"
                    max="10000000"
                    step="50000"
                    value={annualRevenue}
                    onChange={(e) => setAnnualRevenue(Number(e.target.value))}
                    className="w-full accent-gold-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>AED 100K</span>
                    <span>AED 3M (SBR Cap)</span>
                    <span>AED 10M+</span>
                  </div>
                </div>

                {/* Deductible Expenses Slider & Input */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-bold text-navy-900">
                      Allowable Deductible Expenses (AED)
                    </label>
                    <span className="font-mono font-bold text-slate-700 text-sm">
                      {formatAED(deductibleExpenses)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={annualRevenue}
                    step="25000"
                    value={deductibleExpenses}
                    onChange={(e) => setDeductibleExpenses(Number(e.target.value))}
                    className="w-full accent-navy-900 cursor-pointer"
                  />
                  <span className="text-[11px] text-slate-500 block">
                    Salaries, commercial rent, utilities, professional fees, supplier costs.
                  </span>
                </div>

                {/* Exempt Income / Foreign Dividends */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-bold text-navy-900">
                      Exempt Income / Qualifying Dividends (AED)
                    </label>
                    <span className="font-mono font-bold text-slate-700 text-sm">
                      {formatAED(exemptIncome)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1000000"
                    step="10000"
                    value={exemptIncome}
                    onChange={(e) => setExemptIncome(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>

                {/* Small Business Relief (SBR) Toggle Box */}
                {ctCalculation.qualifiesForSBR && companyType !== "freezone-qfzp" && (
                  <div className="p-4 rounded-2xl bg-gold-50/50 border border-gold-300/80 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-gold-600 shrink-0" />
                        <span className="text-xs font-bold text-navy-950">
                          Small Business Relief (SBR) Eligible
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white font-mono text-[9px] font-bold">
                          0% TAX
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Your revenue is under AED 3,000,000. Under UAE Ministerial Decision No. 73/2023, you can elect for 0% tax liability on your return.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                      <input
                        type="checkbox"
                        checked={applySBR}
                        onChange={(e) => setApplySBR(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold-500" />
                    </label>
                  </div>
                )}
              </div>

              {/* Output Results Card (5 Cols) */}
              <div className="lg:col-span-5 bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gold-500/30 space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <Scale className="w-5 h-5 text-gold-400" />
                    <span className="font-display font-bold text-base">Assessment Summary</span>
                  </div>
                  <span className="font-mono text-xs text-gold-300 font-bold px-2.5 py-1 rounded-full bg-gold-500/10 border border-gold-400/30">
                    2026 Tax Year
                  </span>
                </div>

                {/* Primary Tax Liability Display */}
                <div className="text-center py-4 bg-white/5 rounded-2xl border border-white/10">
                  <span className="text-xs uppercase tracking-wider text-slate-300 font-mono block mb-1">
                    Estimated UAE Corporate Tax
                  </span>
                  <div className="text-4xl sm:text-5xl font-extrabold font-mono text-gold-400 tabular-nums">
                    {formatAED(ctCalculation.taxLiability)}
                  </div>
                  <span className="text-xs text-slate-400 block mt-1.5">
                    Effective Tax Rate:{" "}
                    <strong className="text-white">{ctCalculation.effectiveRate}%</strong>
                  </span>
                </div>

                {/* Detailed Breakdown */}
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-2 border-b border-white/10">
                    <span className="text-slate-300">Net Accounting Profit:</span>
                    <span className="font-mono font-bold text-white">
                      {formatAED(ctCalculation.netProfit)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/10">
                    <span className="text-slate-300">Tier 1 (AED 0 – 375,000 @ 0%):</span>
                    <span className="font-mono font-bold text-emerald-400">
                      AED 0 Tax
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/10">
                    <span className="text-slate-300">Tier 2 (Excess over AED 375,000 @ 9%):</span>
                    <span className="font-mono font-bold text-white">
                      {formatAED(ctCalculation.taxLiability)}
                    </span>
                  </div>

                  {ctCalculation.totalTaxSaved > 0 && (
                    <div className="flex justify-between py-2 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/30 text-emerald-300">
                      <span>Total Relief / SBR Saved:</span>
                      <span className="font-mono font-bold">
                        {formatAED(ctCalculation.totalTaxSaved)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="pt-2 space-y-3">
                  <button
                    type="button"
                    onClick={shareCalculationOnWhatsApp}
                    className="w-full py-3.5 px-4 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-display font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-gold-500/20 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Send To Glen Dias for Review</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigate("/contact")}
                    className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-display font-semibold text-xs transition-colors cursor-pointer text-center"
                  >
                    Book 1-on-1 Tax Planning Session
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: VAT Planner */}
          {activeTab === "vat-planner" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
                <div>
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-navy-950">
                    UAE VAT Return &amp; Cashflow Estimator (5%)
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Calculate your quarterly VAT return liability (Output VAT minus Input VAT) under FTA regulations.
                  </p>
                </div>

                {/* Standard Sales */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-bold text-navy-900">
                      Standard-Rated UAE Sales (5% VAT)
                    </label>
                    <span className="font-mono font-bold text-gold-600 text-sm">
                      {formatAED(standardVatSales)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="5000000"
                    step="25000"
                    value={standardVatSales}
                    onChange={(e) => setStandardVatSales(Number(e.target.value))}
                    className="w-full accent-gold-500 cursor-pointer"
                  />
                  <span className="text-[11px] text-slate-500 block">
                    Domestic goods and services sold inside the United Arab Emirates.
                  </span>
                </div>

                {/* Zero-Rated Exports */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-bold text-navy-900">
                      Zero-Rated Exports &amp; Cross-Border Supplies (0% VAT)
                    </label>
                    <span className="font-mono font-bold text-slate-700 text-sm">
                      {formatAED(zeroRatedSales)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="3000000"
                    step="25000"
                    value={zeroRatedSales}
                    onChange={(e) => setZeroRatedSales(Number(e.target.value))}
                    className="w-full accent-navy-900 cursor-pointer"
                  />
                  <span className="text-[11px] text-slate-500 block">
                    Export of services/goods outside the GCC or qualifying free zone supplies.
                  </span>
                </div>

                {/* Deductible Purchases / Input VAT */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-bold text-navy-900">
                      VAT-Bearing Business Purchases &amp; Expenses (5%)
                    </label>
                    <span className="font-mono font-bold text-emerald-600 text-sm">
                      {formatAED(vatExpenses)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="3000000"
                    step="25000"
                    value={vatExpenses}
                    onChange={(e) => setVatExpenses(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <span className="text-[11px] text-slate-500 block">
                    Input VAT paid on valid tax invoices holding your company TRN.
                  </span>
                </div>

                {/* Registration Threshold Status Box */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 block">
                    FTA Registration Obligation
                  </span>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-bold text-navy-950">
                      {vatCalculation.registrationStatus}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Total annual turnover: <strong>{formatAED(vatCalculation.totalSales)}</strong> (Mandatory threshold is AED 375,000).
                  </p>
                </div>
              </div>

              {/* VAT Output Card */}
              <div className="lg:col-span-5 bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gold-500/30 space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <Percent className="w-5 h-5 text-emerald-400" />
                    <span className="font-display font-bold text-base">VAT Position</span>
                  </div>
                  <span className="font-mono text-xs text-emerald-300 font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/30">
                    FTA Return Form 201
                  </span>
                </div>

                <div className="text-center py-4 bg-white/5 rounded-2xl border border-white/10">
                  <span className="text-xs uppercase tracking-wider text-slate-300 font-mono block mb-1">
                    {vatCalculation.isRefund ? "Estimated VAT Refund from FTA" : "Net VAT Payable to FTA"}
                  </span>
                  <div className="text-4xl sm:text-5xl font-extrabold font-mono text-emerald-400 tabular-nums">
                    {formatAED(Math.abs(vatCalculation.netVatPayable))}
                  </div>
                  <span className="text-xs text-slate-400 block mt-1.5">
                    {vatCalculation.isRefund
                      ? "Refundable or offset against future periods"
                      : "Payable by the 28th following tax period"}
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-2 border-b border-white/10">
                    <span className="text-slate-300">Output VAT (5% on Sales):</span>
                    <span className="font-mono font-bold text-white">
                      +{formatAED(vatCalculation.outputVat)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/10">
                    <span className="text-slate-300">Input VAT (Recoverable on Expenses):</span>
                    <span className="font-mono font-bold text-emerald-400">
                      -{formatAED(vatCalculation.inputVat)}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigate("/contact")}
                  className="w-full py-3.5 px-4 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-display font-bold text-xs uppercase tracking-wider transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Request VAT Return Filing Assistance</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Deadline & Penalty Planner */}
          {activeTab === "deadline-calculator" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
                <div>
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-navy-950">
                    EmaraTax Filing Deadlines &amp; Penalty Safeguard
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Calculate your exact statutory deadlines under UAE Federal Tax Authority rules to prevent penalties.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-navy-900">
                      Financial Year-End Month
                    </label>
                    <select
                      value={financialYearEndMonth}
                      onChange={(e) => setFinancialYearEndMonth(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-200 text-xs bg-slate-50 font-medium focus:ring-2 focus:ring-gold-500 outline-none"
                    >
                      <option value="12">December 31 (Standard Calendar Year)</option>
                      <option value="3">March 31</option>
                      <option value="6">June 30</option>
                      <option value="9">September 30</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-navy-900">
                      Financial Year
                    </label>
                    <select
                      value={financialYear}
                      onChange={(e) => setFinancialYear(Number(e.target.value))}
                      className="w-full p-3 rounded-xl border border-slate-200 text-xs bg-slate-50 font-medium focus:ring-2 focus:ring-gold-500 outline-none"
                    >
                      <option value={2024}>2024 Financial Year</option>
                      <option value={2025}>2025 Financial Year</option>
                      <option value={2026}>2026 Financial Year</option>
                    </select>
                  </div>
                </div>

                {/* Statutory Rules Explanation */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gold-600" />
                    <span className="text-xs font-bold text-navy-950">
                      UAE Corporate Tax 9-Month Rule
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Under Article 53 of Federal Decree-Law No. 47 of 2022, your annual Corporate Tax return and full tax payment must be submitted no later than <strong>9 months</strong> from the end of the relevant Tax Period.
                  </p>
                </div>

                {/* Cabinet Decision No. 75/2023 Warning */}
                <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2 text-xs text-amber-950">
                  <div className="flex items-center gap-2 font-bold">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>AED 10,000 Late Registration Penalty Alert</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-amber-900">
                    Cabinet Decision No. 75 of 2023 imposes a non-negotiable AED 10,000 administrative fine on businesses that miss their FTA Corporate Tax registration timeline. Ensure your TRN is issued well before the return filing date.
                  </p>
                </div>
              </div>

              {/* Deadline Summary Card */}
              <div className="lg:col-span-5 bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gold-500/30 space-y-6">
                <div className="flex items-center gap-2 border-b border-white/10 pb-4">
                  <Calendar className="w-5 h-5 text-gold-400" />
                  <span className="font-display font-bold text-base">Key Filing Milestones</span>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <span className="text-[10px] uppercase tracking-wider font-mono text-slate-400 block mb-1">
                      Financial Year Ends
                    </span>
                    <span className="text-lg font-bold font-mono text-white block">
                      {deadlineCalculation.financialYearEndStr}
                    </span>
                  </div>

                  <div className="p-4 bg-gold-500/10 rounded-2xl border border-gold-500/30">
                    <span className="text-[10px] uppercase tracking-wider font-mono text-gold-300 block mb-1">
                      Final CT Return &amp; Payment Deadline
                    </span>
                    <span className="text-xl sm:text-2xl font-bold font-mono text-gold-400 block">
                      {deadlineCalculation.ctDeadlineStr}
                    </span>
                    <span className="text-[11px] text-slate-300 block mt-1">
                      Must be filed via the EmaraTax portal.
                    </span>
                  </div>

                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <span className="text-[10px] uppercase tracking-wider font-mono text-slate-400 block mb-1">
                      Quarterly VAT Filing Deadlines
                    </span>
                    <span className="text-xs font-semibold text-slate-200 block">
                      28th day following the close of each designated tax quarter.
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigate("/contact")}
                  className="w-full py-3.5 px-4 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-display font-bold text-xs uppercase tracking-wider transition-all shadow-lg cursor-pointer"
                >
                  Schedule Year-End Audit &amp; Filing
                </button>
              </div>
            </div>
          )}
        </section>

        {/* 3. Tax Optimization & Allowable Deductions Reference Grid */}
        <section className="py-16 bg-white border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-gold-600 block mb-2">
                Expert Practice Guide
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy-950">
                Allowable vs. Non-Allowable Deductions in the UAE
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2">
                Optimize your tax position legally under Federal Decree-Law No. 47 with verified accounting treatments.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 flex items-center justify-center font-bold">
                  ✓
                </div>
                <h3 className="font-display font-bold text-base text-navy-950">
                  100% Allowable Deductions
                </h3>
                <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                  <li>Commercial office rent &amp; tenancy contracts</li>
                  <li>Employee basic salaries, benefits &amp; WPS</li>
                  <li>End of service gratuity provisions</li>
                  <li>Audit fees &amp; professional consulting</li>
                  <li>Direct cost of goods sold (COGS)</li>
                </ul>
              </div>

              {/* Card 2 */}
              <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 flex items-center justify-center font-bold">
                  50%
                </div>
                <h3 className="font-display font-bold text-base text-navy-950">
                  50% Capped Deductions
                </h3>
                <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                  <li>Client entertainment, meals &amp; dining</li>
                  <li>Event hospitality &amp; tickets</li>
                  <li>Client transport &amp; accommodation</li>
                  <li>General entertainment facilities</li>
                </ul>
                <p className="text-[11px] text-slate-500 mt-2 italic">
                  Strictly 50% restricted under Article 32 of CT Law.
                </p>
              </div>

              {/* Card 3 */}
              <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 flex items-center justify-center font-bold">
                  ✕
                </div>
                <h3 className="font-display font-bold text-base text-navy-950">
                  0% Non-Deductible (Prohibited)
                </h3>
                <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                  <li>FTA administrative fines and tax penalties</li>
                  <li>Personal expenses of shareholders / directors</li>
                  <li>Bribes or illicit payments</li>
                  <li>Dividends or profit distributions</li>
                  <li>Excessive non-arm's length related-party payments</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Frequently Asked Questions */}
        <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-gold-600 block mb-2">
              Statutory Clarifications
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy-950">
              UAE Corporate Tax &amp; Planning FAQs
            </h2>
          </div>

          <div className="space-y-4">
            {faqItems.map((faq, idx) => (
              <div
                key={faq.q}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/70 transition-colors"
                >
                  <span className="font-display font-bold text-sm text-navy-950">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 shrink-0 transition-transform ${
                      openFaq === idx ? "rotate-180 text-gold-600" : ""
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 5. CTA Banner */}
        <section className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 text-white py-16 border-t border-gold-500/30">
          <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-400/30 text-gold-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              <span>Chartered Accountant Sign-Off</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">
              Need a Certified Corporate Tax Assessment for Your Company?
            </h2>
            <p className="text-slate-300 text-sm max-w-xl mx-auto leading-relaxed">
              Book a direct consultation with Glen Dias, Managing Partner &amp; Chartered Accountant, to review your trial balance, verify SBR relief, and prepare an audit-ready tax file.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => onNavigate("/contact")}
                className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-display font-bold px-7 py-3.5 rounded-xl text-sm transition-all cursor-pointer shadow-lg shadow-gold-500/20"
              >
                Schedule Executive Tax Assessment
              </button>
              <button
                type="button"
                onClick={shareCalculationOnWhatsApp}
                className="bg-white/10 hover:bg-white/15 text-white font-display font-semibold px-6 py-3.5 rounded-xl text-sm transition-all cursor-pointer border border-white/20"
              >
                Chat on WhatsApp (+971 52 922 6958)
              </button>
            </div>
          </div>
        </section>
      </main>

      <PageFooter
        onNavigate={onNavigate}
        onOpenPrivacy={onOpenPrivacy}
        onOpenGooglePreferred={onOpenGooglePreferred}
      />
    </div>
  );
};

export default TaxPlannerPage;

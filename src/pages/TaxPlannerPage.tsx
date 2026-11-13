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
  ExternalLink,
  MessageCircle,
  Share2,
  Check,
} from "lucide-react";
import PageNavigation from "../components/PageNavigation";
import PageFooter from "../components/PageFooter";
import { useLanguage } from "../i18n/LanguageContext";
import { applyPageSEO } from "../lib/seo";

interface TaxPlannerPageProps {
  onNavigate: (path: string) => void;
  onOpenAudit?: () => void;
  onOpenPrivacy?: () => void;
  onOpenGooglePreferred?: () => void;
  // Tracking event callbacks for analytics
  onToolStarted?: () => void;
  onResultViewed?: (result: { liability: number; sbr: boolean; netProfit: number }) => void;
  onResultSaved?: (lead: { name: string; email: string; phone: string }) => void;
  onCtaClicked?: (ctaType: string) => void;
  onWhatsAppClicked?: () => void;
}

type PlannerTab = "corporate-tax" | "vat-planner" | "deadline-calculator";

export const TaxPlannerPage: React.FC<TaxPlannerPageProps> = ({
  onNavigate,
  onOpenAudit,
  onOpenPrivacy,
  onOpenGooglePreferred,
  onToolStarted,
  onResultViewed,
  onResultSaved,
  onCtaClicked,
  onWhatsAppClicked,
}) => {
  const { language } = useLanguage();
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
  const [financialYearEndMonth, setFinancialYearEndMonth] = useState<string>("12");
  const [financialYear, setFinancialYear] = useState<number>(2025);

  // Save Results Lead Form State
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [consentChecked, setConsentChecked] = useState(false);
  const [saveSubmitted, setSaveSubmitted] = useState(false);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    applyPageSEO({
      title: "UAE Corporate Tax (9%) & VAT Calculator 2026 | Dias UAE",
      description:
        "Free 2026 UAE Tax Calculator & Planner. Estimate 9% Corporate Tax, 0% Small Business Relief (AED 3M), QFZP eligibility & 5% VAT liability in seconds.",
      canonicalPath: "/uae-tax-planner",
      keywords:
        "UAE Corporate Tax Calculator 2026, UAE Tax Planner, 9% Corporate Tax Calculator, 0% Small Business Relief AED 3M, QFZP eligibility, 5% VAT Calculator Dubai",
      ogImage: "/api/og?title=UAE+Corporate+Tax+(9%25)+%26+VAT+Calculator+2026&author=Glen+Dias&tag=Free+Tax+Planner",
    });
    window.scrollTo({ top: 0, behavior: "instant" });
    if (onToolStarted) onToolStarted();
  }, [onToolStarted]);

  // Format currency
  const formatAED = (amount: number) => {
    return new Intl.NumberFormat("en-AE", {
      style: "currency",
      currency: "AED",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Corporate Tax Computations
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
      taxLiability = 0;
      tier0Profit = netProfit;
      tier9Profit = 0;
    } else if (sbrElected) {
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

  // Fire onResultViewed tracking callback
  useEffect(() => {
    if (onResultViewed) {
      onResultViewed({
        liability: ctCalculation.taxLiability,
        sbr: ctCalculation.sbrElected,
        netProfit: ctCalculation.netProfit,
      });
    }
  }, [ctCalculation, onResultViewed]);

  // VAT Computations
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

  // Statutory Filing Deadlines Computation
  const deadlineCalculation = useMemo(() => {
    const monthIndex = parseInt(financialYearEndMonth, 10) - 1;
    const yearEnd = new Date(financialYear, monthIndex + 1, 0);
    const ctFilingDate = new Date(yearEnd);
    ctFilingDate.setMonth(ctFilingDate.getMonth() + 9);
    const finalCtDeadline = new Date(ctFilingDate.getFullYear(), ctFilingDate.getMonth() + 1, 0);

    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
    const locale = "en-US";

    return {
      financialYearEndStr: yearEnd.toLocaleDateString(locale, options),
      ctDeadlineStr: finalCtDeadline.toLocaleDateString(locale, options),
    };
  }, [financialYearEndMonth, financialYear]);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqItems = [
    {
      q: "Can my business elect for 0% Small Business Relief (SBR) in 2026?",
      a: "Yes. Under UAE Ministerial Decision No. 73 of 2023 (extended through December 31, 2029), taxable resident businesses with revenue up to AED 3,000,000 can elect for Small Business Relief. When elected, your taxable income is treated as AED 0, resulting in zero corporate tax liability. However, you must still maintain IFRS-compliant books and file your annual tax return on EmaraTax.",
    },
    {
      q: "How does the AED 375,000 statutory 0% threshold apply?",
      a: "Under Federal Decree-Law No. 47 of 2022, every UAE resident business benefits from a 0% corporate tax rate on the first AED 375,000 of taxable net profit. Any taxable profit exceeding AED 375,000 is subject to the standard 9% rate.",
    },
    {
      q: "Are Free Zone companies completely exempt from UAE Corporate Tax?",
      a: "No. 100% of UAE Free Zone companies must register for Corporate Tax and file an annual return. To benefit from 0% on Qualifying Income (QFZP status), you must maintain adequate substance, earn qualifying income, obtain audited accounts, and comply with transfer pricing rules.",
    },
    {
      q: "What is the penalty for late Corporate Tax registration?",
      a: "Under Cabinet Decision No. 75 of 2023, the FTA imposes a mandatory administrative penalty of AED 10,000 for failing to register for Corporate Tax before your official deadline.",
    },
  ];

  const handleShareOnWhatsApp = () => {
    if (onWhatsAppClicked) onWhatsAppClicked();
    let msg = `Hi, I used the Dias UAE Tax Planner for my company:\n`;
    if (activeTab === "corporate-tax") {
      msg += `• Annual Revenue: ${formatAED(annualRevenue)}\n• Estimated Net Profit: ${formatAED(ctCalculation.netProfit)}\n• Estimated Tax Liability: ${formatAED(ctCalculation.taxLiability)}\n• SBR Relief Elected: ${ctCalculation.sbrElected ? "Yes (0%)" : "No"}\n• Company Jurisdiction: ${companyType}\n`;
    } else if (activeTab === "vat-planner") {
      msg += `• Annual Sales: ${formatAED(vatCalculation.totalSales)}\n• Net VAT Position: ${formatAED(vatCalculation.netVatPayable)}\n`;
    }
    msg += `I would like to consult with an FTA Tax Agent at Dias Accounting regarding our 2026 filing.`;
    window.open(`https://wa.me/971529226958?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const handleSaveResultsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentChecked) {
      alert("Please check the consent box to proceed.");
      return;
    }
    if (onResultSaved) {
      onResultSaved({ name: leadName, email: leadEmail, phone: leadPhone });
    }
    setSaveSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased selection:bg-gold-500/30 selection:text-navy-950">
      <PageNavigation
        currentPath="/uae-tax-planner"
        onNavigate={onNavigate}
        onOpenAudit={onOpenAudit}
      />

      <main id="main-content">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 text-white py-14 lg:py-20 border-b border-gold-500/20 overflow-hidden">
          <div className="absolute -top-32 right-0 w-[500px] h-[500px] bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex items-center gap-2 text-xs font-mono text-gold-400 mb-4">
              <button
                type="button"
                onClick={() => onNavigate("/")}
                className="hover:underline cursor-pointer"
              >
                Home
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-white">UAE Tax Planner</span>
            </div>

            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-400/30 text-gold-300 text-xs font-semibold uppercase tracking-wider mb-4">
                <Calculator className="w-3.5 h-3.5 text-gold-400" />
                <span>FTA Compliant Estimation Tool · 2026 Mandates</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4">
                Free UAE Tax Planner &amp; Corporate Tax Estimator
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4">
                Instantly compute your estimated UAE Corporate Tax liability (9%), check your eligibility for 0% Small Business Relief (SBR) up to AED 3,000,000, and evaluate your VAT standing.
              </p>

              {/* Tool Disclaimer */}
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-xs leading-relaxed flex items-start gap-2.5">
                <Info className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <p>
                  <strong>Disclaimer:</strong> This calculator provides an estimate based on the information you enter. It is not tax advice. Verify final eligibility with the Federal Tax Authority (FTA) or a qualified advisor.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Tab Navigation */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
          <div className="flex flex-wrap gap-2 p-2 bg-navy-950/90 backdrop-blur-md rounded-2xl border border-gold-500/30 shadow-xl max-w-2xl">
            <button
              type="button"
              onClick={() => setActiveTab("corporate-tax")}
              className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-display font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === "corporate-tax"
                  ? "bg-gold-500 text-navy-950 shadow-md font-extrabold"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Corporate Tax (9%)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("vat-planner")}
              className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-display font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === "vat-planner"
                  ? "bg-gold-500 text-navy-950 shadow-md font-extrabold"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <Percent className="w-4 h-4" />
              <span>VAT (5%) Planner</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("deadline-calculator")}
              className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-display font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === "deadline-calculator"
                  ? "bg-gold-500 text-navy-950 shadow-md font-extrabold"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>FTA Deadlines</span>
            </button>
          </div>
        </section>

        {/* Main Interactive Tool Body */}
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {activeTab === "corporate-tax" && (
            <div className="space-y-10">
              
              {/* 1. RESULT-FIRST UPFRONT SUMMARY CARD */}
              <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 border-2 border-gold-500 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  
                  {/* Results Display */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-gold-500 text-navy-950 font-mono text-[10px] font-extrabold uppercase tracking-wider">
                        ESTIMATED TAX RESULT
                      </span>
                      <span className="text-xs text-slate-300">Based on Federal Decree-Law No. 47 of 2022</span>
                    </div>

                    <div className="flex flex-wrap items-baseline gap-3">
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg text-gold-400 font-bold">AED</span>
                        <span className="font-display text-4xl sm:text-6xl font-black text-white tabular-nums tracking-tight">
                          {ctCalculation.taxLiability.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-xs text-slate-300">
                        Estimated Tax Liability · Effective Rate: <strong>{ctCalculation.effectiveRate}%</strong>
                      </div>
                    </div>

                    {/* Dynamic Result Narrative CTA */}
                    <div className="p-4 rounded-2xl bg-white/10 border border-white/15 text-xs sm:text-sm text-slate-200 leading-relaxed">
                      {ctCalculation.sbrElected ? (
                        <div className="space-y-1">
                          <p className="font-bold text-emerald-400 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>Your business qualifies for 0% Small Business Relief!</span>
                          </p>
                          <p className="text-slate-300 text-xs">
                            Because your revenue is under AED 3,000,000, your effective corporate tax liability is AED 0. You can save up to {formatAED(ctCalculation.totalTaxSaved)} by electing for SBR on EmaraTax.
                          </p>
                        </div>
                      ) : ctCalculation.taxLiability > 0 ? (
                        <div className="space-y-1">
                          <p className="font-bold text-gold-300 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-gold-400 shrink-0" />
                            <span>Estimated Corporate Tax Liability: {formatAED(ctCalculation.taxLiability)}</span>
                          </p>
                          <p className="text-slate-300 text-xs">
                            Your taxable net profit exceeds the 0% statutory threshold (first AED 375,000 is 0%; excess is taxed at standard 9%).
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <p className="font-bold text-emerald-400 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>0% Corporate Tax Liability (Under AED 375,000 Threshold)</span>
                          </p>
                          <p className="text-slate-300 text-xs">
                            Your net taxable profit is within the statutory 0% bracket. Mandatory IFRS books and annual EmaraTax return filing are still legally required.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Result Action Buttons */}
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (onCtaClicked) onCtaClicked("consultation");
                          onNavigate("/contact");
                        }}
                        className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-display font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center gap-2"
                      >
                        {ctCalculation.sbrElected
                          ? "Claim 0% Small Business Relief with Dias"
                          : "Book Corporate Tax Filing Consultation"}
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={handleShareOnWhatsApp}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-display font-bold px-5 py-3 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-md"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Send Summary to WhatsApp</span>
                      </button>
                    </div>
                  </div>

                  {/* Explainable Assumptions Card */}
                  <div className="lg:col-span-5 bg-navy-900/90 rounded-2xl border border-white/10 p-5 space-y-3 text-xs">
                    <span className="font-mono text-[10px] text-gold-400 uppercase font-bold tracking-wider block">
                      Explainable Statutory Assumptions:
                    </span>
                    <ul className="space-y-2 text-slate-300">
                      <li className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-gold-400 shrink-0 mt-0.5" />
                        <span><strong>AED 375,000 Threshold:</strong> First AED 375,000 in net profit is taxed at statutory 0%.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-gold-400 shrink-0 mt-0.5" />
                        <span><strong>Small Business Relief:</strong> Entities with gross revenue up to AED 3,000,000 can elect for 0% tax (valid through Dec 31, 2029).</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-gold-400 shrink-0 mt-0.5" />
                        <span><strong>Standard 9% Rate:</strong> Applied on net adjusted accounting profit exceeding AED 375,000.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-gold-400 shrink-0 mt-0.5" />
                        <span><strong>QFZP 0%:</strong> Available to Free Zone entities meeting strict substance &amp; qualifying income rules.</span>
                      </li>
                    </ul>
                  </div>

                </div>
              </div>

              {/* 2. DETAILED INPUT CONTROLS GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left 7 Cols: Interactive Inputs */}
                <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
                  <div>
                    <h3 className="font-display text-xl font-bold text-navy-950 mb-1">
                      Adjust Your Financial Inputs
                    </h3>
                    <p className="text-xs text-slate-500">
                      Slide or enter your annual figures to recompute your estimated position in real time.
                    </p>
                  </div>

                  {/* Revenue Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-slate-700">Gross Annual Revenue (AED)</span>
                      <span className="font-mono text-sm text-navy-950">{formatAED(annualRevenue)}</span>
                    </div>
                    <input
                      type="range"
                      min="200000"
                      max="15000000"
                      step="50000"
                      value={annualRevenue}
                      onChange={(e) => setAnnualRevenue(Number(e.target.value))}
                      className="w-full accent-gold-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>AED 200k</span>
                      <span>AED 3M (SBR Cap)</span>
                      <span>AED 15M+</span>
                    </div>
                  </div>

                  {/* Deductible Expenses Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-slate-700">Deductible Operating Expenses (AED)</span>
                      <span className="font-mono text-sm text-navy-950">{formatAED(deductibleExpenses)}</span>
                    </div>
                    <input
                      type="range"
                      min="50000"
                      max={Math.max(100000, annualRevenue)}
                      step="25000"
                      value={deductibleExpenses}
                      onChange={(e) => setDeductibleExpenses(Number(e.target.value))}
                      className="w-full accent-gold-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>AED 50k</span>
                      <span>Est. Net Profit: {formatAED(ctCalculation.netProfit)}</span>
                    </div>
                  </div>

                  {/* Jurisdiction Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 block">
                      Company Jurisdiction &amp; Free Zone Standing
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setCompanyType("mainland")}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                          companyType === "mainland"
                            ? "border-gold-500 bg-gold-50/50 text-navy-950 font-bold"
                            : "border-slate-200 text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        <span className="block font-bold">Mainland (DET)</span>
                        <span className="text-[10px] text-slate-500">Standard 9% / 0% SBR</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setCompanyType("freezone-standard")}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                          companyType === "freezone-standard"
                            ? "border-gold-500 bg-gold-50/50 text-navy-950 font-bold"
                            : "border-slate-200 text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        <span className="block font-bold">Free Zone Standard</span>
                        <span className="text-[10px] text-slate-500">Non-Qualifying / SBR</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setCompanyType("freezone-qfzp")}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                          companyType === "freezone-qfzp"
                            ? "border-gold-500 bg-gold-50/50 text-navy-950 font-bold"
                            : "border-slate-200 text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        <span className="block font-bold">Free Zone QFZP</span>
                        <span className="text-[10px] text-slate-500">0% Qualifying Income</span>
                      </button>
                    </div>
                  </div>

                  {/* SBR Toggle Checkbox */}
                  {ctCalculation.qualifiesForSBR && (
                    <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl flex items-center justify-between gap-4">
                      <div className="space-y-0.5">
                        <span className="font-bold text-xs text-emerald-950 block">
                          Elect for 0% Small Business Relief (SBR)
                        </span>
                        <span className="text-[11px] text-emerald-800">
                          Ministerial Decision No. 73 of 2023 (Revenue under AED 3,000,000)
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={applySBR}
                        onChange={(e) => setApplySBR(e.target.checked)}
                        className="w-5 h-5 accent-emerald-600 cursor-pointer"
                      />
                    </div>
                  )}

                  {/* Link to Dedicated Corporate Tax Calculator for Deeper Scenarios */}
                  <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
                    <span>Need more complex multi-entity, interest capping, or foreign credit modeling?</span>
                    <button
                      type="button"
                      onClick={() => onNavigate("/corporate-tax-calculator")}
                      className="text-gold-600 hover:text-gold-700 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <span>Open Deep Calculator</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Right 5 Cols: "SAVE OR EMAIL MY RESULTS" LEAD FORM */}
                <div className="lg:col-span-5 bg-navy-950 rounded-3xl border border-white/10 p-6 sm:p-8 text-white flex flex-col justify-between shadow-xl">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-gold-400 mb-2">
                      <Download className="w-4 h-4" />
                      <span>RECEIVE OFFICIAL SUMMARY</span>
                    </div>
                    <h3 className="font-display text-xl font-bold mb-2">
                      Save or Email My Tax Calculation
                    </h3>
                    <p className="text-slate-300 text-xs leading-relaxed mb-6">
                      Get a detailed PDF calculation breakdown sent to your inbox, including statutory legal citations and filing deadlines for your company.
                    </p>

                    {saveSubmitted ? (
                      <div className="p-6 bg-emerald-500/20 border border-emerald-400/50 rounded-2xl text-center space-y-3">
                        <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                        <h4 className="font-display font-bold text-base text-white">
                          Calculation Summary Dispatched!
                        </h4>
                        <p className="text-xs text-slate-200">
                          Check your inbox at <strong>{leadEmail}</strong>. One of our FTA registered tax agents will also review your numbers.
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleSaveResultsSubmit} className="space-y-4">
                        <div>
                          <label className="text-[11px] font-mono text-slate-300 block mb-1">Your Full Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Tariq Mansoor"
                            value={leadName}
                            onChange={(e) => setLeadName(e.target.value)}
                            className="w-full bg-white/10 border border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-gold-400"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-mono text-slate-300 block mb-1">Company Email *</label>
                          <input
                            type="email"
                            required
                            placeholder="e.g. tariq@yourcompany.ae"
                            value={leadEmail}
                            onChange={(e) => setLeadEmail(e.target.value)}
                            className="w-full bg-white/10 border border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-gold-400"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-mono text-slate-300 block mb-1">WhatsApp / Phone Number *</label>
                          <input
                            type="tel"
                            required
                            placeholder="e.g. +971 50 123 4567"
                            value={leadPhone}
                            onChange={(e) => setLeadPhone(e.target.value)}
                            className="w-full bg-white/10 border border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-gold-400"
                          />
                        </div>

                        <div className="flex items-start gap-2 pt-1">
                          <input
                            type="checkbox"
                            id="consent"
                            required
                            checked={consentChecked}
                            onChange={(e) => setConsentChecked(e.target.checked)}
                            className="w-4 h-4 accent-gold-400 mt-0.5 cursor-pointer"
                          />
                          <label htmlFor="consent" className="text-[10px] text-slate-300 leading-tight cursor-pointer">
                            I consent to Dias Accounting contacting me regarding UAE Corporate Tax and storing my inquiry in accordance with the Privacy Policy.
                          </label>
                        </div>

                        <button
                          type="submit"
                          className="w-full py-3.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-display font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer mt-2"
                        >
                          Email My Calculation Results
                        </button>
                      </form>
                    )}
                  </div>

                  <div className="pt-4 mt-6 border-t border-white/10 text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Zero spam guarantee</span>
                    <span>Direct partner review</span>
                  </div>
                </div>

              </div>

            </div>
          )}

          {activeTab === "vat-planner" && (
            <div className="space-y-8">
              <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-7 space-y-6">
                    <div>
                      <span className="text-xs font-mono font-bold text-gold-600 uppercase tracking-wider">
                        5% UAE VALUE ADDED TAX (VAT)
                      </span>
                      <h2 className="font-display text-2xl font-bold text-navy-950 mt-1">
                        Quarterly VAT Position &amp; Threshold Calculator
                      </h2>
                      <p className="text-xs text-slate-600 mt-1">
                        Federal Decree-Law No. 8 of 2017: compute output tax on taxable supplies and input tax recovery on business purchases.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          Standard-Rated UAE Sales (5% VAT): {formatAED(standardVatSales)}
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="5000000"
                          step="50000"
                          value={standardVatSales}
                          onChange={(e) => setStandardVatSales(Number(e.target.value))}
                          className="w-full accent-gold-500 cursor-pointer"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          Zero-Rated / Export Sales (0% VAT): {formatAED(zeroRatedSales)}
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="3000000"
                          step="25000"
                          value={zeroRatedSales}
                          onChange={(e) => setZeroRatedSales(Number(e.target.value))}
                          className="w-full accent-gold-500 cursor-pointer"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          Vatable Operating Expenses &amp; Purchases: {formatAED(vatExpenses)}
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="4000000"
                          step="25000"
                          value={vatExpenses}
                          onChange={(e) => setVatExpenses(Number(e.target.value))}
                          className="w-full accent-gold-500 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-5 bg-slate-900 rounded-2xl p-6 text-white space-y-4">
                    <span className="text-xs font-mono text-gold-400 uppercase font-bold">ESTIMATED VAT POSITION</span>
                    <div>
                      <span className="text-xs text-slate-400 block">Net VAT Payable to FTA:</span>
                      <span className="font-display text-4xl font-black text-white">
                        {formatAED(vatCalculation.netVatPayable)}
                      </span>
                    </div>
                    <div className="divide-y divide-white/10 text-xs text-slate-300">
                      <div className="py-2 flex justify-between">
                        <span>Output VAT Collected (5%):</span>
                        <span className="font-mono text-gold-400">{formatAED(vatCalculation.outputVat)}</span>
                      </div>
                      <div className="py-2 flex justify-between">
                        <span>Input VAT Recoverable (5%):</span>
                        <span className="font-mono text-emerald-400">{formatAED(vatCalculation.inputVat)}</span>
                      </div>
                      <div className="py-2 flex justify-between">
                        <span>Registration Status:</span>
                        <span className="font-semibold text-white">{vatCalculation.registrationStatus}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onNavigate("/contact")}
                      className="w-full py-3 rounded-xl bg-gold-500 text-navy-950 font-bold text-xs uppercase cursor-pointer"
                    >
                      Book Quarterly VAT Filing
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "deadline-calculator" && (
            <div className="space-y-8">
              <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
                <div className="max-w-2xl mx-auto space-y-6">
                  <div className="text-center">
                    <span className="text-xs font-mono font-bold text-gold-600 uppercase tracking-wider">
                      STATUTORY FILING TIMELINES
                    </span>
                    <h2 className="font-display text-2xl font-bold text-navy-950 mt-1">
                      Calculate Your Official Corporate Tax Deadline
                    </h2>
                    <p className="text-xs text-slate-600 mt-1">
                      Under UAE Corporate Tax Law, returns must be filed within 9 months of the financial year close.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Financial Year End Month</label>
                      <select
                        value={financialYearEndMonth}
                        onChange={(e) => setFinancialYearEndMonth(e.target.value)}
                        className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white"
                      >
                        <option value="12">December (Calendar Year End)</option>
                        <option value="3">March</option>
                        <option value="6">June</option>
                        <option value="9">September</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Financial Year</label>
                      <select
                        value={financialYear}
                        onChange={(e) => setFinancialYear(Number(e.target.value))}
                        className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white"
                      >
                        <option value={2024}>2024</option>
                        <option value={2025}>2025</option>
                        <option value={2026}>2026</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-navy-950 text-white space-y-3 text-center">
                    <span className="text-xs font-mono text-gold-400 uppercase font-bold">YOUR MANDATORY FILING DEADLINE</span>
                    <div className="font-display text-2xl sm:text-3xl font-bold text-white">
                      {deadlineCalculation.ctDeadlineStr}
                    </div>
                    <p className="text-xs text-slate-300">
                      Tax Period Closes: {deadlineCalculation.financialYearEndStr}. Failure to submit by this date attracts administrative penalties.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. TOOL FAQS SECTION */}
          <div className="mt-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-8">
                <span className="text-xs font-mono font-bold text-gold-600 uppercase tracking-wider">
                  COMMON QUESTIONS
                </span>
                <h3 className="font-display text-2xl font-bold text-navy-950 mt-1">
                  Understanding Your Tax Calculation
                </h3>
              </div>

              <div className="space-y-3">
                {faqItems.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div
                      key={idx}
                      className="border border-slate-200 rounded-xl overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => toggleFaq(idx)}
                        className="w-full p-4 bg-slate-50 text-left flex items-center justify-between gap-4 cursor-pointer"
                      >
                        <span className="text-xs sm:text-sm font-bold text-navy-950">
                          {faq.q}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-slate-500 transition-transform ${
                            isOpen ? "rotate-180 text-gold-600" : ""
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="p-4 bg-white border-t border-slate-100 text-xs text-slate-600 leading-relaxed">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
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

import React, { useEffect, useState } from "react";
import {
  Check,
  X,
  ChevronRight,
  Shield,
  ArrowRight,
  HelpCircle,
  Sparkles,
  FileSpreadsheet,
  AlertCircle,
  MessageCircle,
  Clock,
  Calendar,
  Building,
  CheckCircle2,
  FileCheck,
} from "lucide-react";
import PageNavigation from "../components/PageNavigation";
import PageFooter from "../components/PageFooter";
import StandalonePricingCards from "../components/StandalonePricingCards";
import { applyPageSEO } from "../lib/seo";

interface PricingPageProps {
  onNavigate: (path: string) => void;
  onOpenAudit?: () => void;
  onOpenPrivacy?: () => void;
  onOpenGooglePreferred?: () => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({
  onNavigate,
  onOpenAudit,
  onOpenPrivacy,
  onOpenGooglePreferred,
}) => {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("monthly");
  const [pricingPath, setPricingPath] = useState<"prospective" | "retrospective">("prospective");

  useEffect(() => {
    applyPageSEO({
      title: "Fixed-Fee Accounting & Tax Packages Dubai | From AED 400/mo",
      description:
        "Transparent fixed-fee accounting, bookkeeping & tax advisory packages in Dubai & Sharjah from AED 400/mo. Monthly IFRS books, VAT filing & Corporate Tax.",
      canonicalPath: "/pricing",
      keywords:
        "Corporate Tax, accounting packages dubai, monthly accounting package dubai, fixed fee bookkeeping uae, corporate tax return fee, corporate tax consultants in difc, tax services in dubai, difc tax compliance",
      ogImage: "/api/og?title=Fixed-Fee+Accounting+%26+Tax+Packages+Dubai&author=Dias+Tax+Team&tag=From+AED+400%2Fmo",
    });

    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const handleSelectPackage = (packageName: string) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("dias_selected_service", packageName);
    }
    const text = `Hi Dias Accounting, I would like to choose the ${packageName} (${
      billingPeriod === "annual" ? "Annual Billing" : "Monthly Billing"
    }) for my UAE business.`;
    window.open(`https://wa.me/971529226958?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased selection:bg-gold-500/30 selection:text-navy-950">
      <PageNavigation
        currentPath="/pricing"
        onNavigate={onNavigate}
        onOpenAudit={onOpenAudit}
      />

      <main id="main-content">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 text-white py-16 lg:py-24 border-b border-gold-500/20 overflow-hidden">
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
              <span className="text-white">Pricing &amp; Packages</span>
            </div>

            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-400/30 text-gold-300 text-xs font-semibold uppercase tracking-wider mb-4">
                <Shield className="w-3.5 h-3.5 text-gold-400" />
                <span>FTA Registered Tax Agency · Transparent Fixed Pricing</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-6">
                Corporate Tax &amp; Fixed-Fee Accounting Packages for UAE Businesses
              </h1>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-6">
                No hidden surprises, surprise hourly billing, or transaction markups. Get complete peace of mind with FTA-compliant Corporate Tax (9%), DIFC tax compliance, quarterly VAT filing, and monthly bookkeeping at predictable monthly rates starting at AED 400/month.
              </p>
              
              {/* Important Pricing Note Banner */}
              <div className="p-4 rounded-xl bg-gold-500/15 border border-gold-400/40 text-gold-200 text-xs sm:text-sm leading-relaxed flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                <p>
                  <strong>Note:</strong> Final pricing depends on your business activity, transaction volume, and filing requirements. Book a free consultation for an accurate quote.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Mode Toggle: Ongoing vs Backlog */}
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center mb-10">
            <div className="inline-flex p-1.5 bg-navy-950 border border-gold-500/30 rounded-2xl shadow-xl max-w-lg w-full">
              <button
                type="button"
                onClick={() => setPricingPath("prospective")}
                className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-display font-bold transition-all cursor-pointer text-center ${
                  pricingPath === "prospective"
                    ? "bg-gold-500 text-navy-950 shadow-md font-extrabold"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                Ongoing Monthly Retainers
              </button>
              <button
                type="button"
                onClick={() => setPricingPath("retrospective")}
                className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-display font-bold transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 ${
                  pricingPath === "retrospective"
                    ? "bg-gold-500 text-navy-950 shadow-md font-extrabold"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                <span>Backlog Catch-Up</span>
                <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[9px] font-mono">
                  TAX URGENT
                </span>
              </button>
            </div>
          </div>

          {pricingPath === "prospective" ? (
            <>
              {/* Billing Interval Switcher */}
              <div className="flex justify-center items-center gap-4 mb-12">
                <span className={`text-xs sm:text-sm font-bold ${billingPeriod === "monthly" ? "text-navy-950" : "text-slate-500"}`}>
                  Billed Monthly
                </span>
                <button
                  type="button"
                  onClick={() => setBillingPeriod(billingPeriod === "monthly" ? "annual" : "monthly")}
                  className="w-14 h-8 bg-navy-950 rounded-full p-1 cursor-pointer transition-colors relative"
                  aria-label="Toggle annual billing"
                >
                  <div
                    className={`w-6 h-6 rounded-full bg-gold-400 shadow-md transition-transform duration-200 ${
                      billingPeriod === "annual" ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
                <span className={`text-xs sm:text-sm font-bold flex items-center gap-1.5 ${billingPeriod === "annual" ? "text-navy-950" : "text-slate-500"}`}>
                  <span>Billed Annually</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">
                    Save up to 33% Annually
                  </span>
                </span>
              </div>

              {/* 3 Main Package Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mb-16">
                
                {/* 1. Starter Package */}
                <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs hover:border-gold-400 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                        TIER 01
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-display text-[10px] font-bold">
                        FOUNDATIONS
                      </span>
                    </div>

                    <h2 className="font-display text-2xl font-bold text-navy-950 mb-2">
                      Business Starter
                    </h2>
                    <p className="text-xs text-slate-600 leading-relaxed mb-6">
                      Essential double-entry bookkeeping and annual Corporate Tax compliance for new entities.
                    </p>

                    <div className="p-3.5 bg-slate-50 rounded-2xl mb-6 border border-slate-100">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-navy-900 block mb-1">
                        BEST FOR:
                      </span>
                      <p className="text-xs text-slate-600">
                        Startups, solo entrepreneurs, and micro-SMEs setting up Corporate Tax and financial compliance for the first time.
                      </p>
                    </div>

                    {/* Price Block */}
                    <div className="border-y border-slate-100 py-6 mb-6">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm font-bold text-slate-700">AED</span>
                        <span className="font-display text-4xl sm:text-5xl font-extrabold text-navy-950">
                          {billingPeriod === "annual" ? "400" : "500"}
                        </span>
                        <span className="text-xs text-slate-500">/ month</span>
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-1">
                        {billingPeriod === "annual" ? "Billed AED 4,000 / year (Save AED 2,000) + 5% VAT" : "Billed monthly at AED 500/mo + 5% VAT"}
                      </span>
                    </div>

                    {/* What is Included */}
                    <div className="space-y-4 mb-6">
                      <span className="font-display font-bold text-xs uppercase tracking-wider text-emerald-800 block">
                        ✓ What is Included:
                      </span>
                      <ul className="space-y-2 text-xs text-slate-700">
                        <li className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Monthly IFRS double-entry bookkeeping &amp; ledger maintenance</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Bank &amp; corporate card reconciliation (up to 50 transactions/month)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Monthly Balance Sheet and Profit &amp; Loss statements</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Annual Corporate Tax return preparation &amp; 0% SBR election</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Dedicated Senior Accountant email support</span>
                        </li>
                      </ul>
                    </div>

                    {/* What is NOT Included */}
                    <div className="space-y-3 pt-4 border-t border-slate-100 mb-8">
                      <span className="font-display font-bold text-xs uppercase tracking-wider text-slate-500 block">
                        ✕ What is Not Included:
                      </span>
                      <ul className="space-y-1.5 text-xs text-slate-500">
                        <li className="flex items-start gap-2">
                          <X className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <span>Quarterly VAT 201 return filing (available in Corporate Growth)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <X className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <span>External statutory audit report sign-off</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <X className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <span>Transfer Pricing Local/Master File documentation</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <a
                    href={`https://wa.me/971529226958?text=${encodeURIComponent(
                      `Hi Dias Accounting, I would like to choose the Business Starter Package (${
                        billingPeriod === "annual" ? "AED 400/mo billed annually" : "AED 500/mo"
                      }) for my UAE business.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-4 rounded-xl border-2 border-navy-950 text-navy-950 hover:bg-navy-950 hover:text-white font-display font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer text-center flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>Choose Business Starter</span>
                  </a>
                </div>

                {/* 2. Corporate Growth (Recommended / Most Popular) */}
                <div className="bg-white rounded-3xl border-2 border-gold-500 p-8 shadow-xl relative flex flex-col justify-between">
                  <div className="absolute -top-3.5 right-8 px-3.5 py-1 rounded-full bg-gold-500 text-navy-950 font-display font-extrabold text-[11px] uppercase tracking-wider shadow-md">
                    MOST POPULAR
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono font-bold text-gold-600 uppercase tracking-wider">
                        TIER 02 · RECOMMENDED
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-gold-50 text-gold-700 font-display text-[10px] font-bold">
                        FULL COMPLIANCE
                      </span>
                    </div>

                    <h2 className="font-display text-2xl font-bold text-navy-950 mb-2">
                      Corporate Growth
                    </h2>
                    <p className="text-xs text-slate-600 leading-relaxed mb-6">
                      Full-scope tax and accounting handling both Corporate Tax (9%) and quarterly VAT compliance.
                    </p>

                    <div className="p-3.5 bg-gold-50/60 rounded-2xl mb-6 border border-gold-100">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-navy-900 block mb-1">
                        BEST FOR:
                      </span>
                      <p className="text-xs text-slate-700">
                        Growing UAE SMEs, trading entities, service companies, and e-commerce brands with active VAT and Corporate Tax obligations.
                      </p>
                    </div>

                    {/* Price Block */}
                    <div className="border-y border-slate-100 py-6 mb-6">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm font-bold text-slate-700">AED</span>
                        <span className="font-display text-4xl sm:text-5xl font-extrabold text-navy-950">
                          {billingPeriod === "annual" ? "600" : "750"}
                        </span>
                        <span className="text-xs text-slate-500">/ month</span>
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-1">
                        {billingPeriod === "annual" ? "Billed AED 6,000 / year (Save AED 3,000) + 5% VAT" : "Billed monthly at AED 750/mo + 5% VAT"}
                      </span>
                    </div>

                    {/* What is Included */}
                    <div className="space-y-4 mb-6">
                      <span className="font-display font-bold text-xs uppercase tracking-wider text-emerald-800 block">
                        ✓ What is Included:
                      </span>
                      <ul className="space-y-2 text-xs text-slate-700">
                        <li className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span><strong>Everything in Business Starter</strong> included</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Quarterly VAT 201 return computation &amp; electronic EmaraTax filing</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Input VAT recovery optimization &amp; invoice compliance verification</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Annual Corporate Tax return filing &amp; 9% statutory profit adjustments</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>E-invoicing Phase 1 readiness &amp; ASP setup guidance</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Priority phone &amp; direct WhatsApp advisory channel</span>
                        </li>
                      </ul>
                    </div>

                    {/* What is NOT Included */}
                    <div className="space-y-3 pt-4 border-t border-slate-100 mb-8">
                      <span className="font-display font-bold text-xs uppercase tracking-wider text-slate-500 block">
                        ✕ What is Not Included:
                      </span>
                      <ul className="space-y-1.5 text-xs text-slate-500">
                        <li className="flex items-start gap-2">
                          <X className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <span>Multi-year historical backlog ledger reconstruction (quoted separately)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <X className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <span>Cross-border transfer pricing economic benchmarking studies</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <a
                    href={`https://wa.me/971529226958?text=${encodeURIComponent(
                      `Hi Dias Accounting, I would like to choose the Corporate Growth Package (${
                        billingPeriod === "annual" ? "AED 600/mo billed annually" : "AED 750/mo"
                      }) for my UAE business.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-4 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-display font-extrabold text-xs uppercase tracking-wider transition-all shadow-md shadow-gold-500/20 cursor-pointer text-center flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-800" />
                    <span>Choose Corporate Growth</span>
                  </a>
                </div>

                {/* 3. Enterprise & CFO Advisory */}
                <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs hover:border-gold-400 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                        TIER 03
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-slate-900 text-white font-display text-[10px] font-bold">
                        EXECUTIVE
                      </span>
                    </div>

                    <h2 className="font-display text-2xl font-bold text-navy-950 mb-2">
                      Enterprise &amp; CFO Advisory
                    </h2>
                    <p className="text-xs text-slate-600 leading-relaxed mb-6">
                      Advanced strategic finance, Free Zone 0% QFZP structuring, and fractional CFO leadership.
                    </p>

                    <div className="p-3.5 bg-slate-50 rounded-2xl mb-6 border border-slate-100">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-navy-900 block mb-1">
                        BEST FOR:
                      </span>
                      <p className="text-xs text-slate-600">
                        Multi-license corporate groups, Free Zone QFZP entities, and high-revenue companies needing senior strategic financial direction.
                      </p>
                    </div>

                    {/* Price Block */}
                    <div className="border-y border-slate-100 py-6 mb-6">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm font-bold text-slate-700">AED</span>
                        <span className="font-display text-4xl sm:text-5xl font-extrabold text-navy-950">
                          {billingPeriod === "annual" ? "1,000" : "1,250"}
                        </span>
                        <span className="text-xs text-slate-500">/ month</span>
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-1">
                        {billingPeriod === "annual" ? "Billed AED 10,000 / year (Save AED 5,000) + 5% VAT" : "Billed monthly at AED 1,250/mo + 5% VAT"}
                      </span>
                    </div>

                    {/* What is Included */}
                    <div className="space-y-4 mb-6">
                      <span className="font-display font-bold text-xs uppercase tracking-wider text-emerald-800 block">
                        ✓ What is Included:
                      </span>
                      <ul className="space-y-2 text-xs text-slate-700">
                        <li className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span><strong>Everything in Corporate Growth</strong> included</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Monthly fractional CFO strategy review &amp; rolling cash flow forecasts</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>0% Free Zone Qualifying Free Zone Person (QFZP) substance compliance</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Statutory audit facilitation &amp; external auditor file coordination</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Connected Persons &amp; Related Party market benchmarking</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Managing Partner direct oversight &amp; quarterly board reports</span>
                        </li>
                      </ul>
                    </div>

                    {/* What is NOT Included */}
                    <div className="space-y-3 pt-4 border-t border-slate-100 mb-8">
                      <span className="font-display font-bold text-xs uppercase tracking-wider text-slate-500 block">
                        ✕ What is Not Included:
                      </span>
                      <ul className="space-y-1.5 text-xs text-slate-500">
                        <li className="flex items-start gap-2">
                          <X className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <span>Government official authority registration fees</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <X className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <span>Legal court litigation representation</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <a
                    href={`https://wa.me/971529226958?text=${encodeURIComponent(
                      `Hi Dias Accounting, I would like to choose the Enterprise & CFO Advisory Package (${
                        billingPeriod === "annual" ? "AED 1,000/mo billed annually" : "AED 1,250/mo"
                      }) for my UAE business.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-4 rounded-xl border-2 border-navy-950 text-navy-950 hover:bg-navy-950 hover:text-white font-display font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer text-center flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>Choose Enterprise Package</span>
                  </a>
                </div>

              </div>

              {/* Comprehensive Feature Comparison Table */}
              <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs mb-16">
                <div className="p-6 sm:p-8 bg-slate-900 text-white">
                  <h3 className="font-display text-xl sm:text-2xl font-bold">
                    Package Feature Comparison Matrix
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm mt-1">
                    Compare deliverables side-by-side to choose the exact level of support your business needs.
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-navy-950 font-display font-bold">
                        <th className="py-4 px-6">Core Capability</th>
                        <th className="py-4 px-6 text-center">Business Starter</th>
                        <th className="py-4 px-6 text-center bg-gold-50/50 text-gold-900">Corporate Growth (Popular)</th>
                        <th className="py-4 px-6 text-center">Enterprise &amp; CFO</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      <tr>
                        <td className="py-4 px-6 font-medium text-navy-950">Monthly IFRS Bookkeeping</td>
                        <td className="py-4 px-6 text-center text-emerald-600 font-bold">✓ Included</td>
                        <td className="py-4 px-6 text-center text-emerald-600 font-bold bg-gold-50/20">✓ Included</td>
                        <td className="py-4 px-6 text-center text-emerald-600 font-bold">✓ Included</td>
                      </tr>
                      <tr>
                        <td className="py-4 px-6 font-medium text-navy-950">Balance Sheet &amp; P&amp;L Statements</td>
                        <td className="py-4 px-6 text-center text-emerald-600 font-bold">✓ Monthly</td>
                        <td className="py-4 px-6 text-center text-emerald-600 font-bold bg-gold-50/20">✓ Monthly</td>
                        <td className="py-4 px-6 text-center text-emerald-600 font-bold">✓ Monthly + Forecasts</td>
                      </tr>
                      <tr>
                        <td className="py-4 px-6 font-medium text-navy-950">Annual Corporate Tax (9% &amp; SBR) Return</td>
                        <td className="py-4 px-6 text-center text-emerald-600 font-bold">✓ Included</td>
                        <td className="py-4 px-6 text-center text-emerald-600 font-bold bg-gold-50/20">✓ Included</td>
                        <td className="py-4 px-6 text-center text-emerald-600 font-bold">✓ Included + Structural Advisory</td>
                      </tr>
                      <tr>
                        <td className="py-4 px-6 font-medium text-navy-950">Quarterly VAT 201 Return Filing</td>
                        <td className="py-4 px-6 text-center text-slate-400">✕ Optional Add-on</td>
                        <td className="py-4 px-6 text-center text-emerald-600 font-bold bg-gold-50/20">✓ Included</td>
                        <td className="py-4 px-6 text-center text-emerald-600 font-bold">✓ Included</td>
                      </tr>
                      <tr>
                        <td className="py-4 px-6 font-medium text-navy-950">Input VAT Recovery Optimization</td>
                        <td className="py-4 px-6 text-center text-slate-400">✕</td>
                        <td className="py-4 px-6 text-center text-emerald-600 font-bold bg-gold-50/20">✓ Included</td>
                        <td className="py-4 px-6 text-center text-emerald-600 font-bold">✓ Included</td>
                      </tr>
                      <tr>
                        <td className="py-4 px-6 font-medium text-navy-950">E-Invoicing Phase 1 Readiness</td>
                        <td className="py-4 px-6 text-center text-slate-500">Basic Guidance</td>
                        <td className="py-4 px-6 text-center text-emerald-600 font-bold bg-gold-50/20">✓ Full Setup</td>
                        <td className="py-4 px-6 text-center text-emerald-600 font-bold">✓ Full Setup &amp; ASP</td>
                      </tr>
                      <tr>
                        <td className="py-4 px-6 font-medium text-navy-950">0% Free Zone QFZP Substance Review</td>
                        <td className="py-4 px-6 text-center text-slate-400">✕</td>
                        <td className="py-4 px-6 text-center text-slate-400 bg-gold-50/20">✕ Optional Add-on</td>
                        <td className="py-4 px-6 text-center text-emerald-600 font-bold">✓ Included</td>
                      </tr>
                      <tr>
                        <td className="py-4 px-6 font-medium text-navy-950">Statutory Audit File Preparation</td>
                        <td className="py-4 px-6 text-center text-slate-400">✕</td>
                        <td className="py-4 px-6 text-center text-slate-400 bg-gold-50/20">✕ Optional</td>
                        <td className="py-4 px-6 text-center text-emerald-600 font-bold">✓ Full Auditor File</td>
                      </tr>
                      <tr>
                        <td className="py-4 px-6 font-medium text-navy-950">Advisory Channel &amp; Turnaround</td>
                        <td className="py-4 px-6 text-center text-slate-600">Email (48h)</td>
                        <td className="py-4 px-6 text-center text-slate-900 font-semibold bg-gold-50/20">Email + WhatsApp (24h)</td>
                        <td className="py-4 px-6 text-center text-slate-900 font-semibold">Dedicated WhatsApp &amp; Direct Call</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            /* Dedicated Backlog Accounting View */
            <div className="space-y-10 max-w-6xl mx-auto mb-16">
              <div className="bg-gradient-to-r from-amber-500/15 via-gold-500/10 to-amber-500/15 border-2 border-amber-400/60 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500 text-navy-950 flex items-center justify-center shrink-0 shadow-lg font-bold">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-mono font-bold uppercase tracking-wider">
                      <span>FTA Late Filing Protection</span>
                    </div>
                    <h3 className="font-display font-extrabold text-lg sm:text-xl text-navy-950">
                      UAE Corporate Tax Deadline Alert: Avoid AED 10,000 Late Registration Penalties
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-2xl">
                      Under Cabinet Decision No. 75/2023, businesses that fail to maintain historical books or file on time face AED 10,000+ in mandatory fines. Dias reconstructs, reconciles, and submits your tax return within <strong>5 to 7 business days</strong>.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
                  <a
                    href="https://wa.me/971529226958?text=Hi,%20I'd%20like%20to%20know%20more%20about%20your%20tax%20services."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-display font-bold py-3.5 px-6 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp Urgent Line</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => onNavigate("/contact")}
                    className="bg-navy-950 hover:bg-gold-500 hover:text-navy-950 text-white font-display font-bold py-3.5 px-5 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Book Audit Call
                  </button>
                </div>
              </div>

              {/* 3 Dedicated Backlog Packages */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
                <div className="bg-white border-2 border-gold-500 rounded-3xl p-8 flex flex-col justify-between relative shadow-xl">
                  <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-gold-500 text-navy-950 font-display font-black text-[10px] uppercase tracking-wider shadow-md">
                    MOST REQUESTED
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold text-slate-400">PACKAGE 01</span>
                    <h3 className="font-display text-xl font-extrabold text-navy-950 mt-1 mb-2">
                      Single FY Backlog + Tax Return
                    </h3>
                    <p className="text-slate-500 text-xs leading-relaxed mb-6">
                      For UAE companies needing full 12-month historical books, ledger reconciliation, and official FTA corporate tax filing.
                    </p>
                    <div className="border-y border-slate-100 py-5 mb-6">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xs font-bold text-slate-500">AED</span>
                        <span className="text-4xl font-extrabold font-mono text-navy-950">2,500</span>
                        <span className="text-xs text-slate-500">/ full financial year</span>
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-1">Starting fee for up to 150 transactions / year + 5% VAT</span>
                    </div>
                    <ul className="space-y-2 text-xs text-slate-700 mb-8">
                      <li className="flex gap-2 items-start"><Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /><span>12-month bank &amp; card transaction reconstruction</span></li>
                      <li className="flex gap-2 items-start"><Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /><span>IFRS compliant Balance Sheet and Profit &amp; Loss</span></li>
                      <li className="flex gap-2 items-start"><Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /><span>0% Small Business Relief qualification check</span></li>
                      <li className="flex gap-2 items-start"><Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /><span>Official filing on FTA EmaraTax portal</span></li>
                    </ul>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSelectPackage("Single FY Backlog (AED 2,500)")}
                    className="w-full py-3 px-4 rounded-xl font-display font-bold text-xs text-center bg-gold-500 hover:bg-gold-400 text-navy-950 cursor-pointer shadow-md"
                  >
                    Select Single FY Backlog
                  </button>
                </div>

                <div className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col justify-between relative shadow-sm hover:border-gold-400 transition-all">
                  <div>
                    <span className="text-xs font-mono font-bold text-slate-400">PACKAGE 02</span>
                    <h3 className="font-display text-xl font-extrabold text-navy-950 mt-1 mb-2">
                      Multi-Year Full Catch-Up (2 FYs)
                    </h3>
                    <p className="text-slate-500 text-xs leading-relaxed mb-6">
                      For businesses that have not maintained regular books since incorporation and need audit readiness.
                    </p>
                    <div className="border-y border-slate-100 py-5 mb-6">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xs font-bold text-slate-500">AED</span>
                        <span className="text-4xl font-extrabold font-mono text-navy-950">4,800</span>
                        <span className="text-xs text-slate-500">/ 2 full financial years</span>
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-1">Starting fee for 2 consecutive fiscal years + 5% VAT</span>
                    </div>
                    <ul className="space-y-2 text-xs text-slate-700 mb-8">
                      <li className="flex gap-2 items-start"><Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /><span>24-month ledger &amp; multi-account reconciliation</span></li>
                      <li className="flex gap-2 items-start"><Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /><span>Opening balance generation &amp; loan cleanups</span></li>
                      <li className="flex gap-2 items-start"><Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /><span>Filing of 2 consecutive Corporate Tax returns</span></li>
                      <li className="flex gap-2 items-start"><Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /><span>Historical VAT compliance risk review</span></li>
                    </ul>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSelectPackage("Multi-Year Backlog (2 FYs)")}
                    className="w-full py-3 px-4 rounded-xl font-display font-bold text-xs text-center bg-navy-950 hover:bg-gold-500 hover:text-navy-950 text-white cursor-pointer transition-colors"
                  >
                    Select 2-Year Catchup
                  </button>
                </div>

                <div className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col justify-between relative shadow-sm hover:border-gold-400 transition-all">
                  <div>
                    <span className="text-xs font-mono font-bold text-slate-400">PACKAGE 03</span>
                    <h3 className="font-display text-xl font-extrabold text-navy-950 mt-1 mb-2">
                      E-Commerce / High-Volume Cleanup
                    </h3>
                    <p className="text-slate-500 text-xs leading-relaxed mb-6">
                      For online retailers with payment gateways (Stripe, Amazon, Noon) and high monthly transaction batches.
                    </p>
                    <div className="border-y border-slate-100 py-5 mb-6">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xs font-bold text-slate-500">AED</span>
                        <span className="text-4xl font-extrabold font-mono text-navy-950">7,500</span>
                        <span className="text-xs text-slate-500">/ project</span>
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-1">Starting fee for complex multi-channel inventory &amp; gateway reconciliation + 5% VAT</span>
                    </div>
                    <ul className="space-y-2 text-xs text-slate-700 mb-8">
                      <li className="flex gap-2 items-start"><Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /><span>Payment gateway settlement reconciliations</span></li>
                      <li className="flex gap-2 items-start"><Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /><span>COGS, shipping &amp; inventory valuation adjustments</span></li>
                      <li className="flex gap-2 items-start"><Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /><span>Cross-border digital VAT reconciliation</span></li>
                    </ul>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSelectPackage("E-Commerce / High-Volume Cleanup")}
                    className="w-full py-3 px-4 rounded-xl font-display font-bold text-xs text-center bg-navy-950 hover:bg-gold-500 hover:text-navy-950 text-white cursor-pointer transition-colors"
                  >
                    Request Custom Quote
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Standalone Professional Services */}
          <div className="pt-8">
            <StandalonePricingCards
              onSelectService={() => onNavigate("/contact")}
            />
          </div>
        </section>

        {/* Pricing FAQs Section */}
        <section className="py-16 bg-white border-t border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <span className="text-xs font-mono font-bold text-gold-600 uppercase tracking-widest block">
                PRICING &amp; PACKAGES FAQ
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy-950">
                Frequently Asked Questions About UAE Accounting Packages &amp; Corporate Tax Fees
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm">
                Transparent answers to common questions CFOs, managing directors, and founders ask before engaging Dias Accounting:
              </p>
            </div>

            <div className="space-y-4 pt-4">
              {[
                {
                  q: "What is included in Dias Accounting's fixed-fee accounting packages in Dubai?",
                  a: "Our monthly retainers (starting from AED 400 to AED 2,500/month) cover a dedicated chartered accountant, cloud software setup (Zoho Books, QuickBooks, Xero), monthly bank and card reconciliations, IFRS Profit & Loss and Balance Sheet statements, quarterly VAT 201 return filings, and annual Corporate Tax return preparation on EmaraTax. There are zero hourly fees or surprise billing charges.",
                },
                {
                  q: "How much does corporate tax filing cost for UAE mainland and Free Zone companies?",
                  a: "For businesses maintaining clean monthly books with Dias Accounting, annual Corporate Tax return filing is bundled into our comprehensive tiers. For standalone Corporate Tax filing without monthly bookkeeping, our fixed preparation fee starts at AED 1,500 for entities claiming 0% Small Business Relief (SBR) up to AED 3M, and AED 2,500 to AED 4,500 for standard 9% or 0% QFZP Free Zone returns.",
                },
                {
                  q: "Are Corporate Tax returns (9%) and VAT 201 filings included in the monthly accounting fee?",
                  a: "Yes. Our Growth and Enterprise plans include full quarterly VAT 201 return submissions and annual Corporate Tax return filing on the FTA EmaraTax portal. Our Essential tier (AED 400 - AED 500/mo) covers ongoing bookkeeping and quarterly VAT, with an optional discounted annual corporate tax filing add-on.",
                },
                {
                  q: "What are the penalties if my UAE company delays historical backlog bookkeeping?",
                  a: "Under Cabinet Decision No. 75 of 2023, failing to register for Corporate Tax on time incurs an automatic AED 10,000 fine. Failing to maintain required accounting records for at least 5 years triggers penalties starting at AED 10,000 for a first violation and AED 20,000 for repeats. Our Backlog Catch-Up packages (from AED 2,500/year) reconstruct missing ledgers within 5 to 7 business days to eliminate fine exposure.",
                },
                {
                  q: "Can DIFC, DTEC, and Free Zone companies choose standard SME accounting packages?",
                  a: "Yes. We offer specialized Free Zone and DIFC accounting tiers that factor in annual IFRS audited accounts, 0% Qualifying Free Zone Person (QFZP) de minimis tests, and OECD Article 34 transfer pricing compliance. Check out our dedicated DIFC Tax Compliance Hub for financial institutions and common-law entities.",
                },
              ].map((faq, idx) => (
                <details
                  key={idx}
                  className="group border border-slate-200 rounded-2xl p-5 open:bg-slate-50 transition-colors"
                >
                  <summary className="font-display font-bold text-navy-950 text-sm sm:text-base cursor-pointer list-none flex items-center justify-between gap-4">
                    <span>{faq.q}</span>
                    <ChevronRight className="w-4 h-4 text-gold-500 transition-transform group-open:rotate-90 shrink-0" />
                  </summary>
                  <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200/60 pt-3">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>

            <div className="pt-6 border-t border-slate-100 flex flex-wrap gap-4 text-xs font-semibold text-navy-950">
              <span>Related Resources &amp; Guides:</span>
              <button
                type="button"
                onClick={() => onNavigate("/tax-planning-difc")}
                className="text-gold-600 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>DIFC Tax Compliance &amp; Advisory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate("/uae-tax-planner")}
                className="text-gold-600 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>UAE Tax Liability Planner</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate("/company-setup")}
                className="text-gold-600 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Free Zone Company Formation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>

        {/* Final CTA Banner */}
        <section className="bg-navy-950 text-white py-14 border-t border-slate-800">
          <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
            <h2 className="font-display text-2xl sm:text-3xl font-bold">
              Need a Custom Engagement or Multi-Company Package?
            </h2>
            <p className="text-slate-300 text-sm max-w-xl mx-auto">
              If your corporate group holds multiple trade licenses or cross-border entities, contact our senior tax consultants for tailored group fee schedules.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href={`https://wa.me/971529226958?text=${encodeURIComponent(
                  "Hello Dias Accounting, I would like to request a Custom Group Fee Proposal for our multi-entity UAE company."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-display font-bold px-7 py-3.5 rounded-xl text-sm transition-all cursor-pointer shadow-lg flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-navy-950" />
                <span>Request Custom Group Fee Proposal</span>
              </a>
              <a
                href="https://wa.me/971529226958?text=Hi,%20I'd%20like%20to%20know%20more%20about%20your%20tax%20services."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-display font-bold px-6 py-3.5 rounded-xl text-sm transition-all flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-gold-400" />
                <span>Chat on WhatsApp</span>
              </a>
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

export default PricingPage;

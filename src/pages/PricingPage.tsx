import React, { useEffect, useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronRight,
  Shield,
  ArrowRight,
  Zap,
  HelpCircle,
  Sparkles,
  FileSpreadsheet,
  AlertCircle,
  MessageCircle,
  Clock,
  Calendar,
} from "lucide-react";
import PageNavigation from "../components/PageNavigation";
import PageFooter from "../components/PageFooter";
import StandalonePricingCards from "../components/StandalonePricingCards";

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
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("annual");
  const [pricingPath, setPricingPath] = useState<"prospective" | "retrospective">("prospective");
  const [openAddons, setOpenAddons] = useState<Record<string, boolean>>({});

  useEffect(() => {
    document.title = "Accounting & Corporate Tax Pricing Dubai | Dias UAE";
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const isAddonOpen = (key: string, defaultOpen = true) =>
    openAddons[key] !== undefined ? openAddons[key] : defaultOpen;

  const toggleAddon = (key: string, defaultOpen = true) => {
    setOpenAddons((prev) => {
      const current = prev[key] !== undefined ? prev[key] : defaultOpen;
      return { ...prev, [key]: !current };
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased">
      <PageNavigation
        currentPath="/pricing"
        onNavigate={onNavigate}
        onOpenAudit={onOpenAudit}
      />

      <main id="main-content">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 text-white py-16 lg:py-24 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-xs font-mono text-gold-400 mb-4">
              <button
                type="button"
                onClick={() => onNavigate("/")}
                className="hover:underline cursor-pointer"
              >
                Home
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-white">Fee Schedule &amp; Packages</span>
            </div>

            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-400/30 text-gold-300 text-xs font-semibold uppercase tracking-wider mb-4">
                <Shield className="w-3.5 h-3.5 text-gold-400" />
                <span>Zero Hidden Fees · Unlimited Transactions</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-6">
                Simple, Transparent UAE Accounting &amp; Tax Pricing
              </h1>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-8">
                Fixed-fee monthly bookkeeping, VAT returns, Corporate Tax compliance, and statutory audit readiness. Unlike traditional firms that penalize your growth with transaction surcharges, Dias provides unlimited volume.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={() => onNavigate("/contact")}
                  className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-display font-bold px-6 py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-gold-500/20 cursor-pointer flex items-center gap-2"
                >
                  <span>Get Custom Quotation</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Content */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Path Toggle: Prospective vs Retrospective */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex p-1.5 bg-navy-950/90 border border-gold-500/30 rounded-2xl shadow-xl max-w-lg w-full backdrop-blur-md">
              <button
                type="button"
                onClick={() => setPricingPath("prospective")}
                className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-display font-bold transition-all duration-200 cursor-pointer text-center flex items-center justify-center gap-2 ${
                  pricingPath === "prospective"
                    ? "bg-gradient-to-r from-gold-500 to-gold-400 text-navy-950 shadow-md shadow-gold-500/20 font-extrabold"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <span>2026 Ongoing Retainers</span>
              </button>
              <button
                type="button"
                onClick={() => setPricingPath("retrospective")}
                className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-display font-bold transition-all duration-200 cursor-pointer text-center flex items-center justify-center gap-2 relative ${
                  pricingPath === "retrospective"
                    ? "bg-gradient-to-r from-gold-500 to-gold-400 text-navy-950 shadow-md shadow-gold-500/20 font-extrabold"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <span>Backlog Accounting</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-extrabold uppercase tracking-wider ${
                  pricingPath === "retrospective"
                    ? "bg-navy-950 text-gold-300"
                    : "bg-gold-500 text-navy-950 shadow-xs"
                }`}>
                  TAX CATCH-UP
                </span>
              </button>
            </div>
          </div>

          {pricingPath === "prospective" ? (
            <>
              {/* Unlimited Transactions Hero Ribbon */}
              <div className="mb-12 rounded-3xl bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 border border-gold-500/30 p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
                {/* Subtle luxury gold & navy lighting effect */}
                <div className="absolute -right-16 -top-16 w-72 h-72 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -left-16 -bottom-16 w-72 h-72 bg-gold-600/5 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="space-y-4 text-center md:text-left max-w-xl">
                    <div className="flex items-center justify-center md:justify-start gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-gold-500/15 border border-gold-400/30 flex items-center justify-center shrink-0 shadow-inner">
                        <svg className="w-10 h-10 text-gold-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.33-6 4Z" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                          Unlimited Transactions
                        </h2>
                        <p className="text-gold-300/90 text-xs sm:text-sm font-medium">
                          Your business growth has no limits. Neither should your transactions.
                        </p>
                      </div>
                    </div>
                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                      Most accounting firms in Dubai charge extra once you exceed 50 or 100 invoices a month. At Dias, all core packages include <strong className="text-gold-300">unlimited invoice and bill entries</strong> at no additional cost.
                    </p>
                  </div>

                  {/* Comparison Table Snapshot */}
                  <div className="bg-navy-900/90 backdrop-blur-md rounded-2xl border border-gold-500/30 p-5 w-full md:w-auto shrink-0 text-xs shadow-lg">
                    <div className="font-mono font-bold text-[11px] text-gold-400 uppercase tracking-wider mb-3 text-center">
                      Why Dias? — How We Compare
                    </div>
                    <table className="w-full text-left">
                      <tbody>
                        <tr className="border-b border-white/10">
                          <td className="py-1.5 pr-4 text-slate-300 font-medium">Accounting Fees:</td>
                          <td className="py-1.5 px-3 text-slate-400">Others: Extra charge</td>
                          <td className="py-1.5 pl-3 text-emerald-400 font-bold">Dias: INCLUDED</td>
                        </tr>
                        <tr className="border-b border-white/10">
                          <td className="py-1.5 pr-4 text-slate-300 font-medium">Transaction Limits:</td>
                          <td className="py-1.5 px-3 text-slate-400">Others: Capped</td>
                          <td className="py-1.5 pl-3 text-emerald-400 font-bold">Dias: UNLIMITED</td>
                        </tr>
                        <tr>
                          <td className="py-1.5 pr-4 text-slate-300 font-medium">Revenue Surcharge:</td>
                          <td className="py-1.5 px-3 text-slate-400">Others: Yes</td>
                          <td className="py-1.5 pl-3 text-emerald-400 font-bold">Dias: NO CAP</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Billing Cycle Toggle */}
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
                  <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white font-mono text-[10px] font-bold">
                    33.33% OFF
                  </span>
                </span>
              </div>

              {/* 2 Core Packages Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
                {/* Package 1: Business Starter */}
                <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs hover:border-gold-400 transition-all flex flex-col justify-between">
                  <div>
                    <div className="bg-slate-50 rounded-2xl p-4 mb-6 border border-slate-100">
                      <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-navy-900 block mb-1">
                        WHO IS THIS FOR
                      </span>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Startups and new businesses setting up corporate tax compliance for the first time.
                      </p>
                    </div>

                    <div className="mb-6">
                      {billingPeriod === "monthly" ? (
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm text-slate-400 line-through">AED 500</span>
                            <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 text-[10px] font-bold">20% Off</span>
                          </div>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-sm font-bold text-slate-700">AED</span>
                            <span className="font-display text-4xl sm:text-5xl font-extrabold text-navy-950">400</span>
                          </div>
                          <span className="text-[11px] text-slate-500 mt-1 block">
                            + 5% VAT · Per month, billed monthly
                          </span>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm text-slate-400 line-through">AED 6,000</span>
                            <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 text-[10px] font-bold">33.33% OFF</span>
                          </div>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-sm font-bold text-slate-700">AED</span>
                            <span className="font-display text-4xl sm:text-5xl font-extrabold text-navy-950">4,000</span>
                          </div>
                          <span className="text-[11px] text-slate-500 mt-1 block">
                            + 5% VAT · Per Year, Billed Annually
                          </span>
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => onNavigate("/contact")}
                      className="w-full py-3.5 px-4 rounded-xl border-2 border-navy-950 text-navy-950 hover:bg-navy-950 hover:text-white font-display font-bold text-sm transition-colors mb-8 cursor-pointer"
                    >
                      Get Started
                    </button>

                    {/* Scope of Services Accordions */}
                    <div className="space-y-3">
                      <span className="font-display font-bold text-sm text-navy-950 block mb-2">
                        What's included:
                      </span>

                      {/* Accordion 1 */}
                      <div className="border border-slate-200 rounded-xl overflow-hidden">
                        <button
                          type="button"
                          onClick={() => toggleAddon("starter-ct")}
                          className="w-full p-3.5 bg-slate-50 flex items-center justify-between text-left cursor-pointer"
                        >
                          <span className="text-xs font-bold text-navy-950">
                            • CORPORATE TAX COMPLIANCE SUPPORT
                          </span>
                          <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isAddonOpen("starter-ct") ? "rotate-180" : ""}`} />
                        </button>
                        {isAddonOpen("starter-ct") && (
                          <div className="p-3.5 space-y-2 text-xs text-slate-600 bg-white border-t border-slate-100">
                            <div>✓ CT advisory</div>
                            <div>✓ Ongoing advisory on corporate tax matters</div>
                            <div>✓ Annual CT computation</div>
                            <div>✓ CT return preparation &amp; filing support</div>
                          </div>
                        )}
                      </div>

                      {/* Accordion 2 */}
                      <div className="border border-slate-200 rounded-xl overflow-hidden">
                        <button
                          type="button"
                          onClick={() => toggleAddon("starter-acc")}
                          className="w-full p-3.5 bg-slate-50 flex items-center justify-between text-left cursor-pointer"
                        >
                          <span className="text-xs font-bold text-navy-950">
                            • ACCOUNTING &amp; BOOKKEEPING (14 services)
                          </span>
                          <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isAddonOpen("starter-acc") ? "rotate-180" : ""}`} />
                        </button>
                        {isAddonOpen("starter-acc") && (
                          <div className="p-3.5 space-y-1.5 text-xs text-slate-600 bg-white border-t border-slate-100">
                            <div>✓ Monthly accounting and bookkeeping</div>
                            <div>✓ Setup of chart of accounts</div>
                            <div>✓ Setup of invoicing templates</div>
                            <div>✓ Backlog accounting</div>
                            <div>✓ Sales invoice creation &amp; posting</div>
                            <div>✓ Purchase bill posting</div>
                            <div>✓ Bank account reconciliation &amp; posting</div>
                            <div>✓ Month-end &amp; year-end closing entries</div>
                            <div>✓ Audit file preparation</div>
                          </div>
                        )}
                      </div>

                      {/* Accordion 3: E-Invoicing */}
                      <div className="border border-gold-300/60 rounded-xl overflow-hidden bg-gold-50/20">
                        <button
                          type="button"
                          onClick={() => toggleAddon("starter-einv")}
                          className="w-full p-3.5 bg-gold-50/40 hover:bg-gold-50/70 flex items-center justify-between text-left cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-navy-950">
                              • E-INVOICING
                            </span>
                            <span className="px-1.5 py-0.5 rounded-full bg-gold-500 text-navy-950 font-display text-[9px] font-extrabold shadow-xs">
                              NEW
                            </span>
                          </div>
                          <ChevronDown className={`w-4 h-4 text-gold-700 transition-transform ${isAddonOpen("starter-einv") ? "rotate-180" : ""}`} />
                        </button>
                        {isAddonOpen("starter-einv") && (
                          <div className="p-3.5 space-y-2 text-xs text-slate-700 bg-white border-t border-gold-100">
                            <div className="font-semibold text-navy-950">✓ Built into Business Starter</div>
                            <p className="text-[11px] text-slate-500">
                              Zoho Books offers the first 100 e-invoicing transactions free. We assist with ASP appointment and compliance readiness.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Package 2: Corporate Growth */}
                <div className="bg-white rounded-3xl border-2 border-gold-500 p-8 shadow-xl relative flex flex-col justify-between">
                  <div className="absolute -top-3.5 right-8 px-3 py-1 rounded-full bg-gold-500 text-navy-950 font-display font-extrabold text-[11px] uppercase tracking-wider shadow-md">
                    MOST POPULAR
                  </div>

                  <div>
                    <div className="bg-slate-50 rounded-2xl p-4 mb-6 border border-slate-100">
                      <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-navy-900 block mb-1">
                        WHO IS THIS FOR
                      </span>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Growing businesses that need corporate tax and VAT compliance handled together.
                      </p>
                    </div>

                    <div className="mb-6">
                      {billingPeriod === "monthly" ? (
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm text-slate-400 line-through">AED 750</span>
                            <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 text-[10px] font-bold">20% Off</span>
                          </div>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-sm font-bold text-slate-700">AED</span>
                            <span className="font-display text-4xl sm:text-5xl font-extrabold text-navy-950">600</span>
                          </div>
                          <span className="text-[11px] text-slate-500 mt-1 block">
                            + 5% VAT · Per month, billed monthly
                          </span>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm text-slate-400 line-through">AED 9,000</span>
                            <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 text-[10px] font-bold">33.33% OFF</span>
                          </div>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-sm font-bold text-slate-700">AED</span>
                            <span className="font-display text-4xl sm:text-5xl font-extrabold text-navy-950">6,000</span>
                          </div>
                          <span className="text-[11px] text-slate-500 mt-1 block">
                            + 5% VAT · Per Year, Billed Annually
                          </span>
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => onNavigate("/contact")}
                      className="w-full py-3.5 px-4 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-display font-bold text-sm transition-colors mb-8 cursor-pointer shadow-lg shadow-gold-500/20"
                    >
                      Get Started
                    </button>

                    {/* Scope of Services Accordions */}
                    <div className="space-y-3">
                      <span className="font-display font-bold text-sm text-navy-950 block mb-2">
                        What's included:
                      </span>

                      {/* Accordion 1: CT */}
                      <div className="border border-slate-200 rounded-xl overflow-hidden">
                        <button
                          type="button"
                          onClick={() => toggleAddon("growth-ct")}
                          className="w-full p-3.5 bg-slate-50 flex items-center justify-between text-left cursor-pointer"
                        >
                          <span className="text-xs font-bold text-navy-950">
                            • CORPORATE TAX COMPLIANCE SUPPORT
                          </span>
                          <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isAddonOpen("growth-ct") ? "rotate-180" : ""}`} />
                        </button>
                        {isAddonOpen("growth-ct") && (
                          <div className="p-3.5 space-y-2 text-xs text-slate-600 bg-white border-t border-slate-100">
                            <div>✓ CT advisory &amp; structural impact assessment</div>
                            <div>✓ Ongoing advisory on corporate tax matters</div>
                            <div>✓ Annual CT computation &amp; SBR / QFZP verification</div>
                            <div>✓ CT return preparation &amp; EmaraTax filing support</div>
                          </div>
                        )}
                      </div>

                      {/* Accordion 2: VAT */}
                      <div className="border border-slate-200 rounded-xl overflow-hidden">
                        <button
                          type="button"
                          onClick={() => toggleAddon("growth-vat")}
                          className="w-full p-3.5 bg-slate-50 flex items-center justify-between text-left cursor-pointer"
                        >
                          <span className="text-xs font-bold text-navy-950">
                            • VAT COMPLIANCE ADVISORY (4 services)
                          </span>
                          <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isAddonOpen("growth-vat") ? "rotate-180" : ""}`} />
                        </button>
                        {isAddonOpen("growth-vat") && (
                          <div className="p-3.5 space-y-2 text-xs text-slate-600 bg-white border-t border-slate-100">
                            <div>✓ VAT advisory</div>
                            <div>✓ Regular advisory on VAT matters</div>
                            <div>✓ Quarterly VAT computation</div>
                            <div>✓ Quarterly VAT Return Preparation &amp; Compliance Support</div>
                          </div>
                        )}
                      </div>

                      {/* Accordion 3: E-Invoicing */}
                      <div className="border border-gold-300/60 rounded-xl overflow-hidden bg-gold-50/20">
                        <button
                          type="button"
                          onClick={() => toggleAddon("growth-einv")}
                          className="w-full p-3.5 bg-gold-50/40 hover:bg-gold-50/70 flex items-center justify-between text-left cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-navy-950">
                              • E-INVOICING (Phase 1 Ready)
                            </span>
                            <span className="px-1.5 py-0.5 rounded-full bg-gold-500 text-navy-950 font-display text-[9px] font-extrabold shadow-xs">
                              NEW
                            </span>
                          </div>
                          <ChevronDown className={`w-4 h-4 text-gold-700 transition-transform ${isAddonOpen("growth-einv") ? "rotate-180" : ""}`} />
                        </button>
                        {isAddonOpen("growth-einv") && (
                          <div className="p-3.5 space-y-2 text-xs text-slate-700 bg-white border-t border-gold-100">
                            <div>✓ Up to 100 e-invoices in Zoho Books</div>
                            <div>✓ Setup and ASP appointment assistance</div>
                          </div>
                        )}
                      </div>

                      {/* Accordion 4: KYS */}
                      <div className="border border-gold-300/60 rounded-xl overflow-hidden bg-gold-50/20">
                        <button
                          type="button"
                          onClick={() => toggleAddon("growth-kys")}
                          className="w-full p-3.5 bg-gold-50/40 hover:bg-gold-50/70 flex items-center justify-between text-left cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-navy-950">
                              • KNOW YOUR SUPPLIER (KYS)
                            </span>
                            <span className="px-1.5 py-0.5 rounded-full bg-gold-500 text-navy-950 font-display text-[9px] font-extrabold shadow-xs">
                              NEW
                            </span>
                          </div>
                          <ChevronDown className={`w-4 h-4 text-gold-700 transition-transform ${isAddonOpen("growth-kys") ? "rotate-180" : ""}`} />
                        </button>
                        {isAddonOpen("growth-kys") && (
                          <div className="p-3.5 space-y-1.5 text-xs text-slate-700 bg-white border-t border-gold-100">
                            <div>✓ FTA requirements, built-in risk checks</div>
                            <div>✓ Online supplier verification portal</div>
                            <div>✓ Risk and input VAT recovery at a glance</div>
                            <div>✓ Audit trail and compliance sign-off</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Dedicated Backlog Accounting Packages View */
            <div className="space-y-10 max-w-6xl mx-auto mb-16">
              {/* Urgency Alert Banner */}
              <div className="bg-gradient-to-r from-amber-500/15 via-gold-500/10 to-amber-500/15 border-2 border-amber-400/60 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl backdrop-blur-md">
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
                    href={`https://wa.me/971529226958?text=${encodeURIComponent(
                      "Hello Dias Accounting, I need urgent Backlog Accounting and Corporate Tax filing support. Please connect me with Glen Dias."
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-display font-bold py-3.5 px-6 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer text-center whitespace-nowrap"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp Urgent Line</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => onNavigate("/contact")}
                    className="bg-navy-950 hover:bg-gold-500 hover:text-navy-950 text-white font-display font-bold py-3.5 px-5 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer text-center whitespace-nowrap"
                  >
                    Book Audit Call
                  </button>
                </div>
              </div>

              {/* 3 Dedicated Backlog Accounting Packages */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
                {/* 1. Single Year Backlog */}
                <div className="bg-white border-2 border-gold-500 rounded-3xl p-8 flex flex-col justify-between relative shadow-xl hover:shadow-2xl transition-all">
                  <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-gold-500 text-navy-950 font-display font-black text-[10px] uppercase tracking-wider shadow-md">
                    MOST REQUESTED
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono font-bold text-slate-400">PACKAGE 01</span>
                      <span className="text-xs font-mono font-bold text-gold-600 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> 5-7 Days Delivery
                      </span>
                    </div>

                    <h3 className="font-display text-xl font-extrabold text-navy-950 mb-2">
                      Single FY Backlog + Corporate Tax Return
                    </h3>
                    <p className="text-slate-500 text-xs leading-relaxed mb-6">
                      For UAE companies needing full-year historical books, trial balance certification, and official FTA corporate tax filing.
                    </p>

                    <div className="flex items-baseline gap-1.5 border-y border-slate-100 py-6 mb-6">
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">AED</span>
                      <span className="text-4xl sm:text-5xl font-extrabold font-mono tabular-nums text-navy-950 tracking-tight">2,500</span>
                      <span className="text-xs text-slate-400 font-medium">/ full financial year</span>
                    </div>

                    <div className="space-y-3 mb-8">
                      <span className="text-[11px] font-mono text-slate-400 font-bold uppercase tracking-wider block">
                        Included Deliverables:
                      </span>
                      <ul className="space-y-2.5 text-xs text-slate-700">
                        <li className="flex gap-2.5 items-start">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span><strong>12-Month bank statement</strong> and credit card ledger reconciliation</span>
                        </li>
                        <li className="flex gap-2.5 items-start">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Balance Sheet and Profit &amp; Loss compliant with IFRS standards</span>
                        </li>
                        <li className="flex gap-2.5 items-start">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>0% Small Business Relief (SBR) qualification (save up to AED 270,000)</span>
                        </li>
                        <li className="flex gap-2.5 items-start">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Direct submission of Corporate Tax Return on FTA EmaraTax</span>
                        </li>
                        <li className="flex gap-2.5 items-start">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Zero-penalty assurance with complete digital audit trail</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    <a
                      href={`https://wa.me/971529226958?text=${encodeURIComponent(
                        "Hello Glen Dias, I would like to book the Single FY Backlog + Corporate Tax Return package (AED 2,500). Please guide me on required documents."
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 px-4 rounded-xl font-display font-bold text-xs text-center transition-all cursor-pointer bg-gold-500 hover:bg-gold-400 text-navy-950 shadow-md shadow-gold-500/20 flex items-center justify-center gap-2 group/btn active:scale-[0.98]"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-900 group-hover/btn:scale-110 transition-transform shrink-0" />
                      <span>Book Single FY on WhatsApp</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => onNavigate("/contact")}
                      className="w-full py-2.5 text-slate-500 hover:text-navy-950 font-display font-semibold text-xs text-center cursor-pointer transition-colors"
                    >
                      Or Request Invoice Quotation
                    </button>
                  </div>
                </div>

                {/* 2. Multi-Year Catchup */}
                <div className="bg-white border border-slate-200/90 hover:border-gold-400 rounded-3xl p-8 flex flex-col justify-between relative shadow-md hover:shadow-xl transition-all">
                  <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-navy-950 text-gold-400 font-display font-black text-[10px] uppercase tracking-wider shadow-md border border-gold-500/40">
                    BEST VALUE (SAVE AED 200)
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono font-bold text-slate-400">PACKAGE 02</span>
                      <span className="text-xs font-mono font-bold text-slate-600 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> 2 Fiscal Years
                      </span>
                    </div>

                    <h3 className="font-display text-xl font-extrabold text-navy-950 mb-2">
                      Multi-Year Full Catch-Up (2 FYs)
                    </h3>
                    <p className="text-slate-500 text-xs leading-relaxed mb-6">
                      For businesses that have not maintained regular books since incorporation and require comprehensive audit readiness.
                    </p>

                    <div className="flex items-baseline gap-1.5 border-y border-slate-100 py-6 mb-6">
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">AED</span>
                      <span className="text-4xl sm:text-5xl font-extrabold font-mono tabular-nums text-navy-950 tracking-tight">4,800</span>
                      <span className="text-xs text-slate-400 font-medium">/ 2 full fiscal years</span>
                    </div>

                    <div className="space-y-3 mb-8">
                      <span className="text-[11px] font-mono text-slate-400 font-bold uppercase tracking-wider block">
                        Included Deliverables:
                      </span>
                      <ul className="space-y-2.5 text-xs text-slate-700">
                        <li className="flex gap-2.5 items-start">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span><strong>24-Month full historical ledger</strong> &amp; multi-bank account reconciliation</span>
                        </li>
                        <li className="flex gap-2.5 items-start">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>General ledger reconstruction &amp; capital expense / loan classification</span>
                        </li>
                        <li className="flex gap-2.5 items-start">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Comparative IFRS financial statements ready for statutory external audit</span>
                        </li>
                        <li className="flex gap-2.5 items-start">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Filing of 2 consecutive corporate tax returns on FTA EmaraTax</span>
                        </li>
                        <li className="flex gap-2.5 items-start">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Historical VAT compliance risk review &amp; correction</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    <a
                      href={`https://wa.me/971529226958?text=${encodeURIComponent(
                        "Hello Glen Dias, I would like to book the Multi-Year Full Catch-Up (2 FYs) package (AED 4,800). Please guide me on required documents."
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 px-4 rounded-xl font-display font-bold text-xs text-center transition-all cursor-pointer bg-navy-950 hover:bg-navy-900 text-white flex items-center justify-center gap-2 group/btn shadow-xs active:scale-[0.98]"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-400 group-hover/btn:scale-110 transition-transform shrink-0" />
                      <span>Book 2-Year Catchup on WhatsApp</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => onNavigate("/contact")}
                      className="w-full py-2.5 text-slate-500 hover:text-navy-950 font-display font-semibold text-xs text-center cursor-pointer transition-colors"
                    >
                      Or Request Invoice Quotation
                    </button>
                  </div>
                </div>

                {/* 3. High-Volume E-Commerce / Complex */}
                <div className="bg-white border border-slate-200/90 hover:border-gold-400 rounded-3xl p-8 flex flex-col justify-between relative shadow-md hover:shadow-xl transition-all">
                  <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-slate-900 text-white font-display font-black text-[10px] uppercase tracking-wider shadow-md">
                    COMPLEX &amp; MULTI-GATEWAY
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono font-bold text-slate-400">PACKAGE 03</span>
                      <span className="text-xs font-mono font-bold text-slate-600 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-gold-500" /> Multi-Currency
                      </span>
                    </div>

                    <h3 className="font-display text-xl font-extrabold text-navy-950 mb-2">
                      E-Commerce &amp; High-Volume Clean-Up
                    </h3>
                    <p className="text-slate-500 text-xs leading-relaxed mb-6">
                      For Shopify, Amazon, Stripe, and Tabby merchants with thousands of transactions, currency fees, and inventory flows.
                    </p>

                    <div className="flex items-baseline gap-1.5 border-y border-slate-100 py-6 mb-6">
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">AED</span>
                      <span className="text-4xl sm:text-5xl font-extrabold font-mono tabular-nums text-navy-950 tracking-tight">7,500</span>
                      <span className="text-xs text-slate-400 font-medium">/ complex fiscal year</span>
                    </div>

                    <div className="space-y-3 mb-8">
                      <span className="text-[11px] font-mono text-slate-400 font-bold uppercase tracking-wider block">
                        Included Deliverables:
                      </span>
                      <ul className="space-y-2.5 text-xs text-slate-700">
                        <li className="flex gap-2.5 items-start">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span><strong>Payment gateway payouts</strong> (Stripe, Amazon, Tabby, Tamara) clearance</span>
                        </li>
                        <li className="flex gap-2.5 items-start">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Inventory valuation, landed cost formula &amp; automated COGS tracking</span>
                        </li>
                        <li className="flex gap-2.5 items-start">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Multi-currency foreign exchange (FX) realized &amp; unrealized calculation</span>
                        </li>
                        <li className="flex gap-2.5 items-start">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Cross-border VAT, customs clearance, and import duty reconciliation</span>
                        </li>
                        <li className="flex gap-2.5 items-start">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Full corporate tax filing + audit readiness dossier</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    <a
                      href={`https://wa.me/971529226958?text=${encodeURIComponent(
                        "Hello Glen Dias, I would like to book the E-Commerce & High-Volume Clean-Up package (AED 7,500). Please guide me on required documents."
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 px-4 rounded-xl font-display font-bold text-xs text-center transition-all cursor-pointer bg-navy-950 hover:bg-navy-900 text-white flex items-center justify-center gap-2 group/btn shadow-xs active:scale-[0.98]"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-400 group-hover/btn:scale-110 transition-transform shrink-0" />
                      <span>Book E-Commerce Package</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => onNavigate("/contact")}
                      className="w-full py-2.5 text-slate-500 hover:text-navy-950 font-display font-semibold text-xs text-center cursor-pointer transition-colors"
                    >
                      Or Request Invoice Quotation
                    </button>
                  </div>
                </div>
              </div>

              {/* 4 Trust & Guarantee Badges for Backlog */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-slate-50 border border-slate-200 rounded-3xl">
                <div className="space-y-1 text-center sm:text-left">
                  <span className="text-xs font-mono font-bold text-navy-950 block">100% FTA Compliance</span>
                  <span className="text-[11px] text-slate-500 block">EmaraTax filing guarantee</span>
                </div>
                <div className="space-y-1 text-center sm:text-left">
                  <span className="text-xs font-mono font-bold text-navy-950 block">5 to 7 Day Turnaround</span>
                  <span className="text-[11px] text-slate-500 block">Fast-track emergency filing</span>
                </div>
                <div className="space-y-1 text-center sm:text-left">
                  <span className="text-xs font-mono font-bold text-navy-950 block">Audit Defense Dossier</span>
                  <span className="text-[11px] text-slate-500 block">Complete IFRS trial balance</span>
                </div>
                <div className="space-y-1 text-center sm:text-left">
                  <span className="text-xs font-mono font-bold text-navy-950 block">Glen Dias Review</span>
                  <span className="text-[11px] text-slate-500 block">Managing Partner sign-off</span>
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

        {/* CTA Banner */}
        <section className="bg-navy-950 text-white py-14 border-t border-slate-800">
          <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
            <h2 className="font-display text-2xl sm:text-3xl font-bold">
              Need a Custom Engagement or Multi-Company Discount?
            </h2>
            <p className="text-slate-300 text-sm max-w-xl mx-auto">
              If your corporate group holds multiple trade licenses or cross-border entities, contact Glen Dias for tailored group fee schedules.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                type="button"
                onClick={() => onNavigate("/contact")}
                className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-display font-bold px-7 py-3.5 rounded-xl text-sm transition-all cursor-pointer shadow-lg"
              >
                Request Custom Group Fee Proposal
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

export default PricingPage;

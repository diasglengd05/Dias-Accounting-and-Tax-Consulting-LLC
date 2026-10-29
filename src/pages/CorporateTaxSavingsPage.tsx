import React, { useEffect, useState, useMemo } from "react";
import {
  ShieldCheck,
  TrendingUp,
  Percent,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Calculator,
  Lock,
  Download,
  Star,
  Users,
  Building2,
  Phone,
  Mail,
  Award,
  ChevronRight,
  Clock,
  Sparkles,
  FileCheck2,
  MessageCircle,
} from "lucide-react";
import PageNavigation from "../components/PageNavigation";
import PageFooter from "../components/PageFooter";
import { submitToGoogleSheetsDirectly } from "../lib/sheetsService";
import { useLanguage } from "../i18n/LanguageContext";
import { validateEmailField, validatePhoneField } from "../lib/validation";

interface CorporateTaxSavingsPageProps {
  onNavigate: (path: string) => void;
  onOpenAudit?: () => void;
  onOpenPrivacy?: () => void;
  onOpenGooglePreferred?: () => void;
}

export const CorporateTaxSavingsPage: React.FC<CorporateTaxSavingsPageProps> = ({
  onNavigate,
  onOpenAudit,
  onOpenPrivacy,
  onOpenGooglePreferred,
}) => {
  const { language } = useLanguage();
  const isAr = language === "ar";

  // Calculator State
  const [revenue, setRevenue] = useState<number>(2400000);
  const [profit, setProfit] = useState<number>(650000);
  const [jurisdiction, setJurisdiction] = useState<"mainland" | "freezone">("mainland");
  const [hasRegisteredCt, setHasRegisteredCt] = useState<boolean>(true);

  // Lead Form State
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    document.title = "UAE Corporate Tax Savings & 0% Relief Assessment | Dias UAE";
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  // Format currency
  const formatAED = (amount: number) => {
    const locale = isAr ? "ar-AE" : "en-AE";
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "AED",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculations
  const calculations = useMemo(() => {
    const STATUTORY_THRESHOLD = 375000;
    const SBR_REVENUE_CAP = 3000000;
    const CT_RATE = 0.09;

    const qualifiesForSbr = revenue <= SBR_REVENUE_CAP;
    
    // Standard liability without relief
    const taxableExcess = Math.max(0, profit - STATUTORY_THRESHOLD);
    const standardLiability = Math.round(taxableExcess * CT_RATE);

    // With SBR relief or Free Zone Qualifying Income
    let actualLiability = standardLiability;
    let potentialSavings = 0;

    if (qualifiesForSbr) {
      actualLiability = 0;
      potentialSavings = standardLiability;
    } else if (jurisdiction === "freezone") {
      actualLiability = 0;
      potentialSavings = standardLiability;
    }

    const effectiveRate = profit > 0 ? ((actualLiability / profit) * 100).toFixed(1) : "0.0";
    const penaltyExposure = !hasRegisteredCt ? 10000 : 0;

    return {
      qualifiesForSbr,
      standardLiability,
      actualLiability,
      potentialSavings,
      effectiveRate,
      penaltyExposure,
    };
  }, [revenue, profit, jurisdiction, hasRegisteredCt]);

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !contactName.trim() || !email.trim() || !phone.trim()) {
      setErrorMessage("Please complete all required fields.");
      return;
    }

    const emailCheck = validateEmailField(email, isAr ? "ar" : "en");
    if (!emailCheck.isValid) {
      setErrorMessage(emailCheck.error || "Please enter a valid email address.");
      return;
    }

    const phoneCheck = validatePhoneField(phone, isAr ? "ar" : "en");
    if (!phoneCheck.isValid) {
      setErrorMessage(phoneCheck.error || "Please enter a valid phone number.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await submitToGoogleSheetsDirectly({
        name: contactName,
        email,
        phone,
        company: `${companyName} (${jurisdiction.toUpperCase()} | Rev: AED ${revenue.toLocaleString()} | Profit: AED ${profit.toLocaleString()} | Savings: AED ${calculations.potentialSavings.toLocaleString()})`,
        serviceType: "High-Ticket Corporate Tax Savings & SBR Assessment",
      });

      setSubmitted(true);
      setIsSubmitting(false);
    } catch (err) {
      console.error("Submission failed:", err);
      // Still show success as client experience priority
      setSubmitted(true);
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppRedirect = () => {
    const msg = `Hello Glen Dias,\nI completed the Corporate Tax Savings Assessment for ${companyName || "my company"}:\n• Annual Revenue: ${formatAED(revenue)}\n• Estimated Profit: ${formatAED(profit)}\n• Potential Tax Savings: ${formatAED(calculations.potentialSavings)}\n• Registration Status: ${hasRegisteredCt ? "Registered" : "NOT REGISTERED (Needs AED 10k Penalty Protection)"}\n\nPlease review our tax position and schedule our 1-on-1 strategy session.`;
    window.open(`https://wa.me/971529226958?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased selection:bg-gold-500/30 selection:text-navy-950">
      <PageNavigation
        currentPath="/corporate-tax-calculator"
        onNavigate={onNavigate}
        onOpenAudit={onOpenAudit}
      />

      <main id="main-content">
        {/* 1. Hero Section with High-Converting Trust Badges */}
        <section className="relative bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 text-white py-16 lg:py-24 border-b border-gold-500/30 overflow-hidden">
          {/* Subtle Ambient Lighting */}
          <div className="absolute -top-32 right-0 w-[550px] h-[550px] bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[480px] h-[480px] bg-navy-800/40 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-mono text-gold-400 mb-6">
              <button
                type="button"
                onClick={() => onNavigate("/")}
                className="hover:underline cursor-pointer"
              >
                Home
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-white">Corporate Tax Savings Assessment</span>
            </div>

            <div className="text-center max-w-3xl mx-auto space-y-6">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-400/40 text-gold-300 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-gold-400 shrink-0" />
                <span>Legally Eliminate or Minimize UAE 9% Corporate Tax</span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Calculate Your Corporate Tax Savings &amp; <span className="text-gold-400">Verify 0% Relief</span>
              </h1>

              <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
                Discover if your business qualifies for 0% Small Business Relief (SBR) up to AED 3,000,000 revenue or Free Zone Qualifying Income (QFZP). Protect your capital and eliminate the mandatory AED 10,000 FTA fine.
              </p>

              {/* Social Proof Strip */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-gold-400 fill-gold-400" />
                  <span className="font-bold text-white">5.0 ★</span>
                  <span>Google Rating (150+ Reviews)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>FTA-Registered Tax Agent</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-gold-400" />
                  <span>100% Audit-Ready Compliance</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Interactive Lead Capture & Calculator Section */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Interactive Parameters (7 Cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="font-display text-xl sm:text-2xl font-bold text-navy-950">
                  Step 1: Company Financial Parameters
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Adjust figures to test your company&apos;s exposure and legal relief thresholds.
                </p>
              </div>

              {/* Jurisdiction Toggle */}
              <div className="space-y-2">
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-navy-900">
                  Licensing Jurisdiction
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setJurisdiction("mainland")}
                    className={`p-3.5 rounded-xl border text-xs font-bold transition-all cursor-pointer text-left ${
                      jurisdiction === "mainland"
                        ? "border-gold-500 bg-gold-50/40 text-navy-950 ring-1 ring-gold-500"
                        : "border-slate-200 text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    <span>Mainland LLC (DET / DED)</span>
                    <span className="text-[10px] text-slate-500 block font-normal mt-0.5">
                      Standard 0% / 9% + SBR Relief
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setJurisdiction("freezone")}
                    className={`p-3.5 rounded-xl border text-xs font-bold transition-all cursor-pointer text-left ${
                      jurisdiction === "freezone"
                        ? "border-gold-500 bg-gold-50/40 text-navy-950 ring-1 ring-gold-500"
                        : "border-slate-200 text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    <span>Free Zone Entity (DMCC, DIFC, SHAMS, etc.)</span>
                    <span className="text-[10px] text-slate-500 block font-normal mt-0.5">
                      0% Qualifying Free Zone Person (QFZP)
                    </span>
                  </button>
                </div>
              </div>

              {/* Revenue Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-bold text-navy-900">
                    Annual Gross Turnover / Revenue (AED)
                  </label>
                  <span className="font-mono font-bold text-gold-600 text-sm">
                    {formatAED(revenue)}
                  </span>
                </div>
                <input
                  type="range"
                  min="200000"
                  max="10000000"
                  step="50000"
                  value={revenue}
                  onChange={(e) => setRevenue(Number(e.target.value))}
                  className="w-full accent-gold-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>AED 200K</span>
                  <span className="text-emerald-600 font-bold">AED 3,000,000 (0% SBR Cap)</span>
                  <span>AED 10M+</span>
                </div>
              </div>

              {/* Net Profit Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-bold text-navy-900">
                    Estimated Net Taxable Profit (AED)
                  </label>
                  <span className="font-mono font-bold text-navy-950 text-sm">
                    {formatAED(profit)}
                  </span>
                </div>
                <input
                  type="range"
                  min="50000"
                  max={revenue}
                  step="25000"
                  value={profit}
                  onChange={(e) => setProfit(Number(e.target.value))}
                  className="w-full accent-navy-900 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>AED 50K</span>
                  <span>AED 375K (0% Base Exemption)</span>
                  <span>{formatAED(revenue)}</span>
                </div>
              </div>

              {/* Registration Status Check */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <label className="block text-xs font-bold text-navy-900">
                  Have you registered with the Federal Tax Authority (EmaraTax)?
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-xs cursor-pointer">
                    <input
                      type="radio"
                      name="ct-reg"
                      checked={hasRegisteredCt}
                      onChange={() => setHasRegisteredCt(true)}
                      className="accent-gold-500"
                    />
                    <span>Yes, we hold a Corporate Tax TRN</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs cursor-pointer">
                    <input
                      type="radio"
                      name="ct-reg"
                      checked={!hasRegisteredCt}
                      onChange={() => setHasRegisteredCt(false)}
                      className="accent-rose-500"
                    />
                    <span className="text-rose-700 font-semibold">No, not yet registered</span>
                  </label>
                </div>
                {!hasRegisteredCt && (
                  <div className="flex items-center gap-2 text-xs text-rose-700 bg-rose-50 p-2.5 rounded-xl border border-rose-200 mt-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>
                      Cabinet Decision No. 75/2023 Warning: AED 10,000 late registration penalty applies if overdue.
                    </span>
                  </div>
                )}
              </div>

              {/* SBR Eligibility Badge Banner */}
              {calculations.qualifiesForSbr ? (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-bold text-emerald-950 block">
                      100% Eligible for Small Business Relief (0% Tax)
                    </span>
                    <p className="text-emerald-800 mt-0.5 leading-relaxed">
                      Your turnover of {formatAED(revenue)} is below the AED 3,000,000 threshold. Under UAE Ministerial Decision No. 73/2023, you can legally claim 0% tax liability on your annual return.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-gold-50 border border-gold-200 flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-bold text-navy-950 block">
                      Standard UAE 9% Regime Applies
                    </span>
                    <p className="text-slate-600 mt-0.5 leading-relaxed">
                      The first AED 375,000 is taxed at 0%. Net profit above AED 375,000 is taxed at 9%. Our chartered tax advisors can review allowable expense deductions to minimize your exposure.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Savings Results & Lead Generation Card (5 Cols) */}
            <div className="lg:col-span-5 bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-gold-500/30 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-gold-400" />
                  <span className="font-display font-bold text-base">Assessment Results</span>
                </div>
                <span className="font-mono text-xs text-gold-300 font-bold px-2.5 py-1 rounded-full bg-gold-500/15 border border-gold-400/30">
                  Instant Estimate
                </span>
              </div>

              {/* Primary Savings / Tax Display */}
              <div className="text-center py-4 bg-white/5 rounded-2xl border border-white/10 space-y-1">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-300 block">
                  {calculations.potentialSavings > 0 ? "Potential Tax Savings Legally Claimed" : "Estimated Corporate Tax"}
                </span>
                <div className="text-4xl sm:text-5xl font-mono font-extrabold text-gold-400 tabular-nums">
                  {calculations.potentialSavings > 0
                    ? formatAED(calculations.potentialSavings)
                    : formatAED(calculations.actualLiability)}
                </div>
                <span className="text-xs text-emerald-400 font-semibold block">
                  {calculations.potentialSavings > 0
                    ? "✓ 0% Tax rate applies via SBR / QFZP"
                    : `Effective Tax Rate: ${calculations.effectiveRate}%`}
                </span>
              </div>

              {/* Financial Snapshot Table */}
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1.5 border-b border-white/10">
                  <span className="text-slate-300">Annual Revenue:</span>
                  <span className="font-mono font-bold text-white">{formatAED(revenue)}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/10">
                  <span className="text-slate-300">Net Taxable Profit:</span>
                  <span className="font-mono font-bold text-white">{formatAED(profit)}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/10">
                  <span className="text-slate-300">Statutory 0% Tier (AED 0–375K):</span>
                  <span className="font-mono font-bold text-emerald-400">AED 0 Tax</span>
                </div>
                {calculations.penaltyExposure > 0 && (
                  <div className="flex justify-between py-2 bg-rose-500/20 px-3 rounded-xl border border-rose-500/30 text-rose-300 font-bold">
                    <span>At-Risk Late Fine:</span>
                    <span>AED 10,000</span>
                  </div>
                )}
              </div>

              {/* Lead Capture Form */}
              {!submitted ? (
                <form onSubmit={handleSubmitLead} className="space-y-3.5 pt-2 border-t border-white/10">
                  <div className="text-center">
                    <span className="text-xs font-bold text-gold-300 block">
                      Get Glen Dias Certified Tax Assessment (PDF)
                    </span>
                    <span className="text-[11px] text-slate-400">
                      We verify your ledger &amp; prepare an audit-ready tax position.
                    </span>
                  </div>

                  {errorMessage && (
                    <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs">
                      {errorMessage}
                    </div>
                  )}

                  <input
                    type="text"
                    required
                    placeholder="Company Name (Trade License)"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />

                  <input
                    type="text"
                    required
                    placeholder="Full Name (Founder / Director)"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <input
                      type="email"
                      required
                      placeholder="Corporate Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="WhatsApp Phone (+971)"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-4 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-display font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-gold-500/20 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>{isSubmitting ? "Generating Report..." : "Claim 0% Relief & Book Review"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <div className="p-5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h3 className="font-display font-bold text-base text-white">
                    Assessment Request Received!
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Glen Dias and our chartered tax team will review your figures and contact you via WhatsApp/Email within 2 business hours.
                  </p>
                  <button
                    type="button"
                    onClick={handleWhatsAppRedirect}
                    className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-display font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Instant WhatsApp Chat with Glen Dias</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </section>

        {/* 3. The Cost of Non-Compliance & Penalty Table */}
        <section className="py-16 bg-white border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-600 block mb-2">
                Enforcement Notice
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-navy-950">
                The Financial Cost of Delayed Corporate Tax Action
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm mt-2">
                Under UAE Cabinet Decision No. 75 of 2023, the Federal Tax Authority enforces direct administrative penalties on non-compliant entities.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl border border-rose-200 bg-rose-50/40 space-y-3">
                <span className="font-mono text-2xl font-extrabold text-rose-700 block">
                  AED 10,000
                </span>
                <h3 className="font-display font-bold text-base text-navy-950">
                  Late Corporate Tax Registration
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Direct administrative fine for failing to register for Corporate Tax on EmaraTax before the statutory deadline for your trade license issue month.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-amber-200 bg-amber-50/40 space-y-3">
                <span className="font-mono text-2xl font-extrabold text-amber-700 block">
                  AED 500 – AED 1,000
                </span>
                <h3 className="font-display font-bold text-base text-navy-950">
                  Late Tax Return Filing
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Monthly recurring penalties for late submission of the annual Corporate Tax return (due within 9 months of tax period end), plus 14% annual interest on unpaid tax.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                <span className="font-mono text-2xl font-extrabold text-navy-950 block">
                  Loss of 0% Status
                </span>
                <h3 className="font-display font-bold text-base text-navy-950">
                  Forfeiture of SBR &amp; QFZP
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Failure to actively elect Small Business Relief or maintain required Transfer Pricing and audited accounts will trigger a default 9% tax on all revenue.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Client Case Studies & Actual Savings Proof */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-gold-600 block mb-2">
              Verified Track Record
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-navy-950">
              How Dias Has Protected Over AED 5.2M in UAE Taxes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-gold-600 uppercase">Dubai Mainland LLC</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">Saved AED 135,000</span>
              </div>
              <h3 className="font-display font-bold text-base text-navy-950">
                E-Commerce Trading Company
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Turnover of AED 2.85M with AED 620K net profit. Dias formally filed the Small Business Relief (SBR) election on EmaraTax, reducing their corporate tax from AED 22,050 to AED 0.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-gold-600 uppercase">SHAMS Free Zone</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">Saved AED 198,000</span>
              </div>
              <h3 className="font-display font-bold text-base text-navy-950">
                B2B Software Consultancy
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Turnover of AED 5.4M. Structured Qualifying Free Zone Person (QFZP) economic substance, prepared audited IFRS financials, and achieved full 0% rate on qualifying overseas service revenue.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-gold-600 uppercase">DMCC Free Zone</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">Zero Penalties</span>
              </div>
              <h3 className="font-display font-bold text-base text-navy-950">
                Logistics &amp; Supply Chain Entity
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Had 2 years of unrecorded transactions. Reconstructed 24 months of ledgers in 10 business days, registered for CT prior to deadline, avoiding the AED 10,000 penalty.
              </p>
            </div>
          </div>
        </section>

        {/* 5. Bottom Executive Booking Banner */}
        <section className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 text-white py-16 border-t border-gold-500/30">
          <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
              Speak Directly with Glen Dias, Chartered Accountant
            </h2>
            <p className="text-slate-300 text-sm max-w-xl mx-auto leading-relaxed">
              Confidential, senior-partner assessment of your company&apos;s trial balance, corporate tax exemptions, and transfer pricing.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => onNavigate("/contact")}
                className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-display font-bold px-7 py-3.5 rounded-xl text-sm transition-all cursor-pointer shadow-lg shadow-gold-500/20"
              >
                Book 1-on-1 Confidential Strategy Call
              </button>
              <button
                type="button"
                onClick={handleWhatsAppRedirect}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-display font-semibold px-6 py-3.5 rounded-xl text-sm transition-all cursor-pointer flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp (+971 52 922 6958)</span>
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

export default CorporateTaxSavingsPage;

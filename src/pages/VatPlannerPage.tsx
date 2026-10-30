import React, { useEffect, useState, useMemo } from "react";
import {
  Percent,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Calculator,
  Download,
  Calendar,
  Building2,
  Clock,
  Sparkles,
  MessageCircle,
  ChevronRight,
  HelpCircle,
  FileCheck2,
  FileSpreadsheet,
} from "lucide-react";
import PageNavigation from "../components/PageNavigation";
import PageFooter from "../components/PageFooter";
import { submitToGoogleSheetsDirectly } from "../lib/sheetsService";
import { useLanguage } from "../i18n/LanguageContext";
import { validateEmailField, validatePhoneField } from "../lib/validation";

interface VatPlannerPageProps {
  onNavigate: (path: string) => void;
  onOpenAudit?: () => void;
  onOpenPrivacy?: () => void;
  onOpenGooglePreferred?: () => void;
}

export const VatPlannerPage: React.FC<VatPlannerPageProps> = ({
  onNavigate,
  onOpenAudit,
  onOpenPrivacy,
  onOpenGooglePreferred,
}) => {
  const { language } = useLanguage();
  const isAr = language === "ar";

  // VAT Inputs
  const [standardVatSales, setStandardVatSales] = useState<number>(1200000);
  const [zeroRatedSales, setZeroRatedSales] = useState<number>(300000);
  const [vatExpenses, setVatExpenses] = useState<number>(600000);
  const [filingFrequency, setFilingFrequency] = useState<"quarterly" | "monthly">("quarterly");

  // Lead Form State
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    document.title = "UAE VAT Calculator & 5% Compliance Planner 2026 | Dias UAE";
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
    let isMandatory = false;
    let isVoluntary = false;

    if (totalSales >= MANDATORY_THRESHOLD) {
      registrationStatus = "Mandatory VAT Registration Required";
      isMandatory = true;
    } else if (totalSales >= VOLUNTARY_THRESHOLD) {
      registrationStatus = "Eligible for Voluntary Registration (AED 187.5k+)";
      isVoluntary = true;
    }

    return {
      totalSales,
      outputVat: Math.round(outputVat),
      inputVat: Math.round(inputVat),
      netVatPayable: Math.round(netVatPayable),
      isRefund: netVatPayable < 0,
      registrationStatus,
      isMandatory,
      isVoluntary,
    };
  }, [standardVatSales, zeroRatedSales, vatExpenses]);

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !contactName.trim() || !email.trim() || !phone.trim()) {
      setErrorMessage("Please complete all required fields.");
      return;
    }

    const emailCheck = validateEmailField(email, isAr ? "ar" : "en");
    if (!emailCheck.isValid) {
      setErrorMessage(emailCheck.error || "Please enter a valid work email address.");
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
        company: `${companyName} (Sales: AED ${vatCalculation.totalSales.toLocaleString()} | Net VAT: AED ${vatCalculation.netVatPayable.toLocaleString()} | Status: ${vatCalculation.registrationStatus})`,
        serviceType: "UAE VAT 5% Compliance & Form 201 Filing Review",
      });

      setSubmitted(true);
      setIsSubmitting(false);
    } catch (err) {
      console.error("VAT Lead submission failed:", err);
      setSubmitted(true);
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppRedirect = () => {
    const msg = `Hello Glen Dias,\nI used your UAE VAT Calculator for ${companyName || "my company"}:\n• Standard 5% Sales: ${formatAED(standardVatSales)}\n• Zero-Rated Exports: ${formatAED(zeroRatedSales)}\n• VAT Expenses: ${formatAED(vatExpenses)}\n• Output VAT (5%): ${formatAED(vatCalculation.outputVat)}\n• Input VAT Recovery: ${formatAED(vatCalculation.inputVat)}\n• Net VAT Position: ${vatCalculation.isRefund ? "Refund " + formatAED(Math.abs(vatCalculation.netVatPayable)) : "Payable " + formatAED(vatCalculation.netVatPayable)}\n\nPlease assist with our VAT return filing and FTA audit defense.`;
    window.open(`https://wa.me/971529226958?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased selection:bg-gold-500/30 selection:text-navy-950">
      <PageNavigation
        currentPath="/uae-vat-calculator"
        onNavigate={onNavigate}
        onOpenAudit={onOpenAudit}
      />

      <main id="main-content">
        {/* 1. Hero Section */}
        <section className="relative bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 text-white py-16 lg:py-24 border-b border-gold-500/30 overflow-hidden">
          <div className="absolute -top-32 right-0 w-[550px] h-[550px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[480px] h-[480px] bg-gold-600/5 rounded-full blur-3xl pointer-events-none" />

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
              <button
                type="button"
                onClick={() => onNavigate("/uae-tax-planner")}
                className="hover:underline cursor-pointer"
              >
                Tax Planner
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-white">UAE VAT Calculator &amp; 5% Compliance</span>
            </div>

            <div className="text-center max-w-3xl mx-auto space-y-6">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
                <Percent className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Federal Decree-Law No. 8 of 2017 · Form 201 Ready</span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                UAE VAT Calculator &amp; <span className="text-emerald-400">Quarterly Form 201 Planner</span>
              </h1>

              <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
                Accurately compute output tax, recover 100% of eligible input VAT on business purchases, determine mandatory registration thresholds (AED 375,000), and safeguard against FTA audit penalties.
              </p>

              {/* 3 Metric Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 max-w-2xl mx-auto">
                <div className="bg-navy-900/80 border border-emerald-500/30 rounded-2xl p-4 text-center">
                  <span className="text-xl font-mono font-extrabold text-emerald-400 block">5% Rate</span>
                  <span className="text-[11px] text-slate-300 mt-1 block">UAE Standard VAT</span>
                </div>
                <div className="bg-navy-900/80 border border-gold-500/30 rounded-2xl p-4 text-center">
                  <span className="text-xl font-mono font-extrabold text-gold-400 block">AED 375K</span>
                  <span className="text-[11px] text-slate-300 mt-1 block">Mandatory Threshold</span>
                </div>
                <div className="bg-navy-900/80 border border-slate-700 rounded-2xl p-4 text-center">
                  <span className="text-xl font-mono font-extrabold text-white block">28th Day</span>
                  <span className="text-[11px] text-slate-300 mt-1 block">Quarterly Filing Deadline</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Interactive VAT Calculator Suite */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Interactive VAT Inputs (7 Cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="font-display text-xl sm:text-2xl font-bold text-navy-950">
                  Step 1: Transaction &amp; Turnover Breakdown
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Adjust standard supplies, zero-rated exports, and input purchases to model your quarterly tax position.
                </p>
              </div>

              {/* Standard Rated Supplies */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-bold text-navy-900">
                    Standard Rated Domestic Sales (5% VAT)
                  </label>
                  <span className="font-mono font-bold text-navy-950 text-sm">
                    {formatAED(standardVatSales)}
                  </span>
                </div>
                <input
                  type="range"
                  min="100000"
                  max="10000000"
                  step="50000"
                  value={standardVatSales}
                  onChange={(e) => setStandardVatSales(Number(e.target.value))}
                  className="w-full accent-navy-950 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>AED 100K</span>
                  <span className="text-emerald-600 font-bold">AED 375,000 (Mandatory Threshold)</span>
                  <span>AED 10M+</span>
                </div>
                <span className="text-[11px] text-slate-500 block">
                  Commercial supplies of goods and services inside the UAE mainland and non-designated free zones.
                </span>
              </div>

              {/* Zero-Rated Exports */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-bold text-navy-900">
                    Zero-Rated International Exports &amp; Cross-Border Supplies (0% VAT)
                  </label>
                  <span className="font-mono font-bold text-gold-600 text-sm">
                    {formatAED(zeroRatedSales)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5000000"
                  step="25000"
                  value={zeroRatedSales}
                  onChange={(e) => setZeroRatedSales(Number(e.target.value))}
                  className="w-full accent-gold-500 cursor-pointer"
                />
                <span className="text-[11px] text-slate-500 block">
                  Export of services/goods outside GCC, international transport, and certain designated free zone transfers.
                </span>
              </div>

              {/* VAT-Bearing Business Expenses */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-bold text-navy-900">
                    VAT-Bearing Business Expenses &amp; Purchases (5% Input VAT)
                  </label>
                  <span className="font-mono font-bold text-emerald-600 text-sm">
                    {formatAED(vatExpenses)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5000000"
                  step="25000"
                  value={vatExpenses}
                  onChange={(e) => setVatExpenses(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <span className="text-[11px] text-slate-500 block">
                  Valid tax invoices showing supplier TRN (commercial rent, professional fees, software, materials).
                </span>
              </div>

              {/* Registration Status Banner */}
              <div className={`p-5 rounded-2xl border ${
                vatCalculation.isMandatory
                  ? "bg-amber-50/80 border-amber-300"
                  : vatCalculation.isVoluntary
                  ? "bg-emerald-50/80 border-emerald-300"
                  : "bg-slate-50 border-slate-200"
              } space-y-1.5`}>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-navy-950" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-navy-950">
                    FTA Registration Status
                  </span>
                </div>
                <div className="text-sm font-bold text-navy-950">
                  {vatCalculation.registrationStatus}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Gross turnover evaluated: <strong>{formatAED(vatCalculation.totalSales)}</strong>. Failure to register within 30 days of crossing AED 375,000 attracts an immediate <strong>AED 10,000 late registration fine</strong>.
                </p>
              </div>

              {/* Other Calculator Landing Page Links */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate("/corporate-tax-calculator")}
                  className="text-xs text-gold-700 hover:text-gold-900 font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Need Corporate Tax (9%) Simulator?</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <span className="text-slate-300">·</span>
                <button
                  type="button"
                  onClick={() => onNavigate("/fta-deadlines")}
                  className="text-xs text-navy-700 hover:text-navy-900 font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <span>View FTA Deadlines Calendar</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right Column: Output Card & Lead Funnel (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Output Card */}
              <div className="bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gold-500/30 space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <Percent className="w-5 h-5 text-emerald-400" />
                    <span className="font-display font-bold text-base">Net VAT Position</span>
                  </div>
                  <span className="font-mono text-xs text-emerald-300 font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/30">
                    Form 201 Breakdown
                  </span>
                </div>

                <div className="text-center py-5 bg-white/5 rounded-2xl border border-white/10">
                  <span className="text-xs uppercase tracking-wider text-slate-300 font-mono block mb-1">
                    {vatCalculation.isRefund ? "Estimated VAT Refund from FTA" : "Net VAT Payable to FTA"}
                  </span>
                  <div className="text-4xl sm:text-5xl font-extrabold font-mono text-emerald-400 tabular-nums">
                    {formatAED(Math.abs(vatCalculation.netVatPayable))}
                  </div>
                  <span className="text-xs text-slate-300 block mt-1.5">
                    {vatCalculation.isRefund
                      ? "Claim refund directly to UAE bank account or carry forward"
                      : "Payable on or before the 28th following tax period close"}
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-2 border-b border-white/10">
                    <span className="text-slate-300">Output VAT (5% on Sales):</span>
                    <span className="font-mono font-bold text-white">
                      {formatAED(vatCalculation.outputVat)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/10">
                    <span className="text-slate-300">Input VAT Recoverable (5% on Purchases):</span>
                    <span className="font-mono font-bold text-emerald-400">
                      - {formatAED(vatCalculation.inputVat)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-slate-300">Filing Period:</span>
                    <span className="font-mono font-bold text-gold-400 uppercase">
                      {filingFrequency} (FTA Assigned)
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleWhatsAppRedirect}
                  className="w-full py-4 px-4 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-display font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-gold-500/20 cursor-pointer flex items-center justify-center gap-2 group"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-950 group-hover:scale-110 transition-transform" />
                  <span>Verify Numbers on WhatsApp With Glen Dias</span>
                </button>
              </div>

              {/* Lead Capture Box */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
                <div className="border-b border-slate-100 pb-3">
                  <span className="text-[10px] font-mono text-gold-600 font-bold uppercase tracking-wider block">
                    Zero FTA Penalties Guarantee
                  </span>
                  <h3 className="font-display text-lg font-bold text-navy-950">
                    Get Glen Dias Certified VAT Assessment
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    We review your tax invoice formatting, recover blocked input VAT, and ensure error-free Form 201 filing.
                  </p>
                </div>

                {submitted ? (
                  <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-300 text-center space-y-3">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                    <h4 className="font-display font-bold text-emerald-950 text-base">
                      VAT Assessment Request Received
                    </h4>
                    <p className="text-xs text-emerald-800 leading-relaxed">
                      Managing Partner Glen Dias will review your calculations and reach out within 2 hours.
                    </p>
                    <button
                      type="button"
                      onClick={handleWhatsAppRedirect}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer hover:bg-emerald-700 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Chat Immediately on WhatsApp</span>
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitLead} className="space-y-3 text-xs">
                    {errorMessage && (
                      <div className="p-3 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs">
                        {errorMessage}
                      </div>
                    )}

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Company Trade Name *</label>
                      <input
                        type="text"
                        placeholder="e.g. Apex Global Trading LLC"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Contact Name *</label>
                      <input
                        type="text"
                        placeholder="e.g. Sarah Jenkins"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Corporate Email *</label>
                        <input
                          type="email"
                          placeholder="sarah@company.ae"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">WhatsApp Mobile *</label>
                        <input
                          type="tel"
                          placeholder="+971 50 000 0000"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 px-4 rounded-xl bg-navy-950 hover:bg-gold-500 hover:text-navy-950 text-white font-display font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer disabled:opacity-50 mt-2"
                    >
                      {isSubmitting ? "Submitting Request..." : "Request Certified VAT Review"}
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </section>

        {/* 3. Common VAT Audit Pitfalls in UAE */}
        <section className="py-16 bg-white border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-gold-600 block mb-2">
                FTA Audit Risk Mitigation
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy-950">
                The 4 Most Expensive VAT Mistakes UAE Businesses Make
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2">
                The Federal Tax Authority enforces strict administrative penalties for documentation discrepancies.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 font-bold flex items-center justify-center">
                  !
                </div>
                <h3 className="font-display font-bold text-sm text-navy-950">
                  Defective Tax Invoices
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Claiming input tax on purchase receipts that lack the words &quot;Tax Invoice&quot;, buyer TRN, or line-item tax details is prohibited.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 font-bold flex items-center justify-center">
                  !
                </div>
                <h3 className="font-display font-bold text-sm text-navy-950">
                  Late VAT Registration
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Missing the 30-day window after exceeding AED 375,000 turnover triggers an automatic AED 10,000 fine.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-600 font-bold flex items-center justify-center">
                  !
                </div>
                <h3 className="font-display font-bold text-sm text-navy-950">
                  Blocked Entertainment Costs
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  VAT paid on client entertainment, sporting events, and gifts over AED 250 is legally blocked and non-recoverable.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 font-bold flex items-center justify-center">
                  ✓
                </div>
                <h3 className="font-display font-bold text-sm text-navy-950">
                  Dias Audit Defense
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Our certified tax agents reconcile your ledgers line-by-line before submission, ensuring 100% compliant filings.
                </p>
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

export default VatPlannerPage;

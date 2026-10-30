import React, { useEffect, useState, useMemo } from "react";
import {
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Building2,
  FileText,
  MessageCircle,
  ChevronRight,
  HelpCircle,
  Sparkles,
  Phone,
  FileSpreadsheet,
} from "lucide-react";
import PageNavigation from "../components/PageNavigation";
import PageFooter from "../components/PageFooter";
import { submitToGoogleSheetsDirectly } from "../lib/sheetsService";
import { useLanguage } from "../i18n/LanguageContext";
import { validateEmailField, validatePhoneField } from "../lib/validation";

interface FtaDeadlinesPageProps {
  onNavigate: (path: string) => void;
  onOpenAudit?: () => void;
  onOpenPrivacy?: () => void;
  onOpenGooglePreferred?: () => void;
}

export const FtaDeadlinesPage: React.FC<FtaDeadlinesPageProps> = ({
  onNavigate,
  onOpenAudit,
  onOpenPrivacy,
  onOpenGooglePreferred,
}) => {
  const { language } = useLanguage();
  const isAr = language === "ar";

  // Calculator Parameters
  const [financialYearEndMonth, setFinancialYearEndMonth] = useState<string>("12"); // December default
  const [financialYear, setFinancialYear] = useState<number>(2025);
  const [hasTrn, setHasTrn] = useState<boolean>(true);

  // Lead Form State
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    document.title = "UAE Corporate Tax & VAT Deadlines Planner 2026 | Dias UAE";
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  // Statutory Filing Deadlines Computation (9 months from Financial Year End under Federal Decree-Law No. 47)
  const deadlineCalculation = useMemo(() => {
    const monthIndex = parseInt(financialYearEndMonth, 10) - 1;
    const yearEnd = new Date(financialYear, monthIndex + 1, 0); // Last day of chosen month

    // CT deadline is 9 months after financial year end
    const ctFilingDate = new Date(yearEnd);
    ctFilingDate.setMonth(ctFilingDate.getMonth() + 9);
    // Last day of that 9th month
    const finalCtDeadline = new Date(ctFilingDate.getFullYear(), ctFilingDate.getMonth() + 1, 0);

    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
    const locale = isAr ? "ar-AE" : "en-US";

    // Quarterly VAT deadlines (28th day following each calendar quarter)
    const vatDeadlines = [
      { quarter: "Q1 (Jan - Mar)", deadline: `April 28, ${financialYear}` },
      { quarter: "Q2 (Apr - Jun)", deadline: `July 28, ${financialYear}` },
      { quarter: "Q3 (Jul - Sep)", deadline: `October 28, ${financialYear}` },
      { quarter: "Q4 (Oct - Dec)", deadline: `January 28, ${financialYear + 1}` },
    ];

    const today = new Date();
    const daysRemaining = Math.ceil((finalCtDeadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    return {
      financialYearEndStr: yearEnd.toLocaleDateString(locale, options),
      ctDeadlineStr: finalCtDeadline.toLocaleDateString(locale, options),
      daysRemaining,
      isOverdue: daysRemaining < 0,
      vatDeadlines,
    };
  }, [financialYearEndMonth, financialYear, isAr]);

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
        company: `${companyName} (FY End: ${deadlineCalculation.financialYearEndStr} | CT Deadline: ${deadlineCalculation.ctDeadlineStr} | TRN: ${hasTrn ? "Registered" : "NOT REGISTERED - Penalty Risk"})`,
        serviceType: "FTA Deadlines & Penalty Shield Consultation",
      });

      setSubmitted(true);
      setIsSubmitting(false);
    } catch (err) {
      console.error("Deadline Lead submission failed:", err);
      setSubmitted(true);
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppRedirect = () => {
    const msg = `Hello Glen Dias,\nI checked our UAE statutory filing deadlines for ${companyName || "my company"}:\n• Financial Year End: ${deadlineCalculation.financialYearEndStr}\n• Final Corporate Tax Return Deadline: ${deadlineCalculation.ctDeadlineStr}\n• Days Remaining: ${deadlineCalculation.daysRemaining} days\n• FTA TRN Status: ${hasTrn ? "Registered" : "NOT YET REGISTERED (Needs Urgent AED 10k Penalty Protection)"}\n\nPlease assist our company with statutory audit readiness and timely filing.`;
    window.open(`https://wa.me/971529226958?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased selection:bg-gold-500/30 selection:text-navy-950">
      <PageNavigation
        currentPath="/fta-deadlines"
        onNavigate={onNavigate}
        onOpenAudit={onOpenAudit}
      />

      <main id="main-content">
        {/* 1. Hero Section */}
        <section className="relative bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 text-white py-16 lg:py-24 border-b border-gold-500/30 overflow-hidden">
          <div className="absolute -top-32 right-0 w-[550px] h-[550px] bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[480px] h-[480px] bg-rose-600/5 rounded-full blur-3xl pointer-events-none" />

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
              <span className="text-white">FTA Statutory Deadlines &amp; Penalty Shield</span>
            </div>

            <div className="text-center max-w-3xl mx-auto space-y-6">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gold-500/15 border border-gold-400/40 text-gold-300 text-xs font-semibold uppercase tracking-wider">
                <Calendar className="w-4 h-4 text-gold-400 shrink-0" />
                <span>Federal Decree-Law No. 47 of 2022 · EmaraTax Statutory Timelines</span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                UAE Corporate Tax &amp; VAT <span className="text-gold-400">Statutory Deadlines Calendar</span>
              </h1>

              <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
                Under UAE Corporate Tax Law, returns and tax payments are strictly due within <strong>9 months</strong> from the close of your financial year. Plan ahead to eliminate mandatory late filing surcharges and the AED 10,000 late registration fine.
              </p>

              {/* 3 Metric Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 max-w-2xl mx-auto">
                <div className="bg-navy-900/80 border border-gold-500/30 rounded-2xl p-4 text-center">
                  <span className="text-xl font-mono font-extrabold text-gold-400 block">9 Months</span>
                  <span className="text-[11px] text-slate-300 mt-1 block">From Financial Year End</span>
                </div>
                <div className="bg-navy-900/80 border border-rose-500/30 rounded-2xl p-4 text-center">
                  <span className="text-xl font-mono font-extrabold text-rose-400 block">AED 10,000</span>
                  <span className="text-[11px] text-slate-300 mt-1 block">Late Registration Fine</span>
                </div>
                <div className="bg-navy-900/80 border border-emerald-500/30 rounded-2xl p-4 text-center">
                  <span className="text-xl font-mono font-extrabold text-emerald-400 block">100% FTA</span>
                  <span className="text-[11px] text-slate-300 mt-1 block">Timely Filing Assurance</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Interactive Deadlines Calculator Suite */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Interactive Parameters (7 Cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="font-display text-xl sm:text-2xl font-bold text-navy-950">
                  Step 1: Company Financial Year Settings
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Select your fiscal year-end to compute statutory EmaraTax submission windows.
                </p>
              </div>

              {/* Month Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-navy-900">
                  Financial Year End Month
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: "12", label: "December 31" },
                    { id: "3", label: "March 31" },
                    { id: "6", label: "June 30" },
                    { id: "9", label: "September 30" },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setFinancialYearEndMonth(m.id)}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${
                        financialYearEndMonth === m.id
                          ? "border-gold-500 bg-gold-50/50 text-navy-950 ring-1 ring-gold-500 font-extrabold"
                          : "border-slate-200 text-slate-700 hover:border-slate-300 bg-slate-50/50"
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
                <span className="text-[11px] text-slate-500 block">
                  Most UAE companies follow the calendar year ending December 31.
                </span>
              </div>

              {/* Financial Year Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-navy-900">
                  Target Fiscal Tax Period
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[2024, 2025, 2026].map((yr) => (
                    <button
                      key={yr}
                      type="button"
                      onClick={() => setFinancialYear(yr)}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${
                        financialYear === yr
                          ? "border-navy-950 bg-navy-950 text-white shadow-md font-extrabold"
                          : "border-slate-200 text-slate-700 hover:border-slate-300 bg-slate-50/50"
                      }`}
                    >
                      FY {yr}
                    </button>
                  ))}
                </div>
              </div>

              {/* Registration Status Check */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <label className="block text-xs font-bold text-navy-900">
                  Is your business already registered for UAE Corporate Tax?
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-xs cursor-pointer">
                    <input
                      type="radio"
                      name="ct-reg"
                      checked={hasTrn}
                      onChange={() => setHasTrn(true)}
                      className="accent-gold-500"
                    />
                    <span>Yes, we hold a Corporate Tax TRN</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs cursor-pointer">
                    <input
                      type="radio"
                      name="ct-reg"
                      checked={!hasTrn}
                      onChange={() => setHasTrn(false)}
                      className="accent-rose-500"
                    />
                    <span className="text-rose-700 font-semibold">No, not yet registered</span>
                  </label>
                </div>
                {!hasTrn && (
                  <div className="flex items-center gap-2 text-xs text-rose-700 bg-rose-50 p-2.5 rounded-xl border border-rose-200 mt-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>
                      Cabinet Decision No. 75/2023 Penalty Warning: Mandatory AED 10,000 fine for unissued TRN after deadline.
                    </span>
                  </div>
                )}
              </div>

              {/* Quarterly VAT Deadlines Table */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-navy-950 uppercase tracking-wider">
                    Quarterly VAT Filing Deadlines (2025 - 2026)
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">Form 201</span>
                </div>
                <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 text-xs">
                  {deadlineCalculation.vatDeadlines.map((v, i) => (
                    <div key={i} className="p-3 bg-white flex justify-between items-center hover:bg-slate-50 transition-colors">
                      <span className="font-semibold text-slate-700">{v.quarter}</span>
                      <span className="font-mono font-bold text-navy-950">{v.deadline}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Other Calculator Landing Page Links */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate("/corporate-tax-calculator")}
                  className="text-xs text-gold-700 hover:text-gold-900 font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Corporate Tax (9%) Simulator</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <span className="text-slate-300">·</span>
                <button
                  type="button"
                  onClick={() => onNavigate("/uae-vat-calculator")}
                  className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <span>UAE VAT (5%) Calculator</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right Column: Output Card & Consultation Funnel (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Output Card */}
              <div className="bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gold-500/30 space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-gold-400" />
                    <span className="font-display font-bold text-base">Key Statutory Filing Milestone</span>
                  </div>
                  <span className="font-mono text-xs text-gold-300 font-bold px-2.5 py-1 rounded-full bg-gold-500/10 border border-gold-400/30">
                    FTA Mandatory
                  </span>
                </div>

                <div className="p-5 bg-gold-500/10 rounded-2xl border border-gold-500/30 space-y-2">
                  <span className="text-[10px] uppercase tracking-wider font-mono text-gold-300 block">
                    Final Corporate Tax Return &amp; Payment Deadline
                  </span>
                  <div className="text-2xl sm:text-3xl font-extrabold font-mono text-gold-400">
                    {deadlineCalculation.ctDeadlineStr}
                  </div>
                  <span className="text-xs text-slate-300 block">
                    Financial Year End: <strong>{deadlineCalculation.financialYearEndStr}</strong>
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-2 border-b border-white/10">
                    <span className="text-slate-300">Days Remaining:</span>
                    <span className={`font-mono font-bold ${deadlineCalculation.daysRemaining > 60 ? "text-emerald-400" : "text-amber-400"}`}>
                      {deadlineCalculation.daysRemaining} Days
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/10">
                    <span className="text-slate-300">Statutory Filing Window:</span>
                    <span className="font-mono font-bold text-white">9 Months Post Year-End</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-slate-300">Submission Portal:</span>
                    <span className="font-mono font-bold text-gold-400">EmaraTax (FTA)</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleWhatsAppRedirect}
                  className="w-full py-4 px-4 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-display font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-gold-500/20 cursor-pointer flex items-center justify-center gap-2 group"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-950 group-hover:scale-110 transition-transform" />
                  <span>Lock In Audit &amp; Filing on WhatsApp</span>
                </button>
              </div>

              {/* Consultation Lead Box */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
                <div className="border-b border-slate-100 pb-3">
                  <span className="text-[10px] font-mono text-gold-600 font-bold uppercase tracking-wider block">
                    Zero-Penalty Guarantee
                  </span>
                  <h3 className="font-display text-lg font-bold text-navy-950">
                    Schedule Your Year-End Audit &amp; Tax Submission
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Managing Partner Glen Dias directly supervises trial balance reconstruction and tax filings.
                  </p>
                </div>

                {submitted ? (
                  <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-300 text-center space-y-3">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                    <h4 className="font-display font-bold text-emerald-950 text-base">
                      Filing Consultation Requested
                    </h4>
                    <p className="text-xs text-emerald-800 leading-relaxed">
                      Our tax advisory team will contact you within 2 hours to confirm document readiness.
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
                      <label className="block text-slate-700 font-bold mb-1">Company Name *</label>
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
                      {isSubmitting ? "Submitting Request..." : "Secure Audit & Filing Slot"}
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </section>

        {/* 3. Statutory Penalty Breakdown Card */}
        <section className="py-16 bg-white border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-600 block mb-2">
                Cabinet Decision No. 75 of 2023
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy-950">
                Statutory Penalties for Late UAE Tax Compliance
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2">
                Administrative fines imposed by the Federal Tax Authority for missing statutory obligations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl border border-rose-200 bg-rose-50/40 space-y-3">
                <span className="text-2xl font-mono font-black text-rose-700 block">AED 10,000</span>
                <h3 className="font-display font-bold text-sm text-navy-950">
                  Late Corporate Tax Registration
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Automatic non-negotiable penalty applied when an entity fails to submit its Corporate Tax registration application within the FTA deadline timeline.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-amber-200 bg-amber-50/40 space-y-3">
                <span className="text-2xl font-mono font-black text-amber-700 block">AED 500 - 1,000</span>
                <h3 className="font-display font-bold text-sm text-navy-950">
                  Late Return Filing
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  AED 500 for the first late return filing, escalating to AED 1,000 for repeated delays within a 24-month audit window, plus monthly interest surcharges.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-emerald-200 bg-emerald-50/40 space-y-3">
                <span className="text-2xl font-mono font-black text-emerald-700 block">AED 0 Penalty</span>
                <h3 className="font-display font-bold text-sm text-navy-950">
                  Dias Early-Filing Protection
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  We finalize year-end reconciliations and file returns at least 30 days prior to the statutory deadline, guaranteeing zero administrative fines.
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

export default FtaDeadlinesPage;

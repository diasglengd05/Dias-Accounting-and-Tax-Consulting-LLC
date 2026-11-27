import React, { useEffect, useMemo, useState } from "react";
import { AlertTriangle, ArrowRight, CheckCircle2 } from "lucide-react";
import TaxHubLayout from "../components/hub/TaxHubLayout";
import {
  CalculatorToolBridge,
  ComplianceTable,
  ExecutiveAccordion,
  ExecutiveCallout,
} from "../components/hub/ExecutivePrimitives";
import { submitToGoogleSheetsDirectly } from "../lib/sheetsService";
import { useLanguage } from "../i18n/LanguageContext";
import { validateEmailField, validatePhoneField } from "../lib/validation";
import {
  applyPageSEO,
  buildBreadcrumbSchema,
  buildFAQPageSchema,
  removeJsonLd,
  upsertJsonLd,
} from "../lib/seo";

interface FtaDeadlinesPageProps {
  onNavigate: (path: string) => void;
  onOpenAudit?: () => void;
  onOpenPrivacy?: () => void;
  onOpenGooglePreferred?: () => void;
}

const TOC_ITEMS = [
  { id: "calculator", label: "Deadline Calculator" },
  { id: "vat-calendar", label: "Quarterly VAT Calendar" },
  { id: "penalties", label: "FTA Penalty Schedule" },
  { id: "schedule", label: "Reserve Filing Slot" },
  { id: "faqs", label: "Deadline Rules & FAQs" },
];

export const DEADLINES_FAQS = [
  {
    question: "How is the 9-month UAE Corporate Tax filing deadline calculated?",
    answer:
      "Under Federal Decree-Law No. 47 of 2022, both your Corporate Tax return and any tax payable are due on or before the last day of the 9th month following the close of your financial year. For a calendar year ending December 31, 2025, the statutory deadline is September 30, 2026.",
  },
  {
    question: "When are quarterly UAE VAT Form 201 returns due?",
    answer:
      "Quarterly (or monthly) VAT Form 201 returns and payments are due on EmaraTax on or before the 28th day following the close of each FTA-assigned tax period. If the 28th falls on a weekend or UAE public holiday, the deadline moves to the next working day.",
  },
  {
    question: "Can the AED 10,000 late Corporate Tax registration fine be waived?",
    answer:
      "Yes. Under the FTA penalty waiver initiative, entities penalized AED 10,000 for late Corporate Tax registration can qualify for a waiver or credit refund by filing their first Corporate Tax return within 7 months from the end of their first tax period.",
  },
  {
    question: "How long must UAE companies retain accounting and tax records?",
    answer:
      "Under Federal Decree-Law No. 28 of 2022 and Decree-Law No. 47, UAE businesses must maintain IFRS financial statements, ledgers, invoices, and supporting schedules for at least 7 years following the end of the relevant tax period.",
  },
];

export const FtaDeadlinesPage: React.FC<FtaDeadlinesPageProps> = ({
  onNavigate,
  onOpenAudit,
  onOpenPrivacy,
  onOpenGooglePreferred,
}) => {
  const { language } = useLanguage();
  const isAr = language === "ar";

  // Interactive Deadline Calculator State (preserved 100%)
  const [financialYearEndMonth, setFinancialYearEndMonth] = useState<string>("12");
  const [financialYear, setFinancialYear] = useState<number>(2025);
  const [hasTrn, setHasTrn] = useState<boolean>(true);

  // Consultation Form State
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const canonicalPath = "/fta-deadlines";
    applyPageSEO({
      title: "2026 UAE FTA Tax Deadlines & Penalties | Dias Accounting",
      description:
        "Calculate your 9-month UAE Corporate Tax filing deadline and quarterly VAT Form 201 due dates on EmaraTax to avoid Cabinet Decision No. 75 penalties.",
      canonicalPath,
      keywords:
        "UAE corporate tax deadline 2026, FTA EmaraTax due dates, VAT filing calendar UAE, Cabinet Decision 75 penalties",
    });
    upsertJsonLd(
      "page-faq-jsonld",
      buildFAQPageSchema(DEADLINES_FAQS, `https://diasuae.ae${canonicalPath}#faqs`)
    );
    upsertJsonLd(
      "page-breadcrumb-jsonld",
      buildBreadcrumbSchema(
        [
          { name: "Home", path: "/" },
          { name: "Tax Compliance Hubs", path: "/uae-tax-planner" },
          { name: "FTA Tax Deadlines", path: canonicalPath },
        ],
        `https://diasuae.ae${canonicalPath}#breadcrumb`
      )
    );
    window.scrollTo({ top: 0, behavior: "instant" });
    return () => {
      removeJsonLd("page-faq-jsonld");
      removeJsonLd("page-breadcrumb-jsonld");
    };
  }, []);

  // Preserved 9-month CT Deadline & Quarterly VAT Schedule Math
  const deadlineCalculation = useMemo(() => {
    const monthIndex = parseInt(financialYearEndMonth, 10) - 1;
    const yearEnd = new Date(financialYear, monthIndex + 1, 0);

    const ctFilingDate = new Date(yearEnd);
    ctFilingDate.setMonth(ctFilingDate.getMonth() + 9);
    const finalCtDeadline = new Date(
      ctFilingDate.getFullYear(),
      ctFilingDate.getMonth() + 1,
      0
    );

    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const locale = isAr ? "ar-AE" : "en-US";

    const vatDeadlines = [
      { quarter: "Q1 (Jan – Mar)", periodEnd: `March 31, ${financialYear}`, deadline: `April 28, ${financialYear}` },
      { quarter: "Q2 (Apr – Jun)", periodEnd: `June 30, ${financialYear}`, deadline: `July 28, ${financialYear}` },
      { quarter: "Q3 (Jul – Sep)", periodEnd: `September 30, ${financialYear}`, deadline: `October 28, ${financialYear}` },
      { quarter: "Q4 (Oct – Dec)", periodEnd: `December 31, ${financialYear}`, deadline: `January 28, ${financialYear + 1}` },
    ];

    const today = new Date();
    const daysRemaining = Math.ceil(
      (finalCtDeadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

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
    } catch (err) {
      console.error("Deadline Lead submission failed:", err);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <TaxHubLayout
      currentPath="/fta-deadlines"
      breadcrumbName="FTA Deadlines & Calendar"
      updatedTag="Last Updated: 2026 EmaraTax Statutory Timelines"
      title="2026 UAE Corporate Tax & VAT Filing Deadlines Hub"
      overview="Calculate your exact 9-month Corporate Tax filing window, track quarterly Form 201 VAT due dates, and safeguard against Cabinet Decision No. 75 administrative penalties."
      keyFigures={[
        { value: "9 Months", label: "CT Return Post Year-End" },
        { value: "28th Day", label: "Quarterly VAT 201 Due Date" },
        { value: "AED 10,000", label: "Late Registration Fine" },
        { value: "7 Years", label: "Mandatory Record Archive" },
      ]}
      tocItems={TOC_ITEMS}
      guidancePrompt="Approaching a filing deadline or missing a Corporate Tax TRN? Book an urgent compliance check with our FTA agents."
      closingCta={{
        eyebrow: "Early-Filing Protection",
        title: "Submit Returns 30 Days Ahead of EmaraTax Deadlines",
        description:
          "We close monthly IFRS books, verify trial balances, and submit your VAT and Corporate Tax returns early—eliminating late penalties permanently.",
        ctaLabel: "Book Free Consultation",
      }}
      onNavigate={onNavigate}
      onOpenAudit={onOpenAudit}
      onOpenPrivacy={onOpenPrivacy}
      onOpenGooglePreferred={onOpenGooglePreferred}
    >
      {/* 1. Interactive Statutory Deadline Calculator */}
      <section id="calculator" className="scroll-mt-28 space-y-6">
        <div className="space-y-2">
          <h2 className="font-display text-2xl font-bold text-[#0D1B2A] tracking-tight">
            Calculate Your Corporate Tax Filing Deadline
          </h2>
          <p className="text-sm sm:text-base text-[#475569] leading-[1.65] max-w-[68ch]">
            Select your company&apos;s financial year-end and target tax period to view your exact EmaraTax submission due date.
          </p>
        </div>

        <div className="rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] p-6 sm:p-8 shadow-[0_10px_32px_-16px_rgba(13,27,42,0.08)] space-y-6">
          {/* Month Selector */}
          <div className="space-y-2">
            <span className="block text-sm font-semibold text-[#0D1B2A]">
              Financial Year-End Month
            </span>
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
                  className={`min-h-[44px] px-3 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer tabular-nums ${
                    financialYearEndMonth === m.id
                      ? "bg-[#1B4332] border-[#1B4332] text-white"
                      : "bg-[#F8FAFC] border-[#E2E8F0] text-[#0D1B2A] hover:border-slate-300"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Fiscal Year Selector */}
          <div className="space-y-2">
            <span className="block text-sm font-semibold text-[#0D1B2A]">
              Target Fiscal Tax Period
            </span>
            <div className="grid grid-cols-3 gap-2.5">
              {[2024, 2025, 2026].map((yr) => (
                <button
                  key={yr}
                  type="button"
                  onClick={() => setFinancialYear(yr)}
                  className={`min-h-[44px] px-3 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer tabular-nums ${
                    financialYear === yr
                      ? "bg-[#1B4332] border-[#1B4332] text-white"
                      : "bg-[#F8FAFC] border-[#E2E8F0] text-[#0D1B2A] hover:border-slate-300"
                  }`}
                >
                  FY {yr}
                </button>
              ))}
            </div>
          </div>

          {/* TRN Registration Check */}
          <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-4 space-y-3">
            <span className="block text-sm font-semibold text-[#0D1B2A]">
              Do you already hold an active UAE Corporate Tax TRN?
            </span>
            <div className="flex flex-wrap gap-4">
              <label className="inline-flex items-center gap-2 text-sm text-[#0D1B2A] cursor-pointer min-h-[36px]">
                <input
                  type="radio"
                  name="ct-reg"
                  checked={hasTrn}
                  onChange={() => setHasTrn(true)}
                  className="accent-[#1B4332]"
                />
                <span>Yes, registered on EmaraTax</span>
              </label>
              <label className="inline-flex items-center gap-2 text-sm text-rose-700 font-medium cursor-pointer min-h-[36px]">
                <input
                  type="radio"
                  name="ct-reg"
                  checked={!hasTrn}
                  onChange={() => setHasTrn(false)}
                  className="accent-rose-600"
                />
                <span>No, not yet registered</span>
              </label>
            </div>
            {!hasTrn && (
              <div className="flex items-start gap-2 text-xs text-rose-700 bg-rose-50 p-3 rounded-xl border border-rose-200">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  Under Cabinet Decision No. 75/2023, failing to register by your trade-license deadline triggers an automatic AED 10,000 fine.
                </span>
              </div>
            )}
          </div>

          {/* Result Summary Card */}
          <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] border-l-[3px] border-l-[#C5A059] p-5 sm:p-6 space-y-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <span className="text-xs font-semibold text-[#475569] block">
                  Final Corporate Tax Return &amp; Payment Due Date
                </span>
                <div className="font-display text-2xl sm:text-3xl font-bold text-[#0D1B2A] tracking-tight tabular-nums mt-1">
                  {deadlineCalculation.ctDeadlineStr}
                </div>
              </div>
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full border tabular-nums ${
                  deadlineCalculation.isOverdue
                    ? "bg-rose-50 text-rose-700 border-rose-200"
                    : "bg-emerald-50 text-[#1B4332] border-emerald-200"
                }`}
              >
                {deadlineCalculation.isOverdue
                  ? `${Math.abs(deadlineCalculation.daysRemaining)} days past due`
                  : `${deadlineCalculation.daysRemaining} days remaining`}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-[#E2E8F0] text-xs sm:text-sm">
              <div>
                <span className="text-[#64748B] block">Financial Year-End</span>
                <span className="font-semibold text-[#0D1B2A] tabular-nums">
                  {deadlineCalculation.financialYearEndStr}
                </span>
              </div>
              <div>
                <span className="text-[#64748B] block">Statutory Window</span>
                <span className="font-semibold text-[#0D1B2A]">9 Months Post Year-End</span>
              </div>
              <div>
                <span className="text-[#64748B] block">Filing Portal</span>
                <span className="font-semibold text-[#0D1B2A]">FTA EmaraTax</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Quarterly VAT Calendar Table */}
      <section id="vat-calendar" className="scroll-mt-28 pt-4 space-y-5">
        <div className="space-y-2">
          <h2 className="font-display text-2xl font-bold text-[#0D1B2A] tracking-tight">
            Quarterly UAE VAT Form 201 Calendar (FY {financialYear})
          </h2>
          <p className="text-sm sm:text-base text-[#475569] leading-[1.65] max-w-[68ch]">
            Standard calendar-quarter VAT filing dates (28th day following period close). Check your VAT Registration Certificate for your exact FTA-assigned stagger.
          </p>
        </div>

        <ComplianceTable
          caption="Quarterly UAE VAT Form 201 filing schedule"
          columns={[
            { key: "quarter", label: "Tax Quarter" },
            { key: "periodEnd", label: "Period Close" },
            { key: "deadline", label: "Form 201 Due Date", highlight: true },
          ]}
          rows={deadlineCalculation.vatDeadlines}
        />
      </section>

      {/* 3. Cabinet Decision No. 75 Penalties */}
      <section id="penalties" className="scroll-mt-28 pt-4 space-y-6">
        <div className="space-y-2">
          <h2 className="font-display text-2xl font-bold text-[#0D1B2A] tracking-tight">
            FTA Administrative Penalties (Cabinet Decision No. 75/2023)
          </h2>
          <p className="text-sm sm:text-base text-[#475569] leading-[1.65] max-w-[68ch]">
            Summary of statutory fines imposed by the Federal Tax Authority for late Corporate Tax and VAT filings.
          </p>
        </div>

        <ComplianceTable
          caption="UAE Federal Tax Authority administrative penalty schedule"
          columns={[
            { key: "obligation", label: "Missed Statutory Obligation" },
            { key: "fine", label: "Statutory Fine", highlight: true },
            { key: "details", label: "Escalation & Interest" },
          ]}
          rows={[
            {
              obligation: "Late Corporate Tax / VAT Registration",
              fine: "AED 10,000",
              details: "Fixed administrative penalty for missing registration window.",
            },
            {
              obligation: "Late Corporate Tax Return Filing",
              fine: "AED 500 / month",
              details: "Escalates to AED 1,000/month after 12 months plus 14% annual interest on unpaid tax.",
            },
            {
              obligation: "Late VAT Form 201 Filing",
              fine: "AED 1,000",
              details: "Escalates to AED 2,000 for repeated late filings within 24 months.",
            },
            {
              obligation: "Failure to Maintain 7-Year Records",
              fine: "AED 10,000",
              details: "Escalates to AED 20,000 for repeat record-keeping violations within 24 months.",
            },
          ]}
        />

        <ExecutiveCallout title="2026 Deadline Alert: 7-Month Penalty Waiver Window" accent="gold">
          Entities assessed an AED 10,000 late Corporate Tax registration penalty can apply for a waiver or credit refund under the FTA waiver initiative by filing their first Corporate Tax return within <strong>7 months</strong> (instead of 9 months) from the end of their first tax period.
        </ExecutiveCallout>

        <CalculatorToolBridge
          title="Estimate Your 2026 Corporate Tax Liability Now"
          description="Model Mainland 9%, 0% Small Business Relief, or Free Zone 0% QFZP tax exposure before your filing window closes."
          ctaLabel="Open 2026 Tax Calculator"
          onAction={() => onNavigate("/uae-tax-planner")}
        />
      </section>

      {/* 4. Reserve Audit & Filing Slot */}
      <section id="schedule" className="scroll-mt-28 pt-4 space-y-5">
        <div className="space-y-2">
          <h2 className="font-display text-2xl font-bold text-[#0D1B2A] tracking-tight">
            Schedule Your Year-End Audit &amp; Tax Filing
          </h2>
          <p className="text-sm sm:text-base text-[#475569] leading-[1.65] max-w-[68ch]">
            Reserve a dedicated filing slot so our chartered team reconciles your ledgers and submits on EmaraTax at least 30 days before your deadline.
          </p>
        </div>

        <div className="rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] p-6 sm:p-8 shadow-xs">
          {submitted ? (
            <div className="py-6 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-[#1B4332] mx-auto" />
              <h3 className="font-display font-bold text-lg text-[#0D1B2A]">
                Filing Consultation Requested
              </h3>
              <p className="text-sm text-[#475569] max-w-md mx-auto leading-relaxed">
                Our tax advisory team will contact you within 2 business hours to confirm your document checklist and filing schedule.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmitLead} className="space-y-4">
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-medium">
                  {errorMessage}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="dl-company" className="block text-xs font-semibold text-[#0D1B2A] mb-1.5">
                    Company Name *
                  </label>
                  <input
                    id="dl-company"
                    type="text"
                    placeholder="e.g. Apex Global Trading LLC"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full min-h-[46px] px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] text-sm text-[#0D1B2A] focus:outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/15"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="dl-contact" className="block text-xs font-semibold text-[#0D1B2A] mb-1.5">
                    Contact Name *
                  </label>
                  <input
                    id="dl-contact"
                    type="text"
                    placeholder="e.g. Sarah Jenkins"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full min-h-[46px] px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] text-sm text-[#0D1B2A] focus:outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/15"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="dl-email" className="block text-xs font-semibold text-[#0D1B2A] mb-1.5">
                    Corporate Email *
                  </label>
                  <input
                    id="dl-email"
                    type="email"
                    placeholder="sarah@company.ae"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full min-h-[46px] px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] text-sm text-[#0D1B2A] focus:outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/15"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="dl-phone" className="block text-xs font-semibold text-[#0D1B2A] mb-1.5">
                    UAE Phone / WhatsApp *
                  </label>
                  <input
                    id="dl-phone"
                    type="tel"
                    placeholder="+971 50 000 0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full min-h-[46px] px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] text-sm text-[#0D1B2A] focus:outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/15"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="min-h-[48px] px-6 py-3 rounded-xl bg-[#1B4332] hover:bg-[#143326] text-white text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50 inline-flex items-center justify-center gap-2"
              >
                <span>{isSubmitting ? "Submitting Request..." : "Secure Audit & Filing Slot"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </section>

      {/* 5. FAQs */}
      <section id="faqs" className="scroll-mt-28 pt-4 space-y-5">
        <h2 className="font-display text-2xl font-bold text-[#0D1B2A] tracking-tight">
          UAE Tax Deadline FAQs
        </h2>
        <div className="rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] px-6 sm:px-8 py-2">
          <ExecutiveAccordion items={DEADLINES_FAQS} defaultOpenIndex={0} />
        </div>
      </section>
    </TaxHubLayout>
  );
};

export default FtaDeadlinesPage;

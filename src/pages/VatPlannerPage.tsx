import React, { useEffect, useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
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

interface VatPlannerPageProps {
  onNavigate: (path: string) => void;
  onOpenAudit?: () => void;
  onOpenPrivacy?: () => void;
  onOpenGooglePreferred?: () => void;
}

const TOC_ITEMS = [
  { id: "planner", label: "Form 201 Estimator" },
  { id: "thresholds", label: "Thresholds & Rates" },
  { id: "pitfalls", label: "FTA Audit Pitfalls" },
  { id: "assessment", label: "Request VAT Review" },
  { id: "faqs", label: "VAT Compliance FAQs" },
];

const VAT_FAQS = [
  {
    question: "When is UAE VAT registration mandatory vs. voluntary?",
    answer:
      "VAT registration is mandatory once your taxable supplies and imports exceed AED 375,000 over the preceding 12 months or are expected to exceed AED 375,000 in the next 30 days. Voluntary registration is available once taxable supplies or taxable expenses exceed AED 187,500.",
  },
  {
    question: "How quickly must I register after crossing AED 375,000?",
    answer:
      "You must submit your VAT registration application on EmaraTax within 30 days of crossing the AED 375,000 mandatory threshold. Late registration attracts an automatic AED 10,000 administrative fine.",
  },
  {
    question: "Which UAE expenses are blocked from 5% input VAT recovery?",
    answer:
      "Under UAE VAT Executive Regulations, 5% VAT incurred on client entertainment, hospitality, motor vehicles available for personal or mixed use, and employee benefits not mandated by UAE law cannot be reclaimed on Form VAT 201.",
  },
  {
    question: "What happens if my input VAT exceeds my output VAT in a quarter?",
    answer:
      "When recoverable input VAT exceeds output VAT (common for zero-rated exporters or high-investment startups), you carry a net VAT credit. You can either carry the balance forward to future tax periods or submit a Form VAT 311 cash refund claim directly to your UAE corporate bank account.",
  },
];

export const VatPlannerPage: React.FC<VatPlannerPageProps> = ({
  onNavigate,
  onOpenAudit,
  onOpenPrivacy,
  onOpenGooglePreferred,
}) => {
  const { language } = useLanguage();
  const isAr = language === "ar";

  // Interactive Form 201 Planner State (preserved 100%)
  const [standardVatSales, setStandardVatSales] = useState<number>(1200000);
  const [zeroRatedSales, setZeroRatedSales] = useState<number>(300000);
  const [vatExpenses, setVatExpenses] = useState<number>(600000);
  const [filingFrequency, setFilingFrequency] = useState<"quarterly" | "monthly">("quarterly");

  // Certified VAT Assessment Form State
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const canonicalPath = "/uae-vat-calculator";
    applyPageSEO({
      title: "UAE 5% VAT Hub & Form 201 Calculator | Dias Accounting",
      description:
        "Calculate net UAE 5% VAT payable or refundable for FTA Form 201 returns. Check AED 375,000 mandatory registration thresholds and blocked input VAT rules.",
      canonicalPath,
      keywords:
        "UAE VAT calculator, 5% VAT planner Dubai, FTA Form 201 calculator, VAT registration threshold UAE AED 375k",
    });
    upsertJsonLd(
      "page-faq-jsonld",
      buildFAQPageSchema(VAT_FAQS, `https://diasuae.ae${canonicalPath}#faqs`)
    );
    upsertJsonLd(
      "page-breadcrumb-jsonld",
      buildBreadcrumbSchema(
        [
          { name: "Home", path: "/" },
          { name: "Tax Compliance Hubs", path: "/uae-tax-planner" },
          { name: "UAE VAT Compliance Hub", path: canonicalPath },
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

  const formatAED = (amount: number) => {
    const locale = isAr ? "ar-AE" : "en-AE";
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "AED",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Preserved VAT Computation under Federal Decree-Law No. 8 of 2017
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
    } catch (err) {
      console.error("VAT Lead submission failed:", err);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <TaxHubLayout
      currentPath="/uae-vat-calculator"
      breadcrumbName="UAE 5% VAT Hub"
      updatedTag="Last Updated: 2026 UAE VAT Rules · Decree-Law No. 8"
      title="UAE 5% VAT Compliance Hub & Form 201 Planner"
      overview="Compute output VAT, recoverable input VAT, and net payable or refund balances for FTA Form 201, verify AED 375,000 mandatory registration thresholds, and avoid common VAT audit penalties."
      keyFigures={[
        { value: "5%", label: "UAE Standard VAT Rate" },
        { value: "AED 375,000", label: "Mandatory Registration Cap" },
        { value: "AED 187,500", label: "Voluntary Registration Cap" },
        { value: "28th Day", label: "Post-Period Filing Deadline" },
      ]}
      tocItems={TOC_ITEMS}
      guidancePrompt="Want an FTA-registered agent to audit your supplier tax invoices and prepare your next Form VAT 201?"
      closingCta={{
        eyebrow: "FTA Form 201 & Audit Defense",
        title: "Eliminate UAE VAT Filing Errors & Penalties",
        description:
          "Our Corporate Growth retainer (from AED 600/month billed annually) bundles monthly IFRS bookkeeping, quarterly Form VAT 201 filing, and input tax recovery verification.",
        ctaLabel: "Book Free Consultation",
      }}
      onNavigate={onNavigate}
      onOpenAudit={onOpenAudit}
      onOpenPrivacy={onOpenPrivacy}
      onOpenGooglePreferred={onOpenGooglePreferred}
    >
      {/* 1. Interactive Quarterly Form 201 Estimator */}
      <section id="planner" className="scroll-mt-28 space-y-6">
        <div className="space-y-2">
          <h2 className="font-display text-2xl font-bold text-[#0D1B2A] tracking-tight">
            Quarterly Form VAT 201 Position Estimator
          </h2>
          <p className="text-sm sm:text-base text-[#475569] leading-[1.65] max-w-[68ch]">
            Model standard-rated UAE domestic supplies, zero-rated international exports, and recoverable input expenses to preview your net FTA position.
          </p>
        </div>

        <div className="rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] p-6 sm:p-8 shadow-[0_10px_32px_-16px_rgba(13,27,42,0.08)] space-y-7">
          {/* Filing Frequency Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-[#E2E8F0]">
            <span className="text-sm font-semibold text-[#0D1B2A]">FTA Assigned Filing Cycle</span>
            <div className="inline-flex p-1 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
              {(["quarterly", "monthly"] as const).map((freq) => (
                <button
                  key={freq}
                  type="button"
                  onClick={() => setFilingFrequency(freq)}
                  className={`min-h-[38px] px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors cursor-pointer ${
                    filingFrequency === freq
                      ? "bg-[#1B4332] text-white"
                      : "text-[#475569] hover:text-[#0D1B2A]"
                  }`}
                >
                  {freq}
                </button>
              ))}
            </div>
          </div>

          {/* Sliders */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-baseline gap-4">
                <label htmlFor="vat-std-sales" className="text-sm font-semibold text-[#0D1B2A]">
                  Standard-Rated Domestic Sales (5% VAT)
                </label>
                <span className="font-display text-base font-bold text-[#0D1B2A] tabular-nums">
                  {formatAED(standardVatSales)}
                </span>
              </div>
              <input
                id="vat-std-sales"
                type="range"
                min="100000"
                max="10000000"
                step="50000"
                value={standardVatSales}
                onChange={(e) => setStandardVatSales(Number(e.target.value))}
                className="w-full h-2 rounded-lg bg-[#E2E8F0] appearance-none cursor-pointer accent-[#1B4332]"
              />
              <p className="text-xs text-[#64748B]">
                Commercial supplies of goods and services within UAE Mainland and non-designated Free Zones.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-baseline gap-4">
                <label htmlFor="vat-zero-sales" className="text-sm font-semibold text-[#0D1B2A]">
                  Zero-Rated Exports &amp; Cross-Border Supplies (0% VAT)
                </label>
                <span className="font-display text-base font-bold text-[#0D1B2A] tabular-nums">
                  {formatAED(zeroRatedSales)}
                </span>
              </div>
              <input
                id="vat-zero-sales"
                type="range"
                min="0"
                max="5000000"
                step="25000"
                value={zeroRatedSales}
                onChange={(e) => setZeroRatedSales(Number(e.target.value))}
                className="w-full h-2 rounded-lg bg-[#E2E8F0] appearance-none cursor-pointer accent-[#1B4332]"
              />
              <p className="text-xs text-[#64748B]">
                Export of services or goods outside the GCC, international transport, and qualifying transfers.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-baseline gap-4">
                <label htmlFor="vat-expenses" className="text-sm font-semibold text-[#0D1B2A]">
                  Recoverable VAT-Bearing Business Expenses (5% Input VAT)
                </label>
                <span className="font-display text-base font-bold text-[#1B4332] tabular-nums">
                  {formatAED(vatExpenses)}
                </span>
              </div>
              <input
                id="vat-expenses"
                type="range"
                min="0"
                max="5000000"
                step="25000"
                value={vatExpenses}
                onChange={(e) => setVatExpenses(Number(e.target.value))}
                className="w-full h-2 rounded-lg bg-[#E2E8F0] appearance-none cursor-pointer accent-[#1B4332]"
              />
              <p className="text-xs text-[#64748B]">
                Valid tax invoices displaying supplier TRN (commercial rent, software, legal &amp; professional fees).
              </p>
            </div>
          </div>

          {/* Crisp Output Summary Card */}
          <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-5 sm:p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-xs font-semibold text-[#475569] block">
                  {vatCalculation.isRefund ? "Estimated VAT Refund from FTA" : "Net VAT Payable to FTA"}
                </span>
                <div className="font-display text-3xl sm:text-4xl font-bold text-[#0D1B2A] tracking-tight tabular-nums mt-1">
                  {formatAED(Math.abs(vatCalculation.netVatPayable))}
                </div>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                  vatCalculation.isMandatory
                    ? "bg-[#FFFFFF] border-[#C5A059] text-[#0D1B2A]"
                    : "bg-emerald-50 border-emerald-200 text-[#1B4332]"
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#1B4332]" />
                <span>{vatCalculation.registrationStatus}</span>
              </span>
            </div>

            <div className="divide-y divide-[#E2E8F0] border-t border-[#E2E8F0] text-sm">
              <div className="py-2.5 flex justify-between gap-4">
                <span className="text-[#475569]">Total Evaluated Taxable Turnover</span>
                <span className="font-semibold text-[#0D1B2A] tabular-nums">
                  {formatAED(vatCalculation.totalSales)}
                </span>
              </div>
              <div className="py-2.5 flex justify-between gap-4">
                <span className="text-[#475569]">Output VAT (5% on Domestic Sales)</span>
                <span className="font-semibold text-[#0D1B2A] tabular-nums">
                  {formatAED(vatCalculation.outputVat)}
                </span>
              </div>
              <div className="py-2.5 flex justify-between gap-4">
                <span className="text-[#475569]">Recoverable Input VAT (5% on Expenses)</span>
                <span className="font-semibold text-[#1B4332] tabular-nums">
                  − {formatAED(vatCalculation.inputVat)}
                </span>
              </div>
              <div className="pt-2.5 flex justify-between gap-4">
                <span className="font-semibold text-[#0D1B2A]">Submission Schedule</span>
                <span className="font-semibold text-[#0D1B2A] capitalize">
                  {filingFrequency} · Due 28th post-period
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Thresholds & VAT Treatment Table */}
      <section id="thresholds" className="scroll-mt-28 pt-4 space-y-6">
        <div className="space-y-2">
          <h2 className="font-display text-2xl font-bold text-[#0D1B2A] tracking-tight">
            UAE VAT Registration Thresholds &amp; Supply Categories
          </h2>
          <p className="text-sm sm:text-base text-[#475569] leading-[1.65] max-w-[68ch]">
            Under Federal Decree-Law No. 8 of 2017, UAE businesses must monitor rolling 12-month taxable turnover and classify each supply correctly on Form 201.
          </p>
        </div>

        <ComplianceTable
          caption="UAE VAT registration thresholds and supply classifications"
          columns={[
            { key: "category", label: "VAT Category / Threshold" },
            { key: "rate", label: "Rate / Cap", highlight: true },
            { key: "rule", label: "FTA Compliance Rule" },
          ]}
          rows={[
            {
              category: "Mandatory VAT Registration",
              rate: "AED 375,000",
              rule: "Required within 30 days once taxable supplies & imports cross AED 375,000 (AED 10,000 fine if late).",
            },
            {
              category: "Voluntary VAT Registration",
              rate: "AED 187,500",
              rule: "Optional registration allowing startups and growing firms to reclaim 5% input VAT on setup costs.",
            },
            {
              category: "Standard-Rated Supplies",
              rate: "5% VAT",
              rule: "Most domestic UAE goods and services; full input tax recovery applies on valid tax invoices.",
            },
            {
              category: "Zero-Rated Supplies",
              rate: "0% VAT",
              rule: "Exports outside GCC, international transport, qualifying education/healthcare; input VAT remains recoverable.",
            },
            {
              category: "Exempt Supplies",
              rate: "Exempt",
              rule: "Residential real estate leases, local passenger transport, certain financial services; related input VAT is non-recoverable.",
            },
          ]}
        />
      </section>

      {/* 3. Common VAT Audit Pitfalls */}
      <section id="pitfalls" className="scroll-mt-28 pt-4 space-y-6">
        <div className="space-y-2">
          <h2 className="font-display text-2xl font-bold text-[#0D1B2A] tracking-tight">
            The 4 Most Costly UAE VAT Audit Mistakes
          </h2>
          <p className="text-sm sm:text-base text-[#475569] leading-[1.65] max-w-[68ch]">
            The Federal Tax Authority enforces strict administrative penalties for documentation gaps and blocked expense claims.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              title: "Defective Supplier Tax Invoices",
              desc: "Claiming input VAT on invoices missing the words 'Tax Invoice', supplier TRN, or line-item VAT breakdown leads to automatic disallowance during audit.",
            },
            {
              title: "Late VAT Registration (AED 10,000 Fine)",
              desc: "Missing the 30-day EmaraTax registration window after crossing AED 375,000 in rolling taxable turnover triggers an immediate AED 10,000 penalty.",
            },
            {
              title: "Blocked Client Entertainment & Vehicles",
              desc: "Input VAT paid on client hospitality, sporting events, gifts exceeding AED 250, and mixed-use vehicles is legally non-recoverable on Form 201.",
            },
            {
              title: "Missed Reverse-Charge Reporting",
              desc: "Imported digital services and foreign SaaS subscriptions (AWS, Google, Meta, Stripe) must be self-accounted under the Reverse Charge Mechanism.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] p-5 space-y-1.5"
            >
              <h3 className="font-display font-bold text-sm sm:text-base text-[#0D1B2A]">
                {item.title}
              </h3>
              <p className="text-sm text-[#475569] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <ExecutiveCallout title="FTA Compliance Note: Voluntary Disclosure (Form 211)" accent="gold">
          If you discover an error exceeding AED 10,000 on a previously submitted VAT 201 return, filing a Voluntary Disclosure (Form 211) proactively before an FTA audit notification significantly reduces percentage-based tax assessment penalties.
        </ExecutiveCallout>

        <CalculatorToolBridge
          title="Check Expense-Level 5% Input VAT Recovery"
          description="Add or extract 5% UAE VAT and instantly verify whether specific business expenses are reclaimable, blocked, or zero-rated."
          ctaLabel="Open 5% VAT Recovery Tool"
          onAction={() => onNavigate("/uae-tax-planner?tab=vat")}
        />
      </section>

      {/* 4. Certified VAT Assessment Request */}
      <section id="assessment" className="scroll-mt-28 pt-4 space-y-5">
        <div className="space-y-2">
          <h2 className="font-display text-2xl font-bold text-[#0D1B2A] tracking-tight">
            Request a Certified Form 201 VAT Review
          </h2>
          <p className="text-sm sm:text-base text-[#475569] leading-[1.65] max-w-[68ch]">
            Share your contact details for an FTA-registered review of your invoice formatting, input VAT eligibility, and upcoming Form 201 submission.
          </p>
        </div>

        <div className="rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] p-6 sm:p-8 shadow-xs">
          {submitted ? (
            <div className="py-6 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-[#1B4332] mx-auto" />
              <h3 className="font-display font-bold text-lg text-[#0D1B2A]">
                VAT Assessment Request Received
              </h3>
              <p className="text-sm text-[#475569] max-w-md mx-auto leading-relaxed">
                Managing Partner Glen Dias and our VAT advisory team will review your figures and respond within 2 business hours.
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
                  <label htmlFor="vat-company" className="block text-xs font-semibold text-[#0D1B2A] mb-1.5">
                    Company Trade Name *
                  </label>
                  <input
                    id="vat-company"
                    type="text"
                    placeholder="e.g. Apex Global Trading LLC"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full min-h-[46px] px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] text-sm text-[#0D1B2A] focus:outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/15"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="vat-contact" className="block text-xs font-semibold text-[#0D1B2A] mb-1.5">
                    Contact Name *
                  </label>
                  <input
                    id="vat-contact"
                    type="text"
                    placeholder="e.g. Sarah Jenkins"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full min-h-[46px] px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] text-sm text-[#0D1B2A] focus:outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/15"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="vat-email" className="block text-xs font-semibold text-[#0D1B2A] mb-1.5">
                    Corporate Email *
                  </label>
                  <input
                    id="vat-email"
                    type="email"
                    placeholder="sarah@company.ae"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full min-h-[46px] px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] text-sm text-[#0D1B2A] focus:outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/15"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="vat-phone" className="block text-xs font-semibold text-[#0D1B2A] mb-1.5">
                    UAE Phone / WhatsApp *
                  </label>
                  <input
                    id="vat-phone"
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
                <span>{isSubmitting ? "Submitting Request..." : "Request Certified VAT Review"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </section>

      {/* 5. FAQs */}
      <section id="faqs" className="scroll-mt-28 pt-4 space-y-5">
        <h2 className="font-display text-2xl font-bold text-[#0D1B2A] tracking-tight">
          UAE VAT Compliance FAQs
        </h2>
        <div className="rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] px-6 sm:px-8 py-2">
          <ExecutiveAccordion items={VAT_FAQS} defaultOpenIndex={0} />
        </div>
      </section>
    </TaxHubLayout>
  );
};

export default VatPlannerPage;

import React, { useEffect } from "react";
import UaeTaxCalculatorSuite from "../components/UaeTaxCalculatorSuite";
import TaxHubLayout from "../components/hub/TaxHubLayout";
import {
  CalculatorToolBridge,
  ComplianceTable,
  ExecutiveAccordion,
  ExecutiveCallout,
} from "../components/hub/ExecutivePrimitives";
import {
  applyPageSEO,
  buildBreadcrumbSchema,
  buildFAQPageSchema,
  removeJsonLd,
  upsertJsonLd,
} from "../lib/seo";

interface CorporateTaxSavingsPageProps {
  onNavigate: (path: string) => void;
  onOpenAudit?: () => void;
  onOpenPrivacy?: () => void;
  onOpenGooglePreferred?: () => void;
}

const TOC_ITEMS = [
  { id: "simulator", label: "2026 Tax Simulator" },
  { id: "regimes", label: "Rates & Relief Regimes" },
  { id: "penalties", label: "FTA Penalty Schedule" },
  { id: "case-studies", label: "Verified Client Outcomes" },
  { id: "faqs", label: "Statutory Nuances & FAQs" },
];

const CT_HUB_FAQS = [
  {
    question: "Who is required to register for UAE Corporate Tax on EmaraTax?",
    answer:
      "All UAE Mainland LLCs, Free Zone companies (including entities claiming 0% QFZP or 0% Small Business Relief), and natural persons conducting business in the UAE with annual turnover exceeding AED 1,000,000 must register for Corporate Tax and obtain a Tax Registration Number (TRN).",
  },
  {
    question: "Does a Free Zone company automatically pay 0% Corporate Tax?",
    answer:
      "No. To qualify for the 0% Qualifying Free Zone Person (QFZP) rate on Qualifying Income, a Free Zone company must maintain adequate UAE economic substance, stay within the De Minimis threshold (lower of 5% of total revenue or AED 5,000,000), maintain audited IFRS financial statements, and comply with Article 34 Transfer Pricing rules.",
  },
  {
    question: "Can businesses elect Small Business Relief (0% CT) in 2026?",
    answer:
      "Yes. Under Article 21 and Ministerial Decision No. 73 of 2023 (extended through December 31, 2029), UAE resident businesses with gross revenue of AED 3,000,000 or less in the current and prior tax periods can actively elect Small Business Relief on their EmaraTax Corporate Tax return.",
  },
  {
    question: "How does the FTA AED 10,000 late-registration penalty waiver work?",
    answer:
      "Under the Federal Tax Authority penalty waiver initiative, businesses penalized AED 10,000 for late Corporate Tax registration can qualify for a waiver or credit refund if they submit their first Corporate Tax return within 7 months from the end of their first tax period.",
  },
];

export const CorporateTaxSavingsPage: React.FC<CorporateTaxSavingsPageProps> = ({
  onNavigate,
  onOpenAudit,
  onOpenPrivacy,
  onOpenGooglePreferred,
}) => {
  useEffect(() => {
    const canonicalPath = "/corporate-tax-calculator";
    applyPageSEO({
      title: "2026 UAE Corporate Tax Hub & 9% Guide | Dias Accounting",
      description:
        "Comprehensive 2026 UAE Corporate Tax hub covering 9% profit brackets, AED 3M Small Business Relief, Free Zone 0% QFZP rules, and FTA penalty schedules.",
      canonicalPath,
      keywords:
        "UAE Corporate Tax Hub 2026, corporate tax calculator UAE, 9% tax bracket, small business relief assessment UAE, QFZP 0% corporate tax",
    });
    upsertJsonLd(
      "page-faq-jsonld",
      buildFAQPageSchema(CT_HUB_FAQS, `https://diasuae.ae${canonicalPath}#faqs`)
    );
    upsertJsonLd(
      "page-breadcrumb-jsonld",
      buildBreadcrumbSchema(
        [
          { name: "Home", path: "/" },
          { name: "Tax Compliance Hubs", path: "/uae-tax-planner" },
          { name: "Corporate Tax Compliance Hub", path: canonicalPath },
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

  return (
    <TaxHubLayout
      currentPath="/corporate-tax-calculator"
      breadcrumbName="Corporate Tax Compliance Hub"
      updatedTag="Last Updated: 2026 UAE Corporate Tax Rules"
      title="2026 UAE Corporate Tax Hub & Liability Simulator"
      overview="Model your 2026 UAE Corporate Tax across Mainland (0% Small Business Relief or 9% standard tier) and Free Zone (0% QFZP De Minimis rules), review statutory penalties, and benchmark compliance requirements."
      keyFigures={[
        { value: "9%", label: "Standard Corporate Tax Rate" },
        { value: "AED 375,000", label: "Statutory 0% Profit Band" },
        { value: "AED 3,000,000", label: "Small Business Relief Cap" },
        { value: "9 Months", label: "EmaraTax Filing Window" },
      ]}
      tocItems={TOC_ITEMS}
      guidancePrompt="Need a senior FTA-registered review of your trial balance, SBR election, or Free Zone QFZP status?"
      closingCta={{
        eyebrow: "Partner-Led UAE Tax Strategy",
        title: "Lock In Your 2026 Corporate Tax Position",
        description:
          "Book a confidential assessment with Glen Dias, FTA-Registered Tax Agent, covering trial balance adjustments, SBR elections, and Transfer Pricing. Fixed-fee retainers from AED 400/month.",
        ctaLabel: "Book Free Consultation",
      }}
      onNavigate={onNavigate}
      onOpenAudit={onOpenAudit}
      onOpenPrivacy={onOpenPrivacy}
      onOpenGooglePreferred={onOpenGooglePreferred}
    >
      {/* 1. Interactive 2026 Calculator */}
      <section id="simulator" className="scroll-mt-28 space-y-5">
        <div className="space-y-2">
          <h2 className="font-display text-2xl font-bold text-[#0D1B2A] tracking-tight">
            Interactive 2026 Corporate Tax &amp; VAT Simulator
          </h2>
          <p className="text-sm sm:text-base text-[#475569] leading-[1.65] max-w-[68ch]">
            Walk through four focused steps to estimate your 2026 UAE Corporate Tax liability or switch tabs to check 5% VAT Form 201 input recovery.
          </p>
        </div>
        <UaeTaxCalculatorSuite defaultTab="corporate-tax" onNavigate={onNavigate} />
      </section>

      {/* 2. Tax Rates & Relief Regimes Table */}
      <section id="regimes" className="scroll-mt-28 pt-4 space-y-6">
        <div className="space-y-2">
          <h2 className="font-display text-2xl font-bold text-[#0D1B2A] tracking-tight">
            2026 UAE Corporate Tax Brackets &amp; Relief Regimes
          </h2>
          <p className="text-sm sm:text-base text-[#475569] leading-[1.65] max-w-[68ch]">
            Under Federal Decree-Law No. 47 of 2022, taxable entities fall into one of three primary tax positions depending on revenue scale, Free Zone substance, and active elections.
          </p>
        </div>

        <ComplianceTable
          caption="2026 UAE Corporate Tax rates and relief regimes"
          columns={[
            { key: "regime", label: "Tax Regime" },
            { key: "rate", label: "Applicable Rate", highlight: true },
            { key: "eligibility", label: "Core Statutory Criteria" },
          ]}
          rows={[
            {
              regime: "Mainland Standard Tier",
              rate: "0% up to AED 375K · 9% above",
              eligibility: "All UAE Mainland LLCs and non-QFZP entities with revenue exceeding AED 3,000,000.",
            },
            {
              regime: "Small Business Relief (Article 21)",
              rate: "0% Effective Tax",
              eligibility: "Resident entities with gross revenue ≤ AED 3,000,000 actively electing SBR through Dec 31, 2029.",
            },
            {
              regime: "Qualifying Free Zone Person (QFZP)",
              rate: "0% Qualifying · 9% Non-Qualifying",
              eligibility: "Free Zone substance, audited IFRS accounts, De Minimis ≤ 5% or AED 5M, and arm's-length TP.",
            },
          ]}
        />

        <ExecutiveCallout title="FTA Compliance Note: Filing Remains Mandatory at 0%" accent="gold">
          Holding a 0% effective tax rate—whether through the AED 375,000 threshold, Small Business Relief, or QFZP status—does not waive your obligation to register on EmaraTax, maintain IFRS books for 7 years, and file an annual Corporate Tax return within 9 months of year-end.
        </ExecutiveCallout>
      </section>

      {/* 3. FTA Penalty Schedule */}
      <section id="penalties" className="scroll-mt-28 pt-4 space-y-6">
        <div className="space-y-2">
          <h2 className="font-display text-2xl font-bold text-[#0D1B2A] tracking-tight">
            The Financial Cost of Delayed Corporate Tax Action
          </h2>
          <p className="text-sm sm:text-base text-[#475569] leading-[1.65] max-w-[68ch]">
            Under UAE Cabinet Decision No. 75 of 2023, the Federal Tax Authority enforces direct administrative fines on late registrations, delayed returns, and missing accounting records.
          </p>
        </div>

        <ComplianceTable
          caption="UAE Corporate Tax administrative penalty schedule under Cabinet Decision No. 75 of 2023"
          columns={[
            { key: "violation", label: "Compliance Violation" },
            { key: "penalty", label: "FTA Statutory Fine", highlight: true },
            { key: "impact", label: "Operational Exposure" },
          ]}
          rows={[
            {
              violation: "Late Corporate Tax Registration",
              penalty: "AED 10,000",
              impact: "Automatic penalty for missing the EmaraTax registration window linked to your trade license month.",
            },
            {
              violation: "Late Annual Return Filing",
              penalty: "AED 500 – AED 1,000 / month",
              impact: "Monthly surcharge (AED 500 first 12 months, AED 1,000 thereafter) plus 14% annual interest on unpaid tax.",
            },
            {
              violation: "Failure to Keep Accounting Records",
              penalty: "AED 10,000 – AED 20,000",
              impact: "Applies when IFRS financial ledgers and supporting vouchers are not maintained for 7 years.",
            },
            {
              violation: "Missed SBR or QFZP Election",
              penalty: "Loss of 0% Status",
              impact: "Standard 9% Corporate Tax applies across taxable net profit; QFZP failure triggers a 5-year lock-out.",
            },
          ]}
        />

        <CalculatorToolBridge
          title="Check Your Exact EmaraTax Filing Deadline"
          description="Compute your 9-month Corporate Tax submission date and quarterly Form 201 VAT calendar in seconds."
          ctaLabel="Open Deadlines Planner"
          onAction={() => onNavigate("/fta-deadlines")}
        />
      </section>

      {/* 4. Verified Client Outcomes */}
      <section id="case-studies" className="scroll-mt-28 pt-4 space-y-6">
        <div className="space-y-2">
          <h2 className="font-display text-2xl font-bold text-[#0D1B2A] tracking-tight">
            Verified UAE Tax Savings &amp; Penalty Protection
          </h2>
          <p className="text-sm sm:text-base text-[#475569] leading-[1.65] max-w-[68ch]">
            Representative compliance engagements led by our FTA-registered team across Dubai Mainland, SHAMS, and DMCC.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              zone: "Dubai Mainland LLC",
              metric: "Saved AED 135,000",
              title: "E-Commerce Trading Company",
              summary:
                "Turnover of AED 2.85M with AED 620K net profit. Filed the formal Article 21 Small Business Relief election on EmaraTax, reducing annual liability to AED 0.",
            },
            {
              zone: "SHAMS Free Zone",
              metric: "Saved AED 198,000",
              title: "B2B Software Consultancy",
              summary:
                "Turnover of AED 5.4M. Structured Qualifying Free Zone Person (QFZP) substance, delivered audited IFRS accounts, and secured 0% tax on qualifying revenue.",
            },
            {
              zone: "DMCC Free Zone",
              metric: "Zero Penalties",
              title: "Logistics & Supply Chain Entity",
              summary:
                "Reconstructed 24 months of unreconciled ledgers in 10 business days and completed EmaraTax registration ahead of deadline, avoiding the AED 10,000 fine.",
            },
          ].map((study) => (
            <div
              key={study.title}
              className="rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] p-6 space-y-3 shadow-[0_6px_24px_-12px_rgba(13,27,42,0.06)]"
            >
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-semibold text-[#475569]">{study.zone}</span>
                <span className="font-semibold text-[#1B4332] tabular-nums">{study.metric}</span>
              </div>
              <h3 className="font-display font-bold text-base text-[#0D1B2A]">{study.title}</h3>
              <p className="text-sm text-[#475569] leading-relaxed">{study.summary}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Statutory Nuances & FAQs */}
      <section id="faqs" className="scroll-mt-28 pt-4 space-y-5">
        <div className="space-y-2">
          <h2 className="font-display text-2xl font-bold text-[#0D1B2A] tracking-tight">
            Statutory Nuances &amp; Frequently Asked Questions
          </h2>
        </div>
        <div className="rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] px-6 sm:px-8 py-2">
          <ExecutiveAccordion items={CT_HUB_FAQS} defaultOpenIndex={0} />
        </div>
      </section>
    </TaxHubLayout>
  );
};

export default CorporateTaxSavingsPage;

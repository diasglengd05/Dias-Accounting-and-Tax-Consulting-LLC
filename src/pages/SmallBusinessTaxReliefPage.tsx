import React, { useEffect } from "react";
import {
  applyPageSEO,
  buildBreadcrumbSchema,
  buildFAQPageSchema,
  removeJsonLd,
  upsertJsonLd,
} from "../lib/seo";
import TaxHubLayout from "../components/hub/TaxHubLayout";
import {
  CalculatorToolBridge,
  ComplianceTable,
  ExecutiveAccordion,
  ExecutiveCallout,
} from "../components/hub/ExecutivePrimitives";

interface PageProps {
  onNavigate?: (path: string) => void;
  onOpenAudit?: () => void;
  onOpenPrivacy?: () => void;
  onOpenGooglePreferred?: () => void;
}

const TOC_ITEMS = [
  { id: "overview", label: "Statutory Framework" },
  { id: "comparison", label: "SBR vs. Standard 9%" },
  { id: "roadmap", label: "Filing Roadmap" },
  { id: "faqs", label: "SBR Nuances & FAQs" },
];

const SBR_FAQS = [
  {
    question: "Does Small Business Relief apply to UAE Free Zone companies?",
    answer:
      "Yes, provided the Free Zone company is NOT claiming the 0% Qualifying Free Zone Person (QFZP) regime under Cabinet Decision No. 55 of 2023. If a Free Zone entity has non-qualifying mainland income and revenue under AED 3,000,000, electing SBR is often a simpler route to 0% tax without QFZP substance audits.",
  },
  {
    question: "What happens if my business made zero profit or an operational loss?",
    answer:
      "Even with zero profit or a net loss, you must still register on EmaraTax and submit an annual Corporate Tax return. Note that while electing Small Business Relief, tax losses incurred during relief periods cannot be carried forward into future years.",
  },
  {
    question: "Until which year is UAE Small Business Relief extended?",
    answer:
      "Under Ministerial Decision No. 73 of 2023 and UAE Ministry of Finance directives, Small Business Relief applies to all qualifying tax periods ending on or before December 31, 2029.",
  },
  {
    question: "Can I split one business across multiple entities to stay under AED 3M?",
    answer:
      "No. Article 50 of Federal Decree-Law No. 47 (General Anti-Abuse Rules) prohibits artificially separating business activities solely to stay under the AED 3,000,000 gross revenue cap. The FTA can disregard artificial splits and assess standard 9% Corporate Tax plus penalties.",
  },
];

export const SmallBusinessTaxReliefPage: React.FC<PageProps> = ({
  onNavigate,
  onOpenAudit,
  onOpenPrivacy,
  onOpenGooglePreferred,
}) => {
  const navigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else if (typeof window !== "undefined") {
      window.location.href = path;
    }
  };

  useEffect(() => {
    const canonicalPath = "/small-business-tax-relief";
    applyPageSEO({
      title: "UAE Small Business Tax Relief (AED 3M) | Dias Accounting",
      description:
        "Guide to UAE 0% Small Business Relief (SBR) under Article 21 and Ministerial Decision No. 73/2023, extended through 2029 for businesses up to AED 3M.",
      canonicalPath,
      keywords:
        "Small Business Corporate Tax Relief Dubai, UAE small business relief 2029, 0% corporate tax UAE, Ministerial Decision 73 of 2023, EmaraTax SBR election",
      ogType: "website",
    });
    upsertJsonLd(
      "page-faq-jsonld",
      buildFAQPageSchema(SBR_FAQS, `https://diasuae.ae${canonicalPath}#faqs`)
    );
    upsertJsonLd(
      "page-breadcrumb-jsonld",
      buildBreadcrumbSchema(
        [
          { name: "Home", path: "/" },
          { name: "Tax Compliance Hubs", path: "/uae-tax-planner" },
          { name: "Small Business Tax Relief", path: canonicalPath },
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
      currentPath="/small-business-tax-relief"
      breadcrumbName="Small Business Tax Relief (SBR)"
      updatedTag="Last Updated: 2026 UAE Tax Rules · Extended to Dec 31, 2029"
      title="UAE Small Business Tax Relief (0% CT up to AED 3M)"
      overview="Under Article 21 of Federal Decree-Law No. 47 of 2022 and Ministerial Decision No. 73 of 2023, qualifying UAE resident businesses with gross revenue up to AED 3,000,000 can legally elect 0% Corporate Tax on EmaraTax."
      keyFigures={[
        { value: "AED 3.0M", label: "Gross Revenue Ceiling" },
        { value: "0.0%", label: "Effective Corporate Tax" },
        { value: "Dec 31, 2029", label: "Statutory Extension Horizon" },
        { value: "Article 21", label: "EmaraTax Election Basis" },
      ]}
      tocItems={TOC_ITEMS}
      guidancePrompt="Want an FTA-registered agent to verify your revenue ceiling and file your Article 21 SBR election cleanly?"
      closingCta={{
        eyebrow: "MicroBiz CT & Retainers",
        title: "File Your 0% Small Business Relief Return Properly",
        description:
          "Standalone SBR EmaraTax filing is available from a flat AED 500, or bundled with monthly IFRS bookkeeping from AED 400/month.",
        ctaLabel: "Book Free Consultation",
      }}
      onNavigate={navigate}
      onOpenAudit={onOpenAudit}
      onOpenPrivacy={onOpenPrivacy}
      onOpenGooglePreferred={onOpenGooglePreferred}
    >
      {/* 1. Statutory Framework */}
      <section id="overview" className="scroll-mt-28 space-y-6">
        <ExecutiveCallout
          title="2026 Compliance Warning: Small Business Relief Is NOT Automatic"
          accent="gold"
        >
          Generating under AED 3,000,000 does not exempt your UAE company from filing. You must register for Corporate Tax on EmaraTax, maintain IFRS accounting records, and <strong>actively elect Article 21 Small Business Relief</strong> within 9 months of your financial year-end. Missing the filing incurs AED 500–1,000/month in administrative penalties and forfeits the 0% election.
        </ExecutiveCallout>

        <div className="space-y-2 pt-2">
          <h2 className="font-display text-2xl font-bold text-[#0D1B2A] tracking-tight">
            Understanding UAE Small Business Relief (SBR)
          </h2>
          <p className="text-sm sm:text-base text-[#475569] leading-[1.65] max-w-[68ch]">
            The UAE Ministry of Finance introduced Small Business Relief to reduce compliance overhead for SMEs and startups across Dubai, Abu Dhabi, Sharjah, and the Northern Emirates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              title: "Gross Revenue Test",
              body: "Gross revenue in the current tax period and all prior periods starting on or after June 1, 2023 must not exceed AED 3,000,000. Once exceeded, standard Corporate Tax applies for that and subsequent periods.",
            },
            {
              title: "Transfer Pricing Relief",
              body: "Businesses electing SBR are exempt from maintaining formal Transfer Pricing Local and Master Files under Article 55, while continuing to follow arm's-length standards for connected persons.",
            },
            {
              title: "Excluded Entities",
              body: "SBR cannot be claimed by Qualifying Free Zone Persons (QFZPs) applying the 0% Free Zone regime, or constituent entities of Multinational Enterprise groups with consolidated revenue over AED 3.15B.",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] p-6 space-y-2 shadow-[0_6px_24px_-12px_rgba(13,27,42,0.06)]"
            >
              <h3 className="font-display font-bold text-base text-[#0D1B2A]">{card.title}</h3>
              <p className="text-sm text-[#475569] leading-relaxed">{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 2. SBR vs. Standard 9% Comparison Table */}
      <section id="comparison" className="scroll-mt-28 pt-4 space-y-6">
        <div className="space-y-2">
          <h2 className="font-display text-2xl font-bold text-[#0D1B2A] tracking-tight">
            Small Business Relief vs. Standard 9% Corporate Tax
          </h2>
          <p className="text-sm sm:text-base text-[#475569] leading-[1.65] max-w-[68ch]">
            Evaluate whether electing Article 21 relief or opting into standard 9% Corporate Tax (to carry forward tax losses) better serves your financial roadmap.
          </p>
        </div>

        <ComplianceTable
          caption="Comparison of Small Business Relief versus standard 9% UAE Corporate Tax"
          columns={[
            { key: "parameter", label: "Compliance Parameter" },
            { key: "sbr", label: "Small Business Relief (Article 21)", highlight: true },
            { key: "standard", label: "Standard Corporate Tax (9%)" },
          ]}
          rows={[
            {
              parameter: "Corporate Tax Liability",
              sbr: <span className="font-semibold text-[#1B4332]">0% (No Taxable Income)</span>,
              standard: "0% up to AED 375,000 · 9% on excess profit",
            },
            {
              parameter: "Revenue Limitation",
              sbr: "Gross revenue ≤ AED 3,000,000",
              standard: "No revenue ceiling",
            },
            {
              parameter: "EmaraTax Filing Requirement",
              sbr: "Mandatory (Simplified return + SBR election)",
              standard: "Mandatory (Full Corporate Tax return)",
            },
            {
              parameter: "Transfer Pricing Local/Master File",
              sbr: <span className="font-semibold text-[#1B4332]">Fully Exempt</span>,
              standard: "Mandatory if revenue > AED 200M or MNE group",
            },
            {
              parameter: "Tax Loss Carry-Forward",
              sbr: "Not permitted during relief periods",
              standard: "Up to 75% taxable income offset per period",
            },
            {
              parameter: "General Anti-Abuse Rules (Art. 50)",
              sbr: "Applies (Artificial splitting prohibited)",
              standard: "Applies across connected transactions",
            },
          ]}
        />

        <CalculatorToolBridge
          title="Estimate Your 2026 Corporate Tax & SBR Eligibility"
          description="Test your exact UAE annual revenue and net profit in our 4-step guided 2026 Corporate Tax Calculator."
          ctaLabel="Estimate in 60 Seconds"
          onAction={() => navigate("/uae-tax-planner")}
        />
      </section>

      {/* 3. How Dias Secures Your SBR Election */}
      <section id="roadmap" className="scroll-mt-28 pt-4 space-y-6">
        <div className="space-y-2">
          <h2 className="font-display text-2xl font-bold text-[#0D1B2A] tracking-tight">
            How Dias Accounting Secures Your SBR Election
          </h2>
          <p className="text-sm sm:text-base text-[#475569] leading-[1.65] max-w-[68ch]">
            Our FTA-registered agents handle revenue verification, EmaraTax submission, and statutory archival end to end.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[
            {
              num: "01",
              title: "Revenue Verification",
              desc: "Reconcile 12-month bank statements and sales ledgers to confirm gross revenue stays within AED 3,000,000 under IFRS.",
            },
            {
              num: "02",
              title: "Article 50 Anti-Abuse Check",
              desc: "Review related entities and connected persons so your SBR election stands up to FTA inspection without audit flags.",
            },
            {
              num: "03",
              title: "EmaraTax Filing & Election",
              desc: "Submit your annual Corporate Tax Return with the formal Article 21 Small Business Relief election before the 9-month deadline.",
            },
            {
              num: "04",
              title: "7-Year Statutory Archival",
              desc: "Package your trial balances, P&L statements, and filing receipts into the 7-year archive mandated by Decree-Law No. 28.",
            },
          ].map((step) => (
            <div
              key={step.num}
              className="rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] p-6 space-y-2"
            >
              <span className="text-xs font-bold text-[#1B4332] tabular-nums">{step.num}</span>
              <h3 className="font-display font-bold text-base text-[#0D1B2A]">{step.title}</h3>
              <p className="text-sm text-[#475569] leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FAQs */}
      <section id="faqs" className="scroll-mt-28 pt-4 space-y-5">
        <h2 className="font-display text-2xl font-bold text-[#0D1B2A] tracking-tight">
          Small Business Relief FAQs
        </h2>
        <div className="rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] px-6 sm:px-8 py-2">
          <ExecutiveAccordion items={SBR_FAQS} defaultOpenIndex={0} />
        </div>
      </section>
    </TaxHubLayout>
  );
};

export default SmallBusinessTaxReliefPage;

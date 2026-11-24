import React, { useEffect } from "react";
import {
  Building2,
  FileCheck2,
  Landmark,
  Scale,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import {
  applyPageSEO,
  buildBreadcrumbSchema,
  buildFAQPageSchema,
  buildServiceSchema,
  removeJsonLd,
  upsertJsonLd,
} from "../lib/seo";
import ServicePageTemplate from "../components/hub/ServicePageTemplate";
import { ComplianceTable, ExecutiveCallout } from "../components/hub/ExecutivePrimitives";

interface PageProps {
  onNavigate?: (path: string) => void;
  onOpenAudit?: () => void;
  onOpenPrivacy?: () => void;
  onOpenGooglePreferred?: () => void;
}

const FEATURED_DIVIDEND_FAQ = {
  question:
    "When is a statutory dividends audit required in Dubai, DIFC, or UAE Free Zones?",
  answer:
    "A statutory dividends audit is required whenever a Dubai Mainland, DIFC, or UAE Free Zone company distributes interim or final dividends, verifying realized distributable profits and 10% legal reserves under UAE Commercial Companies Law, confirming post-payout solvency for UAE banks, and protecting 0% Corporate Tax compliance.",
};

const DIVIDEND_FAQS = [
  {
    question: "Can a UAE company distribute interim dividends mid-year?",
    answer:
      "Yes, provided the company's Memorandum of Association (MOA) authorizes interim distributions, management prepares interim financial statements showing sufficient realized profit, and an auditor verifies that the company maintains adequate working capital and solvency.",
  },
  {
    question: "Are dividends paid by a UAE company subject to personal income tax?",
    answer:
      "No. The United Arab Emirates levies 0% personal income tax on individuals and 0% withholding tax on outbound dividend distributions under Article 45 of Decree-Law No. 47. Non-resident shareholders should verify domestic tax treaty treatment in their home jurisdiction.",
  },
  {
    question: "What documents do UAE banks require to release dividend wire transfers?",
    answer:
      "Most UAE Tier-1 corporate banks (including Emirates NBD, FAB, ADCB, and Mashreq) require audited financial statements, a formal AGM or Board Dividend Resolution, a solvency confirmation, and a signed auditor certificate validating distributable reserves.",
  },
];

const ALL_DIVIDEND_SCHEMA_FAQS = [FEATURED_DIVIDEND_FAQ, ...DIVIDEND_FAQS];

export const DividendsAuditPage: React.FC<PageProps> = ({
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
    const pageTitle = "Dividends Audit Dubai & UAE | Statutory Interim & Final Dividend Audits";
    const pageDesc =
      "Fast, compliant statutory dividend audits for Dubai Mainland, DIFC, DTEC & Free Zone companies under UAE Commercial Companies Law. Clear audit sign-off by FTA-Registered Tax Agents.";
    const canonicalPath = "/dividends-audit";
    const pageUrl = `https://diasuae.ae${canonicalPath}`;

    applyPageSEO({
      title: pageTitle,
      description: pageDesc,
      canonicalPath,
      keywords:
        "dividends audit dubai, dividends audit uae, audit services for dividends uae, dividend distribution certification, commercial companies law dividend audit",
      ogType: "website",
    });

    upsertJsonLd(
      "page-service-jsonld",
      buildServiceSchema({
        name: "Statutory Dividend Audit & Distributable Profit Certification",
        description: pageDesc,
        canonicalPath,
      })
    );
    upsertJsonLd("page-faq-jsonld", buildFAQPageSchema(ALL_DIVIDEND_SCHEMA_FAQS, `${pageUrl}#faqs`));
    upsertJsonLd(
      "page-breadcrumb-jsonld",
      buildBreadcrumbSchema(
        [
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: "Statutory Dividend Audit", path: canonicalPath },
        ],
        `${pageUrl}#breadcrumb`
      )
    );

    window.scrollTo({ top: 0, behavior: "instant" });
    return () => {
      removeJsonLd("page-service-jsonld");
      removeJsonLd("page-faq-jsonld");
      removeJsonLd("page-breadcrumb-jsonld");
    };
  }, []);

  const statutoryFrameworkSection = (
    <section className="bg-[#FFFFFF] py-16 lg:py-24 border-b border-[#E2E8F0]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <ExecutiveCallout
          title="Why Uncertified Dividend Withdrawals Trigger FTA & Legal Risk"
          accent="gold"
        >
          Distributing capital without audited distributable profits violates UAE Commercial Companies Law (Federal Decree-Law No. 32 of 2021) and can expose directors to personal liability. Under Article 36 of the UAE Corporate Tax Law, undocumented shareholder withdrawals risk reclassification as non-arm&apos;s-length remuneration or disallowed deductions.
        </ExecutiveCallout>

        <div className="max-w-2xl space-y-2.5">
          <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#856422]">
            Statutory &amp; Tax Framework
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0D1B2A] tracking-tight">
            UAE Corporate Tax &amp; Commercial Law Rules on Dividends
          </h2>
          <p className="text-[#475569] text-base leading-[1.65] max-w-[65ch]">
            Lawful profit distributions combine Commercial Companies Law solvency rules with Decree-Law No. 47 exemptions.
          </p>
        </div>

        <ComplianceTable
          caption="UAE statutory and Corporate Tax treatment of dividends"
          columns={[
            { key: "provision", label: "Statutory Provision" },
            { key: "rule", label: "Legal Requirement & Tax Treatment" },
            { key: "benchmark", label: "Key Threshold", highlight: true },
          ]}
          rows={[
            {
              provision: "Distributable Profits Test",
              rule: "Dividends may only be paid from realized net profits and accumulated retained earnings verified by audited IFRS accounts.",
              benchmark: "Audited Financial Statements",
            },
            {
              provision: "Statutory Legal Reserve (Article 103)",
              rule: "UAE LLCs must allocate annual net profits into a non-distributable legal reserve until statutory cap is reached.",
              benchmark: "10% Annual Profit (Up to 50% Capital)",
            },
            {
              provision: "Participation Exemption (Article 23)",
              rule: "Dividends received from qualifying UAE or foreign shareholdings are 100% exempt from UAE Corporate Tax.",
              benchmark: "≥ 5% Ownership · 12 Months · ≥ 9% Foreign Tax",
            },
            {
              provision: "Withholding Tax (Article 45)",
              rule: "Outbound dividend remittances to resident founders or foreign parent companies attract zero UAE withholding tax.",
              benchmark: "0% Withholding Tax",
            },
            {
              provision: "Connected Persons (Article 36)",
              rule: "Owner salaries must reflect Fair Market Value (arm's length) to remain deductible and distinct from profit distributions.",
              benchmark: "Arm's-Length Benchmark",
            },
          ]}
        />
      </div>
    </section>
  );

  return (
    <ServicePageTemplate
      currentPath="/dividends-audit"
      breadcrumbName="Dividends Audit & Certification"
      eyebrow="Audit & Assurance · UAE Commercial Law"
      title="Dividends Audit & Lawful Profit Certification"
      subtitle="Verify distributable profits under Federal Decree-Law No. 32 of 2021, satisfy UAE Tier-1 corporate bank remittance requirements, and safeguard 0% tax dividend treatment under Decree-Law No. 47."
      metadataStrip={[
        { label: "UAE Withholding Tax", value: "0% WHT on Dividends (Article 45)" },
        { label: "Statutory Reserve Check", value: "10% Legal Reserve Allocation" },
        { label: "Bank Clearance", value: "Accepted by ENBD, FAB, ADCB & Mashreq" },
      ]}
      customTopSection={statutoryFrameworkSection}
      deliverablesHeading="What's Included in a Dividends Audit"
      deliverablesSubheading="Complete financial verification and corporate governance documentation required by shareholders, auditors, and UAE corporate banks."
      deliverables={[
        {
          title: "Distributable Profits Verification",
          description:
            "Audited validation of realized net profits, retained earnings, and post-distribution liquidity.",
          icon: <Scale className="w-5 h-5" />,
        },
        {
          title: "10% Legal Reserve Computation",
          description:
            "Accurate calculation and verification of statutory reserve allocations under Article 103.",
          icon: <ShieldCheck className="w-5 h-5" />,
        },
        {
          title: "Interim & Final Audit Reports",
          description:
            "Signed interim or annual IFRS financial statements supporting mid-year or year-end payouts.",
          icon: <FileCheck2 className="w-5 h-5" />,
        },
        {
          title: "Board & AGM Resolution Pack",
          description:
            "Structured shareholder resolutions, board minutes, and dividend distribution vouchers.",
          icon: <Building2 className="w-5 h-5" />,
        },
        {
          title: "Bank Remittance Certificate",
          description:
            "Signed auditor certification letters accepted by major UAE banks for domestic and overseas wires.",
          icon: <Landmark className="w-5 h-5" />,
        },
        {
          title: "Article 23 & 36 Tax Review",
          description:
            "Participation Exemption verification and arm's-length review of owner salary vs. dividend splits.",
          icon: <TrendingUp className="w-5 h-5" />,
        },
      ]}
      processHeading="Dividend Certification Workflow"
      processSteps={[
        {
          number: "01",
          title: "Balance Sheet Audit",
          description:
            "Verify net profits, retained earnings, and working capital solvency across your IFRS trial balance.",
        },
        {
          number: "02",
          title: "Statutory Reserve Check",
          description:
            "Confirm mandatory 10% legal reserve allocation and MOA authorization for interim or final payouts.",
        },
        {
          number: "03",
          title: "Governance Resolutions",
          description:
            "Draft shareholder AGM resolutions, board minutes, and dividend vouchers for corporate records.",
        },
        {
          number: "04",
          title: "Bank Clearance",
          description:
            "Issue signed auditor certificates enabling smooth corporate bank wire execution to shareholders.",
        },
      ]}
      whoIsItForHeading="Who Requires a Statutory Dividends Audit"
      whoIsItForItems={[
        "UAE Mainland LLCs and DIFC / Free Zone entities distributing annual or interim profits",
        "Holding companies repatriating dividends to overseas parent entities or non-resident founders",
        "Businesses requested by Emirates NBD, FAB, ADCB, or Mashreq to provide auditor dividend clearance",
        "Founders optimizing arm's-length owner salary vs. 0% dividend payouts under UAE Corporate Tax",
      ]}
      regulatorySnapshot={{
        law: "Federal Decree-Law No. 32/2021 (CCL) & Decree-Law No. 47/2022 (CT)",
        authority: "UAE Commercial Banks, DIFC / Free Zone Registrars & FTA",
        deadline: "Prior to passing shareholder distribution resolutions and bank wire transfers",
        plan: "Standalone engagement (AED 1,500 – AED 6,000 scoped)",
      }}
      faqsHeading="UAE Dividend Distribution FAQs"
      customFaqSection={
        <article className="rounded-2xl bg-[#070d19] text-white border border-[#c5a059]/35 p-6 sm:p-8 shadow-sm">
          <div className="w-10 h-[2px] bg-[#c5a059] mb-4" aria-hidden="true" />
          <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug mb-3">
            When is a statutory dividends audit required in Dubai, DIFC, or UAE Free Zones?
          </h2>
          <p className="text-sm sm:text-[15px] text-slate-200 leading-relaxed">
            A statutory dividends audit is required whenever a Dubai Mainland, DIFC, or UAE Free Zone company distributes{" "}
            <strong className="text-[#c5a059] font-semibold">interim or final dividends</strong>, verifying realized distributable profits and{" "}
            <strong className="text-[#c5a059] font-semibold">10% legal reserves</strong> under UAE Commercial Companies Law, confirming post-payout solvency for UAE banks, and protecting{" "}
            <strong className="text-[#c5a059] font-semibold">0% Corporate Tax compliance</strong>.
          </p>
        </article>
      }
      faqs={DIVIDEND_FAQS}
      relatedServices={[
        { label: "DIFC & DTEC Accounting", path: "/tax-planning-difc" },
        { label: "Audit Readiness & Advisory", path: "/services/auditing-assurance" },
        { label: "Corporate Tax Advisory", path: "/services/corporate-tax-advisory" },
        { label: "Fixed-Fee Packages", path: "/pricing" },
      ]}
      closingCta={{
        eyebrow: "Chartered Audit Engagement",
        title: "Certify Your Shareholder Dividends Without Delays",
        description:
          "Request a fixed-fee dividend audit and bank clearance dossier prepared by senior UAE chartered accountants.",
        ctaLabel: "Book Free Consultation",
      }}
      onNavigate={navigate}
      onOpenAudit={onOpenAudit}
      onOpenPrivacy={onOpenPrivacy}
      onOpenGooglePreferred={onOpenGooglePreferred}
    />
  );
};

export default DividendsAuditPage;

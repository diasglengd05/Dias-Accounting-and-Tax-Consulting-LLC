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
import SameDayQuoteBox from "../components/SameDayQuoteBox";
import QuickSummaryBox from "../components/QuickSummaryBox";
import TaxAgentReviewStrip from "../components/TaxAgentReviewStrip";
import MonthlyPackageConversionStrip from "../components/MonthlyPackageConversionStrip";

interface PageProps {
  onNavigate?: (path: string) => void;
  onOpenAudit?: () => void;
  onOpenPrivacy?: () => void;
  onOpenGooglePreferred?: () => void;
}

import {
  ALL_DIVIDEND_SCHEMA_FAQS,
  DIVIDENDS_ACCORDION_FAQS,
  DIVIDENDS_FEATURED_FAQ,
} from "../data/pageFaqs";

export { ALL_DIVIDEND_SCHEMA_FAQS };

const FEATURED_DIVIDEND_FAQ = DIVIDENDS_FEATURED_FAQ;
const DIVIDEND_FAQS = DIVIDENDS_ACCORDION_FAQS;

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
    const pageTitle = "Dividends Audit Dubai & UAE | Fast Statutory Sign-Off (FTA Tax Agents)";
    const pageDesc =
      "Fast 5-day statutory interim & final dividends audits in Dubai, DIFC & UAE Free Zones under IFRS. Protect 0% dividend tax status. Same-day fixed quote.";
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
    upsertJsonLd(
      "page-faq-jsonld",
      buildFAQPageSchema(ALL_DIVIDEND_SCHEMA_FAQS, `${pageUrl}#faqs`, {
        url: pageUrl,
        name: "UAE Dividend Distribution FAQs",
        description: pageDesc,
      })
    );
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

        {/* Fast-Track 3-Step Statutory Dividends Audit Timeline */}
        <div className="rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] p-6 sm:p-10 text-[#0D1B2A] shadow-xs space-y-8">
          <div className="max-w-3xl space-y-2.5">
            <span className="inline-block text-xs font-semibold uppercase tracking-[0.14em] text-[#856422]">
              Fast Statutory Sign-Off · 4–5 Business Days
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0D1B2A] tracking-tight">
              How Fast Is a Statutory Dividends Audit in Dubai &amp; UAE?
            </h2>
            <p className="text-sm sm:text-base text-[#475569] leading-relaxed max-w-[65ch]">
              Our chartered audit and FTA-registered tax team executes interim and final statutory dividend audits on a predictable 5-day turnaround—accepted by Dubai Mainland DET, DIFC, DTEC, DMCC, SHAMS, and UAE Tier-1 banks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                step: "Day 1",
                title: "Ledger & Reserves Check",
                description:
                  "Trial balance review, MOA interim/final dividend authorization check, and verification of realized retained earnings plus mandatory 10% statutory legal reserves under Article 103.",
              },
              {
                step: "Day 2–3",
                title: "IFRS Solvency Verification",
                description:
                  "Substantive IFRS testing of cash balances, payables, tax provisions (9% CT & 5% VAT), and post-distribution working capital solvency to protect directors from personal liability.",
              },
              {
                step: "Day 4–5",
                title: "Signed Statutory Report",
                description:
                  "Issuance of signed statutory audited financial statements, Board/AGM dividend resolution pack, and bank remittance clearance certificate for Emirates NBD, FAB, ADCB, or Mashreq.",
              },
            ].map((phase) => (
              <div
                key={phase.step}
                className="rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] p-6 flex flex-col justify-between space-y-3 shadow-xs"
              >
                <div className="space-y-2.5">
                  <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#856422] tabular-nums">
                    {phase.step}
                  </span>
                  <h3 className="font-display text-lg font-bold text-[#0D1B2A] leading-snug">
                    {phase.title}
                  </h3>
                  <p className="text-sm text-[#475569] leading-relaxed">
                    {phase.description}
                  </p>
                </div>
                <div className="pt-3 border-t border-[#E2E8F0] text-[11px] font-semibold uppercase tracking-wider text-[#1B4332]">
                  UAE Commercial Law &amp; IFRS Compliant
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interim vs. Final Dividends Audit Comparison Table */}
        <div className="space-y-5">
          <div className="max-w-3xl space-y-2">
            <span className="inline-block text-xs font-semibold uppercase tracking-[0.14em] text-[#856422]">
              Dividend Audit Comparison · UAE 2026
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0D1B2A] tracking-tight">
              Interim Dividends Audit vs. Final Dividends Audit
            </h2>
            <p className="text-sm sm:text-base text-[#475569] leading-[1.65] max-w-[65ch]">
              Compare IFRS financial requirements, turnaround times, bank KYC sign-off, and 0% UAE dividend tax protection for mid-year vs. year-end shareholder distributions.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] text-[#0D1B2A] shadow-xs">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-xs uppercase tracking-wider">
                  <th scope="col" className="px-5 py-4 font-semibold text-[#475569]">
                    Audit Factor
                  </th>
                  <th scope="col" className="px-5 py-4 font-semibold text-[#0D1B2A]">
                    Interim Dividends Audit
                  </th>
                  <th scope="col" className="px-5 py-4 font-semibold text-[#0D1B2A]">
                    Final Dividends Audit
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                <tr className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-5 py-4 font-semibold text-[#0D1B2A] whitespace-nowrap">
                    Payout Timing
                  </td>
                  <td className="px-5 py-4 text-[#475569]">
                    Mid-year distribution (Q1, Q2, or Q3 realized profits before financial year-end)
                  </td>
                  <td className="px-5 py-4 text-[#475569]">
                    Post-year-end distribution approved at the Annual General Meeting (AGM)
                  </td>
                </tr>
                <tr className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-5 py-4 font-semibold text-[#0D1B2A] whitespace-nowrap">
                    Required IFRS Financials
                  </td>
                  <td className="px-5 py-4 text-[#475569]">
                    Audited interim IFRS Balance Sheet, Profit &amp; Loss, retained earnings schedule &amp; MOA authorization check
                  </td>
                  <td className="px-5 py-4 text-[#475569]">
                    Full-year audited IFRS financial statements, 9% CT / 5% VAT tax provisions &amp; final retained earnings
                  </td>
                </tr>
                <tr className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-5 py-4 font-semibold text-[#0D1B2A] whitespace-nowrap">
                    Typical Timeline
                  </td>
                  <td className="px-5 py-4 font-semibold text-[#1B4332] whitespace-nowrap">
                    5 working days
                  </td>
                  <td className="px-5 py-4 font-semibold text-[#1B4332] whitespace-nowrap">
                    5 working days
                  </td>
                </tr>
                <tr className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-5 py-4 font-semibold text-[#0D1B2A] whitespace-nowrap">
                    Legal Reserve &amp; Solvency
                  </td>
                  <td className="px-5 py-4 text-[#475569]">
                    Post-payout liquidity &amp; working-capital solvency verification protecting directors under CCL
                  </td>
                  <td className="px-5 py-4 text-[#475569]">
                    Mandatory 10% Legal Reserve allocation (Article 103, up to 50% share capital) plus solvency sign-off
                  </td>
                </tr>
                <tr className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-5 py-4 font-semibold text-[#0D1B2A] whitespace-nowrap">
                    Bank KYC &amp; 0% Dividend Tax Protection
                  </td>
                  <td className="px-5 py-4 text-[#475569]">
                    Signed bank clearance letter (ENBD, FAB, ADCB, Mashreq), 0% WHT (Art. 45) &amp; Art. 36 salary-vs-dividend defense
                  </td>
                  <td className="px-5 py-4 text-[#475569]">
                    Full audited AGM dossier for overseas/local bank remittance, 0% WHT &amp; Participation Exemption (Art. 23)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <ServicePageTemplate
      currentPath="/dividends-audit"
      breadcrumbName="Dividends Audit & Certification"
      eyebrow="Audit & Assurance · UAE Commercial Law"
      title="Statutory Dividends Audit in Dubai, DIFC & UAE Free Zones"
      quickSummary={
        <QuickSummaryBox>
          <strong className="text-[#0D1B2A] font-semibold">
            DiasUAE (Dias Accounting and Tax Consulting LLC)
          </strong>
          , led by FTA-Registered Tax Agent{" "}
          <strong className="text-[#856422] font-semibold">Glen Dias</strong> (SHAMS Licence{" "}
          <span className="tabular-nums">2646813.01</span>) and recognized as a 2x Clutch 2026 UAE Leader, conducts statutory interim and final dividend audits, 10% legal reserve checks, and Tier-1 UAE bank clearance dossiers. Covering Dubai Mainland, DIFC, DTEC, DMCC, IFZA, and SHAMS, we deliver signed IFRS audit sign-off in{" "}
          <strong className="text-[#0D1B2A] font-semibold">5 working days</strong> alongside ongoing monthly accounting retainers starting{" "}
          <strong className="text-[#0D1B2A] font-semibold">from AED 400/month</strong>.
        </QuickSummaryBox>
      }
      subtitle="Verify distributable profits under Federal Decree-Law No. 32 of 2021, satisfy UAE Tier-1 corporate bank remittance requirements, and safeguard 0% tax dividend treatment under Decree-Law No. 47."
      metadataStrip={[
        { label: "UAE Withholding Tax", value: "0% WHT on Dividends (Article 45)" },
        { label: "Typical Turnaround", value: "5 Working Days Statutory Sign-Off" },
        { label: "Bank Clearance", value: "Accepted by ENBD, FAB, ADCB & Mashreq" },
      ]}
      heroBottomSlot={
        <SameDayQuoteBox
          idPrefix="dividends-quote"
          defaultJurisdiction="Dubai Mainland"
          defaultService="Dividends Audit"
        />
      }
      customTopSection={statutoryFrameworkSection}
      bottomAttributionSlot={
        <>
          <MonthlyPackageConversionStrip onNavigate={navigate} />
          <TaxAgentReviewStrip />
        </>
      }
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
        plan: "Scoped standalone audit · Ongoing IFRS retainers from AED 400/month",
      }}
      faqsHeading="UAE Dividend Distribution FAQs"
      customFaqSection={
        <article className="rounded-2xl bg-[#FFFFFF] text-[#0D1B2A] border border-[#E2E8F0] p-6 sm:p-8 shadow-xs">
          <div className="w-10 h-[2px] bg-[#C5A059] mb-4" aria-hidden="true" />
          <h2 className="font-display text-xl sm:text-2xl font-bold text-[#0D1B2A] tracking-tight leading-snug mb-3">
            {FEATURED_DIVIDEND_FAQ.question}
          </h2>
          <p className="text-sm sm:text-[15px] text-[#475569] leading-relaxed">
            A statutory dividends audit is required whenever a Dubai Mainland, DIFC, or UAE Free Zone company distributes{" "}
            <strong className="text-[#1B4332] font-semibold">interim or final dividends</strong>, verifying realized distributable profits and{" "}
            <strong className="text-[#1B4332] font-semibold">10% legal reserves</strong> under UAE Commercial Companies Law, confirming post-payout solvency for UAE banks, and protecting{" "}
            <strong className="text-[#1B4332] font-semibold">0% Corporate Tax compliance</strong>.
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

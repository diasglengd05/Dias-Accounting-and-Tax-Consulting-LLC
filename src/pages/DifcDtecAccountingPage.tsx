import React, { useEffect } from "react";
import {
  Building2,
  Check,
  Cpu,
  FileCheck2,
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
import { DIFC_DTEC_FAQS } from "../data/pageFaqs";
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

export { DIFC_DTEC_FAQS };

const DIFC_CANONICAL_PATH = "/tax-planning-difc";
const DIFC_PAGE_URL = `https://diasuae.ae${DIFC_CANONICAL_PATH}`;
const DIFC_PAGE_TITLE = "DIFC & DTEC Accounting, 0% QFZP Tax & Virtual Bookkeeping | Dias UAE";
const DIFC_PAGE_DESC =
  "FTA-Registered Tax Agents for DIFC & DTEC companies. 0% QFZP compliance, audited IFRS books, 5% VAT & virtual bookkeeping from AED 400/mo. 2x Clutch 2026.";
const DIFC_FAQS_HEADING = "DIFC & DTEC Tax Compliance FAQs";

/**
 * Schema.org FAQPage JSON-LD structured data for /tax-planning-difc.
 * Mirrors all 7 visible FAQs (2 featured cards + 5 accordion items) verbatim.
 */
export const DIFC_DTEC_FAQ_JSONLD = buildFAQPageSchema(
  DIFC_DTEC_FAQS,
  `${DIFC_PAGE_URL}#faqs`,
  {
    url: DIFC_PAGE_URL,
    name: DIFC_FAQS_HEADING,
    description: DIFC_PAGE_DESC,
  }
);

function renderHighlightedFaqAnswer(
  text: string,
  highlights: Array<{ phrase: string; className: string }>
): React.ReactNode {
  let parts: Array<string | React.ReactNode> = [text];
  highlights.forEach(({ phrase, className }, hIdx) => {
    const next: Array<string | React.ReactNode> = [];
    parts.forEach((part, pIdx) => {
      if (typeof part !== "string") {
        next.push(part);
        return;
      }
      const splitIndex = part.indexOf(phrase);
      if (splitIndex === -1) {
        next.push(part);
        return;
      }
      const before = part.slice(0, splitIndex);
      const after = part.slice(splitIndex + phrase.length);
      if (before) next.push(before);
      next.push(
        <strong key={`${hIdx}-${pIdx}`} className={className}>
          {phrase}
        </strong>
      );
      if (after) next.push(after);
    });
    parts = next;
  });
  return parts;
}

export const DifcDtecAccountingPage: React.FC<PageProps> = ({
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
    applyPageSEO({
      title: DIFC_PAGE_TITLE,
      description: DIFC_PAGE_DESC,
      canonicalPath: DIFC_CANONICAL_PATH,
      keywords:
        "DIFC Corporate Tax Planning, DTEC Accounting & Bookkeeping, 0% Qualifying Free Zone Person (QFZP) Compliance, DIFC Dividend Audits, 5% UAE VAT Filing",
      ogType: "website",
    });

    upsertJsonLd(
      "page-service-jsonld",
      buildServiceSchema({
        name: "DIFC & DTEC Accounting, 0% QFZP Corporate Tax & Dividend Audits",
        description: DIFC_PAGE_DESC,
        canonicalPath: DIFC_CANONICAL_PATH,
      })
    );

    upsertJsonLd("page-faq-jsonld", DIFC_DTEC_FAQ_JSONLD);
    upsertJsonLd(
      "page-breadcrumb-jsonld",
      buildBreadcrumbSchema(
        [
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: "DIFC & DTEC Tax Planning", path: DIFC_CANONICAL_PATH },
        ],
        `${DIFC_PAGE_URL}#breadcrumb`
      )
    );

    window.scrollTo({ top: 0, behavior: "instant" });
    return () => {
      removeJsonLd("page-service-jsonld");
      removeJsonLd("page-faq-jsonld");
      removeJsonLd("page-breadcrumb-jsonld");
    };
  }, []);

  const currentPath = DIFC_CANONICAL_PATH;

  const jurisdictionSection = (
    <section className="bg-[#FFFFFF] py-16 lg:py-24 border-b border-[#E2E8F0]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="max-w-2xl space-y-2.5">
          <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#856422]">
            Jurisdiction Specialization
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0D1B2A] tracking-tight">
            DIFC vs. DTEC Compliance Requirements
          </h2>
          <p className="text-[#475569] text-base leading-[1.65] max-w-[65ch]">
            Regulated financial firms in DIFC and venture-backed technology startups in DTEC (Dubai Silicon Oasis) face distinct reporting and economic substance expectations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] p-7 sm:p-8 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] flex items-center justify-center text-[#0D1B2A]">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="font-display text-xl font-bold text-[#0D1B2A]">
              DIFC (Dubai International Financial Centre)
            </h3>
            <p className="text-sm text-[#475569] leading-[1.65]">
              Common-law financial, holding, and advisory entities operating under DIFC Companies Law and DFSA oversight require rigorous full IFRS accounts, capital adequacy controls, and arm&apos;s-length intercompany documentation.
            </p>
            <ul className="space-y-2.5 pt-2 text-sm text-[#334155]">
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-[#1B4332] shrink-0 mt-0.5" strokeWidth={2.25} />
                <span>Annual statutory audit preparation under DIFC Companies Law</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-[#1B4332] shrink-0 mt-0.5" strokeWidth={2.25} />
                <span>QFZP Qualifying Income mapping for treasury, holding &amp; advisory entities</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-[#1B4332] shrink-0 mt-0.5" strokeWidth={2.25} />
                <span>Interim &amp; final dividend audit certification for board resolutions</span>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] p-7 sm:p-8 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] flex items-center justify-center text-[#0D1B2A]">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-display text-xl font-bold text-[#0D1B2A]">
              DTEC (Dubai Technology Entrepreneur Campus — DSO)
            </h3>
            <p className="text-sm text-[#475569] leading-[1.65]">
              SaaS ventures, AI companies, and e-commerce founders inside Dubai Silicon Oasis need clean monthly cloud accounting, R&amp;D capitalization, and optimal elections between 0% QFZP and Small Business Relief.
            </p>
            <ul className="space-y-2.5 pt-2 text-sm text-[#334155]">
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-[#1B4332] shrink-0 mt-0.5" strokeWidth={2.25} />
                <span>Cloud ERP setup on Zoho Books, Xero, or QuickBooks Online</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-[#1B4332] shrink-0 mt-0.5" strokeWidth={2.25} />
                <span>Strategic assessment: 0% QFZP vs. Small Business Relief (AED 3M cap)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-[#1B4332] shrink-0 mt-0.5" strokeWidth={2.25} />
                <span>Monthly burn-rate, gross margin &amp; investor financial packets</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 5 Statutory QFZP Conditions Table */}
        <div className="space-y-5">
          <div className="max-w-2xl space-y-2">
            <h3 className="font-display text-xl sm:text-2xl font-bold text-[#0D1B2A]">
              5 Statutory Conditions for 0% QFZP Status
            </h3>
            <p className="text-sm text-[#475569] leading-[1.65]">
              Under Cabinet Decision No. 55 of 2023 and Ministerial Decision No. 139 of 2023, DIFC and DTEC entities must satisfy all five tests each tax period.
            </p>
          </div>

          <ComplianceTable
            caption="Five statutory conditions for 0% Qualifying Free Zone Person status"
            columns={[
              { key: "condition", label: "Statutory Condition" },
              { key: "requirement", label: "FTA Requirement" },
              { key: "threshold", label: "Benchmark", highlight: true },
            ]}
            rows={[
              {
                condition: "01. Economic Substance",
                requirement: "Adequate qualified personnel, physical Free Zone premises, and operational expenditure.",
                threshold: "Core Income Generating Activities in Free Zone",
              },
              {
                condition: "02. Qualifying Income",
                requirement: "Revenue from Free Zone persons or enumerated Qualifying Activities (holding, treasury, HQ).",
                threshold: "0% Corporate Tax Rate",
              },
              {
                condition: "03. Audited IFRS Statements",
                requirement: "Annual financial statements prepared under IFRS and audited by a UAE-licensed auditor.",
                threshold: "Mandatory regardless of revenue",
              },
              {
                condition: "04. De Minimis Rule",
                requirement: "Non-qualifying revenue from mainland or excluded activities stays within statutory limit.",
                threshold: "Lower of 5% revenue or AED 5,000,000",
              },
              {
                condition: "05. Transfer Pricing",
                requirement: "All related-party and connected-person transactions meet Article 34 arm's-length rules.",
                threshold: "OECD Local/Master File & Disclosure",
              },
            ]}
          />

          <ExecutiveCallout title="5-Year Disqualification Warning" accent="gold">
            Failing any single QFZP condition—including skipping audited IFRS financial statements or breaching the 5% / AED 5,000,000 De Minimis cap—automatically disqualifies the entity from the 0% regime for the current period and the next 4 consecutive tax periods.
          </ExecutiveCallout>
        </div>

        {/* AI Mode Comparison Table: 0% SBR vs. 0% QFZP vs. 9% Standard Corporate Tax */}
        <div className="space-y-5">
          <div className="max-w-3xl space-y-2">
            <span className="inline-block text-xs font-semibold uppercase tracking-[0.14em] text-[#856422]">
              2026 UAE Tax Regime Comparison · DIFC &amp; DTEC
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0D1B2A] tracking-tight">
              0% Small Business Relief vs. 0% QFZP vs. 9% Standard Corporate Tax
            </h2>
            <p className="text-sm sm:text-base text-[#475569] leading-[1.65] max-w-[65ch]">
              Choosing the right EmaraTax election protects DIFC financial firms and DTEC tech startups from unexpected 9% tax exposure and 5-year QFZP disqualifications.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] text-[#0D1B2A] shadow-xs">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-xs uppercase tracking-wider">
                  <th scope="col" className="px-4 py-4 font-semibold text-[#475569]">
                    Criterion
                  </th>
                  <th scope="col" className="px-4 py-4 font-semibold text-[#856422]">
                    0% Small Business Relief (Revenue up to AED 3M)
                  </th>
                  <th scope="col" className="px-4 py-4 font-semibold text-[#1B4332]">
                    0% Qualifying Free Zone Person (QFZP)
                  </th>
                  <th scope="col" className="px-4 py-4 font-semibold text-[#0D1B2A]">
                    9% Standard UAE Corporate Tax
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                <tr className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-4 py-4 font-semibold text-[#0D1B2A] whitespace-nowrap">
                    Corporate Tax Rate
                  </td>
                  <td className="px-4 py-4 font-semibold text-[#1B4332]">
                    0% (Taxable income treated as AED 0)
                  </td>
                  <td className="px-4 py-4 font-semibold text-[#1B4332]">
                    0% on Qualifying Income (9% on non-qualifying)
                  </td>
                  <td className="px-4 py-4 text-[#475569]">
                    0% on profit up to AED 375,000 · 9% above AED 375,000
                  </td>
                </tr>
                <tr className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-4 py-4 font-semibold text-[#0D1B2A] whitespace-nowrap">
                    Revenue / Cap Rules
                  </td>
                  <td className="px-4 py-4 text-[#475569]">
                    Gross revenue ≤ AED 3,000,000 per period (extended through 31 Dec 2029)
                  </td>
                  <td className="px-4 py-4 text-[#475569]">
                    No total revenue cap; non-qualifying revenue ≤ lower of 5% or AED 5,000,000
                  </td>
                  <td className="px-4 py-4 text-[#475569]">
                    Applies above AED 3M (non-QFZP) or for 5 tax periods after QFZP breach
                  </td>
                </tr>
                <tr className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-4 py-4 font-semibold text-[#0D1B2A] whitespace-nowrap">
                    Audited IFRS Accounts
                  </td>
                  <td className="px-4 py-4 text-[#475569]">
                    Simplified CT return (note: DIFC/DTEC license rules may still require audit)
                  </td>
                  <td className="px-4 py-4 font-semibold text-[#0D1B2A]">
                    Strictly mandatory annually regardless of revenue size
                  </td>
                  <td className="px-4 py-4 text-[#475569]">
                    Mandatory if revenue &gt; AED 50M or required by Free Zone authority
                  </td>
                </tr>
                <tr className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-4 py-4 font-semibold text-[#0D1B2A] whitespace-nowrap">
                    Substance &amp; Transfer Pricing
                  </td>
                  <td className="px-4 py-4 text-[#475569]">
                    Clean IFRS books &amp; annual SBR election on EmaraTax
                  </td>
                  <td className="px-4 py-4 text-[#475569]">
                    Adequate Free Zone CIGA, qualified staff, premises &amp; arm&apos;s-length OECD TP
                  </td>
                  <td className="px-4 py-4 text-[#475569]">
                    Connected Person arm&apos;s-length benchmarking (Art. 36) &amp; full deductions
                  </td>
                </tr>
                <tr className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-4 py-4 font-semibold text-[#0D1B2A] whitespace-nowrap">
                    Best Fit in DIFC / DTEC
                  </td>
                  <td className="px-4 py-4 text-[#475569]">
                    Early-stage DTEC SaaS startups &amp; advisory practices under AED 3M revenue
                  </td>
                  <td className="px-4 py-4 text-[#475569]">
                    DIFC holding companies, treasury/HQ structures &amp; B2B Free Zone firms
                  </td>
                  <td className="px-4 py-4 text-[#475569]">
                    Mainland-heavy commercial revenue or companies carrying forward tax losses
                  </td>
                </tr>
                <tr className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-4 py-4 font-semibold text-[#0D1B2A] whitespace-nowrap">
                    DiasUAE Retainer
                  </td>
                  <td className="px-4 py-4 font-semibold text-[#1B4332] whitespace-nowrap">
                    From AED 400/month
                  </td>
                  <td className="px-4 py-4 font-semibold text-[#1B4332] whitespace-nowrap">
                    QFZP Audit-Ready from AED 1,250/month
                  </td>
                  <td className="px-4 py-4 font-semibold text-[#0D1B2A] whitespace-nowrap">
                    Growth VAT + CT from AED 600/month
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
      currentPath={currentPath}
      breadcrumbName="DIFC & DTEC Accounting & Tax"
      eyebrow="DIFC & DTEC Compliance Practice"
      title="DIFC & DTEC Accounting, 0% QFZP Tax & Virtual Bookkeeping"
      quickSummary={
        <QuickSummaryBox>
          <strong className="text-[#0D1B2A] font-semibold">
            DiasUAE (Dias Accounting and Tax Consulting LLC)
          </strong>
          , led by FTA-Registered Tax Agent{" "}
          <strong className="text-[#856422] font-semibold">Glen Dias</strong> (SHAMS Licence{" "}
          <span className="tabular-nums">2646813.01</span>) and recognized as a 2x Clutch 2026 UAE Leader, delivers 0% Qualifying Free Zone Person (QFZP) tax compliance, virtual IFRS bookkeeping, audit-ready dossiers, and 5-working-day dividend audits. Serving Dubai Mainland, DIFC, DTEC, DMCC, IFZA, and SHAMS, we close books by the 5th business day with fixed monthly retainers starting{" "}
          <strong className="text-[#0D1B2A] font-semibold">from AED 400/month</strong>.
        </QuickSummaryBox>
      }
      subtitle="Full IFRS bookkeeping, statutory interim and final dividend audits, and 0% Qualifying Free Zone Person tax compliance for financial firms in DIFC and venture-backed startups in DTEC."
      metadataStrip={[
        { label: "Qualifying Free Zone Rate", value: "0% QFZP on Qualifying Income" },
        { label: "De Minimis Ceiling", value: "Lower of 5% or AED 5,000,000" },
        { label: "Monthly Retainers", value: "Fixed Fees From AED 400/month" },
      ]}
      heroBottomSlot={
        <SameDayQuoteBox
          idPrefix="difc-quote"
          defaultJurisdiction="DIFC"
          defaultService="Monthly Accounting from AED 400/mo"
        />
      }
      customTopSection={jurisdictionSection}
      bottomAttributionSlot={
        <>
          <MonthlyPackageConversionStrip onNavigate={navigate} />
          <TaxAgentReviewStrip />
        </>
      }
      deliverablesHeading="What's Included for DIFC & DTEC Entities"
      deliverablesSubheading="End-to-end financial reporting, quarterly VAT 201 returns, and annual EmaraTax Corporate Tax submissions without hourly billing surprises."
      deliverables={[
        {
          title: "Monthly IFRS Bookkeeping",
          description:
            "Double-entry general ledger maintenance, cloud invoice coding, and continuous bank reconciliation.",
          icon: <FileCheck2 className="w-5 h-5" />,
        },
        {
          title: "0% QFZP De Minimis Monitoring",
          description:
            "Quarterly tracking of qualifying vs. non-qualifying income to protect against 5-year disqualification.",
          icon: <ShieldCheck className="w-5 h-5" />,
        },
        {
          title: "Statutory Audit Dossier",
          description:
            "Complete IFRS trial balances, working papers, and direct coordination with approved DIFC/DSO auditors.",
          icon: <Scale className="w-5 h-5" />,
        },
        {
          title: "Interim & Final Dividend Audits",
          description:
            "Verified distributable reserves certification and board resolution packs under DIFC Companies Law.",
          icon: <TrendingUp className="w-5 h-5" />,
        },
        {
          title: "Quarterly 5% VAT Form 201",
          description:
            "Accurate reverse-charge accounting on cross-border software, input VAT recovery, and timely filing.",
          icon: <Building2 className="w-5 h-5" />,
        },
        {
          title: "Transfer Pricing & EmaraTax Filing",
          description:
            "Article 34 connected-person benchmarking, TP disclosure schedules, and annual CT submission.",
          icon: <Cpu className="w-5 h-5" />,
        },
      ]}
      processHeading="How We Deliver DIFC & DTEC Compliance"
      processSteps={[
        {
          number: "01",
          title: "Bookkeeping & Close",
          description:
            "Monthly IFRS double-entry ledgers, cloud invoice processing, and multi-currency bank reconciliations.",
        },
        {
          number: "02",
          title: "Quarterly VAT Filing",
          description:
            "Form VAT 201 computation, reverse-charge checks on international SaaS, and full input tax recovery.",
        },
        {
          number: "03",
          title: "Audit Dossier Prep",
          description:
            "Balance sheet schedules, working papers, and management representations ready for independent auditor sign-off.",
        },
        {
          number: "04",
          title: "EmaraTax Submission",
          description:
            "Annual Corporate Tax return with verified QFZP or SBR elections submitted ahead of statutory deadlines.",
        },
      ]}
      whoIsItForHeading="Who This Practice Serves"
      whoIsItForItems={[
        "DFSA-regulated advisory, wealth, and financial institutions registered in DIFC",
        "DIFC holding companies, SPVs, and family offices requiring dividend audit certification",
        "DTEC & Dubai Silicon Oasis SaaS, fintech, and venture-backed technology startups",
        "Free Zone entities verifying 0% QFZP substance, audited IFRS accounts, and Transfer Pricing",
      ]}
      regulatorySnapshot={{
        law: "Federal Decree-Law No. 47/2022, Cabinet Decision 55/2023 & DIFC Companies Law",
        authority: "FTA EmaraTax, DFSA, DIFC Authority & Dubai Silicon Oasis (DTEC)",
        deadline: "Audited IFRS accounts annually; Corporate Tax return within 9 months of year-end",
        plan: "Retainers from AED 400/month | QFZP Audit-Ready from AED 1,250/month",
      }}
      faqsHeading={DIFC_FAQS_HEADING}
      customFaqSection={
        <div className="space-y-6">
          <article className="rounded-2xl bg-[#FFFFFF] text-[#0D1B2A] border border-[#E2E8F0] p-6 sm:p-8 shadow-xs">
            <div className="w-10 h-[2px] bg-[#C5A059] mb-4" aria-hidden="true" />
            <h3 className="font-display text-xl sm:text-2xl font-bold text-[#0D1B2A] tracking-tight leading-snug mb-3">
              {DIFC_DTEC_FAQS[0].question}
            </h3>
            <p className="text-sm sm:text-[15px] text-[#475569] leading-relaxed">
              {renderHighlightedFaqAnswer(DIFC_DTEC_FAQS[0].answer, [
                {
                  phrase: "0% Corporate Tax on Qualifying Income",
                  className: "text-[#1B4332] font-semibold",
                },
                {
                  phrase: "5% or AED 5,000,000 de minimis cap",
                  className: "text-[#0D1B2A] font-semibold",
                },
                {
                  phrase: "mandatory annual audited IFRS financial statements",
                  className: "text-[#0D1B2A] font-semibold",
                },
              ])}
            </p>
          </article>

          <article className="rounded-2xl bg-[#FFFFFF] text-[#0D1B2A] border border-[#E2E8F0] p-6 sm:p-8 shadow-xs">
            <div className="w-10 h-[2px] bg-[#C5A059] mb-4" aria-hidden="true" />
            <h3 className="font-display text-xl sm:text-2xl font-bold text-[#0D1B2A] tracking-tight leading-snug mb-3">
              {DIFC_DTEC_FAQS[1].question}
            </h3>
            <p className="text-sm sm:text-[15px] text-[#475569] leading-relaxed">
              {renderHighlightedFaqAnswer(DIFC_DTEC_FAQS[1].answer, [
                {
                  phrase: "interim or final shareholder dividends",
                  className: "text-[#0D1B2A] font-semibold",
                },
              ])}
            </p>
            <p className="mt-3 text-xs sm:text-sm text-[#475569]">
              Need fast certification? Explore our{" "}
              <a
                href="/dividends-audit"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/dividends-audit");
                }}
                className="text-[#1B4332] hover:text-[#143326] underline underline-offset-2 font-semibold transition-colors"
              >
                statutory dividends audit in Dubai
              </a>{" "}
              for 5-working-day statutory distributable profit sign-off.
            </p>
          </article>
        </div>
      }
      faqs={DIFC_DTEC_FAQS.slice(2).map((f) => ({ question: f.question, answer: f.answer }))}
      relatedServices={[
        { label: "Dividends Audit & Certification", path: "/dividends-audit" },
        { label: "Corporate Tax Advisory", path: "/services/corporate-tax-advisory" },
        { label: "Transfer Pricing Services", path: "/services/transfer-pricing" },
        { label: "2026 UAE Tax Calculator", path: "/uae-tax-planner" },
      ]}
      closingCta={{
        eyebrow: "DIFC & DTEC Specialist Desk",
        title: "Protect Your 0% QFZP Status Before Filing",
        description:
          "Book a confidential 15-minute review with our FTA-registered tax specialists to verify your De Minimis ratio, IFRS audit readiness, and dividend compliance.",
        ctaLabel: "Book Free Consultation",
      }}
      onNavigate={navigate}
      onOpenAudit={onOpenAudit}
      onOpenPrivacy={onOpenPrivacy}
      onOpenGooglePreferred={onOpenGooglePreferred}
    />
  );
};

export default DifcDtecAccountingPage;

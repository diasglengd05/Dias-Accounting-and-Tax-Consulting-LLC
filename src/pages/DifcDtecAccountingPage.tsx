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
  FAQSchemaItem,
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

export const DIFC_DTEC_FAQS: FAQSchemaItem[] = [
  {
    question: "What are the DIFC tax compliance and 0% QFZP rules in 2026?",
    answer:
      "Under UAE Federal Decree-Law No. 47 of 2022 and Cabinet Decision No. 55 of 2023, DIFC and DTEC entities retain 0% Corporate Tax on Qualifying Income in 2026 only when they maintain adequate Free Zone economic substance, keep non-qualifying revenue within the 5% or AED 5,000,000 de minimis cap (whichever is lower), comply with arm's-length Transfer Pricing rules, and prepare mandatory annual audited IFRS financial statements regardless of revenue.",
  },
  {
    question: "When does a Dubai or DIFC company need a statutory dividends audit?",
    answer:
      "Under UAE Commercial Companies Law (Federal Decree-Law No. 32 of 2021) and DIFC Companies Law, Dubai Mainland, DIFC, and Free Zone entities require a statutory dividends audit prior to distributing interim or final shareholder dividends to certify realized distributable profits, mandatory legal reserves, and post-distribution solvency for board resolutions and bank wire clearance.",
  },
  {
    question: "How do DIFC & DTEC entities qualify for 0% Corporate Tax under the QFZP regime?",
    answer:
      "Under Federal Decree-Law No. 47 of 2022 and Cabinet Decision No. 55 of 2023, DIFC and DTEC entities qualify for a 0% Corporate Tax rate as a Qualifying Free Zone Person (QFZP) on Qualifying Income only if they: (1) maintain adequate economic substance and qualified personnel inside the Free Zone, (2) derive Qualifying Income from qualifying activities or other Free Zone persons, (3) keep non-qualifying revenue within the de minimis limit (lower of 5% of total revenue or AED 5,000,000), (4) comply with arm's length Transfer Pricing rules, and (5) prepare annual audited IFRS financial statements.",
  },
  {
    question: "Are audited IFRS financial statements mandatory for DIFC and DTEC companies?",
    answer:
      "Yes. Maintaining and submitting annual financial statements prepared under International Financial Reporting Standards (IFRS) and audited by a UAE-licensed auditor is mandatory for DFSA-regulated DIFC entities, DTEC Free Zone license renewals, and all Qualifying Free Zone Persons (QFZPs) claiming the 0% Corporate Tax rate regardless of annual revenue.",
  },
  {
    question: "How does UAE dividend audit certification work for DIFC and holding companies?",
    answer:
      "Under UAE Federal Decree-Law No. 32 of 2021 (Commercial Companies Law) and DIFC Companies Law, companies distributing dividends must verify realized distributable profits through a statutory Dividend Audit certification before passing board resolutions. Furthermore, under Article 23 of UAE Corporate Tax Law, dividends received from qualifying UAE or foreign shareholdings (at least 5% ownership held for 12 months) are exempt from Corporate Tax under the Participation Exemption.",
  },
  {
    question: "What are the transfer pricing requirements for DIFC businesses?",
    answer:
      "Under Article 34 of the UAE Corporate Tax Law, all transactions with Related Parties and Connected Persons must satisfy the Arm's Length Principle. DIFC entities exceeding FTA thresholds must submit an annual Transfer Pricing Disclosure Form on EmaraTax and maintain Local File and Master File documentation.",
  },
  {
    question: "Why should CFOs hire certified corporate tax consultants in DIFC and DTEC?",
    answer:
      "DIFC common law entities and DTEC venture-backed companies must coordinate DFSA/DIFC reporting with Federal Tax Authority (FTA) EmaraTax compliance. Certified FTA-registered tax consultants prevent accidental 5-year QFZP disqualifications, audit de minimis ratios quarterly, and ensure seamless IFRS audit readiness.",
  },
];

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
    const canonicalPath = "/tax-planning-difc";
    const pageTitle = "DIFC & DTEC Accounting, 0% QFZP Tax & Virtual Bookkeeping | Dias UAE";
    const pageDesc =
      "Fixed-fee virtual IFRS bookkeeping, 0% QFZP Corporate Tax compliance & audit readiness for DIFC & DTEC companies in Dubai. 2x Clutch 2026 UAE Leader.";
    const pageUrl = `https://diasuae.ae${canonicalPath}`;

    applyPageSEO({
      title: pageTitle,
      description: pageDesc,
      canonicalPath,
      keywords:
        "DIFC Corporate Tax Planning, DTEC Accounting & Bookkeeping, 0% Qualifying Free Zone Person (QFZP) Compliance, DIFC Dividend Audits, 5% UAE VAT Filing",
      ogType: "website",
    });

    upsertJsonLd(
      "page-service-jsonld",
      buildServiceSchema({
        name: "DIFC & DTEC Accounting, 0% QFZP Corporate Tax & Dividend Audits",
        description: pageDesc,
        canonicalPath,
      })
    );

    upsertJsonLd("page-faq-jsonld", buildFAQPageSchema(DIFC_DTEC_FAQS, `${pageUrl}#faqs`));
    upsertJsonLd(
      "page-breadcrumb-jsonld",
      buildBreadcrumbSchema(
        [
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: "DIFC & DTEC Tax Planning", path: canonicalPath },
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

  const currentPath = "/tax-planning-difc";

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

          <div className="overflow-x-auto rounded-2xl border border-[#c5a059]/35 bg-[#070d19] text-white shadow-sm">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-[#c5a059]/25 bg-[#0d1b2a] text-xs uppercase tracking-wider">
                  <th scope="col" className="px-4 py-4 font-semibold text-slate-300">
                    Criterion
                  </th>
                  <th scope="col" className="px-4 py-4 font-semibold text-[#c5a059]">
                    0% Small Business Relief (Revenue up to AED 3M)
                  </th>
                  <th scope="col" className="px-4 py-4 font-semibold text-[#c5a059]">
                    0% Qualifying Free Zone Person (QFZP)
                  </th>
                  <th scope="col" className="px-4 py-4 font-semibold text-slate-200">
                    9% Standard UAE Corporate Tax
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-4 font-semibold text-white whitespace-nowrap">
                    Corporate Tax Rate
                  </td>
                  <td className="px-4 py-4 font-semibold text-[#c5a059]">
                    0% (Taxable income treated as AED 0)
                  </td>
                  <td className="px-4 py-4 font-semibold text-[#c5a059]">
                    0% on Qualifying Income (9% on non-qualifying)
                  </td>
                  <td className="px-4 py-4 text-slate-200">
                    0% on profit up to AED 375,000 · 9% above AED 375,000
                  </td>
                </tr>
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-4 font-semibold text-white whitespace-nowrap">
                    Revenue / Cap Rules
                  </td>
                  <td className="px-4 py-4 text-slate-200">
                    Gross revenue ≤ AED 3,000,000 per period (extended through 31 Dec 2029)
                  </td>
                  <td className="px-4 py-4 text-slate-200">
                    No total revenue cap; non-qualifying revenue ≤ lower of 5% or AED 5,000,000
                  </td>
                  <td className="px-4 py-4 text-slate-200">
                    Applies above AED 3M (non-QFZP) or for 5 tax periods after QFZP breach
                  </td>
                </tr>
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-4 font-semibold text-white whitespace-nowrap">
                    Audited IFRS Accounts
                  </td>
                  <td className="px-4 py-4 text-slate-200">
                    Simplified CT return (note: DIFC/DTEC license rules may still require audit)
                  </td>
                  <td className="px-4 py-4 font-semibold text-white">
                    Strictly mandatory annually regardless of revenue size
                  </td>
                  <td className="px-4 py-4 text-slate-200">
                    Mandatory if revenue &gt; AED 50M or required by Free Zone authority
                  </td>
                </tr>
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-4 font-semibold text-white whitespace-nowrap">
                    Substance &amp; Transfer Pricing
                  </td>
                  <td className="px-4 py-4 text-slate-200">
                    Clean IFRS books &amp; annual SBR election on EmaraTax
                  </td>
                  <td className="px-4 py-4 text-slate-200">
                    Adequate Free Zone CIGA, qualified staff, premises &amp; arm&apos;s-length OECD TP
                  </td>
                  <td className="px-4 py-4 text-slate-200">
                    Connected Person arm&apos;s-length benchmarking (Art. 36) &amp; full deductions
                  </td>
                </tr>
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-4 font-semibold text-white whitespace-nowrap">
                    Best Fit in DIFC / DTEC
                  </td>
                  <td className="px-4 py-4 text-slate-200">
                    Early-stage DTEC SaaS startups &amp; advisory practices under AED 3M revenue
                  </td>
                  <td className="px-4 py-4 text-slate-200">
                    DIFC holding companies, treasury/HQ structures &amp; B2B Free Zone firms
                  </td>
                  <td className="px-4 py-4 text-slate-200">
                    Mainland-heavy commercial revenue or companies carrying forward tax losses
                  </td>
                </tr>
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-4 font-semibold text-white whitespace-nowrap">
                    DiasUAE Retainer
                  </td>
                  <td className="px-4 py-4 font-semibold text-[#c5a059] whitespace-nowrap">
                    From AED 400/month
                  </td>
                  <td className="px-4 py-4 font-semibold text-[#c5a059] whitespace-nowrap">
                    QFZP Audit-Ready from AED 1,250/month
                  </td>
                  <td className="px-4 py-4 font-semibold text-white whitespace-nowrap">
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
          <strong className="text-white font-semibold">
            DiasUAE (Dias Accounting and Tax Consulting LLC)
          </strong>
          , led by FTA-Registered Tax Agent{" "}
          <strong className="text-[#c5a059] font-semibold">Glen Dias</strong> (SHAMS Licence{" "}
          <span className="tabular-nums">2646813.01</span>) and recognized as a 2x Clutch 2026 UAE Leader, delivers 0% Qualifying Free Zone Person (QFZP) tax compliance, virtual IFRS bookkeeping, audit-ready dossiers, and 5-working-day dividend audits. Serving Dubai Mainland, DIFC, DTEC, DMCC, IFZA, and SHAMS, we close books by the 5th business day with fixed monthly retainers starting{" "}
          <strong className="text-white font-semibold">from AED 400/month</strong>.
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
      faqsHeading="DIFC & DTEC Tax Compliance FAQs"
      customFaqSection={
        <div className="space-y-6">
          <article className="rounded-2xl bg-[#070d19] text-white border border-[#c5a059]/30 p-6 sm:p-8 shadow-sm">
            <div className="w-10 h-[2px] bg-[#c5a059] mb-4" aria-hidden="true" />
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug mb-3">
              {DIFC_DTEC_FAQS[0].question}
            </h2>
            <p className="text-sm sm:text-[15px] text-slate-200 leading-relaxed">
              Under UAE Federal Decree-Law No. 47 of 2022 and Cabinet Decision No. 55 of 2023, DIFC and DTEC entities retain <strong className="text-[#c5a059] font-semibold">0% Corporate Tax on Qualifying Income</strong> in 2026 only when they maintain adequate Free Zone economic substance, keep non-qualifying revenue within the <strong className="text-white font-semibold">5% or AED 5,000,000 de minimis cap</strong> (whichever is lower), comply with arm&apos;s-length Transfer Pricing rules, and prepare <strong className="text-white font-semibold">mandatory annual audited IFRS financial statements</strong> regardless of revenue.
            </p>
          </article>

          <article className="rounded-2xl bg-[#070d19] text-white border border-[#c5a059]/30 p-6 sm:p-8 shadow-sm">
            <div className="w-10 h-[2px] bg-[#c5a059] mb-4" aria-hidden="true" />
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug mb-3">
              {DIFC_DTEC_FAQS[1].question}
            </h2>
            <p className="text-sm sm:text-[15px] text-slate-200 leading-relaxed">
              Under UAE Commercial Companies Law (Federal Decree-Law No. 32 of 2021) and DIFC Companies Law, Dubai Mainland, DIFC, and Free Zone entities require a statutory dividends audit prior to distributing <strong className="text-white font-semibold">interim or final shareholder dividends</strong> to certify realized distributable profits, mandatory legal reserves, and post-distribution solvency for board resolutions and bank wire clearance.
            </p>
            <p className="mt-3 text-xs sm:text-sm text-slate-300">
              Need fast certification? Explore our{" "}
              <a
                href="/dividends-audit"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/dividends-audit");
                }}
                className="text-[#c5a059] hover:text-[#f5e39c] underline underline-offset-2 font-semibold transition-colors"
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

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

interface PageProps {
  onNavigate?: (path: string) => void;
  onOpenAudit?: () => void;
  onOpenPrivacy?: () => void;
  onOpenGooglePreferred?: () => void;
}

export const DIFC_DTEC_FAQS: FAQSchemaItem[] = [
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
    const pageTitle = "DIFC & DTEC Accounting & 0% QFZP Tax | Dias Accounting";
    const pageDesc =
      "FTA-Registered Tax Agents serving DIFC & DTEC companies. Statutory dividend audits, 0% QFZP Corporate Tax compliance & IFRS bookkeeping from AED 400/mo.";
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
      </div>
    </section>
  );

  return (
    <ServicePageTemplate
      currentPath={currentPath}
      breadcrumbName="DIFC & DTEC Accounting & Tax"
      eyebrow="DIFC & DTEC Compliance Practice"
      title="DIFC & DTEC Accounting, 0% QFZP & Dividend Audits"
      subtitle="Full IFRS bookkeeping, statutory interim and final dividend audits, and 0% Qualifying Free Zone Person tax compliance for financial firms in DIFC and venture-backed startups in DTEC."
      metadataStrip={[
        { label: "Qualifying Free Zone Rate", value: "0% QFZP on Qualifying Income" },
        { label: "De Minimis Ceiling", value: "Lower of 5% or AED 5,000,000" },
        { label: "Monthly Retainers", value: "Fixed Fees From AED 400 / Month" },
      ]}
      customTopSection={jurisdictionSection}
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
        plan: "Retainers from AED 400/mo | QFZP Shield Pro AED 1,499",
      }}
      faqsHeading="DIFC & DTEC Tax Compliance FAQs"
      faqs={DIFC_DTEC_FAQS.map((f) => ({ question: f.question, answer: f.answer }))}
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

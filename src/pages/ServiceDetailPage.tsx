import React, { useEffect, useMemo } from "react";
import {
  ArrowRight,
  Calculator,
  CheckCircle2,
  FileCheck,
  FileText,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { servicesData } from "../data/staticData";
import { Service } from "../types";
import {
  applyPageSEO,
  buildBreadcrumbSchema,
  buildFAQPageSchema,
  buildServiceSchema,
  removeJsonLd,
  upsertJsonLd,
} from "../lib/seo";
import ServicePageTemplate, {
  ServiceDeliverableCard,
  ServiceProcessStep,
} from "../components/hub/ServicePageTemplate";
import {
  ClutchAwardBadge,
  CLUTCH_AWARD_CAPTION,
} from "../components/ClutchBadges";
import SameDayQuoteBox from "../components/SameDayQuoteBox";
import QuickSummaryBox from "../components/QuickSummaryBox";
import TaxAgentReviewStrip from "../components/TaxAgentReviewStrip";

interface ServiceDetailPageProps {
  serviceId?: string;
  onNavigate: (path: string) => void;
  onOpenAudit?: () => void;
  onOpenPrivacy?: () => void;
  onOpenGooglePreferred?: () => void;
}

const DEFAULT_PROCESS_STEPS: ServiceProcessStep[] = [
  {
    number: "01",
    title: "Discovery & Health Check",
    description:
      "We review your trade license, historical books, and FTA registration status under strict NDA.",
  },
  {
    number: "02",
    title: "System & Ledger Setup",
    description:
      "Clean chart of accounts, automated bank feeds, and FTA tax codes configured on Zoho, Xero, or QuickBooks.",
  },
  {
    number: "03",
    title: "Execution & Filing",
    description:
      "Monthly reconciliation, statutory computation, and electronic EmaraTax submission ahead of deadline.",
  },
  {
    number: "04",
    title: "Ongoing Compliance Review",
    description:
      "Audit-ready IFRS reporting, 7-year archival, and direct partner advisory as your business scales.",
  },
];

function splitDeliverableTitle(inclusion: string): { title: string; description: string } {
  if (inclusion.length <= 46) {
    return {
      title: inclusion,
      description:
        "Prepared, verified, and documented to UAE Federal Tax Authority and IFRS statutory standards.",
    };
  }
  const parenIndex = inclusion.indexOf("(");
  if (parenIndex > 12 && parenIndex < 52) {
    return {
      title: inclusion.slice(0, parenIndex).trim(),
      description: inclusion,
    };
  }
  const words = inclusion.split(" ");
  const title = words.slice(0, 5).join(" ");
  return {
    title,
    description: inclusion,
  };
}

export const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({
  serviceId,
  onNavigate,
  onOpenAudit,
  onOpenPrivacy,
  onOpenGooglePreferred,
}) => {
  const currentService: Service = useMemo(() => {
    if (!serviceId) return servicesData[0];
    const normalized = serviceId.toLowerCase();
    if (normalized === "business-incorporation-services" || normalized.includes("incorporation")) {
      const inc = servicesData.find((s) => s.id === "business-incorporation");
      if (inc) return inc;
    }
    const found = servicesData.find(
      (s) => s.id === serviceId || s.id.toLowerCase() === normalized
    );
    return found || servicesData[0];
  }, [serviceId]);

  useEffect(() => {
    let title = `${currentService.title} in Dubai & UAE | Dias Accounting & Tax`;
    let desc = currentService.shortDesc;
    let keywords = `${currentService.title.toLowerCase()} dubai, ${currentService.title.toLowerCase()} uae, fta tax agent`;

    if (currentService.id === "corporate-tax-advisory" || serviceId?.includes("corporate-tax")) {
      title = "Corporate Tax Filing UAE | Tax Advisory Dubai | Dias UAE";
      desc =
        "Certified Corporate Tax filing services in UAE. 9% return submission on EmaraTax, Small Business Relief (AED 3M) & 0% Free Zone advisory. Book review today!";
      keywords =
        "corporate tax filing uae, tax advisory services in dubai, tax filing services uae, tax planning services in dubai, corporate tax return emaratax, small business relief 0%, fta audit defense";
    } else if (currentService.id === "accounting-bookkeeping" || serviceId?.includes("accounting")) {
      title = "Accounting Services UAE | Bookkeeping Dubai | Dias UAE";
      desc =
        "IFRS-compliant accounting services in the UAE. Dedicated senior accountants, monthly P&L reporting, bank reconciliations & software setup. Request a quote!";
      keywords =
        "accounting services uae, accounting consulting dubai, accounting service in uae, accounting solutions in uae, bookkeeping dubai, chartered accountants dubai, outsourced accounting uae";
    } else if (currentService.id === "vat-compliance" || serviceId?.includes("vat")) {
      title = "UAE VAT Compliance, Form 201 Filing & FTA Audit Support | From AED 400/Mo";
      desc =
        "5% UAE VAT registration, quarterly Form 201 returns, 2026 FTA Decision 13 input tax recovery reviews & VAT-to-Corporate-Tax reconciliation in Dubai & Sharjah.";
      keywords =
        "uae vat compliance, vat form 201 filing dubai, fta decision 13 input tax recovery, vat audit support uae, vat registration threshold aed 375000, fta voluntary disclosure 211";
    } else if (
      currentService.id === "business-incorporation" ||
      serviceId?.includes("incorporation")
    ) {
      title = "UAE Business Incorporation & Setup | Dias Accounting";
      desc =
        "100% foreign ownership company formation in Dubai Mainland (DET) and UAE Free Zones (SHAMS, DMCC, IFZA, DTEC) with Day-1 Corporate Tax registration.";
      keywords =
        "business incorporation services uae, company setup dubai, free zone company formation, mainland DET incorporation, shams company setup";
    } else if (currentService.id === "corporate-tax-advisory") {
      title = "UAE Corporate Tax Advisory & Filing | Dias Accounting";
      desc =
        "FTA-Registered Corporate Tax advisory in Dubai & Sharjah. EmaraTax registration, 9% returns, 0% Small Business Relief up to AED 3M & QFZP compliance.";
    } else if (currentService.id === "accounting-bookkeeping") {
      title = "IFRS Accounting & Bookkeeping UAE | Dias Accounting";
      desc =
        "Fixed-fee IFRS double-entry bookkeeping in Dubai & Sharjah from AED 400/mo on Zoho Books, Xero, QuickBooks & Wafeq with monthly management reports.";
    } else if (currentService.id === "auditing-assurance") {
      title = "UAE Statutory Auditing & Assurance | Dias Accounting";
      desc =
        "Approved statutory audit coordination for Dubai Mainland and Free Zones (DIFC, DMCC, SHAMS, IFZA, DTEC), QFZP 0% verification, and IFRS compliance.";
    } else if (currentService.id === "backlog-accounting") {
      title = "Backlog Accounting Cleanup Dubai | Dias Accounting";
      desc =
        "Fast multi-year backlog accounting and ledger reconstruction in Dubai & UAE. Clean IFRS financial statements for overdue Corporate Tax & VAT filings.";
    } else if (currentService.id === "transfer-pricing") {
      title = "UAE Transfer Pricing Advisory & Filing | Dias Accounting";
      desc =
        "UAE Transfer Pricing Local File, Master File, OECD benchmarking, Connected Persons reviews, and EmaraTax TP Disclosure Forms under Decree-Law No. 47.";
    } else if (currentService.id === "aml-goaml-compliance") {
      title = "UAE AML & goAML Compliance Advisory | Dias Accounting";
      desc =
        "UAE FIU goAML registration, KYC/CDD frameworks, and annual AML risk assessments for DNFBPs, real estate brokerages, and corporate service providers.";
    } else if (currentService.id === "cfo-advisory") {
      title = "Outsourced CFO Advisory Dubai & UAE | Dias Accounting";
      desc =
        "Fractional CFO advisory for UAE SMEs and corporate groups: cash flow forecasting, board reporting, QFZP tax governance, and audit-ready financials.";
    }

    const canonicalPath = `/services/${currentService.id}`;
    const canonicalUrl = `https://diasuae.ae${canonicalPath}`;

    applyPageSEO({
      title,
      description: desc,
      canonicalPath,
      keywords,
      ogType: "website",
    });

    upsertJsonLd(
      "page-service-jsonld",
      buildServiceSchema({
        name: currentService.title,
        description: desc,
        canonicalPath,
      })
    );

    upsertJsonLd(
      "page-breadcrumb-jsonld",
      buildBreadcrumbSchema(
        [
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: currentService.title, path: canonicalPath },
        ],
        `${canonicalUrl}#breadcrumb`
      )
    );

    window.scrollTo({ top: 0, behavior: "instant" });
    return () => {
      removeJsonLd("page-service-jsonld");
      removeJsonLd("page-breadcrumb-jsonld");
    };
  }, [currentService, serviceId]);

  const serviceMeta = useMemo(() => {
    switch (currentService.id) {
      case "accounting-bookkeeping":
        return {
          idealFor: "UAE Startups, SMEs & Free Zone Companies",
          turnaround: "Monthly Close by the 5th Business Day",
          compliance: "Full IFRS & UAE Commercial Law",
          law: "Federal Decree-Law No. 32 of 2021 & IFRS",
          authority: "Ministry of Economy & Federal Tax Authority",
          timeline: "Monthly 5th-day closing & live cloud ledger feeds",
          pricingTier: "Monthly retainers from AED 400 / month",
        };
      case "corporate-tax-advisory":
        return {
          idealFor: "Mainland LLCs, Free Zone QFZPs & SMEs",
          turnaround: "Returns Filed 30 Days Ahead of Deadline",
          compliance: "Decree-Law No. 47 · EmaraTax Ready",
          law: "Federal Decree-Law No. 47 of 2022 (Corporate Tax)",
          authority: "Federal Tax Authority (FTA EmaraTax)",
          timeline: "Return & payment due within 9 months of tax period end",
          pricingTier: "Included in retainers from AED 400 / month",
        };
      case "vat-compliance":
        return {
          idealFor: "VAT-Registered Trading, Service & E-Commerce Firms",
          turnaround: "Quarterly / Monthly Form 201 Before 28th",
          compliance: "Decree-Law No. 8 · Form 201 & 211",
          law: "Federal Decree-Law No. 8 of 2017 (UAE VAT)",
          authority: "Federal Tax Authority (Form VAT 201)",
          timeline: "Due by the 28th day following period close",
          pricingTier: "Fixed monthly retainers starting from AED 400/month",
        };
      case "auditing-assurance":
        return {
          idealFor: "DMCC, DIFC, IFZA, SHAMS & Mainland Companies",
          turnaround: "7 to 14 Business Days Audit Readiness",
          compliance: "ISA & IFRS Audit Standards",
          law: "International Standards on Auditing (ISA) & CCL",
          authority: "Mainland DET & UAE Free Zone Authorities",
          timeline: "Annual audit submission upon license renewal",
          pricingTier: "Scoped fixed-fee or Enterprise CFO plan",
        };
      case "aml-goaml-compliance":
        return {
          idealFor: "Real Estate, Precious Metals & DNFBP Entities",
          turnaround: "5 to 10 Business Days Policy & goAML Setup",
          compliance: "Decree-Law No. 20 · UAE FIU goAML",
          law: "Federal Decree-Law No. 20 of 2018 & Cabinet Decision 10/2019",
          authority: "UAE Financial Intelligence Unit (FIU) & MoE",
          timeline: "Mandatory goAML registration & annual risk assessment",
          pricingTier: "Custom DNFBP compliance retainer",
        };
      case "backlog-accounting":
        return {
          idealFor: "Entities With Unreconciled Historical Books",
          turnaround: "5 to 7 Business Days Per Financial Year",
          compliance: "IFRS Audit-Ready Opening Balances",
          law: "Article 26 Commercial Companies Law & CT Record Rules",
          authority: "Federal Tax Authority & External Auditors",
          timeline: "Fast-track 5 to 14 business days reconstruction",
          pricingTier: "Single FY from AED 2,500 | 2 FYs from AED 4,800",
        };
      case "transfer-pricing":
        return {
          idealFor: "Multi-Entity Groups & Connected Person Structures",
          turnaround: "10 to 15 Business Days Study & Disclosure",
          compliance: "Ministerial Decision 97 · OECD Guidelines",
          law: "Ministerial Decision No. 97 of 2023 & Article 34",
          authority: "Federal Tax Authority (EmaraTax TP Disclosure)",
          timeline: "Disclosure with CT return; Local/Master file within 30 days",
          pricingTier: "Custom Transfer Pricing study engagement",
        };
      case "business-incorporation":
        return {
          idealFor: "Founders Launching Mainland or Free Zone Entities",
          turnaround: "24 to 48 Hours Trade License Issuance",
          compliance: "100% Foreign Ownership · Tax-Ready Setup",
          law: "Federal Decree-Law No. 32 of 2021 & Free Zone Rules",
          authority: "Dubai DET & SHAMS / DMCC / IFZA / DTEC",
          timeline: "24–48 hour license issuance & bank onboarding",
          pricingTier: "Turnkey setup packages from AED 5,750",
        };
      case "cfo-advisory":
        return {
          idealFor: "Scaling SMEs, Corporate Groups & Funded Ventures",
          turnaround: "Monthly Board Pack & Bi-Weekly Strategy Reviews",
          compliance: "Investor-Grade IFRS & Cash Flow Controls",
          law: "IFRS Financial Governance & Corporate Reporting",
          authority: "Board of Directors, UAE Banks & Investors",
          timeline: "Monthly executive close & rolling 12-month forecasts",
          pricingTier: "Included in Enterprise & CFO (from AED 1,000 / mo)",
        };
      default:
        return {
          idealFor: "UAE Mainland & Free Zone Businesses",
          turnaround: "Rapid Fixed-Scope Onboarding",
          compliance: "FTA-Registered & IFRS Compliant",
          law: "UAE Federal Tax & Corporate Regulations",
          authority: "Federal Tax Authority & Ministry of Economy",
          timeline: "Per statutory compliance schedule",
          pricingTier: "Fixed-fee retainers from AED 400 / month",
        };
    }
  }, [currentService.id]);

  const serviceFaqs = useMemo(() => {
    switch (currentService.id) {
      case "accounting-bookkeeping":
        return [
          {
            question: "What cloud accounting software does Dias support for bookkeeping?",
            answer:
              "We are certified advisors for Zoho Books, QuickBooks Online, Xero Cloud, and Wafeq. We set up automated bank statement feeds, a tailored chart of accounts, and compliant bilingual UAE tax invoice templates.",
          },
          {
            question: "Is bookkeeping included in Dias Accounting's monthly retainers?",
            answer:
              "Yes. Every monthly retainer includes double-entry IFRS bookkeeping, monthly bank and card reconciliations, and monthly Balance Sheet and Profit & Loss statements at fixed rates starting from AED 400/month billed annually.",
          },
          {
            question: "Do Free Zone companies need to maintain IFRS accounting books?",
            answer:
              "Yes. Both the UAE Commercial Companies Law and UAE Corporate Tax Law require Mainland and Free Zone entities to maintain proper accounting records for at least 5 to 7 years.",
          },
        ];
      case "corporate-tax-advisory":
        return [
          {
            question: "Can my company claim 0% Small Business Relief (SBR)?",
            answer:
              "Yes, if your company's gross revenue is AED 3,000,000 or less in the relevant and prior tax periods under Ministerial Decision No. 73 of 2023 (extended through December 31, 2029). When elected on EmaraTax, taxable profit is treated as AED 0.",
          },
          {
            question: "When must the UAE Corporate Tax return be filed?",
            answer:
              "The annual Corporate Tax return and payment must be submitted via the FTA EmaraTax portal within 9 months following the end of your financial tax period.",
          },
          {
            question: "How can Free Zone entities qualify for 0% Corporate Tax?",
            answer:
              "A Qualifying Free Zone Person (QFZP) must maintain adequate UAE economic substance, derive Qualifying Income within the De Minimis threshold (lower of 5% or AED 5M), prepare audited IFRS financial statements, and comply with arm's-length Transfer Pricing rules.",
          },
        ];
      case "vat-compliance":
        return [
          {
            question: "What is the threshold for mandatory UAE VAT registration?",
            answer:
              "VAT registration is mandatory when taxable supplies and imports exceed AED 375,000 in the previous 12 months or are expected to exceed that threshold in the next 30 days. Voluntary registration starts at AED 187,500.",
          },
          {
            question: "Can I reclaim VAT paid on commercial expenses and supplier invoices?",
            answer:
              "Yes. Input VAT paid on legitimate business expenses such as commercial rent, utilities, software, and professional fees is recoverable on Form VAT 201 when backed by a compliant UAE Tax Invoice.",
          },
          {
            question: "What are the penalties for late VAT return filing?",
            answer:
              "The FTA imposes an AED 1,000 administrative penalty for the first late return, rising to AED 2,000 for repeated delays within 24 months, alongside late payment surcharges.",
          },
        ];
      case "backlog-accounting":
        return [
          {
            question: "How fast can Dias complete multi-year backlog accounting?",
            answer:
              "Our reconstruction team typically completes one full financial year within 5 to 7 business days, and two to three historical years within 10 to 14 business days.",
          },
          {
            question: "What documents are required to start historical ledger reconstruction?",
            answer:
              "We require your trade license copy, PDF or Excel bank statements for the relevant periods, and available sales invoices, supplier bills, and payroll summaries.",
          },
          {
            question: "Will the reconstructed books be accepted for Corporate Tax filing?",
            answer:
              "Yes. All backlog financial statements are prepared in strict accordance with IFRS standards and are audit-defensible for FTA EmaraTax submission.",
          },
        ];
      default:
        return [
          {
            question: `How do I get started with ${currentService.title}?`,
            answer:
              "Book a confidential 15-minute consultation with our FTA-registered team. We conduct an initial compliance review and share a fixed-fee engagement scope within 2 business hours.",
          },
          {
            question: "Is the initial advisory consultation confidential?",
            answer:
              "Yes. All client discussions and financial documents are handled under strict NDA protocols and led directly by Glen Dias, Managing Partner & FTA-Registered Tax Agent.",
          },
        ];
    }
  }, [currentService]);

  const featuredAeoFaq = useMemo(() => {
    if (currentService.id === "vat-compliance") {
      return {
        question: "What is included in 5% UAE VAT compliance services at Dias Accounting?",
        answer:
          "DiasUAE's (Dias Accounting and Tax Consulting LLC) 5% UAE VAT compliance services include FTA TRN registration, quarterly Form 201 return filing, 2026 FTA Decision 13 input tax recovery reviews, tax invoice compliance audits, and VAT-to-Corporate-Tax ledger reconciliation, bundled inside transparent fixed monthly retainers starting from AED 400/month with zero hourly surprises.",
      };
    }
    if (currentService.id === "corporate-tax-advisory") {
      return {
        question: "How does Dias Accounting help UAE companies reduce 9% Corporate Tax legally in 2026?",
        answer:
          "Dias Accounting legally reduces 9% UAE Corporate Tax in 2026 through 0% Small Business Relief elections (revenue up to AED 3,000,000), 0% Qualifying Free Zone Person (QFZP) structuring, arm's-length Connected Person salary optimization, full IFRS expense substantiation, and AED 10,000 late-registration penalty waiver filings.",
      };
    }
    return null;
  }, [currentService.id]);

  useEffect(() => {
    const schemaFaqs = featuredAeoFaq ? [featuredAeoFaq, ...serviceFaqs] : serviceFaqs;
    if (schemaFaqs.length > 0) {
      upsertJsonLd(
        "page-faq-jsonld",
        buildFAQPageSchema(schemaFaqs, `https://diasuae.ae/services/${currentService.id}#faqs`)
      );
    } else {
      removeJsonLd("page-faq-jsonld");
    }
    return () => {
      removeJsonLd("page-faq-jsonld");
    };
  }, [currentService.id, featuredAeoFaq, serviceFaqs]);

  const deliverableIcons = [
    <ShieldCheck className="w-5 h-5" key="shield" />,
    <FileCheck className="w-5 h-5" key="filecheck" />,
    <Calculator className="w-5 h-5" key="calc" />,
    <Scale className="w-5 h-5" key="scale" />,
    <FileText className="w-5 h-5" key="filetext" />,
    <CheckCircle2 className="w-5 h-5" key="check" />,
  ];

  const deliverableCards: ServiceDeliverableCard[] = currentService.inclusions.map((inc, idx) => {
    const parsed = splitDeliverableTitle(inc);
    return {
      title: parsed.title,
      description: parsed.description,
      icon: deliverableIcons[idx % deliverableIcons.length],
    };
  });

  const relatedServices = servicesData
    .filter((s) => s.id !== currentService.id)
    .slice(0, 4)
    .map((s) => ({ label: s.title, path: `/services/${s.id}` }));

  const heroH1 = useMemo(() => {
    switch (currentService.id) {
      case "vat-compliance":
        return "UAE 5% VAT Compliance, Form 201 Filing & FTA Audit Support";
      case "corporate-tax-advisory":
        return "9% UAE Corporate Tax Advisory, Registration & EmaraTax Filing";
      case "accounting-bookkeeping":
        return "Monthly IFRS Accounting & Bookkeeping Services in Dubai & UAE";
      default:
        return currentService.title;
    }
  }, [currentService.id, currentService.title]);

  return (
    <ServicePageTemplate
      currentPath={`/services/${currentService.id}`}
      breadcrumbName={currentService.title}
      eyebrow="FTA-Registered Practice · Dubai & UAE"
      title={heroH1}
      quickSummary={
        currentService.id === "vat-compliance" ? (
          <QuickSummaryBox>
            <strong className="text-white font-semibold">
              DiasUAE (Dias Accounting and Tax Consulting LLC)
            </strong>
            , led by FTA-Registered Tax Agent{" "}
            <strong className="text-[#c5a059] font-semibold">Glen Dias</strong> (SHAMS Licence{" "}
            <span className="tabular-nums">2646813.01</span>) and recognized as a 2x Clutch 2026 UAE Leader, delivers 5% UAE VAT TRN registration, quarterly Form 201 filings, 2026 FTA Decision 13 input tax recovery reviews, and FTA audit defense. Serving Dubai Mainland, DIFC, DTEC, DMCC, IFZA, and SHAMS, we deliver same-week TRN onboarding and pre-28th VAT returns inside fixed-fee monthly retainers starting{" "}
            <strong className="text-white font-semibold">from AED 400/month</strong>.
          </QuickSummaryBox>
        ) : undefined
      }
      subtitle={currentService.longDesc}
      metadataStrip={[
        { label: "Ideal For", value: serviceMeta.idealFor },
        { label: "Typical Turnaround", value: serviceMeta.turnaround },
        { label: "Compliance Standard", value: serviceMeta.compliance },
      ]}
      deliverablesHeading={`What's Included in ${currentService.title}`}
      deliverablesSubheading="Every deliverable is prepared by senior UAE chartered accountants and verified against current Federal Tax Authority regulations."
      deliverables={deliverableCards}
      heroBottomSlot={
        currentService.id === "vat-compliance" ? (
          <SameDayQuoteBox
            idPrefix="vat-quote"
            defaultJurisdiction="Dubai Mainland"
            defaultService="5% VAT Compliance"
          />
        ) : undefined
      }
      bottomAttributionSlot={
        currentService.id === "vat-compliance" ||
        currentService.id === "corporate-tax-advisory" ? (
          <TaxAgentReviewStrip />
        ) : undefined
      }
      customTopSection={
        currentService.id === "vat-compliance" ? (
          <>
            {/* Dedicated Corporate Growth VAT Package Section */}
            <section
              aria-label="Monthly Accounting and Quarterly 5% VAT Form 201 Packages"
              className="bg-[#0d1b2a] border-b border-[#c5a059]/30 py-14 lg:py-16 text-white"
            >
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                  <div className="max-w-3xl space-y-3">
                    <span className="inline-block text-xs font-semibold uppercase tracking-[0.14em] text-[#c5a059]">
                      Corporate Growth Package · Most Popular for UAE SMEs
                    </span>
                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug">
                      Monthly Accounting &amp; Quarterly 5% VAT Form 201 Packages (Corporate Growth)
                    </h2>
                    <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-[68ch]">
                      Stop paying separate fees for monthly bookkeeping, quarterly VAT filings, and annual Corporate Tax returns. DiasUAE&apos;s{" "}
                      <strong className="text-white font-semibold">Corporate Growth</strong> package bundles full monthly IFRS accounting, EmaraTax Form VAT 201 filing, VAT-to-Corporate-Tax reconciliation, and FTA audit-ready documentation for one fixed monthly fee.
                    </p>
                  </div>
                  <a
                    href="/pricing"
                    onClick={(e) => {
                      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                      e.preventDefault();
                      onNavigate("/pricing");
                    }}
                    className="min-h-[46px] px-6 py-3 rounded-xl bg-[#c5a059] hover:bg-[#b58f47] text-[#070d19] font-semibold text-sm inline-flex items-center justify-center gap-2 transition-colors shrink-0 whitespace-nowrap"
                  >
                    <span>Explore Corporate Growth Pricing</span>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="rounded-2xl bg-[#070d19] border border-[#c5a059]/30 p-6 space-y-2.5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#c5a059]">
                      Strict 28-Day Filing Deadlines
                    </span>
                    <h3 className="font-display text-lg font-bold text-white">
                      Pre-28th Form VAT 201 Submission
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      Every quarterly or monthly UAE VAT Form 201 return and EmaraTax payment must be settled within{" "}
                      <strong className="text-white font-semibold">28 days</strong> of the tax period end. We close ledgers early and reconcile Emirate-wise output VAT, Reverse Charge (Box 3/10), and supplier TRNs ahead of the deadline.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#070d19] border border-[#c5a059]/30 p-6 space-y-2.5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#c5a059]">
                      Penalty Protection
                    </span>
                    <h3 className="font-display text-lg font-bold text-white">
                      14% p.a. Late-Payment Penalty Avoidance
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      Late VAT payments trigger up to{" "}
                      <strong className="text-white font-semibold">14% per annum</strong> compounding late-payment penalties on top of AED 1,000–2,000 late filing fines. Monthly IFRS tracking gives you exact VAT payable forecasts weeks before due dates.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#070d19] border border-[#c5a059]/30 p-6 space-y-2.5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#c5a059]">
                      Statutory Cutoff · Dec 31, 2026
                    </span>
                    <h3 className="font-display text-lg font-bold text-white">
                      Dec 31, 2026 Box 14 VAT Credit Recovery
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      Businesses carrying unclaimed excess input VAT credits face critical{" "}
                      <strong className="text-white font-semibold">December 31, 2026 Box 14 VAT credit recovery</strong> cutoffs. Our FTA-Registered Tax Agents audit historical tax invoices and execute compliant refund or offset claims before credits lapse.
                    </p>
                  </div>
                </div>

                <div className="pt-1 text-sm text-slate-300">
                  Ready to consolidate your monthly books and quarterly VAT?{" "}
                  <a
                    href="/pricing"
                    onClick={(e) => {
                      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                      e.preventDefault();
                      onNavigate("/pricing");
                    }}
                    className="text-[#c5a059] hover:text-[#e6c884] font-semibold underline underline-offset-4 transition-colors"
                  >
                    Compare Corporate Growth &amp; Business Starter packages on our Pricing page →
                  </a>
                </div>
              </div>
            </section>

            <section
              aria-label="2026 UAE VAT Compliance Checklist"
              className="bg-[#070d19] border-b border-[#c5a059]/25 py-14 lg:py-20 text-white"
            >
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                <div className="max-w-3xl space-y-2.5">
                  <span className="inline-block text-xs font-semibold uppercase tracking-[0.14em] text-[#c5a059]">
                    Federal Decree-Law No. 8 of 2017 · 2026 FTA Standards
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    2026 UAE VAT Compliance Checklist
                  </h2>
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-[65ch]">
                    Key statutory thresholds, Form 201 submission deadlines, 2026 FTA Decision 13 input tax rules, and audit-defense controls managed end-to-end by our FTA-Registered Tax Agents from AED 400/month.
                  </p>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-[#c5a059]/30 bg-[#0d1b2a] shadow-sm">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-[#c5a059]/25 bg-[#070d19]/80 text-xs uppercase tracking-wider text-[#c5a059]">
                        <th scope="col" className="px-5 py-4 font-semibold">Compliance Area</th>
                        <th scope="col" className="px-5 py-4 font-semibold">2026 Statutory Rule</th>
                        <th scope="col" className="px-5 py-4 font-semibold">Key Threshold / Penalty</th>
                        <th scope="col" className="px-5 py-4 font-semibold">DiasUAE Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      <tr className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-5 py-4 font-semibold text-white whitespace-nowrap">
                          Registration Threshold
                        </td>
                        <td className="px-5 py-4 text-slate-300 leading-relaxed">
                          Mandatory when taxable supplies and imports exceed AED 375,000 over the prior 12 months or projected next 30 days; voluntary at AED 187,500.
                        </td>
                        <td className="px-5 py-4 font-semibold text-[#c5a059] whitespace-nowrap">
                          AED 375,000 · AED 10,000 Late Fine
                        </td>
                        <td className="px-5 py-4 text-slate-200 leading-relaxed">
                          Monthly turnover monitoring and same-week EmaraTax TRN registration.
                        </td>
                      </tr>
                      <tr className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-5 py-4 font-semibold text-white whitespace-nowrap">
                          Quarterly Form 201 Deadlines
                        </td>
                        <td className="px-5 py-4 text-slate-300 leading-relaxed">
                          VAT Form 201 return filing and tax settlement due by the 28th day following the end of each assigned quarterly or monthly tax period.
                        </td>
                        <td className="px-5 py-4 font-semibold text-[#c5a059] whitespace-nowrap">
                          28th of Following Month · 14% p.a. Late Fee
                        </td>
                        <td className="px-5 py-4 text-slate-200 leading-relaxed">
                          Emirates-wise sales mapping, RCM Box 3/10 reconciliation, and pre-deadline filing.
                        </td>
                      </tr>
                      <tr className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-5 py-4 font-semibold text-white whitespace-nowrap">
                          2026 Input VAT &amp; Box 14 Recovery
                        </td>
                        <td className="px-5 py-4 text-slate-300 leading-relaxed">
                          Strict FTA Decision 13 tax invoice verification, supplier TRN validation, and Dec 31, 2026 Box 14 VAT credit recovery deadline compliance.
                        </td>
                        <td className="px-5 py-4 font-semibold text-[#c5a059] whitespace-nowrap">
                          100% Tax Invoice &amp; Dec 31, 2026 Cutoff
                        </td>
                        <td className="px-5 py-4 text-slate-200 leading-relaxed">
                          Line-by-line input VAT audit before every return to maximize lawful refunds.
                        </td>
                      </tr>
                      <tr className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-5 py-4 font-semibold text-white whitespace-nowrap">
                          FTA Audit Defense
                        </td>
                        <td className="px-5 py-4 text-slate-300 leading-relaxed">
                          Mandatory 5–7 year archival of IFRS ledgers, Voluntary Disclosures (Form 211) for historical corrections, and VAT-to-Corporate-Tax revenue tie-out.
                        </td>
                        <td className="px-5 py-4 font-semibold text-[#c5a059] whitespace-nowrap">
                          FAF Audit File &amp; Form 211 Ready
                        </td>
                        <td className="px-5 py-4 text-slate-200 leading-relaxed">
                          Direct FTA-Registered Tax Agent representation led by Glen Dias and penalty reconsideration support.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </>
        ) : currentService.id === "corporate-tax-advisory" ? (
          <section
            aria-label="Small Business Corporate Tax Filing and AED 10,000 Penalty Waiver"
            className="bg-[#070d19] border-b border-[#c5a059]/30 py-14 lg:py-20 text-white"
          >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                <div className="max-w-3xl space-y-3">
                  <span className="inline-block text-xs font-semibold uppercase tracking-[0.14em] text-[#c5a059]">
                    Business Starter Package · From AED 400/Month · MD 131/2026
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug">
                    Small Business Corporate Tax Filing &amp; AED 10,000 Penalty Waiver (Business Starter)
                  </h2>
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-[68ch]">
                    Protect your UAE Free Zone or Mainland company from automatic FTA fines while keeping your Corporate Tax rate at 0% legally. DiasUAE&apos;s{" "}
                    <strong className="text-white font-semibold">Business Starter</strong> package (from AED 400/month) combines monthly IFRS bookkeeping with EmaraTax Corporate Tax registration, timely first-return filing, and 0% Small Business Relief elections.
                  </p>
                </div>
                <a
                  href="/pricing"
                  onClick={(e) => {
                    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                    e.preventDefault();
                    onNavigate("/pricing");
                  }}
                  className="min-h-[46px] px-6 py-3 rounded-xl bg-[#c5a059] hover:bg-[#b58f47] text-[#070d19] font-semibold text-sm inline-flex items-center justify-center gap-2 transition-colors shrink-0 whitespace-nowrap"
                >
                  <span>View Business Starter Pricing</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="rounded-2xl bg-[#0d1b2a] border border-[#c5a059]/30 p-6 space-y-2.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#c5a059]">
                    FTA Decision No. 3 of 2024
                  </span>
                  <h3 className="font-display text-lg font-bold text-white">
                    3-Month Corporate Tax Registration Rule
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Every newly incorporated UAE Mainland or Free Zone entity must submit its EmaraTax Corporate Tax registration within{" "}
                    <strong className="text-white font-semibold">3 months</strong> of trade licence issuance to avoid the automatic AED 10,000 administrative penalty.
                  </p>
                </div>

                <div className="rounded-2xl bg-[#0d1b2a] border border-[#c5a059]/30 p-6 space-y-2.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#c5a059]">
                    FTA Penalty Waiver Initiative
                  </span>
                  <h3 className="font-display text-lg font-bold text-white">
                    7-Month First-Return Waiver Window
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Missed the registration deadline? Under the FTA waiver initiative, filing your first Corporate Tax return (or annual declaration) within{" "}
                    <strong className="text-white font-semibold">7 months</strong> of your first tax period end qualifies your company to waive or credit back the{" "}
                    <strong className="text-[#c5a059] font-semibold">AED 10,000</strong> late-registration penalty.
                  </p>
                </div>

                <div className="rounded-2xl bg-[#0d1b2a] border border-[#c5a059]/30 p-6 space-y-2.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#c5a059]">
                    Ministerial Decision No. 131 of 2026
                  </span>
                  <h3 className="font-display text-lg font-bold text-white">
                    Small Business Relief Extended to Dec 31, 2029
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    UAE resident businesses with annual gross revenue up to{" "}
                    <strong className="text-white font-semibold">AED 3,000,000</strong> can elect{" "}
                    <strong className="text-[#c5a059] font-semibold">0% Small Business Relief</strong> on their EmaraTax return for tax periods ending on or before{" "}
                    <strong className="text-white font-semibold">December 31, 2029</strong>—bundled into our Business Starter retainer.
                  </p>
                </div>
              </div>

              <div className="pt-1 text-sm text-slate-300">
                Looking for fixed-fee monthly IFRS bookkeeping + EmaraTax filing?{" "}
                <a
                  href="/pricing"
                  onClick={(e) => {
                    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                    e.preventDefault();
                    onNavigate("/pricing");
                  }}
                  className="text-[#c5a059] hover:text-[#e6c884] font-semibold underline underline-offset-4 transition-colors"
                >
                  Start Business Starter (from AED 400/mo) or upgrade to Corporate Growth on our Pricing page →
                </a>
              </div>
            </div>
          </section>
        ) : currentService.id === "cfo-advisory" ? (
          <section
            aria-label="2026 Clutch Financial Forecasting and Risk Advisory Award Recognition"
            className="bg-[#F8FAFC] border-b border-[#E2E8F0] py-10 lg:py-12"
          >
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 shadow-xs">
                <ClutchAwardBadge />
                <div className="space-y-1.5">
                  <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#856422]">
                    2026 Clutch Awards · Financial Forecasting &amp; Risk Advisory
                  </span>
                  <h2 className="font-display text-lg sm:text-xl font-bold text-[#0D1B2A] tracking-tight">
                    Top Financial Forecast &amp; Financial Risk Advisory Consultants — UAE 2026
                  </h2>
                  <p className="text-sm sm:text-base text-[#475569] leading-[1.65] max-w-[65ch]">
                    {CLUTCH_AWARD_CAPTION} Our Fractional CFO &amp; Financial Advisory desk delivers rolling 13-week cash-flow forecasts, financial risk controls, investor-grade three-statement IFRS models, and UAE Corporate Tax scenario planning for Mainland and Free Zone leadership teams.
                  </p>
                </div>
              </div>
            </div>
          </section>
        ) : undefined
      }
      processHeading="How We Work"
      processSubheading="A structured 4-step engagement built for clean handoffs, predictable timelines, and zero FTA penalties."
      processSteps={DEFAULT_PROCESS_STEPS}
      whoIsItForHeading="Key Outcomes & Who This Is For"
      whoIsItForSubheading="Designed for UAE Mainland and Free Zone businesses seeking accurate financial visibility and penalty-free regulatory standing."
      whoIsItForItems={currentService.benefits}
      regulatorySnapshot={{
        law: serviceMeta.law,
        authority: serviceMeta.authority,
        deadline: currentService.regulatoryDeadlines || serviceMeta.timeline,
        plan: serviceMeta.pricingTier,
      }}
      faqsHeading={`Questions About ${currentService.title}`}
      customFaqSection={
        featuredAeoFaq ? (
          <article className="rounded-2xl bg-[#070d19] text-white border border-[#c5a059]/35 p-6 sm:p-8 shadow-sm">
            <div className="w-10 h-[2px] bg-[#c5a059] mb-4" aria-hidden="true" />
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug mb-3">
              {featuredAeoFaq.question}
            </h2>
            <p className="text-sm sm:text-[15px] text-slate-200 leading-relaxed">
              {featuredAeoFaq.answer}
            </p>
          </article>
        ) : undefined
      }
      faqs={serviceFaqs}
      relatedServices={relatedServices}
      closingCta={{
        eyebrow: "Direct Partner Advisory",
        title: `Ready to Streamline Your ${currentService.title}?`,
        description:
          "Book a confidential 15-minute review with Glen Dias, FTA-Registered Tax Agent, for a clear fixed-fee scope and compliance timeline.",
        ctaLabel: "Book Free Consultation",
      }}
      onNavigate={onNavigate}
      onOpenAudit={onOpenAudit}
      onOpenPrivacy={onOpenPrivacy}
      onOpenGooglePreferred={onOpenGooglePreferred}
    />
  );
};

export default ServiceDetailPage;

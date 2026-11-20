/**
 * Strategic Internal Linking Graph for UAE Corporate Tax, VAT & IFRS Bookkeeping clusters.
 * Keeps every resource card concise (max 3 links per page) with descriptive UAE tax anchor text.
 */

export interface RelatedResourceItem {
  eyebrow: string;
  title: string;
  description: string;
  anchorLabel: string;
  path: string;
}

const RESOURCE_CATALOG = {
  corporateTaxService: {
    eyebrow: "Advisory Practice",
    title: "UAE Corporate Tax Registration & Filing",
    description:
      "EmaraTax registration, 9% return preparation, and 0% Free Zone QFZP compliance by FTA-Registered Tax Agents.",
    anchorLabel: "Explore UAE Corporate Tax Services",
    path: "/services/corporate-tax-advisory",
  },
  taxCalculator: {
    eyebrow: "Interactive Tool",
    title: "2026 UAE Corporate Tax & VAT Calculator",
    description:
      "Model your 9% tax bracket, AED 3M Small Business Relief eligibility, Free Zone de minimis ratio, and 5% VAT recovery.",
    anchorLabel: "Launch 2026 UAE Tax Calculator",
    path: "/uae-tax-planner",
  },
  sbrHub: {
    eyebrow: "0% Tax Relief",
    title: "Small Business Tax Relief (AED 3M)",
    description:
      "Article 21 election rules extended through 2029 for UAE resident businesses under AED 3,000,000 gross revenue.",
    anchorLabel: "Check Small Business Relief Rules",
    path: "/small-business-tax-relief",
  },
  vatService: {
    eyebrow: "Advisory Practice",
    title: "UAE 5% VAT Filing & FTA Audit Support",
    description:
      "TRN registration, quarterly Form 201 returns, blocked input VAT checks, and Form 211 Voluntary Disclosures.",
    anchorLabel: "Explore UAE VAT Compliance Services",
    path: "/services/vat-compliance",
  },
  vatHub: {
    eyebrow: "Compliance Hub",
    title: "UAE 5% VAT Hub & Form 201 Planner",
    description:
      "AED 375,000 mandatory threshold checks, recoverable input VAT schedules, and quarterly EmaraTax filing rules.",
    anchorLabel: "Open UAE VAT Compliance Hub",
    path: "/uae-vat-calculator",
  },
  bookkeepingService: {
    eyebrow: "Monthly Retainers",
    title: "Fixed-Fee IFRS Accounting & Bookkeeping",
    description:
      "Monthly double-entry ledgers on Zoho Books, Xero, QuickBooks, and Wafeq with 5th-day management reports.",
    anchorLabel: "Explore IFRS Bookkeeping Services",
    path: "/services/accounting-bookkeeping",
  },
  backlogService: {
    eyebrow: "Ledger Cleanup",
    title: "Backlog Accounting & Audit Readiness",
    description:
      "Reconstruct multi-year unrecorded bank statements and invoices into audit-defensible IFRS financial statements.",
    anchorLabel: "Explore Backlog Accounting Cleanup",
    path: "/services/backlog-accounting",
  },
  pricing: {
    eyebrow: "Fixed-Fee Schedule",
    title: "UAE Accounting & Tax Retainer Pricing",
    description:
      "Transparent monthly bookkeeping, VAT Form 201, and annual Corporate Tax retainers starting from AED 400/month.",
    anchorLabel: "Compare Fixed-Fee Tax Packages",
    path: "/pricing",
  },
  deadlinesHub: {
    eyebrow: "Filing Calendar",
    title: "2026 FTA Tax Deadlines & Penalties",
    description:
      "Calculate your 9-month Corporate Tax filing window, quarterly VAT 201 due dates, and 7-month penalty waiver rules.",
    anchorLabel: "Check 2026 FTA Filing Deadlines",
    path: "/fta-deadlines",
  },
  difcDtec: {
    eyebrow: "Free Zone Practice",
    title: "DIFC & DTEC Accounting & 0% QFZP Tax",
    description:
      "DFSA/DIFC common-law IFRS reporting, DTEC startup books, and annual 0% Qualifying Free Zone Person audits.",
    anchorLabel: "Explore DIFC & DTEC Tax Services",
    path: "/tax-planning-difc",
  },
  dividendsAudit: {
    eyebrow: "Statutory Assurance",
    title: "UAE Statutory Dividend Audits",
    description:
      "Distributable profit verification under Commercial Companies Law and 0% Participation Exemption compliance.",
    anchorLabel: "Explore Dividend Audit Services",
    path: "/dividends-audit",
  },
  companySetup: {
    eyebrow: "Formation Desk",
    title: "UAE Mainland & Free Zone Company Setup",
    description:
      "SHAMS, IFZA, DMCC, and Dubai Mainland DET licensing structured for Day-1 EmaraTax Corporate Tax readiness.",
    anchorLabel: "Explore UAE Company Setup",
    path: "/company-setup",
  },
  transferPricing: {
    eyebrow: "Group Compliance",
    title: "UAE Transfer Pricing Documentation",
    description:
      "OECD arm's-length benchmarking, Connected Persons remuneration studies, and EmaraTax TP Disclosure Forms.",
    anchorLabel: "Explore Transfer Pricing Advisory",
    path: "/services/transfer-pricing",
  },
  auditingService: {
    eyebrow: "Statutory Audits",
    title: "UAE Statutory Auditing & Assurance",
    description:
      "Approved external audit coordination for Free Zone license renewals, QFZP compliance, and AED 50M+ entities.",
    anchorLabel: "Explore Statutory Audit Services",
    path: "/services/auditing-assurance",
  },
  corporateTaxArticle: {
    eyebrow: "FTA Briefing",
    title: "2026 UAE Corporate Tax & SBR Guide",
    description:
      "Detailed analysis of 9% brackets, Small Business Relief elections through 2029, and the AED 10,000 penalty waiver.",
    anchorLabel: "Read 2026 Corporate Tax Briefing",
    path: "/blog/uae-corporate-tax-2026-sbr-relief-penalty-shield-guide",
  },
  vatChecklistArticle: {
    eyebrow: "FTA Briefing",
    title: "UAE SME & Free Zone VAT Checklist",
    description:
      "Actionable guidance on compliant tax invoices, input VAT recovery rules, and eliminating Form 201 audit triggers.",
    anchorLabel: "Read UAE VAT Compliance Checklist",
    path: "/blog/vat-compliance-checklist",
  },
} as const satisfies Record<string, RelatedResourceItem>;

/**
 * Returns up to 3 strategically clustered internal links for any service page,
 * tax hub, calculator, or blog article. Never links back to the current path.
 */
export function getRelatedResourcesForPath(
  currentPath: string,
  topicHint?: string
): RelatedResourceItem[] {
  const clean = (currentPath || "/").toLowerCase().replace(/\/+$/, "") || "/";
  const hint = (topicHint || "").toLowerCase();

  let candidates: RelatedResourceItem[];

  if (clean === "/services/corporate-tax-advisory") {
    candidates = [
      RESOURCE_CATALOG.taxCalculator,
      RESOURCE_CATALOG.sbrHub,
      RESOURCE_CATALOG.pricing,
    ];
  } else if (clean === "/small-business-tax-relief") {
    candidates = [
      RESOURCE_CATALOG.taxCalculator,
      RESOURCE_CATALOG.corporateTaxService,
      RESOURCE_CATALOG.pricing,
    ];
  } else if (clean === "/services/vat-compliance") {
    candidates = [
      RESOURCE_CATALOG.vatHub,
      RESOURCE_CATALOG.bookkeepingService,
      RESOURCE_CATALOG.pricing,
    ];
  } else if (clean === "/uae-vat-calculator") {
    candidates = [
      RESOURCE_CATALOG.vatService,
      RESOURCE_CATALOG.bookkeepingService,
      RESOURCE_CATALOG.pricing,
    ];
  } else if (clean === "/services/accounting-bookkeeping") {
    candidates = [
      RESOURCE_CATALOG.pricing,
      RESOURCE_CATALOG.corporateTaxService,
      RESOURCE_CATALOG.vatService,
    ];
  } else if (clean === "/services/backlog-accounting") {
    candidates = [
      RESOURCE_CATALOG.bookkeepingService,
      RESOURCE_CATALOG.corporateTaxService,
      RESOURCE_CATALOG.pricing,
    ];
  } else if (clean === "/tax-planning-difc" || clean === "/difc-dtec-accounting") {
    candidates = [
      RESOURCE_CATALOG.corporateTaxService,
      RESOURCE_CATALOG.dividendsAudit,
      RESOURCE_CATALOG.taxCalculator,
    ];
  } else if (clean === "/dividends-audit") {
    candidates = [
      RESOURCE_CATALOG.auditingService,
      RESOURCE_CATALOG.difcDtec,
      RESOURCE_CATALOG.corporateTaxService,
    ];
  } else if (clean === "/services/auditing-assurance") {
    candidates = [
      RESOURCE_CATALOG.dividendsAudit,
      RESOURCE_CATALOG.difcDtec,
      RESOURCE_CATALOG.bookkeepingService,
    ];
  } else if (clean === "/services/transfer-pricing") {
    candidates = [
      RESOURCE_CATALOG.corporateTaxService,
      RESOURCE_CATALOG.difcDtec,
      RESOURCE_CATALOG.taxCalculator,
    ];
  } else if (clean === "/services/aml-goaml-compliance") {
    candidates = [
      RESOURCE_CATALOG.corporateTaxService,
      RESOURCE_CATALOG.auditingService,
      RESOURCE_CATALOG.pricing,
    ];
  } else if (clean === "/services/cfo-advisory") {
    candidates = [
      RESOURCE_CATALOG.bookkeepingService,
      RESOURCE_CATALOG.corporateTaxService,
      RESOURCE_CATALOG.pricing,
    ];
  } else if (clean === "/services/business-incorporation" || clean === "/company-setup") {
    candidates = [
      RESOURCE_CATALOG.corporateTaxService,
      RESOURCE_CATALOG.bookkeepingService,
      RESOURCE_CATALOG.pricing,
    ];
  } else if (clean === "/fta-deadlines") {
    candidates = [
      RESOURCE_CATALOG.taxCalculator,
      RESOURCE_CATALOG.corporateTaxService,
      RESOURCE_CATALOG.vatService,
    ];
  } else if (clean === "/uae-tax-planner") {
    candidates = [
      RESOURCE_CATALOG.corporateTaxService,
      RESOURCE_CATALOG.vatService,
      RESOURCE_CATALOG.pricing,
    ];
  } else if (clean.startsWith("/blog/")) {
    if (
      hint.includes("vat") ||
      hint.includes("e-invoicing") ||
      hint.includes("peppol") ||
      hint.includes("bookkeeping") ||
      hint.includes("spreadsheet")
    ) {
      candidates = [
        RESOURCE_CATALOG.vatService,
        RESOURCE_CATALOG.bookkeepingService,
        RESOURCE_CATALOG.pricing,
      ];
    } else if (hint.includes("difc") || hint.includes("dtec") || hint.includes("dividend")) {
      candidates = [
        RESOURCE_CATALOG.difcDtec,
        RESOURCE_CATALOG.dividendsAudit,
        RESOURCE_CATALOG.taxCalculator,
      ];
    } else if (hint.includes("formation") || hint.includes("incorporation") || hint.includes("jurisdiction")) {
      candidates = [
        RESOURCE_CATALOG.companySetup,
        RESOURCE_CATALOG.corporateTaxService,
        RESOURCE_CATALOG.pricing,
      ];
    } else if (hint.includes("pricing")) {
      candidates = [
        RESOURCE_CATALOG.pricing,
        RESOURCE_CATALOG.bookkeepingService,
        RESOURCE_CATALOG.taxCalculator,
      ];
    } else {
      // Corporate Tax & Regulatory Updates cluster
      candidates = [
        RESOURCE_CATALOG.corporateTaxService,
        RESOURCE_CATALOG.taxCalculator,
        RESOURCE_CATALOG.pricing,
      ];
    }
  } else {
    candidates = [
      RESOURCE_CATALOG.corporateTaxService,
      RESOURCE_CATALOG.taxCalculator,
      RESOURCE_CATALOG.pricing,
    ];
  }

  return candidates.filter((item) => item.path !== clean).slice(0, 3);
}

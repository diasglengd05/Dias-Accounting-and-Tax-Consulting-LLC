import type { FAQSchemaItem } from "../lib/seo";

/**
 * Single source of truth for page-level FAQs shared verbatim between:
 *  1. Visible React FAQ sections (featured cards + accordions)
 *  2. Client-side JSON-LD FAQPage injection (upsertJsonLd)
 *  3. Build-time SSG pre-rendering (src/lib/ssrRouteMeta.ts -> scripts/prerender.mjs)
 *  4. Server-side crawler fallback (server/metaPrerender.ts)
 *
 * Keeping every question and answer in one module guarantees 100% parity
 * between visible page copy and Schema.org FAQPage structured data.
 */

export const DIVIDENDS_FEATURED_FAQ: FAQSchemaItem = {
  question:
    "When is a statutory dividends audit required in Dubai, DIFC, or UAE Free Zones?",
  answer:
    "A statutory dividends audit is required whenever a Dubai Mainland, DIFC, or UAE Free Zone company distributes interim or final dividends, verifying realized distributable profits and 10% legal reserves under UAE Commercial Companies Law, confirming post-payout solvency for UAE banks, and protecting 0% Corporate Tax compliance.",
};

export const DIVIDENDS_ACCORDION_FAQS: FAQSchemaItem[] = [
  {
    question: "How fast is a statutory dividends audit in Dubai & UAE?",
    answer:
      "A statutory interim or final dividends audit in Dubai Mainland, DIFC, DTEC, DMCC, IFZA, or SHAMS typically takes 5 working days with DiasUAE (Dias Accounting and Tax Consulting LLC): Day 1 covers ledger and 10% statutory reserve verification, Days 2–3 complete IFRS solvency and working-capital testing, and Days 4–5 deliver the signed statutory audit report and bank clearance certificate.",
  },
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

export const ALL_DIVIDEND_SCHEMA_FAQS: FAQSchemaItem[] = [
  DIVIDENDS_FEATURED_FAQ,
  ...DIVIDENDS_ACCORDION_FAQS,
];

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

export const VAT_COMPLIANCE_FEATURED_FAQ: FAQSchemaItem = {
  question: "What is included in 5% UAE VAT compliance services at Dias Accounting?",
  answer:
    "DiasUAE's (Dias Accounting and Tax Consulting LLC) 5% UAE VAT compliance services include FTA TRN registration, quarterly Form 201 return filing, 2026 FTA Decision 13 input tax recovery reviews, tax invoice compliance audits, and VAT-to-Corporate-Tax ledger reconciliation, bundled inside transparent fixed monthly retainers starting from AED 400/month with zero hourly surprises.",
};

export const VAT_COMPLIANCE_ACCORDION_FAQS: FAQSchemaItem[] = [
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

export const ALL_VAT_COMPLIANCE_SCHEMA_FAQS: FAQSchemaItem[] = [
  VAT_COMPLIANCE_FEATURED_FAQ,
  ...VAT_COMPLIANCE_ACCORDION_FAQS,
];

export const CORPORATE_TAX_FEATURED_FAQ: FAQSchemaItem = {
  question: "How does Dias Accounting help UAE companies reduce 9% Corporate Tax legally in 2026?",
  answer:
    "Dias Accounting legally reduces 9% UAE Corporate Tax in 2026 through 0% Small Business Relief elections (revenue up to AED 3,000,000), 0% Qualifying Free Zone Person (QFZP) structuring, arm's-length Connected Person salary optimization, full IFRS expense substantiation, and AED 10,000 late-registration penalty waiver filings.",
};

export const CORPORATE_TAX_ACCORDION_FAQS: FAQSchemaItem[] = [
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

export const ALL_CORPORATE_TAX_SCHEMA_FAQS: FAQSchemaItem[] = [
  CORPORATE_TAX_FEATURED_FAQ,
  ...CORPORATE_TAX_ACCORDION_FAQS,
];

export function getServiceDetailFaqParts(
  serviceId: string,
  serviceTitle: string
): {
  featuredFaq: FAQSchemaItem | null;
  accordionFaqs: FAQSchemaItem[];
  allFaqs: FAQSchemaItem[];
} {
  switch (serviceId) {
    case "vat-compliance":
      return {
        featuredFaq: VAT_COMPLIANCE_FEATURED_FAQ,
        accordionFaqs: VAT_COMPLIANCE_ACCORDION_FAQS,
        allFaqs: ALL_VAT_COMPLIANCE_SCHEMA_FAQS,
      };
    case "corporate-tax-advisory":
      return {
        featuredFaq: CORPORATE_TAX_FEATURED_FAQ,
        accordionFaqs: CORPORATE_TAX_ACCORDION_FAQS,
        allFaqs: ALL_CORPORATE_TAX_SCHEMA_FAQS,
      };
    case "accounting-bookkeeping": {
      const accordionFaqs: FAQSchemaItem[] = [
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
      return { featuredFaq: null, accordionFaqs, allFaqs: accordionFaqs };
    }
    case "backlog-accounting": {
      const accordionFaqs: FAQSchemaItem[] = [
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
      return { featuredFaq: null, accordionFaqs, allFaqs: accordionFaqs };
    }
    default: {
      const accordionFaqs: FAQSchemaItem[] = [
        {
          question: `How do I get started with ${serviceTitle}?`,
          answer:
            "Book a confidential 15-minute consultation with our FTA-registered team. We conduct an initial compliance review and share a fixed-fee engagement scope within 2 business hours.",
        },
        {
          question: "Is the initial advisory consultation confidential?",
          answer:
            "Yes. All client discussions and financial documents are handled under strict NDA protocols and led directly by Glen Dias, Managing Partner & FTA-Registered Tax Agent.",
        },
      ];
      return { featuredFaq: null, accordionFaqs, allFaqs: accordionFaqs };
    }
  }
}

export function getServiceDetailFaqs(serviceId: string, serviceTitle: string): FAQSchemaItem[] {
  return getServiceDetailFaqParts(serviceId, serviceTitle).allFaqs;
}

/**
 * Single Source of Truth for Dias Accounting & Tax Consulting LLC SEO Entity Data.
 * All business facts here match verified visible content on diasuae.ae.
 */

export const SITE_URL = "https://diasuae.ae";
export const SITE_NAME = "Dias Accounting & Tax Consulting";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;
export const DEFAULT_OG_IMAGE_WIDTH = "1200";
export const DEFAULT_OG_IMAGE_HEIGHT = "630";
export const DEFAULT_OG_IMAGE_ALT =
  "Dias Accounting & Tax Consulting — UAE Corporate Tax, VAT & Fixed-Fee IFRS Accounting";

export const BUSINESS_ENTITY = {
  id: `${SITE_URL}/#organization`,
  websiteId: `${SITE_URL}/#website`,
  founderId: `${SITE_URL}/#glendias`,
  name: "Dias Accounting and Tax Consulting LLC",
  legalName: "Dias Accounting and Tax Consulting LLC",
  shortName: "Dias Accounting",
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/favicon.ico`,
  image: DEFAULT_OG_IMAGE,
  description:
    "FTA-Registered Tax Agency and Chartered Accounting firm in Dubai and Sharjah (SHAMS) led by FTA-Registered Tax Agent Glen Dias. Fixed-fee monthly IFRS bookkeeping, 5% UAE VAT Form 201 returns, 9% Corporate Tax filings, 0% Small Business Relief (SBR) & 0% QFZP compliance, and statutory dividend audits starting from AED 400/month.",
  telephone: "+971-52-922-6958",
  email: "info@diasuae.ae",
  priceRange: "AED 400 - AED 2,500 / month",
  currenciesAccepted: "AED",
  address: {
    streetAddress: "Sharjah Media City (SHAMS), Al Messaned",
    addressLocality: "Sharjah",
    addressRegion: "Sharjah",
    postalCode: "515000",
    postOfficeBoxNumber: "P.O. Box 515000",
    addressCountry: "AE",
  },
  geo: {
    latitude: 25.2788,
    longitude: 55.6626,
  },
  openingHours: [
    {
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    {
      dayOfWeek: ["Saturday"],
      opens: "10:00",
      closes: "14:00",
    },
  ],
  areaServed: [
    { "@type": "City", name: "Dubai" },
    { "@type": "City", name: "Sharjah" },
    { "@type": "Place", name: "DIFC (Dubai International Financial Centre)" },
    { "@type": "Place", name: "DTEC (Dubai Technology Entrepreneur Campus)" },
    { "@type": "Place", name: "Sharjah Media City (SHAMS)" },
    { "@type": "Country", name: "United Arab Emirates" },
  ],
  aggregateRating: {
    ratingValue: "5.0",
    reviewCount: "48",
    bestRating: "5",
    worstRating: "1",
  },
  founder: {
    name: "Glen Dias",
    jobTitle: "FTA-Registered Tax Agent",
    sameAs: ["https://www.linkedin.com/company/diasaccounting/"],
  },
  award: [
    "Top Financial Risk Advisory Consultants Company - United Arab Emirates 2026 (Clutch)",
    "Top Financial Forecast Consultants Company - United Arab Emirates 2026 (Clutch)",
  ],
  sameAs: [
    // TODO: Replace "your-exact-clutch-slug" with your verified Clutch profile URL slug
    "https://clutch.co/profile/your-exact-clutch-slug",
    "https://www.linkedin.com/company/diasaccounting/",
    "https://insights.diasuae.ae/",
    "https://wa.me/971529226958",
  ],
  offerCatalog: [
    {
      name: "UAE Corporate Tax Advisory & EmaraTax Filing",
      description:
        "Corporate Tax registration, 9% return preparation, 0% Small Business Relief elections up to AED 3M, and Free Zone QFZP compliance.",
      url: `${SITE_URL}/services/corporate-tax-advisory`,
    },
    {
      name: "UAE 5% VAT Compliance & Form 201 Filing",
      description:
        "VAT TRN registration, quarterly Form 201 submissions, input VAT recovery audits, Voluntary Disclosures (Form 211), and FTA audit support.",
      url: `${SITE_URL}/services/vat-compliance`,
    },
    {
      name: "Fixed-Fee IFRS Accounting & Bookkeeping",
      description:
        "Monthly double-entry IFRS bookkeeping on Zoho Books, Xero, QuickBooks, and Wafeq starting from AED 400/month.",
      url: `${SITE_URL}/services/accounting-bookkeeping`,
    },
    {
      name: "DIFC & DTEC Accounting and 0% QFZP Tax",
      description:
        "Common-law IFRS financial reporting, QFZP economic substance verification, and de minimis compliance for DIFC and DTEC entities.",
      url: `${SITE_URL}/tax-planning-difc`,
    },
    {
      name: "Statutory Dividend Audit & Assurance",
      description:
        "Interim and final distributable profit verification and statutory financial audits for UAE Mainland and Free Zone companies.",
      url: `${SITE_URL}/dividends-audit`,
    },
    {
      name: "Backlog Accounting & Ledger Reconstruction",
      description:
        "Multi-year historical bookkeeping cleanup, bank reconciliations, and IFRS opening balances for overdue UAE tax filings.",
      url: `${SITE_URL}/services/backlog-accounting`,
    },
    {
      name: "UAE Company Setup & Day-1 Tax Registration",
      description:
        "Mainland DET and Free Zone (SHAMS, IFZA, DMCC, DTEC) company incorporation with EmaraTax Corporate Tax registration.",
      url: `${SITE_URL}/company-setup`,
    },
  ],
} as const;

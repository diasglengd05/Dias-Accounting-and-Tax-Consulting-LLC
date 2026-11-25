import { BlogPost } from "../types";

const draftAuthor = {
  name: "Glen Dias",
  role: "FTA Registered Tax Agent",
  avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=120",
};

export const draftPlaceholderPosts: BlogPost[] = [
  {
    id: "draft-vat-registration-checklist",
    title: "The Complete UAE VAT Registration Checklist for Growing Businesses",
    summary:
      "Understand mandatory (AED 375k) vs voluntary (AED 187.5k) VAT thresholds, required corporate documentation, and how to avoid the AED 10,000 late registration fine.",
    date: "Upcoming Article",
    readTime: "Outline Draft",
    tag: "VAT",
    author: draftAuthor,
    content: `## Executive Overview

### 1. The Two Statutory Thresholds
- Mandatory registration threshold: Taxable supplies and imports exceeding AED 375,000 over the prior 12 months or projected in next 30 days.
- Voluntary registration threshold: Taxable supplies, imports, or business expenses exceeding AED 187,500.

### 2. Documents Required for FTA EmaraTax VAT Registration
- Valid UAE Commercial Trade License, Certificate of Incorporation, and Memorandum of Association (MOA).
- Passport and Emirates ID copies of authorized managers and signatories.
- Historical 12-month sales turnover spreadsheet with supporting bank statements and sample sales invoices.
- Projected 30-day turnover forecast and business model summary.

### 3. Common VAT Registration Pitfalls & Administrative Fines
- The mandatory AED 10,000 late registration penalty under Cabinet Decision No. 40 of 2017.
- Failure to account for reverse charge VAT on imported foreign digital services and SaaS software subscriptions.

### 4. Action Plan & Support
- Contact Dias Accounting for complete, penalty-free VAT registration and quarterly Form 201 return filings.`,
  },
  {
    id: "draft-backlog-bookkeeping-penalty-shield",
    title: "Why Catching Up on Backlog Bookkeeping Saves You Thousands in FTA Penalties",
    summary:
      "Unrecorded transactions and missing bank reconciliations create compounding tax risks. Learn how reconstructing historical books shields your UAE entity from fines.",
    date: "Upcoming Article",
    readTime: "Outline Draft",
    tag: "Bookkeeping",
    author: draftAuthor,
    content: `## Executive Overview

### 1. The Compounding Risks of Delayed Books
- Unmaintained accounting ledgers lead to missed Corporate Tax and VAT filing deadlines, triggering compounding administrative fines.
- UAE Commercial Companies Law mandates retention of proper books of accounts for a minimum of 5 years (and 7 years under Tax Law).

### 2. The Backlog Reconstruction Workflow
- Extracting 12 to 36 months of bank statements, credit cards, and payment gateway logs (Stripe, Amazon, Noon).
- Resolving suspense balances, unrecorded expenses, director loans, and historical tax invoices.
- Preparing certified opening balance sheets and trial balances formatted for statutory audit.

### 3. Strategic Benefits of a Cleaned-Up Ledger
- Maximizing legitimate tax-deductible commercial expenses under UAE Corporate Tax Law.
- Smooth commercial license renewals and seamless banking KYC and credit facility reviews.

### 4. Fixed-Fee Solutions
- Dias Accounting provides fixed-fee historical Backlog Catch-Up packages starting at AED 2,500 per fiscal year.`,
  },
];

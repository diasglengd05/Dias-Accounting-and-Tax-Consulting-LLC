import { Service, BlogPost, PricingTier } from "../types";

export const servicesData: Service[] = [
  {
    id: "accounting-bookkeeping",
    title: "Accounting & Bookkeeping",
    iconName: "Calculator",
    shortDesc: "Complete financial record keeping, reconciliation, and reporting compliant with IFRS standards.",
    longDesc: "Dias Accounting provides robust accounting and bookkeeping solutions designed to keep your business's financial health in perfect order. Our expert services ensure full compliance with the UAE's federal regulations and international standard accounting methodologies (IFRS).",
    inclusions: [
      "Dedicated, certified Senior Accountant",
      "Monthly financial reports (Profit & Loss, Balance Sheet, Cash Flow)",
      "Bank, credit card, and corporate wallet reconciliation",
      "Accounts Payable & Receivable tracking and management",
      "Fixed Assets Registry maintenance and depreciation schedules",
      "Regular monthly strategic advisory and financial health meetings"
    ],
    regulatoryDeadlines: "Monthly or quarterly closure reports, prepared in audit-ready format.",
    benefits: [
      "Complete peace of mind to focus on scaling your business operations",
      "Accurate, audit-ready financial records and statements",
      "Timely tracking of profitability and real-time cash flow visibility",
      "Full compliance with the UAE Commercial Companies Law requirements"
    ]
  },
  {
    id: "corporate-tax-advisory",
    title: "Corporate Tax Advisory",
    iconName: "TrendingUp",
    shortDesc: "Comprehensive strategy, registration, compliance, and optimization for the 9% UAE Corporate Tax.",
    longDesc: "With the introduction of the 9% Federal Corporate Tax on businesses in the UAE, proper tax planning is more critical than ever. Dias Accounting provides expert guidance to structure your transactions, determine corporate tax liabilities, register your business, and submit timely tax returns.",
    inclusions: [
      "Corporate Tax registration with the Federal Tax Authority (FTA) via EmaraTax",
      "Detailed Corporate Tax impact assessment & structural advisory",
      "Transfer Pricing (TP) policy analysis and documentation",
      "Exemption and relief optimization (including Small Business Relief up to AED 3M)",
      "Qualifying Free Zone Person (QFZP) 0% treaty eligibility assessments",
      "Preparation, verification, and timely filing of annual Corporate Tax returns"
    ],
    regulatoryDeadlines: "Corporate Tax returns and payment must be submitted within 9 months from the end of the tax period.",
    benefits: [
      "Legally optimized tax structure minimizing overall corporate liability",
      "Protection from substantial non-filing or late-registration penalties",
      "Maximum utilization of tax groups, transfer benefits, and Free Zone perks",
      "Audit-defensible tax positioning supported by official legislative references"
    ]
  },
  {
    id: "vat-compliance",
    title: "VAT Compliance",
    iconName: "Percent",
    shortDesc: "Hassle-free VAT registration, quarterly filing, and optimization to ensure absolute FTA compliance.",
    longDesc: "The UAE's 5% Value Added Tax (VAT) demands precise transaction classification, invoice compliance, and timely tax returns. We manage your end-to-end VAT cycle to guarantee compliance, maximize legal input tax recovery, and avoid severe FTA penalties.",
    inclusions: [
      "End-to-end VAT Registration and Deregistration with the FTA",
      "Quarterly or monthly VAT return preparation and electronic filing",
      "Comprehensive tax invoice auditing (compliance checks on formatting and data)",
      "Input VAT recovery optimization to claim back every eligible dirham",
      "Assistance with VAT voluntary disclosures and refund applications",
      "Representation during FTA audits and preparation of required documentation"
    ],
    regulatoryDeadlines: "VAT returns and payments are due within 28 days following the end of the tax period.",
    benefits: [
      "Mitigate risk of severe administrative penalties from the FTA",
      "Boost corporate cash flow by unlocking hidden, unclaimed input tax",
      "Flawless handling of reverse charge mechanisms on imported services",
      "Accurate categorization of standard, zero-rated, and exempt supplies"
    ]
  },
  {
    id: "business-incorporation",
    title: "Business Incorporation",
    iconName: "Building",
    shortDesc: "End-to-end setup of your corporate entity in UAE Mainland, Free Zones, or Offshore.",
    longDesc: "Launching a business in the UAE offers incredible potential but requires navigating complex legal steps. Dias Accounting streamlines this entire process, handling licensing, documentation, and compliance structures so you start your journey on solid ground.",
    inclusions: [
      "Mainland, Free Zone, or Offshore jurisdiction feasibility study",
      "DED Trade Name Reservation and Initial Approvals processing",
      "Drafting and notarization of Memorandum of Association (MOA)",
      "Establishment Card processing and corporate visa assistance",
      "Corporate bank account opening guidance at top UAE banks",
      "Corporate structure alignment with immediate tax and AML regulations"
    ],
    regulatoryDeadlines: "Annual commercial license renewal is required by the specific licensing authority.",
    benefits: [
      "100% compliant company structure from day one, ready for audits",
      "Fast-tracked registrations through our direct government liaisons",
      "Optimized choosing of freezones to maximize corporate tax advantages",
      "Complete transparency with custom pricing and zero hidden registration fees"
    ]
  }
];

export const blogsData: BlogPost[] = [
  {
    id: "uae-corporate-tax-guide",
    title: "Understanding UAE Corporate Tax: A Comprehensive Guide for SMEs",
    summary: "Learn the fundamentals of the new 9% corporate tax regime, including the AED 375,000 threshold, exemptions, and Small Business Relief eligibility.",
    content: `With the UAE Federal Corporate Tax now active, small and medium enterprises (SMEs) are stepping into a new era of financial compliance. While tax regulations can seem daunting, understanding the key thresholds and exemptions can turn compliance into a strategic advantage.

### 1. What is the UAE Corporate Tax Rate?
The UAE imposes a standard corporate tax rate of **9%** on taxable income. However, to support small businesses and startups, the tax is structured progressively:
*   **0%** on taxable income up to and including **AED 375,000**.
*   **9%** on taxable income exceeding **AED 375,000**.

This means that if your business makes AED 400,000 in net taxable profit, you will only pay 9% on the excess amount (AED 25,000), resulting in a tax of just AED 2,250!

### 2. What is Small Business Relief (SBR)?
To foster entrepreneurial growth, the Ministry of Finance introduced Small Business Relief. Under this program, UAE resident taxable persons with gross revenue of **AED 3,000,000 or less** in a tax period can elect to be treated as having "no taxable income." 
*   **Eligible Periods:** Available for tax periods starting on or after June 1, 2023, and ending on or before December 31, 2026.
*   **Action Required:** This relief is not automatic; businesses must actively claim SBR in their annual Corporate Tax return.
*   **Requirement:** Standard Transfer Pricing documentation is simplified, though basic compliance and record-keeping remain mandatory.

### 3. Registration Deadlines
All taxable entities (including Free Zone companies) **MUST** register for Corporate Tax. Failure to submit a registration application within the timelines designated by the FTA can lead to an administrative penalty of **AED 10,000**.
*   Deadlines are generally assigned based on the month of your commercial license issuance.
*   We strongly recommend registering immediately to avoid the rush and potential system delays.

### Summary Checklist for SMEs:
1.  **Determine your Tax Year:** Typically matches your calendar year (Jan 1 - Dec 31).
2.  **Organize Bookkeeping:** You must maintain proper financial ledgers for at least 7 years.
3.  **Initiate FTA Registration:** Apply via the EmaraTax portal.
4.  **Evaluate Small Business Relief:** Determine if your revenue stays under AED 3 million.

*At Dias Accounting, we guide you through Corporate Tax registration, impact assessments, and annual filings so you can stay fully compliant while maximizing legal reliefs.*`,
    date: "July 2, 2026",
    readTime: "5 min read",
    tag: "Corporate Tax",
    author: {
      name: "Glen Dias",
      role: "Managing Director",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=120"
    }
  },
  {
    id: "vat-compliance-checklist",
    title: "The Ultimate VAT Compliance Checklist for UAE Businesses",
    summary: "Avoid severe FTA fines. Review our actionable checklist covering tax invoices, output VAT, input VAT recoveries, and record keeping rules.",
    content: `Since its implementation in 2018, the UAE Value Added Tax (VAT) of 5% has been a standard element of business. However, the Federal Tax Authority (FTA) has recently increased audits and strict penalties for clerical mistakes. 

Review this comprehensive checklist to ensure your business remains fully compliant.

### 1. Tax Invoice Requirements
Are your invoices legally compliant? A valid Tax Invoice in the UAE must contain specific details. Omitting these is one of the most common audit failures:
*   The words **"Tax Invoice"** clearly displayed.
*   Name, address, and Tax Registration Number (TRN) of the supplier.
*   Name, address, and TRN of the recipient (mandatory for invoices exceeding AED 10,000).
*   A unique sequential invoice number and date of issue.
*   Description, quantity, price per unit, and VAT rate applied to each item.
*   Total gross amount, VAT amount, and net amount payable in UAE Dirham (AED).

### 2. Input VAT Recovery Rules
Recovering VAT on business expenses is a great way to boost cash flow, but you can only claim back input VAT if:
*   The expense was incurred for making taxable supplies.
*   You hold a valid Tax Invoice addressed to your company name.
*   The payment has been settled or is intended to be settled within 6 months.
*   *Warning:* VAT on entertainment expenses (meals, accommodation for clients/non-employees) and private motor vehicle expenses is generally **blocked** from recovery.

### 3. Record Keeping Mandates
Under Federal Decree-Law on VAT, businesses must keep comprehensive records for at least **5 years** (15 years for real estate records):
*   All issued and received tax invoices, credit notes, and debit notes.
*   Customs declarations and import documents (such as Bill of Lading, Airway Bill).
*   Inventory books, general ledgers, and bank statements detailing transaction values.
*   Accounts showing Output VAT payable and Input VAT recoverable.

### 4. Filing Frequency and Deadlines
Most UAE businesses file VAT returns quarterly, but high-revenue companies may be requested to file monthly.
*   **Filing Deadline:** The 28th day following the end of your tax period.
*   *Crucial Rule:* Both your VAT Return submission and full payment must reach the FTA's bank account before the deadline. Late payment penalties accrue dynamically, so wire funds early.

*Dias Accounting manages your monthly reconciliation and prepares tax-compliant returns, ensuring you never pay a single dirham in penalties.*`,
    date: "June 18, 2026",
    readTime: "4 min read",
    tag: "VAT Compliance",
    author: {
      name: "Glen Dias",
      role: "Senior Tax Consultant",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=120"
    }
  },
  {
    id: "choosing-uae-jurisdiction",
    title: "Choosing the Right Business Jurisdiction: Mainland vs. Free Zone",
    summary: "Evaluating corporate tax implications, ownership structures, commercial flexibility, and costs to make the perfect launch decision.",
    content: `Setting up a new business in the UAE is an exciting venture. The country offers two main corporate jurisdictions: **Mainland** and **Free Zones**. 

With the UAE's new Corporate Tax regulations now in effect, this decision has direct tax implications, beyond standard operational factors. Here is an objective comparison to guide your strategy.

### 1. Ownership & Control
*   **Free Zone:** Offers 100% foreign ownership of the company from day one, without needing local sponsors.
*   **Mainland:** Historically required a local partner holding 51% shares. Under recent commercial company reforms, 100% foreign ownership is now permitted for over 1,000 industrial and commercial activities, though some strategic sectors still require UAE national participation.

### 2. Geographical Scope & Trading Freedom
*   **Free Zone:** Businesses are legally restricted to trading within their specific Free Zone, with other Free Zones, or internationally. To sell goods or services directly in UAE Mainland, you must employ a Mainland distributor or open a separate Mainland branch.
*   **Mainland:** Offers complete freedom to trade with any corporate entity or individual anywhere inside or outside the UAE, with zero geographic limitations. Ideal for retail, local distribution, and direct government contracting.

### 3. Corporate Tax Implications
*   **Mainland:** Subject to the standard corporate tax of 9% on profits above AED 375,000.
*   **Free Zone:** Free Zone Companies can qualify for a **0% Corporate Tax rate** if they maintain the status of a **Qualifying Free Zone Person (QFZP)**. This requires:
    1.  Maintaining adequate "substance" in the UAE (local office, local employees, physical operations).
    2.  Earning "Qualifying Income" (transactions with other Free Zone persons, or certain specified financial/holding activities).
    3.  Complying with Transfer Pricing rules and preparing audited financial statements.

### Comparison Summary Matrix:

| Feature | UAE Mainland | UAE Free Zone |
| :--- | :--- | :--- |
| **Trade within UAE** | Unlimited | Restricted (requires agent/branch) |
| **0% Corporate Tax** | No (Standard 9% applies) | Yes (If conditions for QFZP are met) |
| **Audited Accounts** | Encouraged (Required for CT) | Mandatory in most Free Zones |
| **Physical Office** | Mandatory (min. size applies) | Flexible (flexi-desk options allowed) |

*Dias Accounting specializes in corporate setups. We don't just register your company; we architect a legal structure designed to optimize your ongoing tax position, saving you money and hassle down the road.*`,
    date: "May 29, 2026",
    readTime: "6 min read",
    tag: "Incorporation",
    author: {
      name: "Michael Chen",
      role: "Corporate Services Director",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120"
    }
  }
];

export const pricingTiers: PricingTier[] = [
  {
    id: "starter",
    name: "Business Starter",
    price: "500",
    annualPrice: "5,000",
    period: "month",
    description: "Essential accounting, bookkeeping, and basic compliance for growing startups and small companies.",
    features: [
      "Up to 50 transactions per month",
      "Monthly ledger reconciliation",
      "Standard Profit & Loss & Balance Sheet reports",
      "Dedicated Associate Accountant support",
      "Basic Corporate Tax registration support",
      "Software license integration (Zoho/Wafeq)"
    ]
  },
  {
    id: "growth",
    name: "Corporate Growth",
    price: "800",
    annualPrice: "8,000",
    period: "month",
    description: "Full-service accounting, proactive tax management, and quarterly VAT compliance for scaling businesses.",
    features: [
      "Up to 200 transactions per month",
      "Weekly ledger updates and reconciliation",
      "Quarterly VAT return preparation and filing",
      "Dedicated Senior Tax Accountant",
      "Corporate Tax impact assessments & structuring",
      "Custom monthly management dashboard & analysis",
      "Unlimited email and phone support",
      "Free audit-representation insurance"
    ],
    popular: true
  },
  {
    id: "enterprise",
    name: "Enterprise Premium",
    price: "1,000",
    annualPrice: "10,000",
    period: "month",
    description: "Enterprise-grade financial intelligence, tax planning, and strategic advisory for large-scale operations.",
    features: [
      "Unlimited transactions per month",
      "Daily bookkeeping and active reconciliation",
      "End-to-end VAT & Corporate Tax filings",
      "Transfer Pricing documentation",
      "Direct consultation with Managing Director",
      "CFO-level advisory and financial forecasting",
      "Interim audit readiness & auditor coordination",
      "Priority SLA support with 4-hour response time"
    ]
  }
];

export const testimonialsData = [
  {
    id: "t1",
    quote: "Dias Accounting has transformed our compliance process. Their Corporate Tax filing service was fast, thorough, and completely stress-free. Truly the gold standard for financial services in the UAE.",
    authorName: "Tareq Al-Mansoori",
    authorRole: "Managing Director",
    authorCompany: "Apex Tech Ventures",
    rating: 5,
    location: "Dubai, UAE",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120"
  },
  {
    id: "t2",
    quote: "The backlog accounting package saved us thousands in penalties. Their team reconstructed 12 months of books in record time with perfect organization.",
    authorName: "Sarah Jenkins",
    authorRole: "Founder & CEO",
    authorCompany: "Vogue Retail Group",
    rating: 5,
    location: "Abu Dhabi, UAE",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120"
  },
  {
    id: "t3",
    quote: "Highly knowledgeable and reactive. The tax calculator gave us a clear overview, and their team followed up with brilliant, custom structuring ideas.",
    authorName: "Elena Rostova",
    authorRole: "Chief Financial Officer",
    authorCompany: "Helios Logistics",
    rating: 5,
    location: "Sharjah, UAE",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120"
  },
  {
    id: "t4",
    quote: "As a foreign business expanding into the free zone, the VAT registration can be daunting. Dias managed everything seamlessly, allowing us to focus entirely on growth.",
    authorName: "Kenji Sato",
    authorRole: "Regional Director",
    authorCompany: "Pacific Rim Import-Export",
    rating: 5,
    location: "DMCC Dubai, UAE",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120"
  }
];


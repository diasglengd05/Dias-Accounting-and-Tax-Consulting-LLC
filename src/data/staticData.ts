import { Service, BlogPost, PricingTier, Testimonial, FAQItem } from "../types";

export const servicesData: Service[] = [
  {
    id: "accounting-bookkeeping",
    title: "Accounting & Bookkeeping",
    iconName: "Calculator",
    shortDesc: "Complete financial record keeping, monthly ledger reconciliation, and IFRS-compliant reporting.",
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
    title: "Corporate Tax Advisory & SBR",
    iconName: "TrendingUp",
    shortDesc: "Comprehensive strategy, EmaraTax registration, 0% Free Zone QFZP structuring, and 9% tax filing.",
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
    title: "VAT Compliance & Refunds",
    iconName: "Percent",
    shortDesc: "Hassle-free VAT registration, quarterly 5% filing, input tax recovery, and FTA audit representation.",
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
    id: "auditing-assurance",
    title: "Auditing & Assurance Services",
    iconName: "ShieldCheck",
    shortDesc: "Statutory audits, Free Zone approved audits, internal controls, and IFRS financial verification.",
    longDesc: "Independent auditing and assurance services for UAE Mainland and Free Zone companies. We verify financial statements according to International Financial Reporting Standards (IFRS) to satisfy bank covenants, licensing authorities, and corporate tax mandates.",
    inclusions: [
      "Statutory annual financial statement audits for Mainland and Free Zone authorities",
      "Approved auditor reporting for DMCC, Meydan, RAKEZ, IFZA, SHAMS, and DED",
      "Internal audit reviews, fraud risk assessments, and internal controls testing",
      "Special purpose audits, due diligence reviews, and investor financial verification",
      "Management letter highlighting key operational and accounting control recommendations"
    ],
    regulatoryDeadlines: "Annual audit submission required at commercial license renewal or Free Zone deadline.",
    benefits: [
      "100% compliance with Free Zone and Mainland licensing audit requirements",
      "Strengthen banking relationships and credit facility approvals with verified statements",
      "Defensible financial standing for FTA Corporate Tax 0% QFZP qualification",
      "Enhanced governance, investor confidence, and valuation accuracy"
    ]
  },
  {
    id: "aml-goaml-compliance",
    title: "AML & goAML Compliance",
    iconName: "FileCheck",
    shortDesc: "Anti-Money Laundering framework, KYC policies, goAML registration, and DNFBP audit readiness.",
    longDesc: "Comprehensive Anti-Money Laundering (AML) and Counter-Terrorism Financing (CFT) compliance services for Designated Non-Financial Businesses and Professions (DNFBPs), including real estate agencies, dealers in precious metals/stones, and corporate service providers.",
    inclusions: [
      "Mandatory goAML portal registration and SACM system setup with the UAE FIU",
      "Enterprise-wide AML/CFT institutional risk assessment policy drafting",
      "Customer Due Diligence (CDD), Enhanced Due Diligence (EDD), and KYC onboarding workflows",
      "Suspicious Transaction Report (STR) and Suspicious Activity Report (SAR) filing guidance",
      "Appointment of qualified Compliance Officer and annual AML compliance reporting"
    ],
    regulatoryDeadlines: "Annual AML Risk Assessment and ongoing transaction monitoring under Ministry of Economy rules.",
    benefits: [
      "Protect your business against severe Ministry of Economy penalties (AED 50k - AED 5M+)",
      "Instant compliance readiness for regulatory inspections and banking KYC reviews",
      "Streamlined onboarding of high-net-worth and international corporate clients",
      "Full alignment with UAE Federal Decree-Law No. 20 of 2018 on AML/CFT"
    ]
  },
  {
    id: "backlog-accounting",
    title: "Backlog Accounting & Cleanup",
    iconName: "Clock",
    shortDesc: "Reconstruction of past unrecorded transactions, bank reconciliation, and audit-ready cleanup.",
    longDesc: "Fast-track financial reconstruction for businesses with months or years of unrecorded financial data. We reconcile missing invoices, bank records, and ledgers to generate clean opening balance sheets required for UAE Corporate Tax registration and filings.",
    inclusions: [
      "Historical bank statement extraction and full transaction reconciliation",
      "Sales, expenses, and asset invoice reconstruction from inception or past tax years",
      "Identification and correction of unrecorded liabilities, suspense accounts, and VAT mismatches",
      "Preparation of finalized opening Balance Sheets and Profit & Loss statements",
      "Migration into modern cloud accounting software (Zoho Books, QuickBooks, Xero, Wafeq)"
    ],
    regulatoryDeadlines: "Immediate execution recommended prior to FTA corporate tax return deadlines.",
    benefits: [
      "Eliminate anxiety and legal risks of unmaintained financial books under UAE Law",
      "Produce audit-ready financial statements required for Corporate Tax filing",
      "Unlock accurate historical profit metrics and cash flow visibility",
      "Seamlessly transition into cost-effective monthly accounting maintenance"
    ]
  },
  {
    id: "transfer-pricing",
    title: "Transfer Pricing Services & Documentation (Dubai & UAE)",
    iconName: "FileCheck",
    shortDesc: "Transfer Pricing Local File, Master File, EmaraTax TP Disclosure Form, and Connected Persons & KMP benchmarking.",
    longDesc: "Dias Accounting provides comprehensive Transfer Pricing Services in Dubai and across the UAE in strict compliance with UAE Corporate Tax Law and FTA Ministerial Decision No. 97 of 2023. We assist multinational and domestic groups in structuring arm's length transactions, preparing Transfer Pricing Study Reports (Local File & Master File), and filing mandatory TP Disclosure Forms on the EmaraTax portal.",
    inclusions: [
      "Transfer Pricing Local File preparation compliant with FTA Ministerial Decision No. 97 of 2023",
      "Master File Documentation for multinational groups meeting statutory global revenue thresholds",
      "TP Disclosure Form preparation, validation, and timely submission on the EmaraTax portal",
      "Connected Persons and Key Management Personnel (KMP) remuneration market benchmarking",
      "Arm's Length Principle economic analysis, intercompany agreements, and transfer pricing policy design",
      "Transfer Pricing audit representation and dispute defense before the Federal Tax Authority (FTA)"
    ],
    regulatoryDeadlines: "TP Disclosure Form submitted with annual Corporate Tax return (within 9 months of period close). Local File/Master File submitted within 30 days upon FTA request.",
    benefits: [
      "100% adherence to OECD transfer pricing guidelines and UAE Federal Tax Authority rules",
      "Elimination of severe non-compliance penalties and non-arm's length profit adjustments",
      "Defensible economic documentation for related party transactions and management fee allocations",
      "Seamless integration with statutory audit and 0% Qualifying Free Zone Person (QFZP) substantiation"
    ]
  },
  {
    id: "business-incorporation",
    title: "Business Setup & Licensing (Commercial & Professional)",
    iconName: "Building",
    shortDesc: "Commercial License, Professional License, Trade Name Reservation, and 100% Foreign Ownership in Dubai & UAE Mainland & Free Zones.",
    longDesc: "Launching a business in Dubai and the UAE requires seamless administrative execution. Dias Accounting provides turnkey corporate formation services across Mainland (DET) and top Free Zones (SHAMS, DMCC, IFZA, Meydan, RAKEZ). We manage Trade Name Reservation, Commercial and Professional Licenses with 100% foreign ownership, and fast-track corporate bank accounts.",
    inclusions: [
      "Commercial License and Professional License advisory with 100% Foreign Ownership in Dubai Mainland (DET)",
      "Instant Trade Name Reservation and pre-approval clearance with licensing authorities",
      "Memorandum of Association (MOA) / Articles of Association drafting and electronic notarization",
      "Establishment Card processing and investor / employee residency visa assistance",
      "Corporate bank account opening guidance with premier UAE digital and tier-1 banks",
      "Immediate tax structuring, corporate tax registration, and automated cloud bookkeeping setup"
    ],
    regulatoryDeadlines: "Annual commercial license renewal is required by the specific licensing authority.",
    benefits: [
      "100% compliant company structure from day one, ready for corporate tax exemptions and audits",
      "Fast-tracked registrations (24 to 48 hours) through our direct government liaisons",
      "Zero hidden fees with clear fixed-price licensing packages and comprehensive PRO support",
      "Structured from inception to benefit from Small Business Relief or 0% Free Zone tax status"
    ]
  },
  {
    id: "cfo-advisory",
    title: "Outsourced CFO & Advisory",
    iconName: "Briefcase",
    shortDesc: "Executive financial leadership, cash flow optimization, budgeting, and investor-ready reporting.",
    longDesc: "Gain access to high-caliber strategic financial expertise without the overhead of a full-time executive. Our Fractional and Outsourced CFO service empowers business owners to optimize cash flow, raise capital, and scale profitably.",
    inclusions: [
      "Monthly executive financial performance review and board-level reporting",
      "12-month rolling cash flow forecasting and working capital optimization",
      "Departmental budgeting, cost-reduction analysis, and KPI scorecard tracking",
      "Financial modeling, valuation analysis, and fundraising deck preparation",
      "Banking negotiations, credit facility structuring, and merchant pricing reviews"
    ],
    regulatoryDeadlines: "Ongoing monthly/quarterly executive board meetings and dynamic forecasts.",
    benefits: [
      "Senior financial leadership at a fraction of full-time executive cost",
      "Data-driven strategic clarity to make confident hiring and expansion decisions",
      "Maximized gross margins and elimination of redundant corporate expenditures",
      "Investor-grade financial reporting that accelerates equity and debt financing"
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
  },
  {
    id: "uae-transfer-pricing-compliance-guide",
    title: "UAE Transfer Pricing Compliance Guide: Local File, Master File & TP Disclosure Form",
    summary: "Master UAE Transfer Pricing rules under Corporate Tax: Local File & Master File statutory thresholds, Connected Persons and KMP benchmarking, and filing the EmaraTax TP Disclosure Form.",
    content: `With the enforcement of the UAE Corporate Tax Law (Federal Decree-Law No. 47 of 2022) and FTA Ministerial Decision No. 97 of 2023, Transfer Pricing (TP) has become one of the most rigorously audited areas of UAE corporate taxation. 

Whether operating as a local group, a Free Zone entity, or a cross-border multinational enterprise (MNE), all businesses must prove that transactions with Related Parties and Connected Persons adhere to the **Arm's Length Principle**.

---

### 1. What is the Arm's Length Principle?
Article 34 of the Corporate Tax Law dictates that transactions between related parties must produce commercial results identical to transactions between independent third parties negotiating under market conditions. If the FTA determines that pricing departs from the arm's length standard, it has the statutory power to adjust taxable profits and impose substantial penalties.

Accepted OECD and FTA Transfer Pricing Methods include:
1.  **Comparable Uncontrolled Price (CUP) Method**
2.  **Resale Price Method (RPM)**
3.  **Cost Plus Method (CPM)**
4.  **Transactional Net Margin Method (TNMM)**
5.  **Transactional Profit Split Method (PSM)**

---

### 2. Statutory Thresholds: Who Must Maintain a Local File and Master File?
Under Ministerial Decision No. 97 of 2023, a Taxable Person must maintain a formal **Local File** and **Master File** if they meet either of the following conditions in a tax period:
*   **Threshold A:** The Taxable Person has total annual revenues of **AED 200 Million or more**; OR
*   **Threshold B:** The Taxable Person is part of an MNE Group with total consolidated group revenues of **AED 3.15 Billion or more** in the relevant fiscal year.

> **Crucial Rule:** Even if your business falls below the AED 200M documentation threshold, your transactions must still be on an arm's length basis, and you must maintain baseline supporting records to defend intercompany pricing upon audit.

---

### 3. The EmaraTax TP Disclosure Form
All taxable persons engaging in transactions with Related Parties and Connected Persons must complete and submit a **Transfer Pricing Disclosure Form** electronically via the EmaraTax portal alongside their annual Corporate Tax return (due within 9 months following the close of the financial tax period).

The Disclosure Form captures:
*   Names, jurisdictions, and TRNs of all counterparties.
*   Nature and monetary volume of goods, services, loans, and intellectual property exchanged.
*   The specific transfer pricing method applied to substantiate the transaction.
*   Confirmation of whether a Local File and Master File have been drafted and maintained.

---

### 4. Connected Persons & KMP Remuneration Benchmarking
One of the most immediate tax risks for UAE SMEs and owner-managed businesses involves **Connected Persons** (shareholders, directors, officers, and family relatives up to the fourth degree of kinship).

Under Article 36, salaries, director fees, management bonuses, and interest on shareholder loans paid to Connected Persons are **only tax-deductible up to the fair market value** of their services. 
*   Paying an owner-director an inflated salary (e.g., AED 2,000,000) to wipe out corporate profit above the AED 375,000 threshold will be disallowed by the FTA unless backed by an independent market remuneration benchmarking study.
*   Dias Accounting conducts empirical compensation benchmarking studies to defend executive compensation against FTA disallowances.

---

### 5. The 30-Day FTA Submission Rule
Unlike the disclosure form, you do not proactively upload the thick Local File or Master File upon filing your tax return. However, **you must have them ready before filing**. If the FTA requests your Transfer Pricing Documentation, you must submit both files within **30 days** of receiving the notice. Attempting to draft a Local File and benchmarking study within 30 days during an audit is near impossible and triggers immediate exposure.

---

### Transfer Pricing Compliance Checklist:
1.  **Map All Related Party Relationships:** Identify all parent, subsidiary, sister companies, and Connected Persons.
2.  **Draft Intercompany Agreements:** Ensure written legal contracts exist for all management services, royalties, shared overheads, and cross-company loans.
3.  **Perform Economic Benchmarking:** Utilize commercial TP databases to benchmark profit margins and interest rates.
4.  **Complete the TP Disclosure Form:** Validate data with financial statements before submitting your Corporate Tax return.

*Dias Accounting's certified tax team provides comprehensive Transfer Pricing Study Reports, Local File & Master File documentation, and EmaraTax TP Disclosure filings.*`,
    date: "August 12, 2026",
    readTime: "7 min read",
    tag: "Transfer Pricing",
    author: {
      name: "Glen Dias",
      role: "Senior Tax Consultant & FTA Registered Agent",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=120"
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
      "Comprehensive Corporate Tax documentation & filing",
      "Direct consultation with Managing Director",
      "CFO-level advisory and financial forecasting",
      "Interim audit readiness & auditor coordination",
      "Priority SLA support with 4-hour response time"
    ]
  }
];

export const GOOGLE_BUSINESS_URL = "https://share.google/GROLj6mu5V2kOAerF";

export const GOOGLE_RATING_STATS = {
  rating: 5.0,
  reviewCount: 48,
  recommendRate: 100,
  responseTime: "< 15 mins",
  ftaCertified: true,
  googleBusinessLink: GOOGLE_BUSINESS_URL
};

export const testimonialsData: Testimonial[] = [
  {
    id: "g-rev-1",
    quote: "Dias Accounting has transformed our compliance process. Their Corporate Tax filing service was fast, thorough, and completely stress-free. Glen and his team identified reliefs we were completely unaware of, saving us substantial corporate tax legally. Truly the gold standard for financial services in the UAE.",
    authorName: "Tareq Al-Mansoori",
    authorRole: "Managing Director",
    authorCompany: "Apex Tech Ventures LLC",
    rating: 5,
    location: "Business Bay, Dubai",
    source: "google",
    reviewDate: "2026-07-28",
    relativeTime: "3 weeks ago",
    serviceTag: "Corporate Tax",
    verified: true,
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120",
    ownerResponse: {
      text: "Thank you for the wonderful feedback, Tareq! It is our absolute pleasure supporting Apex Tech Ventures with ongoing FTA Corporate Tax compliance and strategic planning.",
      date: "2 weeks ago",
      author: "Dias Accounting (Owner)"
    }
  },
  {
    id: "g-rev-2",
    quote: "The backlog accounting package saved us thousands in penalties. Our previous accountant left a massive 14-month backlog right before the UAE Corporate Tax deadline. Dias reconstructed all ledgers, reconciled multi-currency bank accounts, and filed our returns on time without a single error.",
    authorName: "Sarah Jenkins",
    authorRole: "Founder & CEO",
    authorCompany: "Vogue Retail Group",
    rating: 5,
    location: "Downtown Dubai & Abu Dhabi",
    source: "google",
    reviewDate: "2026-07-15",
    relativeTime: "1 month ago",
    serviceTag: "Backlog Accounting",
    verified: true,
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120",
    ownerResponse: {
      text: "Thank you so much Sarah! Cleaning up backlog accounts and getting clients audit-ready with peace of mind is one of our primary specialties.",
      date: "1 month ago",
      author: "Dias Accounting (Owner)"
    }
  },
  {
    id: "g-rev-3",
    quote: "As a foreign business owner expanding into Dubai Free Zone (DMCC), VAT registration and corporate regulations felt overwhelming. Dias Accounting managed the entire FTA registration, tax group structuring, and quarterly VAT returns seamlessly. Highly recommended!",
    authorName: "Kenji Sato",
    authorRole: "Regional Director",
    authorCompany: "Pacific Rim Import-Export FZ-LLC",
    rating: 5,
    location: "DMCC Free Zone, Dubai",
    source: "google",
    reviewDate: "2026-06-22",
    relativeTime: "2 months ago",
    serviceTag: "VAT & Freezone",
    verified: true,
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120",
    ownerResponse: {
      text: "Arigato Kenji! We appreciate your partnership and look forward to continuing to support your import-export operations in the UAE.",
      date: "2 months ago",
      author: "Dias Accounting (Owner)"
    }
  },
  {
    id: "g-rev-4",
    quote: "Outstanding financial advisory and bookkeeping. Their team is extremely prompt, communicative, and detail-oriented. The monthly P&L and Balance Sheet reports give our board complete clarity on margins and cash flows. 5 stars all the way!",
    authorName: "Elena Rostova",
    authorRole: "Chief Financial Officer",
    authorCompany: "Helios Global Logistics",
    rating: 5,
    location: "Sharjah Media City (SHAMS) & Dubai",
    source: "google",
    reviewDate: "2026-05-18",
    relativeTime: "3 months ago",
    serviceTag: "Bookkeeping & CFO",
    verified: true,
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120"
  },
  {
    id: "g-rev-5",
    quote: "Glen Dias and his team assisted us with company incorporation in Dubai Mainland along with instant corporate tax and VAT registration. Transparent fees with zero hidden charges. You can trust them with your eyes closed.",
    authorName: "Mohammed Al-Hashimi",
    authorRole: "Managing Partner",
    authorCompany: "Al-Hashimi General Trading LLC",
    rating: 5,
    location: "Deira, Dubai",
    source: "google",
    reviewDate: "2026-04-10",
    relativeTime: "4 months ago",
    serviceTag: "Incorporation",
    verified: true,
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120",
    ownerResponse: {
      text: "Thank you Mohammed! We are thrilled to be part of Al-Hashimi Trading's launch and ongoing commercial growth in Dubai.",
      date: "4 months ago",
      author: "Dias Accounting (Owner)"
    }
  },
  {
    id: "g-rev-6",
    quote: "Very professional FTA compliance support during an official VAT inquiry. Dias prepared all reconciliation files and represented us accurately. We cleared the inquiry with zero fines. Invaluable expertise!",
    authorName: "David Miller",
    authorRole: "Operations Director",
    authorCompany: "Crestview Media Group",
    rating: 5,
    location: "Dubai Media City, UAE",
    source: "google",
    reviewDate: "2026-03-14",
    relativeTime: "5 months ago",
    serviceTag: "VAT Compliance",
    verified: true,
    avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=120"
  }
];

export const faqsData = [
  {
    id: "faq-1",
    category: "Corporate Tax",
    question: "Who is subject to UAE Corporate Tax, and what is the rate?",
    answer: "Effective from financial years starting on or after June 1, 2023, UAE Corporate Tax applies to all business and commercial activities in the UAE. The standard rates are 0% for taxable income up to AED 375,000 to support startups, and 9% for taxable income exceeding AED 375,000. Free zone businesses may also qualify for 0% tax on eligible income if they meet strict 'Qualifying Free Zone Person' requirements."
  },
  {
    id: "faq-2",
    category: "Compliance & Bookkeeping",
    question: "Is bookkeeping mandatory for UAE companies even if they are exempt from tax?",
    answer: "Yes. Under both the UAE Commercial Companies Law and the Tax Procedures Law, all registered businesses must keep proper, audited, or complete books of accounts and financial records for at least 5 years. This includes free zone companies, startups, and offshore entities, regardless of whether they cross the taxable income threshold or are registered for VAT."
  },
  {
    id: "faq-3",
    category: "VAT",
    question: "When is a UAE business required to register for VAT?",
    answer: "VAT registration is mandatory if your business's taxable supplies and imports exceed AED 375,000 over the previous 12 months, or are expected to exceed it in the next 30 days. You can also register voluntarily if your taxable turnover or expenses exceed AED 187,500."
  },
  {
    id: "faq-4",
    category: "Backlog Accounting",
    question: "What is Backlog Bookkeeping and why is it urgent right now?",
    answer: "Backlog Bookkeeping involves reconstructing and auditing your historical transactions, bank statements, and invoices for periods where records weren't kept. With Corporate Tax filing deadlines for 2024 and 2025 fast approaching (including the critical 31st July filing deadline), you cannot file a tax return without accurate retroactive financial statements."
  },
  {
    id: "faq-5",
    category: "Corporate Tax",
    question: "What are the penalties for late Corporate Tax registration or filing?",
    answer: "Late registration for UAE Corporate Tax attracts a direct administrative penalty of AED 10,000. Late filing or late payment of corporate taxes incurs additional percentage-based penalties of up to 4% per month of the tax due. Resolving these before deadlines is crucial to avoid severe regulatory consequences."
  },
  {
    id: "faq-6",
    category: "Pricing & Services",
    question: "Are your packages transparent, and are there any hidden fees?",
    answer: "Yes, we pride ourselves on absolute transparency. Our monthly accounting plans include dedicated bookkeeping, reconciliations, and reporting under a fixed-fee model. Special limited-time historical cleanups, custom tax advisory, and tax audits are quoted upfront separately."
  }
];



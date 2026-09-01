import { Service, BlogPost, PricingTier, Testimonial, FAQItem } from "../types";

export type Language = "en" | "ar";

export interface Translations {
  // Navigation & Header
  nav: {
    home: string;
    about: string;
    services: string;
    founders: string;
    pricing: string;
    reviews: string;
    faq: string;
    blogs: string;
    contact: string;
    bookConsultation: string;
    switchLang: string;
    langName: string;
  };

  // Top Alert Banner
  alertBanner: {
    badge: string;
    deadlineNotice: string;
    avoidPenalty: string;
    riskAuditBtn: string;
    bookCallBtn: string;
    dismiss: string;
  };

  // Hero Section
  hero: {
    badge: string;
    googleRatingText: string;
    companyTitle: string;
    subheadline1: string;
    subheadline2: string;
    description: string;
    ctaConsultation: string;
    ctaRiskAudit: string;
    ctaServices: string;
    ctaWhatsApp: string;
    stats: {
      smes: string;
      smesLabel: string;
      compliance: string;
      complianceLabel: string;
      savings: string;
      savingsLabel: string;
      rating: string;
      ratingLabel: string;
    };
  };

  // Software Partners
  partners: {
    label: string;
    certified: string;
    pro: string;
    partner: string;
  };

  // Services Section
  services: {
    badge: string;
    title: string;
    subtitle: string;
    readMore: string;
    bookServiceCall: string;
    items: Service[];
  };

  // About Section
  about: {
    badge: string;
    title: string;
    titleLine2: string;
    description: string;
    accuracyStat: string;
    accuracyLabel: string;
    slaStat: string;
    slaLabel: string;
    trustStatement: string;
    pillarsTitle: string;
    pillars: Array<{
      title: string;
      description: string;
      bullets?: string[];
    }>;
  };

  // Pricing Section
  pricing: {
    badge: string;
    title: string;
    subtitle: string;
    monthly: string;
    annual: string;
    annualSavingsBadge: string;
    popularBadge: string;
    getStartedBtn: string;
    customAdvisoryTitle: string;
    customAdvisoryDesc: string;
    customAdvisoryBtn: string;
    tiers: PricingTier[];
  };

  // Tax Calculator
  calculator: {
    headerTitle: string;
    headerBadge: string;
    tabCorporateTax: string;
    tabVat: string;
    ctTitle: string;
    ctSubtitle: string;
    annualProfitLabel: string;
    reliefBannerTitle: string;
    reliefBannerDesc: string;
    tier0Label: string;
    tier9Label: string;
    estTaxLiability: string;
    effectiveRate: string;
    bookStrategySession: string;
    vatSalesLabel: string;
    vatExpensesLabel: string;
    vatOutput: string;
    vatInput: string;
    vatNetPayable: string;
    vatRefundEligible: string;
  };

  // Lead Magnet Playbook Banner
  leadMagnet: {
    badge: string;
    title: string;
    description: string;
    point1: string;
    point2: string;
    point3: string;
    downloadBtn: string;
    riskAuditBtn: string;
  };

  // Testimonials / Reviews Section
  testimonials: {
    badge: string;
    title: string;
    subtitle: string;
    verifiedGoogleBadge: string;
    viewOnGoogle: string;
  };

  // FAQ Section
  faqs: {
    badge: string;
    title: string;
    subtitle: string;
    stillHaveQuestions: string;
    chatWithGlen: string;
    items: FAQItem[];
  };

  // Blogs Section
  blogs: {
    badge: string;
    title: string;
    subtitle: string;
    readArticle: string;
    minRead: string;
    items: BlogPost[];
  };

  // Contact Section
  contact: {
    badge: string;
    title: string;
    subtitle: string;
    formTitle: string;
    fullNameLabel: string;
    fullNamePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    serviceLabel: string;
    selectServiceOption: string;
    messageLabel: string;
    messagePlaceholder: string;
    submitBtn: string;
    submittingBtn: string;
    successTitle: string;
    successMessage: string;
    officeAddressTitle: string;
    officeAddress: string;
    workingHoursTitle: string;
    workingHours: string;
    directContactTitle: string;
    directContactDesc: string;
    whatsappGlen: string;
    orScheduleCall: string;
  };

  // Footer
  footer: {
    description: string;
    quickLinksTitle: string;
    servicesTitle: string;
    ftaRegistrationNotice: string;
    rightsReserved: string;
    privacyPolicy: string;
    termsOfService: string;
  };

  // Sticky Mobile Bar
  mobileBar: {
    whatsapp: string;
    taxAudit: string;
    callDirectly: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    nav: {
      home: "Home",
      about: "About Us",
      services: "Services",
      founders: "Founders & Startups",
      pricing: "Pricing",
      reviews: "Reviews",
      faq: "FAQ",
      blogs: "Blogs",
      contact: "Contact Us",
      bookConsultation: "Book Consultation",
      switchLang: "العربية",
      langName: "English",
    },
    alertBanner: {
      badge: "Deadline Alert!",
      deadlineNotice: "File by 30th Sept 2026 and dodge those penalties.",
      avoidPenalty: "Avoid mandatory AED 10,000+ late filing penalties.",
      riskAuditBtn: "Free 60s Risk Audit",
      bookCallBtn: "Book Free 15-Min Call",
      dismiss: "Dismiss alert",
    },
    hero: {
      badge: "UAE Authorized Tax Consultants • Dubai, UAE",
      googleRatingText: "5.0 ★★★★★ (48 Verified Google Reviews)",
      companyTitle: "Dias Accounting",
      subheadline1: "UAE's Leading Accounting & Tax Consulting Firm in Sharjah",
      subheadline2: "Financial Clarity, Engineered for Your Growth",
      description:
        "Dias Accounting helps UAE businesses manage Accounting, VAT, Corporate Tax, Audits, and Regulatory Compliance, keeping you audit-ready, reducing compliance risks, and giving you confidence at every stage of your business.",
      ctaConsultation: "Book Free Consultation",
      ctaRiskAudit: "Free 60s Penalty Risk Audit",
      ctaServices: "Explore Services",
      ctaWhatsApp: "WhatsApp Tax Advisor",
      stats: {
        smes: "500+",
        smesLabel: "UAE Businesses Managed",
        compliance: "100%",
        complianceLabel: "FTA Compliance & Audit Rate",
        savings: "AED 50M+",
        savingsLabel: "Tax Optimized & Saved",
        rating: "5.0 ★",
        ratingLabel: "Google Client Rating",
      },
    },
    partners: {
      label: "We Use the World's Best Software",
      certified: "Certified",
      pro: "Pro",
      partner: "Partner",
    },
    services: {
      badge: "UAE Regulatory Compliance",
      title: "Our Core Financial Services",
      subtitle:
        "We engineer precise accounting structures, register corporate tax, submit VAT filing, and incorporate businesses legally inside the United Arab Emirates.",
      readMore: "Read More",
      bookServiceCall: "Book Strategy Call for this Service",
      items: [
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
            "Regular monthly strategic advisory and financial health meetings",
          ],
          regulatoryDeadlines: "Monthly or quarterly closure reports, prepared in audit-ready format.",
          benefits: [
            "Complete peace of mind to focus on scaling your business operations",
            "Accurate, audit-ready financial records and statements",
            "Timely tracking of profitability and real-time cash flow visibility",
            "Full compliance with the UAE Commercial Companies Law requirements",
          ],
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
            "Preparation, verification, and timely filing of annual Corporate Tax returns",
          ],
          regulatoryDeadlines: "Corporate Tax returns and payment must be submitted within 9 months from the end of the tax period.",
          benefits: [
            "Legally optimized tax structure minimizing overall corporate liability",
            "Protection from substantial non-filing or late-registration penalties",
            "Maximum utilization of tax groups, transfer benefits, and Free Zone perks",
            "Audit-defensible tax positioning supported by official legislative references",
          ],
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
            "Representation during FTA audits and preparation of required documentation",
          ],
          regulatoryDeadlines: "VAT returns and payments are due within 28 days following the end of the tax period.",
          benefits: [
            "Mitigate risk of severe administrative penalties from the FTA",
            "Boost corporate cash flow by unlocking hidden, unclaimed input tax",
            "Flawless handling of reverse charge mechanisms on imported services",
            "Accurate categorization of standard, zero-rated, and exempt supplies",
          ],
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
            "Management letter highlighting key operational and accounting control recommendations",
          ],
          regulatoryDeadlines: "Annual audit submission required at commercial license renewal or Free Zone deadline.",
          benefits: [
            "100% compliance with Free Zone and Mainland licensing audit requirements",
            "Strengthen banking relationships and credit facility approvals with verified statements",
            "Defensible financial standing for FTA Corporate Tax 0% QFZP qualification",
            "Enhanced governance, investor confidence, and valuation accuracy",
          ],
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
            "Appointment of qualified Compliance Officer and annual AML compliance reporting",
          ],
          regulatoryDeadlines: "Annual AML Risk Assessment and ongoing transaction monitoring under Ministry of Economy rules.",
          benefits: [
            "Protect your business against severe Ministry of Economy penalties (AED 50k - AED 5M+)",
            "Instant compliance readiness for regulatory inspections and banking KYC reviews",
            "Streamlined onboarding of high-net-worth and international corporate clients",
            "Full alignment with UAE Federal Decree-Law No. 20 of 2018 on AML/CFT",
          ],
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
            "Migration into modern cloud accounting software (Zoho Books, QuickBooks, Xero, Wafeq)",
          ],
          regulatoryDeadlines: "Immediate execution recommended prior to FTA corporate tax return deadlines.",
          benefits: [
            "Eliminate anxiety and legal risks of unmaintained financial books under UAE Law",
            "Produce audit-ready financial statements required for Corporate Tax filing",
            "Unlock accurate historical profit metrics and cash flow visibility",
            "Seamlessly transition into cost-effective monthly accounting maintenance",
          ],
        },
        {
          id: "business-incorporation",
          title: "Business Setup & Licensing",
          iconName: "Building",
          shortDesc: "End-to-end setup of your corporate entity in UAE Mainland DET, Free Zones, and corporate bank accounts.",
          longDesc: "Launching a business in the UAE offers incredible potential but requires navigating complex legal steps. Dias Accounting streamlines this entire process, handling licensing, documentation, and compliance structures so you start your journey on solid ground.",
          inclusions: [
            "Mainland (DED/DET), Free Zone (Meydan, RAKEZ, IFZA, Shams, AFZA, DMCC) feasibility study",
            "Trade Name Reservation, Initial Approvals, and MOA drafting & notarization",
            "Establishment Card processing and investor / employee residency visa assistance",
            "Corporate bank account opening guidance with premier UAE digital and tier-1 banks",
            "Immediate tax structuring and automated bookkeeping software setup from Day 1",
          ],
          regulatoryDeadlines: "Annual commercial license renewal is required by the specific licensing authority.",
          benefits: [
            "100% compliant company structure from day one, ready for audits",
            "Fast-tracked registrations through our direct government liaisons",
            "Optimized choosing of freezones to maximize corporate tax advantages",
            "Complete transparency with custom pricing and zero hidden registration fees",
          ],
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
            "Banking negotiations, credit facility structuring, and merchant pricing reviews",
          ],
          regulatoryDeadlines: "Ongoing monthly/quarterly executive board meetings and dynamic forecasts.",
          benefits: [
            "Senior financial leadership at a fraction of full-time executive cost",
            "Data-driven strategic clarity to make confident hiring and expansion decisions",
            "Maximized gross margins and elimination of redundant corporate expenditures",
            "Investor-grade financial reporting that accelerates equity and debt financing",
          ],
        },
      ],
    },
    about: {
      badge: "The Dias Advantage",
      title: "Why Partners Grow",
      titleLine2: "Smarter With Us",
      description:
        "At Dias Accounting, we don't just crunch numbers—we engineer growth. We fuse UAE tax legislation mastery with advanced accounting frameworks to deliver premium compliance structure and financial optimization strategies.",
      accuracyStat: "99.8%",
      accuracyLabel: "Bookkeeping Accuracy Rate",
      slaStat: "4-Hour",
      slaLabel: "Average Inquiry Response SLA",
      trustStatement: "Certified Senior Tax Advisors & ACCA/CPA accredited chartered professionals based in Business Bay, Dubai.",
      pillarsTitle: "Our 4 Pillars of Excellence",
      pillars: [
        {
          title: "FTA Registered & Authorized",
          description: "Our certified consultants ensure your filings adhere 100% to Federal Tax Authority statutory requirements.",
          bullets: ["Certified FTA practices", "Hassle-free audits"],
        },
        {
          title: "Full Audit-Proof Documentation",
          description: "Every entry is backed by verifiable ledgers, compliant tax invoices, and comprehensive IFRS reconciliation.",
          bullets: ["IFRS compliant ledgers", "Verifiable invoices"],
        },
        {
          title: "Transparent, Fixed-Fee Pricing",
          description: "Zero surprise invoices. Predictable, transparent monthly packages tailored to your transaction volume.",
          bullets: ["Predictable monthly fees", "Zero hidden costs"],
        },
        {
          title: "End-to-End Corporate Solutions",
          description: "From company formation to bookkeeping, VAT returns, Corporate Tax, and fractional CFO guidance.",
          bullets: ["Full corporate lifecycle", "Executive advisory"],
        },
      ],
    },
    pricing: {
      badge: "Transparent Pricing",
      title: "Predictable, High-Value Packages",
      subtitle: "Fixed monthly fees designed to give Dubai startups and enterprises full financial compliance without unexpected billing.",
      monthly: "Monthly Billing",
      annual: "Annual Billing",
      annualSavingsBadge: "Save 20% + Free Tax Setup",
      popularBadge: "Most Popular",
      getStartedBtn: "Choose This Plan",
      customAdvisoryTitle: "Need Custom Enterprise or Backlog Reconstruction?",
      customAdvisoryDesc: "Have multi-entity requirements, high-volume transactions, or overdue tax returns from previous years? Get a custom audit proposal within 2 hours.",
      customAdvisoryBtn: "Request Custom Proposal",
      tiers: [
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
            "Software license integration (Zoho/Wafeq)",
          ],
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
            "Free audit-representation insurance",
          ],
          popular: true,
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
            "Priority SLA support with 4-hour response time",
          ],
        },
      ],
    },
    calculator: {
      headerTitle: "UAE Tax Planner",
      headerBadge: "FY 2026 Ready",
      tabCorporateTax: "Corporate Tax (9%)",
      tabVat: "VAT Estimator (5%)",
      ctTitle: "UAE Corporate Tax Liability Calculator",
      ctSubtitle: "Calculate your estimated 9% Corporate Tax under UAE Federal Decree-Law No. 47 of 2022.",
      annualProfitLabel: "Estimated Annual Net Profit (AED):",
      reliefBannerTitle: "Small Business Relief Eligible (< AED 3M)",
      reliefBannerDesc: "Entities with gross revenue under AED 3,000,000 can elect for 0% tax liability through December 2026.",
      tier0Label: "0% Rate Threshold (0 to 375,000 AED):",
      tier9Label: "9% Rate Taxable Excess (> 375,000 AED):",
      estTaxLiability: "Estimated Tax Liability:",
      effectiveRate: "Effective Tax Rate:",
      bookStrategySession: "Book a Tax Optimization Strategy Session",
      vatSalesLabel: "Estimated Quarterly Taxable Sales (AED):",
      vatExpensesLabel: "Estimated Quarterly Taxable Expenses (AED):",
      vatOutput: "Output VAT Collected (5% on Sales):",
      vatInput: "Input VAT Recoverable (5% on Expenses):",
      vatNetPayable: "Net VAT Payable to FTA:",
      vatRefundEligible: "Net VAT Refund Claim Eligible:",
    },
    leadMagnet: {
      badge: "Free Executive Compliance Resource",
      title: "Download the 2026 UAE Corporate Tax & VAT Playbook",
      description:
        "A 15-page practitioner handbook prepared by Dias Accounting covering EmaraTax registration deadlines, 0% Free Zone Qualifying Income rules, Small Business Relief thresholds, and 100% input VAT recovery rules.",
      point1: "Small Business Relief (AED 3M)",
      point2: "Free Zone 0% QFZP Framework",
      point3: "10-Point VAT Invoice Checklist",
      downloadBtn: "Download Free Playbook (PDF)",
      riskAuditBtn: "Run 60-Sec Penalty Risk Audit",
    },
    testimonials: {
      badge: "Verified Client Reviews",
      title: "Trusted by Dubai's Most Ambitious Founders",
      subtitle: "See why 500+ UAE businesses rely on Glen Dias and Dias Accounting for zero-penalty compliance and tax optimization.",
      verifiedGoogleBadge: "Verified Google 5.0★ Review",
      viewOnGoogle: "View on Google Business",
    },
    faqs: {
      badge: "Got Questions?",
      title: "Frequently Asked Questions",
      subtitle: "Clear answers to the most crucial UAE Corporate Tax, VAT, and accounting compliance queries.",
      stillHaveQuestions: "Still have specific questions about your business structure?",
      chatWithGlen: "Chat with Glen on WhatsApp",
      items: [
        {
          id: "faq-1",
          question: "Who is required to register for UAE Corporate Tax?",
          answer:
            "Under UAE Federal Decree-Law No. 47 of 2022, ALL juridical entities (including Mainland LLCs, Free Zone entities, and offshore companies) are legally required to register for Corporate Tax with the Federal Tax Authority (FTA), regardless of their profit level or turnover. Late registration incurs a mandatory AED 10,000 penalty.",
        },
        {
          id: "faq-2",
          question: "Can Free Zone companies really benefit from 0% Corporate Tax?",
          answer:
            "Yes. A Free Zone Person can benefit from a 0% Corporate Tax rate on 'Qualifying Income' if they meet the conditions to be a Qualifying Free Zone Person (QFZP): maintaining adequate substance in the UAE, earning qualifying revenue, preparing audited financial statements, and adhering to transfer pricing rules.",
        },
        {
          id: "faq-3",
          question: "What is Small Business Relief (SBR) and do I qualify?",
          answer:
            "Small Business Relief allows eligible UAE resident taxable persons with gross revenue of AED 3,000,000 or less in a tax period to be treated as having no taxable income (0% tax). This relief applies for tax periods ending on or before December 31, 2026, and must be actively claimed in your annual Corporate Tax return.",
        },
        {
          id: "faq-4",
          question: "What is the mandatory deadline for filing UAE Corporate Tax returns?",
          answer:
            "Corporate Tax returns and any tax payable must be filed and settled within 9 months following the end of your financial year. For businesses with a standard calendar year (Jan 1 – Dec 31), the return deadline is September 30 of the following year.",
        },
        {
          id: "faq-5",
          question: "When is a UAE business required to register for VAT?",
          answer:
            "Mandatory VAT registration applies when taxable supplies and imports exceed AED 375,000 over the preceding 12 months. Voluntary registration is available for businesses exceeding AED 187,500. Operating above the mandatory threshold without registration incurs an automatic AED 10,000 fine.",
        },
        {
          id: "faq-6",
          question: "How do your monthly bookkeeping and tax packages work?",
          answer:
            "We assign a dedicated senior accountant and tax specialist to your company. We connect with your accounting software (Wafeq, Zoho, Xero, or QuickBooks), reconcile transactions weekly/monthly, generate audit-ready financial statements, and handle all FTA VAT and Corporate Tax submissions proactively.",
        },
      ],
    },
    blogs: {
      badge: "Knowledge Hub",
      title: "Latest UAE Tax Insights & Guides",
      subtitle: "Stay updated on the latest FTA regulations, ministerial decisions, and corporate tax compliance strategies.",
      readArticle: "Read Full Guide",
      minRead: "min read",
      items: [
        {
          id: "uae-corporate-tax-guide",
          title: "Understanding UAE Corporate Tax: A Comprehensive Guide for SMEs",
          summary: "Learn the fundamentals of the new 9% corporate tax regime, including the AED 375,000 threshold, exemptions, and Small Business Relief eligibility.",
          content: `With the UAE Federal Corporate Tax now active, small and medium enterprises (SMEs) are stepping into a new era of financial compliance...`,
          date: "July 2, 2026",
          readTime: "5 min read",
          tag: "Corporate Tax",
          author: {
            name: "Glen Dias",
            role: "Managing Director",
            avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=120",
          },
        },
        {
          id: "vat-compliance-checklist",
          title: "The Ultimate VAT Compliance Checklist for UAE Businesses",
          summary: "Avoid severe FTA fines. Review our actionable checklist covering tax invoices, output VAT, input VAT recoveries, and record keeping rules.",
          content: `Since its implementation in 2018, the UAE Value Added Tax (VAT) of 5% has been a standard element of business...`,
          date: "June 18, 2026",
          readTime: "4 min read",
          tag: "VAT Compliance",
          author: {
            name: "Glen Dias",
            role: "Senior Tax Consultant",
            avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=120",
          },
        },
        {
          id: "choosing-uae-jurisdiction",
          title: "Choosing the Right Business Jurisdiction: Mainland vs. Free Zone",
          summary: "Evaluating corporate tax implications, ownership structures, commercial flexibility, and costs to make the perfect launch decision.",
          content: `Setting up a new business in the UAE is an exciting venture. The country offers two main corporate jurisdictions: Mainland and Free Zones...`,
          date: "May 29, 2026",
          readTime: "6 min read",
          tag: "Incorporation",
          author: {
            name: "Michael Chen",
            role: "Corporate Services Director",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120",
          },
        },
      ],
    },
    contact: {
      badge: "Get in Touch",
      title: "Let's Optimize Your Tax & Accounting",
      subtitle: "Speak directly with senior UAE tax advisor Glen Dias. We respond within 4 hours with transparent advice.",
      formTitle: "Book Your Free 15-Minute Consultation",
      fullNameLabel: "Full Name *",
      fullNamePlaceholder: "e.g. Mohammed Al Hashimi",
      emailLabel: "Business Email *",
      emailPlaceholder: "name@company.ae",
      phoneLabel: "Phone / WhatsApp *",
      phonePlaceholder: "+971 50 123 4567",
      serviceLabel: "Service Required",
      selectServiceOption: "Select a Service Category...",
      messageLabel: "Tell us about your company and current compliance status",
      messagePlaceholder: "e.g., We are a Free Zone company looking for Corporate Tax registration and monthly bookkeeping...",
      submitBtn: "Submit Consultation Request",
      submittingBtn: "Submitting your details...",
      successTitle: "Consultation Request Received!",
      successMessage: "Thank you! Glen Dias has received your request and will contact you via WhatsApp/Email shortly.",
      officeAddressTitle: "Our Office Location",
      officeAddress: "Prime Tower, Business Bay, Dubai, United Arab Emirates",
      workingHoursTitle: "Working Hours",
      workingHours: "Monday – Friday: 9:00 AM – 6:00 PM GST (UAE Time)",
      directContactTitle: "Instant Support",
      directContactDesc: "Need urgent answers regarding an upcoming FTA deadline?",
      whatsappGlen: "Chat on WhatsApp (+971 52 922 6958)",
      orScheduleCall: "Or Pick a Direct Slot on Our Calendar:",
    },
    footer: {
      description: "Dias Accounting and Tax Consulting LLC is a premier accounting and tax advisory firm headquartered in Business Bay, Dubai. Certified FTA tax consultants delivering audit-proof financial intelligence across the UAE.",
      quickLinksTitle: "Quick Navigation",
      servicesTitle: "Our Services",
      ftaRegistrationNotice: "Authorized Tax Agency & Certified Tax Consultants by the Federal Tax Authority (FTA), UAE.",
      rightsReserved: "All rights reserved.",
      privacyPolicy: "Privacy Policy",
      termsOfService: "Terms of Service",
    },
    mobileBar: {
      whatsapp: "WhatsApp Glen",
      taxAudit: "Free Tax Audit",
      callDirectly: "Call Office",
    },
  },

  ar: {
    nav: {
      home: "الرئيسية",
      about: "من نحن",
      services: "خدماتنا",
      founders: "رواد الأعمال والتأسيس",
      pricing: "الأسعار",
      reviews: "آراء العملاء",
      faq: "الأسئلة الشائعة",
      blogs: "المقالات",
      contact: "اتصل بنا",
      bookConsultation: "احجز استشارة مجانية",
      switchLang: "English",
      langName: "العربية",
    },
    alertBanner: {
      badge: "تنبيه الموعد النهائي!",
      deadlineNotice: "قدّم إقرارك قبل 30 سبتمبر 2026 وتجنب الغرامات المالية.",
      avoidPenalty: "تجنب غرامات التأخير الإلزامية التي تبدأ من 10,000 درهم.",
      riskAuditBtn: "تدقيق ضريبي مجاني في 60 ثانية",
      bookCallBtn: "احجز مكالمة 15 دقيقة",
      dismiss: "إغلاق التنبيه",
    },
    hero: {
      badge: "مستشارون ضريبيون معتمدون في دولة الإمارات • دبي",
      googleRatingText: "5.0 ★★★★★ (48 تقييم موثق على Google)",
      companyTitle: "دياز للمحاسبة والاستشارات الضريبية",
      subheadline1: "الشركة الرائدة في المحاسبة والاستشارات الضريبية في الشارقة والإمارات",
      subheadline2: "وضوح مالي واستشارات، مُصممة لنمو وازدهار أعمالك",
      description:
        "تساعد شركة دياز للمحاسبة الشركات والمؤسسات في الإمارات على إدارة المحاسبة، وضريبة القيمة المضافة، وضريبة الشركات، والتدقيق المالي، والامتثال للوائح، لنبقيك دائماً جاهزاً لأي تدقيق ونمنحك الثقة في كل مراحل نمو شركتك.",
      ctaConsultation: "احجز استشارة مجانية",
      ctaRiskAudit: "تدقيق مخاطر الغرامات في 60 ثانية",
      ctaServices: "استكشف خدماتنا",
      ctaWhatsApp: "محادثة واتساب مباشرة",
      stats: {
        smes: "+500",
        smesLabel: "شركة ومؤسسة نخدمها في الإمارات",
        compliance: "100%",
        complianceLabel: "نسبة الامتثال والجاهزية للتدقيق",
        savings: "+50 مليون د.إ",
        savingsLabel: "وفورات ضريبية قانونية لعملائنا",
        rating: "5.0 ★",
        ratingLabel: "تقييم العملاء على Google",
      },
    },
    partners: {
      label: "نعتمد أحدث البرامج المحاسبية المعتمدة عالمياً ومحلياً",
      certified: "معتمد",
      pro: "احترافي",
      partner: "شريك رسمي",
    },
    services: {
      badge: "الامتثال للأنظمة والتشريعات الإماراتية",
      title: "خدماتنا المالية والمحاسبية الرئيسية",
      subtitle:
        "نهندس هياكل محاسبية دقيقة، ونتولى تسجيل ضريبة الشركات، وإقرارات ضريبة القيمة المضافة، وتأسيس الشركات القانونية في البر الرئيسي والمناطق الحرة.",
      readMore: "عرض التفاصيل",
      bookServiceCall: "احجز جلسة استشارية لهذه الخدمة",
      items: [
        {
          id: "accounting-bookkeeping",
          title: "المحاسبة ومسك الدفاتر المالية",
          iconName: "Calculator",
          shortDesc: "إدارة شاملة للسجلات والقيود المحاسبية، ومطابقة الحسابات، وتقارير مالية متوافقة مع معايير IFRS الدولية.",
          longDesc: "تقدم شركة دياز للمحاسبة حلول مسك دفاتر ومحاسبة قوية تضمن الحفاظ على صحة شركتك المالية بأعلى درجات الدقة. تضمن خدماتنا الامتثال الكامل لقانون الشركات التجارية والأنظمة الاتحادية لدولة الإمارات.",
          inclusions: [
            "محاسب رئيسي أول معتمد مخصص لشركتك",
            "تقارير مالية شهرية (الأرباح والخسائر، الميزانية العمومية، التدفقات النقدية)",
            "مطابقة الحسابات البنكية، بطاقات الائتمان، والمحافظ الرقمية",
            "إدارة ومتابعة الذمم المدينة والدائنة والفواتير",
            "سجل الأصول الثابتة وجداول الإهلاك المحاسبي",
            "اجتماعات استشارية شهرية دورية لتقييم الوضع المالي وتوجيه النمو",
          ],
          regulatoryDeadlines: "تقارير إقفال شهرية أو ربع سنوية جاهزة للتدقيق المالي الفوري.",
          benefits: [
            "راحة بال تامة تتيح لك التركيز على توسيع وتطوير أعمالك",
            "سجلات وقوائم مالية خالية من الأخطاء وجاهزة لأي تدقيق رسمي",
            "متابعة دورية مستمرة للربحية والسيولة النقدية في الوقت الفعلي",
            "امتثال كامل لمتطلبات قانون الشركات التجارية في دولة الإمارات",
          ],
        },
        {
          id: "corporate-tax-advisory",
          title: "استشارات ضريبة الشركات (9%)",
          iconName: "TrendingUp",
          shortDesc: "استراتيجية شاملة، تسجيل إماراتاكس، الامتثال الكامل، والاستفادة من إعفاءات المناطق الحرة والمشاريع الصغيرة.",
          longDesc: "مع تطبيق ضريبة الشركات الاتحادية بنسبة 9% في الإمارات، أصبح التخطيط الضريبي أمراً حاسماً لكل مؤسسة. يقدم خبراؤنا استشارات دقيقة لهيكلة المعاملات، وحساب الالتزامات الضريبية، والتسجيل في منصة إماراتاكس، وتقديم الإقرارات في مواعيدها.",
          inclusions: [
            "تسجيل ضريبة الشركات لدى الهيئة الاتحادية للضرائب (FTA) عبر EmaraTax",
            "تقييم أثر ضريبة الشركات وتقديم المشورة الهيكلية للشركة",
            "توثيق سياسات التسعير التحويلي (Transfer Pricing) للمجموعات",
            "الاستفادة من تسهيلات الأعمال الصغيرة (Small Business Relief حتى 3 مليون درهم)",
            "تقييم الأهلية لنسبة 0% للشخص القائم في المنطقة الحرة المؤهلة (QFZP)",
            "إعداد ومراجعة وتقديم الإقرار الضريبي السنوي لضريبة الشركات في الموعد المحدد",
          ],
          regulatoryDeadlines: "يجب تقديم الإقرار الضريبي وسداد الضريبة خلال 9 أشهر من نهاية الفترة الضريبية.",
          benefits: [
            "هيكل ضريبي مُحسن قانونياً يقلل من إجمالي الالتزام الضريبي على أرباحك",
            "حماية تامة من غرامات عدم التسجيل أو التأخير التي تبلغ 10,000 درهم",
            "أقصى استفادة من المجموعات الضريبية ومزايا المناطق الحرة المؤهلة",
            "موقف ضريبي محمي وموثق بالكامل بناءً على القوانين والمراسيم الاتحادية",
          ],
        },
        {
          id: "vat-compliance",
          title: "الامتثال لضريبة القيمة المضافة واستردادها",
          iconName: "Percent",
          shortDesc: "تسجيل ضريبي فوري، وإعداد الإقرارات ربع السنوية، واسترداد المدخلات الضريبية لتجنب غرامات الهيئة الاتحادية.",
          longDesc: "تتطلب ضريبة القيمة المضافة بنسبة 5% في الإمارات تصنيفاً دقيقاً للمعاملات والامتثال الصارم للفواتير الضريبية. نتولى إدارة دورة ضريبة القيمة المضافة بالكامل لضمان الامتثال، واسترداد أكبر قدر من ضريبة المدخلات، وتجنب الجزاءات الإدارية.",
          inclusions: [
            "تسجيل وإلغاء تسجيل ضريبة القيمة المضافة لدى الهيئة الاتحادية للضرائب",
            "إعداد وتقديم الإقرارات الضريبية ربع السنوية والشهرية إلكترونياً",
            "تدقيق الفواتير الضريبية ومراجعة بيانات الموردين والعملاء والـ TRN",
            "تحسين استرداد ضريبة المدخلات لضمان استرجاع كل درهم مستحق لشركتك",
            "تقديم طلبات الإفصاح الطوعي واسترداد المبالغ الضريبية الزائدة",
            "التمثيل أمام الهيئة الاتحادية للضرائب أثناء إجراءات التدقيق والتقييم",
          ],
          regulatoryDeadlines: "يستحق الإقرار وسداد الضريبة خلال 28 يوماً من انتهاء الفترة الضريبية.",
          benefits: [
            "القضاء التام على مخاطر الجزاءات والغرامات الإدارية الصارمة من الهيئة",
            "تحسين التدفق النقدي من خلال استرداد ضريبة المدخلات المؤهلة غير المطالب بها",
            "معالجة دقيقة لآلية الاحتساب العكسي (Reverse Charge) للخدمات المستوردة",
            "تصنيف قانوني دقيق للسلع الخاضعة للنسبة الأساسية والنسبة الصفرية والمعفاة",
          ],
        },
        {
          id: "auditing-assurance",
          title: "خدمات التدقيق والضمان المالي",
          iconName: "ShieldCheck",
          shortDesc: "تدقيق قانوني معتمد للمناطق الحرة، والرقابة الداخلية، والتحقق المالي وفق معايير IFRS.",
          longDesc: "خدمات تدقيق حسابات مستقلة ومعتمدة للشركات في البر الرئيسي والمناطق الحرة في الإمارات. نتحقق من القوائم المالية وفق المعايير الدولية لإعداد التقارير المالية (IFRS) لتلبية متطلبات البنوك وسلطات التراخيص وضريبة الشركات.",
          inclusions: [
            "التدقيق القانوني السنوي للقوائم المالية لسلطات البر الرئيسي والمناطق الحرة",
            "تقارير مدقق معتمد لـ DMCC وMeydan وRAKEZ وIFZA وSHAMS واقتصادية دبي",
            "مراجعة التدقيق الداخلي، وتقييم مخاطر الاحتيال، واختبار أنظمة الرقابة الداخلية",
            "التدقيق لأغراض خاصة والتحقق المالي للمستثمرين وصفقات الاستحواذ",
            "خطاب الإدارة الذي يوضح أهم التوصيات لتطوير الضوابط التشغيلية والمحاسبية",
          ],
          regulatoryDeadlines: "تقديم تقرير التدقيق السنوي عند تجديد الرخصة أو حسب مواعيد المنطقة الحرة.",
          benefits: [
            "امتثال كامل 100% لمتطلبات التدقيق لدى سلطات التراخيص والمناطق الحرة",
            "تعزيز الثقة المصرفية وتسهيل الحصول على التسهيلات الائتمانية والتمويل",
            "إثبات الأهلية القانونية للاستفادة من نسبة 0% لضريبة الشركات في المناطق الحرة",
            "تعزيز الحوكمة وثقة المستثمرين ودقة تقييم الأعمال",
          ],
        },
        {
          id: "aml-goaml-compliance",
          title: "الامتثال لمكافحة غسل الأموال (goAML)",
          iconName: "FileCheck",
          shortDesc: "أطر مكافحة غسل الأموال، وسياسات اعرف عميلك (KYC)، والتسجيل في نظام goAML للأعمال والمهن غير المالية.",
          longDesc: "خدمات شاملة للامتثال لتشريعات مكافحة غسل الأموال وتمويل الإرهاب (AML/CFT) المخصصة للمهن والأنشطة غير المالية المحددة (DNFBPs)، بما في ذلك الوسطاء العقاريون، وتجار المعادن الثمينة، ومقدمو خدمات الشركات.",
          inclusions: [
            "التسجيل الإلزامي في بوابة goAML ونظام SACM التابع لوحدة المعلومات المالية بالإمارات",
            "صياغة سياسات التقييم المؤسسي لمخاطر غسل الأموال وتمويل الإرهاب",
            "إجراءات العناية الواجبة بالعملاء (CDD) والعناية المشددة (EDD) ونماذج KYC",
            "إرشادات تقديم تقارير المعاملات المشبوهة (STR) والأنشطة المشبوهة (SAR)",
            "تعيين وتأهيل مسؤول الامتثال وإعداد التقارير السنوية لوزارة الاقتصاد",
          ],
          regulatoryDeadlines: "تقييم سنوي للمخاطر ومراقبة مستمرة للمعاملات وفق اشتراطات وزارة الاقتصاد.",
          benefits: [
            "حماية شركتك من غرامات وزارة الاقتصاد الباهظة (من 50,000 إلى 5,000,000+ درهم)",
            "جاهزية فورية لعمليات التفتيش والرقابة الحكومية ومراجعات البنوك",
            "تسريع وتأمين استقبال العملاء والمستثمرين الدوليين رفيعي المستوى",
            "التوافق التام مع المرسوم بقانون اتحادي رقم 20 لسنة 2018 ولائحته التنفيذية",
          ],
        },
        {
          id: "backlog-accounting",
          title: "تسوية الحسابات المتراكمة والقيود السابقة",
          iconName: "Clock",
          shortDesc: "إعادة بناء الحسابات غير المسجلة، ومطابقة الكشوفات البنكية، وتجهيز الدفاتر الجاهزة للتدقيق الضريبي.",
          longDesc: "إعادة بناء مالي سريع واحترافي للشركات التي لديها فترات غير مسجلة أو حسابات متراكمة لشهور أو سنوات سابقة. نقوم بمطابقة الفواتير المفقودة والكشوفات البنكية وإعداد الميزانيات الافتتاحية المطلوبة لضريبة الشركات.",
          inclusions: [
            "استخراج كشوف الحسابات البنكية التاريخية ومطابقة كافة الحركات المالية",
            "إعادة بناء فواتير المبيعات والمصروفات والأصول من تاريخ التأسيس أو الفترات السابقة",
            "معالجة وتصحيح الحسابات المعلقة، وفروقات ضريبة القيمة المضافة، والالتزامات غير المسجلة",
            "إعداد الميزانية العمومية الافتتاحية وقائمة الأرباح والخسائر النهائية المعتمدة",
            "الترحيل السلس إلى برامج المحاسبة السحابية الحديثة (Zoho Books, QuickBooks, Xero, Wafeq)",
          ],
          regulatoryDeadlines: "يُنصح بالتنفيذ الفوري قبل انتهاء المواعيد النهائية لإقرارات ضريبة الشركات.",
          benefits: [
            "التخلص من القلق والمخاطر القانونية المترتبة على عدم مسك الدفاتر المحاسبية",
            "إصدار قوائم مالية معتمدة ومطابقة لمتطلبات تقديم الإقرار الضريبي لـ FTA",
            "الحصول على صورة مالية دقيقة وواضحة لربحية الشركة والتدفقات النقدية السابقة",
            "الانتقال السلس إلى خطة اشتراك محاسبي شهري منتظمة وموفرة للتكاليف",
          ],
        },
        {
          id: "business-incorporation",
          title: "تأسيس الشركات وتراخيص الأعمال",
          iconName: "Building",
          shortDesc: "تأسيس الشركات من البداية للنهاية في البر الرئيسي، والمناطق الحرة، والشركات الخارجية في كافة إمارات الدولة.",
          longDesc: "يوفر إطلاق شركة في الإمارات فرصاً استثنائية ولكنه يتطلب إنجاز معاملات قانونية وتنظيمية دقيقة. تتولى شركة دياز للمحاسبة تسهيل هذه العملية بالكامل من اختيار المنطقة الحرة المناسبة والتراخيص وفتح الحسابات البنكية وهيكلة الامتثال.",
          inclusions: [
            "دراسة جدوى واختيار النطاق القضائي الأمثل (بر رئيسي / منطقة حرة / أوفشور)",
            "حجز الاسم التجاري والموافقات المبدئية لدى دوائر التنمية الاقتصادية",
            "صياغة وتوثيق عقد التأسيس (MOA) والاتفاقيات القانونية",
            "استخراج بطاقة المنشأة وإجراءات تأشيرات الإقامة للمستثمرين والموظفين",
            "المساعدة في فتح الحساب البنكي للشركات لدى كبرى البنوك الإماراتية",
            "مواءمة الهيكل التأسيسي مع تشريعات الضرائب ومكافحة غسل الأموال (AML)",
          ],
          regulatoryDeadlines: "تجديد الرخصة التجارية سنوياً وفقاً لمتطلبات سلطة الترخيص المختصة.",
          benefits: [
            "شركة متوافقة قانونياً بنسبة 100% من اليوم الأول وجاهزة لأي تدقيق",
            "إنجاز سريع وسلس بفضل علاقاتنا المباشرة مع الجهات والدوائر الحكومية",
            "اختيار استراتيجي للمنطقة الحرة لتعظيم المزايا الضريبية لضريبة الشركات",
            "شفافية مطلقة في الرسوم وبدون أي تكاليف تأسيس خفية",
          ],
        },
        {
          id: "cfo-advisory",
          title: "المدير المالي الخارجي والاستشارات الاستراتيجية",
          iconName: "Briefcase",
          shortDesc: "قيادة مالية تنفيذية، تحسين التدفقات النقدية، الميزانيات التقديرية، والتقارير الجاهزة للمستثمرين.",
          longDesc: "احصل على خبرات مالية استراتيجية رفيعة المستوى دون تكلفة توظيف مدير مالي بدوام كامل. تُمكّن خدمة المدير المالي التنفيذي الخارجي أصحاب الشركات من تحسين التدفقات النقدية، وجذب الاستثمارات، والتوسع بأعلى ربحية.",
          inclusions: [
            "مراجعة شهرية للأداء المالي التنفيذي وإعداد تقارير مجلس الإدارة",
            "توقعات التدفقات النقدية المتجددة لمدة 12 شهراً وإدارة رأس المال العامل",
            "الميزانيات التقديرية للأقسام، وتحليل خفض التكاليف، ومؤشرات الأداء KPI",
            "النمذجة المالية، وتقييم الشركات، وتجهيز العروض المالية للمستثمرين",
            "المفاوضات المصرفية، وهيكلة التسهيلات الائتمانية، وتحسين رسوم بوابات الدفع",
          ],
          regulatoryDeadlines: "اجتماعات دورية شهرية وربع سنوية مع الإدارة التنفيذية وتحديث التوقعات المالية.",
          benefits: [
            "قيادة مالية خبيرة ومحترفة بجزء بسيط من تكلفة التوظيف التنفيذي الكامل",
            "وضوح استراتيجي مبني على البيانات لاتخاذ قرارات التوظيف والتوسع بثقة",
            "تعظيم هوامش الربح الإجمالية وإلغاء النفقات التشغيلية غير الضرورية",
            "تقارير مالية بمعايير استثمارية عالمية تسرّع جولات التمويل والائتمان",
          ],
        },
      ],
    },
    about: {
      badge: "ميزة دياز للمحاسبة",
      title: "لماذا تنمو أعمال شركائنا",
      titleLine2: "بأمان وذكاء معنا",
      description:
        "في شركة دياز للمحاسبة والاستشارات الضريبية، نحن لا نكتفي بتسجيل الأرقام، بل نهندس النمو المالي. نجمع بين الخبرة العميقة في القوانين الضريبية الإماراتية وأحدث الأنظمة المحاسبية لنمنحك امتثالاً قوياً وتوفيراً ضريبياً مشروعاً.",
      accuracyStat: "99.8%",
      accuracyLabel: "نسبة دقة القيود المحاسبية",
      slaStat: "4 ساعات",
      slaLabel: "متوسط وقت الاستجابة لاستفسارات العملاء",
      trustStatement: "مستشارون ضريبيون معتمدون وخبراء محاسبون قانونيون (CPA / ACCA) يخدمون قطاع الأعمال من مقرنا في الخليج التجاري، دبي.",
      pillarsTitle: "أركان تميزنا الأربعة",
      pillars: [
        {
          title: "معتمدون ومسجلون لدى الهيئة الاتحادية",
          description: "نضمن مطابقة إقراراتك وسجلاتك بنسبة 100% لمتطلبات وتشريعات الهيئة الاتحادية للضرائب.",
          bullets: ["ممارسات معتمدة لدى FTA", "تدقيق ضريبي بلا قلق"],
        },
        {
          title: "سجلات وقوائم مالية محمية وجاهزة للتدقيق",
          description: "كل قيد محاسبي مدعوم بوثائق وفواتير ضريبية نظامية ومطابقة كاملة لمعايير IFRS الدولية.",
          bullets: ["دفاتر مطابقة لمعايير IFRS", "فواتير ضريبية نظامية"],
        },
        {
          title: "أسعار ثابتة وشفافة بدون مفاجآت",
          description: "لا توجد فواتير غير متوقعة. باقات شهرية واضحة ومحددة تناسب حجم معاملات شركتك.",
          bullets: ["رسوم شهرية واضحة", "بدون تكاليف خفية"],
        },
        {
          title: "حلول مؤسسية متكاملة من مكان واحد",
          description: "من تأسيس الشركة ومسك الدفاتر الشهرية إلى إقرارات القيمة المضافة وضريبة الشركات واستشارات الإدارة المالية.",
          bullets: ["دورة مؤسسية متكاملة", "استشارات مالية استراتيجية"],
        },
      ],
    },
    pricing: {
      badge: "باقات واضحة وشفافة",
      title: "حلول محاسبية متكاملة بأسعار ثابتة",
      subtitle: "رسوم شهرية محددة تمنح الشركات الناشئة والمتوسطة في دبي امتثالاً مالياً كاملاً بدون تكاليف إضافية غير متوقعة.",
      monthly: "الدفع الشهري",
      annual: "الدفع السنوي",
      annualSavingsBadge: "وفر 20% + إعداد ضريبي مجاني",
      popularBadge: "الأكثر طلباً",
      getStartedBtn: "اختر هذه الباقة",
      customAdvisoryTitle: "هل تحتاج لمعالجة قيود متراكمة (Backlog) أو باقة خاصة؟",
      customAdvisoryDesc: "هل لديك عدة شركات، أو حجم معاملات ضخم، أو حسابات متأخرة لسنوات سابقة؟ احصل على عرض تدقيق مخصص خلال ساعتين فقط.",
      customAdvisoryBtn: "طلب عرض مخصص للشركات",
      tiers: [
        {
          id: "starter",
          name: "باقة البداية (Starter)",
          price: "500",
          annualPrice: "5,000",
          period: "شهر",
          description: "خدمات المحاسبة الأساسية ومسك الدفاتر والامتثال الأولي للشركات الناشئة والصغيرة.",
          features: [
            "حتى 50 معاملة تجارية شهرياً",
            "مطابقة دورية لدفاتر الأستاذ والحسابات",
            "تقارير الأرباح والخسائر والميزانية العمومية القياسية",
            "دعم مباشر من محاسب مساعد مخصص",
            "دعم التسجيل الأساسي لضريبة الشركات في إماراتاكس",
            "الربط مع البرامج المحاسبية (وافق / زوهو بوكس)",
          ],
        },
        {
          id: "growth",
          name: "باقة نمو الشركات (Growth)",
          price: "800",
          annualPrice: "8,000",
          period: "شهر",
          description: "محاسبة شاملة وإدارة ضريبية استباقية وإقرارات ضريبة القيمة المضافة للشركات المتوسعة.",
          features: [
            "حتى 200 معاملة تجارية شهرياً",
            "تحديث ومطابقة أسبوعية للسجلات والدفاتر",
            "إعداد وتقديم الإقرارات الدورية لضريبة القيمة المضافة",
            "محاسب ضريبي أول مخصص لشركتك",
            "تقييم أثر ضريبة الشركات وهيكلة الإعفاءات",
            "لوحة تحليلات مالية وتقارير إدارية شهرية مخصصة",
            "دعم غير محدود عبر البريد الإلكتروني والهاتف",
            "تغطية التمثيل أثناء استفسارات التدقيق المالي",
          ],
          popular: true,
        },
        {
          id: "enterprise",
          name: "باقة كبار الأعمال (Enterprise)",
          price: "1,000",
          annualPrice: "10,000",
          period: "شهر",
          description: "ذكاء مالي مؤسسي، تخطيط ضريبي متقدم، واستشارات المدير المالي الاستراتيجي (CFO).",
          features: [
            "معاملات غير محدودة شهرياً",
            "مسك دفاتر يومي ومطابقة بنكية نشطة ومستمرة",
            "إقرارات ضريبة القيمة المضافة وضريبة الشركات بالكامل",
            "توثيق وإقرارات ضريبة الشركات الشاملة والامتثال الضريبي",
            "جلسات استشارية مباشرة مع المدير التنفيذي للضرائب",
            "استشارات المدير المالي (CFO) والتنبؤ بالسيولة",
            "التنسيق الكامل والجاهزية لمدققي الحسابات الخارجيين",
            "أولوية دعم قصوى مع وقت استجابة خلال 4 ساعات",
          ],
        },
      ],
    },
    calculator: {
      headerTitle: "مخطط الضرائب الإماراتي",
      headerBadge: "جاهز للعام المالي 2026",
      tabCorporateTax: "ضريبة الشركات (9%)",
      tabVat: "ضريبة القيمة المضافة (5%)",
      ctTitle: "حاسبة ضريبة الشركات في دولة الإمارات",
      ctSubtitle: "احسب تقدير ضريبة الشركات 9% وفقاً للمرسوم بقانون اتحادي رقم 47 لسنة 2022.",
      annualProfitLabel: "صافي الأرباح السنوية المتوقعة (درهم إماراتي):",
      reliefBannerTitle: "مؤهل لتسهيلات الأعمال الصغيرة (< 3 مليون درهم إيرادات)",
      reliefBannerDesc: "المؤسسات التي يقل إجمالي إيراداتها عن 3,000,000 درهم يمكنها اختيار عدم خضوع أرباحها للضريبة حتى ديسمبر 2026.",
      tier0Label: "الشريحة المعفاة 0% (من 0 إلى 375,000 درهم):",
      tier9Label: "الشريحة الخاضعة للضريبة 9% (ما زاد عن 375,000 درهم):",
      estTaxLiability: "قيمة الضريبة التقديرية المستحقة:",
      effectiveRate: "نسبة الضريبة الفعلية:",
      bookStrategySession: "احجز جلسة استشارية لتحسين وفوراتك الضريبية",
      vatSalesLabel: "المبيعات الخاضعة للضريبة في الربع (درهم إماراتي):",
      vatExpensesLabel: "المصروفات الخاضعة للضريبة في الربع (درهم إماراتي):",
      vatOutput: "ضريبة المخرجات المحصلة (5% من المبيعات):",
      vatInput: "ضريبة المدخلات القابلة للاسترداد (5% من المصروفات):",
      vatNetPayable: "صافي الضريبة واجبة السداد للهيئة:",
      vatRefundEligible: "صافي المبلغ المستحق للاسترداد من الهيئة:",
    },
    leadMagnet: {
      badge: "دليل تنفيذي مجاني للامتثال الضريبي",
      title: "حمّل دليل الامتثال لضريبة الشركات والقيمة المضافة 2026",
      description:
        "دليل عملي وتطبيقي من 15 صفحة أعده خبراء شركة دياز للمحاسبة يغطي مواعيد التسجيل في إماراتاكس، وشروط الإعفاء 0% في المناطق الحرة المؤهلة، وتسهيلات الأعمال الصغيرة حتى 3 مليون درهم، وقواعد استرداد ضريبة المدخلات 100%.",
      point1: "تسهيلات الأعمال الصغيرة (3 مليون درهم)",
      point2: "شروط نسبة 0% في المناطق الحرة المؤهلة",
      point3: "قائمة فحص الفواتير الضريبية ذات الـ 10 نقاط",
      downloadBtn: "تحميل الدليل مجاناً (PDF فوري)",
      riskAuditBtn: "إجراء تدقيق المخاطر في 60 ثانية",
    },
    testimonials: {
      badge: "تقييمات وآراء العملاء",
      title: "يثق بنا رواد الأعمال الأكثر طموحاً في دبي",
      subtitle: "اكتشف لماذا تعتمد أكثر من 500 شركة في الإمارات على المستشار غلين دياز وفريقنا لضمان صفر غرامات وتحقيق أعلى وفورات قانونية.",
      verifiedGoogleBadge: "تقييم 5.0★ موثق على Google Business",
      viewOnGoogle: "عرض التقييمات على Google",
    },
    faqs: {
      badge: "هل لديك أسئلة؟",
      title: "الأسئلة الأكثر شيوعاً",
      subtitle: "إجابات واضحة ومباشرة حول ضريبة الشركات، وضريبة القيمة المضافة، ومسك الدفاتر في دولة الإمارات.",
      stillHaveQuestions: "هل لديك استفسار محدد حول الوضع الضريبي لشركتك؟",
      chatWithGlen: "تحدث مع المستشار غلين عبر واتساب",
      items: [
        {
          id: "faq-1",
          question: "من الملزم بالتسجيل لضريبة الشركات في دولة الإمارات؟",
          answer:
            "وفقاً للمرسوم بقانون اتحادي رقم 47 لسنة 2022، فإن جميع الأشخاص الاعتباريين (بما في ذلك شركات البر الرئيسي ذ.م.م، وشركات المناطق الحرة، والشركات الأوفشور) ملزمون قانوناً بالتسجيل لضريبة الشركات لدى الهيئة الاتحادية للضرائب (FTA)، بغض النظر عن حجم الأرباح أو الإيرادات. ويفرض التأخير غرامة إدارية إلزامية قدرها 10,000 درهم.",
        },
        {
          id: "faq-2",
          question: "هل يمكن لشركات المناطق الحرة الاستفادة من نسبة ضريبة شركات 0%؟",
          answer:
            "نعم، يمكن للشخص القائم في المنطقة الحرة الاستفادة من نسبة 0% على 'الدخل المؤهل' إذا استوفى شروط 'الشخص القائم في المنطقة الحرة المؤهلة' (QFZP): مثل وجود واقع اقتصادي كافٍ داخل الدولة، وتحقيق دخل مؤهل، وإعداد قوائم مالية مدققة، والالتزام بقواعد التسعير التحويلي.",
        },
        {
          id: "faq-3",
          question: "ما هي تسهيلات الأعمال الصغيرة (Small Business Relief) وهل تنطبق علي؟",
          answer:
            "تتيح تسهيلات الأعمال الصغيرة للأشخاص الخاضعين للضريبة المقيمين في الإمارات، الذين لا تتجاوز إيراداتهم الإجمالية 3,000,000 درهم في الفترة الضريبية، اختيار معاملتهم كأشخاص ليس لديهم دخل خاضع للضريبة (ضريبة 0%). يسري هذا التسهيل حتى 31 ديسمبر 2026 ويجب المطالبة به صراحة في الإقرار الضريبي السنوي.",
        },
        {
          id: "faq-4",
          question: "ما هو الموعد النهائي لتقديم إقرار وسداد ضريبة الشركات؟",
          answer:
            "يجب تقديم الإقرار الضريبي وسداد الضريبة المستحقة خلال مهلة أقصاها 9 أشهر من تاريخ انتهاء السنة المالية للشركة. بالنسبة للشركات التي تتبع السنة الميلادية (1 يناير – 31 ديسمبر)، فإن الموعد النهائي للإقرار هو 30 سبتمبر من العام التالي.",
        },
        {
          id: "faq-5",
          question: "متى تصبح الشركة ملزمة بالتسجيل في ضريبة القيمة المضافة (VAT)؟",
          answer:
            "التسجيل إلزامي عندما تتجاوز التوريدات الخاضعة للضريبة والواردات مبلغ 375,000 درهم خلال الأشهر الـ 12 السابقة. والتسجيل اختياري عند تجاوز 187,500 درهم. مزاولة الأعمال فوق حد التسجيل الإلزامي دون تسجيل يستوجب غرامة تلقائية قدرها 10,000 درهم.",
        },
        {
          id: "faq-6",
          question: "كيف تعمل باقات المحاسبة الشهرية والخدمات الضريبية لديكم؟",
          answer:
            "نخصص لشركتك محاسباً أول معتمداً ومستشاراً ضريبياً. نقوم بالربط مع نظامك المحاسبي (وافق، زوهو، زيرو، كويك بوكس)، ومطابقة القيود أسبوعياً وشهرياً، وإصدار قوائم مالية جاهزة للتدقيق، وإعداد وتقديم كافة إقرارات ضريبة القيمة المضافة وضريبة الشركات في مواعيدها المحددة.",
        },
      ],
    },
    blogs: {
      badge: "مركز المعرفة والأنظمة",
      title: "أحدث المقالات والأدلة الضريبية في الإمارات",
      subtitle: "ابقَ على اطلاع دائم بقرارات الهيئة الاتحادية للضرائب والمراسيم الوزارية واستراتيجيات الامتثال المالي.",
      readArticle: "قراءة الدليل كاملاً",
      minRead: "دقائق قراءة",
      items: [
        {
          id: "uae-corporate-tax-guide",
          title: "دليلك الشامل لضريبة الشركات في الإمارات: كل ما تحتاج معرفته للمشاريع الصغيرة والمتوسطة",
          summary: "تعرف على القواعد الأساسية لنظام ضريبة الشركات 9%، وحد الإعفاء 375,000 درهم، وشروط الاستفادة من تسهيلات الأعمال الصغيرة.",
          content: `مع دخول ضريبة الشركات الاتحادية حيز التطبيق في دولة الإمارات، تدخل الشركات الصغيرة والمتوسطة مرحلة جديدة من الامتثال المالي...`,
          date: "2 يوليو 2026",
          readTime: "5 دقائق قراءة",
          tag: "ضريبة الشركات",
          author: {
            name: "غلين دياز",
            role: "المدير التنفيذي للضرائب",
            avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=120",
          },
        },
        {
          id: "vat-compliance-checklist",
          title: "قائمة الفحص الشاملة لضريبة القيمة المضافة للشركات في الإمارات",
          summary: "تجنب غرامات الهيئة الاتحادية للضرائب. راجع قائمة الفحص الميدانية للفواتير الضريبية، وضريبة المخرجات، واسترداد المدخلات وحفظ السجلات.",
          content: `منذ تطبيق ضريبة القيمة المضافة بنسبة 5% في 2018، أصبحت جزءاً لا يتجزأ من إدارة الأعمال في الدولة...`,
          date: "18 يونيو 2026",
          readTime: "4 دقائق قراءة",
          tag: "ضريبة القيمة المضافة",
          author: {
            name: "غلين دياز",
            role: "مستشار أول للضرائب",
            avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=120",
          },
        },
        {
          id: "choosing-uae-jurisdiction",
          title: "اختيار النطاق القضائي لتأسيس شركتك: مقارنة بين البر الرئيسي والمناطق الحرة",
          summary: "تقييم الأثر الضريبي لضريبة الشركات، وهياكل الملكية الأجنبية 100%، والحرية التجارية لاتخاذ القرار الأمثل لإطلاق مشروعك.",
          content: `يعد تأسيس شركة جديدة في الإمارات خطوة واعدة واستثمارية استثنائية. توفر الدولة خيارين رئيسيين للتأسيس...`,
          date: "29 مايو 2026",
          readTime: "6 دقائق قراءة",
          tag: "تأسيس الشركات",
          author: {
            name: "مايكل تشين",
            role: "مدير خدمات الشركات",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120",
          },
        },
      ],
    },
    contact: {
      badge: "تواصل معنا اليوم",
      title: "دعنا نحسن وضعك الضريبي والمحاسبي",
      subtitle: "تحدث مباشرة مع المستشار الضريبي الأول غلين دياز. نرد على استفساراتك خلال 4 ساعات مع نصائح وحلول واضحة.",
      formTitle: "احجز استشارتك المجانية لمدة 15 دقيقة",
      fullNameLabel: "الاسم الكامل *",
      fullNamePlaceholder: "مثال: محمد الهاشمي",
      emailLabel: "البريد الإلكتروني للعمل *",
      emailPlaceholder: "name@company.ae",
      phoneLabel: "رقم الهاتف / الواتساب *",
      phonePlaceholder: "+971 50 123 4567",
      serviceLabel: "الخدمة المطلوبة",
      selectServiceOption: "اختر نوع الخدمة...",
      messageLabel: "أخبرنا عن شركتك ونطاق أعمالك والوضع الضريبي الحالي",
      messagePlaceholder: "مثال: نحن شركة منطقة حرة نبحث عن تسجيل ضريبة الشركات ومسك الدفاتر شهرياً...",
      submitBtn: "إرسال طلب الاستشارة المجانية",
      submittingBtn: "جاري إرسال البيانات...",
      successTitle: "تم استلام طلبك بنجاح!",
      successMessage: "شكراً لك! تلقى المستشار غلين دياز بياناتك وسيتواصل معك مباشرة عبر الواتساب أو البريد الإلكتروني قريباً.",
      officeAddressTitle: "موقع مكتبنا الرئيسي",
      officeAddress: "برج برايم، الخليج التجاري (Business Bay)، دبي، دولة الإمارات العربية المتحدة",
      workingHoursTitle: "ساعات العمل الرسمية",
      workingHours: "من الإثنين إلى الجمعة: 9:00 صباحاً – 6:00 مساءً (توقيت الإمارات)",
      directContactTitle: "دعم فوري ومباشر",
      directContactDesc: "هل لديك موعد نهائي وشيك لدى الهيئة الاتحادية للضرائب؟",
      whatsappGlen: "تحدث فوراً عبر واتساب (+971 52 922 6958)",
      orScheduleCall: "أو اختر موعداً مناسباً مباشرة في جدولنا:",
    },
    footer: {
      description: "شركة دياز للمحاسبة والاستشارات الضريبية ش.ذ.م.م هي شركة استشارات مالية وضريبية رائدة مقرها الخليج التجاري، دبي. مستشارون ضريبيون معتمدون يقدمون دقة محاسبية متوافقة 100% مع أنظمة الهيئة الاتحادية للضرائب في الإمارات.",
      quickLinksTitle: "روابط سريعة",
      servicesTitle: "خدماتنا",
      ftaRegistrationNotice: "وكالة ضريبية واستشارات معتمدة ومسجلة لدى الهيئة الاتحادية للضرائب (FTA)، دولة الإمارات.",
      rightsReserved: "جميع الحقوق محفوظة.",
      privacyPolicy: "سياسة الخصوصية",
      termsOfService: "الشروط والأحكام",
    },
    mobileBar: {
      whatsapp: "واتساب المستشار",
      taxAudit: "تدقيق ضريبي مجاني",
      callDirectly: "اتصل بالمكتب",
    },
  },
};

import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronRight,
  Minus,
  Plus,
  ShieldCheck,
  Star,
  UserCheck,
} from "lucide-react";
import PageNavigation from "../components/PageNavigation";
import PageFooter from "../components/PageFooter";
import SameDayQuoteBox from "../components/SameDayQuoteBox";
import {
  applyPageSEO,
  buildBreadcrumbSchema,
  buildFAQPageSchema,
  FAQSchemaItem,
  removeJsonLd,
  upsertJsonLd,
} from "../lib/seo";

interface PricingPageProps {
  onNavigate: (path: string) => void;
  onOpenAudit?: () => void;
  onOpenPrivacy?: () => void;
  onOpenGooglePreferred?: () => void;
}

type ServiceCategory = "monthly" | "backlog" | "standalone";
type BillingPeriod = "monthly" | "annual";

interface PricingTier {
  id: string;
  name: string;
  bestFor: string;
  priceMonthly?: string;
  priceAnnual?: string;
  fixedPrice?: string;
  unit: string;
  billingNoteMonthly?: string;
  billingNoteAnnual?: string;
  fixedBillingNote?: string;
  popular?: boolean;
  ctaLabel: string;
  features: string[];
}

const MONTHLY_TIERS: PricingTier[] = [
  {
    id: "business-starter",
    name: "Business Starter",
    bestFor: "Best for new UAE startups and solo founders.",
    priceAnnual: "400",
    priceMonthly: "500",
    unit: "/ month",
    billingNoteAnnual: "Billed AED 4,000 / year + 5% VAT",
    billingNoteMonthly: "Billed monthly at AED 500 + 5% VAT",
    ctaLabel: "Get Started",
    features: [
      "Monthly IFRS double-entry bookkeeping",
      "Bank & card reconciliation (up to 50 txns/mo)",
      "Monthly Balance Sheet & P&L statements",
      "Annual Corporate Tax return & 0% SBR election",
      "Dedicated Senior Accountant email support",
    ],
  },
  {
    id: "corporate-growth",
    name: "Corporate Growth",
    bestFor: "Best for growing SMEs with active VAT & CT.",
    priceAnnual: "600",
    priceMonthly: "750",
    unit: "/ month",
    billingNoteAnnual: "Billed AED 6,000 / year + 5% VAT",
    billingNoteMonthly: "Billed monthly at AED 750 + 5% VAT",
    popular: true,
    ctaLabel: "Get Started",
    features: [
      "Everything in Business Starter included",
      "Quarterly VAT 201 preparation & EmaraTax filing",
      "Input VAT recovery & invoice compliance check",
      "Annual Corporate Tax filing & 9% adjustments",
      "UAE E-Invoicing Phase 1 readiness guidance",
      "Priority phone & direct advisor support",
    ],
  },
  {
    id: "enterprise-cfo",
    name: "Enterprise & CFO Advisory",
    bestFor: "Best for multi-license groups and Free Zone QFZPs.",
    priceAnnual: "1,000",
    priceMonthly: "1,250",
    unit: "/ month",
    billingNoteAnnual: "Billed AED 10,000 / year + 5% VAT",
    billingNoteMonthly: "Billed monthly at AED 1,250 + 5% VAT",
    ctaLabel: "Book Consultation",
    features: [
      "Everything in Corporate Growth included",
      "Monthly fractional CFO review & cash forecasts",
      "0% Free Zone QFZP substance & De Minimis review",
      "Statutory audit file & external auditor liaison",
      "Connected Persons & Related Party review",
      "Managing Partner oversight & board reporting",
    ],
  },
];

const BACKLOG_TIERS: PricingTier[] = [
  {
    id: "single-fy-backlog",
    name: "Single FY Backlog + CT",
    bestFor: "Best for 12-month catch-up and EmaraTax CT filing.",
    fixedPrice: "2,500",
    unit: "/ financial year",
    fixedBillingNote: "Starting fee (up to 150 txns/yr) + 5% VAT",
    popular: true,
    ctaLabel: "Get Started",
    features: [
      "12-month bank & card ledger reconstruction",
      "IFRS-compliant Balance Sheet and P&L",
      "0% Small Business Relief qualification check",
      "Official Corporate Tax filing on EmaraTax",
      "Completed within 5 to 7 business days",
    ],
  },
  {
    id: "multi-year-backlog",
    name: "Multi-Year Catch-Up (2 FYs)",
    bestFor: "Best for unreconciled books since incorporation.",
    fixedPrice: "4,800",
    unit: "/ 2 financial years",
    fixedBillingNote: "Starting fee for 2 fiscal years + 5% VAT",
    ctaLabel: "Get Started",
    features: [
      "24-month ledger & multi-account reconciliation",
      "Opening balance setup & shareholder loan cleanup",
      "Filing of 2 consecutive Corporate Tax returns",
      "Historical VAT compliance & threshold review",
      "Audit-ready trial balance & supporting schedules",
    ],
  },
  {
    id: "ecommerce-cleanup",
    name: "High-Volume & E-Commerce",
    bestFor: "Best for Stripe, Amazon & Noon online retailers.",
    fixedPrice: "7,500",
    unit: "/ project",
    fixedBillingNote: "Starting fee for multi-channel ledgers + 5% VAT",
    ctaLabel: "Book Consultation",
    features: [
      "Payment gateway settlement reconciliations",
      "COGS, shipping & inventory valuation adjustments",
      "Cross-border & marketplace VAT reconciliation",
      "Full IFRS statements & Corporate Tax computation",
      "Dedicated senior reconstruction lead",
    ],
  },
];

const STANDALONE_TIERS: PricingTier[] = [
  {
    id: "microbiz-ct",
    name: "MicroBiz Corporate Tax",
    bestFor: "Best for SMEs under AED 3M claiming 0% SBR.",
    fixedPrice: "500",
    unit: "/ filing",
    fixedBillingNote: "One-time annual filing + 5% VAT",
    ctaLabel: "Get Started",
    features: [
      "Small Business Relief (SBR) eligibility check",
      "EmaraTax Corporate Tax return preparation",
      "0% tax election submission with the FTA",
      "Late-registration penalty mitigation check",
      "FTA submission receipt & archive copy",
    ],
  },
  {
    id: "qfzp-shield-pro",
    name: "QFZP Shield Pro",
    bestFor: "Best for Free Zone entities protecting 0% status.",
    fixedPrice: "1,499",
    unit: "/ annual review",
    fixedBillingNote: "Annual structuring & compliance + 5% VAT",
    popular: true,
    ctaLabel: "Get Started",
    features: [
      "Qualifying vs. non-qualifying income mapping",
      "De Minimis rule test (5% or AED 5M cap)",
      "Adequate substance & office verification",
      "Transfer Pricing disclosure form alignment",
      "Written QFZP compliance memorandum",
    ],
  },
  {
    id: "audit-readiness",
    name: "Statutory Audit Readiness",
    bestFor: "Best for Mainland & Free Zone annual renewals.",
    fixedPrice: "Custom",
    unit: "/ engagement",
    fixedBillingNote: "Scoped to license & transaction volume",
    ctaLabel: "Book Consultation",
    features: [
      "Pre-audit ledger scrub & IFRS compliance review",
      "Direct liaison with UAE-approved auditors",
      "Audit findings remediation & adjusting entries",
      "DIFC / DTEC dividend & statutory audit prep",
      "Signed financial statements for license renewal",
    ],
  },
];

interface ComparisonRow {
  capability: string;
  starter: string;
  growth: string;
  enterprise: string;
}

const COMPARISON_ROWS: ComparisonRow[] = [
  {
    capability: "Monthly IFRS Double-Entry Bookkeeping",
    starter: "Included",
    growth: "Included",
    enterprise: "Included",
  },
  {
    capability: "Monthly Balance Sheet & P&L Statements",
    starter: "Included",
    growth: "Included",
    enterprise: "Included + Forecasts",
  },
  {
    capability: "Annual Corporate Tax (9% & 0% SBR) Return",
    starter: "Included",
    growth: "Included",
    enterprise: "Included + Structuring",
  },
  {
    capability: "Quarterly VAT 201 Return Filing",
    starter: "Optional Add-on",
    growth: "Included",
    enterprise: "Included",
  },
  {
    capability: "Input VAT Recovery & Invoice Review",
    starter: "Not included",
    growth: "Included",
    enterprise: "Included",
  },
  {
    capability: "UAE E-Invoicing Phase 1 Readiness",
    starter: "Basic Guidance",
    growth: "Full Setup",
    enterprise: "Full Setup & ASP",
  },
  {
    capability: "0% Free Zone QFZP Substance Review",
    starter: "Not included",
    growth: "Optional Add-on",
    enterprise: "Included",
  },
  {
    capability: "Statutory Audit File Preparation",
    starter: "Not included",
    growth: "Optional Add-on",
    enterprise: "Full Auditor File",
  },
  {
    capability: "Advisory Channel & Response SLA",
    starter: "Email (48h)",
    growth: "Email & Direct (24h)",
    enterprise: "Dedicated CFO & Call",
  },
];

const FEATURED_PRICING_FAQS: FAQSchemaItem[] = [
  {
    question:
      "How much do accounting and tax services cost for a small business in Dubai & UAE in 2026?",
    answer:
      "In 2026, fixed-fee monthly IFRS bookkeeping, 5% UAE VAT Form 201 returns, and EmaraTax Corporate Tax filings start from AED 400/month (Starter), AED 600–750/month (Growth VAT + CT), and AED 1,250/month (QFZP Audit-Ready), all managed by FTA-Registered Tax Agents with zero hourly surprises.",
  },
  {
    question: "What is included in Dias Accounting's AED 400/month package?",
    answer:
      "Dias Accounting's AED 400/month Starter package includes monthly IFRS double-entry bookkeeping, bank and card reconciliation, monthly Profit & Loss and Balance Sheet statements, 0% Small Business Relief (SBR) election for revenue up to AED 3,000,000, and annual Corporate Tax return filing on EmaraTax.",
  },
];

const PRICING_FAQS: FAQSchemaItem[] = [
  {
    question: "What is included in Dias Accounting's fixed-fee accounting packages in Dubai?",
    answer:
      "Our monthly retainers (starting from AED 400 to AED 1,250/month) cover a dedicated chartered accountant, cloud software setup (Zoho Books, QuickBooks, Xero), monthly bank and card reconciliations, IFRS Profit & Loss and Balance Sheet statements, quarterly VAT 201 return filings on applicable tiers, and annual Corporate Tax return preparation on EmaraTax. There are zero hourly fees or surprise billing charges.",
  },
  {
    question: "How much does corporate tax filing cost for UAE Mainland and Free Zone companies?",
    answer:
      "For businesses maintaining clean monthly books with Dias Accounting, annual Corporate Tax return filing is bundled into our monthly retainers. For standalone filings without monthly bookkeeping, our MicroBiz SBR filing is a flat AED 500, and our QFZP Shield Pro Free Zone structuring review is AED 1,499.",
  },
  {
    question: "Are Corporate Tax returns (9%) and VAT 201 filings included in the monthly fee?",
    answer:
      "Yes. Our Corporate Growth and Enterprise plans include full quarterly VAT 201 return submissions and annual Corporate Tax return filing on the FTA EmaraTax portal. Business Starter (from AED 400/month billed annually) covers ongoing IFRS bookkeeping and annual Corporate Tax filing, with quarterly VAT available as an add-on.",
  },
  {
    question: "What are the penalties if my UAE company delays historical backlog bookkeeping?",
    answer:
      "Under Cabinet Decision No. 75 of 2023, failing to register for Corporate Tax on time incurs an automatic AED 10,000 fine, and failing to maintain proper accounting records triggers penalties starting at AED 10,000. Our Backlog Catch-Up packages (from AED 2,500/year) reconstruct missing ledgers within 5 to 7 business days.",
  },
  {
    question: "Can DIFC, DTEC, and Free Zone companies use these fixed-fee packages?",
    answer:
      "Yes. Our Enterprise & CFO Advisory tier and QFZP Shield Pro package are built for Free Zone, DIFC, and DTEC entities requiring annual IFRS audited financial statements, 0% QFZP De Minimis monitoring, and Transfer Pricing compliance.",
  },
];

const ALL_PRICING_SCHEMA_FAQS: FAQSchemaItem[] = [...FEATURED_PRICING_FAQS, ...PRICING_FAQS];

export const PricingPage: React.FC<PricingPageProps> = ({
  onNavigate,
  onOpenAudit,
  onOpenPrivacy,
  onOpenGooglePreferred,
}) => {
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>("monthly");
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("annual");
  const [comparisonOpen, setComparisonOpen] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.innerWidth >= 768 : true
  );
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    applyPageSEO({
      title: "Accounting & Tax Packages in Dubai & UAE | Fixed Fees From AED 400/Month",
      description:
        "Compare transparent monthly IFRS bookkeeping, 5% VAT filing & 2026 UAE Corporate Tax packages for startups and SMEs in Dubai & Sharjah. Zero hidden fees.",
      canonicalPath: "/pricing",
      keywords:
        "UAE accounting packages, monthly bookkeeping pricing Dubai, fixed fee corporate tax filing UAE, VAT return filing cost Dubai",
    });
    upsertJsonLd(
      "page-faq-jsonld",
      buildFAQPageSchema(ALL_PRICING_SCHEMA_FAQS, "https://diasuae.ae/pricing#faqs")
    );
    upsertJsonLd(
      "page-breadcrumb-jsonld",
      buildBreadcrumbSchema(
        [
          { name: "Home", path: "/" },
          { name: "Pricing", path: "/pricing" },
        ],
        "https://diasuae.ae/pricing#breadcrumb"
      )
    );
    window.scrollTo({ top: 0, behavior: "instant" });

    return () => {
      removeJsonLd("page-faq-jsonld");
      removeJsonLd("page-breadcrumb-jsonld");
    };
  }, []);

  const currentTiers =
    activeCategory === "monthly"
      ? MONTHLY_TIERS
      : activeCategory === "backlog"
        ? BACKLOG_TIERS
        : STANDALONE_TIERS;

  const handleSelectTier = (tier: PricingTier) => {
    const rateLabel =
      tier.fixedPrice !== undefined
        ? tier.fixedPrice === "Custom"
          ? "Custom Quote"
          : `AED ${tier.fixedPrice} ${tier.unit}`
        : `AED ${billingPeriod === "annual" ? tier.priceAnnual : tier.priceMonthly}/mo (${
            billingPeriod === "annual" ? "Annual" : "Monthly"
          })`;

    if (typeof window !== "undefined") {
      sessionStorage.setItem("dias_selected_service", `${tier.name} — ${rateLabel}`);
    }

    if (tier.ctaLabel === "Book Consultation" && onOpenAudit) {
      onOpenAudit();
      return;
    }

    onNavigate("/contact");
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] font-sans text-[#0D1B2A] antialiased">
      <PageNavigation
        currentPath="/pricing"
        onNavigate={onNavigate}
        onOpenAudit={onOpenAudit}
      />

      <main id="main-content">
        {/* Clean Header & Dual Controls */}
        <section className="bg-[#FFFFFF] pt-12 pb-10 lg:pt-16 lg:pb-12 border-b border-[#E2E8F0]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Quiet Breadcrumb */}
            <nav
              aria-label="Breadcrumb"
              className="flex items-center justify-center gap-1.5 text-xs font-medium text-[#475569] mb-6"
            >
              <button
                type="button"
                onClick={() => onNavigate("/")}
                className="hover:text-[#0D1B2A] transition-colors cursor-pointer"
              >
                Home
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[#0D1B2A] font-semibold">Pricing</span>
            </nav>

            {/* Compact Centered Title & 1-Line Subtitle */}
            <div className="max-w-2xl mx-auto text-center space-y-3">
              <h1 className="font-display text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#0D1B2A] tracking-tight leading-[1.15]">
                Transparent, Fixed-Fee UAE Accounting
              </h1>
              <p className="text-[#475569] text-base sm:text-lg leading-relaxed">
                Predictable fixed-fee bookkeeping, VAT, and Corporate Tax support by FTA-registered specialists—zero hidden charges.
              </p>
            </div>

            {/* Dual Controls: Segmented Service Tabs + Billing Toggle */}
            <div className="mt-9 flex flex-col items-center gap-5">
              {/* Service Category Segmented Switcher */}
              <div
                role="tablist"
                aria-label="Pricing categories"
                className="inline-flex flex-wrap sm:flex-nowrap justify-center gap-1 p-1.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] w-full sm:w-auto"
              >
                {(
                  [
                    { id: "monthly", label: "Monthly Retainers" },
                    { id: "backlog", label: "Backlog Catch-Up" },
                    { id: "standalone", label: "Standalone Filings" },
                  ] as const
                ).map((tab) => {
                  const isActive = activeCategory === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActiveCategory(tab.id)}
                      className={`flex-1 sm:flex-none min-h-[44px] px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                        isActive
                          ? "bg-[#1B4332] text-white shadow-xs"
                          : "text-[#475569] hover:text-[#0D1B2A]"
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Monthly / Annual Billing Pill Toggle (Monthly Retainers only) */}
              {activeCategory === "monthly" && (
                <div className="inline-flex items-center gap-1 p-1 rounded-full bg-[#F8FAFC] border border-[#E2E8F0]">
                  <button
                    type="button"
                    onClick={() => setBillingPeriod("monthly")}
                    className={`min-h-[38px] px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                      billingPeriod === "monthly"
                        ? "bg-[#FFFFFF] text-[#0D1B2A] shadow-xs border border-[#E2E8F0]"
                        : "text-[#475569] hover:text-[#0D1B2A]"
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingPeriod("annual")}
                    className={`min-h-[38px] px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer inline-flex items-center gap-2 ${
                      billingPeriod === "annual"
                        ? "bg-[#FFFFFF] text-[#0D1B2A] shadow-xs border border-[#E2E8F0]"
                        : "text-[#475569] hover:text-[#0D1B2A]"
                    }`}
                  >
                    <span>Annual</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-[#1B4332] border border-emerald-200/80 text-[11px] font-semibold">
                      Save 33%
                    </span>
                  </button>
                </div>
              )}
            </div>

            <div className="mt-9">
              <SameDayQuoteBox
                idPrefix="pricing-quote"
                defaultJurisdiction="Dubai Mainland"
                defaultService="Monthly Accounting from AED 400/mo"
              />
            </div>
          </div>
        </section>

        {/* Tier Cards Grid (Max 3 Across) */}
        <section className="bg-[#F8FAFC] py-14 lg:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-7 items-stretch">
              {currentTiers.map((tier) => {
                const isCustom = tier.fixedPrice === "Custom";
                const displayPrice =
                  tier.fixedPrice !== undefined
                    ? tier.fixedPrice
                    : billingPeriod === "annual"
                      ? tier.priceAnnual
                      : tier.priceMonthly;

                const billingNote =
                  tier.fixedBillingNote !== undefined
                    ? tier.fixedBillingNote
                    : billingPeriod === "annual"
                      ? tier.billingNoteAnnual
                      : tier.billingNoteMonthly;

                return (
                  <article
                    key={tier.id}
                    className={`relative rounded-2xl bg-[#FFFFFF] flex flex-col justify-between p-7 sm:p-8 transition-shadow ${
                      tier.popular
                        ? "border-2 border-[#0D1B2A] shadow-[0_14px_38px_-14px_rgba(13,27,42,0.16)] overflow-hidden"
                        : "border border-[#E2E8F0] shadow-[0_6px_24px_-12px_rgba(13,27,42,0.06)] hover:shadow-[0_12px_32px_-14px_rgba(13,27,42,0.1)]"
                    }`}
                  >
                    {/* Subtle Metallic Gold Top Accent on Recommended Tier Only */}
                    {tier.popular && (
                      <div
                        className="absolute top-0 inset-x-0 h-[3px] bg-[#C5A059]"
                        aria-hidden="true"
                      />
                    )}

                    <div>
                      {/* a. Tier Name + Optional Subtle "Most Popular" Badge */}
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <h2 className="font-display text-xl font-bold text-[#0D1B2A] tracking-tight">
                          {tier.name}
                        </h2>
                        {tier.popular && (
                          <span className="shrink-0 px-2.5 py-0.5 rounded-full border border-[#C5A059]/60 bg-[#C5A059]/10 text-[#7A5A1A] text-xs font-semibold">
                            Most Popular
                          </span>
                        )}
                      </div>

                      {/* b. One concise "Best for..." line */}
                      <p className="text-sm text-[#475569] leading-relaxed min-h-[42px]">
                        {tier.bestFor}
                      </p>

                      {/* c. Large AED Price (tabular-nums) */}
                      <div className="mt-6 mb-6">
                        <div className="flex items-baseline gap-1.5">
                          {!isCustom && (
                            <span className="text-sm font-semibold text-[#475569]">AED</span>
                          )}
                          <span className="font-display text-4xl sm:text-[42px] font-bold text-[#0D1B2A] tracking-tight tabular-nums leading-none">
                            {displayPrice}
                          </span>
                          <span className="text-sm text-[#475569] font-medium">{tier.unit}</span>
                        </div>
                        <p className="mt-2 text-xs text-[#64748B] tabular-nums">{billingNote}</p>
                      </div>

                      {/* d. ONE Full-Width CTA Button */}
                      <button
                        type="button"
                        onClick={() => handleSelectTier(tier)}
                        className={`w-full min-h-[46px] px-5 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer inline-flex items-center justify-center gap-2 ${
                          tier.popular
                            ? "bg-[#1B4332] hover:bg-[#143326] text-white shadow-xs"
                            : "bg-[#FFFFFF] hover:bg-[#1B4332] text-[#0D1B2A] hover:text-white border border-[#0D1B2A] hover:border-[#1B4332]"
                        }`}
                      >
                        <span>{tier.ctaLabel}</span>
                        <ArrowRight className="w-4 h-4 shrink-0" />
                      </button>

                      {/* e. Thin Horizontal Divider + 5–6 Crisp Single-Line Checkmarks */}
                      <hr className="my-6 border-[#E2E8F0]" />

                      <ul className="space-y-3 text-sm text-[#334155]">
                        {tier.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2.5 leading-snug">
                            <Check
                              className="w-4 h-4 text-[#1B4332] shrink-0 mt-0.5"
                              strokeWidth={2.25}
                            />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Compact Single-Row Trust Bar */}
            <div className="mt-10 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] px-5 py-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5 text-sm text-[#0D1B2A]">
              <span className="inline-flex items-center gap-2 font-medium">
                <ShieldCheck className="w-4 h-4 text-[#1B4332] shrink-0" />
                <span>FTA Registered</span>
              </span>
              <span className="hidden sm:inline text-[#CBD5E1]" aria-hidden="true">
                •
              </span>
              <span className="inline-flex items-center gap-2 font-medium">
                <Star className="w-4 h-4 text-[#C5A059] fill-[#C5A059] shrink-0" />
                <span>5.0★ Google Rating (48 Reviews)</span>
              </span>
              <span className="hidden sm:inline text-[#CBD5E1]" aria-hidden="true">
                •
              </span>
              <span className="inline-flex items-center gap-2 font-medium">
                <UserCheck className="w-4 h-4 text-[#1B4332] shrink-0" />
                <span>Dedicated Account Manager</span>
              </span>
            </div>

            <p className="mt-4 text-center text-xs text-[#64748B]">
              Final fee depends on business activity, monthly transaction volume, and filing scope. All rates exclude 5% UAE VAT.
            </p>
          </div>
        </section>

        {/* Progressive Disclosure: Collapsible Feature Comparison Table */}
        <section className="bg-[#FFFFFF] py-14 lg:py-20 border-t border-[#E2E8F0]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#E2E8F0]">
              <div>
                <h2 className="font-display text-2xl font-bold text-[#0D1B2A] tracking-tight">
                  Compare All Plan Features
                </h2>
                <p className="text-sm text-[#475569] mt-1">
                  Detailed side-by-side deliverables across our monthly accounting retainers.
                </p>
              </div>
              <button
                type="button"
                aria-expanded={comparisonOpen}
                onClick={() => setComparisonOpen((prev) => !prev)}
                className="min-h-[44px] px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#0D1B2A] text-sm font-semibold text-[#0D1B2A] inline-flex items-center justify-center gap-2 transition-colors cursor-pointer self-start sm:self-auto"
              >
                <span>{comparisonOpen ? "Hide Comparison" : "Compare All Plan Features"}</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#475569] transition-transform duration-200 ${
                    comparisonOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>

            {comparisonOpen && (
              <div className="mt-6 rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-[#0D1B2A] text-white">
                        <th className="py-4 px-5 font-semibold">Deliverable</th>
                        <th className="py-4 px-5 font-semibold text-center">Business Starter</th>
                        <th className="py-4 px-5 font-semibold text-center">
                          <span className="inline-flex items-center gap-1.5">
                            <span>Corporate Growth</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" aria-hidden="true" />
                          </span>
                        </th>
                        <th className="py-4 px-5 font-semibold text-center">Enterprise &amp; CFO</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0]">
                      {COMPARISON_ROWS.map((row) => (
                        <tr key={row.capability} className="odd:bg-[#FFFFFF] even:bg-[#F8FAFC]">
                          <td className="py-3.5 px-5 font-medium text-[#0D1B2A]">{row.capability}</td>
                          <td className="py-3.5 px-5 text-center">
                            <ComparisonCell value={row.starter} />
                          </td>
                          <td className="py-3.5 px-5 text-center">
                            <ComparisonCell value={row.growth} highlight />
                          </td>
                          <td className="py-3.5 px-5 text-center">
                            <ComparisonCell value={row.enterprise} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Exact-Match H2 FAQ & Pricing Breakdown Section */}
        <section id="faqs" className="bg-[#F8FAFC] py-16 lg:py-20 border-t border-[#E2E8F0]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#856422] mb-2">
                UAE Accounting &amp; Tax Pricing Guide
              </span>
              <p className="text-[#475569] text-sm sm:text-base">
                Clear details on monthly retainers, 5% VAT Form 201 &amp; 9% Corporate Tax filings, and backlog catch-up.
              </p>
            </div>

            {/* Direct Answer H2 Cards (#070d19 Navy & #c5a059 Gold Accents) */}
            <div className="space-y-6 mb-12">
              <article className="rounded-2xl bg-[#070d19] text-white border border-[#c5a059]/35 p-6 sm:p-8 shadow-sm">
                <div className="w-10 h-[2px] bg-[#c5a059] mb-4" aria-hidden="true" />
                <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug mb-3">
                  How much do accounting and tax services cost for a small business in Dubai &amp; UAE in 2026?
                </h2>
                <p className="text-sm sm:text-[15px] text-slate-200 leading-relaxed mb-5">
                  In 2026, fixed-fee monthly IFRS bookkeeping, 5% UAE VAT Form 201 returns, and EmaraTax Corporate Tax filings start from{" "}
                  <strong className="text-[#c5a059] font-semibold">AED 400/month (Starter)</strong>,{" "}
                  <strong className="text-[#c5a059] font-semibold">AED 600–750/month (Growth VAT + CT)</strong>, and{" "}
                  <strong className="text-[#c5a059] font-semibold">AED 1,250/month (QFZP Audit-Ready)</strong>, all managed by FTA-Registered Tax Agents with zero hourly surprises.
                </p>
                <div className="rounded-xl overflow-hidden border border-white/15 bg-[#0D1B2A]/60">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[480px] text-left border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-[#c5a059]/40 bg-[#0D1B2A] text-[#c5a059]">
                          <th className="py-3 px-4 font-semibold">Package Tier</th>
                          <th className="py-3 px-4 font-semibold">Monthly Fee</th>
                          <th className="py-3 px-4 font-semibold">Core Compliance Scope</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10 text-slate-200">
                        <tr>
                          <td className="py-3 px-4 font-semibold text-white">Starter Compliance</td>
                          <td className="py-3 px-4 font-semibold text-[#c5a059] tabular-nums">AED 400/mo</td>
                          <td className="py-3 px-4">Monthly IFRS bookkeeping, P&amp;L/Balance Sheet &amp; annual 0% SBR Corporate Tax filing</td>
                        </tr>
                        <tr className="bg-white/[0.03]">
                          <td className="py-3 px-4 font-semibold text-white">Growth VAT + CT</td>
                          <td className="py-3 px-4 font-semibold text-[#c5a059] tabular-nums">AED 600–750/mo</td>
                          <td className="py-3 px-4">Monthly IFRS books, quarterly 5% VAT Form 201 filing, input VAT recovery &amp; 9% Corporate Tax</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 font-semibold text-white">Free Zone QFZP Audit-Ready</td>
                          <td className="py-3 px-4 font-semibold text-[#c5a059] tabular-nums">AED 1,250/mo</td>
                          <td className="py-3 px-4">Full IFRS audit file, 0% QFZP De Minimis &amp; substance checks, VAT 201 &amp; fractional CFO review</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </article>

              <article className="rounded-2xl bg-[#070d19] text-white border border-[#c5a059]/35 p-6 sm:p-8 shadow-sm">
                <div className="w-10 h-[2px] bg-[#c5a059] mb-4" aria-hidden="true" />
                <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug mb-3">
                  What is included in Dias Accounting&apos;s AED 400/month package?
                </h2>
                <p className="text-sm sm:text-[15px] text-slate-200 leading-relaxed">
                  Dias Accounting&apos;s <strong className="text-[#c5a059] font-semibold">AED 400/month Starter package</strong> includes monthly IFRS double-entry bookkeeping, bank and card reconciliation, monthly Profit &amp; Loss and Balance Sheet statements, 0% Small Business Relief (SBR) election for revenue up to AED 3,000,000, and annual Corporate Tax return filing on EmaraTax.
                </p>
              </article>
            </div>

            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-6">
                <h3 className="font-display text-xl sm:text-2xl font-bold text-[#0D1B2A] tracking-tight">
                  Additional Pricing Questions
                </h3>
              </div>

            <div className="divide-y divide-[#E2E8F0] border-y border-[#E2E8F0]">
              {PRICING_FAQS.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={faq.question}>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full min-h-[56px] py-5 text-left flex items-center justify-between gap-4 cursor-pointer group"
                    >
                      <span className="font-semibold text-base text-[#0D1B2A] group-hover:text-[#1B4332] transition-colors">
                        {faq.question}
                      </span>
                      <span
                        className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[#475569] group-hover:text-[#0D1B2A] transition-colors"
                        aria-hidden="true"
                      >
                        {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="pb-5 pr-8 text-sm sm:text-[15px] text-[#475569] leading-relaxed">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            </div>
          </div>
        </section>

        {/* Clean Multi-Entity / Custom Scope Strip */}
        <section className="bg-[#FFFFFF] py-14 lg:py-16 border-t border-[#E2E8F0]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0D1B2A] tracking-tight">
              Need a Custom or Multi-Entity Fee Schedule?
            </h2>
            <p className="text-[#475569] text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Holding multiple UAE trade licenses or unsure which tier fits? Speak directly with an FTA-registered specialist for a fixed written proposal.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => (onOpenAudit ? onOpenAudit() : onNavigate("/contact"))}
                className="w-full sm:w-auto min-h-[46px] px-7 py-3 rounded-xl bg-[#1B4332] hover:bg-[#143326] text-white text-sm font-semibold transition-colors cursor-pointer inline-flex items-center justify-center gap-2"
              >
                <span>Book a Consultation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate("/uae-tax-planner")}
                className="w-full sm:w-auto min-h-[46px] px-6 py-3 rounded-xl border border-[#E2E8F0] hover:border-[#0D1B2A] text-[#0D1B2A] text-sm font-semibold transition-colors cursor-pointer"
              >
                Estimate 2026 Tax Liability
              </button>
            </div>
          </div>
        </section>
      </main>

      <PageFooter
        onNavigate={onNavigate}
        onOpenPrivacy={onOpenPrivacy}
        onOpenGooglePreferred={onOpenGooglePreferred}
      />
    </div>
  );
};

const ComparisonCell: React.FC<{ value: string; highlight?: boolean }> = ({
  value,
  highlight = false,
}) => {
  if (value === "Not included") {
    return <span className="text-slate-400">—</span>;
  }
  if (value === "Optional Add-on") {
    return <span className="text-xs font-medium text-[#64748B]">Optional</span>;
  }
  if (value === "Included") {
    return (
      <span className="inline-flex items-center justify-center gap-1 text-[#1B4332] font-semibold">
        <Check className="w-4 h-4 shrink-0" strokeWidth={2.25} />
        <span className="sr-only">Included</span>
      </span>
    );
  }
  return (
    <span className={`text-xs sm:text-sm ${highlight ? "font-semibold text-[#0D1B2A]" : "text-[#475569]"}`}>
      {value}
    </span>
  );
};

export default PricingPage;

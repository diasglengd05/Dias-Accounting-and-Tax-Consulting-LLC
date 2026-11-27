import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronRight,
  MessageCircle,
  Minus,
  Plus,
  ShieldCheck,
  Star,
  UserCheck,
} from "lucide-react";
import PageNavigation from "../components/PageNavigation";
import PageFooter from "../components/PageFooter";
import PageMainTransition from "../components/PageMainTransition";
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

const WHATSAPP_STARTER_URL =
  "https://wa.me/971529226958?text=Hi%20DiasUAE%2C%20I%20want%20to%20start%20the%20Business%20Starter%20package%20(AED%20400%2Fmo)%20for%20my%20UAE%20company.";
const WHATSAPP_GROWTH_URL =
  "https://wa.me/971529226958?text=Hi%20DiasUAE%2C%20I%20need%20a%20quote%20for%20the%20Corporate%20Growth%20(Accounting%2C%20VAT%20%26%20CT)%20package.";

const MONTHLY_TIERS: PricingTier[] = [
  {
    id: "business-starter",
    name: "Business Starter",
    bestFor: "Best for new Free Zone & Mainland companies under AED 3M revenue.",
    priceAnnual: "400",
    priceMonthly: "500",
    unit: "/ month",
    billingNoteAnnual: "Billed AED 4,000 / year + 5% VAT",
    billingNoteMonthly: "Billed monthly at AED 500 + 5% VAT",
    ctaLabel: "Start Business Starter on WhatsApp",
    features: [
      "Monthly IFRS double-entry bookkeeping",
      "Monthly P&L & Balance Sheet statements",
      "EmaraTax Corporate Tax registration & compliance",
      "0% Small Business Relief election (extended through 2029 under MD 131/2026)",
      "Bank & card reconciliation (up to 50 txns/mo)",
      "Dedicated FTA Tax Agent & Senior Accountant support",
    ],
  },
  {
    id: "corporate-growth",
    name: "Corporate Growth",
    bestFor: "Best for VAT-registered & scaling Dubai/UAE companies.",
    priceAnnual: "600",
    priceMonthly: "750",
    unit: "/ month",
    billingNoteAnnual: "Billed AED 6,000 / year + 5% VAT",
    billingNoteMonthly: "Billed monthly at AED 750 + 5% VAT",
    popular: true,
    ctaLabel: "Get Corporate Growth Quote on WhatsApp",
    features: [
      "Full monthly IFRS bookkeeping & reconciliations",
      "Quarterly 5% VAT Form 201 filing on EmaraTax",
      "VAT-to-Corporate-Tax revenue & ledger reconciliation",
      "Annual 9% Corporate Tax return preparation & filing",
      "FTA audit-ready documentation & 7-year archival",
      "Priority phone & direct FTA Tax Agent advisory",
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
      "What is the best affordable monthly accounting package for a small business in Dubai & UAE?",
    answer:
      "DiasUAE's Business Starter package (starting from AED 400/month billed annually) is built specifically for new Dubai Mainland and UAE Free Zone companies under AED 3,000,000 in annual revenue. Managed by FTA-Registered Tax Agent Glen Dias (Dias Accounting and Tax Consulting LLC, SHAMS Licence 2646813.01), it bundles monthly IFRS bookkeeping, Profit & Loss and Balance Sheet statements, EmaraTax Corporate Tax registration and compliance, and 0% Small Business Relief elections extended through December 31, 2029 under Ministerial Decision No. 131 of 2026.",
  },
  {
    question:
      "What is the difference between DiasUAE's Business Starter and Corporate Growth packages?",
    answer:
      "Business Starter (from AED 400/month) is tailored for non-VAT-registered UAE startups and SMEs under AED 3M revenue needing monthly IFRS bookkeeping, P&L and Balance Sheet reporting, EmaraTax Corporate Tax compliance, and 0% Small Business Relief elections through 2029. Corporate Growth (from AED 600/month billed annually or AED 750/month monthly) is our most popular plan for VAT-registered and scaling Dubai/UAE companies—adding quarterly 5% VAT Form 201 filing, VAT-to-Corporate-Tax ledger reconciliation, annual 9% Corporate Tax filing, and FTA audit-ready documentation.",
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

export const ALL_PRICING_SCHEMA_FAQS: FAQSchemaItem[] = [...FEATURED_PRICING_FAQS, ...PRICING_FAQS];

export const PricingPage: React.FC<PricingPageProps> = ({
  onNavigate,
  onOpenAudit,
  onOpenPrivacy,
  onOpenGooglePreferred,
}) => {
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>("monthly");
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("annual");
  const [comparisonOpen, setComparisonOpen] = useState<boolean>(true);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setComparisonOpen(false);
    }
  }, []);

  useEffect(() => {
    applyPageSEO({
      title: "UAE Monthly Accounting, VAT & Corporate Tax Packages | From AED 400/Mo — DiasUAE",
      description:
        "Fixed-fee UAE monthly IFRS bookkeeping, 5% VAT Form 201 & 9% Corporate Tax packages. Business Starter from AED 400/mo & Corporate Growth for VAT-registered SMEs. FTA Tax Agents.",
      canonicalPath: "/pricing",
      keywords:
        "UAE monthly accounting packages, Dubai bookkeeping pricing from AED 400, UAE VAT Form 201 and Corporate Tax package, Business Starter accounting UAE, Corporate Growth SME tax package",
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

      <PageMainTransition id="main-content">
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

            {/* Compact Centered Title & Subtitle */}
            <div className="max-w-3xl mx-auto text-center space-y-3">
              <span className="inline-block text-xs font-semibold uppercase tracking-[0.14em] text-[#856422]">
                DiasUAE · FTA-Registered Tax Agents · Fixed Monthly Packages
              </span>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#0D1B2A] tracking-tight leading-[1.14]">
                Fixed-Fee UAE Accounting, VAT &amp; Corporate Tax Packages (Business Starter &amp; Corporate Growth)
              </h1>
              <p className="text-[#475569] text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
                Fixed-fee monthly IFRS bookkeeping, quarterly VAT Form 201, and EmaraTax Corporate Tax compliance—choose{" "}
                <strong className="text-[#0D1B2A] font-semibold">Business Starter from AED 400/mo</strong> or{" "}
                <strong className="text-[#0D1B2A] font-semibold">Corporate Growth</strong> for VAT-registered SMEs.
              </p>
            </div>

            {/* Two Flagship Side-by-Side Packages (#070d19 Navy, #0d1b2a Slate, #c5a059 Gold) */}
            <div
              aria-label="Flagship Monthly UAE Accounting Packages"
              className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-7 items-stretch"
            >
              {/* Flagship Card 1: Business Starter */}
              <article className="relative rounded-2xl bg-[#0d1b2a] text-white border border-white/15 p-7 sm:p-8 flex flex-col justify-between shadow-lg">
                <div>
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#c5a059]">
                      Startup &amp; SBR Compliance
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full border border-white/15 bg-white/5 text-slate-200 text-xs font-medium">
                      Under AED 3M Revenue
                    </span>
                  </div>
                  <h2 className="font-display text-2xl sm:text-[26px] font-bold text-white tracking-tight">
                    Business Starter
                  </h2>
                  <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                    Best for new Free Zone &amp; Mainland companies under AED 3M revenue.
                  </p>

                  <div className="mt-6 pb-6 border-b border-white/10">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                        From AED
                      </span>
                      <span className="font-display text-4xl sm:text-[44px] font-bold text-[#c5a059] tabular-nums leading-none">
                        400
                      </span>
                      <span className="text-sm text-slate-300 font-medium">/ month</span>
                    </div>
                    <p className="mt-2 text-xs text-slate-400 tabular-nums">
                      Billed annually (AED 4,000/yr) or AED 500/month · Excl. 5% VAT
                    </p>
                  </div>

                  <ul className="mt-6 space-y-3 text-sm text-slate-200">
                    {[
                      "Monthly IFRS bookkeeping & bank reconciliations",
                      "Monthly Profit & Loss (P&L) & Balance Sheet statements",
                      "EmaraTax Corporate Tax registration & annual compliance",
                      "0% Small Business Relief election (extended through 2029 under MD 131/2026)",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2.5 leading-snug">
                        <Check
                          className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5"
                          strokeWidth={2.5}
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-2">
                  <a
                    href={WHATSAPP_STARTER_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full min-h-[48px] px-5 py-3 rounded-xl bg-white hover:bg-[#c5a059] text-[#070d19] font-semibold text-sm inline-flex items-center justify-center gap-2 transition-colors shadow-xs"
                  >
                    <MessageCircle className="w-4 h-4 shrink-0" />
                    <span>Start Business Starter on WhatsApp</span>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </a>
                </div>
              </article>

              {/* Flagship Card 2: Corporate Growth (Most Popular for UAE SMEs) */}
              <article className="relative rounded-2xl bg-[#070d19] text-white border-2 border-[#c5a059] p-7 sm:p-8 flex flex-col justify-between shadow-[0_18px_44px_-16px_rgba(7,13,25,0.45)] overflow-hidden">
                <div
                  className="absolute top-0 inset-x-0 h-[4px] bg-gradient-to-r from-[#c5a059] via-[#e6c884] to-[#c5a059]"
                  aria-hidden="true"
                />
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#c5a059]">
                      VAT + Corporate Tax
                    </span>
                    <span className="px-3 py-1 rounded-full bg-[#c5a059] text-[#070d19] text-xs font-bold tracking-tight">
                      Most Popular for UAE SMEs
                    </span>
                  </div>
                  <h2 className="font-display text-2xl sm:text-[26px] font-bold text-white tracking-tight">
                    Corporate Growth
                  </h2>
                  <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                    Best for VAT-registered &amp; scaling Dubai/UAE companies.
                  </p>

                  <div className="mt-6 pb-6 border-b border-[#c5a059]/25">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                        From AED
                      </span>
                      <span className="font-display text-4xl sm:text-[44px] font-bold text-[#c5a059] tabular-nums leading-none">
                        600
                      </span>
                      <span className="text-sm text-slate-300 font-medium">/ month</span>
                    </div>
                    <p className="mt-2 text-xs text-slate-400 tabular-nums">
                      Billed annually (AED 6,000/yr) or AED 750/month · Excl. 5% VAT
                    </p>
                  </div>

                  <ul className="mt-6 space-y-3 text-sm text-slate-100">
                    {[
                      "Full monthly IFRS bookkeeping & bank/card reconciliations",
                      "Quarterly 5% VAT Form 201 filing & input tax recovery",
                      "VAT-to-Corporate-Tax revenue & ledger reconciliation",
                      "Annual 9% Corporate Tax return filing on EmaraTax",
                      "FTA audit-ready documentation & 7-year statutory archive",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2.5 leading-snug">
                        <Check
                          className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5"
                          strokeWidth={2.5}
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-2">
                  <a
                    href={WHATSAPP_GROWTH_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full min-h-[48px] px-5 py-3 rounded-xl bg-[#c5a059] hover:bg-[#b58f47] text-[#070d19] font-bold text-sm inline-flex items-center justify-center gap-2 transition-colors shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4 shrink-0" />
                    <span>Get Corporate Growth Quote on WhatsApp</span>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </a>
                </div>
              </article>
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
                      {tier.id === "business-starter" || tier.id === "corporate-growth" ? (
                        <a
                          href={
                            tier.id === "business-starter"
                              ? WHATSAPP_STARTER_URL
                              : WHATSAPP_GROWTH_URL
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`w-full min-h-[46px] px-5 py-3 rounded-xl text-sm font-semibold transition-all inline-flex items-center justify-center gap-2 ${
                            tier.popular
                              ? "bg-[#070d19] hover:bg-[#0d1b2a] text-[#c5a059] border border-[#c5a059]/60 shadow-xs"
                              : "bg-[#FFFFFF] hover:bg-[#070d19] text-[#0D1B2A] hover:text-white border border-[#0D1B2A]"
                          }`}
                        >
                          <MessageCircle className="w-4 h-4 shrink-0" />
                          <span>{tier.ctaLabel}</span>
                          <ArrowRight className="w-4 h-4 shrink-0" />
                        </a>
                      ) : (
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
                      )}

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

            {/* Direct Answer H2 Cards (#070d19 Navy & #c5a059 Gold Accents — 1:1 with FAQPage JSON-LD) */}
            <div className="space-y-6 mb-12">
              <article className="rounded-2xl bg-[#070d19] text-white border border-[#c5a059]/35 p-6 sm:p-8 shadow-sm">
                <div className="w-10 h-[2px] bg-[#c5a059] mb-4" aria-hidden="true" />
                <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug mb-3">
                  {FEATURED_PRICING_FAQS[0].question}
                </h2>
                <p className="text-sm sm:text-[15px] text-slate-200 leading-relaxed mb-5">
                  {FEATURED_PRICING_FAQS[0].answer}
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
                          <td className="py-3 px-4 font-semibold text-white">Business Starter</td>
                          <td className="py-3 px-4 font-semibold text-[#c5a059] tabular-nums">From AED 400/mo</td>
                          <td className="py-3 px-4">Monthly IFRS bookkeeping, P&amp;L &amp; Balance Sheet, EmaraTax CT compliance &amp; 0% SBR election (extended through 2029)</td>
                        </tr>
                        <tr className="bg-white/[0.03]">
                          <td className="py-3 px-4 font-semibold text-white">Corporate Growth (Most Popular)</td>
                          <td className="py-3 px-4 font-semibold text-[#c5a059] tabular-nums">AED 600–750/mo</td>
                          <td className="py-3 px-4">Full monthly IFRS books, quarterly 5% VAT Form 201 filing, VAT-to-CT reconciliation, annual 9% CT &amp; FTA audit-ready files</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 font-semibold text-white">Enterprise &amp; QFZP Audit-Ready</td>
                          <td className="py-3 px-4 font-semibold text-[#c5a059] tabular-nums">From AED 1,000/mo</td>
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
                  {FEATURED_PRICING_FAQS[1].question}
                </h2>
                <p className="text-sm sm:text-[15px] text-slate-200 leading-relaxed">
                  {FEATURED_PRICING_FAQS[1].answer}
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
      </PageMainTransition>

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

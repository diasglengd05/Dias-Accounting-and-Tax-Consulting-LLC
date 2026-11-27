import React, { useEffect, useState } from "react";
import { ArrowRight, ChevronRight, Minus, Plus } from "lucide-react";
import PageNavigation from "../components/PageNavigation";
import PageFooter from "../components/PageFooter";
import PageMainTransition from "../components/PageMainTransition";
import PricingSection, { PRICING_OFFER_CATALOG_JSONLD } from "../components/PricingSection";
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

const FEATURED_PRICING_FAQS: FAQSchemaItem[] = [
  {
    question:
      "What is the best affordable monthly accounting package for a small business in Dubai & UAE?",
    answer:
      "DiasUAE's Business Starter package (from AED 400/month billed annually at AED 4,000/year, or AED 500/month billed monthly, plus 5% VAT) is built specifically for startups, solo founders, and micro-SMEs under AED 3,000,000 in annual revenue. Managed by FTA-Registered Tax Agent Glen Dias (Dias Accounting and Tax Consulting LLC, SHAMS Licence 2646813.01), it bundles monthly IFRS double-entry bookkeeping, bank and corporate card reconciliation (up to 50 txns/mo), monthly Balance Sheet and Profit & Loss statements, and annual Corporate Tax filing with 0% Small Business Relief election.",
  },
  {
    question:
      "What is the difference between DiasUAE's Business Starter and Corporate Growth packages?",
    answer:
      "Business Starter (AED 400/month billed annually or AED 500/month monthly, plus 5% VAT) covers monthly IFRS double-entry bookkeeping, up to 50 bank and card transactions per month, monthly Balance Sheet and Profit & Loss statements, and annual Corporate Tax filing with 0% Small Business Relief election. Corporate Growth (AED 600/month billed annually at AED 6,000/year, or AED 750/month monthly, plus 5% VAT) is our recommended tier for active UAE SMEs with VAT and 9% Corporate Tax—adding quarterly VAT Form 201 preparation and EmaraTax filing, input VAT recovery checks, 9% statutory Corporate Tax adjustments, UAE E-Invoicing Phase 1 readiness, and priority advisory access with FTA tax specialists.",
  },
];

const PRICING_FAQS: FAQSchemaItem[] = [
  {
    question: "What is included in Dias Accounting's fixed-fee accounting packages in Dubai?",
    answer:
      "Our monthly retainers (AED 400 to AED 1,000/month billed annually, or AED 500 to AED 1,250/month billed monthly, plus 5% VAT) cover dedicated Senior Accountant support, monthly IFRS double-entry bookkeeping, bank and corporate card reconciliations, monthly Balance Sheet and Profit & Loss statements, quarterly VAT Form 201 filings on Corporate Growth and Enterprise & CFO tiers, and annual Corporate Tax return filing on EmaraTax. There are zero surprise hourly billing charges.",
  },
  {
    question: "How much does corporate tax filing cost for UAE Mainland and Free Zone companies?",
    answer:
      "For businesses maintaining clean monthly books with Dias Accounting, annual Corporate Tax return filing is bundled into our monthly retainers. For standalone filings without monthly bookkeeping, our MicroBiz CT Filing (0% SBR) is a flat AED 500 one-time (+ 5% VAT), and our QFZP 0% Free Zone Review is AED 1,499 per annual review (+ 5% VAT).",
  },
  {
    question: "Are Corporate Tax returns (9%) and VAT 201 filings included in the monthly fee?",
    answer:
      "Yes. Our Corporate Growth (AED 600/month annual or AED 750/month monthly) and Enterprise & CFO (AED 1,000/month annual or AED 1,250/month monthly) retainers include quarterly VAT Form 201 preparation and EmaraTax filing alongside annual Corporate Tax return filing. Business Starter (AED 400/month annual or AED 500/month monthly) includes monthly IFRS bookkeeping and annual Corporate Tax filing with 0% SBR election.",
  },
  {
    question: "What are the penalties if my UAE company delays historical backlog bookkeeping?",
    answer:
      "Under Cabinet Decision No. 75 of 2023, failing to register for Corporate Tax on time incurs an automatic AED 10,000 fine, and failing to maintain proper accounting records triggers penalties starting at AED 10,000. Our Backlog Catch-Up packages start at AED 2,500 one-time for a Single Fiscal Year, AED 4,800 for Multi-Year Catch-Up (2 FYs), and AED 7,500 for E-Commerce & High Volume ledgers (+ 5% VAT).",
  },
  {
    question: "Can DIFC, DTEC, and Free Zone companies use these fixed-fee packages?",
    answer:
      "Yes. Our Enterprise & CFO tier (AED 1,000/month annual or AED 1,250/month monthly, plus 5% VAT) and standalone QFZP 0% Free Zone Review (AED 1,499 annual review + 5% VAT) are built for DIFC, DMCC, IFZA, DTEC, and SHAMS Free Zone entities requiring 0% QFZP substance and de minimis compliance, statutory audit file preparation, and Transfer Pricing alignment.",
  },
];

export const ALL_PRICING_SCHEMA_FAQS: FAQSchemaItem[] = [...FEATURED_PRICING_FAQS, ...PRICING_FAQS];

export const PricingPage: React.FC<PricingPageProps> = ({
  onNavigate,
  onOpenAudit,
  onOpenPrivacy,
  onOpenGooglePreferred,
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    applyPageSEO({
      title: "UAE Monthly Accounting, VAT & Corporate Tax Packages | From AED 400/Mo — DiasUAE",
      description:
        "Fixed-fee UAE monthly accounting, 5% VAT & 9% Corporate Tax packages. Business Starter from AED 400/mo & Corporate Growth for UAE SMEs. Get a quick quote.",
      canonicalPath: "/pricing",
      keywords:
        "UAE monthly accounting packages, Dubai bookkeeping pricing from AED 400, UAE VAT Form 201 and Corporate Tax package, Business Starter accounting UAE, Corporate Growth SME tax package",
    });
    upsertJsonLd("page-pricing-offers-jsonld", PRICING_OFFER_CATALOG_JSONLD);
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
      removeJsonLd("page-pricing-offers-jsonld");
      removeJsonLd("page-faq-jsonld");
      removeJsonLd("page-breadcrumb-jsonld");
    };
  }, []);

  const handlePlanBooking = () => {
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
        {/* Quiet Breadcrumb Bar */}
        <div className="bg-[#FFFFFF] pt-8 pb-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav
              aria-label="Breadcrumb"
              className="flex items-center justify-center gap-1.5 text-xs font-medium text-[#475569]"
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
          </div>
        </div>

        {/* Single-Source-of-Truth Shared Pricing Section (Identical to Homepage, H1 on /pricing) */}
        <PricingSection
          headingLevel="h1"
          onNavigate={onNavigate}
          onPreselectedCallBooking={handlePlanBooking}
        />

        {/* Pricing FAQ Section (1:1 Synchronized with Homepage Tiers & FAQPage JSON-LD) */}
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

            {/* Direct Answer H2 Cards (1:1 with FAQPage JSON-LD) */}
            <div className="space-y-6 mb-12">
              {FEATURED_PRICING_FAQS.map((item) => (
                <article
                  key={item.question}
                  className="rounded-2xl bg-[#FFFFFF] text-[#0D1B2A] border border-[#E2E8F0] p-6 sm:p-8 shadow-xs"
                >
                  <div className="w-10 h-[2px] bg-[#C5A059] mb-4" aria-hidden="true" />
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-[#0D1B2A] tracking-tight leading-snug mb-3">
                    {item.question}
                  </h2>
                  <p className="text-sm sm:text-[15px] text-[#475569] leading-relaxed">
                    {item.answer}
                  </p>
                </article>
              ))}
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
                        aria-controls={`pricing-faq-panel-${idx}`}
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
                      <div
                        id={`pricing-faq-panel-${idx}`}
                        aria-hidden={!isOpen}
                        className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${
                          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <div className="pb-5 pr-8 text-sm sm:text-[15px] text-[#475569] leading-relaxed">
                            {faq.answer}
                          </div>
                        </div>
                      </div>
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

export default PricingPage;

import React, { useEffect, useState } from "react";
import { ChevronRight, Info, Minus, Plus } from "lucide-react";
import PageNavigation from "../components/PageNavigation";
import PageFooter from "../components/PageFooter";
import UaeTaxCalculatorSuite from "../components/UaeTaxCalculatorSuite";
import { RelatedResources } from "../components/editorial/RelatedResources";
import { getRelatedResourcesForPath } from "../lib/internalLinks";
import {
  applyPageSEO,
  buildBreadcrumbSchema,
  buildFAQPageSchema,
  buildWebApplicationSchema,
  removeJsonLd,
  upsertJsonLd,
} from "../lib/seo";

interface TaxPlannerPageProps {
  onNavigate: (path: string) => void;
  onOpenAudit?: () => void;
  onOpenPrivacy?: () => void;
  onOpenGooglePreferred?: () => void;
  onToolStarted?: () => void;
  onResultViewed?: (result: { liability: number; sbr: boolean; netProfit: number }) => void;
  onResultSaved?: (lead: { name: string; email: string; phone: string }) => void;
  onCtaClicked?: (ctaType: string) => void;
  onWhatsAppClicked?: () => void;
}

const FAQ_ITEMS = [
  {
    q: "Can my business elect for 0% Small Business Relief (SBR) in 2026?",
    a: "Yes. Under UAE Ministerial Decision No. 73 of 2023 (extended through December 31, 2029), taxable resident businesses with revenue up to AED 3,000,000 can elect for Small Business Relief. When elected, your taxable income is treated as AED 0, resulting in zero corporate tax liability. However, you must still maintain IFRS-compliant books and file your annual tax return on EmaraTax.",
  },
  {
    q: "How does the AED 375,000 statutory 0% threshold apply?",
    a: "Under Federal Decree-Law No. 47 of 2022, every UAE Mainland and non-QFZP resident business benefits from a 0% corporate tax rate on the first AED 375,000 of taxable net profit. Any taxable profit exceeding AED 375,000 is subject to the standard 9% rate. Note that QFZPs taxed on non-qualifying income do not receive the AED 375,000 0% band.",
  },
  {
    q: "How does the Free Zone De Minimis rule work for 0% QFZP status?",
    a: "To preserve Qualifying Free Zone Person (QFZP) 0% status on Qualifying Income, your Non-Qualifying Revenue must not exceed 5% of total revenue or AED 5,000,000 (whichever is lower). You must also maintain adequate UAE substance, prepare audited IFRS financial statements, and comply with arm's-length Transfer Pricing documentation.",
  },
  {
    q: "Which UAE business expenses are blocked from 5% Input VAT recovery on Form 201?",
    a: "Under UAE VAT Executive Regulation rules, 5% VAT paid on Client Entertainment & Hospitality and Motor Vehicles available for personal or mixed use is blocked (0% reclaimable) on FTA Form 201, even when a valid tax invoice is held. Commercial international flights are zero-rated (0% VAT).",
  },
  {
    q: "What is the penalty for late UAE Corporate Tax registration?",
    a: "Under Cabinet Decision No. 75 of 2023, the FTA imposes an automatic AED 10,000 administrative penalty for late Corporate Tax registration. However, under the FTA penalty waiver initiative, this penalty can be waived or refunded if your first Corporate Tax return is submitted within 7 months of the end of your first tax period.",
  },
];

export const TaxPlannerPage: React.FC<TaxPlannerPageProps> = ({
  onNavigate,
  onOpenAudit,
  onOpenPrivacy,
  onOpenGooglePreferred,
  onToolStarted,
  onResultViewed,
  onCtaClicked,
  onWhatsAppClicked,
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [urlDefaultTab, setUrlDefaultTab] = useState<"corporate-tax" | "vat">(() => {
    if (typeof window !== "undefined") {
      const tabParam = new URLSearchParams(window.location.search).get("tab");
      return tabParam === "vat" ? "vat" : "corporate-tax";
    }
    return "corporate-tax";
  });

  useEffect(() => {
    const syncTabFromUrl = () => {
      const tabParam = new URLSearchParams(window.location.search).get("tab");
      setUrlDefaultTab(tabParam === "vat" ? "vat" : "corporate-tax");
    };
    syncTabFromUrl();
    window.addEventListener("popstate", syncTabFromUrl);
    return () => window.removeEventListener("popstate", syncTabFromUrl);
  }, []);

  useEffect(() => {
    const pageTitle = "2026 UAE Corporate Tax & VAT Calculator | Dias Accounting";
    const pageDesc =
      "Free 2026 UAE Corporate Tax (9%, 0% Small Business Relief & Free Zone QFZP) and 5% VAT Input Recovery Calculator by FTA-Registered Tax Agents in UAE.";

    applyPageSEO({
      title: pageTitle,
      description: pageDesc,
      canonicalPath: "/uae-tax-planner",
      keywords:
        "UAE Corporate Tax Calculator 2026, 5% UAE VAT Calculator, Free Zone QFZP Calculator, Small Business Relief AED 3M, UAE VAT Input Recovery Tool, Dias Accounting",
    });
    upsertJsonLd(
      "page-webapp-jsonld",
      buildWebApplicationSchema({
        name: "2026 UAE Corporate Tax & 5% VAT Calculator",
        description: pageDesc,
        canonicalPath: "/uae-tax-planner",
      })
    );
    upsertJsonLd(
      "page-faq-jsonld",
      buildFAQPageSchema(
        FAQ_ITEMS.map((item) => ({ question: item.q, answer: item.a })),
        "https://diasuae.ae/uae-tax-planner#faqs"
      )
    );
    upsertJsonLd(
      "page-breadcrumb-jsonld",
      buildBreadcrumbSchema(
        [
          { name: "Home", path: "/" },
          { name: "2026 UAE Tax Calculator", path: "/uae-tax-planner" },
        ],
        "https://diasuae.ae/uae-tax-planner#breadcrumb"
      )
    );
    window.scrollTo({ top: 0, behavior: "instant" });
    if (onToolStarted) onToolStarted();
    return () => {
      removeJsonLd("page-webapp-jsonld");
      removeJsonLd("page-faq-jsonld");
      removeJsonLd("page-breadcrumb-jsonld");
    };
  }, [onToolStarted]);

  return (
    <div className="min-h-screen bg-[#FFFFFF] font-sans text-[#0D1B2A] antialiased">
      <PageNavigation
        currentPath="/uae-tax-planner"
        onNavigate={onNavigate}
        onOpenAudit={onOpenAudit}
      />

      <main id="main-content">
        {/* Clean Centered Header */}
        <section className="bg-[#FFFFFF] pt-12 pb-8 lg:pt-16 lg:pb-10 border-b border-[#E2E8F0]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <nav
              aria-label="Breadcrumb"
              className="flex items-center justify-center gap-1.5 text-xs font-medium text-[#475569] mb-5"
            >
              <button
                type="button"
                onClick={() => onNavigate("/")}
                className="hover:text-[#0D1B2A] transition-colors cursor-pointer"
              >
                Home
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[#0D1B2A] font-semibold">2026 UAE Tax Calculator</span>
            </nav>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#0D1B2A] tracking-tight leading-[1.15]">
              2026 UAE Corporate Tax &amp; VAT Calculator
            </h1>
            <p className="mt-3 text-[#475569] text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
              Estimate your 2026 Corporate Tax liability, Small Business Relief, Free Zone QFZP status, or 5% VAT recovery in under a minute.
            </p>
          </div>
        </section>

        {/* Guided Calculator Surface */}
        <section className="bg-[#F8FAFC] py-12 lg:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <UaeTaxCalculatorSuite
              defaultTab={urlDefaultTab}
              onNavigate={onNavigate}
              onResultViewed={onResultViewed}
              onCtaClicked={onCtaClicked}
              onWhatsAppClicked={onWhatsAppClicked}
            />

            {/* Quiet Statutory Disclaimer */}
            <div className="mt-8 max-w-[760px] mx-auto flex items-start gap-2.5 text-xs text-[#64748B] leading-relaxed px-1">
              <Info className="w-4 h-4 text-[#94A3B8] shrink-0 mt-0.5" />
              <p>
                <strong className="font-semibold text-[#475569]">Disclaimer:</strong> Indicative estimate based on UAE
                Federal Decree-Law No. 47 of 2022 and UAE VAT Decree-Law No. 8 of 2017. Final tax positions depend on
                audited IFRS financial statements, connected-person adjustments, and valid FTA tax invoices.
              </p>
            </div>
          </div>
        </section>

        {/* Minimal FAQ Accordion */}
        <section className="bg-[#FFFFFF] py-16 lg:py-20 border-t border-[#E2E8F0]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0D1B2A] tracking-tight">
                2026 UAE Tax Rules &amp; FAQs
              </h2>
              <p className="mt-2 text-sm sm:text-base text-[#475569]">
                Key statutory thresholds, Free Zone QFZP requirements, and VAT recovery rules.
              </p>
            </div>

            <div className="divide-y divide-[#E2E8F0] border-y border-[#E2E8F0]">
              {FAQ_ITEMS.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={faq.q}>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full min-h-[56px] py-5 text-left flex items-center justify-between gap-4 cursor-pointer group"
                    >
                      <span className="font-semibold text-base text-[#0D1B2A] group-hover:text-[#1B4332] transition-colors">
                        {faq.q}
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
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Strategic UAE Tax & Compliance Internal Links (Max 3 Cards) */}
        <RelatedResources
          eyebrow="Next Steps After Your Estimate"
          heading="Turn Your Estimate Into Compliant Filings"
          items={getRelatedResourcesForPath("/uae-tax-planner")}
          onNavigate={onNavigate}
          background="neutral"
        />
      </main>

      <PageFooter
        onNavigate={onNavigate}
        onOpenPrivacy={onOpenPrivacy}
        onOpenGooglePreferred={onOpenGooglePreferred}
      />
    </div>
  );
};

export default TaxPlannerPage;

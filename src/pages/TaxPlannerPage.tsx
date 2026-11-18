import React, { useEffect, useState } from "react";
import {
  Calculator,
  ChevronDown,
  ChevronRight,
  Info,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import PageNavigation from "../components/PageNavigation";
import PageFooter from "../components/PageFooter";
import UaeTaxCalculatorSuite from "../components/UaeTaxCalculatorSuite";
import { applyPageSEO, upsertJsonLd, removeJsonLd } from "../lib/seo";

interface TaxPlannerPageProps {
  onNavigate: (path: string) => void;
  onOpenAudit?: () => void;
  onOpenPrivacy?: () => void;
  onOpenGooglePreferred?: () => void;
  // Tracking event callbacks for analytics
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
    applyPageSEO({
      title: "UAE Corporate Tax & 5% VAT Calculator (2026) | Free Zone QFZP & SBR Tool | Dias Accounting",
      description:
        "Free 2026 UAE Corporate Tax (9%, 0% Small Business Relief & Free Zone QFZP) and 5% VAT Input Recovery Calculator by FTA-Registered Tax Agents in Dubai & Sharjah.",
      canonicalPath: "/uae-tax-planner",
      keywords:
        "UAE Corporate Tax Calculator 2026, 5% UAE VAT Calculator, Free Zone QFZP Calculator, Small Business Relief AED 3M, UAE VAT Input Recovery Tool, Dias Accounting",
      ogImage:
        "/api/og?title=UAE+Corporate+Tax+%26+5%25+VAT+Calculator+(2026)&author=Glen+Dias&tag=Free+Zone+QFZP+%26+SBR+Tool",
    });
    upsertJsonLd("calculator-software-jsonld", {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "@id": "https://diasuae.ae/uae-tax-planner#software",
      name: "2026 UAE Corporate Tax & 5% VAT Calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      url: "https://diasuae.ae/uae-tax-planner",
      description:
        "Free 2026 UAE Corporate Tax Calculator (Mainland 9%, 0% Small Business Relief up to AED 3M, Free Zone 0% QFZP De Minimis) and 5% UAE VAT Input Recovery Calculator by Dias Accounting and Tax Consulting LLC.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "AED",
      },
      provider: {
        "@type": "AccountingService",
        "@id": "https://diasuae.ae/#organization",
        name: "Dias Accounting and Tax Consulting LLC",
      },
    });
    window.scrollTo({ top: 0, behavior: "instant" });
    if (onToolStarted) onToolStarted();
    return () => {
      removeJsonLd("calculator-software-jsonld");
    };
  }, [onToolStarted]);

  return (
    <div className="min-h-screen bg-[#070d19] font-sans text-white antialiased selection:bg-[#c5a059]/30 selection:text-white">
      <PageNavigation
        currentPath="/uae-tax-planner"
        onNavigate={onNavigate}
        onOpenAudit={onOpenAudit}
      />

      <main id="main-content">
        {/* Executive Hero Section */}
        <section className="relative bg-[#070d19] text-white pt-12 pb-10 lg:pt-16 lg:pb-12 border-b border-white/10 overflow-hidden">
          <div className="absolute -top-36 right-0 w-[520px] h-[520px] bg-[#c5a059]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-36 left-0 w-[440px] h-[440px] bg-[#0d1b2a] rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-mono text-[#c5a059] mb-5">
              <button
                type="button"
                onClick={() => onNavigate("/")}
                className="hover:underline cursor-pointer"
              >
                Home
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-white">UAE Tax Calculator &amp; Planner</span>
            </div>

            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0d1b2a] border border-[#c5a059]/40 text-[#dec18c] text-xs font-semibold uppercase tracking-wider">
                <Calculator className="w-3.5 h-3.5 text-[#c5a059]" />
                <span>2026 UAE Tax Suite · Real-Time Instant Calculation</span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight">
                2026 UAE Corporate Tax &amp; <span className="text-[#c5a059]">5% VAT Calculator</span> (Free Zone QFZP &amp; SBR)
              </h1>

              <p className="text-[#cbd5e1] text-sm sm:text-base leading-relaxed">
                Model your 2026 UAE Corporate Tax liability across Mainland (9% &amp; 0% Small Business Relief) or Free
                Zone (0% QFZP &amp; De Minimis test), or verify 5% VAT and FTA Form 201 input recovery in real time.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-[#cbd5e1]">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#c5a059]" />
                  <span>FTA-Registered Tax Agents</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>2026 SBR &amp; QFZP Rules Built-In</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#c5a059]" />
                  <span>Instant Results · No Sign-Up Required</span>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Main Split-Card Calculator Section */}
        <section className="py-10 lg:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <UaeTaxCalculatorSuite
            defaultTab={urlDefaultTab}
            onNavigate={onNavigate}
            onResultViewed={onResultViewed}
            onCtaClicked={onCtaClicked}
            onWhatsAppClicked={onWhatsAppClicked}
          />

          {/* Statutory Disclaimer */}
          <div className="mt-8 rounded-2xl bg-[#0d1b2a] border border-white/10 p-4 flex items-start gap-3 text-xs text-[#cbd5e1]">
            <Info className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-white">Disclaimer:</strong> This calculator provides an indicative estimate based
              on UAE Federal Decree-Law No. 47 of 2022 and UAE VAT Decree-Law No. 8 of 2017. Final tax positions depend
              on audited IFRS financial statements, connected-person adjustments, and FTA tax invoice documentation.
            </p>
          </div>

          {/* Executive FAQ Accordion */}
          <div className="mt-14 bg-[#0d1b2a] rounded-3xl border border-white/15 p-6 sm:p-10 shadow-2xl">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-8 space-y-2">
                <span className="text-xs font-mono font-bold text-[#c5a059] uppercase tracking-widest block">
                  2026 UAE TAX RULES
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
                  Frequently Asked Questions
                </h2>
              </div>

              <div className="space-y-3">
                {FAQ_ITEMS.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div
                      key={faq.q}
                      className={`rounded-2xl border overflow-hidden transition-colors ${
                        isOpen ? "border-[#c5a059]/60 bg-[#070d19]" : "border-white/10 bg-[#070d19]/70"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                      >
                        <span className="text-sm font-bold text-white">{faq.q}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-[#c5a059] shrink-0 transition-transform ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-[#cbd5e1] leading-relaxed border-t border-white/10">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
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

export default TaxPlannerPage;

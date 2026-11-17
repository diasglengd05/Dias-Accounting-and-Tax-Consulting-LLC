import React, { useEffect } from "react";
import {
  ShieldCheck,
  ArrowRight,
  Calculator,
  Star,
  Award,
  ChevronRight,
  Sparkles,
  MessageCircle,
} from "lucide-react";
import PageNavigation from "../components/PageNavigation";
import PageFooter from "../components/PageFooter";
import UaeTaxCalculatorSuite from "../components/UaeTaxCalculatorSuite";
import { applyPageSEO, upsertJsonLd, removeJsonLd } from "../lib/seo";

interface CorporateTaxSavingsPageProps {
  onNavigate: (path: string) => void;
  onOpenAudit?: () => void;
  onOpenPrivacy?: () => void;
  onOpenGooglePreferred?: () => void;
}

export const CorporateTaxSavingsPage: React.FC<CorporateTaxSavingsPageProps> = ({
  onNavigate,
  onOpenAudit,
  onOpenPrivacy,
  onOpenGooglePreferred,
}) => {
  useEffect(() => {
    applyPageSEO({
      title: "UAE Corporate Tax & 5% VAT Calculator (2026) | Free Zone QFZP & SBR Tool | Dias Accounting",
      description:
        "Free 2026 UAE Corporate Tax (9%, 0% Small Business Relief & Free Zone QFZP) and 5% VAT Input Recovery Calculator by FTA-Registered Tax Agents in Dubai & Sharjah.",
      canonicalPath: "/corporate-tax-calculator",
      keywords:
        "UAE Corporate Tax Calculator 2026, corporate tax calculator UAE, 9% tax calculator, small business relief assessment UAE, QFZP 0% corporate tax, 5% VAT calculator UAE",
      ogImage:
        "/api/og?title=UAE+Corporate+Tax+%26+5%25+VAT+Calculator+(2026)&author=Glen+Dias&tag=Free+Zone+QFZP+%26+SBR+Tool",
    });
    upsertJsonLd("calculator-software-jsonld", {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "@id": "https://diasuae.ae/corporate-tax-calculator#software",
      name: "2026 UAE Corporate Tax & 5% VAT Calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      url: "https://diasuae.ae/corporate-tax-calculator",
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
    return () => {
      removeJsonLd("calculator-software-jsonld");
    };
  }, []);

  const handleWhatsAppRedirect = () => {
    const msg =
      "Hello Glen Dias, I reviewed the 2026 UAE Corporate Tax & 5% VAT Calculator and would like a confidential tax strategy review for my company.";
    window.open(`https://wa.me/971529226958?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-[#070d19] font-sans text-white antialiased selection:bg-[#c5a059]/30 selection:text-white">
      <PageNavigation
        currentPath="/corporate-tax-calculator"
        onNavigate={onNavigate}
        onOpenAudit={onOpenAudit}
      />

      <main id="main-content">
        {/* 1. Executive Hero Section */}
        <section className="relative bg-[#070d19] text-white pt-12 pb-10 lg:pt-16 lg:pb-12 border-b border-white/10 overflow-hidden">
          <div className="absolute -top-32 right-0 w-[550px] h-[550px] bg-[#c5a059]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[480px] h-[480px] bg-[#0d1b2a] rounded-full blur-3xl pointer-events-none" />

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
              <span className="text-white">Corporate Tax &amp; VAT Calculator</span>
            </div>

            <div className="text-center max-w-3xl mx-auto space-y-5">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0d1b2a] border border-[#c5a059]/40 text-[#dec18c] text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-[#c5a059] shrink-0" />
                <span>Legally Minimize UAE 9% Corporate Tax · Verify 0% QFZP &amp; SBR</span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                2026 UAE Corporate Tax &amp; <span className="text-[#c5a059]">5% VAT Calculator</span> (Free Zone QFZP &amp; SBR)
              </h1>

              <p className="text-[#cbd5e1] text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
                Instantly compute your 2026 UAE Corporate Tax across Mainland (0% Small Business Relief up to AED 3M
                or 9% above AED 375K) and Free Zone (0% QFZP &amp; De Minimis cap), plus 5% UAE VAT input recovery.
              </p>

              {/* Social Proof Strip */}
              <div className="pt-1 flex flex-wrap items-center justify-center gap-6 text-xs text-[#cbd5e1]">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-[#c5a059] fill-[#c5a059]" />
                  <span className="font-bold text-white">5.0 ★</span>
                  <span>Google Rating (150+ Reviews)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>FTA-Registered Tax Agent</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#c5a059]" />
                  <span>100% Audit-Ready Compliance</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Two-Column Split-Card Calculator Suite */}
        <section className="py-10 lg:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <UaeTaxCalculatorSuite
            defaultTab="corporate-tax"
            onNavigate={onNavigate}
          />
        </section>

        {/* 3. The Cost of Non-Compliance & Penalty Table */}
        <section className="py-14 bg-[#0d1b2a]/70 border-y border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400 block mb-2">
                Enforcement Notice
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                The Financial Cost of Delayed Corporate Tax Action
              </h2>
              <p className="text-[#cbd5e1] text-xs sm:text-sm mt-2">
                Under UAE Cabinet Decision No. 75 of 2023, the Federal Tax Authority enforces direct administrative
                penalties on non-compliant entities.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl border border-rose-400/30 bg-[#070d19] space-y-3">
                <span className="font-mono text-2xl font-extrabold text-rose-400 block">
                  AED 10,000
                </span>
                <h3 className="font-display font-bold text-base text-white">
                  Late Corporate Tax Registration
                </h3>
                <p className="text-xs text-[#cbd5e1] leading-relaxed">
                  Direct administrative fine for failing to register for Corporate Tax on EmaraTax before the
                  statutory deadline for your trade license issue month.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-[#c5a059]/40 bg-[#070d19] space-y-3">
                <span className="font-mono text-2xl font-extrabold text-[#c5a059] block">
                  AED 500 – AED 1,000
                </span>
                <h3 className="font-display font-bold text-base text-white">
                  Late Tax Return Filing
                </h3>
                <p className="text-xs text-[#cbd5e1] leading-relaxed">
                  Monthly recurring penalties for late submission of the annual Corporate Tax return (due within 9
                  months of tax period end), plus 14% annual interest on unpaid tax.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-white/15 bg-[#070d19] space-y-3">
                <span className="font-mono text-2xl font-extrabold text-[#dec18c] block">
                  Loss of 0% Status
                </span>
                <h3 className="font-display font-bold text-base text-white">
                  Forfeiture of SBR &amp; QFZP
                </h3>
                <p className="text-xs text-[#cbd5e1] leading-relaxed">
                  Failure to actively elect Small Business Relief or maintain required Transfer Pricing and audited
                  accounts triggers standard 9% Corporate Tax across taxable profit.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Client Case Studies & Actual Savings Proof */}
        <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#c5a059] block mb-2">
              Verified Track Record
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
              How Dias Has Protected Over AED 5.2M in UAE Taxes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#0d1b2a] border border-white/15 space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-[#c5a059] uppercase">Dubai Mainland LLC</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 font-bold">
                  Saved AED 135,000
                </span>
              </div>
              <h3 className="font-display font-bold text-base text-white">
                E-Commerce Trading Company
              </h3>
              <p className="text-xs text-[#cbd5e1] leading-relaxed">
                Turnover of AED 2.85M with AED 620K net profit. Dias formally filed the Small Business Relief (SBR)
                election on EmaraTax, reducing their corporate tax from AED 22,050 to AED 0.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0d1b2a] border border-white/15 space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-[#c5a059] uppercase">SHAMS Free Zone</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 font-bold">
                  Saved AED 198,000
                </span>
              </div>
              <h3 className="font-display font-bold text-base text-white">
                B2B Software Consultancy
              </h3>
              <p className="text-xs text-[#cbd5e1] leading-relaxed">
                Turnover of AED 5.4M. Structured Qualifying Free Zone Person (QFZP) economic substance, prepared
                audited IFRS financials, and achieved full 0% rate on qualifying overseas service revenue.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0d1b2a] border border-white/15 space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-[#c5a059] uppercase">DMCC Free Zone</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 font-bold">
                  Zero Penalties
                </span>
              </div>
              <h3 className="font-display font-bold text-base text-white">
                Logistics &amp; Supply Chain Entity
              </h3>
              <p className="text-xs text-[#cbd5e1] leading-relaxed">
                Had 2 years of unrecorded transactions. Reconstructed 24 months of ledgers in 10 business days,
                registered for CT prior to deadline, avoiding the AED 10,000 penalty.
              </p>
            </div>
          </div>
        </section>

        {/* 5. Bottom Executive Booking Banner */}
        <section className="bg-[#0d1b2a] text-white py-14 border-t border-[#c5a059]/30">
          <div className="max-w-4xl mx-auto px-4 text-center space-y-5">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#c5a059]">
              <Calculator className="w-4 h-4" />
              <span>Partner-Led UAE Tax Strategy</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
              Speak Directly with Glen Dias, Chartered Accountant
            </h2>
            <p className="text-[#cbd5e1] text-sm max-w-xl mx-auto leading-relaxed">
              Confidential, senior-partner assessment of your company&apos;s trial balance, corporate tax exemptions,
              and transfer pricing. Fixed-fee retainers from AED 400/month.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => onNavigate("/#contact")}
                className="bg-[#c5a059] hover:bg-[#dec18c] text-[#070d19] font-display font-bold px-7 py-3.5 rounded-xl text-sm transition-all cursor-pointer shadow-lg shadow-[#c5a059]/20 inline-flex items-center gap-2"
              >
                <span>Book 1-on-1 Confidential Strategy Call</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleWhatsAppRedirect}
                className="border border-[#c5a059]/70 hover:border-[#c5a059] hover:bg-[#c5a059]/10 text-[#dec18c] hover:text-white font-display font-semibold px-6 py-3.5 rounded-xl text-sm transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Chat on WhatsApp (+971 52 922 6958)</span>
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

export default CorporateTaxSavingsPage;

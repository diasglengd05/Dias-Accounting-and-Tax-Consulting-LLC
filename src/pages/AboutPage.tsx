import React, { useEffect } from "react";
import {
  ArrowRight,
  Award,
  Building2,
  CalendarClock,
  ChevronRight,
  FileCheck2,
  Scale,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import PageNavigation from "../components/PageNavigation";
import PageFooter from "../components/PageFooter";
import PageMainTransition from "../components/PageMainTransition";
import SectionCTA from "../components/editorial/SectionCTA";
import {
  applyPageSEO,
  buildBreadcrumbSchema,
  removeJsonLd,
  upsertJsonLd,
} from "../lib/seo";
import {
  ClutchAwardBadge,
  CLUTCH_AWARD_CAPTION,
} from "../components/ClutchBadges";

interface AboutPageProps {
  onNavigate: (path: string) => void;
  onOpenAudit?: () => void;
  onOpenPrivacy?: () => void;
  onOpenGooglePreferred?: () => void;
}

const OPERATING_PRINCIPLES = [
  {
    icon: UserCheck,
    title: "Direct Senior Access",
    description:
      "Every engagement is led by experienced UAE chartered accountants and FTA tax agents—never delegated to junior offshore call centres.",
  },
  {
    icon: Scale,
    title: "Fixed-Fee Clarity",
    description:
      "Predictable monthly retainers starting from AED 400/month with upfront scope agreements and zero hourly billing surprises.",
  },
  {
    icon: ShieldCheck,
    title: "Zero-Penalty Discipline",
    description:
      "Monthly IFRS close workflows and proactive EmaraTax calendars designed to eliminate FTA late-filing and compliance penalties.",
  },
];

const CREDENTIALS_ROW = [
  { icon: Award, label: "Chartered Accountant (CA) · B.Com" },
  { icon: ShieldCheck, label: "FTA Registered Tax Agent" },
  { icon: Building2, label: "SHAMS License 2646813.01" },
  { icon: CalendarClock, label: "15+ Years UAE Practice" },
];

const SOFTWARE_ECOSYSTEM = [
  "Zoho Books Certified Partner",
  "Xero Certified Advisor",
  "QuickBooks Online ProAdvisor",
  "Wafeq FTA-Accredited Partner",
];

export const AboutPage: React.FC<AboutPageProps> = ({
  onNavigate,
  onOpenAudit,
  onOpenPrivacy,
  onOpenGooglePreferred,
}) => {
  useEffect(() => {
    applyPageSEO({
      title: "About Dias Accounting | FTA Tax Consultants Dubai & UAE",
      description:
        "Led by FTA-Registered Tax Agent Glen Dias, Dias Accounting delivers Corporate Tax advisory, VAT compliance, and IFRS bookkeeping across Dubai & Sharjah.",
      canonicalPath: "/about",
      keywords:
        "Glen Dias tax advisor, Dias Accounting LLC, certified tax consultant Dubai, tax consulting services in uae, tax advisory services in dubai",
    });
    upsertJsonLd(
      "page-breadcrumb-jsonld",
      buildBreadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "About Us", path: "/about" },
      ])
    );
    window.scrollTo({ top: 0, behavior: "instant" });
    return () => {
      removeJsonLd("page-breadcrumb-jsonld");
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#FFFFFF] font-sans text-[#0D1B2A] antialiased">
      <PageNavigation
        currentPath="/about"
        onNavigate={onNavigate}
        onOpenAudit={onOpenAudit}
      />

      <PageMainTransition id="main-content">
        {/* 1. Focused Positioning Hero */}
        <section className="bg-[#FFFFFF] border-b border-[#E2E8F0] pt-12 pb-16 lg:pt-20 lg:pb-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-1.5 text-xs sm:text-sm text-[#475569] mb-8"
            >
              <button
                type="button"
                onClick={() => onNavigate("/")}
                className="hover:text-[#0D1B2A] transition-colors cursor-pointer"
              >
                Home
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[#0D1B2A] font-medium">About Us</span>
            </nav>

            <div className="max-w-3xl space-y-5">
              <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#856422]">
                Dias Accounting &amp; Tax Consulting LLC
              </span>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0D1B2A] tracking-tight leading-[1.12] text-balance">
                Senior UAE Tax &amp; Accounting Expertise, Without Agency Overhead.
              </h1>
              <p className="text-base sm:text-lg text-[#475569] leading-[1.65] max-w-[65ch]">
                Headquartered in Sharjah Media City (SHAMS) and serving Mainland and Free Zone businesses across all seven Emirates, we deliver audit-ready IFRS bookkeeping, 5% VAT compliance, and 9% Corporate Tax advisory with direct partner accountability.
              </p>

              <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <button
                  type="button"
                  onClick={() => onNavigate("/contact")}
                  className="min-h-[48px] px-6 py-3 rounded-xl bg-[#1B4332] hover:bg-[#143326] text-white text-sm font-semibold transition-colors cursor-pointer inline-flex items-center justify-center gap-2"
                >
                  <span>Book Free Consultation</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate("/pricing")}
                  className="min-h-[48px] px-6 py-3 rounded-xl bg-[#FFFFFF] hover:bg-[#F8FAFC] border border-[#E2E8F0] text-[#0D1B2A] text-sm font-semibold transition-colors cursor-pointer inline-flex items-center justify-center"
                >
                  Explore Fixed-Fee Pricing
                </button>
              </div>
            </div>

            {/* Quiet Fact Strip */}
            <div className="mt-14 pt-8 border-t border-[#E2E8F0] grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
              <div>
                <p className="font-display text-2xl sm:text-3xl font-bold text-[#0D1B2A] tabular-nums">
                  15+ Years
                </p>
                <p className="text-sm text-[#475569] mt-1">
                  UAE corporate finance, audit, and tax advisory practice
                </p>
              </div>
              <div>
                <p className="font-display text-2xl sm:text-3xl font-bold text-[#0D1B2A] tabular-nums">
                  50+ Active Entities
                </p>
                <p className="text-sm text-[#475569] mt-1">
                  Mainland LLCs, DIFC/DTEC firms, and SME founders advised
                </p>
              </div>
              <div>
                <p className="font-display text-2xl sm:text-3xl font-bold text-[#0D1B2A] tabular-nums">
                  40+ Free Zones
                </p>
                <p className="text-sm text-[#475569] mt-1">
                  SHAMS, DIFC, DTEC, DMCC, IFZA, and Dubai DET coverage
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Founder & Leadership Spotlight */}
        <section className="bg-[#F8FAFC] border-b border-[#E2E8F0] py-20 lg:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
              {/* Crisp Executive Portrait Container */}
              <div className="lg:col-span-5">
                <div className="rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] p-8 sm:p-10 shadow-[0_8px_28px_-16px_rgba(13,27,42,0.08)]">
                  <div className="aspect-[4/4] rounded-xl bg-[#0D1B2A] flex flex-col justify-between p-8 text-white relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#C5A059]">
                        Managing Partner
                      </span>
                      <span className="text-xs text-slate-400 tabular-nums">
                        Dubai &amp; Sharjah
                      </span>
                    </div>

                    <div className="my-auto py-6">
                      <div className="w-20 h-20 rounded-2xl border border-[#C5A059]/40 bg-white/5 flex items-center justify-center font-display text-3xl font-bold text-white tracking-tight mb-6">
                        GD
                      </div>
                      <p className="font-display text-2xl font-bold text-white tracking-tight">
                        Glen Gilbert Dias
                      </p>
                      <p className="text-sm text-slate-300 mt-1">
                        Senior Tax Advisor &amp; FTA Registered Tax Agent
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
                      <span>Dias Accounting LLC</span>
                      <span className="text-[#C5A059] font-medium tabular-nums">
                        Est. UAE Practice
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Human Founder Bio + Horizontal Credentials Row */}
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-2">
                  <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#856422]">
                    Leadership &amp; Accountability
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0D1B2A] tracking-tight">
                    Led directly by Glen Gilbert Dias
                  </h2>
                </div>

                <div className="space-y-4 text-[15px] sm:text-base text-[#475569] leading-[1.65] max-w-[65ch]">
                  <p>
                    Dias Accounting &amp; Tax Consulting LLC was built on a straightforward premise: UAE founders and finance managers deserve partner-level tax judgment and disciplined monthly bookkeeping without big-firm bureaucracy or unpredictable hourly fees.
                  </p>
                  <p>
                    With over 15 years of corporate finance, auditing, and tax advisory experience in the United Arab Emirates, Glen Gilbert Dias leads firm engagements spanning Mainland 9% Corporate Tax structuring, 0% Qualifying Free Zone Person (QFZP) substantiation, Small Business Relief (SBR) elections, Transfer Pricing documentation, and formal FTA audit representations.
                  </p>
                  <p>
                    Following the introduction of Federal Decree-Law No. 8 of 2017 (UAE VAT) and Federal Decree-Law No. 47 of 2022 (UAE Corporate Tax), our practice focuses on keeping every client&apos;s ledgers IFRS-compliant and EmaraTax filings defensible well ahead of statutory deadlines.
                  </p>
                </div>

                {/* Clean Horizontal Credentials Row */}
                <div className="pt-5 border-t border-[#E2E8F0] grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {CREDENTIALS_ROW.map((cred) => {
                    const Icon = cred.icon;
                    return (
                      <div
                        key={cred.label}
                        className="flex items-center gap-2.5 text-sm text-[#0D1B2A]"
                      >
                        <Icon className="w-4 h-4 text-[#475569] shrink-0" aria-hidden="true" />
                        <span className="font-medium tabular-nums">{cred.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 2026 Clutch Awards & Independent Industry Recognition */}
            <div className="rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 shadow-[0_8px_28px_-16px_rgba(13,27,42,0.06)]">
              <ClutchAwardBadge />
              <div className="space-y-2">
                <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#856422]">
                  2026 Clutch Industry Awards
                </span>
                <h3 className="font-display text-lg sm:text-xl font-bold text-[#0D1B2A] tracking-tight">
                  Top Financial Forecast &amp; Financial Risk Advisory Consultants — United Arab Emirates (2026)
                </h3>
                <p className="text-sm sm:text-base text-[#475569] leading-[1.65] max-w-[65ch]">
                  {CLUTCH_AWARD_CAPTION} Alongside our Federal Tax Authority (FTA) Registered Tax Agency status, these distinctions reflect our partner-led rigor across UAE cash-flow modeling, financial risk governance, IFRS management reporting, and Fractional CFO advisory.
                </p>
              </div>
            </div>

            {/* Senior Practice Desks (Understated 2-Column Split) */}
            <div className="pt-12 border-t border-[#E2E8F0]">
              <div className="mb-8">
                <h3 className="font-display text-xl font-bold text-[#0D1B2A] tracking-tight">
                  Dedicated Advisory Desks
                </h3>
                <p className="text-sm sm:text-base text-[#475569] mt-1 max-w-[65ch]">
                  Specialist execution teams supporting monthly accounting, statutory filings, and UAE company incorporation.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] p-7 space-y-2.5">
                  <div className="flex items-center justify-between gap-4">
                    <h4 className="font-display text-base sm:text-lg font-bold text-[#0D1B2A]">
                      Senior Tax &amp; IFRS Compliance Lead
                    </h4>
                    <span className="text-xs font-medium text-[#64748B] tabular-nums shrink-0">
                      8+ Years UAE
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-[#856422]">
                    ACCA / CA · Certified VAT Practitioner
                  </p>
                  <p className="text-sm text-[#475569] leading-[1.65] pt-1">
                    Oversees monthly double-entry IFRS reconciliations, quarterly Form 201 VAT returns, year-end trial balance preparation, and FTA audit defense files.
                  </p>
                </div>

                <div className="rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] p-7 space-y-2.5">
                  <div className="flex items-center justify-between gap-4">
                    <h4 className="font-display text-base sm:text-lg font-bold text-[#0D1B2A]">
                      Corporate Services &amp; Setup Desk
                    </h4>
                    <span className="text-xs font-medium text-[#64748B] tabular-nums shrink-0">
                      7+ Years UAE
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-[#856422]">
                    Corporate Governance &amp; Licensing Liaison
                  </p>
                  <p className="text-sm text-[#475569] leading-[1.65] pt-1">
                    Coordinates Mainland (Dubai DET) and Free Zone (SHAMS, DMCC, IFZA, DTEC) incorporation, trade licensing, and Tier-1 UAE corporate banking onboarding.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Core Operating Principles */}
        <section className="bg-[#FFFFFF] py-20 lg:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="max-w-2xl space-y-2">
                <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#856422]">
                  How We Operate
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0D1B2A] tracking-tight">
                  Core Operating Principles
                </h2>
              </div>
              <a
                href="/why-choose-us"
                onClick={(e) => {
                  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                  e.preventDefault();
                  onNavigate("/why-choose-us");
                }}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1B4332] hover:text-[#0D1B2A] transition-colors shrink-0"
              >
                <span>Compare why UAE firms choose Dias</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {OPERATING_PRINCIPLES.map((principle) => {
                const Icon = principle.icon;
                return (
                  <div
                    key={principle.title}
                    className="rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] p-7 sm:p-8 space-y-4"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] flex items-center justify-center text-[#0D1B2A]">
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <h3 className="font-display text-lg font-bold text-[#0D1B2A]">
                      {principle.title}
                    </h3>
                    <p className="text-sm text-[#475569] leading-[1.65]">
                      {principle.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Understated Software & FTA Ecosystem Line */}
            <div className="pt-8 border-t border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#475569]">
                <FileCheck2 className="w-4 h-4 text-[#1B4332]" aria-hidden="true" />
                <span>Accredited Cloud Ecosystem</span>
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[#475569]">
                {SOFTWARE_ECOSYSTEM.map((partner) => (
                  <span key={partner} className="font-medium text-[#0D1B2A]">
                    {partner}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 4. Single Closing CTA Banner */}
        <SectionCTA
          variant="navy"
          eyebrow="Direct Partner Advisory"
          title="Speak directly with an FTA-Registered Tax Agent."
          description="Schedule a confidential 15-minute review of your UAE accounting, VAT, or Corporate Tax position, or compare our transparent fixed-fee monthly plans."
          ctaLabel="Book Free Consultation"
          onCtaClick={() => onNavigate("/contact")}
          secondaryLabel="Explore Fixed-Fee Pricing →"
          onSecondaryClick={() => onNavigate("/pricing")}
        />
      </PageMainTransition>

      <PageFooter
        onNavigate={onNavigate}
        onOpenPrivacy={onOpenPrivacy}
        onOpenGooglePreferred={onOpenGooglePreferred}
      />
    </div>
  );
};

export default AboutPage;

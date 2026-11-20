import React, { useEffect } from "react";
import {
  ArrowRight,
  Briefcase,
  Building,
  Calculator,
  Check,
  ChevronRight,
  Clock,
  FileCheck,
  Percent,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import PageNavigation from "../components/PageNavigation";
import PageFooter from "../components/PageFooter";
import { ExecutiveClosingCta } from "../components/hub/ExecutivePrimitives";
import { servicesData } from "../data/staticData";
import {
  applyPageSEO,
  buildBreadcrumbSchema,
  removeJsonLd,
  upsertJsonLd,
} from "../lib/seo";

interface ServicesPageProps {
  onNavigate: (path: string) => void;
  onOpenAudit?: () => void;
  onOpenPrivacy?: () => void;
  onOpenGooglePreferred?: () => void;
}

const SPECIALIZED_HUB_LINKS = [
  {
    title: "DIFC & DTEC Accounting & 0% QFZP",
    description:
      "Common-law IFRS audits, 0% Qualifying Free Zone Person structuring, and investor reporting for DIFC and DTEC entities.",
    path: "/tax-planning-difc",
  },
  {
    title: "Dividends Audit & Profit Certification",
    description:
      "Statutory distributable profit verification, 10% legal reserve compliance, and bank remittance audit certificates.",
    path: "/dividends-audit",
  },
  {
    title: "Small Business Tax Relief (0% SBR)",
    description:
      "EmaraTax Article 21 election guidance for UAE entities with gross revenue up to AED 3,000,000 through 2029.",
    path: "/small-business-tax-relief",
  },
];

export const ServicesPage: React.FC<ServicesPageProps> = ({
  onNavigate,
  onOpenAudit,
  onOpenPrivacy,
  onOpenGooglePreferred,
}) => {
  useEffect(() => {
    applyPageSEO({
      title: "UAE Corporate Tax, VAT & Accounting Services | Dias",
      description:
        "FTA-Registered Corporate Tax, 5% VAT filing, fixed-fee IFRS bookkeeping, backlog cleanup, and DIFC/DTEC tax services across Dubai & all 7 UAE Emirates.",
      canonicalPath: "/services",
      keywords:
        "Corporate Tax UAE, VAT compliance Dubai, IFRS bookkeeping UAE, DIFC tax compliance, backlog accounting Dubai",
    });
    upsertJsonLd(
      "page-breadcrumb-jsonld",
      buildBreadcrumbSchema(
        [
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ],
        "https://diasuae.ae/services#breadcrumb"
      )
    );
    window.scrollTo({ top: 0, behavior: "instant" });
    return () => {
      removeJsonLd("page-breadcrumb-jsonld");
    };
  }, []);

  const getIcon = (iconName: string) => {
    const iconProps = "w-5 h-5 text-[#0D1B2A]";
    switch (iconName) {
      case "Calculator":
        return <Calculator className={iconProps} />;
      case "TrendingUp":
        return <TrendingUp className={iconProps} />;
      case "Percent":
        return <Percent className={iconProps} />;
      case "Building":
        return <Building className={iconProps} />;
      case "Clock":
        return <Clock className={iconProps} />;
      case "FileCheck":
        return <FileCheck className={iconProps} />;
      case "ShieldCheck":
        return <ShieldCheck className={iconProps} />;
      case "Briefcase":
        return <Briefcase className={iconProps} />;
      default:
        return <Sparkles className={iconProps} />;
    }
  };

  const handleBook = () => {
    if (onOpenAudit) {
      onOpenAudit();
    } else {
      onNavigate("/contact");
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] font-sans text-[#0D1B2A] antialiased flex flex-col">
      <PageNavigation
        currentPath="/services"
        onNavigate={onNavigate}
        onOpenAudit={onOpenAudit}
      />

      <main id="main-content" className="flex-1">
        {/* 1. Focused Executive Hero */}
        <section className="bg-[#FFFFFF] pt-12 pb-14 lg:pt-20 lg:pb-20 border-b border-[#E2E8F0]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-1.5 text-xs font-medium text-[#475569] mb-6"
            >
              <button
                type="button"
                onClick={() => onNavigate("/")}
                className="hover:text-[#0D1B2A] transition-colors cursor-pointer"
              >
                Home
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[#0D1B2A] font-semibold">Services</span>
            </nav>

            <div className="max-w-3xl space-y-5">
              <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#856422]">
                FTA-Registered Tax Agency · Dubai &amp; Sharjah
              </span>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-[46px] font-bold text-[#0D1B2A] tracking-tight leading-[1.14]">
                UAE Tax, VAT &amp; IFRS Accounting Services
              </h1>
              <p className="text-[#475569] text-base sm:text-lg leading-[1.65] max-w-[65ch]">
                Senior-led Corporate Tax compliance, quarterly VAT Form 201 filings, monthly IFRS bookkeeping, and DIFC audit readiness across all seven UAE Emirates.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-5">
                <button
                  type="button"
                  onClick={handleBook}
                  className="min-h-[48px] px-6 py-3 rounded-xl bg-[#1B4332] hover:bg-[#143326] text-white text-sm font-semibold transition-colors cursor-pointer inline-flex items-center gap-2 shadow-xs"
                >
                  <span>Book Free Consultation</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate("/pricing")}
                  className="min-h-[44px] px-1 text-sm font-semibold text-[#0D1B2A] hover:text-[#1B4332] transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <span>See Fixed-Fee Pricing</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>
              </div>
            </div>

            {/* Clean Metadata Strip */}
            <div className="mt-10 pt-8 border-t border-[#E2E8F0] grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] px-5 py-4">
                <span className="block text-xs font-medium text-[#64748B] mb-1">Ideal For</span>
                <span className="block text-sm sm:text-base font-semibold text-[#0D1B2A]">
                  UAE Mainland, DIFC &amp; Free Zone Entities
                </span>
              </div>
              <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] px-5 py-4">
                <span className="block text-xs font-medium text-[#64748B] mb-1">Retainer Pricing</span>
                <span className="block text-sm sm:text-base font-semibold text-[#0D1B2A] tabular-nums">
                  Fixed Fees From AED 400 / Month
                </span>
              </div>
              <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] px-5 py-4">
                <span className="block text-xs font-medium text-[#64748B] mb-1">Compliance Standard</span>
                <span className="block text-sm sm:text-base font-semibold text-[#0D1B2A]">
                  FTA EmaraTax &amp; Full IFRS Compliant
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Core Practice Areas Grid */}
        <section className="bg-[#F8FAFC] py-16 lg:py-24 border-b border-[#E2E8F0]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="max-w-2xl space-y-2.5">
              <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#856422]">
                Core Practice Areas
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0D1B2A] tracking-tight">
                Essential Compliance &amp; Accounting Disciplines
              </h2>
              <p className="text-[#475569] text-base leading-[1.65] max-w-[65ch]">
                Foundational monthly bookkeeping, 9% Corporate Tax returns, 5% VAT filings, and statutory audit readiness led by Senior Tax Advisor Glen Dias.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {servicesData.slice(0, 4).map((service) => (
                <article
                  key={service.id}
                  className="rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] p-7 sm:p-8 shadow-[0_6px_24px_-12px_rgba(13,27,42,0.06)] hover:border-[#0D1B2A]/40 transition-colors flex flex-col justify-between gap-6"
                >
                  <div className="space-y-4">
                    <div className="w-11 h-11 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center">
                      {getIcon(service.iconName)}
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-display text-xl font-bold text-[#0D1B2A] tracking-tight">
                        {service.title}
                      </h3>
                      <p className="text-sm text-[#475569] leading-[1.65] max-w-[60ch]">
                        {service.shortDesc}
                      </p>
                    </div>
                    <ul className="space-y-2 pt-2">
                      {service.inclusions.slice(0, 3).map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-sm text-[#334155]">
                          <Check className="w-4 h-4 text-[#1B4332] shrink-0 mt-0.5" strokeWidth={2.25} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-[#E2E8F0]">
                    <button
                      type="button"
                      onClick={() => onNavigate(`/services/${service.id}`)}
                      className="min-h-[44px] text-sm font-semibold text-[#1B4332] hover:text-[#0D1B2A] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Explore Service Scope</span>
                      <ArrowRight className="w-4 h-4 shrink-0" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Specialized Advisory & Corporate Solutions */}
        <section className="bg-[#FFFFFF] py-16 lg:py-24 border-b border-[#E2E8F0]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="max-w-2xl space-y-2.5">
              <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#856422]">
                Specialized Solutions
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0D1B2A] tracking-tight">
                Backlog Cleanup, Transfer Pricing &amp; CFO Advisory
              </h2>
              <p className="text-[#475569] text-base leading-[1.65] max-w-[65ch]">
                Targeted engagements for historical ledger reconstruction, DNFBP AML/goAML compliance, OECD Transfer Pricing, company formation, and fractional CFO oversight.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {servicesData.slice(4).map((service) => (
                <article
                  key={service.id}
                  className="rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] p-6 sm:p-7 shadow-[0_6px_24px_-12px_rgba(13,27,42,0.06)] hover:border-[#0D1B2A]/40 transition-colors flex flex-col justify-between gap-6"
                >
                  <div className="space-y-4">
                    <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center">
                      {getIcon(service.iconName)}
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="font-display text-lg font-bold text-[#0D1B2A] leading-snug">
                        {service.title}
                      </h3>
                      <p className="text-sm text-[#475569] leading-relaxed">
                        {service.shortDesc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#E2E8F0]">
                    <button
                      type="button"
                      onClick={() => onNavigate(`/services/${service.id}`)}
                      className="min-h-[44px] text-sm font-semibold text-[#1B4332] hover:text-[#0D1B2A] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>View Service Details</span>
                      <ArrowRight className="w-4 h-4 shrink-0" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Jurisdiction & Statutory Practice Hubs */}
        <section className="bg-[#F8FAFC] py-16 lg:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="max-w-2xl space-y-2">
              <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#856422]">
                Dedicated Practices
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0D1B2A] tracking-tight">
                Free Zone, Dividend &amp; Tax Relief Practices
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SPECIALIZED_HUB_LINKS.map((hub) => (
                <button
                  key={hub.path}
                  type="button"
                  onClick={() => onNavigate(hub.path)}
                  className="text-left rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#0D1B2A] p-6 sm:p-7 transition-colors cursor-pointer flex flex-col justify-between gap-4"
                >
                  <div className="space-y-2">
                    <h3 className="font-display text-base font-bold text-[#0D1B2A]">
                      {hub.title}
                    </h3>
                    <p className="text-sm text-[#475569] leading-relaxed">{hub.description}</p>
                  </div>
                  <span className="text-sm font-semibold text-[#1B4332] inline-flex items-center gap-1.5">
                    <span>Open Guide</span>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Closing Executive CTA */}
        <ExecutiveClosingCta
          eyebrow="Managing Partner Advisory"
          title="Secure Your UAE Tax & Accounting Position"
          description="Schedule a confidential 15-minute review with Glen Dias, FTA-Registered Tax Agent. We evaluate your corporate structure, deadlines, and fixed-fee scope."
          ctaLabel="Book Free Consultation"
          onCtaClick={handleBook}
          secondaryLabel="Try 2026 UAE Tax Calculator →"
          onSecondaryClick={() => onNavigate("/uae-tax-planner")}
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

export default ServicesPage;

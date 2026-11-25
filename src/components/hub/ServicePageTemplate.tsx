import React from "react";
import { ArrowRight, Check, ChevronRight } from "lucide-react";
import PageNavigation from "../PageNavigation";
import PageFooter from "../PageFooter";
import {
  AccordionItem,
  ExecutiveAccordion,
  ExecutiveClosingCta,
} from "./ExecutivePrimitives";
import { RelatedResources } from "../editorial/RelatedResources";
import { getRelatedResourcesForPath } from "../../lib/internalLinks";

export interface ServiceDeliverableCard {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface ServiceProcessStep {
  number: string;
  title: string;
  description: string;
}

export interface ServiceMetadataItem {
  label: string;
  value: string;
}

export interface ServiceRelatedLink {
  label: string;
  path: string;
}

export interface ServicePageTemplateProps {
  currentPath: string;
  breadcrumbName: string;
  eyebrow?: string;
  title: string;
  subtitle: string;
  metadataStrip: ServiceMetadataItem[];
  deliverablesHeading?: string;
  deliverablesSubheading?: string;
  deliverables: ServiceDeliverableCard[];
  heroBottomSlot?: React.ReactNode;
  customTopSection?: React.ReactNode;
  processHeading?: string;
  processSubheading?: string;
  processSteps: ServiceProcessStep[];
  whoIsItForHeading?: string;
  whoIsItForSubheading?: string;
  whoIsItForItems: string[];
  regulatorySnapshot?: {
    law: string;
    authority: string;
    deadline: string;
    plan: string;
  };
  faqsHeading?: string;
  customFaqSection?: React.ReactNode;
  faqs: AccordionItem[];
  relatedServices?: ServiceRelatedLink[];
  closingCta: {
    eyebrow: string;
    title: string;
    description: string;
    ctaLabel: string;
  };
  onNavigate: (path: string) => void;
  onOpenAudit?: () => void;
  onOpenPrivacy?: () => void;
  onOpenGooglePreferred?: () => void;
}

export const ServicePageTemplate: React.FC<ServicePageTemplateProps> = ({
  currentPath,
  breadcrumbName,
  eyebrow = "FTA-Registered Advisory",
  title,
  subtitle,
  metadataStrip,
  deliverablesHeading = "What's Included",
  deliverablesSubheading = "Structured deliverables managed directly by senior UAE chartered accountants and tax specialists.",
  deliverables,
  heroBottomSlot,
  customTopSection,
  processHeading = "How We Work",
  processSubheading = "A predictable, low-friction onboarding and execution workflow with zero surprise handoffs.",
  processSteps,
  whoIsItForHeading = "Who This Service Is For",
  whoIsItForSubheading = "Built for UAE Mainland and Free Zone entities requiring dependable regulatory execution.",
  whoIsItForItems,
  regulatorySnapshot,
  faqsHeading = "Frequently Asked Questions",
  customFaqSection,
  faqs,
  relatedServices,
  closingCta,
  onNavigate,
  onOpenAudit,
  onOpenPrivacy,
  onOpenGooglePreferred,
}) => {
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
        currentPath={currentPath}
        onNavigate={onNavigate}
        onOpenAudit={onOpenAudit}
      />

      <main id="main-content" className="flex-1">
        {/* 1. Focused Executive Hero */}
        <section className="bg-[#FFFFFF] pt-12 pb-14 lg:pt-20 lg:pb-20 border-b border-[#E2E8F0]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Subtle Breadcrumb */}
            <nav
              aria-label="Breadcrumb"
              className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-[#475569] mb-6"
            >
              <button
                type="button"
                onClick={() => onNavigate("/")}
                className="hover:text-[#0D1B2A] transition-colors cursor-pointer"
              >
                Home
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <button
                type="button"
                onClick={() => onNavigate("/services")}
                className="hover:text-[#0D1B2A] transition-colors cursor-pointer"
              >
                Services
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[#0D1B2A] font-semibold">{breadcrumbName}</span>
            </nav>

            <div className="max-w-3xl space-y-5">
              <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#856422]">
                {eyebrow}
              </span>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-[46px] font-bold text-[#0D1B2A] tracking-tight leading-[1.14]">
                {title}
              </h1>
              <p className="text-[#475569] text-base sm:text-lg leading-[1.65] max-w-[65ch]">
                {subtitle}
              </p>

              {/* Max 2 Actions */}
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

            {/* Clean Horizontal Metadata Strip */}
            {metadataStrip.length > 0 && (
              <div className="mt-10 pt-8 border-t border-[#E2E8F0] grid grid-cols-1 sm:grid-cols-3 gap-5">
                {metadataStrip.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] px-5 py-4"
                  >
                    <span className="block text-xs font-medium text-[#64748B] mb-1">
                      {item.label}
                    </span>
                    <span className="block text-sm sm:text-base font-semibold text-[#0D1B2A] tabular-nums">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {heroBottomSlot && <div className="mt-8">{heroBottomSlot}</div>}
          </div>
        </section>

        {/* Optional Specialized Section (e.g., DIFC vs DTEC or Statutory Legal Rules) */}
        {customTopSection}

        {/* 2. "What's Included" Modular Grid */}
        <section className="bg-[#F8FAFC] py-16 lg:py-24 border-b border-[#E2E8F0]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-12 space-y-2.5">
              <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#856422]">
                Deliverables
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0D1B2A] tracking-tight">
                {deliverablesHeading}
              </h2>
              <p className="text-[#475569] text-base leading-[1.65] max-w-[65ch]">
                {deliverablesSubheading}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {deliverables.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] p-6 sm:p-7 shadow-[0_6px_24px_-12px_rgba(13,27,42,0.06)] space-y-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#0D1B2A]">
                    {item.icon}
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-display font-bold text-base text-[#0D1B2A] leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[#475569] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. "How We Work" Clean Process Strip */}
        <section className="bg-[#FFFFFF] py-16 lg:py-24 border-b border-[#E2E8F0]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-12 space-y-2.5">
              <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#856422]">
                Methodology
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0D1B2A] tracking-tight">
                {processHeading}
              </h2>
              <p className="text-[#475569] text-base leading-[1.65] max-w-[65ch]">
                {processSubheading}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {processSteps.map((step) => (
                <div
                  key={step.number}
                  className="relative pt-5 border-t-2 border-[#E2E8F0] space-y-2.5"
                >
                  <span className="inline-block text-xs font-bold text-[#1B4332] tabular-nums tracking-wider">
                    {step.number}
                  </span>
                  <h3 className="font-display font-bold text-base text-[#0D1B2A]">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[#475569] leading-[1.6]">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Scope Clarity: Who This Service Is For + Regulatory Snapshot */}
        <section className="bg-[#F8FAFC] py-16 lg:py-24 border-b border-[#E2E8F0]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="max-w-2xl space-y-2.5">
              <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#856422]">
                Scope &amp; Fit
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0D1B2A] tracking-tight">
                {whoIsItForHeading}
              </h2>
              <p className="text-[#475569] text-base leading-[1.65] max-w-[65ch]">
                {whoIsItForSubheading}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {whoIsItForItems.map((item) => (
                <div
                  key={item}
                  className="rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] px-5 py-4 flex items-start gap-3"
                >
                  <Check
                    className="w-4 h-4 text-[#1B4332] shrink-0 mt-1"
                    strokeWidth={2.5}
                  />
                  <span className="text-sm sm:text-[15px] text-[#0D1B2A] leading-relaxed">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            {regulatorySnapshot && (
              <div className="rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] p-6 sm:p-7">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#475569] mb-4">
                  Statutory &amp; Engagement Summary
                </p>
                <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-sm">
                  <div>
                    <dt className="text-xs text-[#64748B] mb-1">Governing Law</dt>
                    <dd className="font-semibold text-[#0D1B2A] leading-snug">
                      {regulatorySnapshot.law}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[#64748B] mb-1">Authority</dt>
                    <dd className="font-semibold text-[#0D1B2A] leading-snug">
                      {regulatorySnapshot.authority}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[#64748B] mb-1">Statutory Timeline</dt>
                    <dd className="font-semibold text-[#0D1B2A] leading-snug tabular-nums">
                      {regulatorySnapshot.deadline}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[#64748B] mb-1">Recommended Plan</dt>
                    <dd className="font-semibold text-[#1B4332] leading-snug tabular-nums">
                      {regulatorySnapshot.plan}
                    </dd>
                  </div>
                </dl>
              </div>
            )}
          </div>
        </section>

        {/* 5. Service FAQ Accordion */}
        {(faqs.length > 0 || customFaqSection) && (
          <section id="faqs" className="bg-[#FFFFFF] py-16 lg:py-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-10 space-y-2">
                <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#856422]">
                  Common Questions
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0D1B2A] tracking-tight">
                  {faqsHeading}
                </h2>
              </div>

              {customFaqSection && <div className="mb-10">{customFaqSection}</div>}

              {faqs.length > 0 && (
                <div className="max-w-3xl mx-auto">
                  <ExecutiveAccordion items={faqs} defaultOpenIndex={0} />
                </div>
              )}
            </div>
          </section>
        )}

        {/* Strategic UAE Tax & Compliance Internal Links (Max 3 Cards) */}
        <RelatedResources
          eyebrow="Related UAE Tax & Compliance Resources"
          heading="Recommended Next Steps"
          items={getRelatedResourcesForPath(currentPath)}
          onNavigate={onNavigate}
          background="neutral"
        />

        {/* 6. Single Closing Deep Navy CTA Card */}
        <ExecutiveClosingCta
          eyebrow={closingCta.eyebrow}
          title={closingCta.title}
          description={closingCta.description}
          ctaLabel={closingCta.ctaLabel}
          onCtaClick={handleBook}
          secondaryLabel="View Fixed-Fee Pricing →"
          onSecondaryClick={() => onNavigate("/pricing")}
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

export default ServicePageTemplate;

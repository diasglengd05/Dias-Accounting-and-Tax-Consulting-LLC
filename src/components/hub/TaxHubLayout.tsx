import React from "react";
import { ChevronRight } from "lucide-react";
import PageNavigation from "../PageNavigation";
import PageFooter from "../PageFooter";
import { MobileJumpBar, StickyTOC, TocItem, useActiveSection } from "./StickyTOC";
import { ExecutiveClosingCta } from "./ExecutivePrimitives";
import { RelatedResources } from "../editorial/RelatedResources";
import { getRelatedResourcesForPath } from "../../lib/internalLinks";

export interface HubKeyFigure {
  value: string;
  label: string;
}

export interface TaxHubLayoutProps {
  currentPath: string;
  breadcrumbName: string;
  updatedTag?: string;
  title: string;
  overview: string;
  keyFigures: HubKeyFigure[];
  tocItems: TocItem[];
  guidancePrompt?: string;
  children: React.ReactNode;
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

export const TaxHubLayout: React.FC<TaxHubLayoutProps> = ({
  currentPath,
  breadcrumbName,
  updatedTag = "Last Updated: 2026 UAE Tax Rules",
  title,
  overview,
  keyFigures,
  tocItems,
  guidancePrompt,
  children,
  closingCta,
  onNavigate,
  onOpenAudit,
  onOpenPrivacy,
  onOpenGooglePreferred,
}) => {
  const { activeId, setActiveId } = useActiveSection(tocItems);

  const handleJump = (id: string) => {
    setActiveId(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
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
        currentPath={currentPath}
        onNavigate={onNavigate}
        onOpenAudit={onOpenAudit}
      />

      <main id="main-content" className="flex-1">
        {/* 1. Clean Hub Header & Key Figures Strip */}
        <section className="bg-[#FFFFFF] pt-12 pb-12 lg:pt-16 lg:pb-14 border-b border-[#E2E8F0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                onClick={() => onNavigate("/uae-tax-planner")}
                className="hover:text-[#0D1B2A] transition-colors cursor-pointer"
              >
                Tax Compliance Hubs
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[#0D1B2A] font-semibold">{breadcrumbName}</span>
            </nav>

            <div className="max-w-3xl space-y-4">
              <span className="inline-block text-xs font-semibold tracking-wider uppercase text-[#856422]">
                {updatedTag}
              </span>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#0D1B2A] tracking-tight leading-[1.15]">
                {title}
              </h1>
              <p className="text-[#475569] text-base sm:text-lg leading-[1.65] max-w-[65ch]">
                {overview}
              </p>
            </div>

            {/* 3- or 4-Column Key Thresholds / Quick Facts Strip */}
            {keyFigures.length > 0 && (
              <div
                className={`mt-10 grid grid-cols-2 ${
                  keyFigures.length === 3 ? "md:grid-cols-3" : "md:grid-cols-4"
                } gap-4`}
              >
                {keyFigures.map((fig) => (
                  <div
                    key={fig.label}
                    className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] px-5 py-4"
                  >
                    <span className="block font-display text-xl sm:text-2xl font-bold text-[#0D1B2A] tracking-tight tabular-nums">
                      {fig.value}
                    </span>
                    <span className="block text-xs text-[#475569] mt-1 leading-snug">
                      {fig.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Mobile Sticky Jump-to-Section Dropdown */}
        {tocItems.length > 0 && (
          <MobileJumpBar items={tocItems} activeId={activeId} onJump={handleJump} />
        )}

        {/* 2. Two-Column Executive Reading Layout (Desktop ~70% Main / ~28% Sticky Sidebar) */}
        <section className="bg-[#F8FAFC] py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
              {/* Main Content Column (~70%) */}
              <article className="lg:col-span-8 min-w-0 space-y-12 lg:space-y-14">
                {children}
              </article>

              {/* Sticky Sidebar (~28%) */}
              <div className="lg:col-span-4 min-w-0">
                <StickyTOC
                  items={tocItems}
                  activeId={activeId}
                  onJump={handleJump}
                  onBookConsultation={handleBook}
                  guidancePrompt={guidancePrompt}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Strategic UAE Tax & Compliance Internal Links (Max 3 Cards) */}
        <RelatedResources
          eyebrow="Related UAE Tax & Compliance Resources"
          heading="Continue Exploring UAE Tax Compliance"
          items={getRelatedResourcesForPath(currentPath)}
          onNavigate={onNavigate}
          background="white"
        />

        {/* Closing Deep Navy Executive CTA */}
        <ExecutiveClosingCta
          eyebrow={closingCta.eyebrow}
          title={closingCta.title}
          description={closingCta.description}
          ctaLabel={closingCta.ctaLabel}
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

export default TaxHubLayout;

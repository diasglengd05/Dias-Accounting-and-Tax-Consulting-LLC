import React, { useEffect, useMemo, useState } from "react";
import { ChevronRight, ExternalLink, Star } from "lucide-react";
import PageNavigation from "../components/PageNavigation";
import PageFooter from "../components/PageFooter";
import ReviewCard from "../components/editorial/ReviewCard";
import SectionCTA from "../components/editorial/SectionCTA";
import {
  GOOGLE_BUSINESS_URL,
  GOOGLE_RATING_STATS,
  testimonialsData,
} from "../data/staticData";
import {
  applyPageSEO,
  buildBreadcrumbSchema,
  removeJsonLd,
  upsertJsonLd,
} from "../lib/seo";
import { ClutchRatingWidget } from "../components/ClutchBadges";
import OfficialRecognitionSection from "../components/OfficialRecognitionSection";

interface TestimonialsPageProps {
  onNavigate: (path: string) => void;
  onOpenAudit?: () => void;
  onOpenPrivacy?: () => void;
  onOpenGooglePreferred?: () => void;
}

const REVIEW_FILTERS = [
  { id: "all", label: "All" },
  { id: "corporate-tax", label: "Corporate Tax" },
  { id: "vat", label: "VAT" },
  { id: "accounting", label: "Accounting & Advisory" },
];

export const TestimonialsPage: React.FC<TestimonialsPageProps> = ({
  onNavigate,
  onOpenAudit,
  onOpenPrivacy,
  onOpenGooglePreferred,
}) => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    applyPageSEO({
      title: "Client Reviews & 5.0★ Google Rating | Dias Accounting",
      description:
        "Read verified 5.0★ Google Reviews from UAE Mainland LLCs and Free Zone businesses advised by Dias Accounting on Corporate Tax, VAT, and IFRS bookkeeping.",
      canonicalPath: "/testimonials",
      keywords:
        "dias accounting reviews, google reviews tax consultant dubai, fta tax agent testimonials uae",
    });
    upsertJsonLd(
      "page-breadcrumb-jsonld",
      buildBreadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Client Reviews", path: "/testimonials" },
      ])
    );
    window.scrollTo({ top: 0, behavior: "instant" });
    return () => {
      removeJsonLd("page-breadcrumb-jsonld");
    };
  }, []);

  const filteredTestimonials = useMemo(() => {
    if (selectedCategory === "all") return testimonialsData;

    return testimonialsData.filter((item) => {
      const tag = (item.serviceTag || "").toLowerCase();
      const quote = (item.quote || "").toLowerCase();

      if (selectedCategory === "corporate-tax") {
        return tag.includes("corporate") || quote.includes("corporate tax");
      }
      if (selectedCategory === "vat") {
        return tag.includes("vat") || quote.includes("vat");
      }
      if (selectedCategory === "accounting") {
        return (
          tag.includes("bookkeeping") ||
          tag.includes("backlog") ||
          tag.includes("cfo") ||
          tag.includes("incorporation")
        );
      }
      return true;
    });
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-[#FFFFFF] font-sans text-[#0D1B2A] antialiased">
      <PageNavigation
        currentPath="/testimonials"
        onNavigate={onNavigate}
        onOpenAudit={onOpenAudit}
      />

      <main id="main-content">
        {/* 1. Trust Summary Header */}
        <section className="bg-[#FFFFFF] border-b border-[#E2E8F0] pt-12 pb-16 lg:pt-20 lg:pb-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav
              aria-label="Breadcrumb"
              className="flex items-center justify-center gap-1.5 text-xs sm:text-sm text-[#475569] mb-8"
            >
              <button
                type="button"
                onClick={() => onNavigate("/")}
                className="hover:text-[#0D1B2A] transition-colors cursor-pointer"
              >
                Home
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[#0D1B2A] font-medium">Client Reviews</span>
            </nav>

            <div className="text-center max-w-2xl mx-auto space-y-5">
              {/* Large Tabular-Nums 5.0 Rating + Live Clutch Rating Widget */}
              <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-7">
                <div className="inline-flex flex-col items-center gap-2">
                  <div className="flex items-baseline gap-3">
                    <span className="font-display text-5xl sm:text-6xl font-extrabold text-[#0D1B2A] tracking-tight tabular-nums leading-none">
                      {GOOGLE_RATING_STATS.rating.toFixed(1)}
                    </span>
                    <div
                      className="flex items-center gap-1 pb-1"
                      aria-label="5 out of 5 stars on Google"
                    >
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star
                          key={idx}
                          className="w-5 h-5 fill-[#C5A059] text-[#C5A059]"
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#475569] tabular-nums">
                    Verified Google Reviews · {GOOGLE_RATING_STATS.reviewCount} Reviews
                  </p>
                </div>

                <div
                  aria-hidden="true"
                  className="hidden sm:block h-14 w-px bg-[#E2E8F0]"
                />

                <div className="inline-flex flex-col items-center gap-1.5">
                  <ClutchRatingWidget />
                  <p className="text-xs font-medium text-[#475569]">
                    Verified UAE Accounting &amp; Corporate Tax Partner on Clutch
                  </p>
                </div>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl lg:text-[2.6rem] font-extrabold text-[#0D1B2A] tracking-tight leading-[1.15]">
                Trusted by UAE Founders &amp; Finance Teams
              </h1>

              <p className="text-base sm:text-lg text-[#475569] leading-[1.65] max-w-[58ch] mx-auto">
                Verified feedback from Mainland LLCs and Free Zone enterprises across Dubai and Sharjah partnering with Dias Accounting for Corporate Tax, VAT, and IFRS bookkeeping.
              </p>

              <div className="pt-1 flex items-center justify-center">
                <a
                  href={GOOGLE_BUSINESS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] inline-flex items-center gap-1.5 text-sm font-semibold text-[#1B4332] hover:text-[#0D1B2A] transition-colors"
                >
                  <span>Verify or leave a review on Google</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Single-Row Service Category Filter Pills */}
            <div
              role="tablist"
              aria-label="Filter reviews by service"
              className="mt-10 flex flex-wrap items-center justify-center gap-2"
            >
              {REVIEW_FILTERS.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`min-h-[42px] px-4 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                      isActive
                        ? "bg-[#1B4332] text-white"
                        : "bg-[#FFFFFF] text-[#475569] border border-[#E2E8F0] hover:border-slate-300 hover:text-[#0D1B2A]"
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* 2. Editorial Review Grid */}
        <section className="bg-[#F8FAFC] py-16 lg:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredTestimonials.map((item) => (
                <ReviewCard
                  key={item.id}
                  quote={item.quote}
                  authorName={item.authorName}
                  authorRole={item.authorRole}
                  authorCompany={item.authorCompany}
                  location={item.location}
                  serviceTag={item.serviceTag}
                  rating={item.rating}
                  relativeTime={item.relativeTime}
                />
              ))}
            </div>
          </div>
        </section>

        {/* 3. Official 2026 Recognition (Clutch UAE Awards) */}
        <OfficialRecognitionSection id="testimonials-official-2026-recognition" />

        {/* 4. Understated Closing CTA Strip */}
        <SectionCTA
          variant="strip"
          title="Ready for stress-free UAE compliance?"
          description="Schedule a confidential 15-minute consultation with an FTA-Registered Tax Agent to review your accounting, VAT, or Corporate Tax requirements."
          ctaLabel="Book Free Consultation"
          onCtaClick={() => onNavigate("/contact")}
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

export default TestimonialsPage;

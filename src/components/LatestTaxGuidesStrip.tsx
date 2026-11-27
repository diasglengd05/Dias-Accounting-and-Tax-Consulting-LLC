import React from "react";
import { ArrowRight, BookOpen } from "lucide-react";

interface LatestTaxGuidesStripProps {
  onNavigate: (path: string) => void;
}

interface FeaturedGuide {
  title: string;
  category: string;
  readTime: string;
  summary: string;
  path: string;
}

const FEATURED_GUIDES: FeaturedGuide[] = [
  {
    title: "2026 UAE Corporate Tax Filing Deadlines Checklist",
    category: "Corporate Tax",
    readTime: "7 min read",
    summary:
      "Master the 9% Corporate Tax threshold (AED 375,000), 0% Small Business Relief eligibility up to AED 3M, and EmaraTax filing deadlines to avoid AED 10,000 penalties.",
    path: "/blog/uae-corporate-tax-deadlines-nov-30-dec-31-2026-filing-checklist",
  },
  {
    title: "Statutory Dividends Audit in Dubai, DIFC & UAE",
    category: "DIFC & Free Zone",
    readTime: "7 min read",
    summary:
      "Executive guide to statutory interim and final dividend distribution audits, 0% Qualifying Free Zone Person (QFZP) de minimis rules, and IFRS financial reporting.",
    path: "/blog/statutory-dividends-audit-dubai-difc-uae-2026-guide",
  },
  {
    title: "2026 UAE VAT Compliance & Form 201 Audit Defense",
    category: "VAT Compliance",
    readTime: "6 min read",
    summary:
      "Complete 2026 roadmap to UAE 5% VAT Form 201 reconciliation, FTA input VAT recovery rules, and audit-ready monthly IFRS bookkeeping.",
    path: "/blog/uae-vat-compliance-fta-audit-defense-form-201-reconciliation-2026",
  },
];

export const LatestTaxGuidesStrip: React.FC<LatestTaxGuidesStripProps> = ({
  onNavigate,
}) => {
  const handleInternalClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    onNavigate(path);
  };

  return (
    <section
      aria-labelledby="latest-guides-heading"
      className="bg-[#F8FAFC] text-[#0D1B2A] py-16 sm:py-20 border-t border-[#E2E8F0]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl space-y-2.5">
            <div className="flex items-center gap-2.5 text-xs font-mono font-bold uppercase tracking-[0.18em] text-[#856422]">
              <BookOpen className="w-4 h-4 shrink-0" />
              <span>DiasUAE Tax &amp; IFRS Knowledge Hub</span>
            </div>
            <h2
              id="latest-guides-heading"
              className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0D1B2A] tracking-tight text-balance"
            >
              Latest UAE Tax &amp; Compliance Guides
            </h2>
            <p className="text-[#475569] text-sm sm:text-base leading-relaxed">
              Practical FTA regulatory playbooks authored by FTA-Registered Tax Agents for Dubai Mainland, DIFC, DTEC, and SHAMS Free Zone founders.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="/blog"
              onClick={(e) => handleInternalClick(e, "/blog")}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#1B4332] hover:bg-[#143326] text-white font-display font-bold text-xs sm:text-sm tracking-wide shadow-xs transition-colors whitespace-nowrap cursor-pointer"
            >
              <span>View All Blog Articles</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </a>
          </div>
        </div>

        {/* 3-Card Featured Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURED_GUIDES.map((guide, index) => (
            <a
              key={guide.path}
              href={guide.path}
              onClick={(e) => handleInternalClick(e, guide.path)}
              className="group bg-white border border-[#E2E8F0] hover:border-[#1B4332]/40 rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 hover:shadow-md no-underline"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-[#64748B]">
                  <span className="font-mono font-semibold text-[#856422]">
                    0{index + 1}. {guide.category}
                  </span>
                  <span>{guide.readTime}</span>
                </div>

                <h3 className="font-display text-lg sm:text-xl font-bold text-[#0D1B2A] group-hover:text-[#1B4332] transition-colors leading-snug">
                  {guide.title}
                </h3>

                <p className="text-[#475569] text-xs sm:text-sm leading-relaxed">
                  {guide.summary}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex items-center justify-between text-xs font-display font-bold text-[#1B4332]">
                <span>Read Full Guide</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestTaxGuidesStrip;

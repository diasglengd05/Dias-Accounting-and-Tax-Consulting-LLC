import React from "react";
import { ArrowRight, BookOpen, ExternalLink } from "lucide-react";

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
    title: "2026 UAE Corporate Tax Guide",
    category: "Corporate Tax",
    readTime: "8 min read",
    summary:
      "Master the 9% Corporate Tax threshold (AED 375,000), 0% Small Business Relief eligibility up to AED 3M, and EmaraTax filing deadlines to avoid AED 10,000 penalties.",
    path: "/blog/uae-corporate-tax-2026-sbr-relief-penalty-shield-guide",
  },
  {
    title: "DIFC & DTEC Dividend Audits & 0% QFZP",
    category: "DIFC & Free Zone",
    readTime: "7 min read",
    summary:
      "Executive guide to statutory interim and final dividend distribution audits, 0% Qualifying Free Zone Person (QFZP) de minimis rules, and IFRS financial reporting.",
    path: "/blog/accounting-services-dtec-difc-dividends-audit-dubai-guide",
  },
  {
    title: "SHAMS Free Zone Setup & Tax Checklist",
    category: "Company Setup",
    readTime: "6 min read",
    summary:
      "Complete 2026 roadmap to Sharjah Media City (SHAMS) trade licensing, Day-1 EmaraTax Corporate Tax & 5% VAT registration, and fixed-fee monthly IFRS bookkeeping.",
    path: "/blog/opening-company-shams-free-zone-sharjah-setup-tax-guide-2026",
  },
];

export const LatestTaxGuidesStrip: React.FC<LatestTaxGuidesStripProps> = ({ onNavigate }) => {
  const handleInternalClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    onNavigate(path);
  };

  return (
    <section
      aria-labelledby="latest-guides-heading"
      className="bg-[#070d19] text-white py-16 sm:py-20 border-t border-[#c5a059]/25"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl space-y-2.5">
            <div className="flex items-center gap-2.5 text-xs font-mono font-bold uppercase tracking-[0.18em] text-[#c5a059]">
              <BookOpen className="w-4 h-4 shrink-0" />
              <span>Dias Tax &amp; IFRS Knowledge Hub</span>
            </div>
            <h2
              id="latest-guides-heading"
              className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight text-balance"
            >
              Latest UAE Tax &amp; Compliance Guides
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Practical FTA regulatory playbooks authored by FTA-Registered Tax Agents for Dubai Mainland, DIFC, DTEC, and SHAMS Free Zone founders.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="/blog"
              onClick={(e) => handleInternalClick(e, "/blog")}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#c5a059] hover:bg-[#dec18c] text-[#070d19] font-display font-extrabold text-xs sm:text-sm tracking-wide shadow-lg shadow-[#c5a059]/20 transition-all whitespace-nowrap cursor-pointer active:scale-95"
            >
              <span>View All Blog Articles</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </a>
            <a
              href="https://insights.diasuae.ae/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-3.5 rounded-xl border border-[#c5a059]/40 bg-[#0d1b2a] hover:border-[#c5a059] text-slate-200 hover:text-[#dec18c] font-display font-semibold text-xs sm:text-sm transition-colors whitespace-nowrap"
            >
              <span>UAE Tax Insights</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#c5a059] shrink-0" />
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
              className="group bg-[#0d1b2a] border border-[#c5a059]/25 hover:border-[#c5a059] rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 no-underline"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono font-semibold text-[#c5a059]">
                    0{index + 1}. {guide.category}
                  </span>
                  <span>{guide.readTime}</span>
                </div>

                <h3 className="font-display text-lg sm:text-xl font-bold text-white group-hover:text-[#dec18c] transition-colors leading-snug">
                  {guide.title}
                </h3>

                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  {guide.summary}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-display font-bold text-[#c5a059] group-hover:text-[#dec18c]">
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

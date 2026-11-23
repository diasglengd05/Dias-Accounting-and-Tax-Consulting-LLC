import React from "react";
import { ArrowRight, Calculator, Check, ChevronRight, Share2 } from "lucide-react";
import { BlogPost } from "../../types";
import { RelatedResources } from "./RelatedResources";
import { getRelatedResourcesForPath } from "../../lib/internalLinks";

export interface ArticleLayoutProps {
  articlePath?: string;
  category: string;
  title: string;
  summary?: string;
  authorName: string;
  authorRole: string;
  date: string;
  readTime: string;
  copiedLink: boolean;
  onCopyShareLink: () => void;
  onNavigate: (path: string) => void;
  children: React.ReactNode;
  keywords?: string[];
  relatedPosts: BlogPost[];
}

export const ArticleLayout: React.FC<ArticleLayoutProps> = ({
  articlePath = "/blog",
  category,
  title,
  summary,
  authorName,
  authorRole,
  date,
  readTime,
  copiedLink,
  onCopyShareLink,
  onNavigate,
  children,
  keywords,
  relatedPosts,
}) => {
  const authorInitials = authorName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      {/* Centered Editorial Header */}
      <header className="bg-[#FFFFFF] border-b border-[#E2E8F0] pt-10 pb-12 lg:pt-16 lg:pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center justify-center gap-1.5 text-xs sm:text-sm text-[#475569] mb-6"
          >
            <button
              type="button"
              onClick={() => onNavigate("/")}
              className="hover:text-[#0D1B2A] transition-colors cursor-pointer"
            >
              Home
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <button
              type="button"
              onClick={() => onNavigate("/blog")}
              className="hover:text-[#0D1B2A] transition-colors cursor-pointer"
            >
              Insights
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-[#0D1B2A] font-medium truncate max-w-[220px] sm:max-w-xs">
              {category}
            </span>
          </nav>

          <div className="text-center max-w-[68ch] mx-auto space-y-4">
            <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#856422]">
              {category}
            </span>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-[2.6rem] font-extrabold text-[#0D1B2A] tracking-tight leading-[1.15] text-balance">
              {title}
            </h1>
            {summary && (
              <p className="text-base sm:text-lg text-[#475569] leading-[1.65]">
                {summary}
              </p>
            )}

            <div className="pt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs sm:text-sm text-[#475569]">
              <span className="font-semibold text-[#0D1B2A]">{authorName}</span>
              <span className="text-slate-300" aria-hidden="true">·</span>
              <time className="tabular-nums">{date}</time>
              <span className="text-slate-300" aria-hidden="true">·</span>
              <span className="tabular-nums">{readTime}</span>
              <span className="text-slate-300 hidden sm:inline" aria-hidden="true">·</span>
              <button
                type="button"
                onClick={onCopyShareLink}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#475569] hover:text-[#1B4332] transition-colors cursor-pointer min-h-[36px] px-2"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#1B4332]" />
                    <span className="text-[#1B4332] font-semibold">Link copied</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Copy link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Single Focused Reading Column (max-w-68ch) */}
      <section className="bg-[#FFFFFF] py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <article className="max-w-[68ch] mx-auto space-y-8">
            {children}

            {/* Direct Commercial Service Internal Links (Prevents Blog-vs-Service Cannibalization) */}
            <aside
              aria-label="Core UAE Tax and Accounting Services"
              className="rounded-2xl bg-[#070d19] text-white border border-[#c5a059]/35 p-6 sm:p-7 space-y-4"
            >
              <div className="space-y-1">
                <span className="inline-block text-[11px] font-semibold uppercase tracking-wider text-[#c5a059]">
                  FTA-Registered Tax Agency · Direct Services
                </span>
                <h2 className="font-display text-lg sm:text-xl font-bold text-white tracking-tight">
                  Ready for UAE Compliance? Explore Our Core Advisory Pages
                </h2>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                Move from regulatory guidance to turnkey execution with FTA-Registered Tax Agent Glen Dias across Dubai Mainland, DIFC, DTEC, and SHAMS:
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <li>
                  <a
                    href="/tax-planning-difc"
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate("/tax-planning-difc");
                    }}
                    className="flex items-center justify-between gap-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-[#c5a059]/60 px-4 py-3 text-sm font-semibold text-[#c5a059] transition-colors no-underline"
                  >
                    <span>DIFC tax compliance services</span>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </a>
                </li>
                <li>
                  <a
                    href="/dividends-audit"
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate("/dividends-audit");
                    }}
                    className="flex items-center justify-between gap-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-[#c5a059]/60 px-4 py-3 text-sm font-semibold text-[#c5a059] transition-colors no-underline"
                  >
                    <span>statutory dividends audit in Dubai</span>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </a>
                </li>
                <li>
                  <a
                    href="/pricing"
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate("/pricing");
                    }}
                    className="flex items-center justify-between gap-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-[#c5a059]/60 px-4 py-3 text-sm font-semibold text-[#c5a059] transition-colors no-underline"
                  >
                    <span>fixed-fee accounting packages in Dubai</span>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </a>
                </li>
                <li>
                  <a
                    href="/uae-tax-planner"
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate("/uae-tax-planner");
                    }}
                    className="flex items-center justify-between gap-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-[#c5a059]/60 px-4 py-3 text-sm font-semibold text-[#c5a059] transition-colors no-underline"
                  >
                    <span>2026 UAE Corporate Tax &amp; 5% VAT Calculator</span>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </a>
                </li>
              </ul>
            </aside>

            {/* Regulatory Notice */}
            <aside className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] border-l-[3px] border-l-[#C5A059] p-5 sm:p-6">
              <p className="font-display text-sm font-bold text-[#0D1B2A] mb-1">
                UAE Regulatory Notice
              </p>
              <p className="text-sm text-[#475569] leading-[1.65]">
                This briefing provides general UAE Federal Tax Authority (FTA) and IFRS guidance current at publication and does not replace entity-specific tax advice. Consult an FTA-Registered Tax Agent before filing statutory elections or corporate restructurings.
              </p>
            </aside>

            {keywords && keywords.length > 0 && (
              <div className="pt-4 border-t border-[#E2E8F0] text-xs text-[#64748B] leading-relaxed">
                <span className="font-semibold text-[#0D1B2A] mr-2">Topics covered:</span>
                {keywords.map((kw) => kw.replace(/^[#*]+/, "")).join(" · ")}
              </div>
            )}

            {/* Clean Author Bio Strip */}
            <div className="pt-8 border-t border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#0D1B2A] text-white font-display font-bold text-sm flex items-center justify-center shrink-0">
                {authorInitials}
              </div>
              <div className="space-y-1">
                <p className="font-display text-sm sm:text-base font-bold text-[#0D1B2A]">
                  {authorName}
                </p>
                <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                  {authorRole} at Dias Accounting &amp; Tax Consulting LLC (SHAMS &amp; Dubai). Advising UAE Mainland and Free Zone entities on Corporate Tax, VAT, and IFRS compliance.
                </p>
              </div>
            </div>

            {/* Single Quiet Inline CTA Card */}
            <div className="rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] flex items-center justify-center text-[#1B4332] shrink-0">
                  <Calculator className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <p className="font-display font-bold text-base text-[#0D1B2A]">
                    Estimate your 2026 UAE tax position
                  </p>
                  <p className="text-sm text-[#475569] leading-[1.6] max-w-[46ch]">
                    Check 0% Small Business Relief eligibility, 9% Corporate Tax liability, or speak directly with an FTA-Registered Tax Agent.
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => onNavigate("/uae-tax-planner")}
                  className="min-h-[46px] px-5 py-2.5 rounded-xl bg-[#1B4332] hover:bg-[#143326] text-white text-sm font-semibold transition-colors cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <span>2026 Tax Calculator</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate("/contact")}
                  className="min-h-[40px] px-3 text-xs sm:text-sm font-semibold text-[#0D1B2A] hover:text-[#1B4332] transition-colors cursor-pointer whitespace-nowrap"
                >
                  Book Free Consultation
                </button>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* Strategic UAE Tax & Compliance Internal Links (Max 3 Cards) */}
      <RelatedResources
        eyebrow="UAE Tax Services & Tools"
        heading="Put This Guidance Into Action"
        items={getRelatedResourcesForPath(articlePath, `${category} ${title}`)}
        onNavigate={onNavigate}
        background="neutral"
      />

      {/* Related Insights 3-Card Strip */}
      {relatedPosts.length > 0 && (
        <section className="bg-[#FFFFFF] border-t border-[#E2E8F0] py-16 lg:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div className="space-y-1.5">
                <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#856422]">
                  Continue Reading
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0D1B2A] tracking-tight">
                  Related Insights
                </h2>
              </div>
              <a
                href="/blog"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate("/blog");
                }}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1B4332] hover:text-[#0D1B2A] transition-colors cursor-pointer min-h-[44px] no-underline"
              >
                <span>All UAE tax insights</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((related) => (
                <a
                  key={related.id}
                  href={`/blog/${related.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(`/blog/${related.id}`);
                  }}
                  className="rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] hover:border-slate-300 p-6 sm:p-7 shadow-[0_6px_24px_-16px_rgba(13,27,42,0.06)] hover:shadow-[0_12px_32px_-16px_rgba(13,27,42,0.12)] transition-all flex flex-col justify-between group no-underline"
                >
                  <div className="space-y-3">
                    <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#856422]">
                      {related.tag}
                    </span>
                    <h3 className="font-display font-bold text-base sm:text-lg text-[#0D1B2A] group-hover:text-[#1B4332] transition-colors line-clamp-2 leading-snug">
                      {related.title}
                    </h3>
                    <p className="text-sm text-[#475569] line-clamp-2 leading-[1.6]">
                      {related.summary}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#64748B] tabular-nums">
                    <span>{related.readTime}</span>
                    <span className="font-semibold text-[#1B4332] inline-flex items-center gap-1">
                      Read full briefing
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default ArticleLayout;

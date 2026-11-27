import React, { useEffect, useMemo, useState } from "react";
import { ArrowRight, ChevronRight, FileText, Search } from "lucide-react";
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
  BloggerPost,
  getInitialBloggerPosts,
  mergeWithFallbackPosts,
  syncUnifiedBloggerPosts,
} from "../utils/bloggerFeed";

interface BlogsPageProps {
  initialPosts?: BloggerPost[];
  onNavigate: (path: string) => void;
  onOpenAudit?: () => void;
  onOpenPrivacy?: () => void;
  onOpenGooglePreferred?: () => void;
}

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "corporate-tax", label: "Corporate Tax" },
  { id: "vat", label: "VAT & E-Invoicing" },
  { id: "free-zone", label: "Free Zone & DIFC" },
  { id: "bookkeeping", label: "Bookkeeping & IFRS" },
];

export const BlogsPage: React.FC<BlogsPageProps> = ({
  initialPosts,
  onNavigate,
  onOpenAudit,
  onOpenPrivacy,
  onOpenGooglePreferred,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [posts, setPosts] = useState<BloggerPost[]>(() =>
    initialPosts && initialPosts.length > 0
      ? mergeWithFallbackPosts(initialPosts)
      : getInitialBloggerPosts()
  );
  const [isSyncing, setIsSyncing] = useState<boolean>(
    () => (initialPosts?.length ?? getInitialBloggerPosts().length) <= 1
  );

  useEffect(() => {
    const pageTitle = "UAE Corporate Tax, VAT & IFRS Insights | DiasUAE";
    const pageDesc =
      "Latest 2026 UAE Federal Tax Authority (FTA) briefings, 9% Corporate Tax guides, 5% VAT checklists, and IFRS accounting insights by DiasUAE.";

    applyPageSEO({
      title: pageTitle,
      description: pageDesc,
      canonicalPath: "/blog",
      keywords:
        "UAE Corporate Tax Insights 2026, FTA Updates 2026, 9% Corporate Tax Guides, 5% VAT Audit Checklists, IFRS Accounting Insights Dubai",
    });

    upsertJsonLd("page-collection-jsonld", {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": "https://diasuae.ae/blog#collection",
      url: "https://diasuae.ae/blog",
      name: pageTitle,
      description: pageDesc,
      isPartOf: { "@id": "https://diasuae.ae/#website" },
      publisher: { "@id": "https://diasuae.ae/#organization" },
    });

    upsertJsonLd(
      "page-breadcrumb-jsonld",
      buildBreadcrumbSchema(
        [
          { name: "Home", path: "/" },
          { name: "Insights", path: "/blog" },
        ],
        "https://diasuae.ae/blog#breadcrumb"
      )
    );

    window.scrollTo({ top: 0, behavior: "instant" });

    let active = true;
    syncUnifiedBloggerPosts({
      maxResults: 50,
      onSnapshot: (snapshotPosts) => {
        if (!active || snapshotPosts.length === 0) return;
        setPosts(snapshotPosts);
        setIsSyncing(false);
      },
    })
      .then((livePosts) => {
        if (!active) return;
        if (livePosts.length > 0) {
          setPosts(livePosts);
        }
      })
      .finally(() => {
        if (active) setIsSyncing(false);
      });

    return () => {
      active = false;
      removeJsonLd("schema-blogs-hub");
    };
  }, []);

  const filteredPosts = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return posts.filter((post) => {
      if (post.slug.startsWith("draft-")) return false;

      const titleLower = post.title.toLowerCase();
      const summaryLower = post.summary.toLowerCase();
      const tagLower = (post.primaryCategory || "").toLowerCase();
      const catList = (post.categories || []).map((c) => c.toLowerCase());

      const matchesSearch =
        !query ||
        titleLower.includes(query) ||
        summaryLower.includes(query) ||
        tagLower.includes(query) ||
        catList.some((c) => c.includes(query));

      if (!matchesSearch) return false;
      if (selectedCategory === "all") return true;

      if (selectedCategory === "corporate-tax") {
        return (
          tagLower.includes("corporate tax") ||
          tagLower.includes("9%") ||
          catList.some((c) => c.includes("corporate tax") || c.includes("tax")) ||
          titleLower.includes("corporate tax") ||
          titleLower.includes("sbr") ||
          titleLower.includes("small business relief") ||
          summaryLower.includes("corporate tax")
        );
      }

      if (selectedCategory === "vat") {
        return (
          tagLower.includes("vat") ||
          tagLower.includes("e-invoicing") ||
          catList.some((c) => c.includes("vat") || c.includes("e-invoic")) ||
          titleLower.includes("vat") ||
          titleLower.includes("e-invoicing") ||
          summaryLower.includes("vat")
        );
      }

      if (selectedCategory === "free-zone") {
        return (
          tagLower.includes("free zone") ||
          tagLower.includes("company setup") ||
          tagLower.includes("formation") ||
          tagLower.includes("difc") ||
          tagLower.includes("dtec") ||
          tagLower.includes("audit") ||
          catList.some(
            (c) =>
              c.includes("company setup") ||
              c.includes("free zone") ||
              c.includes("difc") ||
              c.includes("dtec") ||
              c.includes("shams") ||
              c.includes("qfzp") ||
              c.includes("dividend") ||
              c.includes("audit")
          ) ||
          titleLower.includes("free zone") ||
          titleLower.includes("difc") ||
          titleLower.includes("dtec") ||
          titleLower.includes("qfzp") ||
          titleLower.includes("dividend")
        );
      }

      if (selectedCategory === "bookkeeping") {
        return (
          tagLower.includes("bookkeeping") ||
          tagLower.includes("accounting") ||
          tagLower.includes("ifrs") ||
          catList.some(
            (c) =>
              c.includes("accounting") ||
              c.includes("bookkeeping") ||
              c.includes("ifrs")
          ) ||
          titleLower.includes("bookkeeping") ||
          titleLower.includes("accounting") ||
          titleLower.includes("ifrs") ||
          titleLower.includes("spreadsheets")
        );
      }

      return true;
    });
  }, [posts, searchQuery, selectedCategory]);

  const featuredPost = filteredPosts[0] || null;
  const gridPosts = featuredPost ? filteredPosts.slice(1) : [];

  const handleOpenPost = (slug: string) => {
    onNavigate(`/blog/${slug}`);
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] font-sans text-[#0D1B2A] antialiased">
      <PageNavigation
        currentPath="/blog"
        onNavigate={onNavigate}
        onOpenAudit={onOpenAudit}
      />

      <PageMainTransition id="main-content">
        {/* 1. Clean Light-Theme Header + Search + Category Filter Pills */}
        <section className="bg-gradient-to-b from-[#FFFFFF] via-[#F8FAFC] to-[#FFFFFF] border-b border-[#E2E8F0] pt-12 pb-14 lg:pt-20 lg:pb-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav
              aria-label="Breadcrumb"
              className="flex items-center justify-center gap-1.5 text-xs sm:text-sm text-[#475569] mb-6"
            >
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate("/");
                }}
                className="hover:text-[#0D1B2A] transition-colors cursor-pointer"
              >
                Home
              </a>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[#0D1B2A] font-medium">Blog &amp; Insights</span>
            </nav>

            <div className="text-center max-w-3xl mx-auto space-y-4">
              <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#856422]">
                DIASUAE · UAE REGULATORY INSIGHTS &amp; BRIEFINGS
              </span>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0D1B2A] tracking-tight leading-[1.12]">
                UAE Corporate Tax, 5% VAT &amp; IFRS Accounting Insights
              </h1>
              <p className="text-base sm:text-lg text-[#475569] leading-[1.65] max-w-[60ch] mx-auto">
                Practical FTA regulatory briefings, Ministerial Decision analysis, and IFRS compliance guides authored by our Dubai and Sharjah FTA-Registered Tax Agents.
              </p>
            </div>

            {/* Search Bar */}
            <div className="mt-8 max-w-md mx-auto">
              <label htmlFor="insights-search" className="sr-only">
                Search UAE tax and accounting insights
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="insights-search"
                  type="search"
                  placeholder="Search articles (e.g., VAT, Corporate Tax, DIFC, Dividend)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full min-h-[46px] bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl pl-11 pr-4 py-2.5 text-sm text-[#0D1B2A] placeholder:text-slate-400 focus:bg-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332] transition-colors"
                />
              </div>
            </div>

            {/* Horizontal Category Filter Pills */}
            <div
              role="tablist"
              aria-label="Filter insights by category"
              className="mt-7 flex flex-wrap items-center justify-center gap-2"
            >
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`min-h-[44px] px-4 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap ${
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

        {/* 2. Unified Live-Synced Featured Article + 3-Column Editorial Grid */}
        <section className="bg-[#F8FAFC] border-b border-[#E2E8F0] py-16 lg:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            {isSyncing && filteredPosts.length <= 1 && (
              <div
                aria-label="Loading latest insights"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {[0, 1, 2].map((idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] p-7 space-y-4"
                  >
                    <div className="h-3 w-28 rounded bg-slate-200 animate-pulse" />
                    <div className="h-5 w-full rounded bg-slate-200 animate-pulse" />
                    <div className="h-5 w-3/4 rounded bg-slate-200 animate-pulse" />
                    <div className="space-y-2 pt-1">
                      <div className="h-3.5 w-full rounded bg-slate-200/80 animate-pulse" />
                      <div className="h-3.5 w-5/6 rounded bg-slate-200/80 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {featuredPost ? (
              <>
                {/* Featured Post Card (2-Column Split) */}
                <article
                  onClick={() => handleOpenPost(featuredPost.slug)}
                  className="rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#C5A059] shadow-[0_8px_28px_-16px_rgba(13,27,42,0.08)] hover:shadow-[0_14px_36px_-16px_rgba(13,27,42,0.12)] transition-all overflow-hidden grid grid-cols-1 lg:grid-cols-12 cursor-pointer group"
                >
                  {/* Left Light Editorial Panel or Featured Image */}
                  <div className="lg:col-span-5 bg-gradient-to-br from-[#F8FAFC] via-[#FFFFFF] to-[#F1F5F9] border-b lg:border-b-0 lg:border-r border-[#E2E8F0] min-h-[240px] lg:min-h-[320px] relative overflow-hidden flex flex-col justify-between p-8 text-[#0D1B2A]">
                    {featuredPost.featuredImage ? (
                      <img
                        src={featuredPost.featuredImage}
                        alt={featuredPost.title}
                        loading="eager"
                        referrerPolicy="no-referrer"
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                      />
                    ) : (
                      <>
                        <div className="h-[2px] w-12 bg-[#C5A059]" />
                        <div className="space-y-2 py-6">
                          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#856422] block">
                            Latest Briefing
                          </span>
                          <p className="font-display text-xl sm:text-2xl font-bold text-[#0D1B2A] leading-snug">
                            {featuredPost.primaryCategory}
                          </p>
                        </div>
                        <div className="flex items-center justify-between text-xs text-[#64748B] border-t border-[#E2E8F0] pt-4">
                          <span>DiasUAE Tax Desk</span>
                          <span className="tabular-nums">{featuredPost.readTime}</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Right Content Panel */}
                  <div className="lg:col-span-7 p-7 sm:p-10 flex flex-col justify-between space-y-6">
                    <div className="space-y-3.5">
                      <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#856422]">
                        {featuredPost.primaryCategory}
                      </span>
                      <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0D1B2A] group-hover:text-[#1B4332] transition-colors leading-snug tracking-tight">
                        <a
                          href={`/blog/${featuredPost.slug}`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleOpenPost(featuredPost.slug);
                          }}
                          className="focus:outline-none focus-visible:underline"
                        >
                          {featuredPost.title}
                        </a>
                      </h2>
                      <p className="text-sm sm:text-base text-[#475569] leading-[1.65] line-clamp-3 max-w-[60ch]">
                        {featuredPost.summary}
                      </p>
                    </div>

                    <div className="pt-5 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-3 text-xs sm:text-sm text-[#64748B] tabular-nums">
                        <time dateTime={featuredPost.publishedIso || undefined}>
                          {featuredPost.publishedDate}
                        </time>
                        <span aria-hidden="true">·</span>
                        <span>{featuredPost.readTime}</span>
                      </div>
                      <a
                        href={`/blog/${featuredPost.slug}`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleOpenPost(featuredPost.slug);
                        }}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1B4332] group-hover:text-[#0D1B2A] transition-colors"
                      >
                        <span>Read article</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </a>
                    </div>
                  </div>
                </article>

                {/* 3-Column Equal-Height Article Grid */}
                {gridPosts.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
                    {gridPosts.map((post) => (
                      <article
                        key={post.slug}
                        onClick={() => handleOpenPost(post.slug)}
                        className="h-full rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#C5A059] overflow-hidden shadow-[0_6px_24px_-16px_rgba(13,27,42,0.06)] hover:shadow-[0_12px_32px_-16px_rgba(13,27,42,0.12)] transition-all cursor-pointer flex flex-col justify-between group"
                      >
                        <div>
                          {post.featuredImage && (
                            <div className="h-44 w-full overflow-hidden border-b border-[#E2E8F0] bg-[#F8FAFC]">
                              <img
                                src={post.featuredImage}
                                alt={post.title}
                                loading="lazy"
                                decoding="async"
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                              />
                            </div>
                          )}

                          <div className="p-7 pb-0 space-y-3">
                            <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#856422]">
                              {post.primaryCategory}
                            </span>
                            <h3 className="font-display text-lg font-bold text-[#0D1B2A] group-hover:text-[#1B4332] transition-colors line-clamp-2 leading-snug">
                              <a
                                href={`/blog/${post.slug}`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleOpenPost(post.slug);
                                }}
                                className="focus:outline-none focus-visible:underline"
                              >
                                {post.title}
                              </a>
                            </h3>
                            <p className="text-sm text-[#475569] leading-[1.6] line-clamp-3">
                              {post.summary}
                            </p>
                          </div>
                        </div>

                        <div className="p-7 pt-5">
                          <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between gap-3 text-xs text-[#64748B] tabular-nums">
                            <div className="flex items-center gap-2 truncate">
                              <time
                                dateTime={post.publishedIso || undefined}
                                className="truncate"
                              >
                                {post.publishedDate}
                              </time>
                              <span aria-hidden="true">·</span>
                              <span className="shrink-0">{post.readTime}</span>
                            </div>
                            <a
                              href={`/blog/${post.slug}`}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleOpenPost(post.slug);
                              }}
                              className="inline-flex items-center gap-1 font-semibold text-[#1B4332] group-hover:text-[#0D1B2A] shrink-0"
                            >
                              <span>Read</span>
                              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                            </a>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] p-12 text-center space-y-3">
                <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                <h2 className="font-display text-lg font-bold text-[#0D1B2A]">
                  No insights match your search
                </h2>
                <p className="text-sm text-[#475569]">
                  Try another keyword or reset your category filter to view all UAE tax guides.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                  className="mt-2 min-h-[44px] px-5 py-2 rounded-xl bg-[#1B4332] hover:bg-[#143326] text-white text-sm font-semibold cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            )}

            {/* Discreet General Information Notice */}
            <p className="pt-4 border-t border-[#E2E8F0] text-xs text-[#64748B] leading-relaxed">
              <strong className="text-[#0D1B2A]">General Information Notice:</strong>{" "}
              Articles published on diasuae.ae provide general UAE regulatory information and do not constitute entity-specific legal or tax advice. Consult an FTA-Registered Tax Agent before making statutory filings.
            </p>
          </div>
        </section>

        {/* 3. Strategic Internal Links to Priority UAE Compliance & Audit Hubs */}
        <section className="bg-[#FFFFFF] border-b border-[#E2E8F0] py-14 text-[#0D1B2A]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <span className="inline-block text-xs font-semibold uppercase tracking-[0.14em] text-[#856422] mb-1.5">
                  FTA-Registered Execution Desks
                </span>
                <h2 className="font-display text-2xl font-bold text-[#0D1B2A] tracking-tight">
                  Explore Our Core 2026 UAE Tax &amp; Statutory Audit Services
                </h2>
              </div>
              <a
                href="/pricing"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate("/pricing");
                }}
                className="text-sm font-semibold text-[#1B4332] hover:text-[#143326] transition-colors inline-flex items-center gap-1"
              >
                <span>Compare fixed-fee retainers from AED 400/mo</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  eyebrow: "5% VAT · Form 201",
                  title: "UAE VAT Compliance & FTA Audit Support",
                  desc: "AED 375k TRN registration, quarterly Form 201 returns, 2026 FTA Decision 13 input tax recovery, and VAT-to-Corporate-Tax reconciliation from AED 400/mo.",
                  href: "/services/vat-compliance",
                  cta: "View 2026 VAT Checklist",
                },
                {
                  eyebrow: "4–5 Day Turnaround",
                  title: "Statutory Dividends Audit Dubai & UAE",
                  desc: "Interim and final statutory dividend audits, 10% legal reserve verification, IFRS solvency sign-off, and UAE bank remittance clearance.",
                  href: "/dividends-audit",
                  cta: "Explore Dividends Audit",
                },
                {
                  eyebrow: "0% QFZP · IFRS",
                  title: "DIFC & DTEC Virtual Bookkeeping & Tax",
                  desc: "Fixed-fee virtual IFRS bookkeeping, 0% Qualifying Free Zone Person compliance, and audit readiness for DIFC & DTEC entities.",
                  href: "/tax-planning-difc",
                  cta: "View DIFC & DTEC Hub",
                },
              ].map((hub) => (
                <a
                  key={hub.href}
                  href={hub.href}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(hub.href);
                  }}
                  className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#1B4332]/50 p-6 flex flex-col justify-between gap-4 transition-all shadow-xs hover:shadow-sm group"
                >
                  <div className="space-y-2">
                    <span className="inline-block text-[11px] font-semibold uppercase tracking-widest text-[#856422]">
                      {hub.eyebrow}
                    </span>
                    <h3 className="font-display text-lg font-bold text-[#0D1B2A] group-hover:text-[#1B4332] transition-colors">
                      {hub.title}
                    </h3>
                    <p className="text-sm text-[#475569] leading-relaxed">
                      {hub.desc}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1B4332] group-hover:translate-x-0.5 transition-transform">
                    <span>{hub.cta}</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Single Closing Executive CTA */}
        <SectionCTA
          variant="navy"
          eyebrow="2026 UAE Tax Readiness"
          title="Need clarity on how these rules apply to your company?"
          description="Model your 2026 Corporate Tax and Small Business Relief position in 60 seconds, or book a confidential review with our FTA-Registered Tax Agents."
          ctaLabel="Open 2026 Tax Calculator"
          onCtaClick={() => onNavigate("/uae-tax-planner")}
          secondaryLabel="Book Free Consultation →"
          onSecondaryClick={() => onNavigate("/contact")}
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

export default BlogsPage;

import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calculator,
  Calendar,
  ChevronRight,
  Clock,
  ExternalLink,
  FileText,
  Globe,
  MessageCircle,
  PhoneCall,
  Share2,
  Check,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import PageNavigation from "../components/PageNavigation";
import PageFooter from "../components/PageFooter";
import TaxToolsPromoBanner from "../components/TaxToolsPromoBanner";
import ArticleContentRenderer from "../components/ArticleContentRenderer";
import BlogInstantAdvisorStrip from "../components/BlogInstantAdvisorStrip";
import { blogsData } from "../data/blogsData";
import { draftPlaceholderPosts } from "../data/blogDrafts";
import { BlogPost } from "../types";
import { applyPageSEO, removeJsonLd, upsertJsonLd } from "../lib/seo";

interface BlogDetailPageProps {
  blogSlug: string;
  allBlogs?: BlogPost[];
  onNavigate: (path: string) => void;
  onOpenAudit?: () => void;
  onOpenPrivacy?: () => void;
  onOpenGooglePreferred?: () => void;
}

function toIsoDate(dateStr?: string): string {
  if (!dateStr) return new Date().toISOString().split("T")[0];
  const parsed = Date.parse(dateStr);
  if (isNaN(parsed)) return new Date().toISOString().split("T")[0];
  return new Date(parsed).toISOString();
}

function findBlogBySlug(slug: string, pool: BlogPost[]): BlogPost | null {
  const normalized = slug.replace(/\.(html|php|aspx)$/i, "").replace(/\/+$/, "").trim().toLowerCase();
  if (!normalized) return null;
  return (
    pool.find((b) => b.id.toLowerCase() === normalized) ||
    pool.find((b) => b.id.toLowerCase().startsWith(normalized) || normalized.startsWith(b.id.toLowerCase())) ||
    null
  );
}

export const BlogDetailPage: React.FC<BlogDetailPageProps> = ({
  blogSlug,
  allBlogs = [],
  onNavigate,
  onOpenAudit,
  onOpenPrivacy,
  onOpenGooglePreferred,
}) => {
  const [fetchedBlog, setFetchedBlog] = useState<BlogPost | null>(null);
  const [loadingRemote, setLoadingRemote] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const combinedPool = useMemo(() => {
    const seen = new Set<string>();
    const list: BlogPost[] = [];
    for (const item of [...allBlogs, ...blogsData, ...draftPlaceholderPosts]) {
      if (!item?.id || seen.has(item.id)) continue;
      seen.add(item.id);
      list.push(item);
    }
    return list;
  }, [allBlogs]);

  const localPost = useMemo(() => findBlogBySlug(blogSlug, combinedPool), [blogSlug, combinedPool]);
  const post = localPost || fetchedBlog;

  // Fallback fetch from /api/blogs if a newly generated dynamic article isn't in static data yet
  useEffect(() => {
    setFetchedBlog(null);
    if (localPost) {
      setLoadingRemote(false);
      return;
    }

    let active = true;
    setLoadingRemote(true);
    fetch("/api/blogs")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active) return;
        if (data?.success && Array.isArray(data.blogs)) {
          const match = findBlogBySlug(blogSlug, data.blogs);
          if (match) setFetchedBlog(match);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoadingRemote(false);
      });

    return () => {
      active = false;
    };
  }, [blogSlug, localPost]);

  // Synchronize page-level SEO, canonical URL, Open Graph, and BlogPosting JSON-LD
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });

    if (!post) {
      applyPageSEO({
        title: "Article Not Found | UAE Tax & Accounting Insights | Dias Accounting",
        description:
          "Browse authoritative UAE Corporate Tax, 5% VAT, DIFC/DTEC audit, and IFRS accounting guides by FTA-Registered Tax Agents in Dubai & Sharjah.",
        canonicalPath: "/blogs",
        ogType: "website",
      });
      return;
    }

    const canonicalPath = `/blog/${post.id}`;
    const canonicalUrl = `https://diasuae.ae${canonicalPath}`;
    const ogImagePath = `/api/og/blog/${post.id}`;
    const publishedIso = toIsoDate(post.publishedIso || post.date);

    applyPageSEO({
      title: `${post.title} | Dias Accounting`,
      description: post.summary,
      canonicalPath,
      ogType: "article",
      ogImage: ogImagePath,
      keywords:
        post.keywords && post.keywords.length > 0
          ? post.keywords.join(", ")
          : `UAE tax guide, ${post.tag}, corporate tax Dubai, FTA compliance, ${post.title.toLowerCase()}`,
    });

    upsertJsonLd("schema-blog-detail", {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BlogPosting",
          "@id": `${canonicalUrl}#blogposting`,
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": canonicalUrl,
          },
          headline: post.title,
          description: post.summary,
          image: post.imageUrl
            ? post.imageUrl.startsWith("http")
              ? post.imageUrl
              : `https://diasuae.ae${post.imageUrl.startsWith("/") ? "" : "/"}${post.imageUrl}`
            : `https://diasuae.ae${ogImagePath}`,
          datePublished: publishedIso,
          dateModified: publishedIso,
          author: {
            "@type": "Person",
            name: post.author?.name || "Glen Dias",
            jobTitle: post.author?.role || "Managing Director & FTA Registered Tax Agent",
            worksFor: {
              "@type": "Organization",
              name: "Dias Accounting & Tax Consulting LLC",
            },
          },
          publisher: {
            "@type": "Organization",
            name: "Dias Accounting & Tax Consulting LLC",
            url: "https://diasuae.ae",
            logo: {
              "@type": "ImageObject",
              url: "https://diasuae.ae/icon-192.png",
            },
          },
        },
        {
          "@type": "BreadcrumbList",
          "@id": `${canonicalUrl}#breadcrumb`,
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://diasuae.ae/" },
            { "@type": "ListItem", position: 2, name: "Insights & Blogs", item: "https://diasuae.ae/blogs" },
            { "@type": "ListItem", position: 3, name: post.title, item: canonicalUrl },
          ],
        },
      ],
    });

    return () => {
      removeJsonLd("schema-blog-detail");
    };
  }, [post]);

  // Select up to 3 related articles (matching tag first, then latest)
  const relatedPosts = useMemo(() => {
    if (!post) return blogsData.slice(0, 3);
    const others = combinedPool.filter((item) => item.id !== post.id && !item.id.startsWith("draft-"));
    const tagLower = (post.tag || "").toLowerCase();
    const sameTopic = others.filter((item) => (item.tag || "").toLowerCase().includes(tagLower.split(" ")[0] || ""));
    const remainder = others.filter((item) => !sameTopic.includes(item));
    return [...sameTopic, ...remainder].slice(0, 3);
  }, [post, combinedPool]);

  const handleCopyShareLink = async () => {
    if (!post || typeof window === "undefined") return;
    const shareUrl = `https://diasuae.ae/blog/${post.id}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    } catch {
      // Fallback ignored silently
    }
  };

  const authorInitials = (post?.author?.name || "Glen Dias")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const isHtmlContent = Boolean(
    post?.content &&
      (post.content.trim().startsWith("<") || post.content.includes("</div>") || post.content.includes("</p>"))
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased selection:bg-gold-500/30 selection:text-navy-950">
      <PageNavigation
        currentPath={post ? `/blog/${post.id}` : `/blog/${blogSlug}`}
        onNavigate={onNavigate}
        onOpenAudit={onOpenAudit}
      />

      <main id="main-content">
        {loadingRemote ? (
          <section className="bg-[#070d19] text-white py-28">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
              <div className="w-10 h-10 border-2 border-[#c5a059] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm text-slate-300 font-medium">Loading regulatory briefing...</p>
            </div>
          </section>
        ) : !post ? (
          <section className="bg-[#070d19] text-white py-24 border-b border-[#c5a059]/20">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
              <BookOpen className="w-12 h-12 text-[#c5a059] mx-auto" />
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
                Article Not Found
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                The briefing you requested may have moved or been updated. Explore all UAE Corporate Tax, 5% VAT, and IFRS accounting guides in our insights archive.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate("/blogs")}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#c5a059] hover:bg-[#dec18c] text-[#070d19] font-display font-bold text-sm transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Browse All Blog Articles</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate("/")}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/20 text-white hover:border-[#c5a059] hover:text-[#c5a059] font-display font-semibold text-sm transition-colors cursor-pointer"
                >
                  <span>Return Home</span>
                </button>
              </div>
            </div>
          </section>
        ) : (
          <>
            {/* Editorial Dark Navy Hero */}
            <header className="relative bg-[#070d19] text-white pt-10 pb-14 lg:pt-14 lg:pb-16 border-b border-[#c5a059]/25 overflow-hidden">
              <div className="absolute -top-28 right-0 w-[460px] h-[460px] bg-[#c5a059]/8 rounded-full blur-3xl pointer-events-none" />
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Breadcrumb Navigation */}
                <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mb-6">
                  <button
                    type="button"
                    onClick={() => onNavigate("/")}
                    className="hover:text-[#c5a059] transition-colors cursor-pointer"
                  >
                    Home
                  </button>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                  <button
                    type="button"
                    onClick={() => onNavigate("/blogs")}
                    className="hover:text-[#c5a059] transition-colors cursor-pointer"
                  >
                    Insights &amp; Blogs
                  </button>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                  <span className="text-[#c5a059] font-medium truncate max-w-[260px] sm:max-w-md">
                    {post.tag}
                  </span>
                </nav>

                <div className="max-w-4xl space-y-5">
                  {/* Unboxed Metadata Row (Zero-Pill Discipline) */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs sm:text-[13px] text-slate-300 font-medium">
                    <span className="text-[#c5a059] font-semibold tracking-wide">{post.tag}</span>
                    <span className="text-slate-600" aria-hidden="true">·</span>
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#c5a059]" />
                      {post.date}
                    </span>
                    <span className="text-slate-600" aria-hidden="true">·</span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#c5a059]" />
                      {post.readTime}
                    </span>
                  </div>

                  {/* Single Semantic H1 */}
                  <h1 className="font-display text-2xl sm:text-4xl lg:text-[2.65rem] font-extrabold text-white leading-[1.18] tracking-tight text-balance">
                    {post.title}
                  </h1>

                  {post.summary && (
                    <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-3xl">
                      {post.summary}
                    </p>
                  )}

                  {/* Author Bar & Share Action */}
                  <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#0d1b2a] border border-[#c5a059]/40 text-[#c5a059] font-mono text-xs font-bold flex items-center justify-center shrink-0">
                        {authorInitials}
                      </div>
                      <div className="leading-snug">
                        <div className="text-sm font-bold text-white">
                          {post.author?.name || "Glen Dias"}
                        </div>
                        <div className="text-xs text-slate-400">
                          {post.author?.role || "Managing Director & FTA Registered Tax Agent"}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={handleCopyShareLink}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0d1b2a] hover:bg-white/10 border border-white/15 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
                      >
                        {copiedLink ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Link Copied</span>
                          </>
                        ) : (
                          <>
                            <Share2 className="w-3.5 h-3.5 text-[#c5a059]" />
                            <span>Copy Article Link</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => onNavigate("/blogs")}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#c5a059]/40 text-[#c5a059] hover:bg-[#c5a059] hover:text-[#070d19] text-xs font-bold transition-colors cursor-pointer"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>All Blogs</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            {/* Main Reading Layout: 8-Col Article Body + 4-Col Executive Sidebar */}
            <section className="py-10 lg:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                {/* Article Column */}
                <article className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 lg:p-10 shadow-xs space-y-6">
                  {/* Featured Image if local/present */}
                  {post.imageUrl && post.imageUrl.startsWith("/") && (
                    <div className="rounded-xl overflow-hidden border border-slate-200 bg-[#070d19]">
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        referrerPolicy="no-referrer"
                        className="w-full max-h-[420px] object-cover"
                      />
                    </div>
                  )}

                  {/* Above-the-Fold Instant Advisor & Tax Calculator Strip */}
                  <BlogInstantAdvisorStrip onNavigate={onNavigate} />

                  {/* Grounded Trends Banner */}
                  {post.sourceTrends && post.sourceTrends.length > 0 && (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <Globe className="w-4 h-4 text-emerald-700" />
                        <span className="text-xs font-bold uppercase tracking-wider text-navy-950">
                          Current UAE Regulatory Context
                        </span>
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-slate-600">
                        {post.sourceTrends.map((trend, idx) => (
                          <li key={idx} className="leading-normal">
                            {trend}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Official Video Broadcast Player */}
                  {post.videoUrl && (
                    <div className="rounded-xl overflow-hidden border border-slate-200 bg-[#070d19]">
                      <div className="bg-[#0d1b2a] px-4 py-3 border-b border-white/10 flex items-center justify-between gap-2">
                        <span className="text-xs font-display font-bold text-white tracking-wide">
                          {post.videoTitle || "Executive Video Briefing | Glen Dias"}
                        </span>
                        <span className="text-[11px] font-mono text-[#c5a059]">
                          Official Broadcast
                        </span>
                      </div>
                      <div className="p-3 sm:p-4 bg-slate-950/70">
                        <video
                          src={post.videoUrl}
                          controls
                          playsInline
                          preload="metadata"
                          className="w-full max-h-[460px] rounded-lg bg-black object-contain mx-auto"
                        />
                      </div>
                    </div>
                  )}

                  {/* LinkedIn Executive Presentation Slides Card */}
                  {post.slidesUrl && (
                    <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-[#c5a059]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-xl bg-[#070d19] text-[#c5a059] flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs text-slate-500 font-medium">
                            Executive Slide Deck (PDF)
                          </div>
                          <h2 className="font-display text-sm sm:text-base font-bold text-navy-950 mt-0.5">
                            {post.slidesTitle || "UAE Tax & IFRS Compliance Presentation"}
                          </h2>
                        </div>
                      </div>
                      <a
                        href={post.slidesUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#070d19] hover:bg-[#0d1b2a] text-white font-display font-semibold text-xs transition-colors shrink-0"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-[#c5a059]" />
                        <span>View Slides (PDF)</span>
                      </a>
                    </div>
                  )}

                  {/* Editorial Body */}
                  <div className="text-[15px] sm:text-base leading-[1.75] text-slate-700 pt-2">
                    {isHtmlContent ? (
                      <div
                        className="article-body space-y-4 [&>p]:mb-4 [&>p]:leading-relaxed [&>h2]:text-xl [&>h2]:sm:text-2xl [&>h2]:font-bold [&>h2]:text-navy-950 [&>h2]:mt-8 [&>h2]:mb-3 [&>h3]:text-lg [&>h3]:font-bold [&>h3]:text-navy-950 [&>h3]:mt-6 [&>h3]:mb-2 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-1.5 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:space-y-1.5 [&>a]:text-gold-600 [&>a]:underline [&>table]:w-full [&>table]:border-collapse [&>table]:my-5 [&>table_th]:border [&>table_th]:p-2.5 [&>table_th]:bg-slate-100 [&>table_td]:border [&>table_td]:p-2.5 [&>img]:rounded-xl [&>img]:my-5"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                      />
                    ) : (
                      <ArticleContentRenderer content={post.content} />
                    )}
                  </div>

                  {/* General Information Disclaimer */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-xs leading-relaxed flex items-start gap-2.5 mt-8">
                    <AlertCircle className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
                    <p>
                      <strong>Regulatory Notice:</strong> This briefing provides general UAE tax and accounting guidance current at publication and does not replace formal entity-specific FTA tax advice. Consult an FTA-Registered Tax Agent before filing elections or restructurings.
                    </p>
                  </div>

                  {/* Keywords Text Row (Unboxed) */}
                  {post.keywords && post.keywords.length > 0 && (
                    <div className="pt-5 border-t border-slate-200 text-xs text-slate-500 leading-relaxed">
                      <span className="font-semibold text-navy-950 mr-2">Topics Covered:</span>
                      {post.keywords.map((kw) => kw.replace(/^[#*]+/, "")).join(" · ")}
                    </div>
                  )}

                  {/* End-of-Article Conversion Banner */}
                  <div className="bg-[#070d19] border border-[#c5a059]/35 rounded-2xl p-6 sm:p-7 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 mt-8">
                    <div className="space-y-1.5 max-w-lg">
                      <span className="text-[11px] font-mono text-[#c5a059] font-bold tracking-wider uppercase block">
                        FTA-Registered Tax Agency · Dubai &amp; Sharjah
                      </span>
                      <h2 className="font-display text-lg sm:text-xl font-bold text-white">
                        Need help applying this to your UAE entity?
                      </h2>
                      <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                        Book a free 15-minute review with Glen Dias for fixed-fee IFRS bookkeeping, 5% VAT Form 201, or 9% Corporate Tax compliance starting from AED 400/mo.
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto shrink-0">
                      <a
                        href={`https://wa.me/971529226958?text=${encodeURIComponent(
                          `Hello Glen Dias, I just read "${post.title}" on diasuae.ae and would like a free 15-minute consultation.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#c5a059] hover:bg-[#dec18c] text-[#070d19] font-display font-bold text-xs sm:text-sm transition-colors whitespace-nowrap"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Book Free Review</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => onNavigate("/pricing")}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl border border-white/20 hover:border-[#c5a059] text-white hover:text-[#c5a059] font-display font-semibold text-xs sm:text-sm transition-colors whitespace-nowrap cursor-pointer"
                      >
                        <span>View Packages</span>
                      </button>
                    </div>
                  </div>
                </article>

                {/* Right Sticky Sidebar */}
                <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
                  {/* Direct Advisory Card */}
                  <div className="bg-[#0d1b2a] border border-[#c5a059]/35 rounded-2xl p-6 text-white space-y-4">
                    <div className="flex items-center gap-2 text-xs font-mono text-[#c5a059] font-bold uppercase tracking-wider">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Direct Tax Agent Desk</span>
                    </div>
                    <h2 className="font-display text-lg font-bold text-white leading-snug">
                      Speak With an FTA-Registered Tax Agent
                    </h2>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Zero hidden hourly fees. Monthly IFRS bookkeeping, quarterly 5% VAT filings, and annual 9% Corporate Tax returns starting from AED 400/month.
                    </p>
                    <div className="space-y-2.5 pt-1">
                      <a
                        href={`https://wa.me/971529226958?text=${encodeURIComponent(
                          `Hello Dias Accounting, I am reading "${post.title}" and need UAE tax advisory.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 px-4 rounded-xl bg-[#c5a059] hover:bg-[#dec18c] text-[#070d19] font-display font-bold text-xs uppercase tracking-wide transition-colors flex items-center justify-center gap-2"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>WhatsApp Tax Desk</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => onNavigate("/contact")}
                        className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-display font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <PhoneCall className="w-3.5 h-3.5 text-[#c5a059]" />
                        <span>Schedule Consultation</span>
                      </button>
                    </div>
                  </div>

                  {/* Quick Interactive Tools Card */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
                    <h3 className="font-display text-sm font-bold text-navy-950 uppercase tracking-wider">
                      Free UAE Tax Tools
                    </h3>
                    <div className="space-y-2.5">
                      <button
                        type="button"
                        onClick={() => onNavigate("/uae-tax-planner")}
                        className="w-full p-3.5 rounded-xl border border-slate-200 hover:border-[#c5a059] bg-slate-50/70 hover:bg-white text-left transition-colors flex items-center justify-between gap-3 cursor-pointer group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Calculator className="w-4 h-4 text-[#c5a059] shrink-0" />
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-navy-950 group-hover:text-gold-600 truncate">
                              2026 Corporate Tax &amp; VAT Calculator
                            </div>
                            <div className="text-[11px] text-slate-500">
                              Test 0% SBR, 0% QFZP &amp; 9% liability
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#c5a059] shrink-0" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onNavigate("/pricing")}
                        className="w-full p-3.5 rounded-xl border border-slate-200 hover:border-[#c5a059] bg-slate-50/70 hover:bg-white text-left transition-colors flex items-center justify-between gap-3 cursor-pointer group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <FileText className="w-4 h-4 text-[#c5a059] shrink-0" />
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-navy-950 group-hover:text-gold-600 truncate">
                              Fixed-Fee Accounting Packages
                            </div>
                            <div className="text-[11px] text-slate-500">
                              Transparent retainers from AED 400/mo
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#c5a059] shrink-0" />
                      </button>
                    </div>
                  </div>

                  {/* Back to Archive */}
                  <button
                    type="button"
                    onClick={() => onNavigate("/blogs")}
                    className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-navy-950 font-display font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 text-[#c5a059]" />
                    <span>Back to All Tax &amp; Accounting Blogs</span>
                  </button>
                </aside>
              </div>
            </section>

            {/* Related Articles Section (Dedicated Page Links) */}
            {relatedPosts.length > 0 && (
              <section className="py-14 bg-white border-t border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                    <div>
                      <span className="text-xs font-mono text-[#c5a059] font-bold uppercase tracking-wider block mb-1">
                        Continue Reading
                      </span>
                      <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy-950">
                        Related UAE Tax &amp; Compliance Guides
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => onNavigate("/blogs")}
                      className="inline-flex items-center gap-1.5 text-xs font-display font-bold text-navy-950 hover:text-gold-600 transition-colors cursor-pointer"
                    >
                      <span>View All Insights</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
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
                        className="bg-slate-50/70 hover:bg-white rounded-2xl border border-slate-200 hover:border-[#c5a059] p-6 transition-all flex flex-col justify-between group no-underline"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span className="font-semibold text-gold-700">{related.tag}</span>
                            <span aria-hidden="true">·</span>
                            <span>{related.readTime}</span>
                          </div>
                          <h3 className="font-display font-bold text-base text-navy-950 group-hover:text-gold-600 transition-colors line-clamp-2 leading-snug">
                            {related.title}
                          </h3>
                          <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                            {related.summary}
                          </p>
                        </div>
                        <span className="mt-5 pt-3 border-t border-slate-200/80 text-xs font-display font-bold text-navy-950 group-hover:text-gold-600 flex items-center gap-1.5">
                          <span>Read Full Article</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </>
        )}
      </main>

      <TaxToolsPromoBanner onNavigate={onNavigate} />

      <PageFooter
        onNavigate={onNavigate}
        onOpenPrivacy={onOpenPrivacy}
        onOpenGooglePreferred={onOpenGooglePreferred}
      />
    </div>
  );
};

export default BlogDetailPage;

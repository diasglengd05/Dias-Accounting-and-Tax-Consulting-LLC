import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, BookOpen, ExternalLink, FileText } from "lucide-react";
import PageNavigation from "../components/PageNavigation";
import PageFooter from "../components/PageFooter";
import ArticleContentRenderer from "../components/ArticleContentRenderer";
import ArticleLayout from "../components/editorial/ArticleLayout";
import { blogsData } from "../data/blogsData";
import { draftPlaceholderPosts } from "../data/blogDrafts";
import { BlogPost } from "../types";
import {
  applyPageSEO,
  buildBlogPostingSchema,
  buildBreadcrumbSchema,
  removeJsonLd,
  upsertJsonLd,
} from "../lib/seo";

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
  const normalized = slug
    .replace(/\.(html|php|aspx)$/i, "")
    .replace(/\/+$/, "")
    .trim()
    .toLowerCase();
  if (!normalized) return null;
  return (
    pool.find((b) => b.id.toLowerCase() === normalized) ||
    pool.find(
      (b) =>
        b.id.toLowerCase().startsWith(normalized) ||
        normalized.startsWith(b.id.toLowerCase())
    ) ||
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

  const localPost = useMemo(
    () => findBlogBySlug(blogSlug, combinedPool),
    [blogSlug, combinedPool]
  );
  const post = localPost || fetchedBlog;

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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });

    if (!post) {
      applyPageSEO({
        title: "Article Not Found | UAE Tax Insights | Dias Accounting",
        description:
          "Browse authoritative UAE Corporate Tax, 5% VAT, DIFC/DTEC audit, and IFRS accounting guides by FTA-Registered Tax Agents in Dubai & Sharjah.",
        canonicalPath: "/blog",
        ogType: "website",
      });
      return;
    }

    const canonicalPath = `/blog/${post.id}`;
    const canonicalUrl = `https://diasuae.ae${canonicalPath}`;
    const publishedIso = toIsoDate(post.publishedIso || post.date);
    const resolvedPostImage =
      post.imageUrl && post.imageUrl.trim()
        ? post.imageUrl.startsWith("http")
          ? post.imageUrl
          : `https://diasuae.ae${post.imageUrl.startsWith("/") ? "" : "/"}${post.imageUrl}`
        : undefined;

    applyPageSEO({
      title: `${post.title} | Dias Accounting`,
      description: post.summary,
      canonicalPath,
      ogType: "article",
      ogImage: resolvedPostImage,
      ogImageAlt: post.title,
      publishedTime: publishedIso,
      modifiedTime: publishedIso,
      authorName: post.author?.name || "Glen Dias",
      articleSection: post.tag || "UAE Tax & Accounting",
      keywords:
        post.keywords && post.keywords.length > 0
          ? post.keywords.join(", ")
          : `UAE tax guide, ${post.tag}, corporate tax Dubai, FTA compliance`,
    });

    upsertJsonLd(
      "page-article-jsonld",
      buildBlogPostingSchema({
        headline: post.title,
        description: post.summary,
        canonicalPath,
        datePublished: publishedIso,
        dateModified: publishedIso,
        image: resolvedPostImage,
        authorName: post.author?.name,
        authorRole: post.author?.role,
        articleSection: post.tag,
        keywords: post.keywords,
      })
    );

    upsertJsonLd(
      "page-breadcrumb-jsonld",
      buildBreadcrumbSchema(
        [
          { name: "Home", path: "/" },
          { name: "Insights", path: "/blog" },
          { name: post.title, path: canonicalPath },
        ],
        `${canonicalUrl}#breadcrumb`
      )
    );

    return () => {
      removeJsonLd("page-article-jsonld");
      removeJsonLd("page-breadcrumb-jsonld");
    };
  }, [post]);

  const relatedPosts = useMemo(() => {
    if (!post) return blogsData.slice(0, 3);
    const others = combinedPool.filter(
      (item) => item.id !== post.id && !item.id.startsWith("draft-")
    );
    const tagLower = (post.tag || "").toLowerCase();
    const sameTopic = others.filter((item) =>
      (item.tag || "").toLowerCase().includes(tagLower.split(" ")[0] || "")
    );
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
      // Ignore clipboard failures silently
    }
  };

  const isHtmlContent = Boolean(
    post?.content &&
      (post.content.trim().startsWith("<") ||
        post.content.includes("</div>") ||
        post.content.includes("</p>"))
  );

  return (
    <div className="min-h-screen bg-[#FFFFFF] font-sans text-[#0D1B2A] antialiased">
      <PageNavigation
        currentPath={post ? `/blog/${post.id}` : `/blog/${blogSlug}`}
        onNavigate={onNavigate}
        onOpenAudit={onOpenAudit}
      />

      <main id="main-content">
        {loadingRemote ? (
          <section className="bg-[#FFFFFF] py-28">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
              <div className="w-8 h-8 border-2 border-[#1B4332] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm text-[#475569] font-medium">
                Loading regulatory briefing...
              </p>
            </div>
          </section>
        ) : !post ? (
          <section className="bg-[#FFFFFF] py-24 border-b border-[#E2E8F0]">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
              <BookOpen className="w-10 h-10 text-[#C5A059] mx-auto" />
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#0D1B2A] tracking-tight">
                Article Not Found
              </h1>
              <p className="text-sm sm:text-base text-[#475569] leading-[1.65]">
                The briefing you requested may have moved or been updated. Explore all UAE Corporate Tax, 5% VAT, and IFRS accounting guides in our insights archive.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate("/blog")}
                  className="min-h-[46px] inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1B4332] hover:bg-[#143326] text-white text-sm font-semibold transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Browse All Insights</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate("/")}
                  className="min-h-[46px] inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-[#E2E8F0] text-[#0D1B2A] hover:bg-[#F8FAFC] text-sm font-semibold transition-colors cursor-pointer"
                >
                  <span>Return Home</span>
                </button>
              </div>
            </div>
          </section>
        ) : (
          <ArticleLayout
            articlePath={`/blog/${post.id}`}
            category={post.tag}
            title={post.title}
            summary={post.summary}
            authorName={post.author?.name || "Glen Dias"}
            authorRole={
              post.author?.role || "Managing Director & FTA Registered Tax Agent"
            }
            date={post.date}
            readTime={post.readTime}
            copiedLink={copiedLink}
            onCopyShareLink={handleCopyShareLink}
            onNavigate={onNavigate}
            keywords={post.keywords}
            relatedPosts={relatedPosts}
          >
            {/* Optional Featured Local Image */}
            {post.imageUrl && post.imageUrl.startsWith("/") && (
              <figure className="rounded-2xl overflow-hidden border border-[#E2E8F0] bg-[#F8FAFC] aspect-[16/9]">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  loading="eager"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </figure>
            )}

            {/* Key Regulatory Context Callout (if present) */}
            {post.sourceTrends && post.sourceTrends.length > 0 && (
              <aside className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] border-l-[3px] border-l-[#C5A059] p-5 sm:p-6">
                <p className="font-display text-sm font-bold text-[#0D1B2A] mb-2">
                  Key UAE Regulatory Context
                </p>
                <ul className="space-y-1.5 text-sm text-[#475569] leading-[1.6] list-disc pl-5">
                  {post.sourceTrends.map((trend, idx) => (
                    <li key={idx}>{trend}</li>
                  ))}
                </ul>
              </aside>
            )}

            {/* Optional Official Video Briefing */}
            {post.videoUrl && (
              <div className="rounded-2xl overflow-hidden border border-[#E2E8F0] bg-[#0D1B2A]">
                <div className="px-5 py-3.5 border-b border-white/10 flex items-center justify-between gap-2">
                  <span className="text-xs sm:text-sm font-semibold text-white">
                    {post.videoTitle || "Executive Video Briefing | Glen Dias"}
                  </span>
                  <span className="text-xs text-[#C5A059] font-medium shrink-0">
                    Briefing
                  </span>
                </div>
                <div className="p-3 sm:p-4 bg-black">
                  <video
                    src={post.videoUrl}
                    controls
                    playsInline
                    preload="metadata"
                    className="w-full max-h-[440px] rounded-lg object-contain mx-auto"
                  />
                </div>
              </div>
            )}

            {/* Optional Presentation Slide Deck Link */}
            {post.slidesUrl && (
              <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] text-[#0D1B2A] flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-[#64748B] font-medium">
                      Executive Slide Deck (PDF)
                    </p>
                    <p className="font-display text-sm sm:text-base font-bold text-[#0D1B2A]">
                      {post.slidesTitle || "UAE Tax & IFRS Compliance Presentation"}
                    </p>
                  </div>
                </div>
                <a
                  href={post.slidesUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#0D1B2A] hover:bg-[#1B4332] text-white text-xs sm:text-sm font-semibold transition-colors shrink-0"
                >
                  <span>View PDF</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            {/* Focused Editorial Body */}
            <div className="pt-2">
              {isHtmlContent ? (
                <div
                  className="article-body text-[15px] sm:text-base leading-[1.7] text-[#475569] space-y-4 [&>p]:mb-4 [&>h2]:font-display [&>h2]:text-xl [&>h2]:sm:text-2xl [&>h2]:font-bold [&>h2]:text-[#0D1B2A] [&>h2]:mt-10 [&>h2]:mb-3.5 [&>h3]:font-display [&>h3]:text-lg [&>h3]:font-bold [&>h3]:text-[#0D1B2A] [&>h3]:mt-7 [&>h3]:mb-2.5 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-2 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:space-y-2 [&>a]:text-[#1B4332] [&>a]:underline [&>blockquote]:rounded-xl [&>blockquote]:bg-[#F8FAFC] [&>blockquote]:border [&>blockquote]:border-[#E2E8F0] [&>blockquote]:border-l-[3px] [&>blockquote]:border-l-[#C5A059] [&>blockquote]:p-5 [&>blockquote]:my-6 [&>table]:w-full [&>table]:border-collapse [&>table]:my-7 [&>table]:text-sm [&>table_th]:bg-[#0D1B2A] [&>table_th]:text-white [&>table_th]:p-3.5 [&>table_th]:text-left [&>table_td]:border-b [&>table_td]:border-[#E2E8F0] [&>table_td]:p-3.5 [&>img]:rounded-2xl [&>img]:border [&>img]:border-[#E2E8F0] [&>img]:my-6"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              ) : (
                <ArticleContentRenderer content={post.content} onNavigate={onNavigate} />
              )}
            </div>
          </ArticleLayout>
        )}
      </main>

      <PageFooter
        onNavigate={onNavigate}
        onOpenPrivacy={onOpenPrivacy}
        onOpenGooglePreferred={onOpenGooglePreferred}
      />
    </div>
  );
};

export default BlogDetailPage;
